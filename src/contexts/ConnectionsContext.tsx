'use client';

import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { Connection, ConnectionRequest, ConnectionStatus, UserProfile } from '@/lib/types';
import localStorageManager from '@/lib/localStorage';

interface ConnectionsContextType {
  connections: Connection[];
  sentRequests: ConnectionRequest[];
  receivedRequests: ConnectionRequest[];
  sendConnectionRequest: (targetUserId: string, currentUserId: string) => Promise<void>;
  acceptConnectionRequest: (requestId: string) => Promise<void>;
  declineConnectionRequest: (requestId: string) => Promise<void>;
  getConnectionStatus: (targetUserId: string, currentUserId: string) => ConnectionStatus | 'none';
  isLoading: boolean;
  getConnectionsByUserId: (userId: string) => Connection[];
}

export const ConnectionsContext = createContext<ConnectionsContextType | undefined>(undefined);

interface ConnectionsProviderProps {
  children: ReactNode;
}

export const ConnectionsProvider: React.FC<ConnectionsProviderProps> = ({ children }) => {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [sentRequests, setSentRequests] = useState<ConnectionRequest[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<ConnectionRequest[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setConnections(localStorageManager.getConnections());
    setSentRequests(localStorageManager.getSentConnectionRequests());
    setReceivedRequests(localStorageManager.getReceivedConnectionRequests() || []);
  }, []);

  const internalSaveConnections = useCallback((updatedConnections: Connection[]) => {
    setConnections(updatedConnections);
    localStorageManager.setConnections(updatedConnections);
  }, []);

  const internalSaveSentRequests = useCallback((updatedRequests: ConnectionRequest[]) => {
    setSentRequests(updatedRequests);
    localStorageManager.saveSentConnectionRequests(updatedRequests);
  }, []);

  const internalSaveReceivedRequests = useCallback((updatedRequests: ConnectionRequest[]) => {
    setReceivedRequests(updatedRequests);
    localStorageManager.saveReceivedConnectionRequests(updatedRequests);
  }, []);

  const getConnectionStatus = useCallback((targetUserId: string, currentUserId: string): ConnectionStatus | 'none' => {
    if (!currentUserId) return 'none';
    
    const isConnected = connections.some(
      (conn) =>
        conn.status === 'accepted' &&
        ((conn.userId1 === currentUserId && conn.userId2 === targetUserId) ||
          (conn.userId1 === targetUserId && conn.userId2 === currentUserId))
    );
    if (isConnected) return 'accepted';

    const hasPendingRequest = sentRequests.some(
      (req) =>
        req.senderId === currentUserId &&
        req.receiverId === targetUserId &&
        req.status === 'pending'
    );
    if (hasPendingRequest) return 'pending';
    
    return 'none';
  }, [connections, sentRequests]);

  const sendConnectionRequest = useCallback(async (targetUserId: string, currentUserId: string) => {
    if (!currentUserId) {
      toast.error("User not identified. Cannot send connection request.");
      return;
    }
    
    const existingStatus = getConnectionStatus(targetUserId, currentUserId);
    if (existingStatus !== 'none') {
      toast.info(`Connection status is already '${existingStatus}'.`);
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading('Sending connection request...');

    const newRequest: ConnectionRequest = {
      id: uuidv4(),
      senderId: currentUserId,
      receiverId: targetUserId,
      status: 'pending',
      createdAt: new Date(), 
    };

    const updatedSentRequests = [...sentRequests, newRequest];
    internalSaveSentRequests(updatedSentRequests);

    await new Promise(resolve => setTimeout(resolve, 1200)); // Simulate API call

    // Simulate auto-acceptance for simplicity
    const acceptedConnection: Connection = {
      id: uuidv4(), 
      userId1: currentUserId, 
      userId2: targetUserId,
      status: 'accepted',
      createdAt: new Date(),
    };
    
    const finalSentRequests = updatedSentRequests.filter(req => req.id !== newRequest.id);
    internalSaveSentRequests(finalSentRequests);

    const updatedConnections = [...connections, acceptedConnection];
    internalSaveConnections(updatedConnections);
    
    setIsLoading(false);
    toast.success('Connection request accepted!', { id: toastId });
  }, [connections, sentRequests, internalSaveConnections, internalSaveSentRequests, getConnectionStatus]);

  const acceptConnectionRequest = useCallback(async (requestId: string) => {
    setIsLoading(true);
    const toastId = toast.loading('Accepting connection request...');
    
    const requestToAccept = receivedRequests.find(req => req.id === requestId);
    if (!requestToAccept) {
      toast.error('Request not found.', { id: toastId });
      setIsLoading(false);
      return;
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Create new connection
    const newConnection: Connection = {
      id: uuidv4(),
      userId1: requestToAccept.senderId,
      userId2: requestToAccept.receiverId,
      status: 'accepted',
      createdAt: new Date(),
    };
    internalSaveConnections([...connections, newConnection]);

    // Remove from received requests
    internalSaveReceivedRequests(receivedRequests.filter(req => req.id !== requestId));

    setIsLoading(false);
    toast.success('Connection accepted!', { id: toastId });
  }, [receivedRequests, connections, internalSaveConnections, internalSaveReceivedRequests]);

  const declineConnectionRequest = useCallback(async (requestId: string) => {
    setIsLoading(true);
    const toastId = toast.loading('Declining connection request...');

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 700));
    
    // Remove from received requests
    internalSaveReceivedRequests(receivedRequests.filter(req => req.id !== requestId));
    
    setIsLoading(false);
    toast.success('Connection declined.', { id: toastId });
  }, [receivedRequests, internalSaveReceivedRequests]);
  
  const getConnectionsByUserId = useCallback((userId: string): Connection[] => {
    return connections.filter(conn => (conn.userId1 === userId || conn.userId2 === userId) && conn.status === 'accepted');
  }, [connections]);

  return (
    <ConnectionsContext.Provider value={{ 
      connections, 
      sentRequests, 
      receivedRequests,
      sendConnectionRequest, 
      acceptConnectionRequest,
      declineConnectionRequest,
      getConnectionStatus, 
      isLoading,
      getConnectionsByUserId
    }}>
      {children}
    </ConnectionsContext.Provider>
  );
}; 