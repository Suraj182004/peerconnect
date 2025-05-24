import { UserProfile, Connection, Activity, DashboardStats, SearchFilters } from './types';

// Mock Student Profiles with Indian Context
export const mockProfiles: UserProfile[] = [
  {
    id: '1',
    firstName: 'Priya',
    lastName: 'Sharma',
    email: 'priya.sharma@marwadiuniversity.ac.in',
    collegeId: 'MU2024001',
    year: 'Junior',
    department: 'Computer Engineering',
    university: 'Marwadi University',
    location: 'Rajkot, Gujarat',
    avatar: '/avatars/priya-sharma.jpg', // Placeholder
    skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Express.js', 'Cloud Computing'],
    interests: ['Web Development', 'AI/ML', 'Startup Ecosystem', 'Yoga'],
    projectAreas: ['Web Development', 'AI/Machine Learning', 'Fintech'],
    bio: 'Aspiring Full-Stack Developer passionate about building scalable web applications and exploring AI. Actively looking for challenging projects and collaborations.',
    socialLinks: {
      linkedin: 'priyasharma-dev',
      github: 'priya-sharma',
      portfolio: 'https://priyasharma.dev'
    },
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-03-15'),
    recentActivity: [
      { id: 'act1-1', type: 'project_shared', description: 'Started a new project: "CampusConnect - A student utility app".', timestamp: '3d ago', details: { title: 'CampusConnect App'} },
      { id: 'act1-2', type: 'connection_made', description: 'Connected with Rohan Patel.', timestamp: '5d ago', user: {id: '2', name: 'Rohan Patel', avatar: '/avatars/rohan-patel.jpg'} },
    ],
    projects: [
      { id: 'proj1-1', title: 'E-commerce Platform for Local Artisans', description: 'Developed a full-stack e-commerce website to help local artisans sell their products online. Implemented using MERN stack.', technologies: ['React', 'Node.js', 'MongoDB', 'Stripe API'], startDate: 'Jun 2023', endDate: 'Dec 2023', repoUrl: 'https://github.com/priya-sharma/artisan-ecommerce' },
      { id: 'proj1-2', title: 'AI Powered Chatbot for Student Queries', description: 'Built an intelligent chatbot for Marwadi University to answer frequently asked student questions using NLP.', technologies: ['Python', 'Dialogflow', 'Firebase'], startDate: 'Jan 2024', endDate: 'Present', url: 'https://mu-chatbot.dev' }
    ],
    experience: [
      { id: 'exp1-1', title: 'Web Development Intern', companyName: 'TechSolutions Pvt. Ltd.', location: 'Ahmedabad', employmentType: 'Internship', startDate: 'May 2023', endDate: 'Aug 2023', description: 'Worked on developing and maintaining client websites using React and Django. Gained experience in agile methodologies.' }
    ]
  },
  {
    id: '2',
    firstName: 'Rohan',
    lastName: 'Patel',
    email: 'rohan.p@darshan.ac.in',
    collegeId: 'DU2023045',
    year: 'Senior',
    department: 'Mechanical Engineering',
    university: 'Darshan University',
    location: 'Rajkot, Gujarat',
    avatar: '/avatars/rohan-patel.jpg', // Placeholder
    skills: ['AutoCAD', 'SolidWorks', 'Ansys', 'Product Design', '3D Printing', 'Project Management'],
    interests: ['Automotive Design', 'Robotics', 'Sustainable Energy', 'Cricket'],
    projectAreas: ['Robotics', 'Product Development', 'Renewable Energy'],
    bio: 'Final year Mechanical Engineering student with a keen interest in automotive innovation and sustainable technologies. Led the university team in a national-level robotics competition.',
    socialLinks: {
      linkedin: 'rohanpatelme',
      github: 'rohan-mech'
    },
    createdAt: new Date('2023-08-15'),
    updatedAt: new Date('2024-03-10'),
    projects: [
        { id: 'proj2-1', title: 'Solar Powered Electric Go-Kart', description: 'Designed and fabricated a solar-powered electric go-kart for a national student competition. Responsible for chassis design and power transmission system.', technologies: ['SolidWorks', 'ANSYS', 'Welding', 'Circuit Design'], startDate: 'Sep 2023', endDate: 'Feb 2024' },
    ],
    experience: [
        { id: 'exp2-1', title: 'Intern', companyName: 'Mahindra & Mahindra', location: 'Mumbai', employmentType: 'Internship', startDate: 'Jun 2023', endDate: 'Jul 2023', description: 'Assisted the R&D team in the automotive division with component design and testing.'}
    ]
  },
  {
    id: '3',
    firstName: 'Aisha',
    lastName: 'Khan',
    email: 'aisha.khan@iitb.ac.in',
    collegeId: 'IITB2024089',
    year: 'Sophomore',
    department: 'Computer Science & Engineering',
    university: 'IIT Bombay',
    location: 'Mumbai, Maharashtra',
    avatar: '/avatars/aisha-khan.jpg', // Placeholder
    skills: ['Python', 'C++', 'Data Structures', 'Algorithms', 'Machine Learning', 'Competitive Programming'],
    interests: ['Artificial Intelligence', 'Competitive Coding', 'Photography', 'Reading Sci-Fi'],
    projectAreas: ['AI/Machine Learning', 'Algorithm Design', 'Open Source'],
    bio: 'Driven CSE sophomore at IIT Bombay. Passionate about solving complex problems with code. Active on Codeforces and TopCoder. Exploring deep learning applications.',
    socialLinks: {
      linkedin: 'aishakhan-iitb',
      github: 'aisha-k',
      // Add Codeforces/TopCoder if relevant
    },
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-03-18'),
    projects: [
        {id: 'proj3-1', title: 'Stock Price Predictor', description: 'Developed a machine learning model to predict stock prices using historical data and sentiment analysis from news articles.', technologies: ['Python', 'Scikit-learn', 'Pandas', 'NLTK'], startDate: 'Nov 2023', endDate: 'Jan 2024'}
    ]
  },
  {
    id: '4',
    firstName: 'Vikram',
    lastName: 'Singh',
    email: 'vikram.singh@bits-pilani.ac.in',
    collegeId: 'BITS2025012',
    year: 'Freshman',
    department: 'Electronics & Communication',
    university: 'BITS Pilani (Pilani Campus)',
    location: 'Pilani, Rajasthan',
    avatar: '/avatars/vikram-singh.jpg', // Placeholder
    skills: ['C', 'Verilog', 'Digital Electronics', 'Embedded Systems', 'IoT'],
    interests: ['IoT', 'Robotics', 'Music Production', 'Trekking'],
    projectAreas: ['Embedded Systems', 'IoT', 'Hardware Design'],
    bio: 'First-year ECE student at BITS Pilani. Fascinated by the world of embedded systems and IoT. Building a home automation project using Raspberry Pi.',
    socialLinks: {
      github: 'vikram-ece',
    },
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-03-12'),
  },
  {
    id: '5',
    firstName: 'Meera',
    lastName: 'Nair',
    email: 'meera.nair@nid.edu',
    collegeId: 'NID2023078',
    year: 'Senior',
    department: 'Graphic Design',
    university: 'National Institute of Design (NID)',
    location: 'Ahmedabad, Gujarat',
    avatar: '/avatars/meera-nair.jpg', // Placeholder
    skills: ['UI/UX Design', 'Figma', 'Adobe Illustrator', 'Adobe Photoshop', 'Typography', 'Branding'],
    interests: ['Minimalist Design', 'Social Impact Design', 'Illustration', 'Travel'],
    projectAreas: ['UI/UX Design', 'Branding', 'Social Campaigns'],
    bio: 'Senior Graphic Design student at NID, specializing in UI/UX and branding. Passionate about creating user-centric and visually compelling designs. My graduation project focuses on designing an accessible learning platform.',
    socialLinks: {
      linkedin: 'meeranairdesign',
      portfolio: 'https://meeranair.design', // Behance/Dribbble could also go here
    },
    createdAt: new Date('2023-07-01'),
    updatedAt: new Date('2024-03-20'),
    projects: [
        {id: 'proj5-1', title: 'Accessible Learning Platform UX', description: 'Lead UX designer for a platform aimed at providing accessible education for visually impaired students. Conducted user research, created wireframes, prototypes, and user testing.', technologies: ['Figma', 'User Research', 'Accessibility Standards'], startDate: 'Aug 2023', endDate: 'Present'},
        {id: 'proj5-2', title: 'Branding for a Local NGO', description: 'Developed a complete brand identity (logo, color palette, typography, collaterals) for a non-profit organization working on women empowerment.', technologies: ['Adobe Illustrator', 'Adobe Photoshop'], startDate: 'May 2023', endDate: 'Jul 2023'}
    ],
    experience: [
        {id: 'exp5-1', title: 'UI/UX Design Intern', companyName: 'CreativeMinds Studio', location: 'Bengaluru', employmentType: 'Internship', startDate: 'Dec 2022', endDate: 'Feb 2023', description: 'Contributed to mobile app and web design projects for various clients. Involved in brainstorming, wireframing, and creating high-fidelity mockups.'}
    ]
  },
  // Adding myself as a user
   {
    id: 'suraj-yaligar', // Unique ID
    firstName: 'Suraj',
    lastName: 'Yaligar',
    email: 'suraj.yaligar@example.com', // Replace with your actual email if you want
    collegeId: 'SY2025001',
    year: 'Junior', // Or your current year
    department: 'Psychology', // Or your department
    university: 'Harvard University', // Your college
    location: 'Cambridge, MA', // Your location
    avatar: '/avatars/suraj-yaligar.jpg', // Path to your avatar image if you have one
    skills: ['Public Speaking', 'Marketing', 'Data Science', 'Machine Learning', 'Leadership', 'Node.js', 'UI/UX Design', 'React'],
    interests: ['Behavioral Economics', 'AI Ethics', 'Product Management', 'Cricket'],
    projectAreas: ['AI Applications', 'Mental Health Tech', 'EdTech'],
    bio: 'Psychology student at Harvard, deeply interested in the intersection of human behavior and technology. Exploring how AI can be leveraged for positive social impact, particularly in mental health and education. Always open to connecting with like-minded individuals for exciting projects!',
    socialLinks: {
      linkedin: 'surajyaligar', // Your LinkedIn
      github: 'suraj-yaligar-gh', // Your GitHub
      twitter: 'surajyaligar_tw', // Your Twitter
    },
    createdAt: new Date('2023-05-15'), // Approximate date you'd join
    updatedAt: new Date(), // Current date
    projects: [
      { id: 'proj-sy-1', title: 'AI-Powered Study Buddy', description: 'Conceptualized and designed a prototype for an AI tutor that adapts to individual learning styles. Focused on NLP for understanding student queries and providing personalized feedback.', technologies: ['Figma', 'Python (Conceptual)', 'NLP Principles'], startDate: 'Jan 2024', endDate: 'Present' },
      { id: 'proj-sy-2', title: 'Mental Wellness Chatbot - "Sahay"', description: 'Led a team to develop a basic chatbot using Dialogflow to provide initial mental wellness support and resources for students. Focused on empathetic response design.', technologies: ['Dialogflow', 'Google Sheets (for KB)', 'UX Writing'], startDate: 'Sep 2023', endDate: 'Dec 2023', url: 'https://sahay-chatbot.example.com' }
    ],
    experience: [
      { id: 'exp-sy-1', title: 'Research Assistant - Cognitive Psychology Lab', companyName: 'Harvard University', location: 'Cambridge, MA', employmentType: 'Part-time', startDate: 'Aug 2023', endDate: 'Present', description: 'Assisting with data collection, literature reviews, and participant recruitment for studies on decision-making and cognitive biases.' },
      { id: 'exp-sy-2', title: 'Marketing Intern', companyName: 'EdTech Startup (Stealth)', location: 'Remote', employmentType: 'Internship', startDate: 'May 2023', endDate: 'Aug 2023', description: 'Contributed to market research, content creation for social media, and competitor analysis for an upcoming educational platform.' }
    ]
  }
];

