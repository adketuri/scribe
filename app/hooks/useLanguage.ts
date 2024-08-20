import { useSyncExternalStore } from 'react';
import useSWR from 'swr';
import { getCookie, setCookie } from 'react-use-cookie';
import { GetLanguagesResponse } from '@/types/api';
import { fetcher } from '../lib/fetcher';
import { LanguageCode } from '@/types/dialogue';

const createLanguageStore = () => {
  const cookieKey = 'lang';
  let currentLanguage = getCookie(cookieKey, 'en');
  const listeners = new Set();

  return {
    getLanguage: () => currentLanguage,
    setLanguage: (newLanguage: LanguageCode) => {
      setCookie(cookieKey, newLanguage);
      currentLanguage = newLanguage;
      listeners.forEach((listener: any) => listener());
    },
    subscribe: (listener: any) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
};

const languageStore = createLanguageStore();

export const useLanguage = () => {
  const { data } = useSWR<GetLanguagesResponse>('/api/languages', fetcher);

  const language = useSyncExternalStore(
    languageStore.subscribe,
    languageStore.getLanguage,
    languageStore.getLanguage
  );

  return {
    language,
    setLanguage: languageStore.setLanguage,
    languages: data?.languages,
  };
};
