// App Configuration
export const APP_CONFIG = {
  name: 'PeerConnect',
  description: 'Student Networking Platform',
  version: '1.0.0',
  maxFileSize: 5 * 1024 * 1024, // 5MB
  supportedImageTypes: ['image/jpeg', 'image/png', 'image/webp'],
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  USER_PROFILE: 'peerconnect_user_profile',
  CONNECTIONS: 'peerconnect_connections',
  CONNECTION_REQUESTS: 'peerconnect_connection_requests',
  RECEIVED_CONNECTION_REQUESTS: 'peerconnect_received_connection_requests',
  ONBOARDING_COMPLETE: 'peerconnect_onboarding_complete',
  SEARCH_FILTERS: 'peerconnect_search_filters',
  UI_PREFERENCES: 'peerconnect_ui_preferences',
  RECENT_SEARCHES: 'peerconnect_recent_searches',
} as const;

// Animation Durations (in milliseconds)
export const ANIMATION_DURATION = {
  FAST: 150,
  MEDIUM: 300,
  SLOW: 500,
  VERY_SLOW: 800,
} as const;

// Breakpoints (matching Tailwind CSS)
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;

// Search Configuration
export const SEARCH_CONFIG = {
  DEBOUNCE_MS: 300,
  MIN_QUERY_LENGTH: 2,
  MAX_RESULTS: 50,
  RESULTS_PER_PAGE: 12,
  BROWSE_PAGE_SIZE: 9,
} as const;

// Connection Limits
export const CONNECTION_LIMITS = {
  MAX_CONNECTIONS: 500,
  MAX_PENDING_REQUESTS: 50,
  CONNECTION_MESSAGE_MAX_LENGTH: 200,
} as const;

// Form Validation Rules
export const VALIDATION_RULES = {
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50,
  },
  EMAIL: {
    PATTERN: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBER: true,
    REQUIRE_SPECIAL_CHAR: false,
  },
  COLLEGE_ID: {
    MIN_LENGTH: 5,
    MAX_LENGTH: 20,
  },
  BIO: {
    MAX_LENGTH: 500,
  },
  SKILLS: {
    MIN_COUNT: 3,
    MAX_COUNT: 20,
    MAX_LENGTH: 30,
  },
  INTERESTS: {
    MIN_COUNT: 2,
    MAX_COUNT: 15,
    MAX_LENGTH: 30,
  },
  PROJECT_AREAS: {
    MIN_COUNT: 1,
    MAX_COUNT: 10,
    MAX_LENGTH: 50,
  },
} as const;

// Notification Configuration
export const NOTIFICATION_CONFIG = {
  DEFAULT_DURATION: 5000, // 5 seconds
  SUCCESS_DURATION: 3000,
  ERROR_DURATION: 8000,
  WARNING_DURATION: 6000,
  INFO_DURATION: 4000,
  MAX_NOTIFICATIONS: 5,
} as const;

// API Endpoints (for future backend integration)
export const API_ENDPOINTS = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api',
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
  },
  USERS: {
    PROFILE: '/users/profile',
    SEARCH: '/users/search',
    UPDATE: '/users/update',
  },
  CONNECTIONS: {
    LIST: '/connections',
    REQUEST: '/connections/request',
    ACCEPT: '/connections/accept',
    DECLINE: '/connections/decline',
    REMOVE: '/connections/remove',
  },
} as const;

// Social Media Platforms
export const SOCIAL_PLATFORMS = {
  LINKEDIN: {
    name: 'LinkedIn',
    baseUrl: 'https://linkedin.com/in/',
    icon: 'linkedin',
    color: '#0077B5',
  },
  GITHUB: {
    name: 'GitHub',
    baseUrl: 'https://github.com/',
    icon: 'github',
    color: '#333333',
  },
  TWITTER: {
    name: 'Twitter',
    baseUrl: 'https://twitter.com/',
    icon: 'twitter',
    color: '#1DA1F2',
  },
  PORTFOLIO: {
    name: 'Portfolio',
    baseUrl: '',
    icon: 'globe',
    color: '#6B7280',
  },
} as const;

// Dashboard Quick Actions
export const QUICK_ACTIONS = [
  {
    id: 'browse',
    title: 'Browse Students',
    description: 'Discover new peers in your field',
    icon: 'users',
    href: '/dashboard/browse',
    color: 'primary',
  },
  {
    id: 'connections',
    title: 'My Connections',
    description: 'View and manage your network',
    icon: 'user-check',
    href: '/dashboard/connections',
    color: 'secondary',
  },
  {
    id: 'profile',
    title: 'Edit Profile',
    description: 'Update your information',
    icon: 'user-cog',
    href: '/dashboard/profile',
    color: 'accent',
  },
  {
    id: 'messages',
    title: 'Messages',
    description: 'Chat with your connections',
    icon: 'message-circle',
    href: '/dashboard/messages',
    color: 'warning',
  },
] as const;

