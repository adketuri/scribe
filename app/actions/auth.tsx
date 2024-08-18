'use server';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { SignupFormSchema, FormState } from '@/app/lib/definitions';
import { createSession, decrypt, deleteSession, SessionPayload } from '../lib/session';

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

export async function assertAuthenticated() {
  const cookie = cookies().get('session')?.value;
  const session = await decrypt(cookie);
  if (!session?.username) {
    throw new Error('Unauthorized access');
  }
}

export async function assertEditor() {
  const cookie = cookies().get('session')?.value;
  const session = (await decrypt(cookie)) as SessionPayload;
  if (!session?.username || session?.role === 'viewer') {
    throw new Error('Unauthorized access');
  }
}

export async function logout() {
  deleteSession();
  redirect('/login');
}
