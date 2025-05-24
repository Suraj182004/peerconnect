'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, UserCheck, UserPlus, Clock, ArrowRight, 
  Edit3, Eye, Briefcase,
  Settings, BarChart2, MessageSquare, FileText, Users2,
} from 'lucide-react';
import { UserProfile, QuickAction } from '@/lib/types';
import { mockProfiles, mockDashboardStats, getRandomProfiles } from '@/lib/mockData';
import { getUserProfile } from '@/lib/localStorage';
import { useConnections } from '@/hooks/useConnections';
import { QUICK_ACTIONS as DEFAULT_QUICK_ACTIONS } from '@/lib/constants';

const iconMap: { [key: string]: React.ElementType } = {
  users: Users2,
  'user-check': UserCheck,
  'user-cog': Settings,
  'message-square': MessageSquare,
  home: BarChart2,
  search: Eye,
  edit: Edit3,
  briefcase: Briefcase,
  'file-text': FileText,
  default: ArrowRight,
};

const DashboardHomePage = () => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [suggestedUsers, setSuggestedUsers] = useState<UserProfile[]>([]);
  const router = useRouter();
  const { 
    sendConnectionRequest, 
    getConnectionStatus, 
    isLoading: connectionsLoading 
  } = useConnections();

  useEffect(() => {
    let user = getUserProfile();
    if (!user && mockProfiles.length > 0) {
      console.warn("No user profile found in localStorage, using mock data for dashboard.");
      user = mockProfiles[0]; 
    }
    setCurrentUser(user);
    if (user) {
      setSuggestedUsers(getRandomProfiles(4, user.id).filter(p => p.id !== user!.id).slice(0,3));
    }
    if (!user) {
        router.push('/onboarding');
    }
  }, [router]);

  const defaultVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number = 1) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.05, duration: 0.4, ease: 'circOut' },
    }),
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.07, delayChildren: 0.1 },
    },
  };

  if (!currentUser) {
    return (
      <div className="min-h-[calc(100vh-10rem)] flex flex-col items-center justify-center bg-background text-foreground p-6">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-lg font-semibold text-primary mb-1">Loading Your Dashboard</p>
        <p className="text-sm text-muted-foreground">Just a moment while we get things ready...</p>
      </div>
    );
  }

  const getConnectButtonContent = (userId: string) => {
    const status = getConnectionStatus(userId, currentUser?.id || '');
    if (status === 'accepted') {
      return <><UserCheck className="w-4 h-4 mr-1.5" /> Connected</>;
    }
    if (status === 'pending') {
      return <><Clock className="w-4 h-4 mr-1.5" /> Request Sent</>;
    }
    return <><UserPlus className="w-4 h-4 mr-1.5" /> Connect</>;
  };

  const isConnectButtonDisabled = (userId: string) => {
    const status = getConnectionStatus(userId, currentUser?.id || '');
    return connectionsLoading || status === 'pending' || status === 'accepted';
  };
  
  const quickActions: QuickAction[] = DEFAULT_QUICK_ACTIONS.map(action => ({
    ...action,
    icon: action.icon,
    color: action.color || 'primary'
  }));

  return (
    <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="space-y-6 md:space-y-8"
    >
      <motion.div variants={defaultVariants} custom={0}>
        <Card className="overflow-hidden shadow-xl border-border/60 rounded-xl bg-gradient-to-br from-card via-card to-muted/30">
          <div className="h-36 md:h-44 bg-gradient-to-r from-primary/70 via-accent/70 to-pink-500/60 relative group">
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-all duration-300"></div>
          </div>
          <CardContent className="p-5 sm:p-6 relative">
            <div className="flex flex-col sm:flex-row items-center sm:items-center gap-x-5 gap-y-3 -mt-20 sm:-mt-24 relative z-10">
              <Avatar className="w-32 h-32 sm:w-36 sm:h-36 border-[5px] border-card bg-muted rounded-full shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer">
                <AvatarImage src={currentUser.avatar} alt={`${currentUser.firstName} ${currentUser.lastName}`} />
                <AvatarFallback className="text-5xl font-semibold bg-gradient-to-br from-primary/20 to-accent/20 text-primary">
                  {currentUser.firstName[0]}{currentUser.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-center sm:text-left sm:ml-6 mt-0">
                <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
                  {currentUser.firstName} {currentUser.lastName}
                </h1>
                <p className="text-accent-foreground font-medium text-sm sm:text-base mt-0.5">
                  {currentUser.department}
                </p>
                <p className="text-xs text-muted-foreground mt-1.5">
                  {currentUser.university} &bull; {mockDashboardStats.totalConnections} connections &bull; Member since {new Date(currentUser.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric'})}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="mt-3 sm:mt-0 shrink-0 shadow-md hover:shadow-lg transition-all duration-300 border-border/80 hover:border-primary/60 bg-card/70 backdrop-blur-sm group-hover:scale-105 w-full sm:w-auto"
                onClick={() => router.push(`/dashboard/profile/${currentUser.id}`)}
              >
                <Eye className="w-4 h-4 mr-2 text-primary/90" /> View Full Profile
              </Button>
            </div>
            
            {currentUser.skills && currentUser.skills.length > 0 && (
              <motion.div 
                variants={defaultVariants} 
                custom={1} 
                className="mt-6 pt-5 border-t border-border/70"
              >
                <h3 className="text-xs font-semibold uppercase text-muted-foreground mb-2.5 tracking-wide">My Top Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {currentUser.skills.slice(0, 7).map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs font-medium px-3 py-1 shadow-sm border-transparent">
                      {skill}
                    </Badge>
                  ))}
                  {currentUser.skills.length > 7 && (
                    <Badge variant="outline" className="text-xs font-medium px-3 py-1 border-border/80">
                      +{currentUser.skills.length - 7} more
                    </Badge>
                  )}
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <motion.div 
            variants={defaultVariants} 
            custom={2} 
            className="lg:col-span-2 space-y-4 md:space-y-5"
        >
            <h2 className="text-lg font-semibold text-foreground tracking-tight px-1">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
              {quickActions.map((action, idx) => {
                const IconComponent = iconMap[action.icon] || iconMap.default;
                const colorClass = `text-${action.color}-600 dark:text-${action.color}-400`;
                const bgClass = `bg-${action.color}-100 dark:bg-${action.color}-900/30`;

                return (
                  <motion.div key={action.id} variants={defaultVariants} custom={idx + 2}> 
                    <Link href={action.href} className="block h-full">
                      <Card className="hover:shadow-xl transition-all duration-200 cursor-pointer h-full flex flex-col group border-border/70 hover:border-primary/40 transform hover:-translate-y-1">
                        <CardHeader className="pb-2 pt-4 px-4">
                          <div className="flex items-start justify-between">
                                <div className={`p-2.5 rounded-lg ${bgClass} transition-colors duration-200 group-hover:bg-primary/15`}>
                                    <IconComponent className={`w-5 h-5 ${colorClass} transition-colors duration-200 group-hover:text-primary`} />
                                </div>
                            </div>
                          </CardHeader>
                          <CardContent className="flex-grow px-4 pb-3">
                            <CardTitle className="text-base font-semibold text-foreground group-hover:text-primary transition-colors duration-200">{action.title}</CardTitle>
                            <p className="text-xs text-muted-foreground leading-snug mt-1">{action.description}</p>
                          </CardContent>
                          <div className="px-4 pb-4 pt-1 mt-auto">
                              <Button variant="link" size="sm" className={`p-0 text-xs ${colorClass} group-hover:text-primary font-medium transition-colors duration-200`}>
                                  {action.title.startsWith("View") || action.title.startsWith("Browse") ? action.title : `Go to ${action.title}`} 
                                  <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform duration-200 group-hover:translate-x-0.5" />
                              </Button>
                          </div>
                        </Card>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
        </motion.div>

        <motion.div variants={defaultVariants} custom={3} className="space-y-4 md:space-y-5">
            <h2 className="text-lg font-semibold text-foreground tracking-tight px-1">Your Stats</h2>
            <div className="space-y-4 md:space-y-5">
                {[ 
                { title: 'Connections', value: mockDashboardStats.totalConnections, icon: Users2 },
                { title: 'Profile Views (Last 7 Days)', value: mockDashboardStats.profileViews, icon: Eye },
                { title: 'Active Projects', value: currentUser.projectAreas?.length || 0, icon: Briefcase },
                ].map((stat, idx) => {
                    const StatIcon = stat.icon;
                    return (
                    <motion.div key={stat.title} variants={defaultVariants} custom={idx + 3}> 
                        <Card className="shadow-md border-border/70 hover:shadow-lg transition-shadow duration-200">
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="p-3 bg-primary/10 rounded-lg">
                                <StatIcon className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <p className="text-2xl sm:text-3xl font-bold text-foreground">{stat.value}</p>
                                <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">{stat.title}</p>
                            </div>
                        </CardContent>
                        </Card>
                    </motion.div>
                    );
                })}
            </div>
        </motion.div>
      </div>

      <motion.div variants={defaultVariants} custom={4}>
        <Tabs defaultValue="activity" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 bg-muted/70 rounded-lg p-1 h-auto shadow-inner">
            <TabsTrigger value="about" className="py-2 text-sm data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-md transition-all">About Me</TabsTrigger>
            <TabsTrigger value="activity" className="py-2 text-sm data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-md transition-all">Recent Activity</TabsTrigger>
            <TabsTrigger value="experience" className="py-2 text-sm data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-md transition-all hidden sm:flex">Experience</TabsTrigger>
          </TabsList>
          
          <TabsContent value="about" className="mt-5">
            <Card className="shadow-lg border-border/70">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl font-semibold text-foreground">About {currentUser.firstName}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground leading-relaxed">
                {currentUser.bio || 
                  <p className="italic">No bio available. Complete your profile to share more about yourself!</p>
                }
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="mt-5">
            <Card className="shadow-lg border-border/70">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl font-semibold text-foreground">Recent Activity</CardTitle>
                <CardDescription className="text-xs">Updates on your network and projects.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                {currentUser.recentActivity && currentUser.recentActivity.length > 0 ? currentUser.recentActivity.slice(0,3).map((activity, idx) => (
                  <motion.div 
                    key={idx} 
                    variants={defaultVariants} 
                    custom={idx + 5} 
                    className="flex items-start gap-3 p-3 bg-card hover:bg-muted/50 rounded-lg transition-colors border border-transparent hover:border-border/50"
                  >
                    <Avatar className="w-10 h-10 border bg-background mt-0.5">
                        <AvatarImage src={activity.user?.avatar || currentUser.avatar} alt={activity.user?.name || currentUser.firstName} />
                        <AvatarFallback>{activity.user?.name ? activity.user.name.split(' ').map(n=>n[0]).join('') : currentUser.firstName[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-semibold text-sm text-foreground">{activity.user?.name || `${currentUser.firstName} ${currentUser.lastName}`}</span>
                        <span className="text-xs text-muted-foreground">{activity.timestamp}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {activity.description}
                      </p>
                      {activity.details && (
                         <div className="mt-2 p-3 border border-border/60 rounded-md bg-muted/70">
                             <p className="text-sm font-medium text-foreground">{activity.details.title}</p>
                             <p className="text-xs text-muted-foreground mt-0.5">{activity.details.content}</p>
                         </div>
                      )}
                    </div>
                  </motion.div>
                )) : (
                    <div className="text-center py-8 text-muted-foreground">
                        <Users2 className="w-12 h-12 mx-auto mb-3 text-primary/40" />
                        <p className="font-semibold text-base">No recent activity.</p>
                        <p className="text-sm">Start connecting or join a project to see updates here!</p>
                    </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="experience" className="mt-5">
            <Card className="shadow-lg border-border/70">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl font-semibold text-foreground">Experience & Projects</CardTitle>
                <CardDescription className="text-xs">Highlights from your academic and project work.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                    <Briefcase className="w-12 h-12 mx-auto mb-3 text-primary/40" />
                    <p className="font-semibold text-base">No experience listed yet.</p>
                    <p className="text-sm">Add your projects and experiences to your profile.</p>
                    <Button size="sm" variant="outline" className="mt-4" onClick={() => router.push(`/dashboard/profile/${currentUser.id}`)}>
                        <Edit3 className="w-3.5 h-3.5 mr-1.5" /> Update Profile
                    </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
      
      <motion.div variants={defaultVariants} custom={5} className="lg:col-span-4 space-y-4 md:space-y-5">
        <h2 className="text-lg font-semibold text-foreground tracking-tight px-1">Suggested For You</h2>
        {suggestedUsers.length > 0 ? (
          <div className="space-y-4">
            {suggestedUsers.map((user, idx) => (
              <motion.div key={user.id} variants={defaultVariants} custom={idx + 6}>
                <Card className="p-4 shadow-md hover:shadow-lg transition-shadow duration-200 border-border/70">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12 border bg-background">
                      <AvatarImage src={user.avatar} alt={user.firstName} />
                      <AvatarFallback>{user.firstName[0]}{user.lastName[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <Link href={`/dashboard/profile/${user.id}`} className="hover:underline">
                        <p className="text-sm font-semibold text-foreground truncate">{user.firstName} {user.lastName}</p>
                      </Link>
                      <p className="text-xs text-muted-foreground truncate">{user.department}</p>
                    </div>
                    <Button 
                      size="sm" 
                      variant={getConnectionStatus(user.id, currentUser?.id || '') === 'pending' || getConnectionStatus(user.id, currentUser?.id || '') === 'accepted' ? 'outline' : 'default'}
                      onClick={() => !isConnectButtonDisabled(user.id) && sendConnectionRequest(user.id, currentUser.id)}
                      disabled={isConnectButtonDisabled(user.id)}
                      className="text-xs px-2.5 py-1 h-auto whitespace-nowrap shrink-0 shadow-sm hover:shadow-md transition-shadow"
                    >
                      {getConnectButtonContent(user.id)}
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
            <div className="text-center py-8 text-muted-foreground bg-card rounded-lg shadow-sm border border-border/70">
                <Users className="w-12 h-12 mx-auto mb-3 text-primary/40" />
                <p className="font-semibold text-base">No suggestions right now.</p>
                <p className="text-sm">We&apos;ll show new people to connect with here soon!</p>
            </div>
        )}
      </motion.div>

    </motion.div>
  );
};

export default DashboardHomePage; 