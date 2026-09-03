//=========================================
// === RENDERIZADOR DE INTERFAZ ===
//=========================================
// Responsabilidad:
// - Renderizar libros, capítulos y versículos en el DOM
// - Gestionar el contenido visual de la Biblia

import { obtenerDatos } from './cargador.js';
import { mostrarVersiculo } from './modal.js'; 

// Renderizar la lista de libros en el panel
export function renderizarLibros(librosPanel, callbackSeleccion) {
    const datos = obtenerDatos();
    if (!datos) {
        librosPanel.innerHTML = '<p class="error">No hay datos cargados</p>';
        return;
    }

    librosPanel.innerHTML = '';
    datos.forEach((libro, index) => {
        const opcion = document.createElement('button');
        opcion.type = 'button';
        opcion.className = 'libro-opcion';
        opcion.textContent = libro._n;
        opcion.dataset.index = index;
        opcion.addEventListener('click', () => {
            callbackSeleccion(index, libro._n);
        });
        librosPanel.appendChild(opcion);
    });
}

// Renderizar la lista de capítulos en el panel
export function renderizarCapitulos(libroIndex, capitulosPanel, callbackSeleccion) {
    const datos = obtenerDatos();
    if (!datos) return;

    const libro = datos[libroIndex];
    if (!libro || !libro.c) return;

    capitulosPanel.innerHTML = '';
    libro.c.forEach(cap => {
        const opcion = document.createElement('button');
        opcion.type = 'button';
        opcion.className = 'capitulo-opcion';
        opcion.textContent = `${cap._n}`;
        opcion.dataset.capitulo = cap._n;
        opcion.addEventListener('click', () => {
            callbackSeleccion(cap._n);
        });
        capitulosPanel.appendChild(opcion);
    });
}

// Renderizar los versículos de un capítulo
export function renderizarVersiculos(libroIndex, capituloNum, contenedorVersos) {
    const datos = obtenerDatos();
    if (!datos) return;

    const libro = datos[libroIndex];
    if (!libro) return;

    const capitulo = libro.c.find(cap => cap._n == capituloNum);
    if (!capitulo || !capitulo.v) return;

    const fragment = document.createDocumentFragment();

    const header = document.createElement('h2');
    header.className = 'capitulo-header';
    header.textContent = `${libro._n} ${capitulo._n}`;
    fragment.appendChild(header);

    capitulo.v.forEach((versiculo, index) => {
        const tarjeta = document.createElement('div');
        tarjeta.className = 'versiculo';
        tarjeta.setAttribute('tabindex', '0');
        tarjeta.innerHTML = `
            <span class="num-versiculo">${versiculo._n}</span>
            <span class="texto-versiculo">${versiculo.__text}</span>
        `;
        tarjeta.dataset.index = index;
        
        tarjeta.addEventListener('click', () => {
            mostrarVersiculo({
                texto: versiculo.__text,
                numVersiculo: versiculo._n,
                libro: libro._n,
                capitulo: capituloNum,
                versiculos: capitulo.v,
                indice: index
            });
        });
        
        fragment.appendChild(tarjeta);
    });

    contenedorVersos.innerHTML = '';
    contenedorVersos.appendChild(fragment);
}

// Limpiar el contenido de versículos
export function limpiarVersiculos(contenedorVersos) {
    contenedorVersos.innerHTML = '';
}

// Marcar un botón como seleccionado
export function marcarSeleccionado(selector, valor, clase = 'seleccionado') {
    document.querySelectorAll(selector).forEach(btn => {
        btn.classList.remove(clase);
        if (btn.dataset.index == valor || btn.dataset.capitulo == valor) {
            btn.classList.add(clase);
        }
    });
}