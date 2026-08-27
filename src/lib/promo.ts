/**
 * Campaña promocional vigente (popup).
 *
 * Fuente única de verdad del precio y las fechas: aparecen en el popup y en el
 * mensaje de WhatsApp, y van a cambiar antes de publicar.
 *
 * Para retirar la promo antes de tiempo: `enabled: false` y republicar.
 * Para relanzarla con otro precio: cambiar `id` — la clave de localStorage se
 * versiona con él, así que quien ya lo haya cerrado lo vuelve a ver.
 */
export const PROMO = {
  enabled: true,

  id: "sep2026",

  /** Clave de localStorage. Versionada con `id` a propósito. */
  get key() {
    return `dlf.promo.v1.${this.id}`;
  },

  /**
   * Ventana de ANUNCIO (cuándo se muestra el popup), distinta de la ventana de
   * estadía. Setiembre se vende en agosto: el anuncio arranca ya para captar
   * reserva anticipada.
   *
   * Offsets -06:00 explícitos: `Date.now()` en el frontmatter corre con el
   * reloj de la máquina de build. Sin offset, un runner en UTC enciende y apaga
   * la promo seis horas antes de lo previsto.
   */
  start: "2026-08-26T00:00:00-06:00",
  end: "2026-09-30T23:59:59-06:00",

  /** Segundos antes de mostrar el popup. */
  delaySeconds: 12,

  /** Días que se recuerda el cierre antes de volver a mostrarlo. */
  dismissTtlDays: 14,

  // ─── PENDIENTE DE CONFIRMAR CON EL HOTEL ───────────────────────────────
  priceLabel: "₡60.000",
  priceUnit: { es: "por persona en ocupación doble", en: "per person, double occupancy" },
  // ───────────────────────────────────────────────────────────────────────

  whatsapp: "50685274677",
} as const;

export const PROMO_START_MS = new Date(PROMO.start).getTime();
export const PROMO_END_MS = new Date(PROMO.end).getTime();

/** Fecha de cierre legible, para la letra pequeña. */
export const PROMO_END_LABEL = {
  es: "30 de setiembre de 2026",
  en: "September 30, 2026",
} as const;

/**
 * Se evalúa en build (el sitio es estático), así que solo decide si el popup se
 * emite en el HTML. El apagado real cuando la promo vence lo hace el propio
 * componente en el navegador — es la única defensa si nadie reconstruye.
 */
export function promoIsActive(now: number = Date.now()): boolean {
  return PROMO.enabled && now >= PROMO_START_MS && now <= PROMO_END_MS;
}
