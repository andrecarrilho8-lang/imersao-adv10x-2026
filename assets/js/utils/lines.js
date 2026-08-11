/* lines.js — quebra um título nas linhas que o browser realmente desenhou
   e envolve cada uma numa máscara, para revelar linha a linha.
   Sem dependência de plugin pago. Refaz sob demanda quando a largura muda. */

export function splitLines(el) {
  if (el.dataset.split === '1') return [...el.querySelectorAll('.ln__i')];
  // títulos com marcação interna (<br>, <em>…) não são quebrados: o chamador usa o fallback
  if (el.dataset.split !== '1' && el.querySelector('br,em,b,i,span,strong')) return null;

  const text = el.getAttribute('data-raw') || el.textContent;
  el.setAttribute('data-raw', text);

  // 1) envolve cada palavra para medir a posição vertical real
  el.innerHTML = text
    .split(/(\s+)/)
    .map(t => (/^\s+$/.test(t) ? t : `<span class="w">${t}</span>`))
    .join('');

  const words = [...el.querySelectorAll('.w')];
  if (!words.length) return [];

  const rows = [];
  let top = null, cur = null;
  words.forEach(w => {
    const t = Math.round(w.offsetTop);
    if (top === null || Math.abs(t - top) > 4) { top = t; cur = []; rows.push(cur); }
    cur.push(w.textContent);
  });

  // 2) reconstrói como linhas mascaradas
  el.innerHTML = rows
    .map(r => `<span class="ln"><span class="ln__i">${r.join(' ')}</span></span>`)
    .join('');
  el.dataset.split = '1';

  return [...el.querySelectorAll('.ln__i')];
}

export function unsplit(el) {
  const raw = el.getAttribute('data-raw');
  if (!raw) return;
  el.textContent = raw;
  el.dataset.split = '';
}

/* estilos mínimos injetados uma vez */
const css = document.createElement('style');
css.textContent = `
.ln{display:block;overflow:hidden;padding-bottom:.03em}
.ln__i{display:block;will-change:transform}
`;
document.head.appendChild(css);
