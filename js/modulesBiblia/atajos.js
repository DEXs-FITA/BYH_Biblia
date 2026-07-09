// ======================================
// === ATAJOS DE TECLADO ===
// ======================================

let modoNavegacionVersiculos = false;   // Estado del modo de navegación por versículos

export function inicializarAtajos() {
  document.addEventListener('keydown', manejarAtajos);
}

function manejarAtajos(e) {
  const modalVisible = !!document.querySelector('.contenedor-modal.visible');

  // ----- Shift+V: activar/desactivar navegación entre versículos -----
  if (e.shiftKey && (e.key === 'V' || e.key === 'v')) {
    e.preventDefault();
    // No se activa si hay modal o un panel de libros/capítulos abierto
    if (modalVisible || document.querySelector('.libros-panel.open, .capitulos-panel.open')) {
      return;
    }
    modoNavegacionVersiculos = !modoNavegacionVersiculos;
    const contenedorVersos = document.querySelector('.versos');
    if (modoNavegacionVersiculos) {
      // Enfocar el primer versículo (requiere tabindex="0" en los .versiculo)
      const primerVersiculo = contenedorVersos?.querySelector('.versiculo');
      if (primerVersiculo) primerVersiculo.focus();
    } else {
      // Desactivar modo: quitar foco si estaba en la lista
      if (document.activeElement && contenedorVersos?.contains(document.activeElement)) {
        document.activeElement.blur();
      }
    }
    return;
  }

  // ---------- MODAL ABIERTO ----------
  if (modalVisible) {
    // Zoom con Ctrl + / Ctrl -
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
    // Cerrar modal con Escape
    if (e.key === 'Escape') {
      e.preventDefault();
      document.querySelector('#cerrar')?.click();
      return;
    }
    // Navegación entre versículos en el modal con ← →
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

  // ---------- MODO NAVEGACIÓN VERSÍCULOS (Shift+V activado) ----------
  if (modoNavegacionVersiculos) {
    const contenedor = document.querySelector('.versos');
    const focusedEl = document.activeElement;

    // Solo actúa si el foco está dentro del contenedor de versículos
    if (contenedor && contenedor.contains(focusedEl)) {
      const versiculos = [...contenedor.querySelectorAll('.versiculo')];

      if (e.key === 'Enter') {
        e.preventDefault();
        focusedEl.click(); // Abre el modal con mostrarVersiculo
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

      // Escape para salir del modo de navegación
      if (e.key === 'Escape') {
        e.preventDefault();
        modoNavegacionVersiculos = false;
        focusedEl.blur();
        return;
      }
    }
    // Si el modo está activo pero el foco no está en la lista, ignorar las flechas
    return;
  }

  // ---------- SIN MODAL NI MODO VERSÍCULOS: paneles ----------
  // Cerrar panel con Escape
  if (e.key === 'Escape') {
    const panelAbierto = document.querySelector('.libros-panel.open, .capitulos-panel.open');
    if (panelAbierto) {
      e.preventDefault();
      const btnId = panelAbierto.id === 'libros-panel' ? 'libros-btn' : 'capitulos-btn';
      document.getElementById(btnId)?.click();
    }
    return;
  }

  // Toggle panel de libros
  if (e.shiftKey && (e.key === 'L' || e.key === 'l')) {
    e.preventDefault();
    togglePanel('libros');
    return;
  }

  // Toggle panel de capítulos
  if (e.shiftKey && (e.key === 'C' || e.key === 'c')) {
    e.preventDefault();
    togglePanel('capitulos');
    return;
  }

  // Navegación con flechas dentro de un panel abierto (libros o capítulos)
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

  // Construir cuadrícula real usando offsetTop y offsetLeft
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