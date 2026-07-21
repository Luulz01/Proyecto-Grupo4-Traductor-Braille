import { textoABraille, celdasAUnicodePantalla, dotsAUnicode } from '../modules/traductor-base.js';
import { brailleATexto } from '../modules/traductor-inverso.js';
import { LETRAS } from '../modules/datos-braille.js';

/**
 * Traduce un texto a braille (pantalla) y lo vuelve a traducir a texto.
 * @param {string} texto - Texto original en español.
 * @returns {{ resultado: string, desconocidos: number }} Texto decodificado y celdas no reconocidas.
 */
function idaYVuelta(texto) {
  const { celdas } = textoABraille(texto);
  const unicode = celdasAUnicodePantalla(celdas);
  const { texto: resultado, desconocidos } = brailleATexto(unicode);
  return { resultado, desconocidos };
}

// ---------------------------------------------------------------------------
// TC-INV-01: Texto básico en minúsculas (ida y vuelta)
// ---------------------------------------------------------------------------
test('TC-INV-01: Braille básico en minúsculas se traduce de vuelta a texto', () => {
  const { resultado, desconocidos } = idaYVuelta('hola mundo');
  expect(resultado).toBe('hola mundo');
  expect(desconocidos).toBe(0);
});


// ---------------------------------------------------------------------------
// TC-INV-02: Indicador de mayúscula simple (una sola letra)
// ---------------------------------------------------------------------------
test('TC-INV-02: El indicador de mayúscula simple solo afecta a la primera letra', () => {
  const { resultado, desconocidos } = idaYVuelta('Casa');
  expect(resultado).toBe('Casa');
  expect(desconocidos).toBe(0);
});


// ---------------------------------------------------------------------------
// TC-INV-03: Indicador de mayúscula doble (palabra completa)
// ---------------------------------------------------------------------------
test('TC-INV-03: El indicador de mayúscula doble pone en mayúscula toda la palabra', () => {
  const { resultado, desconocidos } = idaYVuelta('HOLA');
  expect(resultado).toBe('HOLA');
  expect(desconocidos).toBe(0);
});

// ---------------------------------------------------------------------------
// TC-INV-04: Vocales acentuadas
// ---------------------------------------------------------------------------
test('TC-INV-04: Las vocales acentuadas se decodifican correctamente', () => {
  const { resultado, desconocidos } = idaYVuelta('áéíóú');
  expect(resultado).toBe('áéíóú');
  expect(desconocidos).toBe(0);
});


// ---------------------------------------------------------------------------
// TC-INV-05: Alfabeto completo español
// ---------------------------------------------------------------------------
test('TC-INV-05: Todo el alfabeto español se decodifica correctamente', () => {
  const { resultado, desconocidos } = idaYVuelta('abcdefghijklmnñopqrstuvwxyz');
  expect(resultado).toBe('abcdefghijklmnñopqrstuvwxyz');
  expect(desconocidos).toBe(0);
});

// ---------------------------------------------------------------------------
// TC-INV-06: Vocal ü
// ---------------------------------------------------------------------------
test('TC-INV-06: La vocal ü se decodifica correctamente dentro de una palabra', () => {
  const { resultado, desconocidos } = idaYVuelta('pingüino');
  expect(resultado).toBe('pingüino');
  expect(desconocidos).toBe(0);
});

// ---------------------------------------------------------------------------
// TC-INV-07: Números 0-9 con prefijo numérico
// ---------------------------------------------------------------------------
test('TC-INV-07: Los números 0-9 se decodifican correctamente a partir del prefijo numérico', () => {
  const { resultado, desconocidos } = idaYVuelta('0123456789');
  expect(resultado).toBe('0123456789');
  expect(desconocidos).toBe(0);
});

// ---------------------------------------------------------------------------
// TC-INV-08: Letra inmediatamente después de un número (indicador @)
// ---------------------------------------------------------------------------
test('TC-INV-08: Una letra de la serie numérica tras un número se decodifica como letra, no como dígito', () => {
  const { resultado, desconocidos } = idaYVuelta('5c');
  expect(resultado).toBe('5c');
  expect(desconocidos).toBe(0);
});

// ---------------------------------------------------------------------------
// TC-INV-09: Números con coma o punto decimal
// ---------------------------------------------------------------------------
test('TC-INV-09: Los números con coma o punto decimal se decodifican sin duplicar el prefijo', () => {
  expect(idaYVuelta('20,15').resultado).toBe('20,15');
  expect(idaYVuelta('46.37').resultado).toBe('46.37');
});

// ---------------------------------------------------------------------------
// TC-INV-10: Fecha con guiones
// ---------------------------------------------------------------------------
test('TC-INV-10: Una fecha con guiones se decodifica correctamente', () => {
  const { resultado, desconocidos } = idaYVuelta('25-11-2025');
  expect(resultado).toBe('25-11-2025');
  expect(desconocidos).toBe(0);
});


// ---------------------------------------------------------------------------
// TC-INV-11: Siglas con guion y mayúsculas (FIS-EPN)
// ---------------------------------------------------------------------------
test('TC-INV-11: Siglas con guion y mayúsculas se decodifican correctamente', () => {
  const { resultado, desconocidos } = idaYVuelta('FIS-EPN');
  expect(resultado).toBe('FIS-EPN');
  expect(desconocidos).toBe(0);
});

// ---------------------------------------------------------------------------
// TC-INV-12: Múltiples espacios consecutivos
// ---------------------------------------------------------------------------
test('TC-INV-12: Los espacios múltiples se preservan al decodificar', () => {
  const { resultado, desconocidos } = idaYVuelta('hola     mundo');
  expect(resultado).toBe('hola     mundo');
  expect(desconocidos).toBe(0);
});

