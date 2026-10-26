'use server';

import { registerUser, RegisterInput, AuthResult } from '@/lib/auth/session';

export async function registerAction(input: RegisterInput): Promise<AuthResult> {
  return registerUser(input);
}
