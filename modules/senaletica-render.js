/**
 * Módulo de renderizado braille.
 * Construye la representación visual en el DOM de celdas braille y líneas de salida.
 */

/**
 * Crea el elemento DOM que representa una celda braille de 6 puntos.
 * @param {boolean[]} dots - Array de 6 booleanos indicando los puntos elevados.
 * @returns {HTMLDivElement} Elemento div con la cuadrícula de puntos.
 */
export function crearCelda(dots) {
  const celda = document.createElement("div");
  celda.className = "braille-cell";
  celda.setAttribute("role", "presentation");

  const ORDEN_VISUAL = [0, 3, 1, 4, 2, 5];
  ORDEN_VISUAL.forEach((idx) => {
    const punto = document.createElement("span");
    punto.className = "braille-dot" + (dots[idx] ? " raised" : "");
    punto.setAttribute("aria-hidden", "true");
    celda.appendChild(punto);
  });

  return celda;
}

/**
 * Envuelve una celda braille con su etiqueta de carácter y estilos adicionales.
 * @param {object} item - Objeto lógico de celda (incluye dots, label y banderas especiales).
 * @returns {HTMLElement} Contenedor con la celda braille y su etiqueta textual.
 */
export function crearCeldaConEtiqueta(item) {
  const wrapper = document.createElement("div");
  wrapper.className =
    "braille-cell-wrapper" + (item.mayusculaDoble ? " braille-cell-wrapper--mayus-doble" : "");

  if (item.mayusculaDoble) {
    const grupo = document.createElement("div");
    grupo.className = "braille-celdas-doble";
    grupo.setAttribute("role", "presentation");
    grupo.setAttribute("aria-label", "Indicador de mayúsculas de palabra");
    grupo.appendChild(crearCelda(item.dots));
    grupo.appendChild(crearCelda(item.dots));
    wrapper.appendChild(grupo);
  } else {
    const celda = crearCelda(item.dots);
    if (item.special) celda.setAttribute("data-label", item.special);
    wrapper.appendChild(celda);
  }

  if (item.special) wrapper.setAttribute("data-label", item.special);

  const label = document.createElement("span");
  label.className = "braille-char-label" + (item.special ? " is-special" : "");
  label.textContent = item.label;
  label.setAttribute("aria-hidden", "true");
  wrapper.appendChild(label);

  return wrapper;
}

/**
 * Crea una nueva línea contenedora de elementos braille dentro del resultado.
 * @param {HTMLElement} contenedor - Contenedor padre de la salida braille.
 * @returns {HTMLDivElement} Elemento div que representa una línea de salida.
 */
function crearLineaBraille(contenedor) {
  const linea = document.createElement("div");
  linea.className = "braille-line";
  contenedor.appendChild(linea);
  return linea;
}

/**
 * Renderiza una secuencia de celdas braille lógicas dentro de un contenedor del DOM.
 * @param {object[]} celdas - Lista de elementos lógicos (celdas, espacios, saltos, desconocidos).
 * @param {HTMLElement} contenedor - Elemento donde se dibujará la salida braille.
 * @returns {void}
 */
export function renderizarCeldas(celdas, contenedor) {
  contenedor.replaceChildren();
  let linea = crearLineaBraille(contenedor);

  celdas.forEach((item) => {
    if (item.type === "newline") {
      linea = crearLineaBraille(contenedor);
      return;
    }

    if (item.type === "space") {
      const gap = document.createElement("span");
      gap.className = "braille-word-gap";
      gap.setAttribute("aria-hidden", "true");
      linea.appendChild(gap);
      return;
    }

    if (item.type === "unknown") {
      const unk = document.createElement("span");
      unk.className = "braille-unknown";
      unk.title = "Carácter no soportado: " + item.char;
      unk.textContent = item.char;
      linea.appendChild(unk);
      return;
    }

    linea.appendChild(crearCeldaConEtiqueta(item));
  });

  if (linea.childNodes.length === 0) {
    linea.remove();
  }
}
