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
  Home, UserCog, MessageCircle
} from 'lucide-react';
import { UserProfile } from '@/lib/types';
import { mockProfiles, mockDashboardStats, getRandomProfiles } from '@/lib/mockData';
import { getUserProfile } from '@/lib/localStorage';
import { useConnections } from '@/hooks/useConnections';
import { QUICK_ACTIONS } from '@/lib/constants';

const iconMap: { [key: string]: React.ElementType } = {
  users: Users,
  'user-check': UserCheck,
  'user-cog': UserCog,
  'message-circle': MessageCircle,
  home: Home,
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
    if (!user) {
      user = mockProfiles[0];
    }
    setCurrentUser(user);
    if (user) {
      setSuggestedUsers(getRandomProfiles(4, user.id).filter(p => p.id !== user!.id).slice(0,3));
    }
  }, []);

  if (!currentUser) {
    return <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-background text-foreground">Loading profile...</div>;
  }

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const getConnectButtonContent = (userId: string) => {
    const status = getConnectionStatus(userId, currentUser?.id || '');
    if (status === 'accepted') {
      return <><UserCheck className="w-4 h-4 mr-1.5" /> Connected</>;
    }
    if (status === 'pending') {
      return <><Clock className="w-4 h-4 mr-1.5" /> Pending</>;
    }
    return <><UserPlus className="w-4 h-4 mr-1.5" /> Connect</>;
  };

  const isConnectButtonDisabled = (userId: string) => {
    const status = getConnectionStatus(userId, currentUser?.id || '');
    return connectionsLoading || status === 'pending' || status === 'accepted';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        <div className="lg:col-span-8 space-y-6">
          <motion.div variants={fadeInUp} initial="hidden" animate="visible">
            <Card className="overflow-hidden shadow-sm">
              <div className="h-40 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" /> 
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-16 sm:-mt-20">
                  <Avatar className="w-32 h-32 sm:w-36 sm:h-36 border-4 border-card rounded-full shadow-lg">
                    <AvatarImage src={currentUser.avatar} alt={currentUser.firstName} />
                    <AvatarFallback className="text-4xl">
                      {currentUser.firstName[0]}{currentUser.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 pt-2 text-center sm:text-left">
                    <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                      {currentUser.firstName} {currentUser.lastName}
                    </h1>
                    <p className="text-muted-foreground text-sm sm:text-base mb-1">
                      {currentUser.department} @ {currentUser.university}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {mockDashboardStats.totalConnections} connections &bull; Joined on {new Date(currentUser.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long'})}
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2 sm:mt-0 shrink-0"
                    onClick={() => router.push(`/dashboard/profile/${currentUser.id}`)}
                  >
                    <UserCog className="w-3 h-3 mr-1.5" /> View Profile
                  </Button>
                </div>
                
                {currentUser.skills && currentUser.skills.length > 0 && (
                  <div className="mt-6 pt-4 border-t border-border">
                    <h3 className="text-xs font-semibold uppercase text-muted-foreground mb-2">Top Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {currentUser.skills.slice(0, 7).map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs font-medium px-2.5 py-1">
                          {skill}
                        </Badge>
                      ))}
                      {currentUser.skills.length > 7 && (
                        <Badge variant="outline" className="text-xs font-medium px-2.5 py-1">
                          +{currentUser.skills.length - 7} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeInUp} initial="hidden" animate="visible" transition={{ delay: 0.1 }}>
            <h2 className="text-xl font-semibold text-foreground mb-3">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {QUICK_ACTIONS.map(action => {
                const IconComponent = iconMap[action.icon] || ArrowRight;
                return (
                  <motion.div key={action.id} variants={fadeInUp}>
                    <Link href={action.href} passHref>
                      <Card className="hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col">
                        <CardHeader className="pb-3">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-md bg-${action.color}-100 dark:bg-${action.color}-900/30`}>
                                <IconComponent className={`w-5 h-5 text-${action.color}-600 dark:text-${action.color}-400`} />
                            </div>
                            <CardTitle className="text-base font-semibold">{action.title}</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent className="flex-grow">
                          <p className="text-xs text-muted-foreground leading-snug">{action.description}</p>
                        </CardContent>
                        <div className="p-4 pt-0 mt-auto">
                            <Button variant="link" size="sm" className="p-0 text-xs text-${action.color}-600 dark:text-${action.color}-400 hover:text-${action.color}-700">
                                Go to {action.title} <ArrowRight className="w-3 h-3 ml-1" />
                            </Button>
                        </div>
                      </Card>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            {[ 
              { title: 'Connections', value: mockDashboardStats.totalConnections },
              { title: 'Profile Views', value: mockDashboardStats.profileViews },
              { title: 'Projects Involved', value: currentUser.projectAreas?.length || 0 },
            ].map(stat => (
              <motion.div key={stat.title} variants={fadeInUp}>
                <Card className="text-center shadow-sm">
                  <CardHeader className="pb-1 pt-4">
                    <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wider">{stat.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-4 pt-0">
                    <div className="text-2xl sm:text-3xl font-bold text-foreground">
                      {stat.value}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <motion.div variants={fadeInUp} initial="hidden" animate="visible">
            <Tabs defaultValue="activity" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-muted/60 rounded-md">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="experience">Experience</TabsTrigger>
              </TabsList>
              <TabsContent value="about" className="mt-4">
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-base sm:text-lg">About {currentUser.firstName}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground leading-relaxed">
                    {currentUser.bio || "This user hasn't added a bio yet. Encourage them to share more about themselves!"}
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="activity" className="mt-4">
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-base sm:text-lg">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    {[...Array(2)].map((_, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <Avatar className="w-10 h-10 border-2 border-card mt-0.5">
                          <AvatarImage src={currentUser.avatar} alt={currentUser.firstName} />
                          <AvatarFallback>{currentUser.firstName[0]}{currentUser.lastName[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="font-semibold text-sm text-foreground">{currentUser.firstName} {currentUser.lastName}</span>
                            <span className="text-xs text-muted-foreground">{idx === 0 ? '2d ago' : '5d ago'}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {idx === 0 
                              ? `Shared an exciting update about a new ${currentUser.projectAreas?.[0] || 'project'} they are working on. Check it out!`
                              : `Connected with Ethan Bennett and Olivia Hayes. Expanding the network!`}
                          </p>
                          {idx === 0 && (
                             <div className="mt-2 p-3 border rounded-md bg-muted/50">
                                 <p className="text-sm font-medium text-foreground">New Project: AI in Education</p>
                                 <p className="text-xs text-muted-foreground mt-0.5">Looking for collaborators skilled in Python and Machine Learning. Let&apos;s innovate together!</p>
                             </div>
                          )}
                        </div>
                      </div>
                    ))}
                     {currentUser.projectAreas?.length === 0 && currentUser.skills?.length === 0 && (
                        <p className="text-sm text-center text-muted-foreground py-4">No recent activity to show.</p>
                     )}
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="experience" className="mt-4">
                <Card className="shadow-sm">
                  <CardContent className="p-6 text-sm text-muted-foreground text-center">
                    Experience section is under development. Stay tuned for updates!
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <motion.div variants={fadeInUp} initial="hidden" animate="visible">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">People You May Know</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3.5">
                {suggestedUsers.length > 0 ? suggestedUsers.map((user) => (
                  <div key={user.id} className="flex items-center gap-3">
                    <Avatar className="w-10 h-10 sm:w-11 sm:h-11 cursor-pointer border border-transparent hover:border-primary transition">
                      <AvatarImage src={user.avatar} alt={user.firstName} />
                      <AvatarFallback>
                        {user.firstName[0]}{user.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold truncate text-sm text-foreground hover:underline cursor-pointer">
                        {user.firstName} {user.lastName}
                      </h4>
                      <p className="text-xs text-muted-foreground truncate">
                        {user.department}
                      </p>
                    </div>
                    <Button 
                      size="sm" 
                      variant={getConnectionStatus(user.id, currentUser?.id || '') === 'pending' ? 'outline' : 'default'}
                      onClick={() => sendConnectionRequest(user.id, currentUser?.id || '')}
                      disabled={isConnectButtonDisabled(user.id)}
                      className="shrink-0 text-xs h-7 sm:h-8 px-2.5 sm:px-3 rounded-md flex items-center justify-center"
                    >
                      {getConnectButtonContent(user.id)}
                    </Button>
                  </div>
                )) : (
                   <p className="text-sm text-center text-muted-foreground py-3">No new suggestions right now. Check back later!</p>
                )}
              </CardContent>
            </Card>
          </motion.div>
          {/* Future sidebar cards */}
        </div>
      </div>
    </div>
  );
};

export default DashboardHomePage; 