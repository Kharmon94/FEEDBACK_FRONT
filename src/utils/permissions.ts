import type { User } from '../types';

export function canViewAdmin(user: User | null): boolean {
  return Boolean(user?.admin);
}
