import useSWR from 'swr';
import useCookie from 'react-use-cookie';
import { useState } from 'react';
import { GetLanguagesResponse } from '@/types/api';
import { fetcher } from '../lib/fetcher';
import { LanguageCode } from '@/types/dialogue';

export const useLanguage = () => {
  const { data, isLoading } = useSWR<GetLanguagesResponse>('/api/languages', fetcher);
  // const [languageCookie, setLanguageCookie] = useCookie('lang', 'en');
  const [language, setLanguage] = useState('en');

  const updateLanguage = (v: LanguageCode) => {
    setLanguage(v);
  };

  return {
    isLoading,
    language,
    languages: data?.languages,
    setLanguage: updateLanguage,
  };
};
