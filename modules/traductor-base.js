/**
 * Módulo de traducción braille.
 * Contiene la lógica para convertir texto en español a celdas braille y a caracteres Unicode braille.
 */

import {
  LETRAS,
  ACENTUADAS,
  SIGNOS,
  DIGITOS_A_LETRA,
  SIGNO_NUMERO,
  SIGNO_MAYUSCULA,
  SIGNO_LETRA_TRAS_NUMERO,
  LETRAS_SERIE_NUMERICA,
} from "./datos-braille.js";

/**
 * Convierte un patrón de 6 puntos en el carácter Unicode braille correspondiente.
 * @param {boolean[]} dots - Array de 6 booleanos que representan los puntos activos.
 * @returns {string} Carácter Unicode braille (U+2800–U+283F) resultante.
 */
function dotsAUnicode(dots) {
  let offset = 0;
  dots.forEach((activo, i) => {
    if (activo) offset |= 1 << i;
  });
  return String.fromCodePoint(0x2800 + offset);
}

/**
 * Indica si un carácter corresponde a una letra que tiene representación braille.
 * @param {string} char - Carácter a evaluar.
 * @returns {boolean} Verdadero si la letra se puede traducir a braille.
 */
function esLetraTraducible(char) {
  const lower = char.toLowerCase();
  return LETRAS[lower] !== undefined || ACENTUADAS[lower] !== undefined;
}

/**
 * Indica si un carácter debe tratarse como mayúscula en braille.
 * @param {string} char - Carácter a evaluar.
 * @returns {boolean} Verdadero si es una letra traducible y está en mayúscula.
 */
function esMayusculaBraille(char) {
  return char !== char.toLowerCase() && esLetraTraducible(char);
}

/**
 * Cuenta cuántas letras mayúsculas consecutivas hay a partir de una posición.
 * @param {string} texto - Texto completo de entrada.
 * @param {number} desde - Índice inicial desde el que contar.
 * @returns {number} Número de letras mayúsculas consecutivas.
 */
function contarMayusculasConsecutivas(texto, desde) {
  let n = 0;
  for (let j = desde; j < texto.length && esMayusculaBraille(texto[j]); j++) {
    n++;
  }
  return n;
}

/**
 * Inserta en el resultado el indicador de mayúscula simple o de palabra completa.
 * @param {object[]} resultado - Array acumulado de celdas braille.
 * @param {number} runLen - Longitud de la secuencia de letras mayúsculas consecutivas.
 * @returns {void}
 */
function insertarPrefijoMayuscula(resultado, runLen) {
  if (runLen >= 2) {
    resultado.push({
      type: "cell",
      dots: SIGNO_MAYUSCULA,
      label: "May.×2",
      special: "mayúscula",
      mayusculaDoble: true,
    });
    return;
  }
  resultado.push({
    type: "cell",
    dots: SIGNO_MAYUSCULA,
    label: "May.",
    special: "mayúscula",
  });
}

/**
 * Obtiene el patrón de puntos y etiqueta para una letra o vocal acentuada.
 * @param {string} char - Carácter de entrada.
 * @returns {{ dots: boolean[], label: string } | null} Objeto con patrón y etiqueta o null si no aplica.
 */
function patronLetra(char) {
  const lower = char.toLowerCase();
  if (ACENTUADAS[lower] !== undefined) {
    return { dots: ACENTUADAS[lower], label: lower };
  }
  if (LETRAS[lower] !== undefined) {
    return { dots: LETRAS[lower], label: lower };
  }
  return null;
}

/**
 * Traduce un texto en español a una secuencia de celdas braille lógicas.
 * @param {string} texto - Texto de entrada en español.
 * @returns {{ celdas: object[], desconocidos: number }} Celdas braille generadas y cuenta de caracteres no reconocidos.
 */
