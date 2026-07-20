/**
 * Módulo de interfaz de usuario braille.
 * Orquesta los módulos de traducción, renderizado y señalética, y gestiona los eventos de la UI.
 */

import { textoABraille, celdasAUnicodePantalla, celdasAUnicodeImpresion, dotsAUnicode } from "./traductor-base.js";
import { renderizarCeldas } from "./senaletica-render.js";
import { actualizarSenaleticaImpresion, imprimirSenaletica } from "./senaletica-impresion.js";
import { brailleATexto } from "./traductor-inverso.js";

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
  const radioDirectoEspejo = document.getElementById("radio-directo-espejo");
  const senaleticaTexto = document.getElementById("senaletica-texto");
  const senaleticaBraille = document.getElementById("senaletica-braille");
  const senaleticaImpresion = document.getElementById("senaletica-impresion");

  const puntosBraille = Array.from(document.querySelectorAll(".punto-braille"));
  const btnAnadirCelda = document.getElementById("btn-anadir-celda");
  const btnEspacioCelda = document.getElementById("btn-espacio-celda");
  const btnBorrarCelda = document.getElementById("btn-borrar-celda");
  const entradaBraille = document.getElementById("entrada-braille");
  const btnTraducirInverso = document.getElementById("btn-traducir-inverso");
  const btnLimpiarInverso = document.getElementById("btn-limpiar-inverso");
  const salidaInverso = document.getElementById("salida-inverso");
  const estadoInverso = document.getElementById("estado-inverso");
  const accionesImpresionInverso = document.getElementById("acciones-impresion-inverso");
  const btnImprimirInverso = document.getElementById("btn-imprimir-inverso");
  const radioInversoEspejo = document.getElementById("radio-inverso-espejo");

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
    !radioDirectoEspejo ||
    !senaleticaTexto ||
    !senaleticaBraille ||
    !senaleticaImpresion ||
    !btnAnadirCelda ||
    !btnEspacioCelda ||
    !btnBorrarCelda ||
    !entradaBraille ||
    !btnTraducirInverso ||
    !btnLimpiarInverso ||
    !salidaInverso ||
    !estadoInverso ||
    !accionesImpresionInverso ||
    !btnImprimirInverso ||
    !radioInversoEspejo ||
    puntosBraille.length !== 6
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

  function mostrarAccionesImpresion(elemento, visible) {
    if (visible) {
      elemento.removeAttribute("hidden");
    } else {
      elemento.setAttribute("hidden", "");
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
      mostrarAccionesImpresion(accionesImpresion, false);
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

    actualizarSenaleticaImpresion(texto, celdasAUnicodeImpresion(celdas), elementosSenaletica);
    mostrarAccionesImpresion(accionesImpresion, true);
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
    mostrarAccionesImpresion(accionesImpresion, false);
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
    imprimirSenaletica(
      entrada.value,
      celdasAUnicodeImpresion(ultimasCeldas),
      elementosSenaletica,
      radioDirectoEspejo.checked
    )
  );

  window.addEventListener("afterprint", function () {
    senaleticaImpresion.setAttribute("aria-hidden", "true");
  });

  // --- Traductor inverso: Braille -> Texto ---
  const puntosActivos = [false, false, false, false, false, false];

  function sincronizarPunto(boton) {
    const idx = Number(boton.dataset.punto) - 1;
    const activo = puntosActivos[idx];
    boton.classList.toggle("activo", activo);
    boton.setAttribute("aria-pressed", activo ? "true" : "false");
  }

  function togglePunto(indice) {
    puntosActivos[indice] = !puntosActivos[indice];
    const boton = puntosBraille.find((b) => Number(b.dataset.punto) - 1 === indice);
    if (boton) sincronizarPunto(boton);
  }

  puntosBraille.forEach((boton) => {
    boton.addEventListener("click", () => {
      togglePunto(Number(boton.dataset.punto) - 1);
    });
  });

  function limpiarPuntos() {
    for (let i = 0; i < puntosActivos.length; i++) puntosActivos[i] = false;
    puntosBraille.forEach(sincronizarPunto);
  }

  btnAnadirCelda.addEventListener("click", () => {
    if (!puntosActivos.some(Boolean)) return;
    const celda = dotsAUnicode(puntosActivos.slice());
    entradaBraille.value += celda;
    limpiarPuntos();
  });

  btnEspacioCelda.addEventListener("click", () => {
    entradaBraille.value += " ";
  });

  btnBorrarCelda.addEventListener("click", () => {
    entradaBraille.value = entradaBraille.value.slice(0, -1);
  });

  function traducirInverso() {
    const texto = entradaBraille.value;

    if (!texto.trim()) {
      salidaInverso.textContent = "";
      salidaInverso.setAttribute("hidden", "");
      estadoInverso.textContent = "Compón o pega braille y pulsa «Traducir a texto».";
      mostrarAccionesImpresion(accionesImpresionInverso, false);
      limpiarSenaletica();
      return;
    }

    const { texto: resultado, desconocidos } = brailleATexto(texto);
    salidaInverso.textContent = resultado;
    salidaInverso.removeAttribute("hidden");

    let mensaje = "Traducción lista: " + resultado.length + " carácter" +
      (resultado.length === 1 ? "" : "es") + " obtenido" +
      (resultado.length === 1 ? "" : "s") + ".";
    if (desconocidos > 0) {
      mensaje += " " + desconocidos + " celda" +
        (desconocidos === 1 ? "" : "s") + " no reconocida" +
        (desconocidos === 1 ? "" : "s") + ".";
    }
    estadoInverso.textContent = mensaje;

    if (resultado.trim()) {
      actualizarSenaleticaImpresion(resultado, texto, elementosSenaletica);
      mostrarAccionesImpresion(accionesImpresionInverso, true);
    } else {
      mostrarAccionesImpresion(accionesImpresionInverso, false);
      limpiarSenaletica();
    }
  }

  function limpiarInverso() {
    entradaBraille.value = "";
    limpiarPuntos();
    salidaInverso.textContent = "";
    salidaInverso.setAttribute("hidden", "");
    estadoInverso.textContent = "Compón o pega braille y pulsa «Traducir a texto».";
    mostrarAccionesImpresion(accionesImpresionInverso, false);
    limpiarSenaletica();
  }

  btnTraducirInverso.addEventListener("click", traducirInverso);
  btnLimpiarInverso.addEventListener("click", limpiarInverso);
  btnImprimirInverso.addEventListener("click", () =>
    imprimirSenaletica(salidaInverso.textContent, entradaBraille.value, elementosSenaletica, radioInversoEspejo.checked)
  );

  actualizarContador();
}
