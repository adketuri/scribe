'use client';

import cx from 'clsx';
import { Box, Text, Group, rem, NavLink } from '@mantine/core';
import { IconBook } from '@tabler/icons-react';
import useSWR from 'swr';
import classes from './TableOfContents.module.css';
import { fetcher } from '@/app/lib/fetcher';
import { GetSequencesResponse } from '@/types/api';
import { useHashedSequence } from '@/app/hooks/useHashedSequence';

// const links = [
//   { label: 'Act I', link: '#usage', order: 1 },
// ];

const secondaryNames = [
  'Tulron Outskirts',
  'Abandoned Village',
  'Tulron Village',
  'Tulron Mines',
  'Tulron Train',
  'N/A'];

function TableOfContentsSection({ name, children }: { name: string, children: any }) {
  return (
    <NavLink label={name} variant="filled" childrenOffset={0}>
      {children}
    </NavLink>);
}

export function TableOfContents() {
  const sequenceName = useHashedSequence();
  const active = `#${sequenceName}`;

  const { data } = useSWR<GetSequencesResponse>('/api/sequences', fetcher);
  const links = data?.sequences.map((seq) =>
    ({ label: seq.name, context: seq.context, link: seq.name, order: 1 }));

  const linkGroups: Array<Array<any>> = [];
  links?.forEach((item) => {
    const group = item.label.split('.');
    const groupNum = parseInt(group[1], 10);
    if (groupNum > linkGroups.length) {
      linkGroups.push([]);
    }
    linkGroups[groupNum - 1].push(item);
  });

  return (
    <Box>
      <Group p="sm" bg="gray">
        <IconBook style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
        <Text size="lg">Act I</Text>
      </Group>
      {linkGroups.map((group, i) => (
        <Box key={i} ml={0}>
          <TableOfContentsSection name={secondaryNames[i]}>
            {group.map((item) => (
              <Box<'a'>
                component="a"
                href={`#${item.link}`}
                // onClick={(event) => event.preventDefault()}
                key={item.label}
                className={cx(classes.link, { [classes.linkActive]: active === item.link })}
                style={{ paddingLeft: `calc(${item.order} * var(--mantine-spacing-md))` }}
              >
                <Text size="sm">{item.label}</Text>
                <Text size="sm" c="dimmed">{item.context}</Text>
              </Box>
            ))}
          </TableOfContentsSection>
        </Box>))}
    </Box>
  );
}
