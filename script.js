import { iniciarApp } from "./modules/interfaz.js";

iniciarApp();
iniciarModoToggle();

/**
 * Alterna entre las dos vistas principales de la app (Texto a Braille / Braille a Texto)
 * para mostrar solo un bloque a la vez y evitar la página sobrecargada.
 * @returns {void}
 */
function iniciarModoToggle() {
  const btnModoTexto = document.getElementById("btn-modo-texto");
  const btnModoBraille = document.getElementById("btn-modo-braille");
  const panelTexto = document.getElementById("modo-panel-texto");
  const panelBraille = document.getElementById("modo-panel-braille");

  if (!btnModoTexto || !btnModoBraille || !panelTexto || !panelBraille) {
    console.error("Faltan elementos del selector de modo en el DOM.");
    return;
  }

  function activarModo(modo) {
    const esTexto = modo === "texto";

    panelTexto.hidden = !esTexto;
    panelBraille.hidden = esTexto;

    btnModoTexto.classList.toggle("activo", esTexto);
    btnModoBraille.classList.toggle("activo", !esTexto);
    btnModoTexto.setAttribute("aria-pressed", String(esTexto));
    btnModoBraille.setAttribute("aria-pressed", String(!esTexto));

    if (!esTexto) {
      const entradaBraille = document.getElementById("entrada-braille");
      if (entradaBraille) entradaBraille.focus();
    }
  }

  btnModoTexto.addEventListener("click", () => activarModo("texto"));
  btnModoBraille.addEventListener("click", () => activarModo("braille"));
}
