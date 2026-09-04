import { abrirModal } from '../modulesBiblia/modalGeneral.js';
import imageLoader from '../imageLoader.js';

export function inicializarAcercaDe() {
    const btn = document.getElementById('btnacercade');
    if (btn) {
        btn.addEventListener('click', () => {
            abrirModal('includes/acercade.html');
            setTimeout(cargarImagenAcercade, 500);
        });
    }
}

function cargarImagenAcercade() {
    // Buscar todas las imágenes con data-src dentro del modal de acercade
    const imagenes = document.querySelectorAll('.sec-acerdade img[data-src]');
    
    if (imagenes.length > 0) {
        imagenes.forEach(img => {
            imageLoader.loadImageDirect(img);
        });
    }
}