import { redirect } from 'next/navigation';
import prisma from '../lib/database';

export async function importDialogue(state: FormState, formData: FormData) {
  // const validatedFields = SignupFormSchema.safeParse({
  //   username: formData.get('username'),
  //   password: formData.get('password'),
  // });

  // if (!validatedFields.success) {
  //   return { errors: validatedFields.error.flatten().fieldErrors };
  // }

  // const { username, password } = validatedFields.data;

  const count = await prisma?.sequence.findFirst();
  console.log('!AK seq', count);
  return redirect('/');
}
