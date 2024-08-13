'use client';

import { Menu, Group, Center, Container, Title, Loader } from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';
import Image from 'next/image';
import classes from './HeaderMenu.module.css';
import { ColorSchemeToggle } from '../ColorSchemeToggle/ColorSchemeToggle';
import { useLanguage } from '@/app/hooks/useLanguage';

interface HeaderMenuProps {
  onClickHeader: () => void
}

export function HeaderMenu({ onClickHeader }: HeaderMenuProps) {
  const { language, languages, setLanguage, isLoading } = useLanguage();
  if (isLoading || !language) return <Loader />;
  const links = [
    {
      label: language.id,
      links: languages!.map((lang) => ({
        onClick: () => setLanguage(lang),
        label: lang.id,
      })),
    },
  ];

  const items = links.map((link) => {
    const menuItems = link.links?.map((item) => (
      <Menu.Item key={item.label} onClick={item.onClick}>{item.label}</Menu.Item>
    ));

    if (menuItems) {
      return (
        <Menu key={link.label} trigger="hover" transitionProps={{ exitDuration: 0 }} withinPortal>
          <Menu.Target>
            <a
              href="#"
              className={classes.link}
              onClick={(event) => event.preventDefault()}
            >
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
      <a
        key={link.label}
        href="#"
        className={classes.link}
        onClick={(event) => event.preventDefault()}
      >
        {link.label}
      </a>
    );
  });

  return (
    <header className={classes.header}>
      <Container>
        <div className={classes.inner}>
          <Group onClick={onClickHeader} style={{ cursor: 'pointer' }} wrap="nowrap">
            <Image
              src="/scribe.png"
              width={50}
              height={50}
              alt="Logo"
            />
            <Title>Scribe</Title>
          </Group>
          <Group wrap="nowrap">
            <Group gap={5}>
              {items}
            </Group>
            <ColorSchemeToggle />
          </Group>

        </div>
      </Container>
    </header>
  );
}
