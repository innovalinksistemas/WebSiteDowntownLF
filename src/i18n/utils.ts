import { ui, defaultLang } from "./ui";

export type Lang = keyof typeof ui;

export function getLang(locale: string | undefined): Lang {
  if (locale && locale in ui) return locale as Lang;
  return defaultLang;
}

export function useTranslations(locale: string | undefined) {
  const lang = getLang(locale);
  return function t(key: keyof (typeof ui)[typeof defaultLang]): string {
    return (ui[lang] as Record<string, string>)[key] ?? (ui[defaultLang] as Record<string, string>)[key] ?? key;
  };
}
