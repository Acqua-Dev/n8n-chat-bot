import { Place } from '@/api/place/types';

export interface CreateUserDto {
  firstName?: string;
  lastName?: string;
  email: string;
  password?: string;
  activationCode?: string;
  organizationId: string;
}

export interface UserEntity extends CreateUserDto {
  disabled?: boolean;
  phoneNumber?: string;
  address?: Place;
  profilePicture?: string | null | undefined;
}

export interface Stats {
  lastConnection?: Date;
  numberOfConnections?: number;
}

export interface User extends UserEntity {
  _id?: string;
  createdAt: Date;
  updatedAt: Date;
  stats: Stats;
}

type removeFields = 'password';

export type UserForClient = Omit<User, removeFields>;

export type UpdateUserDto = Partial<UserEntity>;

export type UpdateUserWithTokenDto = Partial<
  Pick<UserEntity, 'password' | 'phoneNumber'>
>;
