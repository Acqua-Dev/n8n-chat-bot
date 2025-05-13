import { ForgotPasswordDto, SignInDto, SignUpDto } from '@/api/auth/types';
import { ApiSuccessResponse } from '@/api/common/types';
import { fetchApi, HTTPMethod } from '@/utils/fetch-api';
import { AuthRoutes } from '@/api/auth/constants';
import { UserForClient } from '@/api/user/types';

export async function signUp(
  signUpDto: SignUpDto,
): Promise<ApiSuccessResponse> {
  return fetchApi<ApiSuccessResponse, SignUpDto>({
    method: HTTPMethod.POST,
    endpoint: AuthRoutes.signUp,
    body: signUpDto,
  });
}

export async function signIn(
  signInDto: SignInDto,
): Promise<ApiSuccessResponse> {
  return fetchApi<ApiSuccessResponse, SignInDto>({
    method: HTTPMethod.PUT,
    endpoint: AuthRoutes.signIn,
    body: signInDto,
  });
}

export async function getUser(): Promise<UserForClient | null> {
  try {
    return fetchApi<UserForClient>({
      method: HTTPMethod.GET,
      endpoint: AuthRoutes.user,
    });
  } catch {
    return null;
  }
}

export async function forgotPassword(
  forgotPasswordDto: ForgotPasswordDto,
): Promise<ApiSuccessResponse> {
  return fetchApi<ApiSuccessResponse, ForgotPasswordDto>({
    method: HTTPMethod.POST,
    endpoint: AuthRoutes.forgotPassword,
    body: forgotPasswordDto,
  });
}
