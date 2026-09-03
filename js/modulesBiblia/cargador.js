//=========================================
// === CARGADOR DE DATOS BÍBLICOS ===
//=========================================
// Responsabilidad: 
// - Hacer fetch de los archivos JSON
// - Almacenar los datos en memoria
// - Notificar cuando los datos están listos

let datosBiblia = null;

// Obtener los datos de la Biblia
export function obtenerDatos() {
    return datosBiblia;
}

// Cargar una versión desde su ruta
export function cargarVersion(ruta) {
    return fetch(ruta)
        .then(res => {
            if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
            return res.json();
        })
        .then(data => {
            datosBiblia = data.bible.b;
            return datosBiblia;
        })
        .catch(error => {
            console.error('Error cargando versión:', error);
            throw error;
        });
}

// Verificar si hay datos cargados
export function hayDatosCargados() {
    return datosBiblia !== null;
}

// Reiniciar los datos (útil al cambiar de versión)
export function reiniciarDatos() {
    datosBiblia = null;
}