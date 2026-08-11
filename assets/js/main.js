/* main.js — orquestra. Uma cena por módulo; tudo dentro de um gsap.context,
   e o matchMedia troca a arquitetura (não a escala) entre desktop e mobile. */

window.__mv = 1;

import { reduced, waitForGsap, onWidthChange } from './utils/env.js';
import { initMedia } from './utils/media.js';
import { fillNames } from './utils/nome.js';
import { initReveals } from './utils/reveal.js';

import door from './scenes/door.js';
import hero from './scenes/hero.js';
import editorial from './scenes/editorial.js';
import hist from './scenes/hist.js';
import mesa from './scenes/mesa.js';
import ambiencia from './scenes/ambiencia.js';
import sala from './scenes/sala.js';
import palestra from './scenes/palestra.js';
import marcelo from './scenes/marcelo.js';
import fim from './scenes/fim.js';
import tres from './scenes/tres.js';
import oferta from './scenes/oferta.js';
import poeira from './scenes/poeira.js';

const SCENES = [hero, hist, mesa, ambiencia, sala, palestra, marcelo, fim];

/* CTA fixo: só do bloco de investimento até os ingressos */
function dock(ScrollTrigger) {
  const el = document.getElementById('dock');
  const from = document.getElementById('investimento');
  const to = document.getElementById('ingressos');
  if (!el || !from || !to) return;
  ScrollTrigger.create({
    trigger: from, start: 'top 55%', endTrigger: to, end: 'top 65%',
    onToggle: self => el.classList.toggle('is-on', self.isActive)
  });
}

function anchors() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const t = document.querySelector(id);
      if (!t) return;
      e.preventDefault();
      t.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    });
  });
}

(async function boot() {
  initMedia();
  anchors();
  door(window.gsap);

  const off = () => document.documentElement.classList.remove('motion');

  if (reduced) { off(); return; }
  const gsap = await waitForGsap();
  if (!gsap) { off(); return; }

  gsap.registerPlugin(window.ScrollTrigger);
  const ScrollTrigger = window.ScrollTrigger;
  ScrollTrigger.config({ ignoreMobileResize: true });
  document.documentElement.classList.add('motion');

  let ctx;
  const mount = () => {
    ctx && ctx.revert();
    ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      fillNames();
      initReveals(gsap, ScrollTrigger);
      // uma cena que quebre não pode levar as outras junto
      const run = (fn, nome) => { try { fn(gsap, ScrollTrigger, mm); }
        catch (err) { console.error('[cena]', nome, err); } };
      SCENES.forEach((fn, i) => run(fn, i));
      run(editorial, 'editorial');
      run(tres, 'tres');
      run(oferta, 'oferta');
      run(poeira, 'poeira');
      dock(ScrollTrigger);
    });
  };

  mount();

  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
  window.addEventListener('load', () => ScrollTrigger.refresh());
  onWidthChange(() => { mount(); ScrollTrigger.refresh(); });
})();