// Mock Connections (can remain largely the same or be updated with new IDs)
export const mockConnections: Connection[] = [
  {
    id: 'conn_1',
    userId: '1', // Priya
    connectedUserId: '2', // Rohan
    status: 'accepted',
    createdAt: new Date('2024-03-01'),
    message: 'Hi Rohan! Your work on the go-kart is impressive. Would love to connect.'
  },
  {
    id: 'conn_2',
    userId: '1', // Priya
    connectedUserId: '3', // Aisha
    status: 'pending',
    createdAt: new Date('2024-03-10'),
    message: 'Hey Aisha! Fellow coder here. Your ML projects look very interesting!'
  },
   {
    id: 'conn_sy_1',
    userId: 'suraj-yaligar',
    connectedUserId: '1', // Priya Sharma
    status: 'accepted',
    createdAt: new Date('2024-03-15'),
    message: 'Hi Priya, saw your profile on PeerConnect. Your e-commerce project for artisans is fantastic!'
  },
  {
    id: 'conn_sy_2',
    userId: 'suraj-yaligar',
    connectedUserId: '5', // Meera Nair
    status: 'pending',
    createdAt: new Date(),
    message: 'Hello Meera, your design work is stunning, especially the accessible learning platform. Would be great to connect!'
  }
  // Add more connections as needed
];

