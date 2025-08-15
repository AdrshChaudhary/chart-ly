
"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter, usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "./ui/button";
import { ChartLine, LogOut } from "lucide-react";
import { SidebarTrigger } from "./ui/sidebar";


export default function Header() {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleSignOut = async () => {
    await signOut(auth);
    // Remove cookie
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
    router.push("/login");
    router.refresh();
  };

  const getInitials = (email: string | null | undefined) => {
    if (!email) return 'U';
    const name = user?.displayName;
    if (name) return name[0].toUpperCase();
    return email[0].toUpperCase();
  }
  
  const isDashboard = pathname.startsWith('/dashboard');

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center">
        {isDashboard && user && <SidebarTrigger />}
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-primary mr-4">
          <ChartLine className="h-6 w-6" />
          <span>Chartly</span>
        </Link>
        
        {isDashboard && user && (
            <nav className="hidden md:flex items-center space-x-2">
                <Button variant={pathname === '/dashboard' ? 'secondary' : 'ghost'} size="sm" asChild>
                    <Link href="/dashboard">Overview</Link>
                </Button>
                <Button variant={pathname === '/dashboard/upload' ? 'secondary' : 'ghost'} size="sm" asChild>
                    <Link href="/dashboard/upload">Upload Data</Link>
                </Button>
            </nav>
        )}

        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            {user ? (
               <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'} />
                      <AvatarFallback>{getInitials(user.email)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.displayName || 'My Account'}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              </div>
            ) : (
                <>
                    <Button variant="ghost" asChild>
                        <Link href="/login">Sign In</Link>
                    </Button>
                    <Button asChild>
                        <Link href="/signup">Sign Up</Link>
                    </Button>
                </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
