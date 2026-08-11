import { prog } from '../utils/prog.js';
/* palestra.js — três frases rápidas e o bastidor entra e fica.
   As palavras CAFÉ / CORREDOR / ALMOÇO… só aparecem sobre imagem viva. */

import { swap } from '../utils/seq.js';

export default function palestra(gsap, ScrollTrigger, mm) {
  const sec = document.querySelector('.pal');
  if (!sec) return;
  const onProg = prog(sec, 4);

  const pin = sec.querySelector('.pal__pin');
  const steps = [...sec.querySelectorAll('.pal__l')];
  const vids = [...sec.querySelectorAll('.pal__v')];
  const scrim = sec.querySelector('.pal__scrim');
  const tags = [...sec.querySelectorAll('.pal__tags li')];

  const build = (endPct, slot) => {
    gsap.set(steps, { opacity: 0, y: 20 });
    gsap.set(tags, { opacity: 0, y: 10 });
    gsap.set(scrim, { opacity: 1 });
    gsap.set(vids[0], { opacity: 1 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sec, start: 'top top', end: `+=${endPct}%`,
        scrub: .65, pin, anticipatePin: 1, invalidateOnRefresh: true,
        onUpdate: onProg
      }
    });

    steps.forEach((s, i) => {
      const t = i * slot;
      tl.to(s, { opacity: 1, y: 0, duration: .34, ease: 'expo.out' }, t);
      if (i < steps.length - 1) tl.to(s, { opacity: 0, y: -14, duration: .28, ease: 'power1.in' }, t + slot - .28);
    });

    const t4 = (steps.length - 1) * slot;
    // o bastidor sobe junto com a virada, não depois dela
    tl.to(scrim, { opacity: .62, duration: .8, ease: 'none' }, t4 - .3)
      .to(tags, { opacity: 1, y: 0, duration: .3, stagger: .12, ease: 'power2.out' }, t4 + .35);

    // e a imagem continua mudando enquanto as palavras aparecem
    swap(gsap, tl, vids, [t4 + .5, t4 + 1.15], .45);
    tl.to({}, { duration: .6 });

    return () => { tl.scrollTrigger && tl.scrollTrigger.kill(); tl.kill(); };
  };

  mm.add('(min-width: 900px)', () => build(175, .8));
  mm.add('(max-width: 899px)', () => build(125, .62));
}
