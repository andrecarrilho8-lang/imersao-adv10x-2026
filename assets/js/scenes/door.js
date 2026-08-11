/* door.js — a porta. Pergunta o primeiro nome uma única vez, guarda em
   sessionStorage e devolve a página. Pulável, e some para quem já entrou.
   O nome aparece em pouquíssimos lugares, sempre com data-name-hello.     */

import { NAME_KEY } from '../utils/env.js';
import { fillNames } from '../utils/nome.js';

function greet() {
  // o nome vive dentro da headline do hero — quem monta é o hero.js
  if (window.__heroName) window.__heroName();
  fillNames();          // e nos poucos outros lugares marcados com data-nome
}

export default function door(gsap) {
  const el = document.getElementById('door');
  if (!el) return;

  const saved = sessionStorage.getItem(NAME_KEY);
  if (saved !== null) { return; }      // já passou pela porta

  const form = document.getElementById('doorForm');
  const input = document.getElementById('doorName');
  const skip = document.getElementById('doorSkip');

  el.hidden = false;
  document.body.style.overflow = 'hidden';
  setTimeout(() => input && input.focus({ preventScroll: true }), 420);

  const enter = (name) => {
    sessionStorage.setItem(NAME_KEY, name);
    greet();
    document.body.style.overflow = '';
    if (gsap) {
      gsap.to(el, { opacity: 0, duration: .7, ease: 'power2.inOut',
        onComplete: () => { el.hidden = true; window.dispatchEvent(new Event('resize')); } });
    } else { el.hidden = true; }
  };

  const clean = v => (v || '').trim().replace(/\s+/g, ' ').split(' ')[0].slice(0, 24)
    .replace(/^./, c => c.toUpperCase());

  form && form.addEventListener('submit', e => { e.preventDefault(); enter(clean(input.value)); });
  skip && skip.addEventListener('click', () => enter(''));
}
