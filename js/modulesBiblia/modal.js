//=========================================
// === CLONADO DE TEXTO ===
//=========================================
// Este modulo esta viculado a lectorListas.js mediante la linea:
// import { mostrarVersiculo } from './modal.js';

let modalContainer = null;
let contextoActual = null;   // { libro, capitulo, versiculos, indice }
let zoomLevel = 3;           // tamaño base en rem (inicial: 3rem)

export function mostrarVersiculo({ texto, numVersiculo, libro, capitulo, versiculos, indice }) {
  if (!modalContainer) {
    const template = document.getElementById('modal-pantalla');
    modalContainer = template.content.firstElementChild.cloneNode(true);
    document.body.appendChild(modalContainer);

    // Cerrar al hacer clic en el fondo
    modalContainer.addEventListener('click', (e) => {
      if (e.target === modalContainer) cerrarModal();
    });

    // Botones
    const btnCerrar = modalContainer.querySelector('#cerrar');
    if (btnCerrar) btnCerrar.addEventListener('click', cerrarModal);

    const btnZoomMas = modalContainer.querySelector('#zoom-mas');
    const btnZoomMenos = modalContainer.querySelector('#zoom-menos');
    const btnAtras = modalContainer.querySelector('#atras');
    const btnSiguiente = modalContainer.querySelector('#siguiente');

    if (btnZoomMas) btnZoomMas.addEventListener('click', () => cambiarZoom(0.5));
    if (btnZoomMenos) btnZoomMenos.addEventListener('click', () => cambiarZoom(-0.5));
    if (btnAtras) btnAtras.addEventListener('click', () => navegar(-1));
    if (btnSiguiente) btnSiguiente.addEventListener('click', () => navegar(1));
  }

  // Guardar el contexto actual
  contextoActual = { libro, capitulo, versiculos, indice };

  // Construir contenido
  actualizarContenidoModal();

  // Mostrar y bloquear scroll
  modalContainer.classList.add('visible');
  document.body.style.overflow = 'hidden';
}

function actualizarContenidoModal() {
  if (!contextoActual) return;

  const { versiculos, indice, libro, capitulo } = contextoActual;
  const versiculo = versiculos[indice];
  if (!versiculo) return;

  const contenedor = modalContainer.querySelector('.versiculo-mostrado');
  contenedor.innerHTML = '';

  const textoEl = document.createElement('span');
  textoEl.className = 'texto-versiculo-modal';
  textoEl.textContent = versiculo.__text;
  textoEl.style.fontSize = zoomLevel + 'rem';

  const citaEl = document.createElement('span');
  citaEl.className = 'cita-versiculo-modal';
  citaEl.textContent = `${libro} ${capitulo}:${versiculo._n}`;
  citaEl.style.fontSize = Math.max(0.5, zoomLevel - 1) + 'rem';

  contenedor.appendChild(textoEl);
  contenedor.appendChild(document.createElement('br'));
  contenedor.appendChild(citaEl);

  // Estado de botones de navegación
  const btnAtras = modalContainer.querySelector('#atras');
  const btnSiguiente = modalContainer.querySelector('#siguiente');
  if (btnAtras) btnAtras.disabled = (indice === 0);
  if (btnSiguiente) btnSiguiente.disabled = (indice === versiculos.length - 1);
}

//=========================================
// === FUNCIONALIDAD BOTONES ===
//=========================================
function cerrarModal() {
  if (!modalContainer) return;
  modalContainer.classList.remove('visible');
  document.body.style.overflow = '';
}

function cambiarZoom(incremento) {
  zoomLevel = Math.max(1, zoomLevel + incremento); // mínimo 1rem
  const textoEl = modalContainer.querySelector('.texto-versiculo-modal');
  const citaEl = modalContainer.querySelector('.cita-versiculo-modal');
  if (textoEl) {
    textoEl.style.fontSize = zoomLevel + 'rem';
  }
  if (citaEl) {
    citaEl.style.fontSize = Math.max(0.5, zoomLevel - 1) + 'rem';
  }
}

function navegar(direccion) {
  if (!contextoActual) return;
  const nuevoIndice = contextoActual.indice + direccion;
  if (nuevoIndice >= 0 && nuevoIndice < contextoActual.versiculos.length) {
    contextoActual.indice = nuevoIndice;
    actualizarContenidoModal();
  }
}