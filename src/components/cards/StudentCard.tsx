'use client';

import { UserProfile } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { UserPlus, UserCheck, Clock, CheckCircle, XCircle, MessageSquare, Eye, ThumbsUp } from 'lucide-react';
import Link from 'next/link';
import { useConnections } from '@/hooks/useConnections';
import { getUserProfile } from '@/lib/localStorage';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface StudentCardProps {
  profile: UserProfile;
  isReceivedRequest?: boolean;
  isSentRequest?: boolean;
  isMyConnection?: boolean;
  requestId?: string;
  onCancelSentRequest?: (profileId: string) => void;
  onRemoveConnection?: (profileId: string) => void;
}

export const StudentCard = ({ 
    profile, 
    isReceivedRequest,
    isSentRequest,
    isMyConnection,
    requestId,
}: StudentCardProps) => {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const {
    getConnectionStatus,
    sendConnectionRequest,
    acceptConnectionRequest,
    declineConnectionRequest,
    cancelSentRequest,
    removeConnection,
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

  const handleAccept = async () => {
    if (requestId) await acceptConnectionRequest(requestId);
  };

  const handleDecline = async () => {
    if (requestId) await declineConnectionRequest(requestId);
  };
  
  const handleCancelSent = async () => {
    if (currentUserId) {
        const reqId = useConnections().sentRequests.find(r => r.receiverId === profile.id && r.senderId === currentUserId)?.id;
        if (reqId) await cancelSentRequest(reqId);
    }
  };

  const handleRemoveConnection = async () => {
    if (currentUserId) {
        const conn = useConnections().connections.find(c => (c.userId1 === currentUserId && c.userId2 === profile.id) || (c.userId1 === profile.id && c.userId2 === currentUserId));
        if(conn) await removeConnection(conn.id);
    }
  };

  const isConnectButtonDisabled = () => {
    return connectionsLoading || status === 'pending' || status === 'accepted';
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "circOut" } },
  };

  if (!profile) return null;

  return (
    <motion.div variants={cardVariants} className="h-full">
      <Card className="w-full overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col h-full bg-card border border-border/70 hover:border-primary/30 transform hover:-translate-y-0.5">
        <CardHeader className="p-0 relative items-center flex flex-col">
          <div className="h-20 w-full bg-gradient-to-br from-muted to-muted/50" /> 
          <Link href={`/dashboard/profile/${profile.id}`} className="block mt-[-40px] z-10 relative group">
            <Avatar className="w-20 h-20 rounded-full border-4 border-card bg-card shadow-md group-hover:scale-105 group-hover:shadow-lg transition-all duration-200">
              <AvatarImage src={profile.avatar} alt={`${profile.firstName} ${profile.lastName}`} />
              <AvatarFallback className="text-2xl font-semibold">
                {profile.firstName[0]}{profile.lastName[0]}
              </AvatarFallback>
            </Avatar>
          </Link>
        </CardHeader>
        <CardContent className="pt-5 pb-4 px-4 text-center flex-grow flex flex-col items-center">
          <Link href={`/dashboard/profile/${profile.id}`} className="block">
            <CardTitle className="text-lg font-semibold text-foreground hover:text-primary transition-colors">
              {profile.firstName} {profile.lastName}
            </CardTitle>
          </Link>
          <p className="text-sm text-muted-foreground mt-0.5">{profile.department}</p>
          <p className="text-xs text-muted-foreground mb-2">{profile.university}</p>
          
          {profile.bio && 
            <p className="text-xs text-muted-foreground mt-2 px-2 line-clamp-2 text-balance flex-grow max-h-[40px] overflow-hidden">
              {profile.bio}
            </p>
          }

          {profile.skills && profile.skills.length > 0 && (
            <div className="mt-3 pt-3 border-t border-border/50 w-full">
              <div className="flex flex-wrap justify-center gap-1.5 px-1">
                {profile.skills.slice(0, 3).map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-xs px-2 py-0.5 font-normal border-transparent shadow-sm">
                    {skill}
                  </Badge>
                ))}
                {profile.skills.length > 3 && (
                  <Badge variant="outline" className="text-xs px-2 py-0.5 font-normal border-border/70">
                    +{profile.skills.length - 3}
                  </Badge>
                )}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="p-3 border-t border-border/50 mt-auto bg-muted/30">
          {currentUserId && profile.id !== currentUserId && (
            <> 
            {isReceivedRequest && requestId ? (
              <div className="w-full flex gap-2">
                <Button 
                  size="sm"
                  className="flex-1 bg-destructive/15 text-destructive hover:bg-destructive/25 border-destructive/30 hover:border-destructive/50 border shadow-sm"
                  variant="outline"
                  onClick={handleDecline} 
                  disabled={connectionsLoading}
                >
                  <XCircle className="w-4 h-4 mr-1.5" /> Decline
                </Button>
                <Button 
                  size="sm"
                  className="flex-1 bg-green-500/15 text-green-600 hover:bg-green-500/25 border-green-500/30 hover:border-green-500/50 border shadow-sm"
                  variant="outline"
                  onClick={handleAccept} 
                  disabled={connectionsLoading}
                >
                  <CheckCircle className="w-4 h-4 mr-1.5" /> Accept
                </Button>
              </div>
            ) : isSentRequest ? (
                 <Button 
                    size="sm"
                    className="w-full shadow-sm"
                    variant="outline"
                    onClick={handleCancelSent}
                    disabled={connectionsLoading || status !== 'pending'}
                >
                    <Clock className="w-4 h-4 mr-1.5" /> Request Sent (Cancel)
                </Button>
            ) : isMyConnection ? (
                <div className="w-full flex gap-2">
                    <Button size="sm" className="flex-1 shadow-sm" variant="outline" asChild>
                        <Link href={`/dashboard/messages?with=${profile.id}`}>
                            <MessageSquare className="w-4 h-4 mr-1.5" /> Message
                        </Link>
                    </Button>
                    <Button 
                        size="sm" 
                        className="flex-1 shadow-sm text-destructive border-destructive/50 hover:bg-destructive/10 hover:text-destructive-foreground"
                        variant="outline" 
                        onClick={handleRemoveConnection} 
                        disabled={connectionsLoading}
                    > 
                        <UserCheck className="w-4 h-4 mr-1.5" /> Unfriend
                    </Button>
                </div>
            ) : (
              <Button 
                size="sm"
                className="w-full shadow-sm transition-all duration-200 hover:shadow-md"
                variant={status === 'pending' ? 'outline' : 'default'}
                onClick={handleConnect}
                disabled={isConnectButtonDisabled()}
              >
                {status === 'pending' ? <Clock className="w-4 h-4 mr-1.5" /> : <UserPlus className="w-4 h-4 mr-1.5" />}
                {status === 'pending' ? 'Request Sent' : status === 'accepted' ? 'Connected' : 'Connect'}
                {status === 'accepted' && <ThumbsUp className="w-4 h-4 ml-1.5 text-green-400" />} 
              </Button>
            )}
            </>
          )}
          {currentUserId && profile.id === currentUserId && (
            <Button size="sm" className="w-full shadow-sm" variant="outline" asChild>
                <Link href={`/dashboard/profile/${currentUserId}`}>
                    <Eye className="w-4 h-4 mr-1.5" /> View My Profile
                </Link>
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}; 