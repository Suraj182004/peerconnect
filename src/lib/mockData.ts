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
    avatar: '/avatars/image.png',
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
      { id: 'act1-2', type: 'connection_made', description: 'Connected with Rohan Patel.', timestamp: '5d ago', user: {id: '2', name: 'Rohan Patel', avatar: '/avatars/download.jpg'} },
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
    avatar: '/images/download.jpg',
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
    avatar: '/avatars/image.png',
    skills: ['Python', 'C++', 'Data Structures', 'Algorithms', 'Machine Learning', 'Competitive Programming'],
    interests: ['Artificial Intelligence', 'Competitive Coding', 'Photography', 'Reading Sci-Fi'],
    projectAreas: ['AI/Machine Learning', 'Algorithm Design', 'Open Source'],
    bio: 'Driven CSE sophomore at IIT Bombay. Passionate about solving complex problems with code. Active on Codeforces and TopCoder. Exploring deep learning applications.',
    socialLinks: {
      linkedin: 'aishakhan-iitb',
      github: 'aisha-k',
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
    avatar: '/images/download.jpg',
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
    avatar: '/avatars/image.png',
    skills: ['UI/UX Design', 'Figma', 'Adobe Illustrator', 'Adobe Photoshop', 'Typography', 'Branding'],
    interests: ['Minimalist Design', 'Social Impact Design', 'Illustration', 'Travel'],
    projectAreas: ['UI/UX Design', 'Branding', 'Social Campaigns'],
    bio: 'Senior Graphic Design student at NID, specializing in UI/UX and branding. Passionate about creating user-centric and visually compelling designs. My graduation project focuses on designing an accessible learning platform.',
    socialLinks: {
      linkedin: 'meeranairdesign',
      portfolio: 'https://meeranair.design',
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
  {
    id: 'suraj-yaligar',
    firstName: 'Suraj',
    lastName: 'Yaligar',
    email: 'suraj.yaligar@example.com',
    collegeId: 'SY2025001',
    year: 'Junior',
    department: 'Psychology',
    university: 'Harvard University',
    location: 'Cambridge, MA',
    avatar: '/images/download.jpg',
    skills: ['Public Speaking', 'Marketing', 'Data Science', 'Machine Learning', 'Leadership', 'Node.js', 'UI/UX Design', 'React'],
    interests: ['Behavioral Economics', 'AI Ethics', 'Product Management', 'Cricket'],
    projectAreas: ['AI Applications', 'Mental Health Tech', 'EdTech'],
    bio: 'Psychology student at Harvard, deeply interested in the intersection of human behavior and technology. Exploring how AI can be leveraged for positive social impact, particularly in mental health and education. Always open to connecting with like-minded individuals for exciting projects!',
    socialLinks: {
      linkedin: 'surajyaligar',
      github: 'suraj-yaligar-gh',
      twitter: 'surajyaligar_tw',
    },
    createdAt: new Date('2023-05-15'),
    updatedAt: new Date(),
    projects: [
      { id: 'proj-sy-1', title: 'AI-Powered Study Buddy', description: 'Conceptualized and designed a prototype for an AI tutor that adapts to individual learning styles. Focused on NLP for understanding student queries and providing personalized feedback.', technologies: ['Figma', 'Python (Conceptual)', 'NLP Principles'], startDate: 'Jan 2024', endDate: 'Present' },
      { id: 'proj-sy-2', title: 'Mental Wellness Chatbot - "Sahay"', description: 'Led a team to develop a basic chatbot using Dialogflow to provide initial mental wellness support and resources for students. Focused on empathetic response design.', technologies: ['Dialogflow', 'Google Sheets (for KB)', 'UX Writing'], startDate: 'Sep 2023', endDate: 'Dec 2023', url: 'https://sahay-chatbot.example.com' }
    ],
    experience: [
      { id: 'exp-sy-1', title: 'Research Assistant - Cognitive Psychology Lab', companyName: 'Harvard University', location: 'Cambridge, MA', employmentType: 'Part-time', startDate: 'Aug 2023', endDate: 'Present', description: 'Assisting with data collection, literature reviews, and participant recruitment for studies on decision-making and cognitive biases.' },
      { id: 'exp-sy-2', title: 'Marketing Intern', companyName: 'EdTech Startup (Stealth)', location: 'Remote', employmentType: 'Internship', startDate: 'May 2023', endDate: 'Aug 2023', description: 'Contributed to market research, content creation for social media, and competitor analysis for an upcoming educational platform.' }
    ]
  },
  {
    id: '6',
    firstName: 'Arjun',
    lastName: 'Menon',
    email: 'arjun.menon@christuniversity.in',
    collegeId: 'CU2024006',
    year: 'Sophomore',
    department: 'Economics',
    university: 'Christ University, Bangalore',
    location: 'Bangalore, Karnataka',
    avatar: '/images/download.jpg',
    skills: ['Econometrics', 'Data Analysis', 'Python (for Data Science)', 'Behavioral Economics', 'Public Policy'],
    interests: ['Sustainable Development', 'Financial Markets', 'International Relations', 'Debating'],
    projectAreas: ['Economic Modeling', 'Policy Analysis', 'Market Research'],
    bio: 'Economics student passionate about using data to understand and solve real-world problems. Exploring the intersection of economics and public policy.',
    socialLinks: {
      linkedin: 'arjunmenon-econ'
    },
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-20')
  },
  {
    id: '7',
    firstName: 'Sneha',
    lastName: 'Reddy',
    email: 'sneha.reddy@srmist.edu.in',
    collegeId: 'SRM2023007',
    year: 'Junior',
    department: 'Biotechnology',
    university: 'SRM Institute of Science and Technology, Chennai',
    location: 'Chennai, Tamil Nadu',
    avatar: '/avatars/image.png',
    skills: ['Genetic Engineering', 'Cell Culture', 'Bioinformatics', 'Microbiology', 'Lab Research'],
    interests: ['Drug Discovery', 'Neuroscience', 'Sustainable Agriculture', 'Classical Dance'],
    projectAreas: ['Bioinformatics', 'Pharmaceutical Research', 'Genetic Studies'],
    bio: 'Biotechnology junior focused on genetic research and its applications in medicine. Eager to contribute to innovative biotech projects.',
    socialLinks: {
      linkedin: 'snehareddy-biotech',
      github: 'sneha-reddy-bio'
    },
    createdAt: new Date('2023-09-10'),
    updatedAt: new Date('2024-03-15')
  },
  {
    id: '8',
    firstName: 'Karan',
    lastName: 'Gupta',
    email: 'karan.gupta@lpu.co.in',
    collegeId: 'LPU2024008',
    year: 'Senior',
    department: 'Business Administration',
    university: 'Lovely Professional University (LPU), Phagwara',
    location: 'Phagwara, Punjab',
    avatar: '/avatars/download.jpg',
    skills: ['Marketing Strategy', 'Market Research', 'Brand Management', 'Sales', 'Digital Marketing'],
    interests: ['Entrepreneurship', 'E-commerce', 'Supply Chain Management', 'Fitness'],
    projectAreas: ['Startup Incubation', 'Digital Marketing Campaigns', 'Business Development'],
    bio: 'Final year BBA student with a flair for marketing and entrepreneurship. Co-founded a campus startup and actively seeking opportunities in brand management.',
    socialLinks: {
      linkedin: 'karangupta-mba'
    },
    createdAt: new Date('2023-07-20'),
    updatedAt: new Date('2024-03-18')
  },
  {
    id: '9',
    firstName: 'Divya',
    lastName: 'Chopra',
    email: 'divya.chopra@MirandaHouse.ac.in',
    collegeId: 'MH2025009',
    year: 'Freshman',
    department: 'English Literature',
    university: 'Miranda House, Delhi',
    location: 'Delhi',
    avatar: '/avatars/image.png',
    skills: ['Creative Writing', 'Critical Analysis', 'Editing', 'Public Speaking', 'Content Creation'],
    interests: ['Postcolonial Literature', 'Feminist Theory', 'Theatre', 'Poetry'],
    projectAreas: ['Literary Research', 'Content Writing', 'Journalism'],
    bio: 'First-year English Lit student at Miranda House, exploring the nuances of storytelling and critical thought. Aspiring writer and editor.',
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-03-22')
  },
  {
    id: '10',
    firstName: 'Ravi',
    lastName: 'Kumar',
    email: 'ravi.kumar@nitw.ac.in',
    collegeId: 'NITW2023010',
    year: 'Junior',
    department: 'Civil Engineering',
    university: 'National Institute of Technology Warangal (NITW)',
    location: 'Warangal, Telangana',
    avatar: '/avatars/download.jpg',
    skills: ['Structural Analysis', 'AutoCAD Civil 3D', 'Construction Management', 'Surveying', 'Concrete Technology'],
    interests: ['Sustainable Infrastructure', 'Urban Planning', 'Geotechnical Engineering', 'Photography'],
    projectAreas: ['Smart Cities', 'Green Buildings', 'Infrastructure Development'],
    bio: 'Civil Engineering student at NIT Warangal, passionate about designing sustainable and resilient infrastructure for the future.',
    socialLinks: {
      linkedin: 'ravikumar-civil'
    },
    createdAt: new Date('2023-08-01'),
    updatedAt: new Date('2024-03-19')
  },
  {
    id: '11',
    firstName: 'Ananya',
    lastName: 'Joshi',
    email: 'ananya.joshi@fergusson.edu',
    collegeId: 'FC2024011',
    year: 'Sophomore',
    department: 'Psychology',
    university: 'Fergusson College, Pune',
    location: 'Pune, Maharashtra',
    avatar: '/avatars/image.png',
    skills: ['Cognitive Psychology', 'Research Methods', 'Statistical Analysis (SPSS)', 'Counseling Skills', 'Empathy'],
    interests: ['Clinical Psychology', 'Child Development', 'Mental Health Advocacy', 'Painting'],
    projectAreas: ['Mental Wellness Initiatives', 'Community Psychology', 'Behavioral Studies'],
    bio: 'Psychology sophomore at Fergusson College, keen on understanding human behavior and promoting mental well-being. Volunteer for a mental health helpline.',
    socialLinks: {
      linkedin: 'ananyajoshi-psy'
    },
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-03-21')
  },
  {
    id: '12',
    firstName: 'Rohan',
    lastName: 'Desai',
    email: 'rohan.desai@coep.ac.in',
    collegeId: 'COEP2023012',
    year: 'Senior',
    department: 'Metallurgical Engineering',
    university: 'College of Engineering, Pune (COEP)',
    location: 'Pune, Maharashtra',
    avatar: '/avatars/download.jpg',
    skills: ['Physical Metallurgy', 'Material Science', 'NDT', 'Heat Treatment', 'Corrosion Engineering'],
    interests: ['Advanced Materials', 'Aerospace Materials', 'Welding Technology', 'Hiking'],
    projectAreas: ['Material Characterization', 'Alloy Development', 'Failure Analysis'],
    bio: 'Final year Metallurgy student at COEP, fascinated by the science of materials and their applications. Working on a project to develop a new lightweight alloy.',
    socialLinks: {
      github: 'rohan-desai-met'
    },
    createdAt: new Date('2023-06-15'),
    updatedAt: new Date('2024-03-17')
  },
  {
    id: '13',
    firstName: 'Ishita',
    lastName: 'Verma',
    email: 'ishita.verma@xlri.ac.in',
    collegeId: 'XLRI2025013',
    year: 'Freshman',
    department: 'Human Resource Management',
    university: "Xavier Labour Relations Institute (XLRI), Jamshedpur",
    location: 'Jamshedpur, Jharkhand',
    avatar: '/avatars/image.png',
    skills: ['Communication', 'Teamwork', 'Organizational Behavior', 'Recruitment Basics', 'Problem Solving'],
    interests: ['Talent Management', 'Corporate Social Responsibility', 'Employee Engagement', 'Reading Fiction'],
    projectAreas: ['HR Policies', 'CSR Initiatives', 'Campus Recruitment Drives'],
    bio: 'Aspiring HR professional starting my journey at XLRI. Eager to learn about building positive and productive work environments.',
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2024-03-23')
  },
  {
    id: '14',
    firstName: 'Aditya',
    lastName: 'Nair',
    email: 'aditya.nair@iitg.ac.in',
    collegeId: 'IITG2023014',
    year: 'Junior',
    department: 'Design',
    university: 'Indian Institute of Technology Guwahati (IITG)',
    location: 'Guwahati, Assam',
    avatar: '/avatars/download.jpg',
    skills: ['Product Design', 'User Interface Design', 'Interaction Design', 'Prototyping (Figma, Adobe XD)', 'User Research'],
    interests: ['Sustainable Design', 'UX for Emerging Tech', 'Photography', 'Graphic Novels'],
    projectAreas: ['UX/UI Design', 'Industrial Design', 'Human-Computer Interaction'],
    bio: 'Design junior at IIT Guwahati, passionate about creating intuitive and impactful user experiences. Exploring how design can solve complex societal challenges.',
    socialLinks: {
      linkedin: 'adityanair-design',
      portfolio: 'https://adityanair.design'
    },
    createdAt: new Date('2023-07-01'),
    updatedAt: new Date('2024-03-16')
  },
  {
    id: '15',
    firstName: 'Neha',
    lastName: 'Singh',
    email: 'neha.singh@bhu.ac.in',
    collegeId: 'BHU2024015',
    year: 'Sophomore',
    department: 'History',
    university: 'Banaras Hindu University (BHU)',
    location: 'Varanasi, Uttar Pradesh',
    avatar: '/avatars/image.png',
    skills: ['Historical Research', 'Archival Analysis', 'Critical Thinking', 'Academic Writing', 'Presentation Skills'],
    interests: ['Modern Indian History', 'Cultural Studies', 'Museology', 'Documentary Filmmaking'],
    projectAreas: ['Oral History Projects', 'Digital Archives', 'Historical Documentaries'],
    bio: 'History sophomore at BHU, fascinated by the narratives of the past and their relevance to the present. Currently working on a digital archive project for local folklore.',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-03-14')
  }
];

// Mock Connections
export const mockConnections: Connection[] = [
  {
    id: 'conn_1',
    userId1: '1',
    userId2: '2',
    status: 'accepted',
    createdAt: new Date('2024-03-01'),
  },
  {
    id: 'conn_2',
    userId1: '1',
    userId2: '3',
    status: 'accepted',
    createdAt: new Date('2024-03-10'),
  },
   {
    id: 'conn_sy_1',
    userId1: 'suraj-yaligar',
    userId2: '1',
    status: 'accepted',
    createdAt: new Date('2024-03-15'),
  },
  {
    id: 'conn_sy_2',
    userId1: 'suraj-yaligar',
    userId2: '5',
    status: 'accepted',
    createdAt: new Date(),
  },
  { id: 'conn_6_1', userId1: '6', userId2: '1', status: 'accepted', createdAt: new Date() },
  { id: 'conn_7_2', userId1: '7', userId2: '2', status: 'accepted', createdAt: new Date() },
  { id: 'conn_8_3', userId1: '8', userId2: '3', status: 'accepted', createdAt: new Date() },
];

// Mock Activities
export const mockActivities: Activity[] = [
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
    userId: '1',
    type: 'experience_added',
    title: 'Added new internship experience at TechSolutions Pvt. Ltd.',
    createdAt: new Date('2024-03-16'),
    metadata: { experienceId: 'exp1-1' }
  },
  {
    id: 'act_2_conn',
    userId: '2',
    type: 'connection_made',
    title: 'Connected with Priya Sharma',
    description: 'You are now connected with Priya Sharma.',
    createdAt: new Date('2024-03-01'),
    metadata: { connectedUserId: '1'}
  }
];

// Mock Dashboard Stats
export const mockDashboardStats: DashboardStats = {
  totalConnections: 82,
  profileViews: 165,
  newMessages: 5
};

export const getMyProfile = (): UserProfile | null => {
  return mockProfiles.find(p => p.id === 'suraj-yaligar') || null;
};

export const allMockProfiles = [...mockProfiles];

export const getRandomProfiles = (count: number = 3, excludeId?: string): UserProfile[] => {
  const filtered = excludeId ? allMockProfiles.filter(p => p.id !== excludeId) : allMockProfiles;
  const shuffled = [...filtered].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

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

  if (filters) {
    if (filters.departments?.length) {
      results = results.filter(p => filters.departments?.includes(p.department));
    }
    if (filters.years?.length) {
        results = results.filter(p => filters.years?.includes(p.year));
    }
    if (filters.skills?.length) {
        results = results.filter(p => p.skills.some(s => filters.skills?.includes(s)));
    }
    if (filters.interests?.length) {
        results = results.filter(p => p.interests.some(i => filters.interests?.includes(i)));
    }
    if (filters.projectAreas?.length) {
        results = results.filter(p => p.projectAreas.some(a => filters.projectAreas?.includes(a)));
    }
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