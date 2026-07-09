# Guía rápida de estilos CSS – Biblia interactiva

## Estructura DOM resumida
```
#libros-container
├── #libros-btn (botón toggle)
└── #libros-panel (se oculta/muestra con .open)
└── .libro-opcion (botón, data-index, .seleccionado)

#capitulos-container
├── #capitulos-btn (botón toggle)
└── #capitulos-panel (se oculta/muestra con .open)
└── .capitulo-opcion (botón, data-capitulo, .seleccionado)

.versos
├── .capitulo-header (título "Libro Capítulo")
└── .versiculo (tarjeta por cada versículo)
├── .num-versiculo (número)
└── .texto-versiculo (texto)
```

---

## Clases y estados clave

| Elemento | Clase / Selector | Estado / Uso |
|----------|------------------|--------------|
| Paneles desplegables | `#libros-panel`, `#capitulos-panel` | `.open` = visible |
| Botones toggle | `#libros-btn`, `#capitulos-btn` | `.active` = panel abierto, `:disabled` = sin datos |
| Opción activa | `.libro-opcion`, `.capitulo-opcion` | `.seleccionado` = opción elegida |
| Tarjeta de versículo | `.versiculo` | Click ejecuta `console.log` (extensible) |

---

## Selectores CSS mínimos recomendados

```css
/* Mostrar/ocultar paneles */
#libros-panel, #capitulos-panel { display: none; }
#libros-panel.open, #capitulos-panel.open { display: block; }

/* Botones toggle */
#libros-btn, #capitulos-btn {
  cursor: pointer;
  padding: 8px 16px;
}
#libros-btn.active, #capitulos-btn.active {
  /* estilo cuando el panel está abierto */
  background: #e0e0e0;
}
#libros-btn:disabled, #capitulos-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Opciones de los paneles */
.libro-opcion, .capitulo-opcion {
  display: block;
  width: 100%;
  padding: 6px 12px;
  background: white;
  border: none;
  cursor: pointer;
  text-align: left;
}
.libro-opcion:hover, .capitulo-opcion:hover {
  background: #f0f0f0;
}
.libro-opcion.seleccionado, .capitulo-opcion.seleccionado {
  background: #d0e0ff;
  font-weight: bold;
}

/* Versículos */
.capitulo-header {
  font-size: 1.8rem;
  border-bottom: 2px solid #333;
  margin-bottom: 16px;
}
.versiculo {
  padding: 8px 0;
  border-bottom: 1px solid #eee;
  cursor: pointer;
}
.num-versiculo {
  font-weight: bold;
  color: #2a6f97;
  margin-right: 8px;
}
.texto-versiculo {
  font-size: 1rem;
  line-height: 1.6;
}