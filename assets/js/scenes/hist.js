import { prog } from '../utils/prog.js';
/* hist.js — prova histórica. Cinco estados, quatro trocas de mídia e os nomes
   atravessando. No celular vira fluxo vertical: sem pin, sem espera.        */

import { stack, swap } from '../utils/seq.js';

export default function hist(gsap, ScrollTrigger, mm) {
  const sec = document.querySelector('.hist');
  if (!sec) return;
  const onProg = prog(sec, 5);

  const pin = sec.querySelector('.hist__pin');
  const steps = [...sec.querySelectorAll('.hist__st')];
  const frames = [...sec.querySelectorAll('.hist__f')];
  const names = sec.querySelector('.hist__names');
  const counters = [...sec.querySelectorAll('[data-count]')];

  const count = (trigger) => counters.map(el => {
    const alvo = +el.dataset.count || 0;
    const mais = el.hasAttribute('data-plus') ? '+' : '';
    const o = { n: 0 };
    return gsap.to(o, {
      n: alvo, duration: 1.4, ease: 'power2.out',
      scrollTrigger: { trigger, start: 'top 70%', once: true },
      onUpdate: () => { el.textContent = mais + Math.round(o.n).toLocaleString('pt-BR'); }
    });
  });

  /* ---------- desktop: pin curto, cinco acontecimentos ---------- */
  mm.add('(min-width: 900px)', () => {
    const SLOT = 1;
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sec, start: 'top top', end: '+=190%',
        scrub: .7, pin, anticipatePin: 1, invalidateOnRefresh: true,
        onUpdate: onProg
      }
    });

    stack(gsap, tl, steps, { slot: SLOT, start: .15 });
    swap(gsap, tl, frames, [1.0, 2.0, 3.0], .5);

    // os nomes só existem no estado 3, e atravessam durante ele
    const drift = () => Math.max(0, names.scrollWidth - pin.clientWidth + 60);
    gsap.set(names, { opacity: 0, x: 0 });
    tl.to(names, { opacity: 1, duration: .35 }, 2.05)
      .fromTo(names, { x: 0 }, { x: () => -drift(), ease: 'none', duration: 1.05 }, 2.1)
      .to(names, { opacity: 0, duration: .3 }, 3.05);

    const cs = count(sec);
    return () => { tl.scrollTrigger && tl.scrollTrigger.kill(); tl.kill(); cs.forEach(c => c.scrollTrigger && c.scrollTrigger.kill()); };
  });

  /* ---------- mobile: fluxo vertical, mídia colada atrás ---------- */
  mm.add('(max-width: 899px)', () => {
    /* no desktop os nomes atravessam a tela por cima do vídeo. No celular não há
       travessia: eles precisam aparecer logo abaixo do rótulo que os anuncia,
       e não soltos no fim da seção — que era onde o HTML os deixava. */
    const rotulo = sec.querySelector('.hist__lbl');
    const casaAntiga = names && names.parentNode;
    const vizinhoAntigo = names && names.nextSibling;
    if (rotulo && names) rotulo.parentNode.appendChild(names);
    const nomes = names ? [...names.children] : [];

    gsap.set(steps, { opacity: 0, y: 20 });
    const ts = steps.map((s, i) => gsap.to(s, {
      opacity: 1, y: 0, duration: .7, ease: 'power2.out',
      scrollTrigger: { trigger: s, start: 'top 88%', once: true }
    }));
    // declarada antes: o ScrollTrigger dispara onEnter já na criação
    const setFrame = i => {
      const k = Math.min(i, frames.length - 1);
      frames.forEach((f, j) => f.classList.toggle('is-on', j === k));
    };
    // a mídia acompanha o estado que está na tela
    const sts = steps.map((s, i) => ScrollTrigger.create({
      trigger: s, start: 'top 70%', end: 'bottom 30%',
      onEnter: () => setFrame(i), onEnterBack: () => setFrame(i)
    }));
    // os nomes entram um a um, junto com o estado a que pertencem
    let tn = null;
    if (nomes.length) {
      gsap.set(nomes, { opacity: 0, y: 12 });
      tn = gsap.to(nomes, {
        opacity: 1, y: 0, duration: .5, ease: 'power2.out', stagger: .06,
        scrollTrigger: { trigger: names, start: 'top 88%', once: true }
      });
    }

    const cs = count(sec);
    return () => {
      ts.forEach(t => t.kill()); sts.forEach(t => t.kill());
      cs.forEach(c => c.scrollTrigger && c.scrollTrigger.kill());
      tn && tn.scrollTrigger && tn.scrollTrigger.kill();
      // devolve os nomes para o lugar original, senão o desktop remonta errado
      if (names && casaAntiga) casaAntiga.insertBefore(names, vizinhoAntigo);
    };
  });
}
