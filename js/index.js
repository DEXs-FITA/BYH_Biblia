import { initThemeToggle, toggleFullscreen, inicializarBotonCerrar } from './nav/botones.js';
import { inicializarBiblia } from './modulesBiblia/lectorListas.js';
import { inicializarAtajos } from './modulesBiblia/atajos.js';
import { inicializarAcercaDe } from './nav/acercade.js';

document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    inicializarBotonCerrar();
    inicializarBiblia();
    inicializarAtajos();
    inicializarAcercaDe();

    const btnMaxMin = document.querySelector('.btn-max-min');
    if (btnMaxMin) {
        btnMaxMin.id = 'fullscreenBtn';
        btnMaxMin.addEventListener('click', toggleFullscreen);
    }
});