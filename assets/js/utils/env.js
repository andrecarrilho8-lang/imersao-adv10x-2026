/* env.js — capacidades do ambiente */

/** onde o primeiro nome fica guardado (uma declaração só, para o build inline) */
export const NAME_KEY = 'adv10x:nome';

export const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const MQ = {
  desk: '(min-width: 900px)',
  tab: '(min-width: 620px) and (max-width: 899px)',
  mob: '(max-width: 619px)',
  upTab: '(max-width: 899px)'
};

/** Espera o GSAP dos <script defer> aparecer. Resolve null se não vier. */
export function waitForGsap(timeout = 4000) {
  return new Promise((resolve) => {
    const t0 = performance.now();
    (function tick() {
      if (window.gsap && window.ScrollTrigger) return resolve(window.gsap);
      if (performance.now() - t0 > timeout) return resolve(null);
      requestAnimationFrame(tick);
    })();
  });
}

/** rAF-throttled resize com largura estável (ignora barra de endereço em iOS) */
export function onWidthChange(cb) {
  let w = window.innerWidth;
  let raf = 0;
  window.addEventListener('resize', () => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      if (Math.abs(window.innerWidth - w) > 40) { w = window.innerWidth; cb(); }
    });
  }, { passive: true });
}
