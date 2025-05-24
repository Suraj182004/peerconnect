'use client';

import { useEffect, useState, ReactNode } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuLabel, 
    DropdownMenuSeparator, 
    DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Search, Users, Home, UserCog, LogOut, UserCircle2 } from 'lucide-react';
import { UserProfile } from '@/lib/types';
import { getUserProfile, localStorageManager } from '@/lib/localStorage';
import { NAVIGATION_ITEMS } from '@/lib/constants'; // Assuming you might use this for nav

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const user = getUserProfile();
    setCurrentUser(user);
    // If no user, potentially redirect to login/onboarding, 
    // but for now, we assume user exists from previous steps.
  }, []);

  const handleLogout = () => {
    localStorageManager.clearAll(); // Clears all app-specific data
    router.push('/'); // Redirect to landing page
    // Optionally, could also call router.refresh() if needed, or notify other parts of app
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-card border-b border-border sticky top-0 z-50 shadow-sm print:hidden"
      >
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Link href="/dashboard" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">P</span>
                </div>
                <span className="text-xl font-bold">PeerConnect</span>
              </Link>
            </div>
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
              {NAVIGATION_ITEMS.map(item => {
                const Icon = item.icon === 'home' ? Home : 
                             item.icon === 'users' ? Users : 
                             item.icon === 'user-check' ? UserCog : // Assuming 'user-check' is more for connections page, 'user-cog' or 'user' for profile
                             item.icon === 'user' ? UserCog : Users; // Fallback
                const isActive = pathname === item.href || (item.href === '/dashboard/browse' && pathname.startsWith('/dashboard/browse'));
                return (
                  <Link 
                    href={item.href} 
                    key={item.id} 
                    className={`flex items-center gap-1.5 text-sm font-medium transition-colors px-3 py-2 rounded-md 
                      ${isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="flex items-center gap-4">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input 
                  placeholder="Search PeerConnect..." 
                  className="pl-10 w-56 lg:w-64 text-sm h-9 bg-muted/50 focus:bg-card"
                />
              </div>
              {currentUser ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="w-9 h-9 cursor-pointer border-2 border-transparent hover:border-primary transition">
                      <AvatarImage src={currentUser.avatar} alt={currentUser.firstName} />
                      <AvatarFallback>
                        {currentUser.firstName[0]}{currentUser.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <DropdownMenuLabel>
                        <p className="text-sm font-medium truncate">{currentUser.firstName} {currentUser.lastName}</p>
                        <p className="text-xs text-muted-foreground truncate">{currentUser.email}</p>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => router.push(`/dashboard/profile/${currentUser.id}`)}>
                      <UserCircle2 className="mr-2 h-4 w-4" />
                      <span>View Profile</span>
                    </DropdownMenuItem>
                    {/* Add other items like Settings here if needed */}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="w-9 h-9 bg-muted rounded-full" /> // Placeholder if no user
              )}
               {/* Mobile Menu Trigger - TODO */}
            </div>
          </div>
        </div>
      </motion.header>
      <main className="flex-1 w-full max-w-full mx-auto">
        {children}
      </main>
    </div>
  );
} 