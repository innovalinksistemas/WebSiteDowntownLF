import type { Lang } from "../i18n/utils";
import { packageGraph } from "./packageSchema";
import { baldiImages, ecoImages } from "./landingImages";

/**
 * Copy de los paquetes para datos estructurados, en ambos idiomas.
 *
 * Las fechas y precios deben coincidir con lo que muestra la página: si el
 * JSON-LD promete un precio que la landing contradice, Google lo trata como
 * marcado engañoso.
 *
 * OJO: ambas ventanas de oferta vencen a finales de agosto de 2026. Cuando
 * pasen, hay que renovar fechas y precios o despublicar las landings —
 * `priceValidUntil` vencido invalida el rich result de Offer.
 */

const BALDI = {
  es: {
    name: "Paquete Hospedaje + Pase del Día Baldi Hot Springs en Arenal Fortuna",
    description:
      "1 noche en Downtown La Fortuna Boutique Hotel, en el centro de Arenal Fortuna + Pase del día en Baldi Hot Springs (10AM–10PM, 25 piscinas) + Desayuno + Almuerzo y Cena buffet + Bebida de bienvenida + Cocteles 2×1. Niños 0–5 sin costo.",
    breadcrumb: "Paquete Baldi Hot Springs",
    faqs: [
      {
        q: "¿Qué incluye el paquete Hospedaje + Baldi en La Fortuna?",
        a: "El paquete incluye: 1 noche de alojamiento, pase del día en Baldi Hot Springs (10AM–10PM, 25 piscinas), desayuno, almuerzo y cena buffet en Baldi, bebida de bienvenida, cocteles 2×1, parqueo y WiFi gratuitos.",
      },
      {
        q: "¿Cuánto cuesta el paquete Baldi?",
        a: "₡60.000 i.i por persona en ocupación doble. Niños 0–5 GRATIS. Niños 6–10: ₡35.000.",
      },
      {
        q: "¿Hasta cuándo es válida la oferta?",
        a: "Válida del 01 de julio al 31 de agosto de 2026. Sujeta a disponibilidad.",
      },
    ],
  },
  en: {
    name: "Stay + Baldi Hot Springs Day Pass Package in Arenal Fortuna",
    description:
      "1 night at Downtown La Fortuna Boutique Hotel, in the center of Arenal Fortuna + Baldi Hot Springs day pass (10AM–10PM, 25 pools) + Breakfast + Buffet lunch and dinner + Welcome drink + 2×1 cocktails. Children 0–5 stay free.",
    breadcrumb: "Baldi Hot Springs Package",
    faqs: [
      {
        q: "What does the Stay + Baldi package in La Fortuna include?",
        a: "The package includes: 1 night of accommodation, a Baldi Hot Springs day pass (10AM–10PM, 25 pools), breakfast, buffet lunch and dinner at Baldi, a welcome drink, 2×1 cocktails, and free parking and WiFi.",
      },
      {
        q: "How much does the Baldi package cost?",
        a: "₡60,000 taxes included per person based on double occupancy. Children 0–5 stay FREE. Children 6–10: ₡35,000.",
      },
      {
        q: "How long is the offer valid?",
        a: "Valid from July 1 to August 31, 2026. Subject to availability.",
      },
    ],
  },
} as const;

const ECO = {
  es: {
    name: "Paquete Hospedaje + Ecotermales en Arenal Fortuna",
    description:
      "1 noche en Downtown La Fortuna Boutique Hotel, en el centro de Arenal Fortuna + Entrada a Ecotermales + Desayuno + Bebida de bienvenida + Cocteles 2×1. Niños 0–4 sin costo.",
    breadcrumb: "Paquete Ecotermales",
    faqs: [
      {
        q: "¿Qué incluye el paquete Hospedaje + Ecotermales?",
        a: "Incluye: 1 noche de alojamiento, entrada a Ecotermales, desayuno, bebida de bienvenida, cocteles 2×1 de 12:00 a 5:00 p.m., parqueo privado gratuito, acceso a la piscina del hotel y WiFi.",
      },
      {
        q: "¿Cuánto cuesta el paquete Ecotermales?",
        a: "₡135.000 por pareja en ocupación doble. Tercera o cuarta persona: ₡50.000. Niños de 5 a 11 años: ₡27.500. Niños de 0 a 4 años: GRATIS.",
      },
      {
        q: "¿Hasta cuándo es válida la oferta?",
        a: "Válida del 1 de junio al 30 de agosto de 2026. Sujeta a disponibilidad.",
      },
    ],
  },
  en: {
    name: "Stay + Ecotermales Package in Arenal Fortuna",
    description:
      "1 night at Downtown La Fortuna Boutique Hotel, in the center of Arenal Fortuna + Ecotermales admission + Breakfast + Welcome drink + 2×1 cocktails. Children 0–4 stay free.",
    breadcrumb: "Ecotermales Package",
    faqs: [
      {
        q: "What does the Stay + Ecotermales package include?",
        a: "It includes: 1 night of accommodation, Ecotermales admission, breakfast, a welcome drink, 2×1 cocktails from 12:00 to 5:00 p.m., free private parking, access to the hotel pool, and WiFi.",
      },
      {
        q: "How much does the Ecotermales package cost?",
        a: "₡135,000 per couple based on double occupancy. Third or fourth adult: ₡50,000. Children ages 5 to 11: ₡27,500. Children ages 0 to 4: FREE.",
      },
      {
        q: "How long is the offer valid?",
        a: "Valid from June 1 to August 30, 2026. Subject to availability.",
      },
    ],
  },
} as const;

export const baldiJsonLd = (lang: Lang) =>
  packageGraph({
    lang,
    slug: "baldi",
    image: baldiImages.social,
    price: "60000",
    validFrom: "2026-07-01",
    validThrough: "2026-08-31",
    ...BALDI[lang],
    faqs: [...BALDI[lang].faqs],
  });

export const ecoJsonLd = (lang: Lang) =>
  packageGraph({
    lang,
    slug: "ecotermales",
    image: ecoImages.social,
    price: "135000",
    validFrom: "2026-06-01",
    validThrough: "2026-08-30",
    ...ECO[lang],
    faqs: [...ECO[lang].faqs],
  });
