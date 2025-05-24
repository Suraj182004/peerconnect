// Import the constant array

// Core User Types
export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  collegeId: string;
  year: string;
  department: string;
  avatar?: string;
  skills: string[];
  interests: string[];
  projectAreas: string[];
  bio?: string;
  university?: string;
  location?: string;
  socialLinks?: SocialLinks;
  createdAt: Date;
  updatedAt: Date;
  recentActivity?: UserActivity[];
  projects?: Project[];
  experience?: Experience[];
}

export interface SocialLinks {
  linkedin?: string;
  github?: string;
  twitter?: string;
  portfolio?: string;
}

// Connection Types
export interface Connection {
  id: string;
  userId1: string;
  userId2: string;
  status: ConnectionStatus;
  createdAt: Date;
  message?: string;
}

export type ConnectionStatus = 'pending' | 'accepted' | 'declined' | 'blocked';

export interface ConnectionRequest {
  id: string;
  senderId: string;
  receiverId: string;
  message?: string;
  status: ConnectionStatus;
  createdAt: Date;
}

// Search and Filter Types
export interface SearchFilters {
  query?: string;
  departments?: string[];
  years?: string[];
  skills?: string[];
  interests?: string[];
  projectAreas?: string[];
}

export interface SortOption {
  value: string;
  label: string;
}

// Activity Types
export interface Activity {
  id: string;
  userId: string;
  type: ActivityType;
  title: string;
  description?: string;
  createdAt: Date;
  metadata?: Record<string, unknown>;
}

export type ActivityType = 
  | 'profile_created'
  | 'connection_made'
  | 'skill_added'
  | 'project_shared'
  | 'project_updated'
  | 'experience_added'
  | 'profile_updated';

// Dashboard Stats
export interface DashboardStats {
  totalConnections: number;
  profileViews: number;
  newMessages: number;
}

// Form Data Types
export interface Step1Data {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface Step2Data {
  university: string;
  collegeId: string;
  year: string;
  department: string;
}

export interface Step3Data {
  skills: string[];
  interests: string[];
  projectAreas: string[];
}

export interface Step4Data {
  bio?: string;
  profilePicture?: string | File;
  socialLinks?: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    portfolio?: string;
  };
}

export interface OnboardingFormData {
  step1?: Step1Data;
  step2?: Step2Data;
  step3?: Step3Data;
  step4?: Step4Data;
}

// Component Props Types
export interface StudentCardProps {
  profile: UserProfile;
  onConnect: (userId: string) => void;
  isConnected?: boolean;
  connectionStatus?: ConnectionStatus;
  showConnectButton?: boolean;
}

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
}

export interface FilterPanelProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  availableOptions: FilterOptions;
}

export interface FilterOptions {
  departments: string[];
  years: string[];
  skills: string[];
  interests: string[];
  projectAreas: string[];
}

// Context Types
export interface UserContextType {
  currentUser: UserProfile | null;
  setCurrentUser: (user: UserProfile | null) => void;
  hasCompletedOnboarding: boolean;
  setHasCompletedOnboarding: (completed: boolean) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

export interface ConnectionsContextType {
  connections: Connection[];
  sentRequests: Connection[];
  receivedRequests: Connection[];
  sendConnectionRequest: (toUserId: string, message?: string) => Promise<void>;
  acceptConnectionRequest: (requestId: string) => Promise<void>;
  declineConnectionRequest: (requestId: string) => Promise<void>;
  removeConnection: (connectionId: string) => Promise<void>;
  getConnectionStatus: (userId: string) => ConnectionStatus | null;
}

export interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filters: SearchFilters;
  setFilters: (filters: SearchFilters) => void;
  searchResults: UserProfile[];
  isSearching: boolean;
  performSearch: () => void;
  clearSearch: () => void;
}

export interface UIContextType {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  removeNotification: (id: string) => void;
}

