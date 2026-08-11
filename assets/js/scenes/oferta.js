/* oferta.js — a última parte da página (bônus, investimento, escassez e
   ingressos) era uma sequência de blocos de leitura com o mesmo ritmo.
   Cada um ganha aqui um movimento próprio, todos no mesmo vocabulário:
   fio que desenha, número que sobe, luz que atravessa.                   */

export default function oferta(gsap, ScrollTrigger) {

  /* ── bônus: o fio dourado desenha e o valor sobe ── */
  document.querySelectorAll('[data-bon]').forEach((it, i) => {
    const fio = it.querySelector('.bon__rule');
    const val = it.querySelector('[data-val]');
    gsap.set(it, { opacity: 0, y: 18 });

    const tl = gsap.timeline({
      scrollTrigger: { trigger: it, start: 'top 84%', once: true },
      delay: i * .1
    });
    tl.to(it, { opacity: 1, y: 0, duration: .7, ease: 'power2.out' }, 0);
    if (fio) tl.fromTo(fio, { scaleX: 0 }, { scaleX: 1, duration: 1.15, ease: 'expo.out' }, 0);
    if (val) {
      const alvo = +val.dataset.val || 0;
      const o = { n: 0 };
      tl.to(o, {
        n: alvo, duration: .95, ease: 'power2.out',
        onUpdate: () => { val.textContent = Math.round(o.n).toLocaleString('pt-BR'); }
      }, .18);
    }
  });

  /* ── investimento: cada "mais um ano" entra pela esquerda e acende ── */
  const cost = document.querySelector('[data-cost]');
  if (cost) {
    const li = [...cost.children];
    gsap.set(li, { opacity: 0, x: -26 });
    li.forEach((el, i) => gsap.to(el, {
      opacity: 1, x: 0, duration: .85, ease: 'expo.out', delay: i * .2,
      scrollTrigger: { trigger: cost, start: 'top 82%', once: true },
      onStart: () => el.classList.add('is-on')
    }));
  }

  /* ── escassez: a régua do ano desenha e o pedaço aberto acende ── */
  const viz = document.querySelector('.esc__viz');
  if (viz) {
    const nums = [...viz.querySelectorAll('[data-val]')];
    const bar = viz.querySelector('[data-esc-bar]');
    const marca = bar && bar.querySelector('span');
    const tl = gsap.timeline({ scrollTrigger: { trigger: viz, start: 'top 80%', once: true } });

    nums.forEach(el => {
      const alvo = +el.dataset.val || 0;
      const o = { n: 0 };
      tl.to(o, {
        n: alvo, duration: 1.25, ease: 'power2.out',
        onUpdate: () => { el.textContent = Math.round(o.n).toLocaleString('pt-BR'); }
      }, 0);
    });
    if (bar) tl.fromTo(bar, { scaleX: 0, transformOrigin: '0% 50%' }, { scaleX: 1, duration: 1.1, ease: 'expo.out' }, .1);
    if (marca) tl.fromTo(marca, { scaleX: 0 }, { scaleX: 1, duration: .5, ease: 'power2.out' }, 1.05);
  }

  /* ── ingressos: os dois cartões entram de lados opostos ── */
  const cards = [...document.querySelectorAll('[data-card]')];
  cards.forEach((c, i) => {
    gsap.set(c, { opacity: 0, y: 28, x: i === 0 ? -16 : 16 });
    gsap.to(c, {
      opacity: 1, y: 0, x: 0, duration: .9, ease: 'expo.out', delay: i * .12,
      scrollTrigger: { trigger: c.parentElement || c, start: 'top 84%', once: true }
    });
  });

  /* o VIP tem uma luz que atravessa conforme a rolagem, não em loop */
  const vip = document.querySelector('.ing__card--vip');
  if (vip && !vip.querySelector('.brilho')) {
    const b = document.createElement('span');
    b.className = 'brilho';
    b.setAttribute('aria-hidden', 'true');
    vip.appendChild(b);
    gsap.fromTo(b, { xPercent: -130 }, {
      xPercent: 130, ease: 'none',
      scrollTrigger: { trigger: vip, start: 'top bottom', end: 'bottom top', scrub: 1 }
    });
  }
}
