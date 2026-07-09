// =======================================================
// == IMPORTACIONES ==
// =======================================================
import { initThemeToggle, toggleFullscreen, inicializarBotonCerrar } from './nav/botones.js';
import { inicializarBiblia } from './modulesBiblia/lectorListas.js';
import { inicializarAtajos } from './modulesBiblia/atajos.js';

// =======================================================
// == INICIALIZACIÓN PRINCIPAL ==
// =======================================================
document.addEventListener('DOMContentLoaded', () => {
  // Tema claro/oscuro
  initThemeToggle();

  // Botón pantalla completa (maximizar/minimizar)
  const btnMaxMin = document.querySelector('.btn-max-min');
  if (btnMaxMin) {
    btnMaxMin.addEventListener('click', (e) => {
      e.preventDefault();
      toggleFullscreen();
    });
    btnMaxMin.id = 'fullscreenBtn';
    console.log('Botón de pantalla completa inicializado');
  } else {
    console.warn('No se encontró el botón .btn-max-min');
  }

  // Botón cerrar
  inicializarBotonCerrar();

  // Carga de la Biblia (libros, capítulos, versículos)
  inicializarBiblia();

  // Carga de atajos
  inicializarAtajos();

  // Aquí puedes agregar otras inicializaciones futuras
});