export function textoABraille(texto) {
  const resultado = [];
  let modoNumero = false;
  let desconocidos = 0;

  for (let i = 0; i < texto.length; i++) {
    const char = texto[i];
    const lower = char.toLowerCase();

    if (char === " " || char === "\t") {
      modoNumero = false;
      resultado.push({ type: "space" });
      continue;
    }

    if (char === "\n" || char === "\r") {
      modoNumero = false;
      if (char === "\r" && texto[i + 1] === "\n") i++;
      resultado.push({ type: "newline" });
      continue;
    }

    if (char === "#") {
      resultado.push({ type: "cell", dots: SIGNO_NUMERO, label: "#", special: "número" });
      modoNumero = true;
      continue;
    }

    if (SIGNOS[char] !== undefined && typeof SIGNOS[char] !== "string") {
      // Si es coma o punto, y el siguiente carácter es un dígito (decimal), mantener modoNumero
      if ((char === "," || char === ".") && /\d/.test(texto[i + 1])) {
        resultado.push({ type: "cell", dots: SIGNOS[char], label: char });
        // conservar modoNumero tal como esté (no reiniciarlo)
        continue;
      }

      modoNumero = false;
      resultado.push({ type: "cell", dots: SIGNOS[char], label: char });
      continue;
    }

    if (DIGITOS_A_LETRA[char] !== undefined) {
      if (!modoNumero) {
        resultado.push({ type: "cell", dots: SIGNO_NUMERO, label: "#", special: "número" });
        modoNumero = true;
      }
      resultado.push({ type: "cell", dots: LETRAS[DIGITOS_A_LETRA[char]], label: char });
      continue;
    }

    const patron = patronLetra(char);
    if (patron !== null) {
      if (modoNumero) {
        if (LETRAS_SERIE_NUMERICA.includes(lower)) {
          resultado.push({ type: "cell", dots: SIGNO_LETRA_TRAS_NUMERO, label: "@", special: "letra" });
        }
        modoNumero = false;
      }

      if (esMayusculaBraille(char)) {
        const inicioSecuencia = i === 0 || !esMayusculaBraille(texto[i - 1]);
        if (inicioSecuencia) {
          insertarPrefijoMayuscula(resultado, contarMayusculasConsecutivas(texto, i));
        }
      }

      resultado.push({ type: "cell", dots: patron.dots, label: patron.label });
      continue;
    }

    modoNumero = false;
    desconocidos++;
    resultado.push({ type: "unknown", char });
  }

  return { celdas: resultado, desconocidos };
}

/**
 * Convierte una secuencia de celdas braille lógicas a una cadena Unicode braille.
 * @param {object[]} celdas - Array de elementos lógicos (celdas, espacios, saltos, desconocidos).
 * @param {{ espacioBraille?: boolean }} [opciones] - Opciones para representar espacios (braille o normal).
 * @returns {string} Cadena de caracteres Unicode braille equivalente.
 */
export function celdasAUnicode(celdas, opciones) {
  const espacio = opciones && opciones.espacioBraille ? "\u2800" : " ";
  let resultado = "";

  celdas.forEach((item) => {
    if (item.type === "space") {
      resultado += espacio;
      return;
    }
    if (item.type === "newline") {
      resultado += "\n";
      return;
    }
    if (item.type === "unknown") {
      resultado += item.char;
      return;
    }
    const celdaUnicode = dotsAUnicode(item.dots);
    resultado += item.mayusculaDoble ? celdaUnicode + celdaUnicode : celdaUnicode;
  });

  return resultado;
}

/**
 * Genera la cadena Unicode braille pensada para visualización en pantalla.
 * @param {object[]} celdas - Celdas braille lógicas a representar.
 * @returns {string} Cadena Unicode braille con espacios normales entre palabras.
 */
export function celdasAUnicodePantalla(celdas) {
  return celdasAUnicode(celdas, { espacioBraille: false });
}

/**
 * Genera la cadena Unicode braille pensada para impresión de señalética.
 * @param {object[]} celdas - Celdas braille lógicas a representar.
 * @returns {string} Cadena Unicode braille usando espacio braille entre palabras.
 */
export function celdasAUnicodeImpresion(celdas) {
  return celdasAUnicode(celdas, { espacioBraille: true });
}