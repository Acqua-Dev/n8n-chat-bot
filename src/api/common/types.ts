export class AppException extends Error {
  statusCode: number;
  error: string;
  message: string;
  data: Record<string, never>;

  constructor(
    error: string,
    statusCode: number,
    message?: string,
    data: Record<string, never> = {},
  ) {
    super(message);
    this.error = error;
    this.message = message || error;
    this.statusCode = statusCode;
    this.data = data;
  }
}

export interface ApiSuccessResponse {
  success: boolean;
}

export interface UrlResponse {
  url: string;
}
