'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StudentCard } from '@/components/cards/StudentCard';
import { useConnections } from '@/hooks/useConnections';
import { UserProfile, Connection, ConnectionRequest } from '@/lib/types';
import { allMockProfiles } from '@/lib/mockData';
import { getUserProfile } from '@/lib/localStorage';
import { Users, MailWarning, Send } from 'lucide-react';

const ConnectionsPage = () => {
  const { connections, sentRequests, receivedRequests, isLoading, acceptConnectionRequest, declineConnectionRequest } = useConnections();
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  const [myConnectionProfiles, setMyConnectionProfiles] = useState<UserProfile[]>([]);
  const [sentRequestProfiles, setSentRequestProfiles] = useState<UserProfile[]>([]);
  const [receivedRequestProfiles, setReceivedRequestProfiles] = useState<UserProfile[]>([]);

  useEffect(() => {
    const user = getUserProfile();
    setCurrentUser(user);
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    const myConns = connections
      .map(conn => {
        const otherUserId = conn.userId1 === currentUser.id ? conn.userId2 : conn.userId1;
        return allMockProfiles.find(p => p.id === otherUserId);
      })
      .filter(p => p !== undefined) as UserProfile[];
    setMyConnectionProfiles(myConns);

  }, [connections, currentUser]);

  useEffect(() => {
    if (!currentUser) return;
    const sentReqs = sentRequests
      .map(req => allMockProfiles.find(p => p.id === req.receiverId))
      .filter(p => p !== undefined) as UserProfile[];
    setSentRequestProfiles(sentReqs);
  }, [sentRequests, currentUser]);

  useEffect(() => {
    if (!currentUser) return;
    const receivedReqs = receivedRequests
      .map(req => allMockProfiles.find(p => p.id === req.senderId))
      .filter(p => p !== undefined) as UserProfile[];
    setReceivedRequestProfiles(receivedReqs);
  }, [receivedRequests, currentUser]);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const renderProfileList = (profiles: UserProfile[], tabName: string) => {
    if (isLoading) return <div className="text-center p-8">Loading connections...</div>;
    if (profiles.length === 0) {
      let icon = <Users className="mx-auto h-12 w-12 text-muted-foreground" />;
      let message = "No connections yet. Start exploring and connect with peers!";
      if (tabName === "Sent Requests") {
        icon = <Send className="mx-auto h-12 w-12 text-muted-foreground" />;
        message = "You haven't sent any connection requests yet.";
      }
      if (tabName === "Received Requests") {
        icon = <MailWarning className="mx-auto h-12 w-12 text-muted-foreground" />;
        message = "No new connection requests.";
      }
      return (
        <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="text-center py-12">
          {icon}
          <h3 className="mt-2 text-xl font-semibold text-foreground">{message}</h3>
        </motion.div>
      );
    }
    return (
      <motion.div 
        variants={{ visible: { transition: { staggerChildren: 0.07 } } }} 
        initial="hidden" 
        animate="visible" 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-6"
      >
        {profiles.map(profile => {
          let originalRequestId: string | undefined = undefined;
          if (tabName === "Received Requests") {
            const request = receivedRequests.find(r => r.senderId === profile.id);
            originalRequestId = request?.id;
          }

          return (
            <motion.div key={profile.id} variants={fadeInUp}>
              <StudentCard 
                profile={profile} 
                isReceivedRequest={tabName === "Received Requests"}
                requestId={originalRequestId}
              />
            </motion.div>
          );
        })}
      </motion.div>
    );
  };

  return (
    <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Manage Connections</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          View your network, pending requests, and manage your professional circle.
        </p>
      </motion.div>

      <Tabs defaultValue="my-connections" className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 h-auto md:h-10 mb-6">
          <TabsTrigger value="my-connections">My Connections ({myConnectionProfiles.length})</TabsTrigger>
          <TabsTrigger value="sent-requests">Sent Requests ({sentRequestProfiles.length})</TabsTrigger>
          <TabsTrigger value="received-requests">Received Requests ({receivedRequestProfiles.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="my-connections">
          {renderProfileList(myConnectionProfiles, "My Connections")}
        </TabsContent>
        <TabsContent value="sent-requests">
          {renderProfileList(sentRequestProfiles, "Sent Requests")}
        </TabsContent>
        <TabsContent value="received-requests">
          {renderProfileList(receivedRequestProfiles, "Received Requests")}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ConnectionsPage; 