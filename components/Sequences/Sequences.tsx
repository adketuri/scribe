'use client';

import { Container, Drawer } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { TableOfContents } from '../TableOfContents/TableOfContents';
import { ActiveSequence } from '../ActiveSequence/ActiveSequence';
import { SequenceNavigator } from '../SequenceNavigator/SequenceNavigator';
import { HeaderMenu } from '../HeaderMenu/HeaderMenu';

export function Sequences() {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <HeaderMenu onClickHeader={open} />
      <Drawer.Root opened={opened} onClose={close}>
        <Drawer.Overlay />
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title>Table of Contents</Drawer.Title>
            <Drawer.CloseButton />
          </Drawer.Header>
          <Drawer.Body p={0} m={0}>
            <TableOfContents onLinkSelected={close} />
          </Drawer.Body>
        </Drawer.Content>
      </Drawer.Root>
      <Container size="sm">
        <ActiveSequence />
        <SequenceNavigator onOpenTableOfContents={open} />
      </Container>
    </>
  );
}