// ---------------------------------------------------------------------------
// TC-INV-13: Signos de puntuación sin ambigüedad
// ---------------------------------------------------------------------------
test('TC-INV-13: Los signos sin celda compartida se decodifican tal cual', () => {
  const { resultado, desconocidos } = idaYVuelta('Hola, mundo; ! ? : ( ) *');
  expect(resultado).toBe('Hola, mundo; ! ? : ( ) *');
  expect(desconocidos).toBe(0);
});

// ---------------------------------------------------------------------------
// TC-INV-14: El apóstrofe comparte celda con el punto
// ---------------------------------------------------------------------------
test('TC-INV-14: El apóstrofe comparte celda con el punto y se decodifica como "."', () => {
  const { celdas } = textoABraille("'");
  const unicode = celdasAUnicodePantalla(celdas);
  expect(brailleATexto(unicode).texto).toBe('.');
});

// ---------------------------------------------------------------------------
// TC-INV-15: ¿ y ¡ ahora se distinguen de ? y ! por contexto (apertura vs. cierre)
// ---------------------------------------------------------------------------
test('TC-INV-15: Los signos de apertura ¿/¡ se distinguen de sus cierres por posición en la frase', () => {
  expect(idaYVuelta('¿cómo?').resultado).toBe('¿cómo?');
  expect(idaYVuelta('¡Bien!').resultado).toBe('¡Bien!');
  expect(idaYVuelta('¿Vienes hoy? Claro que sí').resultado).toBe('¿Vienes hoy? Claro que sí');
});


// ---------------------------------------------------------------------------
// TC-INV-16: Las comillas angulares «» siguen sin distinguirse de las rectas
// ---------------------------------------------------------------------------
test('TC-INV-16: Las comillas angulares «» se decodifican como comillas rectas "', () => {
  const { celdas } = textoABraille('«cita»');
  const resultado = brailleATexto(celdasAUnicodePantalla(celdas)).texto;
  expect(resultado).toBe('"cita"');
});

// ---------------------------------------------------------------------------
// TC-INV-17: + y / ahora se distinguen de ¡/!/í por contexto numérico
// ---------------------------------------------------------------------------
test('TC-INV-17: Los operadores + y / se distinguen correctamente en contexto numérico', () => {
  expect(idaYVuelta('3 + 5').resultado).toBe('3 + 5');
  expect(idaYVuelta('3 / 4').resultado).toBe('3 / 4');
  expect(idaYVuelta('(3 + 5) * 2 - 4 / 2').resultado).toBe('(3 + 5) * 2 - 4 / 2');
});

// ---------------------------------------------------------------------------
// TC-INV-18: LIMITACIÓN CONOCIDA — í pegada a un signo de puntuación (sin
// espacio de por medio) se confunde con /. Se documenta a propósito, sin
// pasar por el codificador, para dejar registrado el caso exacto que falla
// y que no se pierda de vista al reportarlo o corregirlo. Si en el futuro
// se ajusta `desambiguar`/la heurística de í en traductor-inverso.js, esta
// prueba debe actualizarse para reflejar el resultado correcto ('Sí.').
// ---------------------------------------------------------------------------
test('TC-INV-18 [LIMITACIÓN CONOCIDA]: una í seguida de puntuación sin espacio se decodifica como "/"', () => {
  const { celdas } = textoABraille('Sí.');
  const resultado = brailleATexto(celdasAUnicodePantalla(celdas)).texto;
  // Comportamiento actual (incorrecto): debería ser 'Sí.' y da 'S/.'.
  expect(resultado).toBe('S/.');
});

// ---------------------------------------------------------------------------
// TC-INV-19: Carácter que no es braille Unicode
// ---------------------------------------------------------------------------
test('TC-INV-20: Un carácter fuera del rango braille cuenta como desconocido y no aparece en el texto', () => {
  const { texto, desconocidos } = brailleATexto('a');
  expect(texto).toBe('');
  expect(desconocidos).toBe(1);
});

// ---------------------------------------------------------------------------
// TC-INV-20: Cadena vacía
// ---------------------------------------------------------------------------
test('TC-INV-21: Una cadena vacía no genera texto ni desconocidos', () => {
  const { texto, desconocidos } = brailleATexto('');
  expect(texto).toBe('');
  expect(desconocidos).toBe(0);
});

// ---------------------------------------------------------------------------
// TC-INV-21: Tabulador tratado como separador (corrección del bug \xa0)
// El codificador Texto→Braille normaliza tabs y espacios a un mismo tipo de
// celda "space", así que aquí se construye el braille a mano para probar
// directamente que brailleATexto reconoce un tabulador literal como
// separador (antes de esta corrección comparaba con un carácter \xa0 que
// nunca podía llegar desde el constructor visual ni desde texto pegado).
// ---------------------------------------------------------------------------
test('TC-INV-22: Un tabulador entre celdas braille se trata como separador de palabras', () => {
  const hola =
    dotsAUnicode(LETRAS.h) + dotsAUnicode(LETRAS.o) + dotsAUnicode(LETRAS.l) + dotsAUnicode(LETRAS.a);
  const mundo =
    dotsAUnicode(LETRAS.m) +
    dotsAUnicode(LETRAS.u) +
    dotsAUnicode(LETRAS.n) +
    dotsAUnicode(LETRAS.d) +
    dotsAUnicode(LETRAS.o);
  const { texto, desconocidos } = brailleATexto(hola + '\t' + mundo);
  expect(texto).toBe('hola\tmundo');
  expect(desconocidos).toBe(0);
});
