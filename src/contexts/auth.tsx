"use client";

import React, { createContext, useState, ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export interface User {
  name: string;
  email: string;
  image: string;
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
    // Simulate checking for an existing session
    const session = localStorage.getItem("mermaid-user-session");
    if (session) {
      try {
        setUser(JSON.parse(session));
      } catch (e) {
        localStorage.removeItem("mermaid-user-session");
      }
    }
    setLoading(false);
  }, []);

  const signIn = () => {
    const avatar = PlaceHolderImages.find((img) => img.id === "user-avatar");
    const dummyUser: User = {
      name: "Alex Doe",
      email: "alex.doe@example.com",
      image: avatar
        ? avatar.imageUrl
        : "https://picsum.photos/seed/user/100/100",
    };
    localStorage.setItem("mermaid-user-session", JSON.stringify(dummyUser));
    setUser(dummyUser);
    router.push("/viz");
  };

  const signOut = () => {
    localStorage.removeItem("mermaid-user-session");
    setUser(null);
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
