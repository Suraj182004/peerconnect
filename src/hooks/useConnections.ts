import { useContext } from 'react';
import { ConnectionsContext } from '@/contexts/ConnectionsContext';

export const useConnections = () => {
  const context = useContext(ConnectionsContext);
  if (context === undefined) {
    throw new Error('useConnections must be used within a ConnectionsProvider. Make sure your component is a child of ConnectionsProvider.');
  }
  return context;
}; 