/**
 * Módulo de traducción inversa braille.
 * Convierte texto en braille (caracteres Unicode o patrón de puntos) a texto en español
 */

import {
  PATRON_A_CARACTER,
  clavePatron,
  SIGNO_NUMERO,
  SIGNO_MAYUSCULA,
  SIGNO_LETRA_TRAS_NUMERO,
  LETRAS,
  ACENTUADAS,
  SIGNOS,
  DIGITOS_A_LETRA,
} from "./datos-braille.js";
import { unicodeADots, dotsAUnicode } from "./traductor-base.js";

/** Mapa inverso de la serie numérica: letra braille a–j → dígito 0–9. */
const LETRA_A_DIGITO = {};
for (const [digito, letra] of Object.entries(DIGITOS_A_LETRA)) {
  LETRA_A_DIGITO[letra] = digito;
}

/** Clave de patrón → dígito, para detectar contexto numérico al desambiguar. */
const PATRON_DIGITO = {};
for (const [digito, letra] of Object.entries(DIGITOS_A_LETRA)) {
  if (LETRAS[letra]) PATRON_DIGITO[clavePatron(LETRAS[letra])] = digito;
}

/** Claves de patrones correspondientes a operadores matemáticos. */
const PATRON_OPERADOR = (() => {
  const mapa = {};
  for (const [signo, patron] of Object.entries(SIGNOS)) {
    if (Array.isArray(patron) && "+-*/()".includes(signo)) {
      mapa[clavePatron(patron)] = signo;
    }
  }
  return mapa;
})();

const CLAVE_NUMERO = clavePatron(SIGNO_NUMERO);
const CLAVE_MAYUSCULA = clavePatron(SIGNO_MAYUSCULA);
const CLAVE_LETRA_TRAS_NUMERO = clavePatron(SIGNO_LETRA_TRAS_NUMERO);

/** Claves de patrones compartidos que requieren desambiguación por contexto. */
const CLAVE_I_DIV = "3-4"; // í (vocal) / / (división)
const CLAVE_SUMA = "2-3-5"; // + (suma) / ¡ / !
const CLAVE_INT = "2-6"; // ¿ (apertura) / ? (cierre)

/**
 * Desambigúa celdas braille cuyo patrón se comparte con otro carácter, usando
 * el contexto (inicio de cláusula o entorno numérico/operador).
 * Resuelve ¿/?, ¡/!/+, í/ y ' por entorno.
 * @param {string} clave - Clave de patrón de la celda actual.
 * @param {string} charAnterior - Último carácter ya volcado al texto (o "").
 * @param {string|null} claveSiguiente - Clave de patrón de la siguiente celda (o null).
 * @returns {string|null} Carácter resuelto o null si la celda no es ambigua.
 */
function desambiguar(clave, charAnterior, claveSiguiente) {
  const inicioClausula = charAnterior === "" || /\s/.test(charAnterior);
  const antNumOp = charAnterior === "" || /[\d()+\-*/]/.test(charAnterior);
  const sigNumOp =
    claveSiguiente !== null &&
    (PATRON_DIGITO[claveSiguiente] !== undefined ||
      PATRON_OPERADOR[claveSiguiente] !== undefined);
  const ctxNum = antNumOp && sigNumOp;

  if (clave === CLAVE_I_DIV) {
    // í (vocal) frente a / (división): se decide por contexto numérico.
    return ctxNum ? "/" : "í";
  }
  if (clave === CLAVE_SUMA) {
    // + (suma) frente a ¡/!: contexto numérico → +, si no, apertura/cierre.
    if (ctxNum) return "+";
    return inicioClausula ? "¡" : "!";
  }
  if (clave === CLAVE_INT) {
    // ¿ (apertura) frente a ? (cierre): apertura al inicio de cláusula.
    return inicioClausula ? "¿" : "?";
  }
  return null;
}

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

    if (char === " " || char === "\t" || char === "\n" || char === "\r") {
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

    // Siguiente celda braille ignorando espacios, saltos y el prefijo numérico
    // (para contexto numérico/operador).
    let claveSiguiente = null;
    for (let k = i + 1; k < chars.length; k++) {
      const cpK = chars[k].codePointAt(0);
      if (cpK === 0x20 || cpK === 0x09 || cpK === 0x0a || cpK === 0x0d) continue;
      if (cpK < 0x2800 || cpK > 0x283f) break;
      const claveK = clavePatron(unicodeADots(chars[k]));
      if (claveK === CLAVE_NUMERO) continue; // saltar prefijo numérico
      claveSiguiente = claveK;
      break;
    }

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

    // Último carácter ya volcado, ignorando espacios (para contexto).
    let charAnterior = "";
    for (let k = texto.length - 1; k >= 0; k--) {
      if (!/\s/.test(texto[k])) {
        charAnterior = texto[k];
        break;
      }
    }

    // Celdas con patrón compartido letra/símbolo (í/í, +/¡/!): resolver por
    // contexto antes de decidir si es letra o signo.
    if (clave === CLAVE_I_DIV || clave === CLAVE_SUMA) {
      let resuelto;
      if (clave === CLAVE_I_DIV) {
        // í (vocal) frente a / (división): la vocal aparece dentro de una
        // palabra (letras adyacentes), la barra queda separada por espacios.
        const prevAdy = texto.slice(-1);
        const sigChar = chars[i + 1];
        const sigCp = sigChar ? sigChar.codePointAt(0) : -1;
        const sigEsEspacio =
          sigCp < 0 || sigCp === 0x20 || sigCp === 0x09 || sigCp === 0x0a || sigCp === 0x0d;
        let sigLetra = false;
        if (sigCp >= 0x2800 && sigCp <= 0x283f) {
          const cS = PATRON_A_CARACTER[clavePatron(unicodeADots(sigChar))];
          sigLetra = esLetraBraille(cS || "");
        }
        const prevLetra = /[a-záéíóúüñ]/i.test(prevAdy);
        const esVocal =
          (prevLetra && sigLetra) ||
          (prevAdy === "" && sigLetra) ||
          (prevLetra && sigEsEspacio);
        resuelto = esVocal ? "í" : "/";
      } else {
        resuelto = desambiguar(clave, charAnterior, claveSiguiente);
      }
      if (resuelto !== null) {
        if (esLetraBraille(resuelto)) {
          let salida = resuelto;
          if (mayusculaPalabra || mayusculaSimple) salida = salida.toUpperCase();
          mayusculaSimple = false;
          texto += salida;
        } else {
          if (resuelto === "," || resuelto === ".") {
            // Mantener modo número para decimales.
          } else {
            modoNumero = false;
            mayusculaPalabra = false;
          }
          texto += resuelto;
        }
        continue;
      }
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
    let salida = caracter;
    const desambiguado = desambiguar(clave, charAnterior, claveSiguiente);
    if (desambiguado !== null) salida = desambiguado;

    if (salida === "," || salida === ".") {
      // Mantener modo número para decimales.
    } else {
      modoNumero = false;
      // El indicador de palabra en mayúsculas solo abarca la palabra actual.
      mayusculaPalabra = false;
    }
    texto += salida;
  }

  return { texto, desconocidos };
}
