"use client";

import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Code, LogIn, LogOut } from "lucide-react";
import type { User } from "@/contexts/auth";
import Image from "next/image";
import logo from "@/public/logo.png";

export default function Header() {
  const { user, signIn, signOut } = useAuth();

  return (
    <header className="flex h-16 items-center justify-between border-b bg-card px-4 sm:px-6 shrink-0">
      <div className="flex items-center gap-3">
        <Image src={logo} alt="logo" width={32} height={32} />
        <h1 className="text-xl font-bold tracking-tight font-headline">Mermaid Cloud Viz</h1>
      </div>
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.image} alt={user.name} data-ai-hint="person portrait" />
                <AvatarFallback>
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signOut} className="cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button onClick={signIn}>
          <LogIn className="mr-2 h-4 w-4" />
          Login
        </Button>
      )}
    </header>
  );
}
