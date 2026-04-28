"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, signInWithPopup, createUserWithEmailAndPassword } from "firebase/auth";
import { auth, googleProvider, db } from "@/lib/auth";
import { doc, setDoc } from "firebase/firestore";
import Link from "next/link";

interface AuthFormProps {
  mode: "login" | "register";
}

export default function AuthForm({ mode }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "login") {
        await signInWithEmailAndPassword(auth, email, password);
        router.push("/dashboard");
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Create user document in Firestore
        await setDoc(doc(db, "users", userCredential.user.uid), {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          role: "student",
          createdAt: new Date().toISOString(),
        });
        router.push("/dashboard");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to authenticate.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError("");
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      // For Google login, check if user exists or we should just setDoc with merge: true
      await setDoc(doc(db, "users", result.user.uid), {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
        role: "student",
        createdAt: new Date().toISOString(),
      }, { merge: true });
      router.push("/dashboard");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to authenticate with Google.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-grow flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary opacity-10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-secondary opacity-10 rounded-full blur-3xl"></div>
      
      <div className="w-full max-w-[420px] relative z-10">
        <div className="mb-10 text-center">
          <h1 className="font-headline text-4xl font-extrabold text-foreground tracking-tight mb-3">
            Master the Craft.
          </h1>
          <p className="text-muted-foreground text-sm max-w-xs mx-auto leading-relaxed">
            Join artisans learning the delicate balance of code and design.
          </p>
        </div>
        
        <div className="bg-card rounded-[2rem] p-8 sm:p-10 flex flex-col gap-8 shadow-xl shadow-foreground/5 border-none">
          <div className="flex p-[6px] bg-secondary/50 rounded-2xl">
            <Link 
              href="/login"
              className={`flex-1 py-2.5 px-4 rounded-xl font-headline font-bold text-sm transition-all duration-300 text-center ${mode === 'login' ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground/70 hover:text-foreground'}`}
            >
              Login
            </Link>
            <Link 
              href="/register"
              className={`flex-1 py-2.5 px-4 rounded-xl font-headline font-bold text-sm transition-all duration-300 text-center ${mode === 'register' ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground/70 hover:text-foreground'}`}
            >
              Sign Up
            </Link>
          </div>
          
          <form className="space-y-6" onSubmit={handleEmailAuth}>
            {error && (
              <div className="bg-destructive/10 text-destructive p-3 rounded-2xl text-sm text-center">
                {error}
              </div>
            )}
            <div className="space-y-2.5">
              <label className="text-[11px] font-extrabold uppercase tracking-widest text-muted-foreground/80 ml-2">
                Email Address
              </label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-secondary/60 border-none rounded-2xl px-6 py-4 text-foreground placeholder:text-muted-foreground/50 focus:ring-2 focus:ring-primary/30 transition-all duration-300 outline-none" 
                placeholder="name@example.com"
              />
            </div>
            
            <div className="space-y-2.5">
              <div className="flex justify-between items-center ml-2 mr-2">
                <label className="text-[11px] font-extrabold uppercase tracking-widest text-muted-foreground/80">
                  Password
                </label>
                {mode === "login" && (
                  <Link href="/forgot-password" className="text-[11px] uppercase tracking-wider text-primary font-bold hover:underline">
                    Forgot?
                  </Link>
                )}
              </div>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-secondary/60 border-none rounded-2xl px-6 py-4 text-foreground placeholder:text-muted-foreground/50 focus:ring-2 focus:ring-primary/30 transition-all duration-300 outline-none" 
                placeholder="••••••••"
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary text-primary-foreground font-headline font-bold py-4 mt-2 rounded-2xl text-[15px] shadow-[0_8px_20px_rgba(0,136,255,0.25)] hover:bg-primary/90 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50"
            >
              {loading ? "Please wait..." : (mode === "login" ? "Login to Academy" : "Create Account")}
            </button>
          </form>
          
          <div className="relative flex items-center gap-4 py-1">
            <div className="flex-grow h-[1px] bg-border/50"></div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">or continue with</span>
            <div className="flex-grow h-[1px] bg-border/50"></div>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            <button 
              type="button"
              onClick={handleGoogleAuth}
              disabled={loading}
              className="flex items-center justify-center py-4 px-4 bg-secondary/60 rounded-2xl hover:bg-secondary/80 transition-colors duration-300 group disabled:opacity-50"
            >
              <span className="text-[17px] font-display font-medium tracking-[0.2em] text-muted-foreground/70 uppercase">Google</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
