//=========================================
// === NAVEGADOR DE LIBROS/CAPÍTULOS ===
//=========================================
// Responsabilidad:
// - Gestionar el estado de navegación (libro, capítulo)
// - Coordinar la interacción entre UI y datos
// - Controlar paneles desplegables

import { 
    obtenerDatos, 
    hayDatosCargados 
} from './cargador.js';

import {
    renderizarLibros,
    renderizarCapitulos,
    renderizarVersiculos,
    limpiarVersiculos,
    marcarSeleccionado
} from './renderizador.js';

// Estado de navegación
const estadoNavegacion = {
    libroIndex: null,
    capituloNum: null
};

// Obtener el libro y capítulo seleccionado actualmente
export function obtenerSeleccion() {
    return { ...estadoNavegacion };
}

// Configurar la navegación en el DOM
export function inicializarNavegacion() {
    const librosBtn = document.getElementById('libros-btn');
    const librosPanel = document.getElementById('libros-panel');
    const librosContainer = document.getElementById('libros-container');
    const capitulosBtn = document.getElementById('capitulos-btn');
    const capitulosPanel = document.getElementById('capitulos-panel');
    const capitulosContainer = document.getElementById('capitulos-container');
    const contenedorVersos = document.querySelector('.versos');

    // Función para cargar libros
    function cargarLibros() {
        if (!hayDatosCargados()) {
            librosBtn.textContent = 'Cargando...';
            return;
        }
        librosBtn.textContent = 'Selecciona un libro';
        librosBtn.disabled = false;
        renderizarLibros(librosPanel, (index, nombre) => {
            seleccionarLibro(index, nombre);
        });
    }

    // Función para seleccionar un libro
    function seleccionarLibro(index, nombre) {
        estadoNavegacion.libroIndex = index;
        estadoNavegacion.capituloNum = null;
        librosBtn.textContent = nombre;
        limpiarVersiculos(contenedorVersos);
        capitulosBtn.textContent = 'Selecciona un capítulo';

        marcarSeleccionado('.libro-opcion', index);
        cerrarPaneles();

        // Cargar capítulos
        if (hayDatosCargados()) {
            renderizarCapitulos(index, capitulosPanel, (capituloNum) => {
                seleccionarCapitulo(capituloNum);
            });
            capitulosBtn.disabled = false;
        }
    }

    // Función para seleccionar un capítulo
    function seleccionarCapitulo(capituloNum) {
        estadoNavegacion.capituloNum = capituloNum;
        capitulosBtn.textContent = `${capituloNum}`;
        
        marcarSeleccionado('.capitulo-opcion', capituloNum);
        cerrarPaneles();

        // Renderizar versículos
        if (hayDatosCargados()) {
            renderizarVersiculos(
                estadoNavegacion.libroIndex,
                capituloNum,
                contenedorVersos
            );
        }
    }

    // Cerrar paneles desplegables
    function cerrarPaneles() {
        librosPanel.classList.remove('open');
        librosBtn.classList.remove('active');
        capitulosPanel.classList.remove('open');
        capitulosBtn.classList.remove('active');
    }

    // === EVENTOS ===

    // Botón de libros
    librosBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (librosBtn.disabled) return;
        
        if (!hayDatosCargados()) {
            librosBtn.textContent = 'Error: sin datos';
            return;
        }

        const estaAbierto = librosPanel.classList.contains('open');
        if (!estaAbierto) {
            capitulosPanel.classList.remove('open');
            capitulosBtn.classList.remove('active');
            // Recargar libros por si acaso
            renderizarLibros(librosPanel, (index, nombre) => {
                seleccionarLibro(index, nombre);
            });
        }
        librosPanel.classList.toggle('open', !estaAbierto);
        librosBtn.classList.toggle('active', !estaAbierto);
    });

    // Botón de capítulos
    capitulosBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (capitulosBtn.disabled) return;
        if (estadoNavegacion.libroIndex === null) return;

        if (!hayDatosCargados()) return;

        const estaAbierto = capitulosPanel.classList.contains('open');
        if (!estaAbierto) {
            librosPanel.classList.remove('open');
            librosBtn.classList.remove('active');
            // Recargar capítulos
            renderizarCapitulos(
                estadoNavegacion.libroIndex,
                capitulosPanel,
                (capituloNum) => {
                    seleccionarCapitulo(capituloNum);
                }
            );
        }
        capitulosPanel.classList.toggle('open', !estaAbierto);
        capitulosBtn.classList.toggle('active', !estaAbierto);
    });

    // Cerrar paneles al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (librosContainer && !librosContainer.contains(e.target)) {
            librosPanel.classList.remove('open');
            librosBtn.classList.remove('active');
        }
        if (capitulosContainer && !capitulosContainer.contains(e.target)) {
            capitulosPanel.classList.remove('open');
            capitulosBtn.classList.remove('active');
        }
    });

    // Exponer funciones para reiniciar
    return {
        cargarLibros,
        seleccionarLibro,
        seleccionarCapitulo,
        cerrarPaneles,
        // Restaurar selección al cambiar de versión
        restaurarSeleccion: (libroIndex, capituloNum) => {
            if (libroIndex !== null && capituloNum !== null) {
                const datos = obtenerDatos();
                if (datos && datos[libroIndex]) {
                    const libro = datos[libroIndex];
                    const capituloExiste = libro.c.find(cap => cap._n == capituloNum);
                    if (capituloExiste) {
                        estadoNavegacion.libroIndex = libroIndex;
                        estadoNavegacion.capituloNum = capituloNum;
                        librosBtn.textContent = libro._n;
                        renderizarCapitulos(libroIndex, capitulosPanel, (cap) => {
                            seleccionarCapitulo(cap);
                        });
                        capitulosBtn.disabled = false;
                        setTimeout(() => {
                            capitulosBtn.textContent = capituloNum;
                            renderizarVersiculos(libroIndex, capituloNum, contenedorVersos);
                            marcarSeleccionado('.capitulo-opcion', capituloNum);
                        }, 50);
                        return true;
                    }
                }
            }
            return false;
        }
    };
}