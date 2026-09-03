import { initThemeToggle, toggleFullscreen } from './nav/botones.js';
import { inicializarBiblia } from './modulesBiblia/lectorListas.js';
import { inicializarAtajos } from './modulesBiblia/atajos.js';
import { inicializarAcercaDe } from './nav/acercade.js';
import { inicializarOpciones } from './nav/opciones.js';

document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    inicializarBiblia();    // ← Ahora orquesta cargador + renderizador + navegador
    inicializarAtajos();
    inicializarAcercaDe();
    inicializarOpciones();

    const btnMaxMin = document.querySelector('.btn-max-min');
    if (btnMaxMin) {
        btnMaxMin.id = 'fullscreenBtn';
        btnMaxMin.addEventListener('click', toggleFullscreen);
    }
});