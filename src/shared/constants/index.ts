export const APP_NAME = 'Okoa Sem'
export const APP_DESCRIPTION = 'Access Past Papers & Study Resources'

// Pricing
export const PRICING = {
  DAILY: {
    amount: 10,
    duration: 1, // days
    name: 'Daily Plan',
  },
  MONTHLY: {
    amount: 100,
    duration: 30, // days
    name: 'Monthly Plan',
  },
} as const

// Platform Stats
export const PLATFORM_STATS = {
  TOTAL_PAPERS: 24000,
  TOTAL_SCHOOLS: 8,
  TOTAL_DEPARTMENTS: 50,
  TOTAL_STUDENTS: 10000,
}

// Schools
export const SCHOOLS = [
  {
    id: 'sci',
    name: 'School of Computing and Informatics',
    abbreviation: 'SCI',
    color: 'blue',
    description: 'Computer Science, IT, Software Engineering',
  },
  {
    id: 'safs',
    name: 'School of Agriculture and Food Sciences',
    abbreviation: 'SAFS',
    color: 'green',
    description: 'Agriculture, Food Technology, Nutrition',
  },
  {
    id: 'sbe',
    name: 'School of Business and Economics',
    abbreviation: 'SBE',
    color: 'amber',
    description: 'Business, Economics, Management',
  },
  {
    id: 'sea',
    name: 'School of Engineering and Architecture',
    abbreviation: 'SEA',
    color: 'gray',
    description: 'Engineering, Architecture, Construction',
  },
  {
    id: 'sed',
    name: 'School of Education',
    abbreviation: 'SED',
    color: 'purple',
    description: 'Education, Teaching, Curriculum Development',
  },
  {
    id: 'shs',
    name: 'School of Health Sciences',
    abbreviation: 'SHS',
    color: 'pink',
    description: 'Medicine, Nursing, Public Health',
  },
  {
    id: 'son',
    name: 'School of Nursing',
    abbreviation: 'SON',
    color: 'cyan',
    description: 'Nursing, Healthcare, Patient Care',
  },
  {
    id: 'spas',
    name: 'School of Pure and Applied Sciences',
    abbreviation: 'SPAS',
    color: 'teal',
    description: 'Mathematics, Physics, Chemistry, Biology',
  },
] as const

// Features
export const FEATURES = [
  {
    title: 'Find Past Papers',
    description: 'Search and access past papers from your specific school and department. Browse by year, semester, and course code.',
    color: 'purple',
  },
  {
    title: 'Smart Topic Search',
    description: 'Type any topic or unit you\'re studying and get relevant exam questions with AI-powered sample answers instantly.',
    color: 'green',
  },
  {
    title: 'Notes to Questions',
    description: 'Upload images of your study notes and get automatically generated questions to test your understanding.',
    color: 'pink',
  },
  {
    title: 'AI Study Bot',
    description: 'Get instant answers to your academic questions, explanations, and guidance from our intelligent study companion.',
    color: 'blue',
  },
  {
    title: 'Study Groups',
    description: 'Join or create study groups, collaborate with peers, and share resources to succeed together.',
    color: 'orange',
  },
  {
    title: 'Share & Collaborate',
    description: 'Share questions with friends and study groups. Help each other succeed in your academic journey.',
    color: 'cyan',
  },
] as const

// Routes
export const ROUTES = {
  HOME: '/',
  GET_STARTED: '/register',
  LOGIN: '/login',
  SIGNUP: '/register',
  DASHBOARD: '/dashboard',
  MY_ACCOUNT: '/profile',
  DOWNLOADS: '/downloads',
  PAPERS: '/papers',
  PAST_PAPERS: '/past-papers',
  MARKING_SCHEMES: '/marking-schemes',
  SCHOOLS: '/schools',
  CHATBOT: '/chatbot',
  STUDY_GROUPS: '/study-groups',
  PRICING: '/pricing',
  YOUTUBE: '/youtube',
} as const

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
  },
  PAPERS: {
    LIST: '/api/papers',
    SEARCH: '/api/papers/search',
    DETAIL: (id: string) => `/api/papers/${id}`,
  },
  PAYMENT: {
    INITIATE: '/api/payment/mpesa/initiate',
    CALLBACK: '/api/payment/mpesa/callback',
  },
  AI: {
    CHAT: '/api/ai/chat',
    GENERATE_QUESTIONS: '/api/ai/generate-questions',
  },
} as const

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'okoa_sem_auth_token',
  USER_DATA: 'okoa_sem_user_data',
  THEME: 'okoa_sem_theme',
  CHAT_HISTORY: 'okoa_sem_chat_history',
  SUBSCRIPTION: 'okoa_sem_subscription',
} as const

