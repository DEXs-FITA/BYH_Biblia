//=========================================
// === ESTADO GLOBAL ===
//=========================================

const ESTADO = {
    versionActual: 'RV1960',
    rutaVersion: 'recursos/versiones/RV1960.json',
    versionCorto: 'RVR1960',
    fondoRuta: null,
    colorFondo: null
};

const suscriptores = [];

function obtenerDataIdDesdeHTML(rutaVersion) {
    const select = document.getElementById('menu-versiones');
    if (!select) return null;
    
    const options = select.querySelectorAll('option');
    for (const option of options) {
        if (option.value === rutaVersion || option.value.includes(rutaVersion.replace('recursos/versiones/', '').replace('.json', ''))) {
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
        console.log('Versión en localStorage:', guardada);
        
        if (guardada) {
            const dataId = obtenerDataIdDesdeHTML(guardada);
            if (dataId) {
                ESTADO.versionActual = guardada.split('/').pop().replace('.json', '');
                ESTADO.rutaVersion = guardada;
                ESTADO.versionCorto = dataId;
                console.log('Versión restaurada con data-id:', dataId);
            } else {
                // Fallback: usar el nombre del archivo
                const nombreArchivo = guardada.split('/').pop().replace('.json', '');
                ESTADO.versionActual = nombreArchivo;
                ESTADO.rutaVersion = guardada;
                ESTADO.versionCorto = nombreArchivo;
                console.log('Fallback: versión restaurada como', nombreArchivo);
            }
            return { ...ESTADO };
        }
    } catch (_) {
        console.warn('Error cargando versión guardada');
    }

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
    console.log('Versión guardada en localStorage:', nuevaRuta);
    
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

// ==========================================
// FUNCIONES PARA EL COLOR DEL FONDO
// ==========================================

export function guardarColorFondo(color) {
    ESTADO.colorFondo = color;
    try {
        localStorage.setItem('colorFondo', color || '');
    } catch (e) {
        console.warn('Error guardando color:', e);
    }
}

export function cargarColorFondo() {
    try {
        const guardada = localStorage.getItem('colorFondo');
        if (guardada) {
            ESTADO.colorFondo = guardada || null;
            return ESTADO.colorFondo;
        }
    } catch (e) {
        console.warn('Error cargando color:', e);
    }
    return null;
}

export function obtenerColorFondo() {
    if (ESTADO.colorFondo === undefined) {
        cargarColorFondo();
    }
    return ESTADO.colorFondo;
}

cargarFondo();
cargarColorFondo();
