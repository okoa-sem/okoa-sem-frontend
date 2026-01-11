/**
 * Papers Feature Types
 */

export interface PastPaper {
  id: string;
  title: string;
  school: string;
  subject: string;
  year: number;
  examSession: 'May' | 'June' | 'November' | 'December';
  level: 'AS' | 'A2' | 'IGCSE';
  paperNumber?: number;
  variant?: number;
  fileUrl: string;
  downloadCount: number;
  previewUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaperFilters {
  school?: string;
  subject?: string;
  year?: number;
  level?: string;
  examSession?: string;
}

export interface PaperListResponse {
  data: PastPaper[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}