// AI Chatbot Configuration
export const CHATBOT_CONFIG = {
  BOT_NAME: 'AI Study Bot',
  WELCOME_MESSAGE: `Hello! I'm your AI Study Assistant. How can I help you with your studies today?

I can help you with:
• Understanding complex concepts
• Solving math and science problems
• Brainstorming essay ideas
• Explaining historical events
• And much more!

Just ask me anything, and we'll tackle it together!`,
  DEMO_RESPONSES: [
    "That's a very thoughtful question! Let me help you understand this concept better. Could you provide more details about which specific aspect you'd like to explore?",
    "Great question! This topic is fascinating. Here's what you need to know...",
    "I'd be happy to help you with that! Let's break this down step by step.",
    "Interesting question! This relates to several key concepts. Let me explain...",
    "I can definitely help with that. To give you the best answer, could you tell me more about your current understanding?",
  ],
} as const

// Subscription Plans
export const SUBSCRIPTION_PLANS = {
  daily: {
    id: 'daily' as const,
    name: 'Daily Plan',
    duration: '24 hours access',
    durationLabel: '1 Day',
    price: 10,
  },
  monthly: {
    id: 'monthly' as const,
    name: 'Monthly Plan',
    duration: '30 days access',
    durationLabel: '30 Days',
    price: 100,
  },
} as const

// YouTube Popular Topics
export const YOUTUBE_TOPICS = [
  { label: 'Calculus', query: 'calculus' },
  { label: 'Physics', query: 'physics' },
  { label: 'Programming', query: 'programming' },
  { label: 'Chemistry', query: 'chemistry' },
  { label: 'Biology', query: 'biology' },
  { label: 'Mathematics', query: 'mathematics' },
  { label: 'Data Structures', query: 'data structures' },
  { label: 'Algorithms', query: 'algorithms' },
] as const

// YouTube Demo Videos 
export const generateDemoVideos = (query: string) => [
  { id: '1', title: `Introduction to ${query}`, channel: 'EduChannel', views: '1.2M', publishedAt: '2 weeks ago' },
  { id: '2', title: `${query} Tutorial for Beginners`, channel: 'Learn Tech', views: '856K', publishedAt: '1 month ago' },
  { id: '3', title: `Advanced ${query} Concepts`, channel: 'Pro Learning', views: '543K', publishedAt: '3 weeks ago' },
  { id: '4', title: `${query} Explained Simply`, channel: 'Simple Science', views: '2.1M', publishedAt: '1 week ago' },
  { id: '5', title: `Master ${query} in 30 Minutes`, channel: 'Quick Learn', views: '987K', publishedAt: '5 days ago' },
  { id: '6', title: `${query} Project Examples`, channel: 'Code Masters', views: '654K', publishedAt: '2 months ago' },
]

// Past Papers Schools Data
export const PAST_PAPERS_SCHOOLS = [
  {
    id: 'sci',
    name: 'School of Computing and Informatics',
    abbreviation: 'SCI',
    years: [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015],
  },
  {
    id: 'safs',
    name: 'School of Agriculture and Food Sciences',
    abbreviation: 'SAFS',
    years: [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015],
  },
  {
    id: 'sbe',
    name: 'School of Business and Economics',
    abbreviation: 'SBE',
    years: [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015],
  },
  {
    id: 'sea',
    name: 'School of Engineering and Architecture',
    abbreviation: 'SEA',
    years: [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015],
  },
  {
    id: 'sed',
    name: 'School of Education',
    abbreviation: 'SED',
    years: [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015],
  },
  {
    id: 'shs',
    name: 'School of Health Sciences',
    abbreviation: 'SHS',
    years: [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015],
  },
  {
    id: 'son',
    name: 'School of Nursing',
    abbreviation: 'SON',
    years: [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015],
  },
  {
    id: 'spas',
    name: 'School of Pure and Applied Sciences',
    abbreviation: 'SPAS',
    years: [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015],
  },
  {
    id: 'tvet',
    name: 'Technical and Vocational Education',
    abbreviation: 'TVET',
    years: [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015],
  },
] as const

