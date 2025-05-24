import { UserProfile, Connection, Activity, DashboardStats } from './types';

// Mock Student Profiles
export const mockProfiles: UserProfile[] = [
  {
    id: '1',
    firstName: 'Sophia',
    lastName: 'Carter',
    email: 'sophia.carter@stanford.edu',
    collegeId: 'SC2024001',
    year: 'Junior',
    department: 'Computer Science',
    university: 'Stanford University',
    location: 'Palo Alto, CA',
    avatar: '/avatars/sophia-carter.jpg',
    skills: ['JavaScript', 'React', 'Node.js', 'Python', 'Machine Learning', 'UI/UX Design'],
    interests: ['Web Development', 'AI/ML', 'Startup', 'Photography'],
    projectAreas: ['Web Development', 'AI/Machine Learning', 'Startup'],
    bio: 'Passionate CS student interested in building AI-powered web applications. Currently working on a machine learning project for image recognition. Always excited to collaborate on innovative tech projects!',
    socialLinks: {
      linkedin: 'sophiacarter',
      github: 'sophia-carter',
      portfolio: 'https://sophiacarter.dev'
    },
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: '2',
    firstName: 'Ethan',
    lastName: 'Bennett',
    email: 'ethan.bennett@mit.edu',
    collegeId: 'EB2023045',
    year: 'Senior',
    department: 'Engineering',
    university: 'MIT',
    location: 'Cambridge, MA',
    avatar: '/avatars/ethan-bennett.jpg',
    skills: ['Java', 'C++', 'Python', 'Robotics', 'Embedded Systems', 'Project Management'],
    interests: ['Robotics', 'IoT', 'Research', 'Music'],
    projectAreas: ['IoT', 'Research', 'Academic Projects'],
    bio: 'Robotics engineering student with a passion for autonomous systems. Led multiple research projects in autonomous navigation. Looking to connect with fellow engineers and researchers.',
    socialLinks: {
      linkedin: 'ethanbennett',
      github: 'ethan-robotics'
    },
    createdAt: new Date('2023-09-10'),
    updatedAt: new Date('2024-01-18'),
  },
  {
    id: '3',
    firstName: 'Olivia',
    lastName: 'Hayes',
    email: 'olivia.hayes@harvard.edu',
    collegeId: 'OH2024089',
    year: 'Sophomore',
    department: 'Business Administration',
    university: 'Harvard University',
    location: 'Cambridge, MA',
    avatar: '/avatars/olivia-hayes.jpg',
    skills: ['Marketing', 'Data Science', 'Public Speaking', 'Leadership', 'Strategy'],
    interests: ['Entrepreneurship', 'Marketing', 'Sustainability', 'Travel'],
    projectAreas: ['Startup', 'Marketing', 'Sustainability'],
    bio: 'Business student with a focus on sustainable entrepreneurship. Co-founded a startup focused on eco-friendly products. Always looking for like-minded individuals to collaborate on impactful projects.',
    socialLinks: {
      linkedin: 'oliviahayes',
      twitter: 'olivia_hayes_'
    },
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-19'),
  },
  {
    id: '4',
    firstName: 'Noah',
    lastName: 'Thompson',
    email: 'noah.thompson@berkeley.edu',
    collegeId: 'NT2025012',
    year: 'Freshman',
    department: 'Computer Science',
    university: 'UC Berkeley',
    location: 'Berkeley, CA',
    avatar: '/avatars/noah-thompson.jpg',
    skills: ['Python', 'JavaScript', 'Data Science', 'Machine Learning', 'Git'],
    interests: ['Data Science', 'AI/ML', 'Gaming', 'Sports'],
    projectAreas: ['Data Science', 'AI/Machine Learning', 'Open Source'],
    bio: 'First-year CS student passionate about data science and machine learning. Currently learning about neural networks and working on predictive modeling projects. Eager to join collaborative coding projects!',
    socialLinks: {
      github: 'noah-codes',
      portfolio: 'https://noahthompson.tech'
    },
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-21'),
  },
  {
    id: '5',
    firstName: 'Emma',
    lastName: 'Rodriguez',
    email: 'emma.rodriguez@ucla.edu',
    collegeId: 'ER2023078',
    year: 'Senior',
    department: 'Design',
    university: 'UCLA',
    location: 'Los Angeles, CA',
    avatar: '/avatars/emma-rodriguez.jpg',
    skills: ['UI/UX Design', 'Figma', 'Adobe Creative Suite', 'Prototyping', 'User Research'],
    interests: ['Design', 'Art', 'Photography', 'Travel'],
    projectAreas: ['UI/UX Design', 'Mobile Development', 'Startup'],
    bio: 'UX designer passionate about creating intuitive and beautiful digital experiences. Currently working on my senior capstone project - a mobile app for student wellness. Love collaborating with developers!',
    socialLinks: {
      linkedin: 'emmarodriguez',
      portfolio: 'https://emmarodriguez.design',
      instagram: 'emma_designs'
    },
    createdAt: new Date('2023-08-20'),
    updatedAt: new Date('2024-01-17'),
  },
  {
    id: '6',
    firstName: 'Liam',
    lastName: 'Chen',
    email: 'liam.chen@cmu.edu',
    collegeId: 'LC2024056',
    year: 'Junior',
    department: 'Computer Science',
    university: 'Carnegie Mellon University',
    location: 'Pittsburgh, PA',
    avatar: '/avatars/liam-chen.jpg',
    skills: ['Python', 'Java', 'Cybersecurity', 'Network Security', 'Ethical Hacking'],
    interests: ['Cybersecurity', 'Gaming', 'Tech', 'Reading'],
    projectAreas: ['Cybersecurity', 'Research', 'Open Source'],
    bio: 'Cybersecurity enthusiast focused on network security and ethical hacking. Participate in CTF competitions and security research. Always interested in discussing the latest security trends and vulnerabilities.',
    socialLinks: {
      github: 'liam-security',
      linkedin: 'liamchen'
    },
    createdAt: new Date('2023-10-05'),
    updatedAt: new Date('2024-01-16'),
  },
  {
    id: '7',
    firstName: 'Ava',
    lastName: 'Patel',
    email: 'ava.patel@stanford.edu',
    collegeId: 'AP2025034',
    year: 'Sophomore',
    department: 'Medicine',
    university: 'Stanford University',
    location: 'Palo Alto, CA',
    avatar: '/avatars/ava-patel.jpg',
    skills: ['Research', 'Data Analysis', 'Biology', 'Chemistry', 'Scientific Writing'],
    interests: ['Research', 'Health Tech', 'Volunteering', 'Music'],
    projectAreas: ['Research', 'Health Tech', 'Academic Projects'],
    bio: 'Pre-med student passionate about medical research and health technology. Currently involved in a research project on personalized medicine. Interested in the intersection of technology and healthcare.',
    socialLinks: {
      linkedin: 'avapatel'
    },
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-22'),
  },
  {
    id: '8',
    firstName: 'Mason',
    lastName: 'Williams',
    email: 'mason.williams@gatech.edu',
    collegeId: 'MW2023091',
    year: 'Senior',
    department: 'Engineering',
    university: 'Georgia Institute of Technology',
    location: 'Atlanta, GA',
    avatar: '/avatars/mason-williams.jpg',
    skills: ['C++', 'MATLAB', 'CAD', 'Engineering Design', 'Project Management'],
    interests: ['Engineering', 'Innovation', 'Sports', 'Outdoor Activities'],
    projectAreas: ['Engineering Design', 'IoT', 'Academic Projects'],
    bio: 'Mechanical engineering student with a passion for innovative design solutions. Working on a capstone project involving renewable energy systems. Love building things and solving complex engineering problems.',
    socialLinks: {
      linkedin: 'masonwilliams',
      portfolio: 'https://masonwilliams.eng'
    },
    createdAt: new Date('2023-07-15'),
    updatedAt: new Date('2024-01-14'),
  }
];