// Notification Types
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  createdAt: Date;
  duration?: number;
}

// Animation Types
export interface AnimationVariants {
  hidden: {
    opacity: number;
    y?: number;
    x?: number;
    scale?: number;
  };
  visible: {
    opacity: number;
    y?: number;
    x?: number;
    scale?: number;
    transition?: {
      duration?: number;
      delay?: number;
      ease?: string;
      staggerChildren?: number;
    };
  };
}

// API Response Types (for future backend integration)
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Local Storage Types
export interface LocalStorageData {
  userProfile?: UserProfile;
  connections?: Connection[];
  hasCompletedOnboarding?: boolean;
  searchFilters?: SearchFilters;
  uiPreferences?: {
    viewMode: 'grid' | 'list';
    theme: 'light' | 'dark';
  };
}

// Error Types
export interface AppError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

// Department and Year Constants
export const DEPARTMENTS = [
  'Computer Science',
  'Engineering',
  'Business Administration',
  'Medicine',
  'Law',
  'Arts & Humanities',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Psychology',
  'Economics',
  'Marketing',
  'Design',
  'Architecture'
] as const;

export const ACADEMIC_YEARS = [
  'Freshman',
  'Sophomore',
  'Junior',
  'Senior',
  'Graduate',
  'PhD'
] as const;

export const POPULAR_SKILLS = [
  'JavaScript',
  'React',
  'Python',
  'Node.js',
  'TypeScript',
  'Java',
  'C++',
  'Machine Learning',
  'Data Science',
  'UI/UX Design',
  'Project Management',
  'Marketing',
  'Public Speaking',
  'Leadership',
  'Research',
  'Writing',
  'Photography',
  'Video Editing'
] as const;

export const INTERESTS = [
  'Web Development',
  'Mobile Apps',
  'AI/ML',
  'Data Science',
  'Cybersecurity',
  'Game Development',
  'Startup',
  'Research',
  'Design',
  'Marketing',
  'Photography',
  'Music',
  'Sports',
  'Travel',
  'Reading',
  'Volunteering',
  'Entrepreneurship',
  'Sustainability'
] as const;

export const PROJECT_AREAS = [
  "Web Development",
  "Mobile App Development",
  "Data Science",
  "Machine Learning",
  "Artificial Intelligence",
  "Cybersecurity",
  "Cloud Computing",
  "Game Development",
  "UI/UX Design",
  "Blockchain Technology",
  "Internet of Things (IoT)",
  "Robotics",
  "Quantum Computing",
  "Bioinformatics",
  "Augmented Reality (AR)",
  "Virtual Reality (VR)",
] as const;

export type Department = typeof DEPARTMENTS[number];
export type AcademicYear = typeof ACADEMIC_YEARS[number];
export type Skill = typeof POPULAR_SKILLS[number];
export type Interest = typeof INTERESTS[number];
export type ProjectArea = typeof PROJECT_AREAS[number];

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: string;
  color?: string;
}

export interface UserActivity {
  id: string;
  user?: {
    id: string;
    name: string;
    avatar?: string;
  };
  type: ActivityType;
  description: string;
  timestamp: string;
  details?: {
    title?: string;
    content?: string;
    link?: string;
  };
  icon?: string;
}

// Project and Experience Types
export interface Project {
  id: string;
  title: string;
  description: string;
  technologies?: string[];
  startDate?: string; // Or Date
  endDate?: string; // Or Date
  url?: string;
  repoUrl?: string;
  imageUrl?: string;
  projectUrl?: string;
  teamMembers?: string;
}

export interface Experience {
  id: string;
  title: string;
  companyName: string;
  location?: string;
  employmentType?: 'Full-time' | 'Part-time' | 'Internship' | 'Freelance' | 'Contract' | 'Volunteer';
  startDate: string; // Or Date
  endDate?: string; // Or Date, or 'Present'
  description: string;
  skills?: string[];
  companyLogo?: string;
} 