// Mock Activities
export const mockActivities: Activity[] = [
  // ... (Keep some generic ones or update based on new profiles and actions)
  {
    id: 'act_sy_1',
    userId: 'suraj-yaligar',
    type: 'project_updated',
    title: 'Updated "AI-Powered Study Buddy" project details',
    createdAt: new Date('2024-03-20'),
    metadata: { projectId: 'proj-sy-1' }
  },
   {
    id: 'act_1_new',
    userId: '1', // Priya
    type: 'experience_added',
    title: 'Added new internship experience at TechSolutions Pvt. Ltd.',
    createdAt: new Date('2024-03-16'),
    metadata: { experienceId: 'exp1-1' }
  },
];

// Mock Dashboard Stats
export const mockDashboardStats: DashboardStats = {
  totalConnections: 78, // Adjusted
  profileViews: 150, // Adjusted
  // Removed 'connectionRequests' and 'skillMatches' as they weren't consistently used/defined in DashboardStats type
  // If needed, they can be added back to the type and here.
  newMessages: 3 // Added for consistency with UserProfile types
};


// Function to get a user profile (useful for current user simulation)
// You can modify this to pick 'suraj-yaligar' by default if needed for testing
export const getMyProfile = (): UserProfile | null => {
  // return mockProfiles.find(p => p.id === '1') || null; // Default to Priya
  return mockProfiles.find(p => p.id === 'suraj-yaligar') || null; // Default to Suraj
};


