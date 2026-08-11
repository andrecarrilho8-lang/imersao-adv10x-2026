/* progresso.js — a barrinha no celular.
   No desktop cada cena com pin move o próprio indicador pela timeline.
   No celular duas cenas perdem o pin (histórico e ambiência) e a barra
   ficaria parada, ancorada no fim de um bloco altíssimo. Aqui ela vira
   um elemento fixo no rodapé, que aparece só enquanto a cena está na
   tela e é alimentado pelo progresso de rolagem da própria seção.     */

const CENAS = [
  ['.hist', 5], ['.mesa', 6], ['.amb', 3],
  ['.sala', 4], ['.pal', 4], ['.mg', 7]
];

export default function progresso(gsap, ScrollTrigger, mm) {
  mm.add('(max-width: 899px)', () => {
    const sts = [];
    const devolver = [];

    CENAS.forEach(([sel, total]) => {
      const sec = document.querySelector(sel);
      if (!sec) return;
      const box = sec.querySelector('[data-prog]');
      if (!box) return;

      /* basta um transform em qualquer ancestral — e o GSAP deixa vários pelo
         caminho — para position:fixed passar a se ancorar nele em vez de na
         janela. Por isso a barra sai da cena e vai morar no <body>. */
      devolver.push([box, box.parentNode, box.nextSibling]);
      document.body.appendChild(box);

      const idx = box.querySelector('[data-prog-i]');
      const bar = box.querySelector('[data-prog-bar]');
      let ultimo = -1;

      sts.push(ScrollTrigger.create({
        trigger: sec,
        start: 'top top',
        end: 'bottom bottom',
        onToggle: self => box.classList.toggle('is-on', self.isActive),
        onUpdate: self => {
          const p = Math.max(0, Math.min(1, self.progress));
          if (bar) bar.style.transform = `scaleX(${p})`;
          const i = Math.min(total, Math.max(1, Math.ceil(p * total) || 1));
          if (i !== ultimo && idx) { idx.textContent = String(i).padStart(2, '0'); ultimo = i; }
        }
      }));
    });

    // o CTA fixo e a barrinha não dividem o rodapé
    const dock = document.getElementById('dock');
    let obs = null;
    if (dock) {
      obs = new MutationObserver(() => {
        document.documentElement.classList.toggle('dock-on', dock.classList.contains('is-on'));
      });
      obs.observe(dock, { attributes: true, attributeFilter: ['class'] });
    }

    return () => {
      sts.forEach(t => t.kill());
      obs && obs.disconnect();
      devolver.forEach(([el, pai, irmao]) => pai && pai.insertBefore(el, irmao));
      document.querySelectorAll('[data-prog]').forEach(b => b.classList.remove('is-on'));
      document.documentElement.classList.remove('dock-on');
    };
  });
}
