import { SITE } from "../i18n/seo";
import type { Lang } from "../i18n/utils";

/**
 * Datos estructurados de las landings de paquetes.
 *
 * Antes solo /baldi (ES) llevaba Product + FAQPage, escrito a mano dentro de un
 * <Fragment slot="head"> como literal JSON. Las otras tres landings no tenían
 * nada. Aquí se genera para las cuatro desde una sola fuente, y se inyecta con
 * la prop `jsonLd` del Layout — el mismo patrón que ya usa /arenal-fortuna.
 */

interface Faq {
  q: string;
  a: string;
}

interface PackageInput {
  lang: Lang;
  /** Ruta sin barra inicial: "baldi" | "ecotermales". */
  slug: string;
  name: string;
  description: string;
  image: string;
  /** Precio numérico sin separadores, en colones. */
  price: string;
  validFrom: string;
  validThrough: string;
  faqs: Faq[];
  /** Título legible del paquete para el breadcrumb. */
  breadcrumb: string;
}

export function packageGraph({
  lang,
  slug,
  name,
  description,
  image,
  price,
  validFrom,
  validThrough,
  faqs,
  breadcrumb,
}: PackageInput) {
  const base = lang === "en" ? `${SITE}/en` : SITE;
  // Con barra final, para que coincida exactamente con el canonical que emite
  // el Layout (el build usa `format: "directory"`).
  const url = `${base}/${slug}/`;
  const es = lang === "es";

  return [
    {
      "@type": "Product",
      "@id": `${url}#paquete`,
      name,
      description,
      image,
      url,
      brand: { "@id": `${SITE}/#hotel` },
      areaServed: { "@id": `${SITE}/#arenal-fortuna` },
      offers: {
        "@type": "Offer",
        url,
        price,
        priceCurrency: "CRC",
        priceValidUntil: validThrough,
        availability: "https://schema.org/InStock",
        validFrom,
        validThrough,
        seller: { "@id": `${SITE}/#hotel` },
      },
    },
    {
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: es ? "Inicio" : "Home",
          item: `${base}/`,
        },
        { "@type": "ListItem", position: 2, name: breadcrumb, item: url },
      ],
    },
  ];
}
