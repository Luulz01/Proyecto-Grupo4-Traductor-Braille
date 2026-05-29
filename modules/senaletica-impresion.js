/**
 * Módulo de señalética braille para impresión.
 * Gestiona el contenido y el disparo de impresión de la placa de señalética accesible.
 */

import { celdasAUnicodeImpresion } from "./traductor-base.js";

/**
 * Estructura de elementos del DOM asociados a la placa de señalética.
 * @typedef {Object} ElementosSenaletica
 * @property {HTMLElement} senaleticaTexto - Contenedor del texto en tinta.
 * @property {HTMLElement} senaleticaBraille - Contenedor del texto en braille Unicode.
 * @property {HTMLElement} senaleticaImpresion - Contenedor raíz de la placa imprimible.
 */

/**
 * Actualiza el contenido de la placa de señalética con texto en tinta y braille.
 * @param {string} textoOriginal - Texto original en español a mostrar en tinta.
 * @param {object[]} celdas - Celdas braille lógicas generadas a partir del texto.
 * @param {ElementosSenaletica} elementos - Referencias a los elementos de la placa.
 * @returns {void}
 */
export function actualizarSenaleticaImpresion(textoOriginal, celdas, elementos) {
  elementos.senaleticaTexto.textContent = textoOriginal.trim();
  elementos.senaleticaBraille.textContent = celdasAUnicodeImpresion(celdas);
}

/**
 * Genera la señalética en el DOM y abre el diálogo de impresión del navegador.
 * @param {HTMLTextAreaElement} entrada - Área de texto de donde se toma el texto original.
 * @param {object[]} ultimasCeldas - Últimas celdas braille generadas por el traductor.
 * @param {ElementosSenaletica} elementos - Referencias a los elementos de la placa.
 * @returns {void}
 */
export function imprimirSenaletica(entrada, ultimasCeldas, elementos) {
  if (!ultimasCeldas.length || !entrada.value.trim()) {
    return;
  }
  actualizarSenaleticaImpresion(entrada.value, ultimasCeldas, elementos);
  elementos.senaleticaImpresion.setAttribute("aria-hidden", "false");
  window.print();
  elementos.senaleticaImpresion.setAttribute("aria-hidden", "true");
}
