/* nome.js — o primeiro nome entra em pouquíssimos lugares fora do hero.
   Cada elemento carrega os dois modelos: data-com (com nome) e data-sem.
   Sem nome, o texto continua correto — nada de vírgula solta.            */

import { NAME_KEY } from './env.js';

export function fillNames() {
  const nome = (sessionStorage.getItem(NAME_KEY) || '').trim();
  document.querySelectorAll('[data-nome]').forEach(el => {
    const tpl = nome ? el.dataset.com : el.dataset.sem;
    if (tpl) el.textContent = nome ? tpl.replace('{NOME}', nome) : tpl;
  });
}
