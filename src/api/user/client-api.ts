import { fetchApi, HTTPMethod } from '@/utils/fetch-api';
import { UserRoutes } from './constants';
import { UpdateUserDto, UpdateUserWithTokenDto, UserForClient } from './types';

export async function updateUser(
  updateUserDto: UpdateUserDto,
): Promise<UserForClient> {
  return fetchApi<UserForClient, UpdateUserDto>({
    method: HTTPMethod.PATCH,
    endpoint: UserRoutes.base,
    body: updateUserDto,
  });
}

export async function updateUserWithToken(
  token: string,
  updateDto: UpdateUserWithTokenDto,
): Promise<UserForClient> {
  return fetchApi<UserForClient, UpdateUserWithTokenDto>({
    method: HTTPMethod.PATCH,
    endpoint: UserRoutes.updateWithToken(token),
    body: updateDto,
  });
}
