'use server';

import axios from 'axios';
import { GetLanguagesResponse } from '@/types/api';
import { LanguageCode } from '@/types/dialogue';

export async function getServerLanguages() {
  const response = await axios.get<GetLanguagesResponse>('api/languages');
  return {
    language: 'en',
    languages: response.data.languages.map((lang) => lang.id as LanguageCode),
  };
}
