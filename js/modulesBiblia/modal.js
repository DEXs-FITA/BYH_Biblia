//=========================================
// === MODAL VERSICULOS ===
//=========================================

import { obtenerEstado, guardarFondo, cargarFondo, obtenerFondo, obtenerColorFondo } from '../estadoGlobal.js';
import imageLoader from '../imageLoader.js';

let modalContainer = null;
let contextoActual = null;
let zoomLevel = 3;
let fondoActualUrl = null;      
let fondoCacheado = null;        

// ---------------------------------------------------------------------
// Mostrar el modal con un versículo
// ---------------------------------------------------------------------
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
        const btnZoomMenos = modalContainer.querySelector('#zoom-menosa');
        const btnAtras = modalContainer.querySelector('#atras');
        const btnSiguiente = modalContainer.querySelector('#siguiente');

        if (btnZoomMas) btnZoomMas.addEventListener('click', () => cambiarZoom(0.5));
        if (btnZoomMenos) btnZoomMenos.addEventListener('click', () => cambiarZoom(-0.5));
        if (btnAtras) btnAtras.addEventListener('click', () => navegar(-1));
        if (btnSiguiente) btnSiguiente.addEventListener('click', () => navegar(1));
    }

    contextoActual = { libro, capitulo, versiculos, indice };
    actualizarContenidoModal();
    aplicarFondoSinParpadeo();

    modalContainer.classList.add('visible');
    document.body.style.overflow = 'hidden';
}

// ---------------------------------------------------------------------
// Actualizar el contenido del modal (texto, cita, navegación)
// ---------------------------------------------------------------------
function actualizarContenidoModal() {
    if (!contextoActual) return;

    const { versiculos, indice, libro, capitulo } = contextoActual;
    const versiculo = versiculos[indice];
    if (!versiculo) return;

    const estado = obtenerEstado();
    const versionCorto = estado.versionCorto || 'RVR60';

    const contenedor = modalContainer.querySelector('.contenido-versiculo');
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

// ---------------------------------------------------------------------
// GESTIÓN DEL FONDO DE PANTALLA
// ---------------------------------------------------------------------

/**
 * Seleccionar un fondo (imagen o color) y guardarlo en localStorage.
 * @param {string} tipo - 'imagen' o 'color'
 * @param {string} ruta - Ruta de la imagen o código de color
 */
export function seleccionarFondo(tipo, ruta) {
    if (tipo === 'imagen') {
        guardarFondo(ruta);
    } else {
        // Si es color, guardamos null en fondoRuta y el color se guarda aparte
        guardarFondo(null);
        // Nota: el color se guarda mediante guardarColorFondo desde otro lugar
    }
    // Limpiar cachés de fondo
    fondoCacheado = null;
    fondoPrecargado = null;
    if (fondoActualUrl) {
        URL.revokeObjectURL(fondoActualUrl);
        fondoActualUrl = null;
    }
}

/**
 * Carga el fondo desde la caché del Service Worker usando caches.match()
 */
async function cargarFondoPersistente() {
    const ruta = obtenerFondo();
    if (!ruta) {
        fondoCacheado = null;
        return null;
    }

    if (fondoCacheado) {
        return fondoCacheado;
    }

    try {
        // Convertir ruta relativa a absoluta para que caches.match la encuentre
        const urlAbsoluta = new URL(ruta, location.href).href;
        const cachedResponse = await caches.match(urlAbsoluta);

        if (cachedResponse) {
            const blob = await cachedResponse.blob();
            const objectUrl = URL.createObjectURL(blob);
            fondoCacheado = objectUrl;
            return objectUrl;
        }

        console.warn('Fondo no encontrado en caché:', ruta);
        return null;
    } catch (error) {
        console.warn('Error cargando fondo:', error);
        fondoCacheado = null;
        return null;
    }
}

/**
 * Usa el fondo cacheado si existe, o lo carga asíncronamente.
 */
function aplicarFondoSinParpadeo() {
    let contenedor = modalContainer ? modalContainer.querySelector('.contenedor-modal') : null;
    if (!contenedor) contenedor = document.querySelector('.contenedor-modal');
    if (!contenedor) return;

    const ruta = obtenerFondo();
    const color = obtenerColorFondo();

    // Si hay un color guardado y no hay imagen, usamos el color
    if (color && !ruta) {
        contenedor.style.backgroundImage = 'none';
        contenedor.style.backgroundColor = color;
        if (fondoActualUrl) {
            URL.revokeObjectURL(fondoActualUrl);
            fondoActualUrl = null;
        }
        fondoCacheado = null;
        return;
    }

    // Si hay una imagen de fondo
    if (ruta) {
        // Si ya la tenemos cacheada, la aplicamos directamente
        if (fondoCacheado) {
            contenedor.style.backgroundImage = 'url(' + fondoCacheado + ')';
            contenedor.style.backgroundSize = 'cover';
            contenedor.style.backgroundPosition = 'center';
            if (fondoActualUrl && fondoActualUrl !== fondoCacheado) {
                URL.revokeObjectURL(fondoActualUrl);
            }
            fondoActualUrl = fondoCacheado;
            return;
        }

        // Temporalmente ponemos un color de fondo mientras se carga la imagen
        contenedor.style.backgroundColor = 'var(--principal-primario)';
        contenedor.style.backgroundImage = 'none';

        // Cargar la imagen de forma asíncrona
        cargarFondoPersistente().then((objectUrl) => {
            if (objectUrl) {
                contenedor.style.backgroundImage = 'url(' + objectUrl + ')';
                contenedor.style.backgroundSize = 'cover';
                contenedor.style.backgroundPosition = 'center';
                if (fondoActualUrl) {
                    URL.revokeObjectURL(fondoActualUrl);
                }
                fondoActualUrl = objectUrl;
            }
        });
    } else {
        // Sin imagen ni color: fondo por defecto
        contenedor.style.backgroundImage = 'none';
        contenedor.style.backgroundColor = 'var(--principal-primario)';
        if (fondoActualUrl) {
            URL.revokeObjectURL(fondoActualUrl);
            fondoActualUrl = null;
        }
        fondoCacheado = null;
    }
}

// ---------------------------------------------------------------------
// EXPORTACIONES PÚBLICAS
// ---------------------------------------------------------------------

/**
 * Aplica el fondo (punto de entrada para otros módulos).
 * Simplemente llama a la función interna.
 */
export function aplicarFondo() {
    aplicarFondoSinParpadeo();
}

/**
 * Devuelve la ruta del fondo actualmente seleccionado.
 * @returns {string|null}
 */
export function obtenerFondoSeleccionado() {
    return obtenerFondo();
}

// Cargar el fondo guardado al inicio (para que esté disponible)
cargarFondo();
