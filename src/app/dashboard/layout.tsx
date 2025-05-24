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
import { Search, Users, Home, UserCog, LogOut, UserCircle2, Settings, Bell, MessageSquare, UserCheck } from 'lucide-react';
import { UserProfile } from '@/lib/types';
import { getUserProfile, localStorageManager } from '@/lib/localStorage';
import { NAVIGATION_ITEMS } from '@/lib/constants';
import { Button } from '@/components/ui/button';

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
    if (!user) {
      // If no user, redirect to onboarding or landing page after a slight delay
      // This prevents a flash of the layout if the user is quickly redirected by another effect
      const timer = setTimeout(() => {
        if (!getUserProfile()) { // Double check, as state might not be updated yet
            router.push('/');
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [router]);

  const handleLogout = () => {
    localStorageManager.clearAll();
    router.push('/');
    router.refresh(); // Ensures fresh state on redirect
  };

  const iconMap: { [key: string]: React.ElementType } = {
    home: Home,
    users: Users,
    'user-cog': UserCog, // For profile/settings like pages
    'user-check': UserCheck, // For connections specific page
    'message-square': MessageSquare,
    // Add other mappings as needed from NAVIGATION_ITEMS
    browse: Search, // Example if you have a browse with search icon
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/30 text-foreground">
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "circOut" }}
        className="bg-card border-b border-border/70 sticky top-0 z-50 shadow-sm print:hidden"
      >
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Link href="/dashboard" className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-gradient-to-br from-primary via-accent to-pink-500 rounded-lg flex items-center justify-center shadow-inner">
                  <span className="text-white font-bold text-base">P</span>
                </div>
                <span className="text-xl font-semibold text-foreground">PeerConnect</span>
              </Link>
            </div>
            <nav className="hidden md:flex items-center space-x-1">
              {NAVIGATION_ITEMS.map(item => {
                const Icon = iconMap[item.icon] || Home; // Fallback to Home icon
                const isActive = pathname === item.href || 
                               (item.href === '/dashboard/browse' && pathname.startsWith('/dashboard/browse')) ||
                               (item.href === '/dashboard/profile' && pathname.startsWith('/dashboard/profile'));
                return (
                  <Link 
                    href={item.href === '/dashboard/profile' && currentUser ? `/dashboard/profile/${currentUser.id}` : item.href}
                    key={item.id} 
                    className={`flex items-center gap-2 text-sm font-medium transition-all duration-200 px-3 py-2 rounded-md 
                      ${isActive 
                        ? 'bg-primary/10 text-primary shadow-sm' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/70'}
                        hover:scale-[1.02] active:scale-[0.98]`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : ''}`} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="flex items-center gap-3 md:gap-4">
              <div className="relative hidden md:block group">
                <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-muted-foreground group-focus-within:text-primary w-4 h-4 transition-colors" />
                <Input 
                  placeholder="Search..." 
                  className="pl-10 w-48 lg:w-64 text-sm h-9 bg-muted/60 focus:bg-card focus:ring-1 focus:ring-primary/50 transition-all duration-200 focus:w-56 lg:focus:w-72 shadow-sm"
                />
              </div>
              {/* Notification Bell - Placeholder */}
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary hover:bg-muted/70 rounded-full">
                <Bell className="w-5 h-5" />
              </Button>

              {currentUser ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-card rounded-full p-0.5">
                        <Avatar className="w-8 h-8 md:w-9 md:h-9 cursor-pointer border-2 border-transparent group-hover:border-primary transition-all duration-200">
                        <AvatarImage src={currentUser.avatar} alt={currentUser.firstName} />
                        <AvatarFallback className="text-sm font-semibold">
                            {currentUser.firstName[0]}{currentUser.lastName[0]}
                        </AvatarFallback>
                        </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-60 shadow-xl" align="end" sideOffset={8}>
                    <DropdownMenuLabel className="py-2 px-3">
                        <p className="text-sm font-semibold truncate">{currentUser.firstName} {currentUser.lastName}</p>
                        <p className="text-xs text-muted-foreground truncate">{currentUser.email}</p>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => router.push(`/dashboard/profile/${currentUser.id}`)} className="py-2 px-3 cursor-pointer group">
                      <UserCircle2 className="mr-2.5 h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      <span>View Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push('/dashboard/settings')} className="py-2 px-3 cursor-pointer group"> {/* Assuming a settings page */} 
                      <Settings className="mr-2.5 h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      <span>Account Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="py-2 px-3 text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer group">
                      <LogOut className="mr-2.5 h-4 w-4 text-destructive/80 group-hover:text-destructive transition-colors" />
                      <span>Log Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="w-9 h-9 bg-muted rounded-full animate-pulse" /> 
              )}
               {/* Mobile Menu Trigger - TODO - Will need a Sheet component */}
            </div>
          </div>
        </div>
      </motion.header>
      <main className="flex-1 w-full max-w-full mx-auto py-4 sm:py-5">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6">
            {children}
        </div>
      </main>
    </div>
  );
} 