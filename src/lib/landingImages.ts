import { getImage } from "astro:assets";

import doble from "../assets/images/rooms/doble/doble-4.jpg";
import triple from "../assets/images/rooms/triple/triple-1.jpg";
// superior-3 y tf-1 son fotos de baño: no sirven como portada de habitación.
import superior from "../assets/images/rooms/superior/superior-1.jpg";
import tropical from "../assets/images/rooms/tropical-family/tf-2.jpg";

import baldi1 from "../assets/baldi/baldi-1.jpg";
import baldi2 from "../assets/baldi/baldi-2.jpg";
import baldi3 from "../assets/baldi/baldi-3.jpg";

import ecoAerea from "../assets/ecotermales/aerea.jpg";
import ecoPiscina from "../assets/ecotermales/piscina.jpg";

import { SITE } from "../i18n/seo";

/**
 * URLs optimizadas para las landings de paquetes.
 *
 * Estas páginas necesitan strings (no ImageMetadata) en cuatro sitios donde
 * <Picture> no aplica: la prop `image` del Layout (Open Graph), el campo
 * `image` del JSON-LD, `background-image` inline y algún <img> suelto.
 * `getImage()` resuelve eso en build sin salir del pipeline de Astro.
 *
 * Antes todas estas imágenes se enlazaban en caliente desde i.ibb.co, un host
 * gratuito sin SLA: si caía, caían las portadas sociales y los heroes.
 */
const url = async (src: ImageMetadata, width: number, quality = 78) =>
  (await getImage({ src, width, format: "webp", quality })).src;

/** Open Graph exige URL absoluta. */
const absolute = (path: string) => new URL(path, SITE).href;

export const landingRooms = {
  doble: await url(doble, 800),
  triple: await url(triple, 800),
  superior: await url(superior, 800),
  tropical: await url(tropical, 800),
};

export const baldiImages = {
  hero: await url(baldi3, 1920, 74),
  exp1: await url(baldi1, 1200),
  exp2: await url(baldi2, 1200),
  /** Para og:image y JSON-LD. */
  social: absolute(await url(baldi3, 1200, 80)),
};

export const ecoImages = {
  hero: await url(ecoPiscina, 1920, 74),
  exp1: await url(ecoAerea, 1200),
  social: absolute(await url(ecoAerea, 1200, 80)),
};

/**
 * Imagen del popup promocional.
 *
 * PENDIENTE: el hotel debe entregar fotografía propia de la campaña. Mientras
 * tanto se usa la toma aérea de las termales, que comunica el paquete de un
 * vistazo. Cuando llegue la definitiva, commitearla en `src/assets/` — nunca
 * enlazarla desde un CDN externo (ver la nota del encabezado de este archivo).
 */
export const promoImage = await url(ecoAerea, 720, 76);
