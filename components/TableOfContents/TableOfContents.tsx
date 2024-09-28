'use client';

import cx from 'clsx';
import { Box, Text, Group, rem, NavLink } from '@mantine/core';
import { IconBook } from '@tabler/icons-react';
import useSWR from 'swr';
import classes from './TableOfContents.module.css';
import { fetcher } from '@/app/lib/fetcher';
import { GetSequencesResponse } from '@/types/api';
import { useHashedSequence } from '@/app/hooks/useHashedSequence';
import { useAuth } from '@/app/hooks/useAuth';

const secondaryNames = [
  ['Misc'],
  [
    'Tulron Outskirts',
    'Abandoned Village',
    'Alcuria (Reene)',
    'Tulron Village',
    'Tulron Mines',
    'Tulron Train',
    'N/A',
  ],
  [
    'Tulron Flashback',
    'Slogstomps',
    'Arkor/Roughlands',
    'Arkor/Aqueduct',
    'Jigoku',
    'Arkor Tower',
    'Oskari Flashback',
    'Arkor Conclusion',
    'N/A',
  ],
];

interface TableOfContentsProps {
  onLinkSelected: () => void;
}

interface Link {
  label: string;
  context: string;
  link: string;
  order: number;
}

export function TableOfContents({ onLinkSelected }: TableOfContentsProps) {
  const { data } = useSWR<GetSequencesResponse>('/api/sequences', fetcher);
  const links = data?.sequences.map((seq) => ({
    label: seq.name,
    context: seq.context,
    link: seq.name,
    order: 1,
  }));

  const linkGroups: Array<Array<Array<Link>>> = [];
  const specialLinkGroup: Array<Link> = [];
  links?.forEach((item) => {
    if (!item.label.includes('.')) {
      specialLinkGroup.push(item);
    } else {
      const group = item.label.split('.');
      const primary = parseInt(group[0], 10);
      const secondary = parseInt(group[1], 10);
      if (primary > linkGroups.length) {
        linkGroups.push([[]]);
      }
      if (secondary > linkGroups[primary - 1].length) {
        linkGroups[primary - 1].push([]);
      }
      linkGroups[primary - 1][secondary - 1].push(item);
    }
  });

  const session = useAuth();
  return (
    <>
      <TableOfContentsSection
        title="Act I"
        primary={1}
        linkGroups={linkGroups[0] || []}
        onLinkSelected={onLinkSelected}
      />
      <TableOfContentsSection
        title="Act II"
        primary={2}
        linkGroups={linkGroups[1] || []}
        onLinkSelected={onLinkSelected}
      />
      {session?.role !== 'viewer' && (
        <TableOfContentsSection
          title="Misc"
          primary={0}
          linkGroups={[specialLinkGroup] || []}
          onLinkSelected={onLinkSelected}
        />
      )}
    </>
  );
}

function TableOfContentsSection({
  title,
  primary,
  linkGroups,
  onLinkSelected,
}: {
  title: string;
  primary: number;
  linkGroups: Array<Array<any>>;
  onLinkSelected: () => void;
}) {
  const sequenceName = useHashedSequence();

  return (
    <Box>
      <Group className={classes.heading}>
        <IconBook style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
        <Text size="lg">{title}</Text>
      </Group>
      {linkGroups
        .filter((l) => {
          if (l.length > 0 && l[0].label.includes('.')) {
            const primaryDigit = parseInt(l[0].label.split('.')[0], 10);
            return primary === primaryDigit;
          }
          return primary === 0;
        })
        .map((group, i) => (
          <Box key={i} ml={0}>
            <TableOfContentsSubSection
              name={secondaryNames[primary][i]}
              defaultOpened={group.some(({ link }) => link === sequenceName)}
            >
              {group.map((item) => (
                <Box<'a'>
                  component="a"
                  href={`#${item.link}`}
                  onClick={onLinkSelected}
                  key={item.label}
                  className={cx(classes.link, {
                    [classes.linkActive]: sequenceName === item.link,
                  })}
                  style={{ paddingLeft: `calc(${item.order} * var(--mantine-spacing-md))` }}
                >
                  <Text size="sm">{item.label}</Text>
                  <Text size="sm" c="dimmed">
                    {item.context}
                  </Text>
                </Box>
              ))}
            </TableOfContentsSubSection>
          </Box>
        ))}
    </Box>
  );
}

function TableOfContentsSubSection({
  name,
  defaultOpened,
  children,
}: {
  name: string;
  defaultOpened: boolean;
  children: React.ReactNode;
}) {
  return (
    <NavLink
      className={classes.subheading}
      label={name}
      variant="filled"
      childrenOffset={0}
      defaultOpened={defaultOpened}
    >
      {children}
    </NavLink>
  );
}
