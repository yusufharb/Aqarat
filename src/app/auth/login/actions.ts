'use server';

import { loginUser, logoutUser, LoginInput, AuthResult } from '@/lib/auth/session';

export async function loginAction(input: LoginInput): Promise<AuthResult> {
  return loginUser(input);
}

export async function logoutAction(): Promise<void> {
  return logoutUser();
}
