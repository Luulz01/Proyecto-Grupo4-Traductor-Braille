/**
 * Modulo de traduccion braille.
 * Convierte texto en espanol a celdas braille logicas y caracteres Unicode.
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
 * Convierte un patron de 6 puntos en el caracter Unicode braille equivalente.
 * @param {boolean[]} dots
 * @returns {string}
 */
function dotsAUnicode(dots) {
  let offset = 0;

  dots.forEach((activo, index) => {
    if (activo) {
      offset |= 1 << index;
    }
  });

  return String.fromCodePoint(0x2800 + offset);
}

/**
 * Verifica si un caracter tiene representacion en las tablas de letras.
 * @param {string} char
 * @returns {boolean}
 */
function esLetraTraducible(char) {
  const lower = char.toLowerCase();
  return LETRAS[lower] !== undefined || ACENTUADAS[lower] !== undefined;
}

/**
 * Verifica si un caracter traducible debe marcarse como mayuscula.
 * @param {string} char
 * @returns {boolean}
 */
function esMayusculaBraille(char) {
  return char !== char.toLowerCase() && esLetraTraducible(char);
}

/**
 * Cuenta letras mayusculas consecutivas desde una posicion del texto.
 * @param {string} texto
 * @param {number} desde
 * @returns {number}
 */
function contarMayusculasConsecutivas(texto, desde) {
  let cantidad = 0;

  for (let i = desde; i < texto.length && esMayusculaBraille(texto[i]); i++) {
    cantidad++;
  }

  return cantidad;
}

/**
 * Inserta el prefijo de mayuscula simple o doble segun la secuencia.
 * @param {object[]} resultado
 * @param {number} cantidadMayusculas
 * @returns {void}
 */
function insertarPrefijoMayuscula(resultado, cantidadMayusculas) {
  if (cantidadMayusculas >= 2) {
    resultado.push({
      type: "cell",
      dots: SIGNO_MAYUSCULA,
      label: "May.",
      special: "mayuscula",
    });
    resultado.push({
      type: "cell",
      dots: SIGNO_MAYUSCULA,
      label: "May.",
      special: "mayuscula",
    });
    return;
  }

  resultado.push({
    type: "cell",
    dots: SIGNO_MAYUSCULA,
    label: "May.",
    special: "mayuscula",
  });
}

/**
 * Obtiene el patron braille para una letra regular o acentuada.
 * @param {string} char
 * @returns {{ dots: boolean[], label: string } | null}
 */
function obtenerPatronLetra(char) {
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
 * Traduce texto en espanol a una secuencia de celdas braille logicas.
 * @param {string} texto
 * @returns {{ celdas: object[], desconocidos: number }}
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

      if (char === "\r" && texto[i + 1] === "\n") {
        i++;
      }

      resultado.push({ type: "newline" });
      continue;
    }

    if (DIGITOS_A_LETRA[char] !== undefined) {
      if (!modoNumero) {
        resultado.push({
          type: "cell",
          dots: SIGNO_NUMERO,
          label: "#",
          special: "numero",
        });
        modoNumero = true;
      }

      resultado.push({
        type: "cell",
        dots: LETRAS[DIGITOS_A_LETRA[char]],
        label: char,
      });
      continue;
    }

    const patron = obtenerPatronLetra(char);

    if (patron !== null) {
      if (modoNumero) {
        if (LETRAS_SERIE_NUMERICA.includes(lower)) {
          resultado.push({
            type: "cell",
            dots: SIGNO_LETRA_TRAS_NUMERO,
            label: "@",
            special: "letra",
          });
        }

        modoNumero = false;
      }

      if (esMayusculaBraille(char)) {
        const iniciaSecuencia = i === 0 || !esMayusculaBraille(texto[i - 1]);

        if (iniciaSecuencia) {
          insertarPrefijoMayuscula(resultado, contarMayusculasConsecutivas(texto, i));
        }
      }

      resultado.push({
        type: "cell",
        dots: patron.dots,
        label: patron.label,
      });
      continue;
    }

    if (SIGNOS[char] !== undefined && typeof SIGNOS[char] !== "string") {
      modoNumero = false;
      resultado.push({
        type: "cell",
        dots: SIGNOS[char],
        label: char,
      });
      continue;
    }

    modoNumero = false;
    desconocidos++;
    resultado.push({ type: "unknown", char });
  }

  return { celdas: resultado, desconocidos };
}

/**
 * Convierte celdas braille logicas a una cadena Unicode braille.
 * @param {object[]} celdas
 * @param {{ espacioBraille?: boolean }} [opciones]
 * @returns {string}
 */
export function celdasAUnicode(celdas, opciones = {}) {
  const espacio = opciones.espacioBraille ? "\u2800" : " ";

  return celdas
    .map((item) => {
      if (item.type === "space") {
        return espacio;
      }

      if (item.type === "newline") {
        return "\n";
      }

      if (item.type === "unknown") {
        return item.char;
      }

      return dotsAUnicode(item.dots);
    })
    .join("");
}

/**
 * Genera Unicode braille para visualizacion en pantalla.
 * @param {object[]} celdas
 * @returns {string}
 */
export function celdasAUnicodePantalla(celdas) {
  return celdasAUnicode(celdas, { espacioBraille: false });
}

/**
 * Genera Unicode braille para impresion o senaletica.
 * @param {object[]} celdas
 * @returns {string}
 */
export function celdasAUnicodeImpresion(celdas) {
  return celdasAUnicode(celdas, { espacioBraille: true });
}
