// Módulo para notificaciones flotantes unificadas
// Reutilizable en toda la aplicación

let notificacionTimeout = null;
let notificacionElement = null;

export function mostrarNotificacion(mensaje, duracion = 3000) {
    // Eliminar notificación existente
    if (notificacionElement) {
        if (notificacionElement.parentNode) {
            notificacionElement.remove();
        }
        notificacionElement = null;
    }
    
    if (notificacionTimeout) {
        clearTimeout(notificacionTimeout);
        notificacionTimeout = null;
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
    notificacionElement = notificacion;

    requestAnimationFrame(() => {
        notificacion.style.opacity = '1';
    });

    notificacionTimeout = setTimeout(() => {
        notificacion.style.opacity = '0';
        setTimeout(() => {
            if (notificacion.parentNode) {
                notificacion.remove();
            }
            notificacionElement = null;
            notificacionTimeout = null;
        }, 300);
    }, duracion);
}