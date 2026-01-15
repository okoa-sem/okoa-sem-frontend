export interface SchoolName {
  name: string;
}

export interface SchoolCode {
  code: string;
}

export interface SchoolsResponse<T> {
  message: string;
  data: T[];
}

export interface ExamPaper {
  id: number;
  filename: string;
  schoolCode: string;
  schoolName: string;
  year: number;
  s3Url: string;
  fileSize: number;
  uploadedAt: string;
}

export interface PaginatedData<T> {
  content: T[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface ApiSingleResponse<T> {
  message: string;
  data: T;
}

export interface SearchPapersParams {
  filename?: string;
  schoolCode?: string;
  schoolName?: string;
  year?: number;
  fromYear?: number;
  toYear?: number;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
}
