// =======================================================
// == ATAJOS DE TECLADO ==
// =======================================================

let modoNavegacionVersiculos = false;
let contenedorVersosCache = null;

export function inicializarAtajos() {
    document.addEventListener('keydown', manejarAtajos);
    // Cachear referencia al contenedor
    contenedorVersosCache = document.querySelector('.versos');
}

export function limpiarAtajos() {
    document.removeEventListener('keydown', manejarAtajos);
    contenedorVersosCache = null;
}

function manejarAtajos(e) {
    const modalVisible = !!document.querySelector('.contenedor-modal.visible');

    // Shift+V: activar/desactivar navegacion entre versiculos
    if (e.shiftKey && (e.key === 'V' || e.key === 'v')) {
        e.preventDefault();
        if (modalVisible || document.querySelector('.libros-panel.open, .capitulos-panel.open')) {
            return;
        }
        modoNavegacionVersiculos = !modoNavegacionVersiculos;
        
        if (!contenedorVersosCache) {
            contenedorVersosCache = document.querySelector('.versos');
        }
        
        if (modoNavegacionVersiculos) {
            const primerVersiculo = contenedorVersosCache?.querySelector('.versiculo');
            if (primerVersiculo) primerVersiculo.focus();
        } else {
            if (document.activeElement && contenedorVersosCache?.contains(document.activeElement)) {
                document.activeElement.blur();
            }
        }
        return;
    }

    // MODAL ABIERTO
    if (modalVisible) {
        if (e.ctrlKey && (e.key === '+' || e.key === '=')) {
            e.preventDefault();
            document.querySelector('#zoom-mas')?.click();
            return;
        }
        if (e.ctrlKey && e.key === '-') {
            e.preventDefault();
            document.querySelector('#zoom-menos')?.click();
            return;
        }
        if (e.key === 'Escape') {
            e.preventDefault();
            document.querySelector('#cerrar')?.click();
            return;
        }
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            document.querySelector('#atras')?.click();
            return;
        }
        if (e.key === 'ArrowRight') {
            e.preventDefault();
            document.querySelector('#siguiente')?.click();
            return;
        }
        return;
    }

    // MODO NAVEGACION VERSICULOS
    if (modoNavegacionVersiculos) {
        if (!contenedorVersosCache) {
            contenedorVersosCache = document.querySelector('.versos');
        }
        
        const focusedEl = document.activeElement;

        if (contenedorVersosCache && contenedorVersosCache.contains(focusedEl)) {
            const versiculos = [...contenedorVersosCache.querySelectorAll('.versiculo')];

            if (e.key === 'Enter') {
                e.preventDefault();
                focusedEl.click();
                return;
            }

            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                e.preventDefault();
                const idx = versiculos.indexOf(focusedEl);
                if (idx === -1) return;
                const delta = e.key === 'ArrowDown' ? 1 : -1;
                const nuevoIdx = idx + delta;
                if (nuevoIdx >= 0 && nuevoIdx < versiculos.length) {
                    versiculos[nuevoIdx].focus();
                    versiculos[nuevoIdx].scrollIntoView({ block: 'nearest' });
                }
                return;
            }

            if (e.key === 'Escape') {
                e.preventDefault();
                modoNavegacionVersiculos = false;
                focusedEl.blur();
                return;
            }
        }
        return;
    }

    // PANELES
    if (e.key === 'Escape') {
        const panelAbierto = document.querySelector('.libros-panel.open, .capitulos-panel.open');
        if (panelAbierto) {
            e.preventDefault();
            const btnId = panelAbierto.id === 'libros-panel' ? 'libros-btn' : 'capitulos-btn';
            document.getElementById(btnId)?.click();
        }
        return;
    }

    if (e.shiftKey && (e.key === 'L' || e.key === 'l')) {
        e.preventDefault();
        togglePanel('libros');
        return;
    }

    if (e.shiftKey && (e.key === 'C' || e.key === 'c')) {
        e.preventDefault();
        togglePanel('capitulos');
        return;
    }

    manejarNavegacionFlechas(e);
}

