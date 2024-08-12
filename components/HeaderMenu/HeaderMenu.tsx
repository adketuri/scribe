'use client';

import { Menu, Group, Center, Container, Box } from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';
import classes from './HeaderMenu.module.css';
import { ColorSchemeToggle } from '../ColorSchemeToggle/ColorSchemeToggle';

const links = [
  {
    label: 'Language',
    links: [
      { link: '/docs', label: 'English' },
      { link: '/resources', label: 'Japanese' },
    ],
  },
];

export function HeaderMenu() {
  const items = links.map((link) => {
    const menuItems = link.links?.map((item) => (
      <Menu.Item key={item.link}>{item.label}</Menu.Item>
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
          <Box>
            Scribe
          </Box>
          <Group>
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
