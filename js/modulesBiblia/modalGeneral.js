// js/modulesBiblia/modalGeneral.js
let modalActivo = false;

async function obtenerContenido(ruta) {
    try {
        const response = await fetch(ruta);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.text();
    } catch (_) {
        return `<div class="error-modal" style="text-align:center;padding:40px 20px;">
            <h1 style="color:#ff6b6b;">Error al cargar contenido</h1>
            <p style="color:#b0b0b0;">No se pudo cargar la informacion.</p>
        </div>`;
    }
}

function crearModal(contenidoHTML) {
    const template = document.getElementById('modal-general');
    if (!template) {
        console.error('Template modal-general no encontrado');
        return null;
    }
    
    const clon = template.content.cloneNode(true);
    const contenedor = clon.querySelector('.contenedor-general');
    if (!contenedor) {
        console.error('contenedor-general no encontrado');
        return null;
    }
    
    // CREAR LA ESTRUCTURA DEL MODAL
    const modal = document.createElement('div');
    modal.className = 'modal';
    
    const btnCerrar = document.createElement('button');
    btnCerrar.className = 'btn-cerrar-modal';
    btnCerrar.textContent = '✕';
    btnCerrar.type = 'button';
    
    modal.appendChild(btnCerrar);
    
    // INSERTAR EL INCLUDE (que ya es un div) DIRECTAMENTE EN EL MODAL
    modal.insertAdjacentHTML('beforeend', contenidoHTML);
    
    contenedor.appendChild(modal);
    
    return { contenedor, btnCerrar };
}

function cerrarModal(contenedor) {
    if (!modalActivo) return;
    contenedor.classList.remove('activo');
    setTimeout(() => {
        if (contenedor.parentNode) contenedor.remove();
        modalActivo = false;
        document.body.style.overflow = '';
    }, 300);
}

export async function abrirModal(ruta) {
    if (modalActivo) return;
    
    const contenido = await obtenerContenido(ruta);
    const modalData = crearModal(contenido);
    
    if (!modalData) {
        console.error('Error al crear modal');
        return;
    }
    
    const { contenedor, btnCerrar } = modalData;
    
    document.body.appendChild(contenedor);
    modalActivo = true;
    document.body.style.overflow = 'hidden';
    
    function cerrar() {
        cerrarModal(contenedor);
        document.removeEventListener('keydown', handleEsc);
    }
    
    if (btnCerrar) {
        btnCerrar.addEventListener('click', cerrar);
    }
    
    contenedor.addEventListener('click', (e) => {
        if (e.target === contenedor) cerrar();
    });
    
    const handleEsc = (e) => {
        if (e.key === 'Escape' && modalActivo) cerrar();
    };
    document.addEventListener('keydown', handleEsc);
    
    requestAnimationFrame(() => contenedor.classList.add('activo'));
}