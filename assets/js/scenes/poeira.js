/* poeira.js — poeira dourada em suspensão nas três cenas de impacto.
   Poucas partículas, lentas, quase invisíveis: é profundidade, não neve.
   Só desenha quando a cena está na tela e a aba está visível.          */

export default function poeira() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  // um grão desenhado uma vez e reaproveitado: halo macio, custo zero por quadro
  const grao = document.createElement('canvas');
  grao.width = grao.height = 64;
  const gg = grao.getContext('2d');
  const grad = gg.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(232,212,156,1)');
  grad.addColorStop(.32, 'rgba(226,203,140,.5)');
  grad.addColorStop(1, 'rgba(226,203,140,0)');
  gg.fillStyle = grad;
  gg.fillRect(0, 0, 64, 64);

  document.querySelectorAll('[data-poeira]').forEach(host => {
    if (host.querySelector(':scope > .poeira')) return;

    const cv = document.createElement('canvas');
    cv.className = 'poeira';
    cv.setAttribute('aria-hidden', 'true');
    host.appendChild(cv);

    const ctx = cv.getContext('2d', { alpha: true });
    if (!ctx) return;

    let w = 0, h = 0, ps = [], raf = 0, naTela = false;

    const quantas = () => (window.innerWidth < 620 ? 11 : 22);

    const nova = (y) => ({
      x: Math.random() * w,
      y: y === undefined ? Math.random() * h : y,
      r: 1.1 + Math.random() * 2.6,
      v: .05 + Math.random() * .16,          // px por quadro: bem devagar
      a: .12 + Math.random() * .28,
      f: Math.random() * 6.283,
      amp: 5 + Math.random() * 14
    });

    const medir = () => {
      const r = host.getBoundingClientRect();
      w = Math.max(1, Math.round(r.width));
      h = Math.max(1, Math.round(Math.min(r.height, window.innerHeight * 1.2)));
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      cv.style.width = w + 'px';
      cv.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (ps.length !== quantas()) ps = Array.from({ length: quantas() }, () => nova());
    };

    const quadro = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of ps) {
        p.y -= p.v;
        p.f += .0055;
        if (p.y < -6) Object.assign(p, nova(h + 6));
        const d = p.r * 7;
        ctx.globalAlpha = p.a;
        ctx.drawImage(grao, p.x + Math.sin(p.f) * p.amp - d / 2, p.y - d / 2, d, d);
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(quadro);
    };

    const liga = () => { if (!raf && naTela && !document.hidden) raf = requestAnimationFrame(quadro); };
    const desliga = () => { if (raf) { cancelAnimationFrame(raf); raf = 0; } };

    medir();

    const io = new IntersectionObserver(es => {
      naTela = es[0].isIntersecting;
      naTela ? liga() : desliga();
    }, { rootMargin: '10% 0px' });
    io.observe(host);

    document.addEventListener('visibilitychange', () => (document.hidden ? desliga() : liga()));

    let t = 0;
    window.addEventListener('resize', () => {
      clearTimeout(t);
      t = setTimeout(medir, 200);
    }, { passive: true });
  });
}
