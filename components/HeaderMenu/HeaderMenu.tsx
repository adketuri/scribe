'use client';

import { Menu, Group, Center, Container, Title, Loader, Drawer } from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';
import Image from 'next/image';
import { useHotkeys } from '@mantine/hooks';
import classes from './HeaderMenu.module.css';
import { ColorSchemeToggle } from '../ColorSchemeToggle/ColorSchemeToggle';
import { useLanguage } from '@/app/hooks/useLanguage';
import { useAuth } from '@/app/hooks/useAuth';
import { TableOfContents } from '../TableOfContents/TableOfContents';
import { LanguageCode } from '@/types/dialogue';
import { QuickSearch } from '../QuickSearch/QuickSearch';

interface HeaderLink {
  label: string;
  links?: {
    onClick: () => void;
    label: string;
  }[];
  link?: string;
}

interface HeaderMenuProps {
  onClickHeader?: () => void;
  onClose?: () => void;
  opened?: boolean;
}

export function HeaderMenu({ onClickHeader, onClose, opened = false }: HeaderMenuProps) {
  const { language, languages, setLanguage } = useLanguage();
  const user = useAuth();

  useHotkeys([['mod+L', () => setLanguage(language === 'en' ? 'ja' : 'en')]], []);

  if (!languages) return <Loader />;
  const links: HeaderLink[] = [
    {
      label: language,
      links: languages!.map((lang) => ({
        onClick: () => setLanguage(lang.id as LanguageCode),
        label: lang.id,
      })),
    },
  ];
  if (user?.role === 'admin') {
    links.unshift({
      label: 'Admin',
      link: '/admin',
    });
  }

  const items = links.map((link) => {
    const menuItems = link.links?.map((item) => (
      <Menu.Item key={item.label} onClick={item.onClick}>
        {item.label}
      </Menu.Item>
    ));

    if (menuItems) {
      return (
        <Menu key={link.label} trigger="hover" transitionProps={{ exitDuration: 0 }} withinPortal>
          <Menu.Target>
            <a href="#" className={classes.link} onClick={(event) => event.preventDefault()}>
              <Center>
                <span className={classes.linkLabel}>{link.label}</span>
                <IconChevronDown size="0.9rem" stroke={1.5} />
              </Center>
            </a>
          </Menu.Target>
          <Menu.Dropdown>{menuItems}</Menu.Dropdown>
        </Menu>
      );
    }

    return (
      <a key={link.label} href={link.link} className={classes.link}>
        {link.label}
      </a>
    );
  });

  return (
    <>
      <QuickSearch />
      {onClose && (
        <Drawer.Root opened={opened} onClose={onClose}>
          <Drawer.Overlay />
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title>Table of Contents</Drawer.Title>
              <Drawer.CloseButton />
            </Drawer.Header>
            <Drawer.Body p={0} m={0}>
              <TableOfContents onLinkSelected={onClose} />
            </Drawer.Body>
          </Drawer.Content>
        </Drawer.Root>
      )}
      <header className={classes.header}>
        <Container>
          <div className={classes.inner}>
            <Group onClick={onClickHeader} style={{ cursor: 'pointer' }} wrap="nowrap">
              <Image src="/scribe.png" width={50} height={50} alt="Logo" />
              <Title>Scribe</Title>
            </Group>
            <Group wrap="nowrap">
              <Group gap={5}>{items}</Group>
              <ColorSchemeToggle />
            </Group>
          </div>
        </Container>
      </header>
    </>
  );
}
