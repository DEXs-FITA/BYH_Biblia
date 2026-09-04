//=========================================
// === OPCIONES ===
//=========================================

import { abrirModal } from '../modulesBiblia/modalGeneral.js';
import { cambiarVersion, guardarFondo, obtenerFondo, guardarColorFondo, obtenerColorFondo } from '../estadoGlobal.js';
import { seleccionarFondo, aplicarFondo } from '../modulesBiblia/modal.js';
import imageLoader from '../imageLoader.js';

export function inicializarOpciones() {
    const btn = document.getElementById('btnopciones');
    if (btn) {
        btn.addEventListener('click', () => {
            abrirModal('includes/opciones.html');
            setTimeout(configurarOpcionesDelModal, 500);
        });
    }

    document.addEventListener('click', (e) => {
        if (e.target.id === 'btn-cambiar-version') {
            const select = document.getElementById('menu-versiones');
            if (select) {
                cambiarVersion(select.value);
                mostrarNotificacion('Version cargada correctamente');
            }
        }
    });
}

function configurarOpcionesDelModal() {
    configurarMiniaturas();
    configurarBotonFondo();
    cargarImagenesOpciones();
}

function cargarImagenesOpciones() {
    const imagenes = document.querySelectorAll('.fondo-item img[data-src]');
    
    if (imagenes.length > 0) {
        imagenes.forEach(img => {
            imageLoader.loadImageDirect(img);
        });
    }
}

function configurarMiniaturas() {
    const items = document.querySelectorAll('.fondo-item');
    
    if (items.length === 0) {
        setTimeout(configurarMiniaturas, 300);
        return;
    }
    
    items.forEach(item => {
        item.removeEventListener('click', manejarClickMiniatura);
        item.addEventListener('click', manejarClickMiniatura);
    });
    
    const rutaGuardada = obtenerFondo();
    const colorGuardado = obtenerColorFondo();
    
    items.forEach(item => {
        item.classList.remove('seleccionado');
        const tipo = item.dataset.tipo || 'imagen';
        if (tipo === 'color') {
            const colorId = item.dataset.id || 'default';
            // Verificar si es el color por defecto
            if (colorId === 'default' && !colorGuardado) {
                item.classList.add('seleccionado');
            } else if (colorGuardado && item.dataset.color === colorGuardado) {
                item.classList.add('seleccionado');
            }
        } else if (tipo === 'imagen') {
            const img = item.querySelector('img');
            if (img) {
                const ruta = img.dataset.ruta || img.src;
                if (ruta === rutaGuardada) {
                    item.classList.add('seleccionado');
                }
            }
        }
    });
    
    if (!document.querySelector('.fondo-item.seleccionado')) {
        const defaultItem = document.querySelector('.fondo-item[data-id="default"]');
        if (defaultItem) {
            defaultItem.classList.add('seleccionado');
            guardarFondo(null);
            guardarColorFondo(null);
        }
    }
}

function manejarClickMiniatura(event) {
    const item = event.currentTarget;
    const items = document.querySelectorAll('.fondo-item');
    
    items.forEach(el => el.classList.remove('seleccionado'));
    item.classList.add('seleccionado');
    
    const tipo = item.dataset.tipo || 'imagen';
    if (tipo === 'color') {
        const colorId = item.dataset.id || 'default';
        const color = item.dataset.color || 'var(--principal-primario)';
        
        if (colorId === 'default') {
            // Seleccionar color por defecto
            guardarFondo(null);
            guardarColorFondo(null);
            aplicarFondo();
        } else {
            // Seleccionar color personalizado
            guardarFondo(null);  // Limpiar imagen
            guardarColorFondo(color);  // Guardar el color real
            aplicarColorFondo(color);
        }
    } else {
        const img = item.querySelector('img');
        if (img) {
            const ruta = img.dataset.ruta || img.src;
            guardarColorFondo(null);  // Limpiar color
            seleccionarFondo('imagen', ruta);
        }
    }
}

function aplicarColorFondo(color) {
    const contenedor = document.querySelector('.contenedor-modal');
    if (contenedor) {
        contenedor.style.backgroundImage = 'none';
        contenedor.style.backgroundColor = color;
    }
    // Guardar el color en estado global
    guardarColorFondo(color);
}

function configurarBotonFondo() {
    const btn = document.getElementById('btn-cambiar-fondo');
    if (btn) {
        btn.removeEventListener('click', manejarClickCambiarFondo);
        btn.addEventListener('click', manejarClickCambiarFondo);
    } else {
        setTimeout(configurarBotonFondo, 300);
    }
}

function manejarClickCambiarFondo() {
    aplicarFondo();
    mostrarNotificacion('Fondo cambiado correctamente');
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