/* hero.js — abertura. A headline é montada com o primeiro nome dentro dela,
   em dourado, como parte da frase — não como um cumprimento colado antes.
   Se não houver nome, a frase existe inteira sozinha.                      */

import { NAME_KEY } from '../utils/env.js';

function compose(h1) {
  const nome = (sessionStorage.getItem(NAME_KEY) || '').trim();
  const tpl = nome ? h1.dataset.com : h1.dataset.sem;
  const txt = nome ? tpl.replace('{NOME}', nome) : tpl;
  const parts = txt.split(' ');
  h1.innerHTML = parts.map((w, i) => {
    const gold = nome && i === 0;
    return `<span class="hw"><span class="hw__i${gold ? ' g' : ''}">${w}</span></span>`;
  }).join(' ');
  return [...h1.querySelectorAll('.hw__i')];
}

export default function hero(gsap, ScrollTrigger, mm) {
  const root = document.querySelector('.hero');
  if (!root) return;

  const logo = root.querySelector('.logo');
  const ed = root.querySelector('.hero__ed');
  const eyebrow = root.querySelector('.eyebrow');
  const h1 = root.querySelector('[data-hero-h]');
  const foot = root.querySelector('.hero__foot');
  const cue = root.querySelector('.hero__cue');
  const video = root.querySelector('.hero__video');
  if (!video || !h1) return;

  const play = (delay) => {
    const words = compose(h1);
    gsap.set(h1, { opacity: 1 });
    gsap.set(words, { yPercent: 110 });
    return gsap.to(words, {
      yPercent: 0, duration: .95, ease: 'expo.out', stagger: .028, delay
    });
  };

  gsap.set([logo, ed, eyebrow, foot, cue], { opacity: 0, y: 14 });
  gsap.set(video, { scale: 1.06 });

  gsap.timeline({ delay: .12, defaults: { ease: 'power2.out' } })
    .to([logo, ed], { opacity: 1, y: 0, duration: .8, stagger: .07 })
    .to(eyebrow, { opacity: 1, y: 0, duration: .8 }, '-=.5')
    .add(play(0), '-=.4')
    .to(foot, { opacity: 1, y: 0, duration: .9 }, '-=.55')
    .to(cue, { opacity: 1, y: 0, duration: .7 }, '-=.5')
    .to(video, { scale: 1, duration: 2.4, ease: 'power1.out' }, 0);

  /* quando a porta devolve o nome, a headline se refaz com ele dentro */
  window.__heroName = () => play(.1);

  /* saída: só profundidade. O vídeo continua vivo até o último pixel. */
  mm.add('(min-width: 620px)', () => {
    const st = gsap.timeline({
      scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: .6 }
    }).to(video, { yPercent: 9, scale: 1.05, ease: 'none' }, 0);
    return () => st.kill();
  });
}
