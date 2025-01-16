import { UserSessionParams } from '@/types';

export const isAdmin = (user: UserSessionParams): boolean => {
  return user?.roles?.includes('admin');
};
