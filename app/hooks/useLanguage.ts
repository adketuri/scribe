import useSWR from 'swr';
import useCookie from 'react-use-cookie';
import { useSyncExternalStore } from 'react';
import { GetLanguagesResponse } from '@/types/api';
import { fetcher } from '../lib/fetcher';
import { LanguageCode } from '@/types/dialogue';

const listeners = new Set();

// 2. Function to notify all subscribers about the update
const notifyAll = () => {
  listeners.forEach((listener: any) => listener());
};

// 3. Subscribe function for useSyncExternalStore
const subscribe = (listener: any) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const useLanguage = () => {
  const { data } = useSWR<GetLanguagesResponse>('/api/languages', fetcher);

  const [languageCookie, setLanguageCookie] = useCookie('lang', 'en');

  const language = useSyncExternalStore(
    subscribe,
    () => languageCookie,
    () => languageCookie
  );

  const setLanguage = (newLang: LanguageCode) => {
    setLanguageCookie(newLang);
    notifyAll();
  };

  return {
    language,
    setLanguage,
    languages: data?.languages,
  };
};
