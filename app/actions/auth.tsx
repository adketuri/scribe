'use server';

import { redirect } from 'next/navigation';
import { SignupFormSchema, FormState } from '@/app/lib/definitions';
import { createSession, deleteSession } from '../lib/session';

export async function login(state: FormState, formData: FormData) {
  const validatedFields = SignupFormSchema.safeParse({
    username: formData.get('username'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  const { username, password } = validatedFields.data;
  if (password !== process.env.LOGIN_PASSWORD || username !== process.env.LOGIN_USERNAME) {
    return { message: 'Username or password is incorrect.' };
  }

  await createSession(username);
  return redirect('/');
}

export async function logout() {
  deleteSession();
  redirect('/login');
}
