'use client';

import {
  TextInput,
  PasswordInput,
  Checkbox,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Button,
} from '@mantine/core';
import { useActionState } from 'react';
import classes from './Login.module.css';
import { login } from '@/app/actions/auth';

export function Login() {
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <Container size={420} my={40}>
      <Title ta="center" className={classes.title}>
        Welcome to Scribe!
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Please log in with your credentials.
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form action={action}>
          <TextInput
            id="username"
            name="username"
            label="Username"
            placeholder="Your username"
            required
          />
          {state?.errors?.username && <p>{state.errors.username}</p>}
          <PasswordInput
            id="password"
            name="password"
            label="Password"
            placeholder="Your password"
            required
            mt="md"
          />
          {state?.errors?.password && <p>{state.errors.password}</p>}
          <Group justify="space-between" mt="lg">
            <Checkbox label="Remember me" />
          </Group>
          <Button type="submit" fullWidth mt="xl" disabled={pending}>
            {pending ? 'Submitting...' : 'Sign in'}
          </Button>
          {state?.message && <p>{state.message}</p>}
        </form>
      </Paper>
    </Container>
  );
}
