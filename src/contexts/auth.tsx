"use client";

import React, { createContext, useState, ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  User as FirebaseUser
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { logUserActivity } from "@/lib/logging";

export interface User {
  uid: string;
  name: string | null;
  email: string | null;
  image: string | null;
}

interface AuthContextType {
  user: User | null;
  signIn: () => void;
  signOut: () => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const { uid, displayName, email, photoURL } = firebaseUser;
        const userPayload: User = {
          uid: uid,
          name: displayName,
          email: email,
          image: photoURL,
        };
        setUser(userPayload);
        localStorage.setItem("mermaid-user-session", JSON.stringify(userPayload));
        // Only log session start if we just authenticated (could add better session tracking later)
        // For now, let's log it here.
        logUserActivity(uid, 'session_start', { email });
        
        // Only push to viz if we are on the home page (basic check to avoid redirect loops or overriding explicit nav)
        if (window.location.pathname === '/') {
             router.push("/viz");
        }
      } else {
        setUser(null);
        localStorage.removeItem("mermaid-user-session");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const signIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // The onAuthStateChanged will handle the state update and logging
    } catch (error) {
      console.error("Error signing in with Google", error);
      logUserActivity(undefined, 'error_sign_in', { error: String(error) });
    }
  };

  const signOut = async () => {
    try {
      if (user?.uid) {
        logUserActivity(user.uid, 'session_end');
      }
      await auth.signOut();
      router.push("/");
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
