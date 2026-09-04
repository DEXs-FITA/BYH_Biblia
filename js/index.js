// ============================================
// IMPORTACIONES
// ============================================
import { initThemeToggle, toggleFullscreen } from './nav/botones.js';
import { inicializarBiblia } from './modulesBiblia/lectorListas.js';
import { inicializarAtajos } from './modulesBiblia/atajos.js';
import { inicializarAcercaDe } from './nav/acercade.js';
import { inicializarOpciones } from './nav/opciones.js';
import imageLoader from './imageLoader.js';
import progressBar from './progressBar.js';

// ============================================
// INICIALIZACIÓN PRINCIPAL
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar funcionalidades existentes
    initThemeToggle();
    inicializarBiblia();
    inicializarAtajos();
    inicializarAcercaDe();
    inicializarOpciones();

    const btnMaxMin = document.querySelector('.btn-max-min');
    if (btnMaxMin) {
        btnMaxMin.id = 'fullscreenBtn';
        btnMaxMin.addEventListener('click', toggleFullscreen);
    }
    
    // Inicializar lazy loading para imágenes
    initLazyLoading();
});

// ============================================
// OPTIMIZACIÓN DE IMÁGENES - LAZY LOADING
// ============================================
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if (images.length > 0) {
        imageLoader.onProgress((percentage, loaded, total) => {
            progressBar.update(percentage, loaded, total);
        });
        
        imageLoader.onComplete(() => {
            console.log('Imagenes cargadas completamente');
        });
        
        imageLoader.registerImages(images);
    }
}