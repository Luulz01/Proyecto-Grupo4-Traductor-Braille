# Documentación Técnica — Traductor Braille

**Versión:** 1.0.0  
**Última actualización:** Mayo 2026  

## 1. Descripción general

Aplicación web sin dependencias externas que traduce texto en español a braille de **grado 1** (signografía). Muestra cada carácter traducido como un **cuadratín visual de 6 puntos** y también como **caracteres Unicode Braille** (U+2800–U+283F).

## 2. Estructura del proyecto

```
raiz/
├── index.html          # Estructura HTML y accesibilidad
├── script.js           # Lógica de traducción, renderizado e interactividad
├── style.css           # Estilos visuales, responsive y alto contraste
└── .vscode/
    ├── settings.json
    └── launch.json
```

## 3. Archivos fuente

### 3.1 `index.html`

Página única con dos secciones principales:

- **Panel de entrada** (`section.panel-input`): `textarea` con límite de 2000 caracteres, contador en vivo y botones "Traducir a braille" / "Limpiar".
- **Panel de salida** (`section.panel-output`):Selector de vista (cuadratines / Unicode), contenedor de cuadratines, contenedor Unicode, leyenda del cuadratín.

**Accesibilidad:** skip-link, `aria-labelledby`, `aria-live="polite"`, `aria-pressed`, `visually-hidden`.

### 3.2 `script.js`

Archivo único con IIFE (función autoejecutable). Sin dependencias externas.

#### 3.2.1 Definición de patrones braille

Cada patrón se representa como un array de 6 booleanos en el orden `[p1, p2, p3, p4, p5, p6]`:

```
  1 · 4
  2 · 5
  3 · 6
```

| Constante | Descripción |
|---|---|
| `LETRAS` | Mapa a–z y ñ → 26 patrones |
| `ACENTUADAS` | Mapa á, é, í, ó, ú, ü → 6 patrones |
| `SIGNOS` | Mapa de signos ortográficos → 15 patrones |
| `DIGITO_A_LETRA` | Mapa 0–9 → letras a–j (serie numérica braille) |
| `SIGNO_NUMERO` | Prefijo numérico (puntos 3-4-5-6) |
| `SIGNO_MAYUSCULA` | Prefijo mayúscula (puntos 4-6) |
| `SIGNO_LETRA_TRAS_NUMERO` | Prefijo letra tras número (punto 5) |

#### 3.2.2 Funciones principales

| Función | Descripción |
|---|---|
| `pattern(...dots)` | Crea array `[6 booleanos]` a partir de números de punto (1-6) |
| `dotsAUnicode(dots)` | Convierte array de booleanos a carácter Unicode Braille (U+2800 + offset) |
| `textoABraille(texto)` | Traduce texto → array de objetos `{type, dots, label, special}`. Gestiona modo numérico y mayúsculas. |
| `crearCelda(dots)` | Crea `div.braille-cell` con 6 `span.braille-dot` en orden visual [p1,p4,p2,p5,p3,p6] para grid CSS |
| `crearCeldaConEtiqueta(item)` | Envuelve celda + etiqueta textual inferior |
| `renderizarCeldas(celdas, contenedor)` | Renderiza array de celdas en el DOM manejando espacios, saltos de línea y caracteres desconocidos |
| `celdasAUnicode(celdas)` | Convierte array de celdas a cadena Unicode Braille |
| `aplicarVista(vista)` | Alterna entre vista "celdas" y "unicode" |
| `traducir()` | Orquesta la traducción y actualiza el DOM |
| `limpiar()` | Restaura el estado inicial |

#### 3.2.3 Lógica de traducción (`textoABraille`)

1. **Espacios y tabs** → `{type: "space"}`
2. **Saltos de línea** → `{type: "newline"}`
3. **`#`** → inserta signo numérico y activa `modoNumero`
4. **Signos ortográficos** → patrón correspondiente, desactiva modo número
5. **Dígitos 0-9** → si no está en modo número, inserta prefijo numérico automático; traduce a letra a–j
6. **Vocales acentuadas** → inserta prefijo de mayúscula si aplica, luego patrón acentuado
7. **Letras a–z/ñ** → si está en modo número y la letra está en serie numérica (a–j), inserta prefijo de letra; inserta prefijo de mayúscula si aplica
8. **Caracteres no soportados** → `{type: "unknown"}`

#### 3.2.4 Eventos

| Elemento | Evento | Acción |
|---|---|---|
| `#entrada` | `input` | Actualiza contador de caracteres |
| `#entrada` | `keydown` Ctrl+Enter | Ejecuta traducción |
| `#btn-traducir` | `click` | Ejecuta `traducir()` |
| `#btn-limpiar` | `click` | Ejecuta `limpiar()` |
| `#btn-vista-celdas` | `click` | Cambia a vista cuadratines |
| `#btn-vista-unicode` | `click` | Cambia a vista Unicode |

### 3.3 `style.css`

#### 3.3.1 Arquitectura

- **Variables CSS** personalizadas en `:root` para colores, fuentes, radios y sombras.
- **Diseño mobile-first** con punto de quiebre a 600 px.
- **Soporte de preferencias del sistema:** `prefers-contrast: more` y `prefers-reduced-motion`.

#### 3.3.2 Componentes visuales clave

| Selector | Descripción |
|---|---|
| `.braille-cell` | Grid de 2 columnas × 3 filas, 2.75rem × 4.25rem |
| `.braille-dot` | Círculo de 100% ancho, color vacío/relleno |
| `.braille-dot.raised` | Punto activo (fondo oscuro) |
| `.braille-word-gap` | Separador entre palabras (0.65rem) |
| `.braille-line-break` | Salto de línea (flex-basis: 100%) |
| `.braille-unknown` | Carácter no soportado (fondo amarillo, borde naranja) |
| `.vista-toggle` | Grupo de botones para cambiar vista |
| `.skip-link` | Enlace de salto para teclado |

## 4. Caracteres soportados

| Categoría | Caracteres |
|---|---|
| Letras | a b c d e f g h i j k l m n o p q r s t u v w x y z ñ |
| Acentuadas | á é í ó ú ü |
| Números | 0 1 2 3 4 5 6 7 8 9 (con prefijo # automático) |
| Signos | . , ; : ¿ ? ¡ ! - ' " « » ( ) |
| Espacios | espacio, tabulador, salto de línea |

## 5. Características de accesibilidad

- **Skip link** al inicio para navegación por teclado
- **ARIA**: `aria-live="polite"`, `aria-pressed`, `aria-labelledby`, `aria-describedby`, `aria-label`, `aria-hidden`, `role="img"`, `role="group"`
- **Contraste**: variables CSS adaptables con `prefers-contrast: more`
- **Movimiento reducido**: `prefers-reduced-motion` desactiva transiciones y animaciones
- **Etiqueta visualmente oculta** para el `textarea`

## 6. Compatibilidad

- Sin dependencias externas (vanilla JS, CSS puro)
- Navegadores modernos con soporte de ES6, CSS Grid y `String.fromCodePoint`
- Responsive hasta 320 px de ancho de pantalla

## 7. Posibles mejoras futuras

- Soporte de contracciones (braille de grado 2)
- Atajo de teclado global (ej. Ctrl+B)
- Carga/descarga de archivos
- Soporte de más idiomas
- Personalización de tamaño de cuadratín
