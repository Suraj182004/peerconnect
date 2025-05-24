'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { UserProfile } from '@/lib/types';
import { useConnections } from '@/hooks/useConnections';
import { getUserProfile } from '@/lib/localStorage';
import { allMockProfiles } from '@/lib/mockData';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Paperclip, SendHorizonal, MessageSquareText, Users, Search } from 'lucide-react';

const MessagesPage = () => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const { connections, isLoading: connectionsLoading } = useConnections();
  const [connectedProfiles, setConnectedProfiles] = useState<UserProfile[]>([]);
  const [selectedChatUser, setSelectedChatUser] = useState<UserProfile | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const user = getUserProfile();
    setCurrentUser(user);
  }, []);

  useEffect(() => {
    if (currentUser && connections.length > 0) {
      const profileIds = connections.map(conn => 
        conn.userId1 === currentUser.id ? conn.userId2 : conn.userId1
      );
      const profiles = allMockProfiles.filter(p => profileIds.includes(p.id));
      setConnectedProfiles(profiles);
    } else {
      setConnectedProfiles([]);
    }
  }, [currentUser, connections]);

  const filteredConnections = connectedProfiles.filter(profile =>
    profile.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profile.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  if (!currentUser) {
    return <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">Loading messages...</div>;
  }

  return (
    <div className="max-w-full mx-auto h-[calc(100vh-4rem-1px)] flex flex-col p-0 m-0">
      <motion.div 
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="flex-grow flex overflow-hidden border bg-card text-card-foreground shadow-sm rounded-lg m-4"
      >
        {/* Sidebar with connections list */}
        <div className="w-full sm:w-1/3 lg:w-1/4 xl:w-1/5 border-r flex flex-col h-full">
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold tracking-tight">Chats</h2>
            <div className="relative mt-2">
                <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input 
                    placeholder="Search connections..."
                    className="pl-8 h-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
          </div>
          <ScrollArea className="flex-grow">
            {connectionsLoading && <p className="p-4 text-sm text-muted-foreground">Loading connections...</p>}
            {!connectionsLoading && filteredConnections.length === 0 && (
              <div className="p-4 text-center text-sm text-muted-foreground">
                <Users className="mx-auto h-8 w-8 mb-2" />
                No connections found. <br/>Start connecting with peers!
              </div>
            )}
            {filteredConnections.map(profile => (
              <div 
                key={profile.id}
                className={`p-3 flex items-center gap-3 cursor-pointer hover:bg-muted/50 transition-colors border-b border-border/50 
                          ${selectedChatUser?.id === profile.id ? 'bg-muted' : ''}`}
                onClick={() => setSelectedChatUser(profile)}
              >
                <Avatar className="w-10 h-10 border">
                  <AvatarImage src={profile.avatar} alt={profile.firstName} />
                  <AvatarFallback>{profile.firstName[0]}{profile.lastName[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate text-foreground">{profile.firstName} {profile.lastName}</p>
                  <p className="text-xs text-muted-foreground truncate">{profile.department}</p>
                </div>
                {/* Placeholder for unread count/status */}
                {/* <Badge variant="destructive" className="h-5 px-1.5 text-xs">2</Badge> */} 
              </div>
            ))}
          </ScrollArea>
        </div>

        {/* Main chat area */}
        <div className="flex-1 flex flex-col bg-background">
          {selectedChatUser ? (
            <>
              <div className="p-4 border-b flex items-center gap-3 sticky top-0 bg-background z-10">
                <Avatar className="w-10 h-10 border">
                  <AvatarImage src={selectedChatUser.avatar} alt={selectedChatUser.firstName} />
                  <AvatarFallback>{selectedChatUser.firstName[0]}{selectedChatUser.lastName[0]}</AvatarFallback>
                </Avatar>
                <div>
                    <h3 className="font-semibold text-foreground">{selectedChatUser.firstName} {selectedChatUser.lastName}</h3>
                    <p className="text-xs text-muted-foreground">Online (Mock status)</p> {/* Mock status */}
                </div>
              </div>
              <div className="flex-grow p-6 space-y-4 overflow-y-auto">
                {/* Mock messages */}
                {[...Array(3)].map((_, i) => (
                    <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                        <div className={`max-w-[70%] p-3 rounded-xl ${i % 2 === 0 ? 'bg-muted text-muted-foreground' : 'bg-primary text-primary-foreground'}`}>
                           {i % 2 === 0 ? `Hey ${currentUser.firstName}! How are you doing? This is a mock message from ${selectedChatUser.firstName}.` : 'I am doing great! Thanks for asking. This is a mock reply.'}
                        </div>
                    </div>
                ))}
                <div className="text-center text-xs text-muted-foreground pt-4">Real-time messaging is a future feature.</div>
              </div>
              <div className="p-4 border-t sticky bottom-0 bg-background">
                <div className="relative flex items-center">
                  <Input placeholder="Type your message... (Feature in development)" className="pr-20 h-11" disabled />
                  <Button variant="ghost" size="icon" className="absolute right-11 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary" disabled>
                    <Paperclip className="w-5 h-5" />
                  </Button>
                  <Button type="submit" size="icon" className="absolute right-1 top-1/2 transform -translate-y-1/2" disabled>
                    <SendHorizonal className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <MessageSquareText className="w-16 h-16 text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold text-foreground">Select a Chat</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Choose one of your connections to start messaging (simulated).
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default MessagesPage; 