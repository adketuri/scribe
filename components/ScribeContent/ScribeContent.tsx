import { JSX } from 'react';
import { Container } from '@mantine/core';
import { Dialogue } from '@/types/dialogue';
// import rawDialogue from './output.json';
import { ScribeDialogue } from '../ScribeDialogue/ScribeDialogue';

const primaryNames = {
  1: 'Act I',
  2: 'Act II',
};

const secondaryNames = {
  1: 'Tulron Outskirts',
  2: 'Abandoned Village',
};

function checkSection(
  sequence: string,
  last: number,
  digit: number,
  names: Record<number, string>,
  children: JSX.Element[]
) {
  const splitSequence = sequence?.split('.');
  if (splitSequence.length >= digit + 1) {
    const current = parseInt(splitSequence[digit], 10);
    if (current !== last) {
      last = current;
      if (last in names) {
        if (digit === 0) {
          children.push(<h1>{names[last]}</h1>);
        } else if (digit === 1) {
          children.push(<h2>{names[last]}</h2>);
        }
      }
    }
  }
  return last;
}

export function ScribeContent() {
  let lastPrimary = 0;
  let lastSecondary = 0;
  const allDialogue: Dialogue[] = [];//rawDialogue;
  const children: JSX.Element[] = [];
  allDialogue.forEach(({ context, sequence, messages }) => {
    if (sequence) {
      lastPrimary = checkSection(sequence, lastPrimary, 0, primaryNames, children);
      lastSecondary = checkSection(sequence, lastSecondary, 1, secondaryNames, children);
    }
    children.push(<ScribeDialogue context={context} messages={messages} />);
  });
  return <Container>{children}</Container>;
}
