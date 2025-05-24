'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StudentCard } from '@/components/cards/StudentCard';
import { useConnections } from '@/hooks/useConnections';
import { UserProfile } from '@/lib/types';
import { allMockProfiles } from '@/lib/mockData';
import { getUserProfile } from '@/lib/localStorage';
import { Users, MailWarning, Send, UserCheck, Loader2 } from 'lucide-react';

const ConnectionsPage = () => {
  const { 
    connections, 
    sentRequests, 
    receivedRequests, 
    isLoading,
  } = useConnections();
  
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  // Memoized profile lists to prevent re-computation on every render
  const [myConnectionProfiles, setMyConnectionProfiles] = useState<UserProfile[]>([]);
  const [sentRequestProfiles, setSentRequestProfiles] = useState<UserProfile[]>([]);
  const [receivedRequestProfiles, setReceivedRequestProfiles] = useState<UserProfile[]>([]);

  useEffect(() => {
    const user = getUserProfile();
    setCurrentUser(user);
    if (!user) {
      // router.push('/onboarding'); // Or handle appropriately
    }
  }, []);

  useEffect(() => {
    if (!currentUser || !connections) return;
    const myConns = connections
        .map(conn => {
            // Assuming Connection type has userId1 and userId2
            const otherUserId = conn.userId1 === currentUser.id ? conn.userId2 : conn.userId1;
            return allMockProfiles.find(p => p.id === otherUserId);
        })
        .filter(p => p !== undefined) as UserProfile[];
    setMyConnectionProfiles(myConns);
  }, [connections, currentUser]);

  useEffect(() => {
    if (!currentUser || !sentRequests) return;
    const sentReqs = sentRequests
        // Assuming ConnectionRequest type has receiverId
        .map(req => allMockProfiles.find(p => p.id === req.receiverId))
        .filter(p => p !== undefined) as UserProfile[];
    setSentRequestProfiles(sentReqs);
  }, [sentRequests, currentUser]);

  useEffect(() => {
    if (!currentUser || !receivedRequests) return;
    const receivedReqs = receivedRequests
        // Assuming ConnectionRequest type has senderId
        .map(req => allMockProfiles.find(p => p.id === req.senderId))
        .filter(p => p !== undefined) as UserProfile[];
    setReceivedRequestProfiles(receivedReqs);
  }, [receivedRequests, currentUser]);


  const pageVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { delay: 0.1, duration: 0.4 } },
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "circOut" } }
  };
  
  const gridVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.2 } },
  };

  const renderProfileList = (profiles: UserProfile[], tabName: string) => {
    if (isLoading && profiles.length === 0) { // Show detailed loading only if list is empty initially
        return (
            <div className="text-center p-10 min-h-[300px] flex flex-col justify-center items-center bg-card rounded-lg shadow-sm border border-border/60">
                <Loader2 className="mx-auto h-10 w-10 text-primary animate-spin mb-4" />
                <h3 className="mt-2 text-lg font-medium text-muted-foreground">Loading {tabName.toLowerCase()}...</h3>
            </div>
        );
    }
    if (profiles.length === 0) {
      let icon = <Users className="mx-auto h-16 w-16 text-primary/40" />;
      let titleMessage = "No Connections Yet";
      let subMessage = "Start exploring and connect with peers to build your network!";
      
      if (tabName === "Sent Requests") {
        icon = <Send className="mx-auto h-16 w-16 text-primary/40" />;
        titleMessage = "No Sent Requests";
        subMessage = "You haven't sent any connection requests. Find students on the browse page!";
      }
      if (tabName === "Received Requests") {
        icon = <MailWarning className="mx-auto h-16 w-16 text-primary/40" />;
        titleMessage = "No Pending Requests";
        subMessage = "You have no new connection requests at the moment.";
      }
      return (
        <motion.div 
            variants={fadeInUp} 
            initial="hidden" 
            animate="visible" 
            className="text-center py-12 md:py-16 min-h-[300px] flex flex-col justify-center items-center bg-card rounded-lg shadow-sm border border-border/60"
        >
          {icon}
          <h3 className="mt-4 text-xl font-semibold text-foreground">{titleMessage}</h3>
          <p className="mt-1 text-sm text-muted-foreground max-w-xs mx-auto">{subMessage}</p>
        </motion.div>
      );
    }
    return (
      <motion.div 
        variants={gridVariants} 
        initial="hidden" 
        animate="visible" 
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 pt-2"
      >
        {profiles.map(profile => {
          let originalRequestId: string | undefined = undefined;
          let cardProps: any = { profile };

          if (tabName === "My Connections") {
            cardProps.isMyConnection = true;
          }
          if (tabName === "Sent Requests") {
            cardProps.isSentRequest = true;
            // Find the request ID for cancellation if needed
            const request = sentRequests.find(r => r.receiverId === profile.id && r.senderId === currentUser?.id);
            originalRequestId = request?.id;
            cardProps.requestId = originalRequestId; // Pass for cancellation if needed by card
          }
          if (tabName === "Received Requests") {
            const request = receivedRequests.find(r => r.senderId === profile.id && r.receiverId === currentUser?.id);
            originalRequestId = request?.id;
            cardProps.isReceivedRequest = true;
            cardProps.requestId = originalRequestId;
          }

          return (
            <StudentCard key={profile.id} {...cardProps} />
          );
        })}
      </motion.div>
    );
  };

  return (
    <motion.div 
        variants={pageVariants}
        initial="hidden"
        animate="visible"
        className="max-w-full mx-auto py-2 sm:py-4"
    >
      <motion.div variants={fadeInUp} className="mb-6 md:mb-8 px-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">Manage Your Network</h1>
        <p className="mt-1.5 text-sm sm:text-base text-muted-foreground max-w-2xl">
          View your connections, track sent requests, and respond to incoming invitations to expand your professional circle.
        </p>
      </motion.div>

      <Tabs defaultValue="my-connections" className="w-full">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 bg-muted/70 rounded-lg p-1 h-auto shadow-inner mb-6 md:mb-8">
          <TabsTrigger value="my-connections" className="py-2.5 text-sm data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-md transition-all">
            <UserCheck className="w-4 h-4 mr-2 opacity-80" /> My Connections ({isLoading && !myConnectionProfiles.length ? '-' : myConnectionProfiles.length})
            </TabsTrigger>
          <TabsTrigger value="sent-requests" className="py-2.5 text-sm data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-md transition-all">
            <Send className="w-4 h-4 mr-2 opacity-80" /> Sent ({isLoading && !sentRequestProfiles.length ? '-' : sentRequestProfiles.length})
            </TabsTrigger>
          <TabsTrigger value="received-requests" className="py-2.5 text-sm data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-md transition-all">
            <MailWarning className="w-4 h-4 mr-2 opacity-80" /> Received ({isLoading && !receivedRequestProfiles.length ? '-' : receivedRequestProfiles.length})
            </TabsTrigger>
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
    </motion.div>
  );
};

export default ConnectionsPage; 