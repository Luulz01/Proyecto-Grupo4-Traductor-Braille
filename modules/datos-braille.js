/**
 * Módulo de datos braille.
 * Define los patrones de puntos y las tablas de signos para el braille español de grado 1 (ONCE B2).
 */

/**
 * Crea un patrón braille de 6 puntos a partir de los números de puntos activos.
 * @param {...number} dots - Números de punto activos (1 a 6).
 * @returns {boolean[]} Array de 6 booleanos con los puntos activos.
 */
function pattern(...dots) {
  const p = [false, false, false, false, false, false];
  dots.forEach((d) => {
    if (d >= 1 && d <= 6) p[d - 1] = true;
  });
  return p;
}

/** Prefijo numérico (puntos 3-4-5-6) usado antes de cifras. */
export const SIGNO_NUMERO = pattern(3, 4, 5, 6);

/** Prefijo de mayúscula (puntos 4-6) para indicar letras en mayúscula. */
export const SIGNO_MAYUSCULA = pattern(4, 6);

/** Prefijo (punto 5) que indica letra inmediatamente después de un número. */
export const SIGNO_LETRA_TRAS_NUMERO = pattern(5);

/** Letras de la primera serie usadas para representar los dígitos en braille. */
export const LETRAS_SERIE_NUMERICA = "abcdefghij";

/** Tabla de letras a–z y ñ en braille de 6 puntos. */
export const LETRAS = {
  a: pattern(1),
  b: pattern(1, 2),
  c: pattern(1, 4),
  d: pattern(1, 4, 5),
  e: pattern(1, 5),
  f: pattern(1, 2, 4),
  g: pattern(1, 2, 4, 5),
  h: pattern(1, 2, 5),
  i: pattern(2, 4),
  j: pattern(2, 4, 5),
  k: pattern(1, 3),
  l: pattern(1, 2, 3),
  m: pattern(1, 3, 4),
  n: pattern(1, 3, 4, 5),
  o: pattern(1, 3, 5),
  p: pattern(1, 2, 3, 4),
  q: pattern(1, 2, 3, 4, 5),
  r: pattern(1, 2, 3, 5),
  s: pattern(2, 3, 4),
  t: pattern(2, 3, 4, 5),
  u: pattern(1, 3, 6),
  v: pattern(1, 2, 3, 6),
  w: pattern(2, 4, 5, 6),
  x: pattern(1, 3, 4, 6),
  y: pattern(1, 3, 4, 5, 6),
  z: pattern(1, 3, 5, 6),
  ñ: pattern(1, 2, 4, 5, 6),
};

/** Tabla de vocales acentuadas y ü en braille. */
export const ACENTUADAS = {
  á: pattern(1, 2, 3, 5, 6),
  é: pattern(2, 3, 4, 6),
  í: pattern(3, 4),
  ó: pattern(3, 4, 6),
  ú: pattern(2, 3, 4, 5, 6),
  ü: pattern(1, 2, 5, 6),
};

/** Signos ortográficos básicos del braille español. */
export const SIGNOS = {
  " ": null,
  "\n": "newline",
  "\t": "space",
  ".": pattern(3),
  ",": pattern(2),
  ";": pattern(2, 3),
  ":": pattern(2, 5),
  "?": pattern(2, 6),
  "¿": pattern(2, 6),
  "!": pattern(2, 3, 5),
  "¡": pattern(2, 3, 5),
  "-": pattern(3, 6),
  "'": pattern(3),
  '"': pattern(2, 3, 6),
  "«": pattern(2, 3, 6),
  "»": pattern(2, 3, 6),
  "(": pattern(1, 2, 6),
  ")": pattern(3, 4, 5),
};

/** Mapa de dígitos decimales 0–9 a letras braille (tras el prefijo numérico). */
export const DIGITOS_A_LETRA = {
  "0": "j",
  "1": "a",
  "2": "b",
  "3": "c",
  "4": "d",
  "5": "e",
  "6": "f",
  "7": "g",
  "8": "h",
  "9": "i",
};

