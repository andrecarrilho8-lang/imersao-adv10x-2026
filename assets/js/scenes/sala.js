import { prog } from '../utils/prog.js';
/* sala.js — o plano cresce até virar a sala. Enquanto cresce, quatro
   constatações entram e saem; no fim o título dá lugar à conclusão.  */

export default function sala(gsap, ScrollTrigger, mm) {
  const sec = document.querySelector('.sala');
  if (!sec) return;
  const onProg = prog(sec, 4);

  const pin = sec.querySelector('.sala__pin');
  const box = sec.querySelector('.sala__box');
  const title = sec.querySelector('.sala__title');
  const scrim = sec.querySelector('.sala__scrim');
  const notes = [...sec.querySelectorAll('[data-sn]')];
  const end = sec.querySelector('.sala__end');

  const cover = () => {
    const r = box.getBoundingClientRect();
    if (!r.width || !r.height) return 3;
    return Math.max(window.innerWidth / r.width, window.innerHeight / r.height) * 1.02;
  };

  const build = (endPct, slot) => {
    gsap.set(box, { scale: 1, transformOrigin: '50% 50%' });
    gsap.set(scrim, { opacity: 0 });
    gsap.set(notes, { opacity: 0, y: 16 });
    gsap.set(end, { opacity: 0, y: 20 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sec, start: 'top top', end: `+=${endPct}%`,
        scrub: .7, pin, anticipatePin: 1, invalidateOnRefresh: true,
        onUpdate: onProg
      }
    });

    const grow = slot * notes.length + .6;
    tl.to(box, { scale: () => cover(), ease: 'power1.inOut', duration: grow }, 0)
      .to(scrim, { opacity: 1, ease: 'none', duration: grow }, 0)
      .fromTo(title, { scale: .95, opacity: 0 }, { scale: 1, opacity: 1, duration: .5, ease: 'expo.out' }, .1);

    notes.forEach((n, i) => {
      const t = .6 + i * slot;
      tl.to(n, { opacity: 1, y: 0, duration: .3, ease: 'power2.out' }, t)
        .to(n, { opacity: 0, y: -12, duration: .25, ease: 'power1.in' }, t + slot - .25);
    });

    tl.to(title, { opacity: 0, y: -24, duration: .4, ease: 'power2.in' }, grow - .2)
      .to(end, { opacity: 1, y: 0, duration: .6, ease: 'expo.out' }, grow + .1)
      .to({}, { duration: .5 });

    return () => { tl.scrollTrigger && tl.scrollTrigger.kill(); tl.kill(); gsap.set(box, { clearProps: 'transform' }); };
  };

  mm.add('(min-width: 900px)', () => build(190, .55));
  mm.add('(max-width: 899px)', () => build(130, .45));
}
