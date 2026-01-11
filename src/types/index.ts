// User Types
export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  school?: string
  department?: string
  subscriptionStatus: 'free' | 'daily' | 'monthly'
  subscriptionExpiry?: Date
  createdAt: Date
  lastActive: Date
}

// Paper Types
export interface Paper {
  id: string
  title: string
  courseCode: string
  courseName: string
  school: string
  department: string
  year: number
  semester: 'first' | 'second'
  examType: 'main' | 'supplementary' | 'special'
  fileUrl: string
  fileSize: number
  uploadedBy: string
  uploadedAt: Date
  downloads: number
  verified: boolean
  topics?: string[]
}

// School Types
export interface School {
  id: string
  name: string
  abbreviation: string
  icon: string
  color: string
  description: string
  departments: Department[]
  paperCount: number
}

export interface Department {
  id: string
  name: string
  schoolId: string
  courses: Course[]
  paperCount: number
}

export interface Course {
  id: string
  code: string
  name: string
  departmentId: string
  level: number
}

// Subscription Types
export interface Subscription {
  id: string
  userId: string
  type: 'daily' | 'monthly'
  amount: number
  startDate: Date
  endDate: Date
  status: 'active' | 'expired' | 'cancelled'
  paymentMethod: 'mpesa'
  transactionId: string
}

// Payment Types
export interface MpesaPayment {
  phoneNumber: string
  amount: number
  accountReference: string
  transactionDesc: string
}

export interface PaymentResponse {
  success: boolean
  message: string
  checkoutRequestId?: string
  transactionId?: string
}

// Chat Types
export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface ChatSession {
  id: string
  title: string
  messages: ChatMessage[]
  createdAt: Date
  updatedAt: Date
}

export interface ChatHistoryItem {
  id: string
  title: string
  time: string
  date: Date
}

export interface ChatHistorySection {
  label: string
  items: ChatHistoryItem[]
}

// Subscription Types
export interface SubscriptionPlan {
  id: 'daily' | 'monthly'
  name: string
  duration: string
  durationLabel: string
  price: number
}

export interface UserSubscription {
  isActive: boolean
  plan?: SubscriptionPlan
  expiresAt?: Date
}

// Study Group Types
export interface StudyGroup {
  id: string
  name: string
  description: string
  school: string
  department?: string
  createdBy: string
  members: string[]
  maxMembers: number
  isPrivate: boolean
  createdAt: Date
  lastActivity: Date
}

// Search Types
export interface SearchFilters {
  school?: string
  department?: string
  year?: number
  semester?: 'first' | 'second'
  courseCode?: string
  topic?: string
}

export interface SearchResult {
  papers: Paper[]
  total: number
  page: number
  perPage: number
}

// Download Types
export interface Download {
  id: string
  userId: string
  paperId: string
  paper: Paper
  downloadedAt: Date
  fileType: 'pdf' | 'image'
  fileSize: number
}

// Stats Types
export interface PlatformStats {
  totalPapers: number
  totalSchools: number
  totalDepartments: number
  totalStudents: number
}

// YouTube Types
export interface YouTubeVideo {
  id: string
  title: string
  channel: string
  channelId?: string
  thumbnailUrl?: string
  views: string
  publishedAt: string
  description?: string
  duration?: string
}

export interface YouTubeSearchResult {
  id: {
    videoId: string
  }
  snippet: {
    title: string
    channelTitle: string
    publishedAt: string
    description: string
    thumbnails: {
      medium: {
        url: string
      }
      high?: {
        url: string
      }
    }
  }
}

export interface PopularTopic {
  label: string
  query: string
}

// Saved Videos & Playlists
export interface SavedVideo {
  video: YouTubeVideo
  savedAt: Date
}

export interface Playlist {
  id: string
  name: string
  description?: string
  videos: YouTubeVideo[]
  createdAt: Date
  updatedAt: Date
}

// Past Papers Types
export interface PastPaper {
  id: string
  title: string
  courseCode: string
  courseName: string
  school: string
  schoolAbbreviation: string
  year: number
  semester: 'first' | 'second'
  examType: 'main' | 'supplementary' | 'special' | 'cat'
  fileUrl: string
  fileSize: string
  uploadedAt: Date
  downloads: number
}

export interface SchoolTab {
  id: string
  name: string
  abbreviation: string
  years: number[]
}

// My Account Types
export interface UserProfile extends User {
  isVerified: boolean
  memberSince: Date
  lastActiveTime: string
}

export interface PaymentTransaction {
  id: string
  planType: 'daily' | 'monthly'
  amount: number
  currency: string
  status: 'pending' | 'completed' | 'failed'
  transactionDate: Date
  expiryDate: Date
  mpesaRef?: string
}

export interface AccountDetails {
  profile: UserProfile
  subscription: {
    isActive: boolean
    currentPlan?: SubscriptionPlan
    expiryDate?: Date
    paymentHistory: PaymentTransaction[]
  }
}

// Marking Scheme Types
export interface MarkingScheme {
  id: string
  userId: string
  paperId: string
  paper?: PastPaper
  content: string
  createdAt: Date
  updatedAt: Date
}

export interface MarkingSchemeHistory {
  id: string
  title: string
  courseCode: string
  year: number
  semester: 'first' | 'second'
  examType: 'main' | 'supplementary' | 'special' | 'cat'
  createdAt: Date
}

