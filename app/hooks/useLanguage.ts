import useSWR from 'swr';
import { useSyncExternalStore } from 'react';
import { Lang } from '@prisma/client';
import { GetLanguagesResponse } from '@/types/api';
import { fetcher } from '../lib/fetcher';

type Listener = () => void;
type LanguageStore = Lang;

let storeState: LanguageStore | null = null;
let listeners: Listener[] = [];

function subscribe(listener: Listener) {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

function getSnapshot() {
  return storeState;
}

function setState(newState: LanguageStore) {
  storeState = newState;
  listeners.forEach((listener) => listener());
}

export const useLanguage = () => {
  const { data, error } = useSWR<GetLanguagesResponse>('/api/languages', fetcher);

  // Set initial state when data fetches
  if (data && !storeState) {
    setState(data.languages[0]);
  }

  // Use the sync external store to manage state
  const language = useSyncExternalStore(subscribe, getSnapshot);

  return {
    language,
    languages: data?.languages,
    setLanguage: (lang: LanguageStore) => setState(lang),
    error,
    isLoading: !error && !language,
  };
};
