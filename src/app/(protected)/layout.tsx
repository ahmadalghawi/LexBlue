import AuthGuard from "@/components/auth/AuthGuard";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <Navbar />
      <div className="flex min-h-screen bg-muted/20">
        <main className="flex-grow">{children}</main>
      </div>
      <Footer />
    </AuthGuard>
  );
}
