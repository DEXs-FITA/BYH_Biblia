# centar css

### 1. CENTRADO HORIZONTAL + VERTICAL
```css
.contenedor {
  display: flex;
  justify-content: center;  /* horizontal */
  align-items: center;      /* vertical */
  height: 100vh;
}
```

### 2. CENTRADO HORIZONTAL + WRAP (salto de línea)
```css
.contenedor {
  display: flex;
  justify-content: center;  /* horizontal */
  align-items: center;      /* vertical */
  height: 100vh;
}
```

### 3. CENTRADO HORIZONTAL + VERTICAL + WRAP (todo junto)
```css
.contenedor {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;   /* horizontal */
  align-content: center;     /* vertical (líneas completas) */
  align-items: center;       /* vertical (dentro de cada línea) */
  height: 100vh;
  gap: 10px;
}
```

### 4. ALTERNATIVA CON GRID (solo centrado, sin wrap)

```css
.contenedor {
  display: grid;
  place-items: center;
  height: 100vh;
}
```

### 5. ALTERNATIVA CON INLINE-BLOCK (centrado horizontal + wrap)
```css
.contenedor {
  text-align: center;
}
.item {
  display: inline-block;
}
```

# Fila y Columna

### 1. Fila Horizontal

```css
.contenedor {
  display: flex;
  flex-direction: row;        /* por defecto, horizontal */
  /* o simplemente display: flex; */
}
```

### Columna Vertical

```css
.contenedor {
  display: flex;
  flex-direction: column;   /* <- CLAVE: apila verticalmente */
  gap: 10px;                /* separación entre divs */
}
```

