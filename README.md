# Proyecto-Grupo4-Traductor-Braille

# Traductor Braille ⇄ Español

Aplicación web (HTML, CSS y JavaScript modular) que permite traducir texto entre español y braille de 6 puntos en ambos sentidos, mostrar el resultado en pantalla como cuadratines o como texto Unicode braille, e imprimir placas de señalética y guías de escritura manual.

## Integrantes

- Casa Antonela
- Echeverria Gabriela
- Hernández Lizeth
- Llugcha Kevin
- Manotoa Axel

## Funcionalidades

### 1. Traducción Español → Braille

Convierte texto en español a braille de 6 puntos, aplicando las reglas de:

- Prefijo de número (mapeo de letras a-j como dígitos 0-9).
- Prefijo de mayúscula simple y de mayúscula de palabra completa.
- Signos de puntuación y vocales acentuadas según las tablas `SIGNOS` / `ACENTUADAS`.

El resultado puede visualizarse como cuadratines (constructor visual) o como texto Unicode braille.

### 2. Traducción Braille → Español (nueva, segunda iteración)

Permite ingresar un texto en braille (pegado desde una app externa o compuesto con el teclado Perkins simulado) y obtener su equivalente en español, deshaciendo las mismas reglas aplicadas en el sentido directo: prefijos de número y mayúscula, y tablas de signos y acentuadas en sentido inverso.

- **Módulo:** `traductor-inverso.js`
- **Función principal:** `brailleATexto()`
- **Datos:** mapa inverso `PATRON_A_CARACTER` y función `clavePatron()` en `datos-braille.js`

#### Teclado Perkins simulado

Como alternativa al pegado de texto, se incorpora un teclado Perkins simulado para componer braille directamente desde el teclado físico, sin usar el ratón.

- **Módulo:** `teclado-braille.js`
- **Distribución de teclas:**
  - `F`, `D`, `S` → puntos 1, 2 y 3 (mano izquierda)
  - `J`, `K`, `L` → puntos 4, 5 y 6 (mano derecha)
- **Atajos:**
  - Barra espaciadora: inserta un espacio entre palabras
  - `=`: añade el carácter compuesto por los puntos activos
  - `-`: borra el último carácter ingresado
  - `Shift + Enter`: inserta un salto de línea
  - `Enter`: traduce el braille compuesto hacia español

Los atajos solo se interceptan cuando el foco no está sobre los campos de texto, para no interferir con el pegado normal.

### 3. Impresión de señalética (lectura directa)

Genera una placa de señalética con el texto en tinta y su equivalente en braille, para relieve de lectura directa.

- **Módulo:** `senaletica-impresion.js`

### 4. Impresión en espejo para escritura manual (nueva, segunda iteración)

Genera una guía en espejo del texto braille, pensada para la escritura manual con punzón y regleta: al perforar el papel desde el reverso siguiendo la guía, al voltear la hoja el braille queda correctamente orientado para su lectura de izquierda a derecha.

- **Implementación:** se activa mediante el checkbox `#chk-espejo`, que aplica `transform: scaleX(-1)` sobre el bloque `#senaletica-braille` (clase `.espejo`) en `style.css`. Un volteo horizontal del bloque completo logra en un solo paso el mismo resultado que reflejar cada celda e invertir el orden de las celdas.
- Esta guía en espejo coexiste con la placa de señalética normal como una opción adicional, no como reemplazo.

## Estructura de módulos

| Archivo | Descripción |
|---|---|
| `datos-braille.js` | Tablas de codificación braille (directa e inversa), signos y vocales acentuadas. |
| `traductor-base.js` | Traducción de español a braille. |
| `traductor-inverso.js` | Traducción de braille a español (`brailleATexto()`). |
| `teclado-braille.js` | Entrada de braille mediante teclado Perkins simulado. |
| `senaletica-render.js` / `senaletica-impresion.js` | Generación e impresión de la placa de señalética, incluyendo el modo espejo. |
| `interfaz.js` | Lógica de interfaz: conexión de flujos, atajos de teclado y controles en pantalla. |
| `index.html` | Estructura de la página, incluyendo el constructor visual de cuadratines y los controles de impresión. |
| `style.css` | Estilos, incluida la clase `.espejo` para la impresión en espejo. |

## Pruebas

El proyecto usa Jest. La suite incluye 21 casos de prueba (TC-01 a TC-21):

- TC-01 a TC-15: traducción español → braille (funcionalidad de primera iteración).
- TC-16 a TC-21: traducción braille → español, incluyendo pruebas de round-trip (texto → braille → texto).

La impresión en espejo no cuenta aún con prueba automatizada; su validación se realiza de forma manual/física con papel y punzón.

Para ejecutar las pruebas:

```bash
npm test
```

## Ramas del proyecto

```
main
│
├── documentacion
│
├── feature/datos-braille
├── feature/traductor-base
├── feature/senaletica-render
├── feature/interfaz
├── feature/styles
├── feature/traductor-inverso     ← incluye teclado Perkins simulado (CR-02-01)
└── feature/senaletica-impresion  ← impresión en espejo (CR-02-02)
```

> Nota: el teclado Perkins simulado no tiene una rama independiente; se desarrolló dentro de `feature/traductor-inverso`, junto con la traducción inversa.

