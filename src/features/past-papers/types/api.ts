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
