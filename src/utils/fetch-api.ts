import { AppException } from '@/api/common/types';

export enum HTTPMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
}

type FetchApiOptions<TBody = unknown> = {
  method: HTTPMethod;
  endpoint: string;
  params?: Record<string, string>;
  body?: TBody | FormData;
  headers?: HeadersInit;
  timeout?: number;
};

export async function fetchApi<TResponse, TBody = unknown>({
  method,
  endpoint,
  params,
  body,
  headers = {},
  timeout = 12000,
}: FetchApiOptions<TBody>): Promise<TResponse> {
  // Build URL with query params
  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value) url.searchParams.append(key, value);
    });
  }

  // Prepare request options
  const requestInit: RequestInit = {
    method,
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      ...headers,
    },
    signal: AbortSignal.timeout(timeout),
  };

  // Handle request body
  if (body) {
    if (body instanceof FormData) {
      requestInit.body = body;
    } else {
      requestInit.body = JSON.stringify(body);
      requestInit.headers = {
        ...requestInit.headers,
        'Content-Type': 'application/json',
      };
    }
  }

  // Execute request
  console.log('Request URL:', method, url.toString());
  const response = await fetch(url.toString(), requestInit);

  // Parse response
  const data = response.status !== 204 ? await response.json() : null;

  // Handle errors
  if (data?.errorMessage === '[504] - Lambda timeout.') {
    throw new AppException(data.errorType, 504, 'serverTimedOut');
  }

  if (!response.ok) {
    throw new AppException(
      data?.error || 'Unknown error',
      response.status,
      data?.message,
      data?.data || {},
    );
  }

  return data as TResponse;
}
