/* fim.js — quatro tempos, não sete. As frases curtas vêm juntas, o VOCÊ
   ganha a tela sozinho e a última linha fecha o arco.                  */

export default function fim(gsap, ScrollTrigger, mm) {
  const sec = document.querySelector('.fim');
  if (!sec) return;

  const pin = sec.querySelector('.fim__pin');
  const steps = [...sec.querySelectorAll('.fim__l')];
  const video = sec.querySelector('.fim__video');

  const build = (endPct, slot) => {
    gsap.set(steps, { opacity: 0, y: 18 });
    gsap.set(video, { opacity: .30, scale: 1.05 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sec, start: 'top top', end: `+=${endPct}%`,
        scrub: .7, pin, anticipatePin: 1, invalidateOnRefresh: true
      }
    });

    steps.forEach((s, i) => {
      const t = i * slot;
      tl.to(s, { opacity: 1, y: 0, duration: .34, ease: 'expo.out' }, t);
      if (i < steps.length - 1) tl.to(s, { opacity: 0, y: -12, duration: .28, ease: 'power1.in' }, t + slot - .28);
    });

    // a imagem respira: escurece no VOCÊ e volta na última frase
    tl.to(video, { opacity: .10, duration: .5, ease: 'none' }, 2 * slot - .3)
      .to(video, { opacity: .34, scale: 1, duration: .7, ease: 'none' }, 3 * slot - .3)
      .to({}, { duration: .5 });

    return () => { tl.scrollTrigger && tl.scrollTrigger.kill(); tl.kill(); };
  };

  mm.add('(min-width: 900px)', () => build(165, .95));
  mm.add('(max-width: 899px)', () => build(115, .75));
}
