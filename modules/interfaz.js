/**
 * Módulo de interfaz de usuario braille.
 * Orquesta los módulos de traducción, renderizado y señalética, y gestiona los eventos de la UI.
 */

import { textoABraille, celdasAUnicodePantalla } from "./traductor-base.js";
import { renderizarCeldas } from "./senaletica-render.js";
import { actualizarSenaleticaImpresion, imprimirSenaletica } from "./senaletica-impresion.js";

/**
 * Inicializa la aplicación del traductor braille y enlaza todos los manejadores de eventos.
 * Debe llamarse una única vez cuando el DOM esté listo.
 * @returns {void}
 */
export function iniciarApp() {
  let ultimasCeldas = [];
  let vistaActual = "celdas";

  const entrada = document.getElementById("entrada");
  const salidaBraille = document.getElementById("salida-braille");
  const salidaUnicode = document.getElementById("salida-unicode");
  const estado = document.getElementById("estado-salida");
  const contador = document.getElementById("contador");
  const btnTraducir = document.getElementById("btn-traducir");
  const btnLimpiar = document.getElementById("btn-limpiar");
  const btnVistaCeldas = document.getElementById("btn-vista-celdas");
  const btnVistaUnicode = document.getElementById("btn-vista-unicode");
  const accionesImpresion = document.getElementById("acciones-impresion");
  const btnImprimir = document.getElementById("btn-imprimir");
  const senaleticaTexto = document.getElementById("senaletica-texto");
  const senaleticaBraille = document.getElementById("senaletica-braille");
  const senaleticaImpresion = document.getElementById("senaletica-impresion");

  if (
    !entrada ||
    !salidaBraille ||
    !salidaUnicode ||
    !estado ||
    !contador ||
    !btnTraducir ||
    !btnLimpiar ||
    !btnVistaCeldas ||
    !btnVistaUnicode ||
    !accionesImpresion ||
    !btnImprimir ||
    !senaleticaTexto ||
    !senaleticaBraille ||
    !senaleticaImpresion
  ) {
    console.error("Faltan elementos en el DOM.");
    return;
  }

  const elementosSenaletica = {
    senaleticaTexto,
    senaleticaBraille,
    senaleticaImpresion,
  };

  function aplicarVista(vista) {
    vistaActual = vista;

    if (vista === "celdas") {
      salidaBraille.removeAttribute("hidden");
      salidaUnicode.setAttribute("hidden", "");
      btnVistaCeldas.classList.add("activo");
      btnVistaUnicode.classList.remove("activo");
      btnVistaCeldas.setAttribute("aria-pressed", "true");
      btnVistaUnicode.setAttribute("aria-pressed", "false");
    } else {
      salidaBraille.setAttribute("hidden", "");
      salidaUnicode.removeAttribute("hidden");
      btnVistaCeldas.classList.remove("activo");
      btnVistaUnicode.classList.add("activo");
      btnVistaCeldas.setAttribute("aria-pressed", "false");
      btnVistaUnicode.setAttribute("aria-pressed", "true");
      salidaUnicode.textContent = celdasAUnicodePantalla(ultimasCeldas);
    }
  }

  function actualizarContador() {
    contador.textContent = String(entrada.value.length);
  }

  function mostrarBotonImpresion(visible) {
    if (visible) {
      accionesImpresion.removeAttribute("hidden");
    } else {
      accionesImpresion.setAttribute("hidden", "");
    }
  }

  function limpiarSenaletica() {
    senaleticaTexto.textContent = "";
    senaleticaBraille.textContent = "";
  }

  function traducir() {
    const texto = entrada.value;

    if (!texto.trim()) {
      ultimasCeldas = [];
      salidaBraille.replaceChildren();
      salidaUnicode.textContent = "";
      estado.textContent = "Escribe texto y pulsa «Traducir a braille» para ver los cuadratines.";
      estado.classList.remove("has-warning");
      salidaBraille.setAttribute("aria-label", "Sin resultado");
      mostrarBotonImpresion(false);
      limpiarSenaletica();
      return;
    }

    const { celdas, desconocidos } = textoABraille(texto);
    ultimasCeldas = celdas;

    renderizarCeldas(celdas, salidaBraille);
    if (vistaActual === "unicode") {
      salidaUnicode.textContent = celdasAUnicodePantalla(celdas);
    }

    const numCeldas = celdas.filter((c) => c.type === "cell").length;
    let mensaje =
      "Traducción lista: " +
      numCeldas +
      " cuadratín" +
      (numCeldas === 1 ? "" : "es") +
      " mostrado" +
      (numCeldas === 1 ? "" : "s") +
      ".";

    if (desconocidos > 0) {
      mensaje +=
        " " +
        desconocidos +
        " carácter" +
        (desconocidos === 1 ? "" : "es") +
        " no reconocido" +
        (desconocidos === 1 ? "" : "s") +
        " (marcado" +
        (desconocidos === 1 ? "" : "s") +
        " en amarillo).";
      estado.classList.add("has-warning");
    } else {
      estado.classList.remove("has-warning");
    }

    estado.textContent = mensaje;
    salidaBraille.setAttribute(
      "aria-label",
      "Braille generado a partir de: " + texto.slice(0, 120) + (texto.length > 120 ? "…" : "")
    );

    actualizarSenaleticaImpresion(texto, celdas, elementosSenaletica);
    mostrarBotonImpresion(true);
  }

  function limpiar() {
    entrada.value = "";
    ultimasCeldas = [];
    actualizarContador();
    salidaBraille.replaceChildren();
    salidaUnicode.textContent = "";
    estado.textContent = "Escribe texto y pulsa «Traducir a braille» para ver los cuadratines.";
    estado.classList.remove("has-warning");
    salidaBraille.setAttribute("aria-label", "Representación visual en braille");
    mostrarBotonImpresion(false);
    limpiarSenaletica();
    entrada.focus();
  }

  btnVistaCeldas.addEventListener("click", () => aplicarVista("celdas"));
  btnVistaUnicode.addEventListener("click", () => aplicarVista("unicode"));

  entrada.addEventListener("input", actualizarContador);
  entrada.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      traducir();
    }
  });

  btnTraducir.addEventListener("click", traducir);
  btnLimpiar.addEventListener("click", limpiar);
  btnImprimir.addEventListener("click", () =>
    imprimirSenaletica(entrada, ultimasCeldas, elementosSenaletica)
  );

  window.addEventListener("afterprint", function () {
    senaleticaImpresion.setAttribute("aria-hidden", "true");
  });

  actualizarContador();
}