// Mock Connections
export const mockConnections: Connection[] = [
  {
    id: 'conn_1',
    userId: '1',
    connectedUserId: '2',
    status: 'accepted',
    createdAt: new Date('2024-01-16'),
    message: 'Hi Ethan! I love your robotics projects. Would love to connect and maybe collaborate!'
  },
  {
    id: 'conn_2',
    userId: '1',
    connectedUserId: '3',
    status: 'accepted',
    createdAt: new Date('2024-01-18'),
  },
  {
    id: 'conn_3',
    userId: '1',
    connectedUserId: '4',
    status: 'pending',
    createdAt: new Date('2024-01-20'),
    message: 'Hey Noah! Fellow CS student here. Your data science projects look amazing!'
  },
  {
    id: 'conn_4',
    userId: '2',
    connectedUserId: '6',
    status: 'accepted',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 'conn_5',
    userId: '3',
    connectedUserId: '5',
    status: 'accepted',
    createdAt: new Date('2024-01-17'),
  },
  {
    id: 'conn_6',
    userId: '4',
    connectedUserId: '8',
    status: 'pending',
    createdAt: new Date('2024-01-19'),
  }
];

// Mock Activities
export const mockActivities: Activity[] = [
  {
    id: 'act_1',
    userId: '1',
    type: 'connection_made',
    title: 'Connected with Ethan Bennett',
    description: 'Started networking with fellow engineering student',
    createdAt: new Date('2024-01-16'),
    metadata: { connectedUserId: '2' }
  },
  {
    id: 'act_2',
    userId: '1',
    type: 'skill_added',
    title: 'Added new skill: Machine Learning',
    description: 'Updated profile with latest technical skills',
    createdAt: new Date('2024-01-15'),
    metadata: { skill: 'Machine Learning' }
  },
  {
    id: 'act_3',
    userId: '1',
    type: 'profile_updated',
    title: 'Updated profile information',
    description: 'Added project areas and improved bio',
    createdAt: new Date('2024-01-14'),
  },
  {
    id: 'act_4',
    userId: '2',
    type: 'connection_made',
    title: 'Connected with Liam Chen',
    description: 'Connected with cybersecurity expert',
    createdAt: new Date('2024-01-15'),
    metadata: { connectedUserId: '6' }
  },
  {
    id: 'act_5',
    userId: '3',
    type: 'project_shared',
    title: 'Shared sustainability startup project',
    description: 'Posted about eco-friendly product initiative',
    createdAt: new Date('2024-01-13'),
  }
];

