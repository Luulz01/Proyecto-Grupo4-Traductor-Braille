/**
 * Módulo de señalética braille para impresión.
 * Gestiona el contenido y el disparo de impresión de la placa de señalética accesible.
 * Es agnóstico de la dirección de traducción: recibe directamente el texto en tinta
 * y la cadena braille Unicode ya resueltos, sea que provengan de Texto→Braille o de Braille→Texto.
 */

/**
 * Estructura de elementos del DOM asociados a la placa de señalética.
 * @typedef {Object} ElementosSenaletica
 * @property {HTMLElement} senaleticaTexto - Contenedor del texto en tinta.
 * @property {HTMLElement} senaleticaBraille - Contenedor del texto en braille Unicode.
 * @property {HTMLElement} senaleticaImpresion - Contenedor raíz de la placa imprimible.
 */

/**
 * Sustituye los espacios normales por el espacio braille (U+2800) para que la placa
 * impresa mantenga celdas de ancho uniforme, incluso en los tramos sin puntos.
 * @param {string} textoBraille - Cadena Unicode braille con espacios normales.
 * @returns {string} Cadena equivalente con espacios braille.
 */
function espaciosABraille(textoBraille) {
  return textoBraille.replace(/ /g, "\u2800");
}

/**
 * Actualiza el contenido de la placa de señalética con texto en tinta y braille.
 * @param {string} textoTinta - Texto en tinta (español) a mostrar en la placa.
 * @param {string} textoBraille - Cadena Unicode braille a mostrar en la placa.
 * @param {ElementosSenaletica} elementos - Referencias a los elementos de la placa.
 * @returns {void}
 */
export function actualizarSenaleticaImpresion(textoTinta, textoBraille, elementos) {
  elementos.senaleticaTexto.textContent = textoTinta.trim();
  elementos.senaleticaBraille.textContent = espaciosABraille(textoBraille);
}

/**
 * Genera la señalética en el DOM y abre el diálogo de impresión del navegador.
 * @param {string} textoTinta - Texto en tinta (español) a imprimir.
 * @param {string} textoBraille - Cadena Unicode braille a imprimir.
 * @param {ElementosSenaletica} elementos - Referencias a los elementos de la placa.
 * @param {boolean} [espejo] - Si es verdadero, imprime el bloque braille en espejo (relieve manual con punzón).
 * @returns {void}
 */
export function imprimirSenaletica(textoTinta, textoBraille, elementos, espejo) {
  if (!textoBraille.trim() || !textoTinta.trim()) {
    return;
  }
  actualizarSenaleticaImpresion(textoTinta, textoBraille, elementos);

  if (espejo) {
    elementos.senaleticaBraille.classList.add("espejo");
  } else {
    elementos.senaleticaBraille.classList.remove("espejo");
  }

  elementos.senaleticaImpresion.setAttribute("aria-hidden", "false");
  window.print();
  elementos.senaleticaImpresion.setAttribute("aria-hidden", "true");
  elementos.senaleticaBraille.classList.remove("espejo");
}
