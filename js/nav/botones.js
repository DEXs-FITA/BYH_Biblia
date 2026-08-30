//=========================================
// === FUNCONES DE BOTONES HEADER ===
//=========================================

export function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
    } else if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
    }
}

document.addEventListener('fullscreenchange', function() {
    const btn = document.getElementById('fullscreenBtn');
    if (btn) {
        if (document.fullscreenElement) {
            btn.classList.add('active');
            btn.textContent = '[ ]';
        } else {
            btn.classList.remove('active');
            btn.textContent = '⛶';
        }
    }
});

export function cerrarVentana() {
    try {
        window.close();
    } catch (_) {}
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

export function initThemeToggle() {
    const toggle = document.getElementById('themeToggle');
    if (!toggle) {
        return;
    }

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
        toggle.checked = true;
    }

    toggle.addEventListener('change', function() {
        if (this.checked) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    });
}