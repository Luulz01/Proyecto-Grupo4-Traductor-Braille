const { textoABraille } = require('./modules/brailleTranslator');

test('TC-01: Texto básico en minúsculas produce celdas válidas', () => {
  const { celdas, desconocidos } = textoABraille('hola mundo');
  expect(celdas.length).toBeGreaterThan(0);
  expect(desconocidos).toBe(0);
  expect(celdas.some(c => c.type === 'cell')).toBe(true);
  expect(celdas.some(c => c.type === 'space')).toBe(true);
});