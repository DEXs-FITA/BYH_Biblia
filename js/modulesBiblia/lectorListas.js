// =======================================================
// == CARGA DE LISTAS ==
// =======================================================

import { mostrarVersiculo } from './modal.js';

export function inicializarBiblia() {
    const librosContainer = document.getElementById('libros-container');
    const librosBtn = document.getElementById('libros-btn');
    const librosPanel = document.getElementById('libros-panel');

    const capitulosContainer = document.getElementById('capitulos-container');
    const capitulosBtn = document.getElementById('capitulos-btn');
    const capitulosPanel = document.getElementById('capitulos-panel');

    const contenedorVersos = document.querySelector('.versos');
    let datosBiblia = null;
    let libroSeleccionadoIndex = null;

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
        .catch(() => {
            librosBtn.disabled = false;
            librosBtn.textContent = 'Error al cargar';
        });

    function poblarLibros() {
        librosPanel.innerHTML = '';
        datosBiblia.forEach((libro, index) => {
            const opcion = document.createElement('button');
            opcion.type = 'button';
            opcion.className = 'libro-opcion';
            opcion.textContent = libro._n;
            opcion.dataset.index = index;
            librosPanel.appendChild(opcion);
        });
    }

    function seleccionarLibro(index, nombre) {
        libroSeleccionadoIndex = index;
        librosBtn.textContent = nombre;

        document.querySelectorAll('.libro-opcion').forEach(btn => btn.classList.remove('seleccionado'));
        const opcionActiva = document.querySelector(`.libro-opcion[data-index="${index}"]`);
        if (opcionActiva) opcionActiva.classList.add('seleccionado');

        librosPanel.classList.remove('open');
        librosBtn.classList.remove('active');

        cargarCapitulos(index);
    }

    // Delegacion de eventos para libros
    librosPanel.addEventListener('click', (e) => {
        const opcion = e.target.closest('.libro-opcion');
        if (opcion) {
            const index = parseInt(opcion.dataset.index);
            const nombre = opcion.textContent;
            seleccionarLibro(index, nombre);
        }
    });

    librosBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (librosBtn.disabled) return;
        const estaAbierto = librosPanel.classList.contains('open');
        if (!estaAbierto) {
            capitulosPanel.classList.remove('open');
            capitulosBtn.classList.remove('active');
        }
        librosPanel.classList.toggle('open', !estaAbierto);
        librosBtn.classList.toggle('active', !estaAbierto);
    });

    document.addEventListener('click', (e) => {
        if (!librosContainer.contains(e.target)) {
            librosPanel.classList.remove('open');
            librosBtn.classList.remove('active');
        }
    });

    // CAPITULOS
    function cargarCapitulos(libroIndex) {
        capitulosPanel.innerHTML = '';
        capitulosBtn.textContent = 'Selecciona un capitulo';
        capitulosBtn.disabled = true;
        capitulosPanel.classList.remove('open');
        capitulosBtn.classList.remove('active');
        contenedorVersos.innerHTML = '';

        if (libroIndex === undefined || libroIndex === null) return;

        const libro = datosBiblia[libroIndex];
        if (!libro || !libro.c) return;

        libro.c.forEach(cap => {
            const opcion = document.createElement('button');
            opcion.type = 'button';
            opcion.className = 'capitulo-opcion';
            opcion.textContent = `${cap._n}`;
            opcion.dataset.capitulo = cap._n;
            capitulosPanel.appendChild(opcion);
        });

        capitulosBtn.disabled = false;
    }

    function seleccionarCapitulo(numCapitulo) {
        capitulosBtn.textContent = `${numCapitulo}`;

        document.querySelectorAll('.capitulo-opcion').forEach(btn => btn.classList.remove('seleccionado'));
        const opcionActiva = document.querySelector(`.capitulo-opcion[data-capitulo="${numCapitulo}"]`);
        if (opcionActiva) opcionActiva.classList.add('seleccionado');

        capitulosPanel.classList.remove('open');
        capitulosBtn.classList.remove('active');

        cargarVersiculos(numCapitulo);
    }

    // Delegacion de eventos para capitulos
    capitulosPanel.addEventListener('click', (e) => {
        const opcion = e.target.closest('.capitulo-opcion');
        if (opcion) {
            const capitulo = parseInt(opcion.dataset.capitulo);
            seleccionarCapitulo(capitulo);
        }
    });

    capitulosBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (capitulosBtn.disabled) return;
        const estaAbierto = capitulosPanel.classList.contains('open');
        if (!estaAbierto) {
            librosPanel.classList.remove('open');
            librosBtn.classList.remove('active');
        }
        capitulosPanel.classList.toggle('open', !estaAbierto);
        capitulosBtn.classList.toggle('active', !estaAbierto);
    });

    document.addEventListener('click', (e) => {
        if (!capitulosContainer.contains(e.target)) {
            capitulosPanel.classList.remove('open');
            capitulosBtn.classList.remove('active');
        }
    });

    function cargarVersiculos(capituloNum) {
        if (libroSeleccionadoIndex === null || capituloNum === undefined) return;

        const libro = datosBiblia[libroSeleccionadoIndex];
        const capitulo = libro.c.find(cap => cap._n == capituloNum);
        if (!capitulo || !capitulo.v) return;

        const fragment = document.createDocumentFragment();

        const header = document.createElement('h2');
        header.className = 'capitulo-header';
        header.textContent = `${libro._n} ${capitulo._n}`;
        fragment.appendChild(header);

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
                    versiculos: capitulo.v,
                    indice: index
                });
            });
            fragment.appendChild(tarjeta);
        });

        contenedorVersos.innerHTML = '';
        contenedorVersos.appendChild(fragment);
    }
}