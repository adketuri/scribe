'use client';

import { useState, useEffect } from 'react';

const getSequence = () => {
  if (typeof window === 'undefined') return '';
  const { href } = window.location;
  const seq = href.includes('#') ? href.split('#')[1] : '';
  return seq;
};

export const useHashedSequence = () => {
  const [sequence, setSequence] = useState<string>(getSequence());
  useEffect(() => {
    if (typeof window === 'undefined') return () => {};
    const onHashChanged = () => {
      setSequence(getSequence());
    };
    window.addEventListener('hashchange', onHashChanged);
    return () => {
      window.removeEventListener('hashchange', onHashChanged);
    };
  }, []);
  return sequence;
};
