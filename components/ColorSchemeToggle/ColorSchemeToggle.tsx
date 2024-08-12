'use client';

import { Button, useMantineColorScheme } from '@mantine/core';
import { IconMoon, IconSun } from '@tabler/icons-react';

export function ColorSchemeToggle() {
  const { setColorScheme, colorScheme } = useMantineColorScheme();

  const isLight = colorScheme === 'light';
  return (
    <Button color={isLight ? 'blue.4' : 'yellow.4'} autoContrast variant="transparent" onClick={() => setColorScheme(isLight ? 'dark' : 'light')}>
      {isLight ? <IconMoon /> : <IconSun />}
    </Button>
  );
}
