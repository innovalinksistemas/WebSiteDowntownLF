// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import { ROUTE_MAP } from "./src/i18n/utils.ts";

const SITE = "https://lafortunadowntown.com";
const slash = (p) => (p.endsWith("/") ? p : `${p}/`);
// Pares ES ↔ EN con barra final, igual que las URLs reales del build.
const PAIRS = Object.entries(ROUTE_MAP).map(([es, en]) => [slash(es), slash(en)]);

export default defineConfig({
  /*
   * Paquetes de temporada retirados (vencieron en agosto de 2026): el 301 lo
   * hace public/_redirects en Cloudflare. No se declaran aquí como `redirects`
   * de Astro: generaban /baldi/index.html (meta refresh) y en Cloudflare Pages
   * un archivo estático gana a la regla de _redirects, así que /baldi/
   * respondía 200 en lugar de 301.
   */
  site: SITE,
  i18n: {
    defaultLocale: "es",
    locales: ["es", "en"],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: "es",
        locales: { es: "es-CR", en: "en-US" },
      },
      changefreq: "weekly",
      // Sin `lastmod`: con `new Date()` todas las URLs cambiaban en cada build,
      // y Google deja de fiarse de un lastmod que no refleja cambios reales.
      // Las 404 no deben aparecer en el sitemap.
      filter: (page) =>
        !/\/404\/?$/.test(new URL(page).pathname) &&
        !/\/(baldi|ecotermales)\/?$/.test(new URL(page).pathname),
      serialize(item) {
        // La integración solo empareja idiomas por prefijo (/faq ↔ /en/faq), así
        // que /galeria ↔ /en/gallery y /privacidad ↔ /en/privacy quedaban sin
        // alternativas. Se toman del mismo mapa que usa el hreflang del <head>.
        const pair = PAIRS.find(([es, en]) => item.url === SITE + es || item.url === SITE + en);
        if (pair) {
          item.links = [
            { lang: "es-CR", url: SITE + pair[0] },
            { lang: "en-US", url: SITE + pair[1] },
            { lang: "x-default", url: SITE + pair[0] },
          ];
        }

        const path = new URL(item.url).pathname.replace(/^\/en/, "") || "/";
        // La home y las landings de paquetes son las que compiten por
        // "Arenal Fortuna"; el resto queda por debajo.
        // El sitemap redondea a un decimal, así que la escala va de 0.1 en 0.1.
        if (path === "/") item.priority = 1.0;
        else if (path === "/arenal-fortuna/") item.priority = 0.9;
        else if (path === "/baldi/" || path === "/ecotermales/") item.priority = 0.8;
        else if (path === "/privacidad/" || path === "/privacy/") item.priority = 0.3;
        else item.priority = 0.7;
        return item;
      },
    }),
  ],
  /*
   * Fuentes auto-hospedadas (API estable de Astro, no experimental).
   *
   * Antes se cargaban dos veces desde Google: un <link rel="stylesheet"> en el
   * Layout y además una regla CSS de importación remota al inicio de global.css
   * — el patrón más bloqueante posible. Ahora se descargan en build, se sirven
   * desde el propio dominio (sin preload: ver Layout.astro), eliminando dos conexiones a
   * terceros del camino crítico. `fallbacks` reduce el salto de layout.
   */
  fonts: [
    /*
     * Fuentes locales recortadas (scripts/subset-fonts.py): mismas familias de
     * Google, pero solo con los pesos que usa el CSS y los glifos de español e
     * inglés. 128 KB -> 84 KB. Con el H1 como LCP (texto), las 4 entran en la
     * cadena crítica de PageSpeed móvil: sin fuentes el LCP simulado bajaba
     * de 2,5 s a 2,1 s. Originales en src/assets/fonts/originales/.
     */
    {
      provider: fontProviders.local(),
      name: "Cormorant Garamond",
      cssVariable: "--font-cormorant",
      // La redonda (H1) y la cursiva van en entradas separadas: cada una es
      // un archivo propio y solo se descarga si la página la usa.
      options: {
        variants: [
          { src: ["./src/assets/fonts/cormorant-latin-es.woff2"], weight: "400 600", style: "normal" },
        ],
      },
      fallbacks: ["Georgia", "Times New Roman", "serif"],
    },
    {
      provider: fontProviders.local(),
      name: "Cormorant Garamond",
      cssVariable: "--font-cormorant-italic",
      options: {
        variants: [
          { src: ["./src/assets/fonts/cormorant-italic-latin-es.woff2"], weight: "400 600", style: "italic" },
        ],
      },
      fallbacks: ["Georgia", "Times New Roman", "serif"],
    },
    {
      provider: fontProviders.local(),
      name: "Great Vibes",
      cssVariable: "--font-great-vibes",
      options: {
        variants: [
          { src: ["./src/assets/fonts/great-vibes-latin-es.woff2"], weight: "400", style: "normal" },
        ],
      },
      fallbacks: ["cursive"],
    },
    {
      provider: fontProviders.local(),
      name: "Manrope",
      cssVariable: "--font-manrope",
      options: {
        variants: [
          { src: ["./src/assets/fonts/manrope-latin-es.woff2"], weight: "400 700", style: "normal" },
        ],
      },
      fallbacks: ["system-ui", "Segoe UI", "sans-serif"],
    },
  ],
  image: {
    // `layout` y `responsiveStyles` son estables desde Astro 5.10 (no experimentales).
    // Sin `layout`, las imágenes no reciben comportamiento responsive; sin
    // `responsiveStyles` (false por defecto) no se emiten los estilos que lo aplican.
    layout: "constrained",
    responsiveStyles: true,
    objectFit: "cover",
    objectPosition: "center",
    breakpoints: [640, 828, 1080, 1280, 1668, 2048],
    service: {
      entrypoint: "astro/assets/services/sharp",
      // No existen `image.quality` ni `image.formats` en Astro 7: la única vía
      // para fijar defaults globales del codificador es `service.config`.
      config: {
        avif: { quality: 55, effort: 4 },
        webp: { quality: 74, effort: 4 },
        jpeg: { quality: 78, progressive: true, mozjpeg: true },
      },
    },
  },
  build: {
    /*
     * El CSS global es un solo archivo de ~135 KB (≈20 KB con brotli) y era
     * el único recurso que bloqueaba el render. Inline evita ese viaje de ida
     * y vuelta antes del primer pintado; se pierde la caché entre páginas,
     * irrelevante para un sitio con una landing principal.
     */
    inlineStylesheets: "always",
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
