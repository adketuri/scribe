'use client';

import { Container } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ActiveSequence } from '../ActiveSequence/ActiveSequence';
import { SequenceNavigator } from '../SequenceNavigator/SequenceNavigator';
import { HeaderMenu } from '../HeaderMenu/HeaderMenu';

export function Sequences() {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <HeaderMenu onClickHeader={open} onClose={close} opened={opened} />
      <Container size="sm">
        <ActiveSequence />
        <SequenceNavigator onOpenTableOfContents={open} />
      </Container>
    </>
  );
}
