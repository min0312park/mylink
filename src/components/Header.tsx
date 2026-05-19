"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LayoutDashboard, LogOut, Eye, BarChart2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export function Header() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast.success("로그인되었습니다.");
    } catch (error) {
      console.error("Login failed: ", error);
      toast.error("로그인에 실패했습니다.");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("로그아웃되었습니다.");
    } catch (error) {
      console.error("Logout failed: ", error);
      toast.error("로그아웃에 실패했습니다.");
    }
  };

  return (
    <header className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between max-w-3xl">
        <Link href="/" className="font-bold text-lg tracking-tight hover:text-primary transition-colors">
          MyLink
        </Link>
        <div>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full transition-transform active:scale-95">
                  <Avatar className="h-9 w-9 border border-border shadow-sm">
                    <AvatarImage src={user.photoURL || ""} alt={user.displayName || "User avatar"} />
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {user.email ? user.email.charAt(0).toUpperCase() : "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal py-3">
                  <div className="flex flex-col space-y-1.5">
                    <p className="text-sm font-bold leading-none">
                      {user.email ? user.email.split('@')[0] : user.displayName}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground font-medium">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                <DropdownMenuItem asChild>
                  <Link href="/" className="cursor-pointer flex w-full items-center py-2.5">
                    <Eye className="mr-2.5 h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">내 페이지 미리보기</span>
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                  <Link href="/admin" className="cursor-pointer flex w-full items-center py-2.5">
                    <LayoutDashboard className="mr-2.5 h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">관리자 대시보드</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href="/admin/analytics" className="cursor-pointer flex w-full items-center py-2.5">
                    <BarChart2 className="mr-2.5 h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">통계 확인하기</span>
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive cursor-pointer py-2.5">
                  <LogOut className="mr-2.5 h-4 w-4" />
                  <span className="font-bold">로그아웃</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button size="sm" onClick={handleLogin}>
              Google 로그인
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
