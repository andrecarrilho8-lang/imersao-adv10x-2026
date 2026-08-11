import { prog } from '../utils/prog.js';
/* mesa.js — as cinco falas chegam rápido, se acumulam, somem juntas,
   e a frase que importa ocupa o lugar delas. Pin curto de propósito. */

export default function mesa(gsap, ScrollTrigger, mm) {
  const sec = document.querySelector('.mesa');
  if (!sec) return;
  const onProg = prog(sec, 6);

  const pin = sec.querySelector('.mesa__pin');
  const qs = [...sec.querySelectorAll('[data-q]')];
  const final = sec.querySelector('.mesa__final');
  const video = sec.querySelector('.mesa__video');

  const build = (endPct) => {
    gsap.set(qs, { opacity: 0, y: 14, filter: 'blur(3px)' });
    gsap.set(final, { opacity: 0, y: 22 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sec, start: 'top top', end: `+=${endPct}%`,
        scrub: .6, pin, anticipatePin: 1, invalidateOnRefresh: true,
        onUpdate: onProg
      }
    });

    qs.forEach((q, i) => {
      tl.to(q, { opacity: 1, y: 0, filter: 'blur(0px)', duration: .34, ease: 'power2.out' }, i * .34);
    });
    const t = qs.length * .34 + .35;
    tl.to(qs, { opacity: 0, y: -12, filter: 'blur(5px)', duration: .45, ease: 'power1.in', stagger: .04 }, t)
      .to(video, { opacity: .68, duration: .8, ease: 'none' }, t)
      .to(final, { opacity: 1, y: 0, duration: .8, ease: 'expo.out' }, t + .35)
      .to({}, { duration: .5 });

    return () => { tl.scrollTrigger && tl.scrollTrigger.kill(); tl.kill(); };
  };

  mm.add('(min-width: 900px)', () => build(150));
  mm.add('(max-width: 899px)', () => build(110));
}