// Mock Dashboard Stats
export const mockDashboardStats: DashboardStats = {
  totalConnections: 120,
  profileViews: 89,
  connectionRequests: 5,
  skillMatches: 23
};

// Additional mock profiles for search/browse functionality
export const additionalMockProfiles: UserProfile[] = [
  {
    id: '9',
    firstName: 'Isabella',
    lastName: 'Johnson',
    email: 'isabella.johnson@yale.edu',
    collegeId: 'IJ2024123',
    year: 'Junior',
    department: 'Psychology',
    university: 'Yale University',
    location: 'New Haven, CT',
    skills: ['Research', 'Statistics', 'SPSS', 'Writing', 'Public Speaking'],
    interests: ['Psychology', 'Research', 'Mental Health', 'Writing'],
    projectAreas: ['Research', 'Academic Projects', 'Health Tech'],
    bio: 'Psychology major focusing on cognitive behavioral research. Interested in mental health applications and therapeutic technologies.',
    createdAt: new Date('2023-11-10'),
    updatedAt: new Date('2024-01-10'),
  },
  {
    id: '10',
    firstName: 'James',
    lastName: 'Kim',
    email: 'james.kim@princeton.edu',
    collegeId: 'JK2023067',
    year: 'Senior',
    department: 'Economics',
    university: 'Princeton University',
    location: 'Princeton, NJ',
    skills: ['Economics', 'Data Analysis', 'Python', 'R', 'Financial Modeling'],
    interests: ['Economics', 'Finance', 'Data Science', 'Policy'],
    projectAreas: ['Data Science', 'Research', 'Academic Projects'],
    bio: 'Economics student with strong analytical skills. Passionate about using data to understand economic trends and policy impacts.',
    socialLinks: {
      linkedin: 'jameskim'
    },
    createdAt: new Date('2023-09-05'),
    updatedAt: new Date('2024-01-08'),
  },
  {
    id: '11',
    firstName: 'Zoe',
    lastName: 'Davis',
    email: 'zoe.davis@nyu.edu',
    collegeId: 'ZD2025078',
    year: 'Freshman',
    department: 'Arts & Humanities',
    university: 'NYU',
    location: 'New York, NY',
    skills: ['Creative Writing', 'Digital Media', 'Photography', 'Social Media'],
    interests: ['Writing', 'Art', 'Photography', 'Film'],
    projectAreas: ['Creative Projects', 'Digital Media', 'Storytelling'],
    bio: 'Creative writing student passionate about digital storytelling. Working on multimedia projects that combine writing, photography, and video.',
    socialLinks: {
      portfolio: 'https://zoedavis.art',
      instagram: 'zoe_creates'
    },
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-12'),
  }
];

