import { UserProfile, Connection, SearchFilters, LocalStorageData, ConnectionRequest } from './types';
import { STORAGE_KEYS } from './constants';

// Type-safe localStorage wrapper with error handling
class LocalStorageManager {
  private isClient = typeof window !== 'undefined';

  /**
   * Safely get an item from localStorage with JSON parsing
   */
  private getItem<T>(key: string): T | null {
    if (!this.isClient) return null;
    
    try {
      const item = localStorage.getItem(key);
      if (item === null) return null;
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Error reading from localStorage key "${key}":`, error);
      return null;
    }
  }

  /**
   * Safely set an item in localStorage with JSON stringification
   */
  private setItem<T>(key: string, value: T): boolean {
    if (!this.isClient) return false;
    
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error writing to localStorage key "${key}":`, error);
      return false;
    }
  }

  /**
   * Safely remove an item from localStorage
   */
  private removeItem(key: string): boolean {
    if (!this.isClient) return false;
    
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing from localStorage key "${key}":`, error);
      return false;
    }
  }

  /**
   * Clear all PeerConnect data from localStorage
   */
  clearAll(): boolean {
    if (!this.isClient) return false;
    
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  }

  // User Profile Methods
  getUserProfile(): UserProfile | null {
    const profile = this.getItem<UserProfile>(STORAGE_KEYS.USER_PROFILE);
    
    // Convert date strings back to Date objects
    if (profile) {
      profile.createdAt = new Date(profile.createdAt);
      profile.updatedAt = new Date(profile.updatedAt);
    }
    
    return profile;
  }

  setUserProfile(profile: UserProfile): boolean {
    return this.setItem(STORAGE_KEYS.USER_PROFILE, profile);
  }

  updateUserProfile(updates: Partial<UserProfile>): boolean {
    const currentProfile = this.getUserProfile();
    if (!currentProfile) return false;
    
    const updatedProfile: UserProfile = {
      ...currentProfile,
      ...updates,
      updatedAt: new Date(),
    };
    
    return this.setUserProfile(updatedProfile);
  }

  removeUserProfile(): boolean {
    return this.removeItem(STORAGE_KEYS.USER_PROFILE);
  }

  // Connections Methods
  getConnections(): Connection[] {
    const connections = this.getItem<Connection[]>(STORAGE_KEYS.CONNECTIONS);
    
    // Convert date strings back to Date objects
    if (connections) {
      return connections.map(conn => ({
        ...conn,
        createdAt: new Date(conn.createdAt),
      }));
    }
    
    return [];
  }

  setConnections(connections: Connection[]): boolean {
    return this.setItem(STORAGE_KEYS.CONNECTIONS, connections);
  }

  addConnection(connection: Connection): boolean {
    const currentConnections = this.getConnections();
    const updatedConnections = [...currentConnections, connection];
    return this.setConnections(updatedConnections);
  }

  updateConnection(connectionId: string, updates: Partial<Connection>): boolean {
    const connections = this.getConnections();
    const index = connections.findIndex(conn => conn.id === connectionId);
    
    if (index === -1) return false;
    
    connections[index] = { ...connections[index], ...updates };
    return this.setConnections(connections);
  }

  removeConnection(connectionId: string): boolean {
    const connections = this.getConnections();
    const filteredConnections = connections.filter(conn => conn.id !== connectionId);
    return this.setConnections(filteredConnections);
  }

  // Connection Requests Methods
  getSentConnectionRequests(): ConnectionRequest[] {
    const requests = this.getItem<ConnectionRequest[]>(STORAGE_KEYS.CONNECTION_REQUESTS);
    if (requests) {
      return requests.map(req => ({
        ...req,
        createdAt: new Date(req.createdAt),
      }));
    }
    return [];
  }

  saveSentConnectionRequests(requests: ConnectionRequest[]): boolean {
    return this.setItem(STORAGE_KEYS.CONNECTION_REQUESTS, requests);
  }

  // Received Connection Requests Methods (Dummy implementations for now)
  getReceivedConnectionRequests(): ConnectionRequest[] {
    const requests = this.getItem<ConnectionRequest[]>(STORAGE_KEYS.RECEIVED_CONNECTION_REQUESTS);
    if (requests) {
      return requests.map(req => ({
        ...req,
        createdAt: new Date(req.createdAt),
      }));
    }
    return [];
  }

  saveReceivedConnectionRequests(requests: ConnectionRequest[]): boolean {
    return this.setItem(STORAGE_KEYS.RECEIVED_CONNECTION_REQUESTS, requests);
  }

  // Onboarding Status Methods
  getOnboardingStatus(): boolean {
    return this.getItem<boolean>(STORAGE_KEYS.ONBOARDING_COMPLETE) || false;
  }

  setOnboardingStatus(completed: boolean): boolean {
    return this.setItem(STORAGE_KEYS.ONBOARDING_COMPLETE, completed);
  }

  // Search Filters Methods
  getSearchFilters(): SearchFilters {
    return this.getItem<SearchFilters>(STORAGE_KEYS.SEARCH_FILTERS) || {};
  }

  setSearchFilters(filters: SearchFilters): boolean {
    return this.setItem(STORAGE_KEYS.SEARCH_FILTERS, filters);
  }

  // UI Preferences Methods
  getUIPreferences(): LocalStorageData['uiPreferences'] {
    return this.getItem<LocalStorageData['uiPreferences']>(STORAGE_KEYS.UI_PREFERENCES) || {
      viewMode: 'grid',
      theme: 'light',
    };
  }

  setUIPreferences(preferences: LocalStorageData['uiPreferences']): boolean {
    return this.setItem(STORAGE_KEYS.UI_PREFERENCES, preferences);
  }

  updateUIPreferences(updates: Partial<LocalStorageData['uiPreferences']>): boolean {
    const current = this.getUIPreferences() || { viewMode: 'grid', theme: 'light' };
    
    // Ensure all required fields are present
    const updated = { 
      viewMode: (updates?.viewMode !== undefined) ? updates.viewMode : current.viewMode, 
      theme: (updates?.theme !== undefined) ? updates.theme : current.theme
    };
    
    return this.setUIPreferences(updated);
  }

  // Recent Searches Methods
  getRecentSearches(): string[] {
    return this.getItem<string[]>(STORAGE_KEYS.RECENT_SEARCHES) || [];
  }

  addRecentSearch(query: string): boolean {
    if (!query.trim()) return false;
    
    const searches = this.getRecentSearches();
    const filtered = searches.filter(search => search !== query);
    const updated = [query, ...filtered].slice(0, 10); // Keep only 10 recent searches
    
    return this.setItem(STORAGE_KEYS.RECENT_SEARCHES, updated);
  }

  clearRecentSearches(): boolean {
    return this.removeItem(STORAGE_KEYS.RECENT_SEARCHES);
  }

  // Bulk Operations
  exportData(): LocalStorageData | null {
    try {
      return {
        userProfile: this.getUserProfile() || undefined,
        connections: this.getConnections(),
        hasCompletedOnboarding: this.getOnboardingStatus(),
        searchFilters: this.getSearchFilters(),
        uiPreferences: this.getUIPreferences(),
      };
    } catch (error) {
      console.error('Error exporting data:', error);
      return null;
    }
  }

  importData(data: LocalStorageData): boolean {
    try {
      if (data.userProfile) {
        this.setUserProfile(data.userProfile);
      }
      
      if (data.connections) {
        this.setConnections(data.connections);
      }
      
      if (data.hasCompletedOnboarding !== undefined) {
        this.setOnboardingStatus(data.hasCompletedOnboarding);
      }
      
      if (data.searchFilters) {
        this.setSearchFilters(data.searchFilters);
      }
      
      if (data.uiPreferences) {
        this.setUIPreferences(data.uiPreferences);
      }
      
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }

  // Utility Methods
  getStorageSize(): number {
    if (!this.isClient) return 0;
    
    let size = 0;
    try {
      for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          size += localStorage[key].length;
        }
      }
    } catch (error) {
      console.error('Error calculating storage size:', error);
    }
    
    return size;
  }

  isStorageAvailable(): boolean {
    if (!this.isClient) return false;
    
    try {
      const test = '__localStorage_test__';
      localStorage.setItem(test, 'test');
      localStorage.removeItem(test);
      return true;
    } catch (error) {
      return false;
    }
  }
}

// Create and export a singleton instance
export const localStorageManager = new LocalStorageManager();

// Convenience functions for common operations
export const getUserProfile = () => localStorageManager.getUserProfile();
export const setUserProfile = (profile: UserProfile) => localStorageManager.setUserProfile(profile);
export const updateUserProfile = (updates: Partial<UserProfile>) => localStorageManager.updateUserProfile(updates);

export const getConnections = () => localStorageManager.getConnections();
export const setConnections = (connections: Connection[]) => localStorageManager.setConnections(connections);
export const addConnection = (connection: Connection) => localStorageManager.addConnection(connection);

export const getSentConnectionRequests = () => localStorageManager.getSentConnectionRequests();
export const saveSentConnectionRequests = (requests: ConnectionRequest[]) => localStorageManager.saveSentConnectionRequests(requests);

export const getReceivedConnectionRequests = () => localStorageManager.getReceivedConnectionRequests();
export const saveReceivedConnectionRequests = (requests: ConnectionRequest[]) => localStorageManager.saveReceivedConnectionRequests(requests);

export const getOnboardingStatus = () => localStorageManager.getOnboardingStatus();
export const setOnboardingStatus = (completed: boolean) => localStorageManager.setOnboardingStatus(completed);

export const getSearchFilters = () => localStorageManager.getSearchFilters();
export const setSearchFilters = (filters: SearchFilters) => localStorageManager.setSearchFilters(filters);

export const getUIPreferences = () => localStorageManager.getUIPreferences();
export const setUIPreferences = (preferences: LocalStorageData['uiPreferences']) => localStorageManager.setUIPreferences(preferences);

// Default export for the manager instance
export default localStorageManager; 