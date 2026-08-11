/* editorial.js — micro-motion dos blocos editoriais. Sem pin, sem 250vh:
   cada elemento entra quando chega à viewport e pronto.                  */

import { maskLines } from '../utils/reveal.js';

export default function editorial(gsap, ScrollTrigger) {

  /* "É A NONA." — escala discreta, quase imperceptível */
  document.querySelectorAll('[data-nona]').forEach(el => {
    gsap.set(el, { opacity: 0, scale: .96, transformOrigin: '0% 50%' });
    gsap.to(el, {
      opacity: 1, scale: 1, duration: 1.1, ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 82%', once: true }
    });
  });

  /* as palavras-chave entram uma depois da outra */
  document.querySelectorAll('.quatro').forEach(list => {
    const ws = list.querySelectorAll('[data-w]');
    gsap.set(ws, { opacity: 0, y: 14 });
    gsap.to(ws, {
      opacity: 1, y: 0, duration: .6, ease: 'power2.out', stagger: .11,
      scrollTrigger: { trigger: list, start: 'top 86%', once: true }
    });
  });

  /* frases-âncora com máscara de linha — as que não são títulos h1/h2 */
  document.querySelectorAll('.edit__anchor, .tese, .fecho, .kill__l').forEach(el => {
    if (el.dataset.done) return;
    el.dataset.done = '1';
    const m = maskLines(gsap, el);          // já deixa o elemento em estado inicial
    m.tween({ duration: 1, stagger: .075, scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
  });
}