// Generate demo past papers
export const generateDemoPastPapers = (school: string, schoolAbbr: string, year: number) => {
  const courses = {
    SCI: [
      { code: 'BIT 2101', name: 'Object Oriented Programming I' },
      { code: 'BIT 2102', name: 'Data Structures and Algorithms' },
      { code: 'BIT 2103', name: 'Database Management Systems' },
      { code: 'BIT 2104', name: 'Computer Networks' },
      { code: 'BIT 2105', name: 'Software Engineering' },
      { code: 'BIT 2106', name: 'Web Development' },
      { code: 'BIT 2107', name: 'Mobile Application Development' },
      { code: 'BIT 2108', name: 'Operating Systems' },
      { code: 'BCS 2201', name: 'Computer Architecture' },
      { code: 'BCS 2202', name: 'Artificial Intelligence' },
      { code: 'BCS 2203', name: 'Machine Learning' },
      { code: 'BCS 2204', name: 'Cybersecurity Fundamentals' },
    ],
    SBE: [
      { code: 'BBA 2101', name: 'Principles of Management' },
      { code: 'BBA 2102', name: 'Financial Accounting' },
      { code: 'BBA 2103', name: 'Business Statistics' },
      { code: 'BBA 2104', name: 'Marketing Management' },
      { code: 'BBA 2105', name: 'Human Resource Management' },
      { code: 'BBA 2106', name: 'Organizational Behavior' },
      { code: 'ECO 2201', name: 'Microeconomics' },
      { code: 'ECO 2202', name: 'Macroeconomics' },
      { code: 'FIN 2301', name: 'Corporate Finance' },
      { code: 'ACC 2401', name: 'Cost Accounting' },
    ],
    SEA: [
      { code: 'ENG 2101', name: 'Engineering Mathematics I' },
      { code: 'ENG 2102', name: 'Thermodynamics' },
      { code: 'ENG 2103', name: 'Fluid Mechanics' },
      { code: 'ENG 2104', name: 'Strength of Materials' },
      { code: 'ENG 2105', name: 'Electrical Engineering' },
      { code: 'ARC 2201', name: 'Architectural Design' },
      { code: 'CIV 2301', name: 'Structural Analysis' },
      { code: 'MEC 2401', name: 'Machine Design' },
    ],
    SAFS: [
      { code: 'AGR 2101', name: 'Crop Production' },
      { code: 'AGR 2102', name: 'Soil Science' },
      { code: 'AGR 2103', name: 'Animal Husbandry' },
      { code: 'FST 2201', name: 'Food Processing Technology' },
      { code: 'FST 2202', name: 'Food Microbiology' },
      { code: 'NUT 2301', name: 'Human Nutrition' },
    ],
    SED: [
      { code: 'EDU 2101', name: 'Educational Psychology' },
      { code: 'EDU 2102', name: 'Curriculum Development' },
      { code: 'EDU 2103', name: 'Teaching Methods' },
      { code: 'EDU 2104', name: 'Educational Technology' },
      { code: 'EDU 2105', name: 'Assessment and Evaluation' },
    ],
    SHS: [
      { code: 'MED 2101', name: 'Human Anatomy' },
      { code: 'MED 2102', name: 'Physiology' },
      { code: 'MED 2103', name: 'Pharmacology' },
      { code: 'PUH 2201', name: 'Public Health' },
      { code: 'CLM 2301', name: 'Clinical Medicine' },
    ],
    SON: [
      { code: 'NUR 2101', name: 'Fundamentals of Nursing' },
      { code: 'NUR 2102', name: 'Medical-Surgical Nursing' },
      { code: 'NUR 2103', name: 'Community Health Nursing' },
      { code: 'NUR 2104', name: 'Pediatric Nursing' },
      { code: 'NUR 2105', name: 'Mental Health Nursing' },
    ],
    SPAS: [
      { code: 'MAT 2101', name: 'Calculus I' },
      { code: 'MAT 2102', name: 'Linear Algebra' },
      { code: 'PHY 2201', name: 'Classical Mechanics' },
      { code: 'PHY 2202', name: 'Electromagnetism' },
      { code: 'CHM 2301', name: 'Organic Chemistry' },
      { code: 'CHM 2302', name: 'Inorganic Chemistry' },
      { code: 'BIO 2401', name: 'Cell Biology' },
      { code: 'BIO 2402', name: 'Genetics' },
    ],
    TVET: [
      { code: 'TEC 2101', name: 'Technical Drawing' },
      { code: 'TEC 2102', name: 'Workshop Technology' },
      { code: 'TEC 2103', name: 'Electrical Installation' },
      { code: 'TEC 2104', name: 'Plumbing Technology' },
      { code: 'TEC 2105', name: 'Automotive Technology' },
    ],
  }

  const schoolCourses = courses[schoolAbbr as keyof typeof courses] || courses.SCI
  const examTypes: Array<'main' | 'supplementary' | 'cat'> = ['main', 'supplementary', 'cat']
  const semesters: Array<'first' | 'second'> = ['first', 'second']

  const papers = []
  
  for (const course of schoolCourses) {
    for (const semester of semesters) {
      for (const examType of examTypes) {
        papers.push({
          id: `${schoolAbbr}-${year}-${course.code}-${semester}-${examType}`,
          title: `${course.code} - ${course.name} (${examType === 'cat' ? 'CAT' : examType.charAt(0).toUpperCase() + examType.slice(1)} Exam)`,
          courseCode: course.code,
          courseName: course.name,
          school: school,
          schoolAbbreviation: schoolAbbr,
          year: year,
          semester: semester,
          examType: examType,
          fileUrl: `/papers/${schoolAbbr}/${year}/${course.code.replace(' ', '-')}-${semester}-${examType}.pdf`,
          fileSize: `${Math.floor(Math.random() * 3) + 1}.${Math.floor(Math.random() * 9)}MB`,
          uploadedAt: new Date(year, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
          downloads: Math.floor(Math.random() * 5000) + 100,
        })
      }
    }
  }

  return papers
}