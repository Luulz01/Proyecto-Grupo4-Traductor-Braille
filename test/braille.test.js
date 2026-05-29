import { textoABraille } from '../modules/traductor-base.js';
// ---------------------------------------------------------------------------
// TC-01: Texto básico en minúsculas
// ---------------------------------------------------------------------------
test('TC-01: Texto básico en minúsculas produce celdas válidas', () => {
  const { celdas, desconocidos } = textoABraille('hola mundo');
  expect(celdas.length).toBeGreaterThan(0);
  expect(desconocidos).toBe(0);
  expect(celdas.some(c => c.type === 'cell')).toBe(true);
  expect(celdas.some(c => c.type === 'space')).toBe(true);
});
// ---------------------------------------------------------------------------
// TC-02: Una sola mayúscula al inicio de palabra (mayusculaDoble: false)
// ---------------------------------------------------------------------------
test('TC-02: Una mayúscula sola genera indicador simple May.', () => {
  const { celdas } = textoABraille('Casa');

  // Primera celda: indicador de mayúscula simple
  expect(celdas[0].label).toBe('May.');
  expect(celdas[0].mayusculaDoble).toBeFalsy();

  // Segunda celda: la letra 'c' en minúscula
  expect(celdas[1].label).toBe('c');
});
// ---------------------------------------------------------------------------
// TC-03: Palabra completa en mayúsculas → indicador doble mayusculaDoble:true
// ---------------------------------------------------------------------------
test('TC-03: Palabra completa en mayúsculas genera indicador May.×2', () => {
  const { celdas } = textoABraille('HOLA');

  const indicador = celdas[0];
  expect(indicador.mayusculaDoble).toBe(true);
  expect(indicador.label).toBe('May.×2');

  // Después del indicador vienen las letras h-o-l-a
  expect(celdas[1].label).toBe('h');
  expect(celdas[4].label).toBe('a');
});
// ---------------------------------------------------------------------------
// TC-04: Vocales acentuadas
// ---------------------------------------------------------------------------
test('TC-04: Vocales acentuadas producen celdas correctas', () => {
  const { celdas, desconocidos } = textoABraille('áéíóú');

  expect(desconocidos).toBe(0);

  const labels = celdas.map(c => c.label);
  expect(labels).toContain('á');
  expect(labels).toContain('é');
  expect(labels).toContain('í');
  expect(labels).toContain('ó');
  expect(labels).toContain('ú');
});

// ---------------------------------------------------------------------------
// TC-05: Alfabeto completo español
// ---------------------------------------------------------------------------
test('TC-05: Todas las letras del alfabeto español generan celdas válidas', () => {
  const { celdas, desconocidos } = textoABraille('abcdefghijklmnñopqrstuvwxyz');
  expect(desconocidos).toBe(0);
  const labels = celdas
    .filter(c => c.type === 'cell')
    .map(c => c.label);
  expect(labels).toContain('a');
  expect(labels).toContain('m');
  expect(labels).toContain('ñ');
  expect(labels).toContain('z');
  expect(celdas.length).toBeGreaterThan(20);
});
// ---------------------------------------------------------------------------
// TC-06: Vocal ü
// ---------------------------------------------------------------------------
test('TC-06: La vocal ü se traduce correctamente en una palabra', () => {
  const { celdas, desconocidos } = textoABraille('pingüino');

  expect(desconocidos).toBe(0);

  const labels = celdas.map(c => c.label);

  expect(labels).toContain('ü');
});

// ---------------------------------------------------------------------------
// TC-07: Signos de puntuación
// ---------------------------------------------------------------------------
test('TC-07: Los signos de puntuación generan celdas Braille válidas', () => {
  const texto = '"Hola, mundo; ¿cómo estás? ¡Bien!"';

  const { celdas, desconocidos } = textoABraille(texto);

  expect(desconocidos).toBe(0);

  const labels = celdas.map(c => c.label);

  expect(labels).toContain(',');
  expect(labels).toContain(';');
  expect(labels).toContain('¿');
  expect(labels).toContain('?');
  expect(labels).toContain('¡');
  expect(labels).toContain('!');
});

