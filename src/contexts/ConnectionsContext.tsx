'use client';

import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { Connection, ConnectionRequest, ConnectionStatus } from '@/lib/types';
import localStorageManager from '@/lib/localStorage';

interface ConnectionsContextType {
  connections: Connection[];
  sentRequests: ConnectionRequest[];
  receivedRequests: ConnectionRequest[];
  sendConnectionRequest: (targetUserId: string, currentUserId: string) => Promise<void>;
  acceptConnectionRequest: (requestId: string) => Promise<void>;
  declineConnectionRequest: (requestId: string) => Promise<void>;
  removeConnection: (connectionId: string) => Promise<void>;
  cancelSentRequest: (requestId: string) => Promise<void>;
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
    
    // Check if there is a received request from the target user
    const hasReceivedRequest = receivedRequests.some(
      (req) => 
        req.senderId === targetUserId &&
        req.receiverId === currentUserId &&
        req.status === 'pending'
    );
    if (hasReceivedRequest) return 'pending'; // Treat as pending from our perspective to show "Accept/Decline"

    return 'none';
  }, [connections, sentRequests, receivedRequests]);

  const sendConnectionRequest = useCallback(async (targetUserId: string, currentUserId: string) => {
    if (!currentUserId) {
      toast.error("User not identified. Cannot send connection request.");
      return;
    }
    
    const existingStatus = getConnectionStatus(targetUserId, currentUserId);
    if (existingStatus === 'accepted') {
      toast.info(`You are already connected with this user.`);
      return;
    }
    if (existingStatus === 'pending') {
      toast.info(`A connection request is already pending or received from this user.`);
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

    // Add to sent requests
    const updatedSentRequests = [...sentRequests, newRequest];
    internalSaveSentRequests(updatedSentRequests);

    // Simulate sending to the other user (add to their received requests)
    // In a real backend, the server would handle this.
    // For now, we'll simulate by trying to update the global mock data if possible or just toast.
    // This part is tricky in a pure frontend setup without a central store for all users' received requests.
    // For this simulation, we assume the target user will see it if they fetch their received requests.
    // We also simulate auto-acceptance to simplify the flow for now.

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
    toast.success('Connection request accepted! (Simulated auto-accept)', { id: toastId });
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

    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

    const newConnection: Connection = {
      id: uuidv4(),
      userId1: requestToAccept.senderId,
      userId2: requestToAccept.receiverId,
      status: 'accepted',
      createdAt: new Date(),
    };
    internalSaveConnections([...connections, newConnection]);
    internalSaveReceivedRequests(receivedRequests.filter(req => req.id !== requestId));

    setIsLoading(false);
    toast.success('Connection accepted!', { id: toastId });
  }, [receivedRequests, connections, internalSaveConnections, internalSaveReceivedRequests]);

  const declineConnectionRequest = useCallback(async (requestId: string) => {
    setIsLoading(true);
    const toastId = toast.loading('Declining connection request...');
    await new Promise(resolve => setTimeout(resolve, 700)); // Simulate API call
    internalSaveReceivedRequests(receivedRequests.filter(req => req.id !== requestId));
    setIsLoading(false);
    toast.success('Connection declined.', { id: toastId });
  }, [receivedRequests, internalSaveReceivedRequests]);

  const removeConnection = useCallback(async (connectionId: string) => {
    setIsLoading(true);
    const toastId = toast.loading('Removing connection...');
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API call
    
    const success = localStorageManager.removeConnection(connectionId); // Use the existing LS manager function
    if (success) {
      setConnections(prevConns => prevConns.filter(conn => conn.id !== connectionId));
      toast.success('Connection removed.', { id: toastId });
    } else {
      toast.error('Failed to remove connection.', { id: toastId });
    }
    setIsLoading(false);
  }, [internalSaveConnections]); // internalSaveConnections might not be needed if LS manager handles it and we re-fetch or filter state.
                                 // For now, explicitly setting state after LS call.

  const cancelSentRequest = useCallback(async (requestId: string) => {
    setIsLoading(true);
    const toastId = toast.loading('Cancelling request...');
    await new Promise(resolve => setTimeout(resolve, 700)); // Simulate API call

    const updatedSentRequests = sentRequests.filter(req => req.id !== requestId);
    internalSaveSentRequests(updatedSentRequests);

    setIsLoading(false);
    toast.success('Request cancelled.', { id: toastId });
  }, [sentRequests, internalSaveSentRequests]);
  
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
      removeConnection,
      cancelSentRequest,
      getConnectionStatus, 
      isLoading,
      getConnectionsByUserId
    }}>
      {children}
    </ConnectionsContext.Provider>
  );
}; 