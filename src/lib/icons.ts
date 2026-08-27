/**
 * Iconos SVG en línea.
 *
 * Los archivos vienen exportados de Illustrator y todos comparten la misma
 * estructura: `id="Layer_1"`, `id="clippath"` y clases `.cls-1/2/3` definidas en
 * un `<style>` interno. Insertarlos crudos en la misma página daría ids
 * duplicados (HTML inválido, y `clip-path: url(#clippath)` resolvería siempre al
 * primero) y las reglas `.cls-N` se pisarían entre archivos — carga-electrica.svg
 * define `.cls-2` con un rojo distinto al del resto.
 *
 * Por eso se saneen en build: se elimina `<defs>` (que solo contiene el estilo y
 * un clip a los límites del lienzo, decorativo), se quitan ids y clases, y el
 * color pasa a heredarse. El contenedor pinta con `currentColor`, así que el
 * icono adopta el color del tema en lugar de llevar el rojo incrustado.
 */
const files = import.meta.glob("/src/assets/icons/*.svg", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

/** viewBox común de este set. */
export const ICON_VIEWBOX = "0 0 200 200";

function sanitize(raw: string): string {
  const inner = raw
    // Nos quedamos solo con el contenido del <svg>.
    .replace(/^[\s\S]*?<svg[^>]*>/i, "")
    .replace(/<\/svg>\s*$/i, "")
    // <defs> lleva el <style> y el clipPath: fuera.
    .replace(/<defs>[\s\S]*?<\/defs>/gi, "")
    // Ids y clases: fuente de colisiones entre iconos.
    .replace(/\s(?:id|class)="[^"]*"/gi, "")
    // Grupos que quedan vacíos tras quitar el clip.
    .replace(/<g\s*>\s*<\/g>/gi, "")
    .trim();

  if (!inner) throw new Error("icons: SVG vacío tras sanear");
  return inner;
}

export function icon(name: string): string {
  const raw = files[`/src/assets/icons/${name}.svg`];
  // Un icono ausente debe romper el build, no publicarse como hueco.
  if (!raw) {
    const disponibles = Object.keys(files)
      .map((k) => k.split("/").pop()!.replace(".svg", ""))
      .join(", ");
    throw new Error(`icons: no existe "${name}.svg". Disponibles: ${disponibles}`);
  }
  return sanitize(raw);
}