// ---------------------------------------------------------------------------
// TC-08: Números del 0 al 9
// ---------------------------------------------------------------------------
test('TC-08: Los números del 0 al 9 generan prefijo numérico y celdas válidas', () => {
  const { celdas, desconocidos } = textoABraille('0123456789');

  expect(desconocidos).toBe(0);

  // Primera celda = indicador numérico
  expect(celdas[0].special).toBe('número');

  const labels = celdas.map(c => c.label);

  expect(labels).toContain('0');
  expect(labels).toContain('1');
  expect(labels).toContain('5');
  expect(labels).toContain('9');

  // Prefijo + 10 dígitos
  expect(celdas.length).toBe(11);
});
// ---------------------------------------------------------------------------
// TC-09: Operadores matemáticos básicos
// ---------------------------------------------------------------------------
test('TC-09: Operadores matemáticos básicos no generan desconocidos', () => {
  const { desconocidos } = textoABraille('(3 + 5) * 2 - 4 / 2');
  expect(desconocidos).toBe(0);
});
// ---------------------------------------------------------------------------
// TC-10: Fecha con guiones
// ---------------------------------------------------------------------------
test('TC-10: Fecha con guiones 25-11-2025 se traduce correctamente', () => {
  const { celdas, desconocidos } = textoABraille('25-11-2025');
  expect(desconocidos).toBe(0);
  expect(celdas.length).toBeGreaterThan(0);
});

// ---------------------------------------------------------------------------
// TC-11: Palabra con tilde í (sandía)
// ---------------------------------------------------------------------------
test('TC-11: Palabra sandía con vocal acentuada í se traduce correctamente', () => {
  const { celdas, desconocidos } = textoABraille('sandía');
  expect(desconocidos).toBe(0);
  expect(celdas.length).toBe(6);
});

// ---------------------------------------------------------------------------
// TC-12: Siglas con guión FIS-EPN
// ---------------------------------------------------------------------------
test('TC-12: Siglas FIS-EPN con mayúsculas y guión se traducen correctamente', () => {
  const { celdas, desconocidos } = textoABraille('FIS-EPN');
  expect(desconocidos).toBe(0);
  expect(celdas[0].mayusculaDoble).toBe(true);
});

// ---------------------------------------------------------------------------
// TC-13: Número con coma decimal no debe repetir prefijo #
// ---------------------------------------------------------------------------
test('TC-13: Número con coma decimal 20,15 no genera prefijo # doble', () => {
  const { celdas } = textoABraille('20,15');
  // Contar cuántos prefijos # hay
  const prefijos = celdas.filter(c => c.special === 'número');
  expect(prefijos.length).toBe(1); // solo uno al inicio
});

// ---------------------------------------------------------------------------
// TC-14: Número con punto decimal no debe repetir prefijo #
// ---------------------------------------------------------------------------
test('TC-14: Número con punto decimal 46.37 no genera prefijo # doble', () => {
  const { celdas } = textoABraille('46.37');

  // Contar cuántos prefijos # existen
  const prefijos = celdas.filter(c => c.special === 'número');

  expect(prefijos.length).toBe(1); // solo uno al inicio
});

// ---------------------------------------------------------------------------
// TC-15: Múltiples espacios consecutivos
// ---------------------------------------------------------------------------
test('TC-15: Múltiples espacios consecutivos se mantienen correctamente', () => {
  const { celdas, desconocidos } = textoABraille('hola     mundo');

  expect(desconocidos).toBe(0);

  const espacios = celdas.filter(c => c.type === 'space');
  expect(espacios.length).toBe(5);

  // Verificar primera y última palabra
  expect(celdas[0].label).toBe('h');
  expect(celdas[celdas.length - 1].label).toBe('o');
});

