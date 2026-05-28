# Documentación Técnica — Traductor Braille

## 1. Descripción General

Aplicación web front-end (JavaScript vanilla, sin dependencias externas) que traduce texto en español a braille de **grado 1 (ONCE B2)**. El usuario escribe texto, y la aplicación genera una representación visual de **cuadratines de 6 puntos** así como caracteres **Unicode braille (U+2800–U+283F)**. Incluye funcionalidad de **impresión de señalética** accesible (placa con texto en tinta + braille).

---

## 2. Estructura del Proyecto

```
traductor-braille/
├── index.html                     # Página principal (HTML semántico + ARIA)
├── style.css                      # Estilos visuales, responsive, print
├── script.js                      # Punto de entrada (importa e inicia la app)
├── modules/
│   ├── datos-braille.js           # Datos: patrones de puntos y tablas de signos
│   ├── traductor-base.js          # Lógica de traducción texto → braille
│   ├── senaletica-render.js       # Renderizado DOM de celdas braille
│   ├── senaletica-impresion.js    # Gestión de placa de señalética para impresión
│   └── interfaz.js                # Orquestador: eventos de UI, vistas, integración
└── .vscode/                       # Configuración del editor
```

---

## 3. Arquitectura y Flujo de Datos

```
Usuario escribe texto
       ↓
   [textarea#entrada]
       ↓
   iniciarApp()  (interfaz.js)
       ↓
   textoABraille(texto)  (traductor-base.js)
       ↓
   { celdas: object[], desconocidos: number }
       ↓
   ┌── renderizarCeldas(celdas, salidaBraille)  — DOM con cuadratines
   └── celdasAUnicodePantalla(celdas)            — String Unicode (vista texto)
       ↓
   actualizarSenaleticaImpresion()  (prepara placa para impresión)
```

Cada celda lógica es un objeto `{ type, dots, label, special, mayusculaDoble }`.

---

## 4. Módulos

### 4.1 `datos-braille.js` — Diccionario Braille

Define todos los patrones de 6 puntos (`boolean[]`) usados en la traducción.

| Exportación              | Descripción                                      |
|--------------------------|--------------------------------------------------|
| `pattern(...dots)`       | Función interna: crea array `boolean[6]`         |
| `SIGNO_NUMERO`           | Prefijo numérico (puntos 3-4-5-6)                |
| `SIGNO_MAYUSCULA`        | Prefijo de mayúscula (puntos 4-6)                |
| `SIGNO_LETRA_TRAS_NUMERO`| Separador letra tras número (punto 5)            |
| `LETRAS_SERIE_NUMERICA`  | String `"abcdefghij"` (letras usadas como dígitos) |
| `LETRAS`                 | Mapa `a–z, ñ` → patrón                           |
| `ACENTUADAS`             | Mapa `á, é, í, ó, ú, ü` → patrón                 |
| `SIGNOS`                 | Mapa de puntuación: `.,;:¿?!¡-'"«»()` → patrón  |
| `DIGITOS_A_LETRA`        | Mapa `0–9` → letra braille correspondiente       |

### 4.2 `traductor-base.js` — Motor de Traducción

Funciones principales:

| Función                          | Descripción                                                                 |
|----------------------------------|-----------------------------------------------------------------------------|
| `textoABraille(texto)`           | Traduce texto español a array de objetos lógicos `{celdas, desconocidos}`   |
| `celdasAUnicode(celdas, opts)`   | Convierte celdas lógicas a string Unicode braille                           |
| `celdasAUnicodePantalla(celdas)` | Unicode braille con espacios normales (para vista en pantalla)              |
| `celdasAUnicodeImpresion(celdas)`| Unicode braille con espacio braille `\u2800` (para impresión)               |

**Reglas de traducción:**

1. **Espacios y tabulaciones** → `type: "space"`
2. **Saltos de línea** (`\n`, `\r\n`) → `type: "newline"`
3. **`#` explícito** → inserta `SIGNO_NUMERO` y activa modo numérico
4. **Signos de puntuación** conocidos → su patrón braille
5. **Dígitos `0–9`**: si no se está en modo numérico, inserta automáticamente `SIGNO_NUMERO`; luego asigna la letra braille correspondiente (`a–j`)
6. **Letras (`a–z`, `ñ`, `áéíóúü`)**: si se está en modo numérico, inserta `SIGNO_LETRA_TRAS_NUMERO` y desactiva el modo. Si la letra está en **mayúscula**, inserta el prefijo `SIGNO_MAYUSCULA` (una vez para mayúscula simple, doble `⠨⠨` para palabras de ≥2 mayúsculas consecutivas)
7. **Caracteres no reconocidos** → `type: "unknown"`, se contabilizan

### 4.3 `senaletica-render.js` — Renderizado DOM

Construye la representación visual de los cuadratines en el DOM.

| Función                            | Descripción                                              |
|------------------------------------|----------------------------------------------------------|
| `crearCelda(dots)`                 | Crea un `<div>` con 6 puntos `<span>` en cuadrícula 2×3 |
| `crearCeldaConEtiqueta(item)`      | Envuelve la celda con etiqueta de carácter               |
| `renderizarCeldas(celdas, cont)`   | Renderiza toda la secuencia en el contenedor             |

**Orden visual de puntos:** `[0, 3, 1, 4, 2, 5]` (columna izquierda de arriba abajo, luego derecha de arriba abajo).

