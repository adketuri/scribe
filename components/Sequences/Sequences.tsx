'use client';

import { Button, Container, Drawer } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { TableOfContents } from '../TableOfContents/TableOfContents';
import { ActiveSequence } from '../ActiveSequence/ActiveSequence';

export function Sequences() {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Drawer opened={opened} onClose={close} title="Table of Contents">
        <TableOfContents />
      </Drawer>
      <Container size="sm">
        <Button onClick={open}>Open Drawer</Button>
        <ActiveSequence />
      </Container>
    </>);
}
