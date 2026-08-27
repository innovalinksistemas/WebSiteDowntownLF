// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://lafortunadowntown.com",
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
      lastmod: new Date(),
      // Las 404 no deben aparecer en el sitemap.
      filter: (page) => !/\/404\/?$/.test(new URL(page).pathname),
      serialize(item) {
        const path = new URL(item.url).pathname.replace(/^\/en/, "") || "/";
        // La home y las landings de paquetes son las que compiten por
        // "Arenal Fortuna"; el resto queda por debajo.
        // El sitemap redondea a un decimal, así que la escala va de 0.1 en 0.1.
        if (path === "/") item.priority = 1.0;
        else if (path === "/arenal-fortuna/") item.priority = 0.9;
        else if (path === "/baldi/" || path === "/ecotermales/") item.priority = 0.8;
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
   * desde el propio dominio y se precargan, eliminando dos conexiones a
   * terceros del camino crítico. `fallbacks` reduce el salto de layout.
   */
  fonts: [
    {
      provider: fontProviders.google(),
      name: "Cormorant Garamond",
      cssVariable: "--font-cormorant",
      // Solo subset `latin`: ya cubre los acentos del español (á é í ó ú ñ ¿ ¡).
      // `latin-ext` duplicaría los archivos sin aportar nada aquí.
      weights: [400, 500, 600],
      styles: ["normal", "italic"],
      subsets: ["latin"],
      fallbacks: ["Georgia", "Times New Roman", "serif"],
    },
    {
      provider: fontProviders.google(),
      name: "Great Vibes",
      cssVariable: "--font-great-vibes",
      weights: [400],
      subsets: ["latin"],
      fallbacks: ["cursive"],
    },
    {
      provider: fontProviders.google(),
      name: "Manrope",
      cssVariable: "--font-manrope",
      weights: [400, 500, 600, 700],
      subsets: ["latin"],
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
  vite: {
    plugins: [tailwindcss()],
  },
});