function togglePanel(tipo) {
    const btnId = tipo === 'libros' ? 'libros-btn' : 'capitulos-btn';
    const panelId = tipo === 'libros' ? 'libros-panel' : 'capitulos-panel';
    const btn = document.getElementById(btnId);
    const panel = document.getElementById(panelId);
    if (!btn || !panel) return;

    btn.click();

    if (panel.classList.contains('open')) {
        enfocarElementoActivo(panel, tipo);
    }
}

function enfocarElementoActivo(panel, tipo) {
    const selector = tipo === 'libros' ? '.libro-opcion' : '.capitulo-opcion';
    let seleccionado = panel.querySelector(`${selector}.seleccionado`);
    if (!seleccionado) {
        seleccionado = panel.querySelector(selector);
    }
    if (seleccionado) {
        seleccionado.focus();
        seleccionado.scrollIntoView({ block: 'nearest' });
    }
}

function manejarNavegacionFlechas(e) {
    const teclasValidas = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter'];
    if (!teclasValidas.includes(e.key)) return;

    const panelActivo = document.querySelector('.libros-panel.open, .capitulos-panel.open');
    if (!panelActivo) return;

    const focusedEl = document.activeElement;
    if (!panelActivo.contains(focusedEl)) return;

    const esLibros = panelActivo.id === 'libros-panel';
    const botones = Array.from(
        panelActivo.querySelectorAll(esLibros ? '.libro-opcion' : '.capitulo-opcion')
    );
    if (botones.length === 0) return;

    if (e.key === 'Enter') {
        e.preventDefault();
        focusedEl.click();
        return;
    }

    const filasMap = new Map();
    for (const btn of botones) {
        const top = btn.offsetTop;
        let foundKey = null;
        for (const key of filasMap.keys()) {
            if (Math.abs(key - top) <= 1) {
                foundKey = key;
                break;
            }
        }
        const actualKey = foundKey !== null ? foundKey : top;
        if (!filasMap.has(actualKey)) filasMap.set(actualKey, []);
        filasMap.get(actualKey).push(btn);
    }

    const filasOrdenadas = Array.from(filasMap.entries())
        .sort((a, b) => a[0] - b[0])
        .map(([_, botonesFila]) => botonesFila.sort((a, b) => a.offsetLeft - b.offsetLeft));

    let filaActual = -1;
    let colActual = -1;
    for (let i = 0; i < filasOrdenadas.length; i++) {
        const colIndex = filasOrdenadas[i].indexOf(focusedEl);
        if (colIndex !== -1) {
            filaActual = i;
            colActual = colIndex;
            break;
        }
    }
    if (filaActual === -1) return;

    let nuevaFila = filaActual;
    let nuevaCol = colActual;

    switch (e.key) {
        case 'ArrowUp':
            if (filaActual > 0) {
                nuevaFila = filaActual - 1;
                if (nuevaCol >= filasOrdenadas[nuevaFila].length) {
                    nuevaCol = filasOrdenadas[nuevaFila].length - 1;
                }
            }
            break;

        case 'ArrowDown':
            if (filaActual < filasOrdenadas.length - 1) {
                nuevaFila = filaActual + 1;
                if (nuevaCol >= filasOrdenadas[nuevaFila].length) {
                    nuevaCol = filasOrdenadas[nuevaFila].length - 1;
                }
            }
            break;

        case 'ArrowLeft':
            if (colActual > 0) {
                nuevaCol = colActual - 1;
            }
            break;

        case 'ArrowRight':
            if (colActual < filasOrdenadas[filaActual].length - 1) {
                nuevaCol = colActual + 1;
            }
            break;

        default:
            return;
    }

    const destino = filasOrdenadas[nuevaFila]?.[nuevaCol];
    if (destino && destino !== focusedEl) {
        e.preventDefault();
        destino.focus();
        destino.scrollIntoView({ block: 'nearest' });
    }
}