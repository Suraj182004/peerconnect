'use client';

import { UserProfile } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { UserPlus, UserCheck, Clock, Briefcase, MapPin, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useConnections } from '@/hooks/useConnections';
import { getUserProfile } from '@/lib/localStorage'; // To get current user for connect button logic
import { useEffect, useState } from 'react';

interface StudentCardProps {
  profile: UserProfile;
  isReceivedRequest?: boolean;
  requestId?: string;
}

export const StudentCard = ({ profile, isReceivedRequest, requestId }: StudentCardProps) => {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const {
    getConnectionStatus,
    sendConnectionRequest,
    acceptConnectionRequest,
    declineConnectionRequest,
    isLoading: connectionsLoading,
  } = useConnections();

  useEffect(() => {
    const currentUser = getUserProfile();
    if (currentUser) {
      setCurrentUserId(currentUser.id);
    }
  }, []);

  const status = currentUserId ? getConnectionStatus(profile.id, currentUserId) : 'none';

  const handleConnect = () => {
    if (currentUserId) {
      sendConnectionRequest(profile.id, currentUserId);
    }
  };

  const handleAccept = () => {
    if (requestId) acceptConnectionRequest(requestId);
  };

  const handleDecline = () => {
    if (requestId) declineConnectionRequest(requestId);
  };

  const getConnectButtonContent = () => {
    if (status === 'accepted') {
      return <><UserCheck className="w-4 h-4 mr-1.5" /> Connected</>;
    }
    if (status === 'pending') {
      return <><Clock className="w-4 h-4 mr-1.5" /> Pending</>;
    }
    return <><UserPlus className="w-4 h-4 mr-1.5" /> Connect</>;
  };

  const isConnectButtonDisabled = () => {
    return connectionsLoading || status === 'pending' || status === 'accepted' || !currentUserId;
  };

  return (
    <Card className="w-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full bg-card">
      <CardHeader className="p-0 relative">
        <div className="h-24 bg-gradient-to-r from-accent to-primary" />
        <Link href={`/dashboard/profile/${profile.id}`} className="block">
          <Avatar className="w-24 h-24 rounded-full border-4 border-card absolute top-10 left-1/2 transform -translate-x-1/2 shadow-md hover:scale-105 transition-transform">
            <AvatarImage src={profile.avatar} alt={`${profile.firstName} ${profile.lastName}`} />
            <AvatarFallback className="text-2xl">
              {profile.firstName[0]}{profile.lastName[0]}
            </AvatarFallback>
          </Avatar>
        </Link>
      </CardHeader>
      <CardContent className="pt-16 text-center flex-grow">
        <Link href={`/dashboard/profile/${profile.id}`} className="block">
          <CardTitle className="text-xl font-semibold text-foreground hover:text-primary transition-colors">
            {profile.firstName} {profile.lastName}
          </CardTitle>
        </Link>
        <p className="text-sm text-muted-foreground mt-1">{profile.department}</p>
        <p className="text-xs text-muted-foreground">{profile.university}</p>
        
        {profile.bio && 
          <p className="text-xs text-muted-foreground mt-3 px-2 line-clamp-2 text-balance">
            {profile.bio}
          </p>
        }

        {profile.skills && profile.skills.length > 0 && (
          <div className="mt-4">
            <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1.5">Top Skills</h4>
            <div className="flex flex-wrap justify-center gap-1.5 px-2">
              {profile.skills.slice(0, 3).map((skill) => (
                <Badge key={skill} variant="secondary" className="text-xs px-2 py-0.5 font-normal">
                  {skill}
                </Badge>
              ))}
              {profile.skills.length > 3 && (
                <Badge variant="outline" className="text-xs px-2 py-0.5 font-normal">
                  +{profile.skills.length - 3}
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 border-t mt-auto">
        {isReceivedRequest && requestId && currentUserId && profile.id !== currentUserId ? (
          <div className="w-full flex gap-2">
            <Button 
              className="flex-1" 
              variant="outline"
              onClick={handleDecline} 
              disabled={connectionsLoading}
            >
              <XCircle className="w-4 h-4 mr-1.5" /> Decline
            </Button>
            <Button 
              className="flex-1" 
              onClick={handleAccept} 
              disabled={connectionsLoading}
            >
              <CheckCircle className="w-4 h-4 mr-1.5" /> Accept
            </Button>
          </div>
        ) : profile.id !== currentUserId ? (
          <Button 
            className="w-full"
            variant={status === 'pending' ? 'outline' : 'default'}
            onClick={handleConnect}
            disabled={isConnectButtonDisabled()}
          >
            {getConnectButtonContent()}
          </Button>
        ) : (
            <Button className="w-full" variant="outline" asChild>
                <Link href="/dashboard/profile">
                    View My Profile
                </Link>
            </Button>
        )}
      </CardFooter>
    </Card>
  );
}; 