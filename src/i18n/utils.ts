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

/**
 * Equivalencias de ruta entre idiomas.
 *
 * Fuente única de verdad para hreflang y para el selector de idioma. No se puede
 * derivar quitando o poniendo el prefijo `/en`, porque hay slugs localizados:
 * `/galeria` ↔ `/en/gallery`. Con la derivación anterior, el hreflang de
 * `/galeria` apuntaba a `/en/galeria` y el de `/en/gallery` a `/gallery`;
 * ninguna de las dos existe, así que ambas caras del par eran un 404.
 *
 * Al añadir una página nueva, hay que registrarla aquí.
 */
export const ROUTE_MAP: Record<string, string> = {
  "/": "/en/",
  "/arenal-fortuna": "/en/arenal-fortuna",
  "/faq": "/en/faq",
  "/galeria": "/en/gallery",
  "/privacidad": "/en/privacy",

};

const EN_TO_ES: Record<string, string> = Object.fromEntries(
  Object.entries(ROUTE_MAP).map(([es, en]) => [en, es])
);

/** Normaliza a una clave comparable: sin barra final, salvo la raíz. */
const normalize = (p: string): string => {
  if (p === "/" || p === "/en" || p === "/en/") return p === "/" ? "/" : "/en/";
  return p.replace(/\/+$/, "");
};

/**
 * El build usa `format: "directory"`, así que las URLs reales llevan barra
 * final (/galeria/). El canonical se deriva de Astro.url.pathname y sí la
 * lleva; si hreflang la omitiera, apuntaría a una URL distinta de la canónica.
 */
const withSlash = (p: string): string => (p.endsWith("/") ? p : `${p}/`);

/**
 * Devuelve la ruta equivalente en el idioma pedido.
 * Si la ruta no está registrada, cae a la home de ese idioma en lugar de
 * inventar una URL que no existe.
 */
export function altPath(pathname: string, to: Lang): string {
  const path = normalize(pathname);
  const isEn = path === "/en/" || path.startsWith("/en/");

  if (to === "en") {
    if (isEn) return withSlash(path);
    return withSlash(ROUTE_MAP[path] ?? "/en/");
  }

  if (!isEn) return withSlash(path);
  return withSlash(EN_TO_ES[path] ?? "/");
}
