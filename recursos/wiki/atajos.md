# Atajos de Teclado – Biblia App

## 🔹 Modo de navegación por versículos
**Activación/desactivación:** `Shift + V`
- Solo se activa si **no** hay un modal abierto ni un panel de libros/capítulos abierto, y hay un capítulo cargado.
- Al activarse, el foco salta al primer versículo de la lista.
- Al desactivarse (`Shift + V` o `Escape`), el foco se retira de la lista.

| Tecla    | Acción |
|----------|--------|
| `↑` `↓`  | Mover el foco al versículo anterior / siguiente. |
| `Enter`  | Abrir el versículo enfocado en el modal. |
| `Escape` | Salir del modo de navegación por versículos. |

---

## Modal de lectura (versículo ampliado)

| Tecla                    | Acción |
|--------------------------|--------|
| `Escape`                 | Cerrar el modal. |
| `Ctrl` + `+` / `=`       | Aumentar el tamaño del texto. |
| `Ctrl` + `-`             | Reducir el tamaño del texto. |
| `←`                      | Versículo anterior. |
| `→`                      | Versículo siguiente. |

---

## Paneles de Libros y Capítulos

### Cuando un panel está abierto

| Tecla      | Acción |
|------------|--------|
| `↑` `↓` `←` `→` | Navegar entre las opciones en cuadrícula. |
| `Enter`    | Seleccionar la opción enfocada. |
| `Escape`   | Cerrar el panel. |

### Atajos globales para los paneles

| Tecla       | Acción |
|-------------|--------|
| `Shift + L` | Abrir/cerrar panel de **Libros**. |
| `Shift + C` | Abrir/cerrar panel de **Capítulos**. |
| `Escape`    | Cerrar cualquier panel abierto. |

---

## Resumen visual rápido

| Atajo            | Contexto                           | Acción |
|------------------|------------------------------------|--------|
| `Shift + V`      | Capítulo cargado, sin modal/panel  | Activar/desactivar navegación por versículos. |
| `↑` / `↓`        | Modo versículos activo             | Mover foco entre versículos. |
| `Enter`          | Modo versículos activo             | Abrir versículo en modal. |
| `Escape`         | Modal abierto                      | Cerrar modal. |
| `Ctrl + +` / `-` | Modal abierto                      | Zoom in / out. |
| `←` / `→`        | Modal abierto                      | Versículo anterior / siguiente. |
| `Escape`         | Panel abierto                      | Cerrar panel. |
| `Shift + L`      | Sin modal/panel                    | Toggle panel de libros. |
| `Shift + C`      | Sin modal/panel                    | Toggle panel de capítulos. |
| `↑` `↓` `←` `→` | Panel abierto, foco en sus botones | Navegación por cuadrícula. |
| `Enter`          | Panel abierto, opción enfocada     | Seleccionar libro/capítulo. |

---

## Nota de estilo
Los versículos enfocados durante la navegación con teclado (`Shift + V`) comparten el mismo estilo visual que el hover del ratón, gracias a `:focus-visible` y `outline: none`.