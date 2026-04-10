/**
 * Marking Schemes Types
 * API request/response types and domain models
 */

// ─── API Request/Response Types ────────────────────────────────────────────

export interface GenerateMarkingSchemeRequest {
  examPaperId: number
}

export interface GenerateMarkingSchemeApiResponse {
  success: boolean
  message: string
  data: MarkingSchemeGenerationData
}

export interface MarkingSchemeGenerationData {
  sessionId: string
  examPaperId: number
  status: MarkingSchemeStatus
  message: string
  generatedMarkingScheme: MarkingSchemeContent | null
}

export interface CheckMarkingSchemeStatusApiResponse {
  success: boolean
  message: string
  data: MarkingSchemeStatusData
}

export interface MarkingSchemeStatusData {
  sessionId: string
  status: MarkingSchemeStatus
  generatedMarkingScheme: MarkingSchemeContent | null
  message: string
}

export interface GetMarkingSchemesApiResponse {
  success: boolean
  message: string
  data: {
    markingSchemes: MarkingSchemeContent[]
  }
}

// ─── Domain Types ─────────────────────────────────────────────────────────

export type MarkingSchemeStatus = 
  | 'GENERATION_STARTED'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'FAILED'

export interface MarkingSchemeContent {
  id: string
  examPaperId: number
  sessionId: string
  content: string
  status: MarkingSchemeStatus
  createdAt: string
  updatedAt: string
}

export interface MarkingSchemeWithPaper extends MarkingSchemeContent {
  paper?: {
    id: string
    courseCode: string
    courseName: string
    year: number
    semester: 'first' | 'second'
    examType: string
  }
}
