//=========================================
// === ORQUESTADOR DE LECTURA BÍBLICA ===
//=========================================
// Responsabilidad:
// - Orquestar los módulos: cargador, renderizador, navegador
// - Conectar con estadoGlobal para cambios de versión
// - Punto de entrada principal para la funcionalidad de lectura

//=========================================
// === ORQUESTADOR DE LECTURA BIBLICA ===
//=========================================

import { cargarVersion, obtenerDatos } from './cargador.js';
import { renderizarVersiculos, limpiarVersiculos, initDelegacionVersiculos } from './renderizador.js';
import { inicializarNavegacion, obtenerSeleccion } from './navegador.js';
import { cargarVersionGuardada, suscribirCambioVersion } from '../estadoGlobal.js';

let navegador = null;

export function inicializarBiblia() {
    navegador = inicializarNavegacion();

    const contenedorVersos = document.querySelector('.versos');
    if (contenedorVersos) {
        initDelegacionVersiculos(contenedorVersos);
    }

    // Cargar versión guardada
    const estado = cargarVersionGuardada();
    console.log('Versión guardada al iniciar:', estado.rutaVersion);
    
    // Forzar actualización del select
    const select = document.getElementById('menu-versiones');
    if (select && estado.rutaVersion) {
        select.value = estado.rutaVersion;
        console.log('Select actualizado a:', select.value);
    }
    
    cargarVersionYRenderizar(estado.rutaVersion);

    suscribirCambioVersion((nuevoEstado) => {
        cargarVersionYRenderizar(nuevoEstado.rutaVersion);
    });
}

function cargarVersionYRenderizar(ruta) {
    const contenedorVersos = document.querySelector('.versos');
    
    cargarVersion(ruta)
        .then(() => {
            const seleccion = obtenerSeleccion();
            const restaurado = navegador.restaurarSeleccion(
                seleccion.libroIndex,
                seleccion.capituloNum
            );

            if (!restaurado) {
                navegador.cargarLibros();
            }
        })
        .catch(error => {
            console.error('Error al cargar la versión:', error);
            limpiarVersiculos(contenedorVersos);
            const librosBtn = document.getElementById('libros-btn');
            if (librosBtn) {
                librosBtn.textContent = 'Error al cargar';
                librosBtn.disabled = true;
            }
            mostrarNotificacion('Error al cargar la versión');
        });
}

function mostrarNotificacion(mensaje) {
    const notificacionExistente = document.querySelector('.notificacion-flotante');
    if (notificacionExistente) {
        notificacionExistente.remove();
    }

    const notificacion = document.createElement('div');
    notificacion.className = 'notificacion-flotante';
    notificacion.textContent = mensaje;
    
    Object.assign(notificacion.style, {
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: '#2d2d2d',
        color: '#ffffff',
        padding: '12px 24px',
        borderRadius: '8px',
        fontFamily: 'Montserrat, sans-serif',
        fontSize: '14px',
        zIndex: '9999',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        opacity: '0',
        transition: 'opacity 0.3s ease-in-out',
        maxWidth: '90%',
        textAlign: 'center'
    });

    document.body.appendChild(notificacion);

    requestAnimationFrame(() => {
        notificacion.style.opacity = '1';
    });

    setTimeout(() => {
        notificacion.style.opacity = '0';
        setTimeout(() => {
            if (notificacion.parentNode) {
                notificacion.remove();
            }
        }, 300);
    }, 3000);
}
