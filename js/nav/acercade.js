import { abrirModal } from '../modulesBiblia/modalGeneral.js';

export function inicializarAcercaDe() {
    const btn = document.getElementById('btnacercade');
    if (btn) {
        btn.addEventListener('click', () => abrirModal('includes/acercade.html'));
    }
}