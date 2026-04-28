"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { auth, db } from "@/lib/auth";
import { doc, getDoc } from "firebase/firestore";
import { User } from "@/types";

interface AuthContextType {
  user: FirebaseUser | null;
  dbUser: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  dbUser: null,
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [dbUser, setDbUser] = useState<User | null>(null);
  // Start as true — Firebase MUST confirm auth state before we trust "no user"
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // onAuthStateChanged is Firebase's authoritative auth state.
    // It fires once on load (with null if not logged in, or User if session exists),
    // and again whenever login/logout happens.
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      //console.log("AuthStateChanged:", firebaseUser);
      setUser(firebaseUser);

      if (firebaseUser) {
        // Try fetching Firestore profile — best effort, won't block auth
        try {
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          if (userDoc.exists()) {
            setDbUser(userDoc.data() as User);
          } else {
            setDbUser(null);
          }
        } catch (error) {
          // Firestore rules may deny access — that's okay, we still have the Firebase user
          console.warn("Could not load Firestore profile (check security rules):", error);
          setDbUser(null);
        }
      } else {
        setDbUser(null);
      }

      // Only set loading to false AFTER Firebase has confirmed auth state
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, dbUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
