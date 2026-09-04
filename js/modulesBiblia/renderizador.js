//=========================================
// === RENDERIZADOR DE INTERFAZ ===
//=========================================
// Responsabilidad:
// - Renderizar libros, capítulos y versículos en el DOM
// - Gestionar el contenido visual de la Biblia

import { obtenerDatos } from './cargador.js';
import { mostrarVersiculo } from './modal.js'; 

let librosPanel = null;
let capitulosPanel = null;
let contenedorVersos = null;
let callbackSeleccionLibro = null;
let callbackSeleccionCapitulo = null;

export function initDelegacionLibros(panel, callback) {
    librosPanel = panel;
    callbackSeleccionLibro = callback;
    
    if (librosPanel) {
        librosPanel.removeEventListener('click', handleLibroClick);
        librosPanel.addEventListener('click', handleLibroClick);
    }
}

function handleLibroClick(e) {
    const opcion = e.target.closest('.libro-opcion');
    if (!opcion) return;
    
    const index = parseInt(opcion.dataset.index);
    const nombre = opcion.textContent;
    
    if (callbackSeleccionLibro) {
        callbackSeleccionLibro(index, nombre);
    }
}

export function initDelegacionCapitulos(panel, callback) {
    capitulosPanel = panel;
    callbackSeleccionCapitulo = callback;
    
    if (capitulosPanel) {
        capitulosPanel.removeEventListener('click', handleCapituloClick);
        capitulosPanel.addEventListener('click', handleCapituloClick);
    }
}

function handleCapituloClick(e) {
    const opcion = e.target.closest('.capitulo-opcion');
    if (!opcion) return;
    
    const capituloNum = parseInt(opcion.dataset.capitulo);
    
    if (callbackSeleccionCapitulo) {
        callbackSeleccionCapitulo(capituloNum);
    }
}

export function initDelegacionVersiculos(contenedor) {
    contenedorVersos = contenedor;
    
    if (contenedorVersos) {
        contenedorVersos.removeEventListener('click', handleVersiculoClick);
        contenedorVersos.addEventListener('click', handleVersiculoClick);
    }
}

function handleVersiculoClick(e) {
    const tarjeta = e.target.closest('.versiculo');
    if (!tarjeta) return;
    
    const index = parseInt(tarjeta.dataset.index);
    const libroNombre = tarjeta.dataset.libro;
    const capituloNum = parseInt(tarjeta.dataset.capitulo);
    
    const datos = obtenerDatos();
    if (!datos) return;
    
    const libro = datos.find(l => l._n === libroNombre);
    if (!libro) return;
    
    const capitulo = libro.c.find(c => c._n == capituloNum);
    if (!capitulo || !capitulo.v) return;
    
    const versiculo = capitulo.v[index];
    if (!versiculo) return;
    
    mostrarVersiculo({
        texto: versiculo.__text,
        numVersiculo: versiculo._n,
        libro: libroNombre,
        capitulo: capituloNum,
        versiculos: capitulo.v,
        indice: index
    });
}

export function renderizarLibros(panel, callbackSeleccion) {
    const datos = obtenerDatos();
    if (!datos) {
        panel.innerHTML = '<p class="error">No hay datos cargados</p>';
        return;
    }

    if (!librosPanel || librosPanel !== panel) {
        initDelegacionLibros(panel, callbackSeleccion);
    }

    panel.innerHTML = '';
    datos.forEach((libro, index) => {
        const opcion = document.createElement('button');
        opcion.type = 'button';
        opcion.className = 'libro-opcion';
        opcion.textContent = libro._n;
        opcion.dataset.index = index;
        panel.appendChild(opcion);
    });
}

export function renderizarCapitulos(libroIndex, panel, callbackSeleccion) {
    const datos = obtenerDatos();
    if (!datos) return;

    const libro = datos[libroIndex];
    if (!libro || !libro.c) return;

    if (!capitulosPanel || capitulosPanel !== panel) {
        initDelegacionCapitulos(panel, callbackSeleccion);
    }

    panel.innerHTML = '';
    libro.c.forEach(cap => {
        const opcion = document.createElement('button');
        opcion.type = 'button';
        opcion.className = 'capitulo-opcion';
        opcion.textContent = `${cap._n}`;
        opcion.dataset.capitulo = cap._n;
        panel.appendChild(opcion);
    });
}

export function renderizarVersiculos(libroIndex, capituloNum, contenedor) {
    const datos = obtenerDatos();
    if (!datos) return;

    const libro = datos[libroIndex];
    if (!libro) return;

    const capitulo = libro.c.find(cap => cap._n == capituloNum);
    if (!capitulo || !capitulo.v) return;

    if (!contenedorVersos || contenedorVersos !== contenedor) {
        initDelegacionVersiculos(contenedor);
    }

    const fragment = document.createDocumentFragment();

    const header = document.createElement('h2');
    header.className = 'capitulo-header';
    header.textContent = `${libro._n} ${capitulo._n}`;
    fragment.appendChild(header);

    capitulo.v.forEach((versiculo, index) => {
        const tarjeta = document.createElement('div');
        tarjeta.className = 'versiculo';
        tarjeta.setAttribute('tabindex', '0');
        tarjeta.dataset.index = index;
        tarjeta.dataset.libro = libro._n;
        tarjeta.dataset.capitulo = capituloNum;
        
        const numSpan = document.createElement('span');
        numSpan.className = 'num-versiculo';
        numSpan.textContent = versiculo._n + ' ';
        
        const textSpan = document.createElement('span');
        textSpan.className = 'texto-versiculo';
        textSpan.textContent = versiculo.__text;
        
        tarjeta.appendChild(numSpan);
        tarjeta.appendChild(textSpan);
        fragment.appendChild(tarjeta);
    });

    contenedor.innerHTML = '';
    contenedor.appendChild(fragment);
}

export function limpiarVersiculos(contenedorVersos) {
    contenedorVersos.innerHTML = '';
}

export function marcarSeleccionado(selector, valor, clase = 'seleccionado') {
    document.querySelectorAll(selector).forEach(btn => {
        btn.classList.remove(clase);
        if (btn.dataset.index == valor || btn.dataset.capitulo == valor) {
            btn.classList.add(clase);
        }
    });
}