Casos especiales:
- **Mayúscula doble**: agrupa dos celdas `SIGNO_MAYUSCULA` en un contenedor con borde azul
- **Desconocido**: muestra el carácter original en un recuadro amarillo con tooltip
- **Salto de línea**: crea una nueva fila `<div class="braille-line">`

### 4.4 `senaletica-impresion.js` — Señalética para Impresión

Gestiona la placa imprimible con texto en tinta y braille.

| Función                                   | Descripción                                        |
|-------------------------------------------|----------------------------------------------------|
| `actualizarSenaleticaImpresion(texto, celdas, elementos)` | Actualiza contenido de la placa      |
| `imprimirSenaletica(entrada, celdas, elementos)` | Abre el diálogo de impresión del navegador |

La placa (`#senaletica-impresion`) permanece oculta en pantalla (`clip: rect(0,0,0,0)`) y se muestra solo al imprimir (`@media print`).

### 4.5 `interfaz.js` — Controlador de UI

Orquesta todos los módulos y maneja eventos del usuario.

| Función             | Descripción                                              |
|---------------------|----------------------------------------------------------|
| `iniciarApp()`      | Inicializa la aplicación: referencias DOM, eventos, estado |

**Eventos manejados:**

| Elemento        | Evento     | Acción                                                  |
|-----------------|------------|---------------------------------------------------------|
| `#btn-traducir` | `click`    | Ejecuta `traducir()`: traduce texto y actualiza salida  |
| `#btn-limpiar`  | `click`    | Limpia entrada, salida y estado                         |
| `#entrada`      | `input`    | Actualiza contador de caracteres                        |
| `#entrada`      | `keydown`  | Ctrl+Enter / Cmd+Enter → traduce                        |
| `#btn-vista-celdas` | `click` | Cambia a vista cuadratines                              |
| `#btn-vista-unicode` | `click` | Cambia a vista Unicode braille                          |
| `#btn-imprimir` | `click`    | Prepara y abre impresión de señalética                  |
| `window`        | `afterprint` | Restaura `aria-hidden` de la señalética               |

**Estado interno:**
- `ultimasCeldas` — última traducción generada (para cambios de vista e impresión)
- `vistaActual` — `"celdas"` | `"unicode"`

---

## 5. Estructura de Datos: Celda Lógica

```typescript
interface CeldaBraille {
  type: "cell" | "space" | "newline" | "unknown";
  // Para type === "cell":
  dots?: boolean[];          // Array de 6 booleanos (puntos activos)
  label?: string;            // Etiqueta textual (carácter origen)
  special?: string;          // "mayúscula" | "número" | "letra"
  mayusculaDoble?: boolean;  // true si es doble indicador de mayúsculas
  // Para type === "unknown":
  char?: string;             // Carácter no reconocido original
}
```

---

## 6. Estilos y Accesibilidad (`style.css`)

- **Modo alto contraste** vía `@media (prefers-contrast: more)`
- **Reducción de movimiento** vía `@media (prefers-reduced-motion: reduce)`
- **Diseño responsive** (breakpoint a 600px)
- **ARIA**: `aria-pressed`, `aria-live`, `aria-label`, `aria-hidden`, `aria-describedby`, `role="img"`, `role="presentation"`
- **Skip link** para navegación por teclado
- La placa de señalética usa reglas `@media print` con tamaño A4, márgenes de 2cm, y `print-color-adjust: exact`

---

## 7. Vista de Caracteres Soportados

| Categoría       | Caracteres                                                                 |
|-----------------|----------------------------------------------------------------------------|
| Letras          | `a b c d e f g h i j k l m n o p q r s t u v w x y z ñ`                  |
| Vocales acentuadas | `á é í ó ú ü`                                                            |
| Dígitos         | `0 1 2 3 4 5 6 7 8 9` (precedidos por signo numérico)                    |
| Signos          | `. , ; : ¿ ? ¡ ! - ' " « » ( )`                                          |
| Mayúsculas      | Cualquier letra del alfabeto en mayúscula (precedida de `SIGNO_MAYUSCULA`) |
| Otros           | Espacio, tabulación, salto de línea; `#` como prefijo numérico explícito  |

---

## 8. Formato Unicode Braille

Los patrones de 6 puntos se convierten a caracteres Unicode en el rango **U+2800–U+283F** mediante la función `dotsAUnicode()`. Cada punto activo aporta un bit en la siguiente correspondencia:

| Punto | Bit | Peso hexadecimal |
|-------|-----|------------------|
| 1     | 0   | 0x01             |
| 2     | 1   | 0x02             |
| 3     | 2   | 0x04             |
| 4     | 3   | 0x08             |
| 5     | 4   | 0x10             |
| 6     | 5   | 0x20             |

El código Unicode final es `U+2800 + suma_de_pesos`.

---

## 9. Funcionalidad de Impresión

1. El usuario pulsa "Imprimir señalética"
2. `imprimirSenaletica()` actualiza la placa oculta (`#senaletica-impresion`) con el texto original y su traducción braille Unicode
3. Se llama a `window.print()`
4. Las reglas `@media print` en CSS ocultan la interfaz (`.no-print`) y muestran la placa centrada en formato A4
5. Tras la impresión, el evento `afterprint` restaura el estado `aria-hidden="true"` de la placa