// Navigation Items
export const NAVIGATION_ITEMS = [
  {
    id: 'home',
    label: 'Home',
    href: '/dashboard',
    icon: 'home',
  },
  {
    id: 'network',
    label: 'Network',
    href: '/dashboard/browse',
    icon: 'users',
  },
  {
    id: 'connections',
    label: 'Connections',
    href: '/dashboard/connections',
    icon: 'user-check',
  },
  {
    id: 'profile',
    label: 'Profile',
    href: '/dashboard/profile',
    icon: 'user',
  },
] as const;

// Sort Options for Student Browse
export const SORT_OPTIONS = [
  {
    value: 'newest',
    label: 'Newest Members',
  },
  {
    value: 'connections',
    label: 'Most Connected',
  },
  {
    value: 'skills',
    label: 'Similar Skills',
  },
  {
    value: 'department',
    label: 'Same Department',
  },
  {
    value: 'year',
    label: 'Same Year',
  },
] as const;

// Filter Categories
export const FILTER_CATEGORIES = {
  DEPARTMENT: {
    key: 'departments',
    label: 'Department',
    icon: 'building',
  },
  YEAR: {
    key: 'years',
    label: 'Academic Year',
    icon: 'calendar',
  },
  SKILLS: {
    key: 'skills',
    label: 'Skills',
    icon: 'code',
  },
  INTERESTS: {
    key: 'interests',
    label: 'Interests',
    icon: 'heart',
  },
  PROJECT_AREAS: {
    key: 'projectAreas',
    label: 'Project Areas',
    icon: 'folder',
  },
} as const;

// Achievement Badges (for gamification)
export const ACHIEVEMENTS = {
  FIRST_CONNECTION: {
    id: 'first_connection',
    title: 'First Connection',
    description: 'Made your first connection!',
    icon: 'user-plus',
    color: 'success',
  },
  NETWORK_BUILDER: {
    id: 'network_builder',
    title: 'Network Builder',
    description: 'Connected with 10 students',
    icon: 'users',
    color: 'primary',
  },
  SKILL_MASTER: {
    id: 'skill_master',
    title: 'Skill Master',
    description: 'Added 10 skills to your profile',
    icon: 'star',
    color: 'accent',
  },
  PROFILE_COMPLETE: {
    id: 'profile_complete',
    title: 'Profile Complete',
    description: 'Completed your full profile',
    icon: 'check-circle',
    color: 'success',
  },
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Unable to connect. Please check your internet connection.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  USER_NOT_FOUND: 'User not found.',
  ALREADY_CONNECTED: 'You are already connected with this user.',
  CONNECTION_LIMIT_REACHED: 'Connection limit reached.',
  INVALID_FILE_TYPE: 'Please upload a valid image file (JPEG, PNG, or WebP).',
  FILE_TOO_LARGE: 'File size must be less than 5MB.',
  FORM_VALIDATION_ERROR: 'Please correct the errors below.',
  GENERIC_ERROR: 'Something went wrong. Please try again.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  PROFILE_UPDATED: 'Profile updated successfully!',
  CONNECTION_SENT: 'Connection request sent!',
  CONNECTION_ACCEPTED: 'Connection request accepted!',
  CONNECTION_REMOVED: 'Connection removed successfully.',
  PROFILE_CREATED: 'Welcome to PeerConnect! Your profile has been created.',
  ONBOARDING_COMPLETE: 'Onboarding completed! Let\'s start networking.',
} as const;

// Loading States
export const LOADING_STATES = {
  INITIAL: 'Loading...',
  SEARCHING: 'Searching students...',
  CONNECTING: 'Sending connection request...',
  UPDATING: 'Updating profile...',
  UPLOADING: 'Uploading image...',
} as const;

// Default Values
export const DEFAULTS = {
  AVATAR_PLACEHOLDER: '/images/default-avatar.png',
  PROFILE_BANNER: '/images/default-banner.jpg',
  ITEMS_PER_PAGE: 12,
  SEARCH_DEBOUNCE: 300,
  NOTIFICATION_DURATION: 5000,
} as const;

// Universities (for dropdown)
export const UNIVERSITIES = [
  'Stanford University',
  'Harvard University',
  'MIT',
  'UC Berkeley',
  'UCLA',
  'University of Washington',
  'Carnegie Mellon University',
  'University of Texas at Austin',
  'Georgia Institute of Technology',
  'University of Illinois',
  'University of Michigan',
  'Princeton University',
  'Yale University',
  'Columbia University',
  'NYU',
  'Other',
] as const;

// Project Areas
export const PROJECT_AREAS = [
  'Web Development',
  'Mobile Development',
  'AI/Machine Learning',
  'Data Science',
  'Cybersecurity',
  'Game Development',
  'Blockchain',
  'IoT',
  'AR/VR',
  'Cloud Computing',
  'DevOps',
  'UI/UX Design',
  'Research',
  'Startup',
  'Open Source',
  'Academic Projects',
  'Hackathons',
  'Competitions',
] as const; 