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

export interface User {
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
        const { displayName, email, photoURL } = firebaseUser;
        const userPayload: User = {
          name: displayName,
          email: email,
          image: photoURL,
        };
        setUser(userPayload);
        localStorage.setItem("mermaid-user-session", JSON.stringify(userPayload));
        router.push("/viz");
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
    } catch (error) {
      console.error("Error signing in with Google", error);
    }
  };

  const signOut = async () => {
    try {
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
