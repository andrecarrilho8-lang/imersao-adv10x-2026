/* reveal.js — as duas revelações de base da página.
   Deliberadamente contidas: quem tem que chamar atenção são as cenas.
   O hero é excluído: ele tem coreografia própria, disparada no load.   */

import { splitLines } from './lines.js';

const outsideHero = el => !el.closest('.hero');

export function maskLines(gsap, el, opts = {}) {
  const lines = splitLines(el);
  const masked = !!(lines && lines.length);
  const targets = masked ? lines : [el];
  gsap.set(el, { opacity: 1 });                       // o elemento aparece; a máscara segura o conteúdo
  gsap.set(targets, masked ? { yPercent: 108 } : { opacity: 0, y: 20 });
  return { targets, masked, tween: (extra = {}) => gsap.to(targets, Object.assign({
    yPercent: masked ? 0 : 0, opacity: 1, y: 0,
    duration: masked ? 1.05 : .8, ease: 'expo.out', stagger: masked ? .085 : 0
  }, opts, extra)) };
}

export function initReveals(gsap, ScrollTrigger) {

  /* 1 · títulos: máscara linha a linha */
  [...document.querySelectorAll('[data-lines]')].filter(outsideHero).forEach(el => {
    const m = maskLines(gsap, el);
    m.tween({ scrollTrigger: { trigger: el, start: 'top 86%', once: true } });
  });

  /* 2 · blocos de leitura: subida curta, nunca mais que isso */
  const rises = [...document.querySelectorAll('[data-rise]')].filter(outsideHero);
  gsap.set(rises, { opacity: 0, y: 18 });
  ScrollTrigger.batch(rises, {
    start: 'top 90%',
    once: true,
    onEnter: batch => gsap.to(batch, {
      opacity: 1, y: 0, duration: .85, ease: 'power2.out', stagger: .07, overwrite: true
    })
  });

}
