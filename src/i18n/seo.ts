import type { Lang } from "./utils";

/**
 * Capa SEO centralizada.
 *
 * Estrategia de entidad: el destino se está reposicionando de "La Fortuna de
 * San Carlos" hacia la marca regional "Arenal Fortuna". Aquí asociamos el hotel
 * a las tres variantes del término (Arenal / Fortuna / Arenal Fortuna) en
 * metadatos, geo-tags y datos estructurados, para captar el tráfico que genere
 * esa campaña regional.
 */

export const SITE = "https://lafortunadowntown.com";

export const BRAND = "Downtown La Fortuna Boutique Hotel";

/** Coordenadas del hotel (25 m sur de la Iglesia Católica, La Fortuna). */
export const GEO = {
  lat: 10.4676,
  lng: -84.6431,
  region: "CR-A",
  placename: "Arenal Fortuna, La Fortuna, Alajuela, Costa Rica",
} as const;

/** Puntos de interés de la región usados como entidades vinculadas en JSON-LD. */
export const PLACES = {
  volcano: { name: "Volcán Arenal", nameEn: "Arenal Volcano", lat: 10.4633, lng: -84.7033 },
  lake: { name: "Lago Arenal", nameEn: "Lake Arenal", lat: 10.5167, lng: -84.85 },
  waterfall: { name: "Catarata Río Fortuna", nameEn: "La Fortuna Waterfall", lat: 10.4436, lng: -84.6733 },
} as const;

export const SOCIAL = [
  "https://www.instagram.com/lafortunadowntown",
  "https://www.facebook.com/LaFortunaDowntown",
];

export const CONTACT = {
  phone: "+50640002027",
  whatsapp: "+50685274677",
  email: "reservaciones@lafortunadowntown.com",
} as const;

/**
 * Espacios gastronómicos propios. Se publican como entidades `Restaurant`
 * enlazadas al hotel: son datos concretos y citables ("hotel con cinco
 * restaurantes propios, uno abierto hasta medianoche") que los asistentes
 * de IA necesitan para poder recomendarlo con precisión.
 */
export const VENUES = [
  { name: "María Bonita Steak House", es: "Brasas & Parrilla", en: "Grill & Steakhouse", hours: "Mo-Su 11:30-22:30", ig: "mariabonita.cr" },
  { name: "Selva Negra", es: "Coctelería & Vinos", en: "Cocktails & Wine", hours: "Mo-Su 12:00-24:00", ig: "selvanegra.bar" },
  { name: "Pinto e' Gallo", es: "Desayunos & Brunch", en: "Breakfast & Brunch", hours: "Mo-Su 07:00-11:30", ig: "pintoegallo.cr" },
  { name: "La Ventanita de María Bonita", es: "Parrilla Rápida", en: "Quick Grill", hours: "Mo-Su 12:00-24:00", ig: "ventanitamariabonita" },
  { name: "Nuwa Art Gallery", es: "Arte & Café", en: "Art & Coffee", hours: "Mo-Su 09:00-18:00", ig: "nuwagallery" },
] as const;

const DESCRIBES = {
  es: `${BRAND} es el hotel boutique más céntrico de Arenal Fortuna (La Fortuna de San Carlos), a minutos del Volcán Arenal, la Catarata Río Fortuna y las aguas termales de la región.`,
  en: `${BRAND} is the most centrally located boutique hotel in Arenal Fortuna (La Fortuna de San Carlos), minutes from Arenal Volcano, La Fortuna Waterfall, and the region's hot springs.`,
} as const;

const AREA_SERVED = {
  es: ["Arenal Fortuna", "Arenal", "Fortuna", "La Fortuna de San Carlos", "Volcán Arenal", "Alajuela", "Costa Rica"],
  en: ["Arenal Fortuna", "Arenal", "Fortuna", "La Fortuna de San Carlos", "Arenal Volcano", "Alajuela", "Costa Rica"],
} as const;

const KNOWS_ABOUT = {
  es: [
    "Arenal Fortuna",
    "Volcán Arenal",
    "aguas termales de Arenal",
    "Catarata Río Fortuna",
    "Lago Arenal",
    "turismo sostenible en Costa Rica",
    "tours y aventura en Arenal Fortuna",
  ],
  en: [
    "Arenal Fortuna",
    "Arenal Volcano",
    "Arenal hot springs",
    "La Fortuna Waterfall",
    "Lake Arenal",
    "sustainable tourism in Costa Rica",
    "tours and adventure in Arenal Fortuna",
  ],
} as const;

