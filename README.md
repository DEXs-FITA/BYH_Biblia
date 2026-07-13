# B&H Libre: Proyecto Biblia
## Descripción

B&H Libre es una Progressive Web App (PWA) diseñada específicamente para la proyección de versículos bíblicos durante reuniones, conferencias y servicios religiosos. La aplicación permite navegar rápidamente entre libros y capítulos, mostrando los versículos en un formato limpio y de alto contraste, ideal para su visualización en pantallas grandes y proyectores.

Optimizada para laptops, funciona en cualquier sistema operativo (Windows, Linux, macOS) y navegador web moderno. Gracias a su arquitectura PWA, puede instalarse localmente y operar sin conexión a internet.

## Demo

[Acceder a la aplicación](https://dexs-fita.github.io/BYH_Biblia/)

La aplicación detecta automáticamente si puede instalarse como PWA. Para instalarla, utiliza el botón de descarga que aparece en la barra de direcciones del navegador al acceder al enlace.

**Importante:** Se recomienda descargar e instalar la aplicación como PWA para uso frecuente. Esto evita la congestión de ancho de banda del servidor y permite el funcionamiento offline sin depender de la conexión a internet.

## Instalación como PWA (recomendado)
1. Accede a [https://dexs-fita.github.io/BYH_Biblia/](https://dexs-fita.github.io/BYH_Biblia/)
2. El navegador mostrará un botón de instalación en la barra de direcciones.
3. Haz clic en el botón para instalar la aplicación en tu dispositivo.
4. Una vez instalada, podrás usarla sin conexión a internet y sin consumir ancho de banda del servidor.

## Características

- Proyección de versículos optimizada para pantallas grandes y proyectores.
- Navegación ágil por libros y capítulos.
- Visor ampliado de versículos con zoom y controles de navegación.
- Modo maximizado para proyección a pantalla completa.
- Cambio de tema claro/oscuro.
- Progressive Web App (PWA) instalable.
- Funcionamiento offline mediante Service Worker.
- Navegación completa mediante atajos de teclado.

## Tecnologías

- HTML5
- CSS3
- JavaScript (Vanilla, módulos ES6)
- Service Workers
- Web App Manifest
- Cache API
- Fetch API

## Instalación

```bash
git clone https://github.com/DEXs-FITA/BYH_Biblia.git
cd BYH_Biblia
```

## Uso en reuniones

- Abre la aplicación (preferentemente desde la PWA instalada).
- Selecciona el libro y capítulo que necesitas proyectar.
- Utiliza el visor ampliado haciendo clic en cualquier versículo.
- Navega entre versículos con los botones de anterior y siguiente.
- Ajusta el zoom según la distancia de proyección.
- Puedes activa el modo maximizado para proyección a pantalla completa.

## Atajos de teclado
### Navegación general

| Atajo       | Acción                                            |
|-------------|---------------------------------------------------|
| Shift + L   | Abrir o cerrar panel de libros                    |
| Shift + C   | Abrir o cerrar panel de capítulos                |
| Shift + V   | Activar o desactivar modo de navegación por versículos |
| Escape      | Cerrar panel abierto, salir del modo presentación o cerrar modal |

### Navegación en paneles (libros o capítulos)

| Atajo             | Acción                          |
|-------------------|---------------------------------|
| Flecha arriba     | Mover selección hacia arriba    |
| Flecha abajo      | Mover selección hacia abajo     |
| Flecha izquierda  | Mover selección a la izquierda  |
| Flecha derecha    | Mover selección a la derecha    |
| Enter             | Seleccionar libro o capítulo    |

### Modo de navegación por versículos (Shift + V activado)

| Atajo       | Acción                            |
|-------------|-----------------------------------|
| Flecha arriba   | Versículo anterior            |
| Flecha abajo    | Versículo siguiente            |
| Enter           | Abrir versículo en visor ampliado |
| Escape          | Salir del modo de navegación     |

### Visor ampliado (modal)

| Atajo             | Acción                        |
|-------------------|-------------------------------|
| Flecha izquierda  | Versículo anterior            |
| Flecha derecha    | Versículo siguiente           |
| Ctrl +            | Aumentar zoom                 |
| Ctrl -            | Disminuir zoom                |
| Escape            | Cerrar visor ampliado         |

## Contribución

Las contribuciones son bienvenidas:

1. Haz un fork del repositorio.
2. Crea una rama para tu funcionalidad (`git checkout -b feature/nueva-funcionalidad`).
3. Realiza tus cambios.
4. Asegúrate de que el código funciona correctamente.
5. Envía un pull request describiendo los cambios realizados.

Antes de contribuir, revisa los [Issues](https://github.com/dexs-fita/BYH_Biblia/issues) para ver qué tareas están pendientes o si alguien ya está trabajando en algo similar.

## Estructura del proyecto

```text
BYH_Biblia/
├── css/
│   ├── index.css
│   ├── acercade.css
│   ├── cuerpo/
│   │   ├── versos.css
│   │   └── modal.css
│   └── globales/
│       ├── nav.css
│       ├── header.css
│       └── base.css
├── js/
│   ├── index.js
│   ├── acercade.js
│   ├── nav/
│   │   └── botones.js
│   └── modulesBiblia/
│       ├── modal.js
│       ├── atajos.js
│       └── lectorListas.js
├── recursos/
│   ├── imagenes/
│   │   ├── bh_logo.svg
│   │   ├── bh_logo_192.png
│   │   ├── bh_logo_512.png
│   │   └── colaboradores/
│   │       └── logo_dexs_fita.png
│   ├── versiones/
│   │   ├── NVI.json
│   │   └── RV1960.json
│   └── fuentes/
│       ├── Montserrat-Regular.ttf
│       └── Montserrat-ExtraBold.ttf
├── includes/
│   └── header.html
├── screenshots/
│   ├── vista-principal.png
│   ├── visor-ampliado.png
│   └── modo-proyeccion.png
├── index.html
├── acercade.html
├── manifest.json
├── sw.js
├── LICENSE
└── README.md
```

## Funcionamiento offline

La aplicación cachea todos los recursos necesarios durante la primera carga, incluyendo el texto bíblico completo. Una vez instalada como PWA, no requiere conexión a internet para funcionar.
Si borras los datos de tu navegar esto tambien borrara los datos de B&H Biblia por lo que si requeriras conecater a internet para que esta vuelva a funcionar.

## Versiones de la Biblia incluidas

- **Reina Valera 1960 (RV1960)** – incluida.
- **Nueva Versión Internacional (NVI)** – próximamente.

## Créditos

- Textos bíblicos proporcionados por [OpenSong](http://www.opensong.org/).
- Desarrollo y diseño por **DEXs-FITA**.

## Versión

**Versión actual:** 2.1 (6 de julio de 2026)

## Licencia

Copyright © 2026 DEXs-FITA

Este proyecto se distribuye bajo la licencia **Creative Commons Atribución-NoComercial 4.0 Internacional (CC BY-NC 4.0)**.

Esto significa que eres libre de:

- **Compartir** – copiar y redistribuir el material en cualquier medio o formato.
- **Adaptar** – remezclar, transformar y construir a partir del material.

Bajo las siguientes condiciones:

- **Atribución** – Debes otorgar el crédito correspondiente a DEXs-FITA, proporcionar un enlace a la licencia e indicar si se realizaron cambios. Puedes hacerlo en cualquier forma razonable, pero no de forma tal que sugiera que el licenciante te respalda a ti o a tu uso.
- **NoComercial** – No puedes utilizar el material con fines comerciales o de lucro. Esto incluye la venta, alquiler o cualquier forma de obtener ganancias económicas directas o indirectas del proyecto o sus derivados.

Para más información sobre la licencia: [https://creativecommons.org/licenses/by-nc/4.0/deed.es](https://creativecommons.org/licenses/by-nc/4.0/deed.es)

## Contacto

- **Email:** [fitadexs@gmail.com](mailto:fitadexs@gmail.com)
- **Desarrollador:** DEXs-FITA
- **Ubicación:** Monterrey, México
- **Repositorio:** [GitHub](https://github.com/dexs-fita/BYH_Biblia)
