//=========================================
// === FUNCONES DE BOTONES HEADER ===
//=========================================

// -- Boton Maximizar Minimizar --
// ----------------------------------------
export function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

// Escuchar cambios de estado para actualizar el botón
document.addEventListener('fullscreenchange', function() {
    const btn = document.getElementById('fullscreenBtn');
    if (btn) {
        if (document.fullscreenElement) {
            btn.classList.add('active');
            // Cambiar el ícono cuando está maximizado
            btn.innerHTML = '&#128469;';
        } else {
            btn.classList.remove('active');
            // Restaurar el ícono cuando está minimizado
            btn.innerHTML = '&#128470;';
        }
    }
});

// -- Boton Cerrar --
// ----------------------------------------
export function cerrarVentana() {
    try {
        window.close();
    } catch (e) {
        alert('No se puede cerrar la ventana. Por favor, cierra la pestaña manualmente.');
    }
}

export function inicializarBotonCerrar() {
    const boton = document.querySelector('.btn-cerrar');
    if (boton) {
        boton.addEventListener('click', function(e) {
            e.preventDefault();
            cerrarVentana();
        });
        boton.title = 'Cerrar ventana';
    }
}

// -- Interruptor Claro Oscuro --
// ----------------------------------------
export function initThemeToggle() {
    const toggle = document.getElementById('themeToggle');
    if (!toggle) {
        console.warn('No se encontró el interruptor con id "themeToggle"');
        return;
    }

    // 1. Recuperar preferencia guardada en localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
        toggle.checked = true;   // Marcar el switch como activado
    }

    // 2. Escuchar el cambio del interruptor
    toggle.addEventListener('change', function () {
        if (this.checked) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    });
}