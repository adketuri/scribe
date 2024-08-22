import * as deepl from 'deepl-node';
import { TargetLanguageCode } from 'deepl-node';

const translator = new deepl.Translator(process.env.DEEPL_API_KEY!);

export async function translate(text: string, language: string) {
  let convertedLanguage = language;
  if (language === 'pt') {
    convertedLanguage = 'pt-BR';
  }
  const result = await translator.translateText(
    text,
    null,
    convertedLanguage as TargetLanguageCode,
    {
      formality: 'default',
    }
  );
  return result.text;
}
