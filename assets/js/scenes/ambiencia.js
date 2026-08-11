import { prog } from '../utils/prog.js';
/* ambiencia.js — o centro conceitual da página.
   A palavra fica. A definição se corrige três vezes. O ambiente aparece
   por trás dela e, quando a frase chega, o vídeo já é o assunto.        */

export default function ambiencia(gsap, ScrollTrigger, mm) {
  const sec = document.querySelector('.amb');
  if (!sec) return;
  const onProg = prog(sec, 3);

  const pin = sec.querySelector('.amb__pin');
  const word = sec.querySelector('.amb__word');
  const defs = [...sec.querySelectorAll('[data-def]')];
  const video = sec.querySelector('.amb__video');
  const scrim = sec.querySelector('.amb__scrim');
  const payoff = sec.querySelector('.amb__payoff');

  const build = (endPct, endScale, lift) => {
    gsap.set(defs, { opacity: 0, y: 14 });
    gsap.set(defs[0], { opacity: 1, y: 0 });
    gsap.set(video, { opacity: 0, scale: 1.14 });
    gsap.set(scrim, { opacity: 0 });
    gsap.set(payoff, { opacity: 0, y: 22 });
    gsap.set(word, { scale: 1, y: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sec, start: 'top top', end: `+=${endPct}%`,
        scrub: .75, pin, anticipatePin: 1, invalidateOnRefresh: true,
        onUpdate: onProg
      }
    });

    // 1 · as três negativas
    tl.to(defs[0], { opacity: 0, y: -12, duration: .4 }, .9)
      .to(defs[1], { opacity: 1, y: 0, duration: .4 }, 1.1)
      .to(defs[1], { opacity: 0, y: -12, duration: .4 }, 2.0)
      .to(defs[2], { opacity: 1, y: 0, duration: .4 }, 2.2)
      .to(defs[2], { opacity: 0, y: -12, duration: .4 }, 3.1);

    // 2 · o ambiente entra por trás
    tl.to(video, { opacity: .95, scale: 1, duration: 2.4, ease: 'power1.out' }, 2.6)
      .to(scrim, { opacity: 1, duration: 1.6 }, 2.8);

    // 3 · a palavra cede o lugar
    tl.to(word, { scale: endScale, y: lift, duration: 1.8, ease: 'power2.inOut' }, 3.4)
      .to(payoff, { opacity: 1, y: 0, duration: 1.2, ease: 'expo.out' }, 4.2)
      .to({}, { duration: 1 });

    return () => { tl.scrollTrigger && tl.scrollTrigger.kill(); tl.kill(); };
  };

  mm.add('(min-width: 900px)', () => build(340, .46, '-16vh'));
  mm.add('(max-width: 899px)', () => build(220, .60, '-8vh'));
}
