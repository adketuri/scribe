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
      <Drawer opened={opened} onClose={close} title="Table of Contents">
        <TableOfContents />
      </Drawer>
      <Container size="sm">
        <ActiveSequence />
        <SequenceNavigator onOpenTableOfContents={open} />
      </Container>
    </>);
}