/**
 * Grafo JSON-LD global. Se inyecta en todas las páginas y ancla el hotel a la
 * entidad regional "Arenal Fortuna" mediante alternateName, containedInPlace,
 * areaServed y knowsAbout.
 */
export function siteGraph(lang: Lang, canonical: string, title: string, description: string) {
  const es = lang === "es";
  const p = (k: keyof typeof PLACES) => (es ? PLACES[k].name : PLACES[k].nameEn);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Hotel", "LodgingBusiness"],
        "@id": `${SITE}/#hotel`,
        name: BRAND,
        alternateName: [
          "La Fortuna Downtown",
          "Downtown Arenal Fortuna",
          "Hotel Downtown Arenal Fortuna",
        ],
        description: DESCRIBES[lang],
        url: SITE,
        telephone: CONTACT.phone,
        email: CONTACT.email,
        priceRange: "$$",
        currenciesAccepted: "CRC, USD",
        availableLanguage: [
          { "@type": "Language", name: "Spanish", alternateName: "es" },
          { "@type": "Language", name: "English", alternateName: "en" },
        ],
        contactPoint: [
          {
            "@type": "ContactPoint",
            contactType: es ? "Reservaciones" : "Reservations",
            telephone: CONTACT.phone,
            email: CONTACT.email,
            availableLanguage: ["es", "en"],
          },
          {
            "@type": "ContactPoint",
            contactType: "WhatsApp",
            telephone: CONTACT.whatsapp,
            url: `https://wa.me/${CONTACT.whatsapp.replace("+", "")}`,
            availableLanguage: ["es", "en"],
          },
        ],
        starRating: { "@type": "Rating", ratingValue: "3" },
        image: `${SITE}/og-image.jpg`,
        logo: `${SITE}/favicon.svg`,
        sameAs: SOCIAL,
        address: {
          "@type": "PostalAddress",
          streetAddress: es
            ? "25 metros al sur de la Iglesia Católica"
            : "25 meters south of the Catholic Church",
          addressLocality: "La Fortuna de San Carlos",
          addressRegion: "Alajuela",
          postalCode: "21007",
          addressCountry: "CR",
        },
        geo: { "@type": "GeoCoordinates", latitude: GEO.lat, longitude: GEO.lng },
        hasMap: `https://www.google.com/maps/search/?api=1&query=${GEO.lat},${GEO.lng}`,
        areaServed: AREA_SERVED[lang].map((n) => ({ "@type": "Place", name: n })),
        knowsAbout: KNOWS_ABOUT[lang],
        containedInPlace: { "@id": `${SITE}/#arenal-fortuna` },
        // Promedio de las 4 plataformas mostradas en el sitio, normalizado a /5:
        // Google 4.3/5 · TripAdvisor 4.4/5 · Booking 8.1/10 · Expedia 8.8/10.
        // NOTA: falta `ratingCount` real para ser elegible a rich results.
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.3",
          bestRating: "5",
          worstRating: "1",
        },
        // Desglose por plataforma — lo consumen los motores de respuesta con IA.
        additionalProperty: [
          { name: "Google", value: "4.3/5" },
          { name: "TripAdvisor", value: "4.4/5" },
          { name: "Booking.com", value: "8.1/10" },
          { name: "Expedia", value: "8.8/10" },
        ].map((r) => ({
          "@type": "PropertyValue",
          name: `${es ? "Calificación" : "Rating"} ${r.name}`,
          value: r.value,
        })),
        amenityFeature: [
          es ? "Parqueo privado gratuito 24/7" : "Free private parking 24/7",
          es ? "Estación de carga para vehículos eléctricos" : "EV charging station",
          es ? "WiFi de alta velocidad" : "High-speed WiFi",
          es ? "Piscina tropical" : "Tropical pool",
          es ? "Desayuno buffet (7:00–11:30)" : "Buffet breakfast (7:00–11:30)",
          es ? "Cinco espacios gastronómicos propios" : "Five in-house dining venues",
          es ? "Aire acondicionado" : "Air conditioning",
          es ? "Traslados desde aeropuertos SJO y LIR" : "Transfers from SJO and LIR airports",
          es ? "Recepción y asistencia 24/7" : "24/7 front desk and assistance",
        ].map((n) => ({ "@type": "LocationFeatureSpecification", name: n, value: true })),
        hasPart: VENUES.map((v) => ({ "@id": `${SITE}/#${v.ig}` })),
      },

      // Espacios gastronómicos como entidades citables.
      ...VENUES.map((v) => ({
        "@type": "Restaurant",
        "@id": `${SITE}/#${v.ig}`,
        name: v.name,
        servesCuisine: es ? v.es : v.en,
        openingHours: v.hours,
        sameAs: [`https://www.instagram.com/${v.ig}`],
        isPartOf: { "@id": `${SITE}/#hotel` },
        address: {
          "@type": "PostalAddress",
          addressLocality: "La Fortuna de San Carlos",
          addressRegion: "Alajuela",
          addressCountry: "CR",
        },
        containedInPlace: { "@id": `${SITE}/#arenal-fortuna` },
      })),

      // Entidad regional: "Arenal Fortuna" como lugar, con sus tres variantes.
      {
        "@type": ["Place", "TouristDestination"],
        "@id": `${SITE}/#arenal-fortuna`,
        name: "Arenal Fortuna",
        alternateName: ["Arenal", "Fortuna", "La Fortuna de San Carlos", "Arenal · Fortuna"],
        description: es
          ? "Arenal Fortuna es el destino turístico del norte de Costa Rica que integra La Fortuna de San Carlos, el Volcán Arenal, el Lago Arenal y las aguas termales de la zona."
          : "Arenal Fortuna is the tourism destination in northern Costa Rica that brings together La Fortuna de San Carlos, Arenal Volcano, Lake Arenal, and the area's hot springs.",
        geo: { "@type": "GeoCoordinates", latitude: GEO.lat, longitude: GEO.lng },
        containsPlace: [
          { "@id": `${SITE}/#volcan-arenal` },
          { "@id": `${SITE}/#catarata-fortuna` },
          { "@id": `${SITE}/#lago-arenal` },
        ],
        includesAttraction: [
          { "@id": `${SITE}/#volcan-arenal` },
          { "@id": `${SITE}/#catarata-fortuna` },
        ],
      },

      {
        "@type": ["Volcano", "TouristAttraction"],
        "@id": `${SITE}/#volcan-arenal`,
        name: p("volcano"),
        alternateName: ["Arenal", "Arenal Fortuna"],
        geo: {
          "@type": "GeoCoordinates",
          latitude: PLACES.volcano.lat,
          longitude: PLACES.volcano.lng,
        },
        containedInPlace: { "@id": `${SITE}/#arenal-fortuna` },
      },
      {
        "@type": ["Waterfall", "TouristAttraction"],
        "@id": `${SITE}/#catarata-fortuna`,
        name: p("waterfall"),
        geo: {
          "@type": "GeoCoordinates",
          latitude: PLACES.waterfall.lat,
          longitude: PLACES.waterfall.lng,
        },
        containedInPlace: { "@id": `${SITE}/#arenal-fortuna` },
      },
      {
        "@type": ["LakeBodyOfWater", "TouristAttraction"],
        "@id": `${SITE}/#lago-arenal`,
        name: p("lake"),
        geo: { "@type": "GeoCoordinates", latitude: PLACES.lake.lat, longitude: PLACES.lake.lng },
        containedInPlace: { "@id": `${SITE}/#arenal-fortuna` },
      },

      {
        "@type": "WebSite",
        "@id": `${SITE}/#website`,
        url: SITE,
        name: BRAND,
        alternateName: ["La Fortuna Downtown", "Downtown Arenal Fortuna"],
        inLanguage: es ? "es-CR" : "en-US",
        publisher: { "@id": `${SITE}/#hotel` },
        about: { "@id": `${SITE}/#arenal-fortuna` },
      },

      {
        "@type": "WebPage",
        "@id": `${canonical}#webpage`,
        url: canonical,
        name: title,
        description,
        inLanguage: es ? "es-CR" : "en-US",
        isPartOf: { "@id": `${SITE}/#website` },
        about: { "@id": `${SITE}/#arenal-fortuna` },
        mentions: [
          { "@id": `${SITE}/#arenal-fortuna` },
          { "@id": `${SITE}/#volcan-arenal` },
        ],
        primaryImageOfPage: `${SITE}/og-image.jpg`,
      },
    ],
  };
}
