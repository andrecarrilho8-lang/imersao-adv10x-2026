import { prog } from '../utils/prog.js';
/* marcelo.js — sete estados: o título, quem é o Marcelo, a frase solta,
   o que ele fez com ela, o nascimento do negócio, o número e a conclusão.
   É uma sequência, e só faz sentido como sequência — então o celular
   mantém a mesma cena com pin do desktop, num percurso mais curto.   */

import { swap } from '../utils/seq.js';

export default function marcelo(gsap, ScrollTrigger, mm) {
  const sec = document.querySelector('.mg');
  if (!sec) return;
  const onProg = prog(sec, 7);

  const pin = sec.querySelector('.mg__pin');
  const steps = [...sec.querySelectorAll('.mg__l')];
  const vids = [...sec.querySelectorAll('.mg__v')];
  const money = sec.querySelector('[data-money]');

  /* percurso: quanto de rolagem cada unidade de tempo vale, em % de viewport */
  const cena = (percurso) => {
    const SLOT = .9;
    // o bloco do valor precisa de mais tela: tem legenda, número subindo e citação
    const PESO = [.85, .85, .85, .85, .85, 3.1, 1.15];
    const inicio = steps.map((_, i) => PESO.slice(0, i).reduce((a, b) => a + b, 0) * SLOT);
    const dura = i => (PESO[i] || 1) * SLOT;
    const fim = inicio[steps.length - 1] + dura(steps.length - 1);

    gsap.set(steps, { opacity: 0, y: 20 });
    gsap.set(vids[0], { opacity: 1 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sec, start: 'top top', end: '+=' + Math.round(fim * percurso) + '%',
        scrub: .7, pin, anticipatePin: 1, invalidateOnRefresh: true,
        onUpdate: onProg
      }
    });

    steps.forEach((s, i) => {
      const t = inicio[i];
      tl.to(s, { opacity: 1, y: 0, duration: .34, ease: 'expo.out' }, t);
      if (i < steps.length - 1) tl.to(s, { opacity: 0, y: -14, duration: .28, ease: 'power1.in' }, t + dura(i) - .28);
    });

    swap(gsap, tl, vids, [inicio[3]], .5);

    // o número começa a subir junto com o bloco, para não ficar um "R$ 0" parado
    if (money) {
      const o = { n: 0 };
      tl.to(o, {
        n: 550000, duration: dura(5) * .55, ease: 'power2.out',
        onUpdate: () => { money.textContent = Math.round(o.n).toLocaleString('pt-BR'); }
      }, inicio[5]);
    }

    tl.to({}, { duration: .5 });
    return () => { tl.scrollTrigger && tl.scrollTrigger.kill(); tl.kill(); };
  };

  mm.add('(min-width: 900px)', () => cena(31));
  mm.add('(max-width: 899px)', () => cena(23));
}
