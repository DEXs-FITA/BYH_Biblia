// =======================================================
// == MODULO: ACERCA DE (Modal General) ==
// =======================================================

let modalActivo = false;

async function cargarContenidoAcercaDe() {
    try {
        const response = await fetch('includes/acercade.html');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.text();
    } catch (_) {
        return `
            <div class="sec-acerdade" style="text-align:center;padding:40px 20px;">
                <h1 style="color:#ff6b6b;">Error al cargar contenido</h1>
                <p style="color:#b0b0b0;">No se pudo cargar la informacion de "Acerca de".</p>
            </div>
        `;
    }
}

export async function mostrarModalAcercaDe() {
    if (modalActivo) {
        return;
    }

    const template = document.getElementById('modal-general');
    if (!template) {
        return;
    }

    const modalContainer = template.content.cloneNode(true);
    const contenedorGeneral = modalContainer.querySelector('.contenedor-general');

    if (!contenedorGeneral) {
        return;
    }

    const modalInterno = document.createElement('div');
    modalInterno.className = 'modal';

    const btnCerrar = document.createElement('button');
    btnCerrar.className = 'btn-cerrar-modal';
    btnCerrar.textContent = '✕';
    btnCerrar.type = 'button';

    const contenidoWrapper = document.createElement('div');
    contenidoWrapper.className = 'contenido-modal';

    const contenidoHTML = await cargarContenidoAcercaDe();
    contenidoWrapper.innerHTML = contenidoHTML;

    modalInterno.appendChild(btnCerrar);
    modalInterno.appendChild(contenidoWrapper);
    contenedorGeneral.appendChild(modalInterno);

    document.body.appendChild(contenedorGeneral);
    modalActivo = true;

    btnCerrar.addEventListener('click', () => {
        cerrarModalAcercaDe(contenedorGeneral);
    });

    contenedorGeneral.addEventListener('click', (e) => {
        if (e.target === contenedorGeneral) {
            cerrarModalAcercaDe(contenedorGeneral);
        }
    });

    const handleEsc = (e) => {
        if (e.key === 'Escape' && modalActivo) {
            cerrarModalAcercaDe(contenedorGeneral);
            document.removeEventListener('keydown', handleEsc);
        }
    };
    document.addEventListener('keydown', handleEsc);

    requestAnimationFrame(() => {
        contenedorGeneral.classList.add('activo');
    });

    document.body.style.overflow = 'hidden';
}

function cerrarModalAcercaDe(contenedorGeneral) {
    if (!modalActivo) {
        return;
    }

    contenedorGeneral.classList.remove('activo');

    setTimeout(() => {
        if (contenedorGeneral.parentNode) {
            contenedorGeneral.parentNode.removeChild(contenedorGeneral);
        }
        modalActivo = false;
        document.body.style.overflow = '';
    }, 300);
}

export function inicializarAcercaDe() {
    const btnAcercaDe = document.getElementById('btnacercade');
    if (btnAcercaDe) {
        btnAcercaDe.addEventListener('click', mostrarModalAcercaDe);
    }
}