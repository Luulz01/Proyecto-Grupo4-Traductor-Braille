/**
 * Módulo de traducción inversa braille.
 * Convierte texto en braille (caracteres Unicode o patrón de puntos) a texto en español.
 */

import {
  PATRON_A_CARACTER,
  clavePatron,
  SIGNO_NUMERO,
  SIGNO_MAYUSCULA,
  SIGNO_LETRA_TRAS_NUMERO,
  LETRAS,
  ACENTUADAS,
  DIGITOS_A_LETRA,
} from "./datos-braille.js";
import { unicodeADots, dotsAUnicode } from "./traductor-base.js";

/** Mapa inverso de la serie numérica: letra braille a–j → dígito 0–9. */
const LETRA_A_DIGITO = {};
for (const [digito, letra] of Object.entries(DIGITOS_A_LETRA)) {
  LETRA_A_DIGITO[letra] = digito;
}

const CLAVE_NUMERO = clavePatron(SIGNO_NUMERO);
const CLAVE_MAYUSCULA = clavePatron(SIGNO_MAYUSCULA);
const CLAVE_LETRA_TRAS_NUMERO = clavePatron(SIGNO_LETRA_TRAS_NUMERO);

/**
 * Indica si un carácter corresponde a una letra traducible (a–z, ñ, acentuadas).
 * @param {string} char - Carácter a evaluar.
 * @returns {boolean} Verdadero si es letra en las tablas braille.
 */
function esLetraBraille(char) {
  const lower = char.toLowerCase();
  return LETRAS[lower] !== undefined || ACENTUADAS[lower] !== undefined;
}

/**
 * Convierte un patrón de 6 puntos en su carácter Unicode braille.
 * @param {boolean[]} dots - Array de 6 booleanos con los puntos activos.
 * @returns {string} Carácter Unicode braille resultante.
 */
export function dotsAUnicodePublic(dots) {
  return dotsAUnicode(dots);
}

/**
 * Traduce una cadena de braille (caracteres Unicode U+2800–U+283F, espacios y saltos)
 * a texto en español.
 * @param {string} entrada - Texto braille a traducir.
 * @returns {{ texto: string, desconocidos: number }} Texto en español y cuenta de celdas no reconocidas.
 */
export function brailleATexto(entrada) {
  let texto = "";
  let desconocidos = 0;
  let modoNumero = false;
  let mayusculaPalabra = false;
  let mayusculaSimple = false;

  const chars = Array.from(entrada);

  for (let i = 0; i < chars.length; i++) {
    const char = chars[i];

    if (char === " " || char === " " || char === "\n" || char === "\r") {
      modoNumero = false;
      mayusculaPalabra = false;
      texto += char === "\r" ? "\n" : char;
      continue;
    }

    const cp = char.codePointAt(0);
    if (cp < 0x2800 || cp > 0x283f) {
      // No es un carácter braille: se trata como carácter literal desconocido.
      desconocidos++;
      continue;
    }

    const dots = unicodeADots(char);
    const clave = clavePatron(dots);

    if (clave === CLAVE_NUMERO) {
      modoNumero = true;
      continue;
    }

    if (clave === CLAVE_LETRA_TRAS_NUMERO) {
      modoNumero = false;
      continue;
    }

    if (clave === CLAVE_MAYUSCULA) {
      const siguiente = chars[i + 1];
      const cpSiguiente = siguiente ? siguiente.codePointAt(0) : -1;
      const esOtraMayuscula = cpSiguiente >= 0x2800 && cpSiguiente <= 0x283f &&
        clavePatron(unicodeADots(siguiente)) === CLAVE_MAYUSCULA;
      if (esOtraMayuscula) {
        mayusculaPalabra = true;
        i++; // consumir la segunda celda del indicador doble
      } else {
        mayusculaSimple = true;
      }
      continue;
    }

    const caracter = PATRON_A_CARACTER[clave];
    if (caracter === undefined) {
      desconocidos++;
      continue;
    }

    if (esLetraBraille(caracter)) {
      const lower = caracter.toLowerCase();
      if (modoNumero && LETRA_A_DIGITO[lower] !== undefined) {
        texto += LETRA_A_DIGITO[lower];
        continue;
      }

      let salida = caracter;
      if (mayusculaPalabra || mayusculaSimple) {
        salida = salida.toUpperCase();
      }
      mayusculaSimple = false;
      texto += salida;
      continue;
    }

    // Signo de puntuación u otro símbolo.
    if (caracter === "," || caracter === ".") {
      // Mantener modo número para decimales.
    } else {
      modoNumero = false;
    }
    texto += caracter;
  }

  return { texto, desconocidos };
}
