//=========================================
// === CARGA DE LISTAS ===
//=========================================
// La linea 5 depende de modulo: modal.js
import { mostrarVersiculo } from './modal.js';

export function inicializarBiblia() {
  // Libros
  const librosContainer = document.getElementById('libros-container');
  const librosBtn = document.getElementById('libros-btn');
  const librosPanel = document.getElementById('libros-panel');

  // Capítulos
  const capitulosContainer = document.getElementById('capitulos-container');
  const capitulosBtn = document.getElementById('capitulos-btn');
  const capitulosPanel = document.getElementById('capitulos-panel');

  const contenedorVersos = document.querySelector('.versos');
  let datosBiblia = null;
  let libroSeleccionadoIndex = null;

  // Carga inicial del JSON
  fetch('./recursos/versiones/RV1960.json')
    .then(res => {
      if (!res.ok) throw new Error('Error al cargar el JSON');
      return res.json();
    })
    .then(data => {
      datosBiblia = data.bible.b;
      poblarLibros();
      librosBtn.disabled = false;
      librosBtn.textContent = 'Selecciona un libro';
    })
    .catch(error => {
      console.error(error);
      librosBtn.disabled = false;
      librosBtn.textContent = 'Error al cargar';
    });

  // Poblar el panel de libros
  function poblarLibros() {
    librosPanel.innerHTML = '';
    datosBiblia.forEach((libro, index) => {
      const opcion = document.createElement('button');
      opcion.type = 'button';
      opcion.className = 'libro-opcion';
      opcion.textContent = libro._n;
      opcion.dataset.index = index;
      opcion.addEventListener('click', () => {
        seleccionarLibro(index, libro._n);
      });
      librosPanel.appendChild(opcion);
    });
  }

  // Selección de libro
  function seleccionarLibro(index, nombre) {
    libroSeleccionadoIndex = index;
    librosBtn.textContent = nombre;

    // Marcar como seleccionado
    document.querySelectorAll('.libro-opcion').forEach(btn => btn.classList.remove('seleccionado'));
    const opcionActiva = document.querySelector(`.libro-opcion[data-index="${index}"]`);
    if (opcionActiva) opcionActiva.classList.add('seleccionado');

    // Cerrar panel de libros
    librosPanel.classList.remove('open');
    librosBtn.classList.remove('active');

    // Cargar capítulos del libro seleccionado
    cargarCapitulos(index);
  }

  // Evento para abrir/cerrar panel de libros
  librosBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (librosBtn.disabled) return;
    const estaAbierto = librosPanel.classList.contains('open');
        // Cerrar panel de capitulos si estuviera abierto (para no solaparse)
      if (!estaAbierto) {
      capitulosPanel.classList.remove('open');
      capitulosBtn.classList.remove('active');
      }
    librosPanel.classList.toggle('open', !estaAbierto);
    librosBtn.classList.toggle('active', !estaAbierto);
  });

  // Cerrar panel de libros al hacer clic fuera
  document.addEventListener('click', (e) => {
    if (!librosContainer.contains(e.target)) {
      librosPanel.classList.remove('open');
      librosBtn.classList.remove('active');
    }
  });

  // -----------------------------------------------
  // LÓGICA DE CAPÍTULOS (PANEL PERSONALIZADO)
  // -----------------------------------------------

  function cargarCapitulos(libroIndex) {
    // Limpiar panel de capítulos y reiniciar botón
    capitulosPanel.innerHTML = '';
    capitulosBtn.textContent = 'Selecciona un capítulo';
    capitulosBtn.disabled = true;
    capitulosPanel.classList.remove('open');
    capitulosBtn.classList.remove('active');
    contenedorVersos.innerHTML = '';

    if (libroIndex === undefined || libroIndex === null) return;

    const libro = datosBiblia[libroIndex];
    if (!libro || !libro.c) return;

    // Poblar panel de capítulos con botones
    libro.c.forEach(cap => {
      const opcion = document.createElement('button');
      opcion.type = 'button';
      opcion.className = 'capitulo-opcion';
      opcion.textContent = `${cap._n}`;
      opcion.dataset.capitulo = cap._n;
      opcion.addEventListener('click', () => {
        seleccionarCapitulo(cap._n);
      });
      capitulosPanel.appendChild(opcion);
    });

    // Habilitar botón de capítulos
    capitulosBtn.disabled = false;
  }

  function seleccionarCapitulo(numCapitulo) {
    // Actualizar botón
    capitulosBtn.textContent = `${numCapitulo}`;

    // Marcar como seleccionado en el panel
    document.querySelectorAll('.capitulo-opcion').forEach(btn => btn.classList.remove('seleccionado'));
    const opcionActiva = document.querySelector(`.capitulo-opcion[data-capitulo="${numCapitulo}"]`);
    if (opcionActiva) opcionActiva.classList.add('seleccionado');

    // Cerrar panel
    capitulosPanel.classList.remove('open');
    capitulosBtn.classList.remove('active');

    // Cargar versículos
    cargarVersiculos(numCapitulo);
  }

  // Evento para abrir/cerrar panel de capítulos
  capitulosBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (capitulosBtn.disabled) return;
    const estaAbierto = capitulosPanel.classList.contains('open');
    // Cerrar panel de libros si estuviera abierto (para no solaparse)
      if (!estaAbierto) {
      librosPanel.classList.remove('open');
      librosBtn.classList.remove('active');
      }
    capitulosPanel.classList.toggle('open', !estaAbierto);
    capitulosBtn.classList.toggle('active', !estaAbierto);
  });

  // Cerrar panel de capítulos al hacer clic fuera
  document.addEventListener('click', (e) => {
    if (!capitulosContainer.contains(e.target)) {
      capitulosPanel.classList.remove('open');
      capitulosBtn.classList.remove('active');
    }
  });

  // Cargar versículos del capítulo seleccionado
  function cargarVersiculos(capituloNum) {
    contenedorVersos.innerHTML = '';
    if (libroSeleccionadoIndex === null || capituloNum === undefined) return;

    const libro = datosBiblia[libroSeleccionadoIndex];
    const capitulo = libro.c.find(cap => cap._n == capituloNum);
    if (!capitulo || !capitulo.v) return;

    // Encabezado del capítulo
    const header = document.createElement('h2');
    header.className = 'capitulo-header';
    header.textContent = `${libro._n} ${capitulo._n}`;
    contenedorVersos.appendChild(header);

    // Tarjetas de versículos
    capitulo.v.forEach(versiculo => {
      capitulo.v.forEach((versiculo, index) => {
      const tarjeta = document.createElement('div');
      tarjeta.className = 'versiculo';
      tarjeta.setAttribute('tabindex', '0');
      tarjeta.innerHTML = `
        <span class="num-versiculo">${versiculo._n}</span>
        <span class="texto-versiculo">${versiculo.__text}</span>
      `;
      tarjeta.addEventListener('click', () => {
        mostrarVersiculo({
          texto: versiculo.__text,
          numVersiculo: versiculo._n,
          libro: libro._n,
          capitulo: capituloNum,
          versiculos: capitulo.v,   // array completo de versículos del capítulo
          indice: index             // posición actual
        });
      });
      contenedorVersos.appendChild(tarjeta);
    });
    });
  }
}
