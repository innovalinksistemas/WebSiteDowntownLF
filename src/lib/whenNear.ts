/**
 * Ejecuta `cb` una sola vez cuando `selector` se acerca al viewport (o, como
 * respaldo, poco después de `load`). Sirve para diferir librerías de animación
 * (GSAP + ScrollTrigger, ~110 KB) fuera de la cadena crítica del primer render:
 * el hero ya no las necesita, y las secciones de más abajo las cargan justo
 * antes de entrar en pantalla.
 */
export function whenNear(selector: string, cb: () => void, margin = "900px"): void {
  let done = false;
  const run = () => {
    if (done) return;
    done = true;
    cb();
  };

  const el = document.querySelector(selector);
  if (!el || typeof IntersectionObserver === "undefined") {
    run();
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        io.disconnect();
        run();
      }
    },
    { rootMargin: `${margin} 0px` },
  );
  io.observe(el);

  // Respaldo: tras la carga y un pequeño respiro, inicializar de todas formas
  // para que ninguna interacción dependa de que el usuario haga scroll.
  const idle = () => window.setTimeout(run, 2500);
  if (document.readyState === "complete") idle();
  else window.addEventListener("load", idle, { once: true });
}
