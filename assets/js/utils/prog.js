/* prog.js — o acompanhamento das cenas longas.
   Um contador em mono e um fio dourado que cresce. Sem isso, rolagem longa
   em fundo escuro parece que travou.                                       */

export function prog(sec, total) {
  const box = sec.querySelector('[data-prog]');
  if (!box) return null;
  const idx = box.querySelector('[data-prog-i]');
  const bar = box.querySelector('[data-prog-bar]');
  let last = -1;
  return (self) => {
    const p = Math.max(0, Math.min(1, self.progress));
    if (bar) bar.style.transform = `scaleX(${p})`;
    const i = Math.min(total, Math.max(1, Math.ceil(p * total) || 1));
    if (i !== last && idx) { idx.textContent = String(i).padStart(2, '0'); last = i; }
  };
}
