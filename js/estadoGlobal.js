//=========================================
// === ESTADO GLOBAL ===
//=========================================

const ESTADO = {
    versionActual: 'RV1960',
    rutaVersion: '/recursos/versiones/RV1960.json',
    versionCorto: 'RVR1960',
    fondoRuta: null
};

const suscriptores = [];

function obtenerDataIdDesdeHTML(rutaVersion) {
    const select = document.getElementById('menu-versiones');
    if (!select) return null;
    
    const options = select.querySelectorAll('option');
    for (const option of options) {
        if (option.value === rutaVersion || option.value.includes(rutaVersion.replace('/recursos/versiones/', '').replace('.json', ''))) {
            return option.dataset.id || null;
        }
    }
    return null;
}

function obtenerVersionDefault() {
    const select = document.getElementById('menu-versiones');
    if (!select) return null;
    
    const primeraOpcion = select.querySelector('option');
    if (primeraOpcion) {
        return {
            ruta: primeraOpcion.value,
            nombre: primeraOpcion.dataset.id || 'RVR60'
        };
    }
    return null;
}

export function cargarVersionGuardada() {
    try {
        const guardada = localStorage.getItem('biblia-version');
        if (guardada) {
            const dataId = obtenerDataIdDesdeHTML(guardada);
            if (dataId) {
                ESTADO.versionActual = guardada.split('/').pop().replace('.json', '');
                ESTADO.rutaVersion = guardada;
                ESTADO.versionCorto = dataId;
                return { ...ESTADO };
            }
        }
    } catch (_) {}

    const defaultVersion = obtenerVersionDefault();
    if (defaultVersion) {
        ESTADO.rutaVersion = defaultVersion.ruta;
        ESTADO.versionActual = defaultVersion.ruta.split('/').pop().replace('.json', '');
        ESTADO.versionCorto = defaultVersion.nombre;
    }
    
    return { ...ESTADO };
}

export function obtenerEstado() {
    return { ...ESTADO };
}

export function cambiarVersion(nuevaRuta) {
    const dataId = obtenerDataIdDesdeHTML(nuevaRuta);
    
    if (!dataId) {
        console.error('Version no encontrada en el HTML:', nuevaRuta);
        return;
    }
    
    const nombreVersion = nuevaRuta.split('/').pop().replace('.json', '');
    
    ESTADO.versionActual = nombreVersion;
    ESTADO.rutaVersion = nuevaRuta;
    ESTADO.versionCorto = dataId;
    
    localStorage.setItem('biblia-version', nuevaRuta);
    
    suscriptores.forEach(callback => callback({ ...ESTADO }));
}

export function suscribirCambioVersion(callback) {
    suscriptores.push(callback);
    return () => {
        const index = suscriptores.indexOf(callback);
        if (index !== -1) suscriptores.splice(index, 1);
    };
}

// ==========================================
// FUNCIONES PARA EL FONDO
// ==========================================

export function guardarFondo(ruta) {
    ESTADO.fondoRuta = ruta;
    try {
        localStorage.setItem('fondoRuta', ruta || '');
    } catch (e) {
        console.warn('Error guardando fondo:', e);
    }
}

export function cargarFondo() {
    try {
        const guardada = localStorage.getItem('fondoRuta');
        if (guardada) {
            ESTADO.fondoRuta = guardada || null;
            return ESTADO.fondoRuta;
        }
    } catch (e) {
        console.warn('Error cargando fondo:', e);
    }
    return null;
}

export function obtenerFondo() {
    if (ESTADO.fondoRuta === undefined) {
        cargarFondo();
    }
    return ESTADO.fondoRuta;
}

cargarFondo();