import useSWR from 'swr';
import useCookie from 'react-use-cookie';
import { GetLanguagesResponse } from '@/types/api';
import { fetcher } from '../lib/fetcher';
import { LanguageCode } from '@/types/dialogue';

export const useLanguage = () => {
  const { data, isLoading } = useSWR<GetLanguagesResponse>('/api/languages', fetcher);
  const [language, setLanguage] = useCookie('lang', 'en');

  return {
    isLoading,
    language,
    languages: data?.languages,
    setLanguage: (lang: LanguageCode) => setLanguage(lang),
  };
};
