import { NextResponse } from "next/server";
import Stripe from "stripe";

// Initialize Stripe with the secret key from env
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia" as any, // latest stable or type assertion to bypass ts version errors if any
});

export async function POST(req: Request) {
  try {
    const { courseId, courseTitle, coursePrice, courseThumbnail, userId } = await req.json();

    if (!courseId || !courseTitle || !coursePrice || !userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const origin = req.headers.get("origin") || "http://localhost:3000";

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: courseTitle,
              images: courseThumbnail ? [courseThumbnail] : [],
            },
            unit_amount: Math.round(coursePrice * 100), // Stripe expects cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/courses/${courseId}?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/courses/${courseId}?canceled=true`,
      metadata: {
        courseId,
        userId,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe Checkout Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
