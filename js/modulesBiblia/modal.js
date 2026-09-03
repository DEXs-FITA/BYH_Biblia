//=========================================
// === MODAL VERSICULOS ===
//=========================================

import { obtenerEstado, guardarFondo, cargarFondo, obtenerFondo } from '../estadoGlobal.js';

let modalContainer = null;
let contextoActual = null;
let zoomLevel = 3;

export function mostrarVersiculo({ texto, numVersiculo, libro, capitulo, versiculos, indice }) {
    if (!modalContainer) {
        const template = document.getElementById('modal-pantalla');
        if (!template) {
            console.error('Template modal-pantalla no encontrado');
            return;
        }
        modalContainer = template.content.firstElementChild.cloneNode(true);
        document.body.appendChild(modalContainer);

        modalContainer.addEventListener('click', (e) => {
            if (e.target === modalContainer) cerrarModal();
        });

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

    contextoActual = { libro, capitulo, versiculos, indice };
    actualizarContenidoModal();
    modalContainer.classList.add('visible');
    document.body.style.overflow = 'hidden';
    
    setTimeout(() => aplicarFondo(), 100);
}

function actualizarContenidoModal() {
    if (!contextoActual) return;

    const { versiculos, indice, libro, capitulo } = contextoActual;
    const versiculo = versiculos[indice];
    if (!versiculo) return;

    const estado = obtenerEstado();
    const versionCorto = estado.versionCorto || 'RVR60';

    const contenedor = modalContainer.querySelector('.versiculo-mostrado');
    contenedor.innerHTML = '';

    const textoEl = document.createElement('span');
    textoEl.className = 'texto-versiculo-modal';
    textoEl.textContent = versiculo.__text;
    textoEl.style.fontSize = zoomLevel + 'rem';

    const citaContainer = document.createElement('div');
    citaContainer.className = 'cita-container';
    citaContainer.style.fontSize = Math.max(0.5, zoomLevel - 1) + 'rem';

    const citaEl = document.createElement('span');
    citaEl.className = 'cita-versiculo-modal';
    citaEl.textContent = libro + ' ' + capitulo + ':' + versiculo._n;

    const versionEl = document.createElement('span');
    versionEl.className = 'version-modal';
    versionEl.textContent = ' ' + versionCorto;

    citaContainer.appendChild(citaEl);
    citaContainer.appendChild(versionEl);

    contenedor.appendChild(textoEl);
    contenedor.appendChild(document.createElement('br'));
    contenedor.appendChild(citaContainer);

    const btnAtras = modalContainer.querySelector('#atras');
    const btnSiguiente = modalContainer.querySelector('#siguiente');
    if (btnAtras) btnAtras.disabled = (indice === 0);
    if (btnSiguiente) btnSiguiente.disabled = (indice === versiculos.length - 1);
}

function cerrarModal() {
    if (!modalContainer) return;
    modalContainer.classList.remove('visible');
    document.body.style.overflow = '';
}

function cambiarZoom(incremento) {
    zoomLevel = Math.max(1, zoomLevel + incremento);
    
    const textoEl = modalContainer.querySelector('.texto-versiculo-modal');
    const citaContainer = modalContainer.querySelector('.cita-container');
    
    if (textoEl) textoEl.style.fontSize = zoomLevel + 'rem';
    if (citaContainer) citaContainer.style.fontSize = Math.max(0.5, zoomLevel - 1) + 'rem';
}

function navegar(direccion) {
    if (!contextoActual) return;
    const nuevoIndice = contextoActual.indice + direccion;
    if (nuevoIndice >= 0 && nuevoIndice < contextoActual.versiculos.length) {
        contextoActual.indice = nuevoIndice;
        actualizarContenidoModal();
    }
}

// ==========================================
// FUNCIONES PARA EL FONDO
// ==========================================

export function seleccionarFondo(tipo, ruta) {
    const rutaGuardar = (tipo === 'imagen') ? ruta : null;
    guardarFondo(rutaGuardar);
}

export function aplicarFondo() {
    let contenedor = modalContainer ? modalContainer.querySelector('.contenedor-modal') : null;
    if (!contenedor) contenedor = document.querySelector('.contenedor-modal');
    if (!contenedor) return;
    
    const ruta = obtenerFondo();
    
    if (ruta) {
        contenedor.style.backgroundImage = 'url(' + ruta + ')';
        contenedor.style.backgroundSize = 'cover';
        contenedor.style.backgroundPosition = 'center';
    } else {
        contenedor.style.backgroundImage = 'none';
        contenedor.style.backgroundColor = 'var(--principal-primario)';
    }
}

export function obtenerFondoSeleccionado() {
    return obtenerFondo();
}

cargarFondo();