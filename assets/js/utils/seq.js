/* seq.js — o padrão que se repete nas cenas: uma pilha de estados que se
   substituem com passagem limpa (nunca dois textos grandes a meio caminho),
   com a mídia trocando junto. Devolve a timeline para quem chamou compor.   */

export function stack(gsap, tl, steps, opts = {}) {
  const slot = opts.slot || 1;
  const start = opts.start || 0;
  const inD = opts.in || .45;
  const outD = opts.out || .35;
  const y = opts.y == null ? 22 : opts.y;
  const holdLast = opts.holdLast !== false;

  gsap.set(steps, { opacity: 0, y });

  steps.forEach((s, i) => {
    const t = start + i * slot;
    tl.to(s, { opacity: 1, y: 0, duration: inD, ease: 'expo.out' }, t);
    if (i < steps.length - 1 || !holdLast) {
      tl.to(s, { opacity: 0, y: -y * .7, duration: outD, ease: 'power1.in' }, t + slot - outD);
    }
  });

  return start + steps.length * slot;
}

/** troca de mídia por classe .is-on, sincronizada com os estados */
export function swap(gsap, tl, frames, at, dur = .5) {
  frames.forEach((f, i) => {
    if (i === 0) { gsap.set(f, { opacity: 1 }); return; }
    gsap.set(f, { opacity: 0 });
    tl.to(frames[i - 1], { opacity: 0, duration: dur, ease: 'none' }, at[i - 1])
      .to(f, { opacity: 1, duration: dur, ease: 'none' }, at[i - 1]);
  });
}
