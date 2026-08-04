// @ts-check
import { defineConfig } from "astro/config";
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
  vite: {
    plugins: [tailwindcss()],
  },
});
