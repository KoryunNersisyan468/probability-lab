import { Language } from '../types';
import hy from '../locales/hy.json';
import en from '../locales/en.json';
import ru from '../locales/ru.json';

export const translations: Record<Language, Record<string, string>> = {
  hy,
  en,
  ru,
};

export type TranslationKey = keyof typeof en;
