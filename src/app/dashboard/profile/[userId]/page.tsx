'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { UserProfile } from '@/lib/types';
import { getUserProfile as getCurrentUserProfile } from '@/lib/localStorage'; // Renamed to avoid conflict
import { allMockProfiles } from '@/lib/mockData'; // To find any user
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Edit3, Mail, MapPin, Briefcase, Users, Link2, Linkedin, Github, Twitter, ExternalLink, ShieldAlert, UserPlus, UserCheck, Clock } from 'lucide-react';
import Link from 'next/link';
import { useConnections } from '@/hooks/useConnections';

const socialIconMap: { [key: string]: React.ElementType } = {
  linkedin: Linkedin,
  github: Github,
  twitter: Twitter,
  portfolio: ExternalLink,
};

interface DynamicProfilePageProps {
  params: {
    userId: string;
  };
}

const DynamicUserProfilePage = ({ params: paramsAsProp }: DynamicProfilePageProps) => {
  // Unwrap params if it's a Promise, as suggested by the Next.js warning
  const actualParams = React.use(paramsAsProp as any); // Cast to any if type causes issues, or adjust type for Promise
  const { userId } = actualParams;
  
  const router = useRouter();
  const [profileToShow, setProfileToShow] = useState<UserProfile | null | undefined>(undefined); // undefined for loading, null for not found
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  // Connections hook
  const { 
    getConnectionStatus,
    sendConnectionRequest,
    isLoading: connectionsLoading 
  } = useConnections();

  useEffect(() => {
    const cUser = getCurrentUserProfile();
    setCurrentUser(cUser);

    if (userId) {
      let foundProfile = allMockProfiles.find(p => p.id === userId);
      // If viewing own profile and not found in mock list (e.g., profile created via onboarding not in mockData), use current user data
      if (!foundProfile && cUser && cUser.id === userId) {
        foundProfile = cUser;
      }
      setProfileToShow(foundProfile || null); 
    } else {
      // Should not happen if routing is correct, but as a fallback
      setProfileToShow(null);
    }
  }, [userId]);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  if (profileToShow === undefined) {
    return <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">Loading profile...</div>;
  }

  if (!profileToShow) {
    return (
      <motion.div 
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center"
      >
        <ShieldAlert className="mx-auto h-16 w-16 text-destructive mb-4" />
        <h1 className="text-3xl font-bold text-foreground">User Not Found</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          The profile you are looking for does not exist or the link is incorrect.
        </p>
        <Button onClick={() => router.push('/dashboard/browse')} className="mt-6">
          Browse Other Students
        </Button>
      </motion.div>
    );
  }

  const user = profileToShow; // Use profileToShow for rendering
  const isCurrentUserProfile = currentUser?.id === user.id;

  // Connection status for the viewed profile
  const connectionStatus = currentUser && !isCurrentUserProfile ? getConnectionStatus(user.id, currentUser.id) : 'none';

  const handleConnect = () => {
    if (currentUser && !isCurrentUserProfile) {
      sendConnectionRequest(user.id, currentUser.id);
    }
  };

  const getConnectButtonContent = () => {
    if (connectionStatus === 'accepted') {
      return <><UserCheck className="w-4 h-4 mr-1.5" /> Connected</>;
    }
    if (connectionStatus === 'pending') {
      return <><Clock className="w-4 h-4 mr-1.5" /> Pending</>;
    }
    return <><UserPlus className="w-4 h-4 mr-1.5" /> Connect with {user.firstName}</>;
  };

  const isConnectButtonDisabled = () => {
    return connectionsLoading || connectionStatus === 'pending' || connectionStatus === 'accepted' || !currentUser;
  };

  const renderSection = (title: string, items?: readonly string[] | string[] , icon?: React.ElementType) => {
    if (!items || items.length === 0) return null;
    const IconComponent = icon;
    return (
      <div className="mt-4">
        <h3 className="text-md font-semibold text-muted-foreground/80 flex items-center">
          {IconComponent && <IconComponent className="w-4 h-4 mr-2 text-muted-foreground" />} {title}
        </h3>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {items.map(item => <Badge key={item} variant="secondary" className="font-normal">{item}</Badge>)}
        </div>
      </div>
    );
  };

  return (
    <motion.div 
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      <Card className="overflow-hidden shadow-lg">
        <CardHeader className="p-0 relative mb-16">
          <div className="h-48 bg-gradient-to-br from-primary via-accent to-secondary" />
          <div className="absolute top-24 left-1/2 -translate-x-1/2 w-full px-6 flex flex-col items-center">
            <Avatar className="w-36 h-36 rounded-full border-4 border-background shadow-xl bg-background">
              <AvatarImage src={user.avatar} alt={`${user.firstName} ${user.lastName}`} />
              <AvatarFallback className="text-5xl">
                {user.firstName[0]}{user.lastName[0]}
              </AvatarFallback>
            </Avatar>
          </div>
        </CardHeader>

        <CardContent className="text-center px-6 pb-6">
            <h1 className="text-3xl font-bold text-foreground leading-tight mt-4">{user.firstName} {user.lastName}</h1>
            <p className="text-md text-muted-foreground">{user.department} - {user.year}</p>
            {user.university && <p className="text-sm text-muted-foreground flex items-center justify-center mt-1"><Briefcase className="w-3.5 h-3.5 mr-1.5 text-muted-foreground/70" /> {user.university}</p>}
            
            {isCurrentUserProfile && (
              <Button variant="outline" size="sm" onClick={() => router.push('/onboarding')} className="mt-4">
                <Edit3 className="w-3.5 h-3.5 mr-1.5" /> Edit My Profile
              </Button>
            )}

            {/* Connect Button Logic */}
            {!isCurrentUserProfile && currentUser && (
                <div className="mt-4">
                    <Button 
                        onClick={handleConnect} 
                        disabled={isConnectButtonDisabled()}
                        variant={connectionStatus === 'pending' || connectionStatus === 'accepted' ? 'outline' : 'default'}
                        size="sm"
                    >
                        {getConnectButtonContent()}
                    </Button>
                </div>
            )}

          {user.bio && (
            <div className="mt-6 pt-6 border-t text-left">
              <h2 className="text-lg font-semibold text-foreground mb-2">About Me</h2>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap text-balance leading-relaxed">
                {user.bio}
              </p>
            </div>
          )}

          <div className="mt-6 pt-6 border-t grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-left">
            {renderSection("Skills", user.skills, Users)}
            {renderSection("Interests", user.interests, Link2)}
            {renderSection("Project Areas", user.projectAreas, Briefcase)}

            {user.socialLinks && Object.values(user.socialLinks).some(link => link) && (
                <div className="md:col-span-2 mt-2">
                    <h3 className="text-md font-semibold text-muted-foreground/80 mb-2 flex items-center">
                        <ExternalLink className="w-4 h-4 mr-2 text-muted-foreground" /> Social Links
                    </h3>
                    <div className="flex space-x-4">
                        {Object.entries(user.socialLinks).map(([platform, link]) => {
                        if (!link) return null;
                        const Icon = socialIconMap[platform] || ExternalLink;
                        return (
                            <Link key={platform} href={link} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" title={platform.charAt(0).toUpperCase() + platform.slice(1)}>
                            <Icon className="w-5 h-5" />
                            </Link>
                        );
                        })}
                    </div>
                </div>
            )}
          </div>
        </CardContent>
        {(user.email || user.location) && (
            <CardFooter className="px-6 py-4 bg-muted/30 border-t flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
                {user.email && (
                    <div className="text-sm text-muted-foreground flex items-center">
                        <Mail className="w-4 h-4 mr-2 text-muted-foreground/70" /> {user.email}
                    </div>
                )}
                {user.location && (
                    <div className="text-sm text-muted-foreground flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-muted-foreground/70" /> {user.location}
                    </div>
                )}
            </CardFooter>
        )}
      </Card>
    </motion.div>
  );
};

export default DynamicUserProfilePage; 