// Combine all profiles
export const allMockProfiles = [...mockProfiles, ...additionalMockProfiles];

// Function to get random profiles for suggestions
export const getRandomProfiles = (count: number = 3, excludeId?: string): UserProfile[] => {
  const filtered = excludeId ? allMockProfiles.filter(p => p.id !== excludeId) : allMockProfiles;
  const shuffled = [...filtered].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Function to search profiles
export const searchProfiles = (query: string, filters?: any): UserProfile[] => {
  let results = allMockProfiles;

  // Text search
  if (query) {
    const searchTerm = query.toLowerCase();
    results = results.filter(profile => 
      profile.firstName.toLowerCase().includes(searchTerm) ||
      profile.lastName.toLowerCase().includes(searchTerm) ||
      profile.department.toLowerCase().includes(searchTerm) ||
      profile.skills.some(skill => skill.toLowerCase().includes(searchTerm)) ||
      profile.interests.some(interest => interest.toLowerCase().includes(searchTerm)) ||
      profile.bio?.toLowerCase().includes(searchTerm)
    );
  }

  // Apply filters
  if (filters) {
    if (filters.departments?.length) {
      results = results.filter(p => filters.departments.includes(p.department));
    }
    if (filters.years?.length) {
      results = results.filter(p => filters.years.includes(p.year));
    }
    if (filters.skills?.length) {
      results = results.filter(p => 
        filters.skills.some((skill: string) => p.skills.includes(skill))
      );
    }
    if (filters.interests?.length) {
      results = results.filter(p => 
        filters.interests.some((interest: string) => p.interests.includes(interest))
      );
    }
  }

  return results;
};

// Mock recent activities for dashboard
export const getRecentActivities = (userId: string): Activity[] => {
  return mockActivities
    .filter(activity => activity.userId === userId)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 5);
};

// Mock connection requests
export const getPendingConnections = (userId: string): Connection[] => {
  return mockConnections.filter(conn => 
    (conn.userId === userId || conn.connectedUserId === userId) && 
    conn.status === 'pending'
  );
};

// Mock accepted connections
export const getAcceptedConnections = (userId: string): Connection[] => {
  return mockConnections.filter(conn => 
    (conn.userId === userId || conn.connectedUserId === userId) && 
    conn.status === 'accepted'
  );
}; 