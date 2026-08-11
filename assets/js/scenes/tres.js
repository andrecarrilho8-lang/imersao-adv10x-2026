/* tres.js — "Evolua 3 anos em 3 dias" aparece sendo digitada.
   A frase já está no HTML: sem JS, ela é só um título. Com JS, o texto
   é reconstruído caractere a caractere, com cursor piscando, e o cursor
   some quando a frase termina.                                          */

export default function tres(gsap, ScrollTrigger) {
  document.querySelectorAll('[data-type]').forEach(el => {
    if (el.dataset.typed) return;
    el.dataset.typed = '1';

    // cada <br> vira uma linha; tags internas não são suportadas de propósito
    const linhas = el.innerHTML.split(/<br\s*\/?>/i).map(t => t.replace(/<[^>]+>/g, '').trim());
    const total = linhas.reduce((n, l) => n + l.length, 0);
    if (!total) return;

    // trava a altura antes de esvaziar, senão a página pula enquanto digita
    el.style.minHeight = el.offsetHeight + 'px';

    const cur = document.createElement('span');
    cur.className = 'cur';
    cur.setAttribute('aria-hidden', 'true');

    const pinta = (n) => {
      let resto = n;
      const out = [];
      for (const l of linhas) {
        out.push(resto <= 0 ? '' : l.slice(0, resto));
        resto -= l.length;
      }
      while (out.length > 1 && out[out.length - 1] === '') out.pop();
      el.textContent = '';
      out.forEach((t, i) => {
        if (i) el.appendChild(document.createElement('br'));
        el.appendChild(document.createTextNode(t));
      });
      el.appendChild(cur);
    };

    pinta(0);
    const o = { n: 0 };
    gsap.to(o, {
      n: total,
      duration: Math.min(2.6, total * .06),
      ease: 'none',
      scrollTrigger: { trigger: el, start: 'top 76%', once: true },
      onUpdate: () => pinta(Math.round(o.n)),
      onComplete: () => {
        pinta(total);
        gsap.to(cur, { opacity: 0, duration: .4, delay: 1.2, onComplete: () => cur.remove() });
      }
    });
  });
}
