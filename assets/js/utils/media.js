/* media.js — carregamento tardio, play/pause por visibilidade e teto de players simultâneos.
   Nenhum vídeo baixa nada antes de chegar perto da viewport.                              */

import { reduced } from './env.js';

const MAX_PLAYING = 3;          // nunca mais que isto tocando ao mesmo tempo
const live = new Set();         // vídeos visíveis agora, em ordem de entrada
let io = null;

function chooseSrc(v) {
  const wide = v.dataset.srcWide, tall = v.dataset.srcTall;
  if (wide && tall) return window.matchMedia('(min-width: 700px)').matches ? wide : tall;
  return v.dataset.src || wide || tall || '';
}

function attach(v) {
  if (v.dataset.loaded) return;
  const src = chooseSrc(v);
  if (!src) return;
  v.dataset.loaded = '1';
  v.preload = 'auto';
  v.src = src;
  v.load();
}

function safePlay(v) {
  const p = v.play();
  if (p && p.catch) p.catch(() => { /* autoplay bloqueado: fica no poster */ });
}

function enforceCap() {
  const arr = [...live];
  arr.forEach((v, i) => {
    if (i < arr.length - MAX_PLAYING) { v.pause(); }
    else { attach(v); if (v.paused) safePlay(v); }
  });
}

export function initMedia() {
  const vids = [...document.querySelectorAll('video[data-video]')];

  // Movimento reduzido: o vídeo vira a sua própria capa. Nada baixa, nada se mexe.
  if (reduced) {
    vids.forEach(v => {
      const poster = v.getAttribute('poster');
      if (!poster) return;
      const img = new Image();
      img.src = poster; img.alt = ''; img.decoding = 'async'; img.loading = 'lazy';
      img.className = v.className;
      v.replaceWith(img);
    });
    return;
  }

  io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      const v = e.target;
      if (e.isIntersecting) { live.delete(v); live.add(v); }
      else { live.delete(v); v.pause(); }
    }
    enforceCap();
  }, { rootMargin: '25% 0px 25% 0px', threshold: 0.01 });

  vids.forEach(v => io.observe(v));

  // aba escondida: nada toca
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) live.forEach(v => v.pause());
    else enforceCap();
  });

  // troca de fonte wide/tall quando a largura cruza o breakpoint
  const mq = window.matchMedia('(min-width: 700px)');
  const swap = () => {
    document.querySelectorAll('video[data-src-wide][data-src-tall]').forEach(v => {
      const want = chooseSrc(v);
      if (v.dataset.loaded === '1' && !v.currentSrc.endsWith(want.split('/').pop())) {
        v.dataset.loaded = ''; attach(v); if (live.has(v)) safePlay(v);
      }
    });
  };
  mq.addEventListener ? mq.addEventListener('change', swap) : mq.addListener(swap);
}