// Combine all profiles - ensure no duplicates if you were to add 'additionalMockProfiles' back
export const allMockProfiles = [...mockProfiles];
// If you had additionalMockProfiles:
// const uniqueProfileIds = new Set();
// export const allMockProfiles = [...mockProfiles, ...additionalMockProfiles].filter(profile => {
//   if (uniqueProfileIds.has(profile.id)) {
//     return false;
//   }
//   uniqueProfileIds.add(profile.id);
//   return true;
// });


// Function to get random profiles for suggestions
export const getRandomProfiles = (count: number = 3, excludeId?: string): UserProfile[] => {
  const filtered = excludeId ? allMockProfiles.filter(p => p.id !== excludeId) : allMockProfiles;
  const shuffled = [...filtered].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Function to search profiles (can be enhanced)
export const searchProfiles = (query: string, filters?: Partial<SearchFilters>): UserProfile[] => {
  let results = allMockProfiles;

  if (query) {
    const searchTerm = query.toLowerCase();
    results = results.filter(profile =>
      profile.firstName.toLowerCase().includes(searchTerm) ||
      profile.lastName.toLowerCase().includes(searchTerm) ||
      profile.department.toLowerCase().includes(searchTerm) ||
      profile.university?.toLowerCase().includes(searchTerm) ||
      profile.skills.some(skill => skill.toLowerCase().includes(searchTerm)) ||
      profile.interests.some(interest => interest.toLowerCase().includes(searchTerm)) ||
      profile.bio?.toLowerCase().includes(searchTerm)
    );
  }

  // Apply filters (expand as needed)
  if (filters) {
    if (filters.departments?.length) {
      results = results.filter(p => filters.departments?.includes(p.department));
    }
    // Add more filters for year, skills, interests, projectAreas etc.
  }
  return results;
};


// Ensure avatar paths are correct or use fallbacks.
// For example, create a folder public/avatars and add images like:
// priya-sharma.jpg, rohan-patel.jpg, aisha-khan.jpg, vikram-singh.jpg, meera-nair.jpg, suraj-yaligar.jpg
// If you don't have specific images, the AvatarFallback will be used.
// You might want to update the UserActivity user objects if they reference old avatar paths.

// For recentActivity in UserProfile, ensure the user objects (if any) also reflect new names/avatars.
// Example:
// recentActivity: [
//   { id: 'act1-2', type: 'connection_made', description: 'Connected with Rohan Patel.', timestamp: '5d ago', user: {id: '2', name: 'Rohan Patel', avatar: '/avatars/rohan-patel.jpg'} },
// ]
// This was done for Priya Sharma connecting with Rohan Patel.

// Update `getMyProfile` to return your profile ('suraj-yaligar') by default if that's what you want for testing purposes
// This is already done in the code above. 