# Downtown La Fortuna Boutique Hotel

Sitio web del **Downtown La Fortuna Boutique Hotel**, en La Fortuna de San Carlos (Arenal Fortuna), Alajuela, Costa Rica.

Astro 7 en modo estático · Tailwind v4 (CSS-first) · GSAP · bilingüe ES/EN.

## Comandos

| Comando           | Acción                                              |
| :---------------- | :-------------------------------------------------- |
| `npm install`     | Instala dependencias                                 |
| `npm run dev`     | Servidor de desarrollo en `localhost:4321`           |
| `npm run build`   | Build de producción en `./dist/`                     |
| `npm run preview` | Sirve el build — **usar esto para validar SEO/CWV**  |
| `npm run check`   | Verificación de tipos (`astro check`)                |

> El pipeline de imágenes y el formato de URLs difieren entre `dev` y el build.
> Cualquier verificación de SEO, peso o Core Web Vitals debe hacerse sobre
> `npm run build && npm run preview`, nunca en `dev`.

## Estructura

```
src/
├── assets/
│   ├── images/        Fotografía del hotel (fuente del pipeline de Astro)
│   ├── restaurants/   Fotos de los espacios gastronómicos
│   ├── offers/        Imágenes de paquetes
│   ├── baldi/  ecotermales/
│   └── logo*.png      Logos de marca
├── components/        Secciones de página
├── data/gallery.json  Datos de la galería (masonry + lightbox)
├── i18n/
│   ├── ui.ts          Diccionario ES/EN
│   ├── utils.ts       getLang, useTranslations, ROUTE_MAP, altPath
│   └── seo.ts         Capa SEO central: grafo JSON-LD, GEO, NAP, marcas
├── layouts/Layout.astro
├── lib/               Helpers de build (imágenes y schema de paquetes)
├── pages/             ES en la raíz · EN bajo /en/
└── styles/global.css
```

## Rutas

Español en la raíz, inglés bajo `/en/`. Los slugs están **localizados**:

| ES                 | EN                    |
| :----------------- | :-------------------- |
| `/`                | `/en/`                |
| `/arenal-fortuna`  | `/en/arenal-fortuna`  |
| `/faq`             | `/en/faq`             |
| `/galeria`         | `/en/gallery`         |
| `/baldi`           | `/en/baldi`           |
| `/ecotermales`     | `/en/ecotermales`     |

**Al añadir una página hay que registrarla en `ROUTE_MAP` (`src/i18n/utils.ts`).**
Ese mapa es la fuente única para `hreflang` y para el selector de idioma; sin
entrada, ambos caen al home de ese idioma.

## SEO

- `src/i18n/seo.ts` genera el grafo JSON-LD global (Hotel, los cinco
  restaurantes, la entidad regional *Arenal Fortuna*, volcán, catarata, lago,
  WebSite y WebPage). Se inyecta en todas las páginas desde el Layout.
- Los nodos por página se pasan con la prop `jsonLd` del Layout. **Es el único
  patrón admitido**: no escribir JSON-LD como literal dentro de un `<script>`,
  porque cualquier interpolación se renderiza como texto y rompe el grafo entero.
- `src/lib/packageContent.ts` genera Product + Offer + FAQPage + BreadcrumbList
  de las landings de paquetes en ambos idiomas.
- `public/robots.txt` habilita explícitamente los crawlers de IA.
- `public/llms.txt` es una ficha de datos para motores de respuesta con IA;
  **debe reflejar exactamente lo que sostiene el sitio**, o los asistentes
  citarán datos que las páginas contradicen.

## Imágenes

Todas las imágenes son locales y pasan por `astro:assets`. **No enlazar en
caliente imágenes de terceros**: la versión anterior dependía de `i.ibb.co` y
`cdn.arenalcloud.com`, pesaba ~110 MB en la portada y tres archivos ya
devolvían 404.

Al convertir un `<img>` a `<Picture>`, revisar antes si el CSS usa un selector
`.contenedor img` con altura porcentual: `<picture>` es `display:inline` y
colapsa la altura. Hace falta añadir la regla correspondiente:

```css
.contenedor picture { display: block; width: 100%; height: 100%; }
```

## Pendientes para el negocio

- Política de cancelación contradictoria: el FAQ global dice 14 días; las
  landings de paquetes usan una escala 30/15 días.
- Los paquetes Baldi y Ecotermales vencen a finales de agosto de 2026.
- `StoriesFromHeart.astro` está despublicado (`STORIES_READY = false`) hasta que
  haya contenido editorial real.
- `src/pages/_temporada-verde.astro` es un borrador deshabilitado.
