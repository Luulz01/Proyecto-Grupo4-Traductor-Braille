# Casos de Prueba — Traductor Braille
**Asignatura:** Construcción y Evolución de Software  
**Rama:** `documentacion`  
**Módulo testeado:** `traductor-base.js` que depende internamente de los mapas de caracteres definidos en datos-braille.js, por lo que los casos de prueba validan implícitamente ambos módulos. 
**Framework:** Jest  
**Comando de ejecución:** `npm test`

---

## Descripción general del caso de uso

El caso de uso principal de la aplicación *Traductor Braille* consiste en permitir al usuario ingresar un texto en español mediante un formulario web y obtener como resultado la representación en Braille Grado 1 (estándar ONCE B2), visualizada con y sin cuadratines en pantalla. La lógica de conversión implementada en `textoABraille()` incluye:

- Convertir letras minúsculas del alfabeto español
- Manejar mayúsculas individuales y palabras completas en mayúsculas
- Aceptar vocales acentuadas (á, é, í, ó, ú)
- Reconocer la letra ñ
- Convertir números con el prefijo de número antepuesto
- Preservar los espacios tal como aparecen (sin normalización automática)

La siguiente sección documenta los 15 casos de prueba empleados para validar el funcionamiento del módulo `brailleTranslator.js`.

---

# Casos de Prueba y Resultados

---

## Caso de Prueba 1: Transcripción de texto básico en minúsculas
### Objetivo
Verificar que el módulo textoABraille() traduzca correctamente texto básico en minúsculas y que la interfaz web represente adecuadamente el resultado en Braille.

### Prueba unitaria (Jest)
- **Entrada:** `hola mundo`
- **Resultado esperado:** La salida debe contener celdas braille válidas, incluir espacios y no presentar caracteres desconocidos.
- **Resultado obtenido:** PASS sin errores.
<img width="1309" height="799" alt="image" src="https://github.com/user-attachments/assets/5f66da1b-7594-457d-a36a-ce9a1fe83532" />


### Prueba funcional de interfaz
- **Entrada:** `hola mundo`
- **Procedimiento:** 
1. Abrir la aplicación web en el navegador.
2. Ingresar el texto hola mundo en el área de entrada.
3. Presionar el botón de traducción.
4. Verificar la representación braille generada.
- **Resultado esperado:** El sistema debe mostrar correctamente la representación braille correspondiente al texto ingresado.
- **Resultado obtenido:** La interfaz generó correctamente los cuadratines braille sin errores visuales ni caracteres desconocidos.
<img width="963" height="801" alt="image" src="https://github.com/user-attachments/assets/eaa57314-0bdc-41aa-8259-75ebff58b58f" />
<img width="925" height="416" alt="image" src="https://github.com/user-attachments/assets/f9d30e4b-fa36-4135-bb6b-80c614ab99d5" />

---

### Caso de Prueba 2: Una mayúscula sola genera indicador simple
### Objetivo
Verificar que una sola letra mayúscula genere el prefijo May. una única vez antes de la letra.
### Prueba unitaria (Jest)
- **Entrada:** `Casa`
- **Resultado esperado:** Primera celda con special:"mayúscula" y mayusculaDoble: undefined,seguida de la celda de "c".
- **Resultado obtenido:** PASS sin errores.
<img width="1330" height="904" alt="Captura de pantalla 2026-05-28 134552" src="https://github.com/user-attachments/assets/03742bf7-dda3-4204-8ff3-d67d9248a532" />

### Prueba funcional de interfaz
- **Entrada:** `Casa`
- **Procedimiento:**
  1. Ingresar `Casa` en el área de texto.
  2. Presionar **Traducir a braille**.
  3. Verificar que aparece un solo indicador may. antes de la C.
- **Resultado esperado:** Un cuadratín may. seguido de c, a, s, a.
- **Resultado obtenido:** La interfaz mostró correctamente 
  may. | c | a | s | a.
<img width="921" height="769" alt="Captura de pantalla 2026-05-28 141440" src="https://github.com/user-attachments/assets/fe6456f4-9326-4bf6-889f-85823ee93ea3" />
<img width="935" height="411" alt="image" src="https://github.com/user-attachments/assets/f59e21fc-225f-48b4-9d8e-b05d31dc52e1" />

---

## Caso de Prueba 3: Transcripción de palabra completa en mayúsculas

### Objetivo
Verificar que dos o más mayúsculas consecutivas generen un único 
indicador may.×2 al inicio de la secuencia.
### Prueba unitaria (Jest)
- **Entrada:** `HOLA`
- **Resultado esperado:** Primera celda con mayusculaDoble: true, 
  seguida de h, o, l, a.
- **Resultado obtenido:** PASS sin errores.
  <img width="1343" height="895" alt="Captura de pantalla 2026-05-28 141801" src="https://github.com/user-attachments/assets/da3b5db4-e3ec-4b99-b8c9-1fc7fbfb0cec" />


### Prueba funcional de interfaz
- **Entrada:** `HOLA`
- **Procedimiento:**
  1. Ingresar `HOLA` en el área de texto.
  2. Presionar **Traducir a braille**.
  3. Verificar que aparece un solo bloque may.×2 al inicio.
- **Resultado esperado:** Un bloque may.×2 seguido de h, o, l, a.
- **Resultado obtenido:** La interfaz mostró correctamente 
  el indicador doble agrupado en recuadro azul.
<img width="1159" height="925" alt="Captura de pantalla 2026-05-28 141905" src="https://github.com/user-attachments/assets/ea39ac38-f7aa-49b0-9c37-1964cc492c78" />
<img width="920" height="396" alt="image" src="https://github.com/user-attachments/assets/1a3e3ceb-81a5-4c0d-9bf1-d8e4cb47d789" />

---

## Caso de Prueba 4: Transcripción de vocales acentuadas
### Objetivo
Verificar que las vocales con tilde se conviertan a sus celdas Braille específicas del español.

### Prueba unitaria (Jest)
- **Entrada:** `áéíóú`
- **Resultado esperado:**  Celdas braille válidas para cada vocal acentuada, sin caracteres desconocidos.
- **Resultado obtenido:** PASS sin errores.
<img width="1370" height="787" alt="Captura de pantalla 2026-05-28 143243" src="https://github.com/user-attachments/assets/be4e180a-1c2d-42b5-a6c6-3af5d01010d4" />

### Prueba funcional de interfaz
- **Entrada:** `áéíóú`
- **Procedimiento:**
  1. Ingresar `áéíóú` en el área de texto.
  2. Presionar **Traducir a braille**.
  3. Verificar que no aparecen celdas amarillas.
- **Resultado esperado:** 5 cuadratines braille sin advertencias.
- **Resultado obtenido:** Se tradujo correctamente las vocales con acento. 
  sin caracteres desconocidos.
<img width="931" height="796" alt="image" src="https://github.com/user-attachments/assets/0d8d3ae0-e6d5-40c7-ad90-3882a4843387" />
<img width="938" height="426" alt="image" src="https://github.com/user-attachments/assets/c193eebc-5f84-4b68-93ab-e50760e75d3d" />

----
## Caso de Prueba 5: Transcripción completa del alfabeto español
### Objetivo
Verificar que todas las letras del alfabeto español sean reconocidas y traducidas correctamente a sus respectivas celdas Braille.

### Prueba unitaria (Jest)
* **Entrada:** `abcdefghijklmnñopqrstuvwxyz`
* **Resultado esperado:** Todas las letras deben generar celdas braille válidas sin caracteres desconocidos.
* **Resultado obtenido:** PASS sin errores.
<img width="1380" height="953" alt="Captura de pantalla 2026-05-28 171135" src="https://github.com/user-attachments/assets/d2238eb2-20cd-46e2-8b4b-1d4ad4b4a0b1" />


### Prueba funcional de interfaz
* **Entrada:** `abcdefghijklmnñopqrstuvwxyz`
* **Procedimiento:**
  1. Ingresar el alfabeto completo en el área de texto.
  2. Presionar **Traducir a braille**.
  3. Verificar que todos los caracteres se representen correctamente.
* **Resultado esperado:**
  El sistema debe mostrar un cuadratín braille válido para cada letra del alfabeto español, incluida la letra ñ.
* **Resultado obtenido:**
  La interfaz representó correctamente todas las letras del alfabeto sin advertencias ni caracteres desconocidos.
<img width="938" height="857" alt="image" src="https://github.com/user-attachments/assets/8a1139da-7873-467e-b482-8455be4e23e8" />
<img width="945" height="487" alt="image" src="https://github.com/user-attachments/assets/aa431788-f925-461c-a744-44e74e97354b" />

---

## Caso de Prueba 6: Transcripción de la vocal ü
### Objetivo
Verificar que la vocal `ü` sea reconocida y traducida correctamente a Braille.
### Prueba unitaria (Jest)
* **Entrada:** `pingüino`
* **Resultado esperado:** La palabra debe traducirse completamente sin caracteres desconocidos, incluyendo la vocal `ü`.
* **Resultado obtenido:** PASS sin errores.
<img width="1350" height="720" alt="Captura de pantalla 2026-05-28 171211" src="https://github.com/user-attachments/assets/c66a1bc2-4aec-4eb9-a00d-519c06e092e8" />

### Prueba funcional de interfaz
* **Entrada:** `pingüino`
* **Procedimiento:**
  1. Ingresar `pingüino` en el área de texto.
  2. Presionar **Traducir a braille**.
  3. Verificar que la vocal `ü` sea representada correctamente.
* **Resultado esperado:**
  Todos los caracteres deben representarse correctamente en braille sin advertencias visuales.
* **Resultado obtenido:**
  La interfaz tradujo correctamente la palabra `pingüino`, incluyendo la vocal `ü`.
<img width="916" height="790" alt="image" src="https://github.com/user-attachments/assets/dff0f44d-8049-4378-8ef1-b1a9f94343f0" />
<img width="914" height="396" alt="image" src="https://github.com/user-attachments/assets/07c7d529-24a5-4d30-95d4-ccbf8813a3cd" />

---

## Caso de Prueba 7: Transcripción de signos de puntuación
### Objetivo
Verificar que distintos signos de puntuación y símbolos del español se traduzcan correctamente a sus respectivas celdas Braille.
### Prueba unitaria (Jest)
* **Entrada:** `"Hola, mundo; ¿cómo estás? ¡Bien!"`
* **Resultado esperado:** Todos los signos de puntuación deben generar celdas braille válidas sin producir caracteres desconocidos.
* **Resultado obtenido:** PASS sin errores.
<img width="1410" height="962" alt="Captura de pantalla 2026-05-28 171406" src="https://github.com/user-attachments/assets/a6c5ca2b-f1d4-4448-98dd-7da83b445fef" />

### Prueba funcional de interfaz
* **Entrada:**`"Hola, mundo; ¿cómo estás? ¡Bien!"`
* **Procedimiento:**
  1. Ingresar el texto en el área de entrada.
  2. Presionar **Traducir a braille**.
  3. Verificar visualmente la representación de los signos de puntuación.
* **Resultado esperado:** La interfaz debe representar correctamente comillas, coma, punto y coma, signos de interrogación y signos de exclamación.
* **Resultado obtenido:**
  La interfaz generó correctamente todos los signos de puntuación sin advertencias ni caracteres desconocidos.
<img width="1024" height="867" alt="Captura de pantalla 2026-05-28 171458" src="https://github.com/user-attachments/assets/fa96f7c0-2f5d-41ca-bf2c-316edae7efec" />
<img width="976" height="866" alt="Captura de pantalla 2026-05-28 171510" src="https://github.com/user-attachments/assets/c35a11b3-bbfe-4ae9-bd7c-36e410a2f97b" />

---

## Caso de Prueba 8: Transcripción de números
### Objetivo
Verificar que el sistema traduzca correctamente los números del 0 al 9 utilizando el prefijo numérico Braille correspondiente.
### Prueba unitaria (Jest)
- **Entrada:**  `0123456789`
- **Resultado esperado:** La primera celda debe corresponder al indicador numérico (`#`) y los diez dígitos deben generar celdas Braille válidas sin caracteres desconocidos.
- **Resultado obtenido:** PASS sin errores.
<img width="1411" height="929" alt="Captura de pantalla 2026-05-28 173105" src="https://github.com/user-attachments/assets/f055948f-296d-4751-8cec-73f8fca7b4f8" />

### Prueba funcional de interfaz
- **Entrada:**  `0123456789`
- **Procedimiento:**
  1. Ingresar `0123456789` en el área de texto.
  2. Presionar **Traducir a braille**.
  3. Verificar que aparezca el prefijo numérico seguido de los diez dígitos.
- **Resultado esperado:**  
La interfaz debe mostrar correctamente el indicador numérico Braille seguido de las representaciones correspondientes de los números del 0 al 9.
- **Resultado obtenido:**  
La interfaz generó correctamente el prefijo numérico y todos los dígitos sin errores visuales ni caracteres desconocidos.
<img width="957" height="949" alt="Captura de pantalla 2026-05-28 173137" src="https://github.com/user-attachments/assets/bb0235ac-2283-4f78-a7e9-60c797147355" />
<img width="945" height="399" alt="Captura de pantalla 2026-05-28 173158" src="https://github.com/user-attachments/assets/6ff33de2-1d48-49f0-8f0c-984e7b45fd5a" />

---
## Caso de Prueba 9: Transcripción de operadores matemáticos básicos
### Objetivo
Verificar que los operadores matemáticos básicos (`+`, `*`, `/`) sean reconocidos y traducidos correctamente a sus respectivas celdas Braille.
### Prueba unitaria (Jest) — Ejecución inicial
* **Entrada:** `(3 + 5) * 2 - 4 / 2`
* **Resultado esperado:** Todos los operadores matemáticos deben generar celdas braille válidas sin caracteres desconocidos.
* **Resultado obtenido:** La prueba falló debido a que el sistema no reconoció correctamente tres operadores matemáticos presentes en la expresión.
<img width="1372" height="725" alt="Captura de pantalla 2026-05-28 174425" src="https://github.com/user-attachments/assets/95a02d13-6866-46f4-8861-de2f387375a7" />
### Análisis del fallo
Durante la ejecución inicial se identificó que los operadores matemáticos +, * y / no estaban definidos dentro del objeto SIGNOS en el archivo datos-braille.js.
Como consecuencia, el traductor clasificaba estos símbolos como caracteres desconocidos y los resaltaba visualmente en amarillo dentro de la interfaz.
### Corrección aplicada
Se agregaron los operadores faltantes al objeto SIGNOS en datos-braille.js:
+ → pattern(2, 3, 5)
* → pattern(1, 6)
/ → pattern(3, 4)

### Re-ejecución posterior a la corrección
* **Resultado esperado:** Todos los operadores matemáticos deben traducirse correctamente sin generar advertencias.
* **Resultado obtenido:** La prueba se ejecutó correctamente y todos los operadores matemáticos fueron reconocidos y traducidos a Braille sin errores.
<img width="1365" height="594" alt="Captura de pantalla 2026-05-28 175541" src="https://github.com/user-attachments/assets/ef69192f-9b7b-4e88-9683-b0a9739198b0" />

### Prueba funcional de interfaz
* **Entrada:** `(3 + 5) * 2 - 4 / 2`
* **Procedimiento:**
  1. Ingresar la expresión matemática en el área de texto.
  2. Presionar **Traducir a braille**.
  3. Verificar que los operadores matemáticos aparezcan correctamente representados.
* **Resultado esperado:**
  Todos los operadores matemáticos deben visualizarse como cuadratines Braille válidos sin advertencias ni resaltados amarillos.
* **Resultado obtenido:**
  La interfaz representó correctamente los operadores `+`, `*` y `/` después de aplicar la corrección en el módulo de signos.
<img width="906" height="847" alt="Captura de pantalla 2026-05-28 175639" src="https://github.com/user-attachments/assets/ccb88145-fbe4-4048-8174-6560cb00a1ee" />
<img width="930" height="438" alt="Captura de pantalla 2026-05-28 175704" src="https://github.com/user-attachments/assets/8a86b7e2-4b3e-43d4-95ae-b309cf1b3904" />
---

## Caso de Prueba 10: Fecha con guiones
### Objetivo
Verificar que una fecha en formato DD-MM-YYYY  se traduzca correctamente con prefijos numéricos  y guiones entre grupos.

### Prueba unitaria (Jest)
- **Entrada:** `25-11-2025`
- **Resultado esperado:** desconocidos === 0, 
  celdas válidas con guiones entre números.
- **Resultado obtenido:** PASS
<img width="1402" height="616" alt="Captura de pantalla 2026-05-28 191028" src="https://github.com/user-attachments/assets/84c2560a-4afd-43e7-a6b7-a6597a84c6da" />

### Prueba funcional de interfaz
- **Entrada:** `25-11-2025`
- **Procedimiento:**
  1. Ingresar la fecha en el área de texto.
  2. Presionar **Traducir a braille**.
  3. Verificar prefijos # y guiones correctos.
- **Resultado esperado:** # 2 5 - # 1 1 - # 2 0 2 5
- **Resultado obtenido:** La interfaz generó correctamente la fecha con guiones.
<img width="918" height="780" alt="Captura de pantalla 2026-05-28 180738" src="https://github.com/user-attachments/assets/3b9c187e-b9f9-4587-8d25-3248753ebaa3" />
<img width="931" height="410" alt="Captura de pantalla 2026-05-28 180751" src="https://github.com/user-attachments/assets/f289b37e-0f67-40f2-a167-821829bc8615" />
---

## Caso de Prueba 11: Palabra con vocal acentuada í
### Objetivo
Verificar que la palabra "sandía" con la vocal 
í acentuada se traduzca correctamente.
### Prueba unitaria (Jest)
- **Entrada:** `sandía`
- **Resultado esperado:** 6 celdas, 
  desconocidos === 0.
- **Resultado obtenido:** PASS
<img width="1368" height="628" alt="Captura de pantalla 2026-05-28 191122" src="https://github.com/user-attachments/assets/640af886-896a-4431-8b04-9d2136dad07f" />

### Prueba funcional de interfaz
- **Entrada:** `sandía`
- **Procedimiento:**
  1. Ingresar `sandía` en el área de texto.
  2. Presionar **Traducir a braille**.
  3. Verificar 6 cuadratines sin advertencias.
- **Resultado esperado:** s|a|n|d|í|a sin errores.
- **Resultado obtenido:** La interfaz generó 
  correctamente los 6 cuadratines.
<img width="930" height="773" alt="Captura de pantalla 2026-05-28 181119" src="https://github.com/user-attachments/assets/fa80a0a4-3791-49ee-81de-6f413f5a82b7" />
<img width="943" height="421" alt="Captura de pantalla 2026-05-28 181129" src="https://github.com/user-attachments/assets/7399d1f1-6422-4851-9e42-a9b6b3a5c1e2" />

---
## Caso de Prueba 12: Siglas con mayúsculas y guión

### Objetivo
Verificar que siglas como FIS-EPN con mayúsculas 
consecutivas y guión se traduzcan correctamente.
### Prueba unitaria (Jest)
- **Entrada:** `FIS-EPN`
- **Resultado esperado:** Primera celda con 
  mayusculaDoble: true, desconocidos === 0.
- **Resultado obtenido:** PASS
<img width="1387" height="620" alt="Captura de pantalla 2026-05-28 191215" src="https://github.com/user-attachments/assets/575a57fc-2744-4db5-a42a-4af355734e60" />

### Prueba funcional de interfaz
- **Entrada:** `FIS-EPN`
- **Procedimiento:**
  1. Ingresar `FIS-EPN` en el área de texto.
  2. Presionar **Traducir a braille**.
  3. Verificar indicador may.×2 al inicio 
     de cada grupo de mayúsculas.
- **Resultado esperado:** may.×2 | f | i | s | 
  - | may.×2 | e | p | n
- **Resultado obtenido:** La interfaz mostró correctamente los indicadores dobles.
<img width="950" height="822" alt="Captura de pantalla 2026-05-28 182711" src="https://github.com/user-attachments/assets/e7386486-98b1-4469-8290-fa8c96168298" />
<img width="927" height="414" alt="image" src="https://github.com/user-attachments/assets/06e811f4-e489-4c26-9b12-950e7b97ee12" />
---

## Caso de Prueba 13: Número con coma decimal

### Objetivo
Verificar que un número con coma decimal como 20,15 no genere un prefijo # doble después de la coma.
### Prueba unitaria (Jest) — Ejecución inicial
- **Entrada:** `20,15`
- **Resultado esperado:** El prefijo numérico # aparece solo una vez al inicio del número.
- **Resultado obtenido:** El prefijo # apareció dos veces, una antes del 20 y otra antes del 15, lo que no corresponde al estándar Braille español por loq eu la prueba falló.
<img width="1348" height="970" alt="Captura de pantalla 2026-05-28 183105" src="https://github.com/user-attachments/assets/060dc4a6-9c85-4bcc-8ca3-09616eed6238" />

### Análisis del fallo
Al encontrar la coma, el traductor interpretaba que la secuencia numérica había terminado. Cuando llegaba al dígito 1 después de la coma, lo trataba como el inicio de un número nuevo y añadía otro prefijo #. Sin embargo en Braille español, la coma entre dígitos actúa como separador decimal y los números que siguen pertenecen a la misma secuencia,por lo que no deben llevar un nuevo prefijo.

### Solución aplicada
Se modificó la lógica en traductor-base.js para detectar cuando una coma está entre dos secuencias de dígitos y mantener el modo numérico activo, evitando así que se inserte un prefijo # adicional.
### Re-ejecución
- **Resultado obtenido:** El prefijo numérico 
  aparece solo una vez al inicio, quedando la 
  traducción como # | 2 | 0 | , | 1 | 5.
<img width="1439" height="651" alt="Captura de pantalla 2026-05-28 191324" src="https://github.com/user-attachments/assets/76e6a75f-c170-48bb-9abb-59fea96637c0" />

### Prueba funcional de interfaz
- **Entrada:** `20,15`
- **Procedimiento:**
  1. Ingresar `20,15` en el área de texto.
  2. Presionar **Traducir a braille**.
  3. Verificar que el prefijo # aparece solo 
     una vez al inicio y no se repite después 
     de la coma.
- **Resultado esperado:** El número se traduce como una sola secuencia: # | 2 | 0 | , | 1 | 5
  sin ningún prefijo # adicional en el medio.
- **Resultado obtenido (inicial):** La interfaz generó dos prefijos #, uno antes del 20 y otro  antes del 15, como se puede observar en la captura de pantalla.
<img width="1245" height="992" alt="Captura de pantalla 2026-05-28 184010" src="https://github.com/user-attachments/assets/413327d1-992f-4159-ba4c-25b4866f7dfc" />
- **Resultado obtenido (tras corrección):** 
  La interfaz generó correctamente una sola 
  secuencia numérica sin prefijo doble.
<img width="1172" height="980" alt="Captura de pantalla 2026-05-28 183829" src="https://github.com/user-attachments/assets/a0b5ac8e-c04c-4a15-adb1-c8d7e19ea0f8" />
<img width="948" height="424" alt="image" src="https://github.com/user-attachments/assets/1bbb791f-31c2-498b-a8eb-e0ccb6117cc8" />

---
## Caso de Prueba 14: Número con punto decimal
### Objetivo
Verificar que un número con punto decimal como `46.37` mantenga una sola secuencia numérica y no genere un prefijo `#` adicional después del punto.

### Prueba unitaria (Jest)
* **Entrada:** `46.37`

* **Resultado esperado:** El prefijo numérico `#` debe aparecer únicamente una vez al inicio del número decimal.
* **Resultado obtenido:** La prueba se ejecutó correctamente y el sistema mantuvo una sola secuencia numérica sin insertar un segundo prefijo `#` después del punto decimal.
<img width="1399" height="674" alt="Captura de pantalla 2026-05-28 191423" src="https://github.com/user-attachments/assets/a7dc2b92-e503-4772-a53c-10497bdd6c2a" />

### Análisis
Tras la corrección aplicada anteriormente para mantener el modo numérico activo en secuencias decimales, el traductor logró interpretar correctamente el punto decimal como parte de la misma secuencia numérica.
De esta manera, los dígitos posteriores al punto continuaron perteneciendo al mismo número y no fueron tratados como una nueva secuencia independiente.

### Prueba funcional de interfaz

* **Entrada:** `46.37`
* **Procedimiento:**
  1. Ingresar `46.37` en el área de texto.
  2. Presionar **Traducir a braille**.
  3. Verificar que el prefijo `#` aparezca solo una vez al inicio del número.
* **Resultado esperado:**
  La interfaz debe representar el número como una única secuencia:
  `# | 4 | 6 | . | 3 | 7`
* **Resultado obtenido:**
  La interfaz generó correctamente una sola secuencia numérica continua sin prefijos duplicados después del punto decimal.
<img width="937" height="803" alt="image" src="https://github.com/user-attachments/assets/c11cf88b-be45-40ef-964f-3e18692c79b0" />
<img width="919" height="430" alt="image" src="https://github.com/user-attachments/assets/ae68145e-e7bd-4dc4-8af7-290892bb41fa" />

---
## Caso de Prueba 15: Manejo de múltiples espacios consecutivos
### Objetivo
Verificar que múltiples espacios consecutivos se mantengan correctamente en la traducción Braille y se representen como separaciones visibles entre palabras.

### Prueba unitaria (Jest)
- **Entrada:** `hola     mundo` (5 espacios)
- **Resultado esperado:** La salida debe contener múltiples celdas de tipo `space` entre las palabras, manteniendo la separación original del texto.
- **Resultado obtenido:** PASS — los espacios fueron procesados correctamente sin errores.
<img width="1309" height="799" alt="Captura de pantalla 2026-05-28 191524" src="https://github.com/user-attachments/assets/0749a5df-fab2-41b6-b495-92715ebd4611" />

### Prueba funcional de interfaz
- **Entrada:** `hola     mundo`
- **Procedimiento:**
  1. Abrir la aplicación web.
  2. Ingresar el texto `hola     mundo` con 5 espacios consecutivos.
  3. Presionar el botón **Traducir a braille**.
  4. Verificar visualmente la separación entre las palabras.
- **Resultado esperado:** La interfaz debe mostrar una separación visible equivalente a los espacios ingresados, sin eliminar ni colapsar espacios.

- **Resultado obtenido:** La interfaz mantuvo correctamente la separación entre palabras y representó los espacios sin alterar el formato original del texto.
<img width="921" height="794" alt="image" src="https://github.com/user-attachments/assets/84886ffc-882f-4312-9f9f-ce6ec576d012" />
<img width="947" height="772" alt="image" src="https://github.com/user-attachments/assets/14c4ff84-84b1-4876-a220-929fab234d09" />

---


# Casos de Prueba — Traductor Inverso (Braille → Texto)

**Asignatura:** Construcción y Evolución de Software
**Bimestre:** 2
**Rama:** `documentacion`
**Módulo testeado:** `traductor-inverso.js`, que depende internamente de `traductor-base.js` (conversión Unicode ↔ puntos) y de los mapas de caracteres definidos en `datos-braille.js`, por lo que los casos de prueba validan implícitamente los tres módulos.
**Framework:** Jest
**Comando de ejecución:** `npm test`

---

## Descripción general del caso de uso

El caso de uso complementario de la aplicación *Traductor Braille* consiste en permitir al usuario ingresar braille (pegado como caracteres Unicode, compuesto con el constructor visual de puntos o con el teclado Perkins simulado) y obtener como resultado el texto equivalente en español. La lógica de conversión implementada en `brailleATexto()` incluye:

- Convertir celdas braille a letras minúsculas del alfabeto español
- Reconocer el indicador de mayúscula simple (una sola letra) y el indicador de mayúscula doble (palabra completa)
- Aceptar vocales acentuadas (á, é, í, ó, ú) y la vocal ü
- Reconocer la letra ñ
- Convertir números a partir del prefijo numérico y distinguir una letra de la serie a–j tras un número mediante el indicador de letra-tras-número
- Preservar espacios múltiples y saltos de línea tal como aparecen
- **Desambiguar por contexto** las celdas que el braille grado 1 comparte entre varios caracteres (¿ / ?, ¡ / ! / +, í / /), decidiendo según la posición en la frase o el entorno numérico
- Contar como "desconocidas" las celdas o caracteres que no pertenecen al alfabeto braille reconocido

La siguiente sección documenta los 22 casos de prueba empleados para validar el funcionamiento del módulo `traductor-inverso.js`.

---

# Casos de Prueba y Resultados

---

## Caso de prueba INV-01: Texto básico en minúsculas

**Objetivo**
Verificar que una cadena braille básica en minúsculas se traduzca correctamente de vuelta a texto en español.

**Prueba unitaria (Jest)**

* Entrada: `hola mundo`
* Resultado esperado: El texto decodificado debe ser idéntico al original y no debe haber celdas no reconocidas.
* Resultado obtenido: PASS sin errores.

<img width="592" height="347" alt="image" src="https://github.com/user-attachments/assets/6f2b291a-5e33-4b5b-bdcc-8d9f523e6218" />

**Prueba funcional de interfaz**

* Entrada: `hola mundo`
* Procedimiento:
   1. Abrir la aplicación web y cambiar al modo **Braille → Texto**.
   2. Pegar en el campo de entrada el braille correspondiente a `hola mundo` (se puede obtener generándolo antes en el modo Texto → Braille, vista "Aá Unicode", y copiándolo).
   3. Presionar **Traducir a texto**.
   4. Verificar el resultado en el cuadro "Resultado en español".
* Resultado esperado: El resultado debe mostrar exactamente `hola mundo`.
* Resultado obtenido: La interfaz mostró correctamente `hola mundo` sin errores ni caracteres desconocidos.
<img width="695" height="416" alt="image" src="https://github.com/user-attachments/assets/eb7fed3c-3bc0-4a53-ae2b-47020bfdab51" />
---

## Caso de prueba INV-02: Indicador de mayúscula simple

**Objetivo**
Verificar que el indicador de mayúscula simple afecte únicamente a la primera letra de la palabra.

**Prueba unitaria (Jest)**

* Entrada: `Casa`
* Resultado esperado: El texto decodificado debe ser `Casa` (solo la "C" en mayúscula).
* Resultado obtenido: PASS sin errores.
<img width="599" height="276" alt="image" src="https://github.com/user-attachments/assets/bc37ec73-31b0-401b-abde-f925fe9be8d9" />

**Prueba funcional de interfaz**

* Entrada: `Casa`
* Procedimiento:
   1. Cambiar al modo **Braille → Texto**.
   2. Pegar el braille correspondiente a `Casa` (indicador de mayúscula + c-a-s-a).
   3. Presionar **Traducir a texto**.
* Resultado esperado: El resultado debe mostrar `Casa`, con solo la primera letra en mayúscula.
* Resultado obtenido: La interfaz mostró `Casa` correctamente.
<img width="724" height="385" alt="image" src="https://github.com/user-attachments/assets/4cdedf98-4936-48af-b490-d76e511299a5" />
---

## Caso de prueba INV-03: Indicador de mayúscula doble (palabra completa)

**Objetivo**
Verificar que el indicador de mayúscula doble ponga en mayúscula toda la palabra, no solo la primera letra.

**Prueba unitaria (Jest)**

* Entrada: `HOLA`
* Resultado esperado: El texto decodificado debe ser `HOLA` completo en mayúsculas.
* Resultado obtenido: PASS sin errores.

<img width="605" height="277" alt="image" src="https://github.com/user-attachments/assets/fe0f6e70-7a0b-4355-aea0-16858653e38c" />

**Prueba funcional de interfaz**

* Entrada: `HOLA`
* Procedimiento:
   1. Cambiar al modo **Braille → Texto**.
   2. Pegar el braille correspondiente a `HOLA` (indicador de mayúscula doble + h-o-l-a).
   3. Presionar **Traducir a texto**.
* Resultado esperado: El resultado debe mostrar `HOLA` completo en mayúsculas.
* Resultado obtenido: La interfaz mostró `HOLA` correctamente.
<img width="715" height="385" alt="image" src="https://github.com/user-attachments/assets/ea2af8f9-6a3d-495a-96dd-1d33fa3ad25a" />
---

## Caso de prueba INV-04: Vocales acentuadas

**Objetivo**
Verificar que las cinco vocales acentuadas se decodifiquen correctamente.

**Prueba unitaria (Jest)**

* Entrada: `áéíóú`
* Resultado esperado: El texto decodificado debe ser `áéíóú`, sin celdas desconocidas.
* Resultado obtenido: PASS sin errores.

<img width="615" height="288" alt="image" src="https://github.com/user-attachments/assets/9cff7b50-bca6-4350-bb18-968af5f4c2bc" />

**Prueba funcional de interfaz**

* Entrada: `áéíóú`
* Procedimiento:
   1. Cambiar al modo **Braille → Texto**.
   2. Pegar el braille correspondiente a `áéíóú`.
   3. Presionar **Traducir a texto**.
* Resultado esperado: El resultado debe mostrar `áéíóú` sin errores.
* Resultado obtenido: La interfaz mostró las 5 vocales acentuadas correctamente.
<img width="689" height="401" alt="image" src="https://github.com/user-attachments/assets/43cedd8b-7e7c-4f32-85dc-ef5e1c543117" />
---

## Caso de prueba INV-05: Alfabeto completo español

**Objetivo**
Verificar que las 27 letras del alfabeto español (incluida la ñ) se decodifiquen correctamente.

**Prueba unitaria (Jest)**

* Entrada: `abcdefghijklmnñopqrstuvwxyz`
* Resultado esperado: El texto decodificado debe ser idéntico al original, sin celdas desconocidas.
* Resultado obtenido: PASS sin errores.

<img width="572" height="332" alt="image" src="https://github.com/user-attachments/assets/51949f9c-56ad-4217-aa62-df6c005b9f11" />

**Prueba funcional de interfaz**

* Entrada: `abcdefghijklmnñopqrstuvwxyz`
* Procedimiento:
   1. Cambiar al modo **Braille → Texto**.
   2. Pegar el braille correspondiente al alfabeto completo.
   3. Presionar **Traducir a texto**.
* Resultado esperado: El resultado debe mostrar `abcdefghijklmnñopqrstuvwxyz` completo.
* Resultado obtenido: La interfaz mostró el alfabeto completo correctamente, incluida la ñ.
<img width="725" height="469" alt="image" src="https://github.com/user-attachments/assets/5054ca46-c1f3-4d83-9b70-d42a6dc9c48e" />
---

## Caso de prueba INV-06: Vocal ü

**Objetivo**
Verificar que la vocal ü se decodifique correctamente dentro de una palabra.

**Prueba unitaria (Jest)**

* Entrada: `pingüino`
* Resultado esperado: El texto decodificado debe ser `pingüino`, sin celdas desconocidas.
* Resultado obtenido: PASS sin errores.

<img width="605" height="377" alt="image" src="https://github.com/user-attachments/assets/b3515802-d4f7-43e2-a1ec-81116b250e3c" />

**Prueba funcional de interfaz**

* Entrada: `pingüino`
* Procedimiento:
   1. Cambiar al modo **Braille → Texto**.
   2. Pegar el braille correspondiente a `pingüino`.
   3. Presionar **Traducir a texto**.
* Resultado esperado: El resultado debe mostrar `pingüino` correctamente.
* Resultado obtenido: La interfaz mostró `pingüino` correctamente.

<img width="671" height="409" alt="image" src="https://github.com/user-attachments/assets/3c417c8a-c62b-495e-9377-3ec606444812" />

---

## Caso de prueba INV-07: Números 0–9 con prefijo numérico

**Objetivo**
Verificar que los dígitos 0–9 se decodifiquen correctamente a partir del prefijo numérico y la serie a–j.

**Prueba unitaria (Jest)**

* Entrada: `0123456789`
* Resultado esperado: El texto decodificado debe ser `0123456789`, sin celdas desconocidas.
* Resultado obtenido: PASS sin errores.

<img width="599" height="338" alt="image" src="https://github.com/user-attachments/assets/6269c0a2-c0d2-406b-9272-3c54636ace9d" />

**Prueba funcional de interfaz**

* Entrada: `0123456789`
* Procedimiento:
   1. Cambiar al modo **Braille → Texto**.
   2. Pegar el braille correspondiente a `0123456789` (prefijo numérico + serie a–j).
   3. Presionar **Traducir a texto**.
* Resultado esperado: El resultado debe mostrar `0123456789`.
* Resultado obtenido: La interfaz mostró `0123456789` correctamente.

<img width="694" height="392" alt="image" src="https://github.com/user-attachments/assets/d3c2fa04-fd0e-441a-b283-ebcae3d753d0" />

---

## Caso de prueba INV-08: Letra tras número (indicador de letra-tras-número)

**Objetivo**
Verificar que una letra de la serie numérica (a–j) inmediatamente después de un número se decodifique como letra y no como dígito.

**Prueba unitaria (Jest)**

* Entrada: `5c`
* Resultado esperado: El texto decodificado debe ser `5c` (el `5` como dígito, la `c` como letra).
* Resultado obtenido: PASS sin errores.

<img width="674" height="337" alt="image" src="https://github.com/user-attachments/assets/f2c44ef0-bcd1-4cde-90e3-3f7a67a99b4d" />

**Prueba funcional de interfaz**

* Entrada: `5c`
* Procedimiento:
   1. Cambiar al modo **Braille → Texto**.
   2. Pegar el braille correspondiente a `5c` (incluye el indicador de letra-tras-número entre el `5` y la `c`).
   3. Presionar **Traducir a texto**.
* Resultado esperado: El resultado debe mostrar `5c`, sin confundir la `c` con un dígito.
* Resultado obtenido: La interfaz mostró `5c` correctamente.
<img width="737" height="377" alt="image" src="https://github.com/user-attachments/assets/ee80dd6d-79a1-44bb-8f9b-4caa46358c79" />
---

## Caso de prueba INV-09: Números con coma o punto decimal

**Objetivo**
Verificar que los números con coma o punto decimal se decodifiquen sin duplicar el prefijo numérico.

**Prueba unitaria (Jest)**

* Entrada: `20,15` y `46.37`
* Resultado esperado: El texto decodificado debe ser idéntico al original en ambos casos.
* Resultado obtenido: PASS sin errores.

<img width="653" height="321" alt="image" src="https://github.com/user-attachments/assets/361f92f6-2da9-4569-9cf4-dc8f542bd559" />

**Prueba funcional de interfaz**

* Entrada: `20,15`
* Procedimiento:
   1. Cambiar al modo **Braille → Texto**.
   2. Pegar el braille correspondiente a `20,15`.
   3. Presionar **Traducir a texto**.
* Resultado esperado: El resultado debe mostrar `20,15`.
* Resultado obtenido: La interfaz mostró `20,15` correctamente.
<img width="680" height="425" alt="image" src="https://github.com/user-attachments/assets/1e01fa43-a7a6-4651-8b26-7b938e1d5082" />
---

## Caso de prueba INV-10: Fecha con guiones

**Objetivo**
Verificar que una fecha con guiones se decodifique correctamente.

**Prueba unitaria (Jest)**

* Entrada: `25-11-2025`
* Resultado esperado: El texto decodificado debe ser `25-11-2025`.
* Resultado obtenido: PASS sin errores.


<img width="615" height="326" alt="image" src="https://github.com/user-attachments/assets/da0cd6d4-862f-47cc-bdab-ad003870d515" />

**Prueba funcional de interfaz**

* Entrada: `25-11-2025`
* Procedimiento:
   1. Cambiar al modo **Braille → Texto**.
   2. Pegar el braille correspondiente a `25-11-2025`.
   3. Presionar **Traducir a texto**.
* Resultado esperado: El resultado debe mostrar `25-11-2025`.
* Resultado obtenido: La interfaz mostró `25-11-2025` correctamente.

<img width="715" height="368" alt="image" src="https://github.com/user-attachments/assets/6ea1d7c5-80c0-444b-878f-25e4d269949a" />

---

## Caso de prueba INV-11: Siglas con guion y mayúsculas (FIS-EPN)

**Objetivo**
Verificar que siglas con guion y mayúsculas se decodifiquen correctamente.

**Prueba unitaria (Jest)**

* Entrada: `FIS-EPN`
* Resultado esperado: El texto decodificado debe ser `FIS-EPN`.
* Resultado obtenido: PASS sin errores.

<img width="588" height="325" alt="image" src="https://github.com/user-attachments/assets/f62a5132-6d33-4f0a-aa43-98bca1935651" />

**Prueba funcional de interfaz**

* Entrada: `FIS-EPN`
* Procedimiento:
   1. Cambiar al modo **Braille → Texto**.
   2. Pegar el braille correspondiente a `FIS-EPN`.
   3. Presionar **Traducir a texto**.
* Resultado esperado: El resultado debe mostrar `FIS-EPN`.
* Resultado obtenido: La interfaz mostró `FIS-EPN` correctamente.

<img width="691" height="370" alt="image" src="https://github.com/user-attachments/assets/8df7d95f-7031-4395-9362-9c76d3cae649" />

---

## Caso de prueba INV-12: Múltiples espacios consecutivos

**Objetivo**
Verificar que los espacios múltiples se mantengan correctamente al decodificar (mismo criterio que TC-15 de la primera iteración, aplicado ahora al sentido inverso).

**Prueba unitaria (Jest)**

* Entrada: `hola     mundo` (5 espacios)
* Resultado esperado: El texto decodificado debe conservar los 5 espacios entre las palabras.
* Resultado obtenido: PASS sin errores.

<img width="588" height="324" alt="image" src="https://github.com/user-attachments/assets/0f2265b2-8268-465b-8b1b-6f204db59749" />

**Prueba funcional de interfaz**

* Entrada: `hola     mundo`
* Procedimiento:
   1. Cambiar al modo **Braille → Texto**.
   2. Pegar el braille correspondiente a `hola     mundo` (5 espacios).
   3. Presionar **Traducir a texto**.
* Resultado esperado: El resultado debe mostrar la separación completa entre `hola` y `mundo`, sin colapsar los espacios.
* Resultado obtenido: La interfaz mantuvo correctamente la separación entre palabras.

<img width="733" height="401" alt="image" src="https://github.com/user-attachments/assets/27904262-c907-403e-b8d5-00d6f38ee3ad" />

---

## Caso de prueba INV-13: Signos de puntuación sin ambigüedad

**Objetivo**
Verificar que los signos de puntuación que no comparten celda con otro carácter se decodifiquen tal cual.

**Prueba unitaria (Jest)**

* Entrada: `Hola, mundo; ! ? : ( ) *`
* Resultado esperado: El texto decodificado debe ser idéntico al original.
* Resultado obtenido: PASS sin errores.

<img width="598" height="313" alt="image" src="https://github.com/user-attachments/assets/0e535ea4-11be-4ab2-bb74-6baabc1d4ea8" />

**Prueba funcional de interfaz**

* Entrada: `Hola, mundo; ! ? : ( ) *`
* Procedimiento:
   1. Cambiar al modo **Braille → Texto**.
   2. Pegar el braille correspondiente a la frase.
   3. Presionar **Traducir a texto**.
* Resultado esperado: El resultado debe mostrar la frase completa con todos sus signos de puntuación.
* Resultado obtenido: La interfaz mostró la frase completa correctamente.

<img width="685" height="367" alt="image" src="https://github.com/user-attachments/assets/5e91d265-e510-4d66-9c60-f227b9b148c6" />

---

## Caso de prueba INV-14: Ambigüedad conocida — apóstrofe y punto comparten celda

**Objetivo**
Documentar que, por ser una limitación real del braille grado 1 de 6 puntos (hay más signos que combinaciones posibles), el apóstrofe (`'`) y el punto (`.`) comparten la misma celda, y al decodificar siempre se obtiene el punto.

**Prueba unitaria (Jest)**

* Entrada: `'` (apóstrofe)
* Resultado esperado: El texto decodificado debe ser `.` (comportamiento esperado del sistema, no un error).
* Resultado obtenido: PASS — se obtuvo `.` como estaba previsto.

<img width="599" height="334" alt="image" src="https://github.com/user-attachments/assets/c086ba32-2857-4bbe-9545-d7af03dbc189" />

**Prueba funcional de interfaz**

* Entrada: `'`
* Procedimiento:
   1. En el modo **Texto → Braille**, escribir `'` y traducir; copiar el braille generado.
   2. Cambiar al modo **Braille → Texto** y pegar ese braille.
   3. Presionar **Traducir a texto**.
* Resultado esperado: El resultado debe mostrar `.`, evidenciando la celda compartida.
* Resultado obtenido: La interfaz mostró `.` en vez de `'`, confirmando la limitación documentada.

<img width="682" height="367" alt="image" src="https://github.com/user-attachments/assets/c8707c93-210c-4378-8d7c-10c3b207d593" />

---

## Caso de prueba INV-15: ¿ y ¡ se distinguen de ? y ! por contexto

**Objetivo**
Verificar que el sistema distinga los signos de apertura (¿, ¡) de sus versiones de cierre (?, !) según la posición en la frase, gracias a la desambiguación por contexto agregada en esta iteración.

**Prueba unitaria (Jest)**

* Entrada: `¿cómo?`, `¡Bien!` y `¿Vienes hoy? Claro que sí`
* Resultado esperado: El texto decodificado debe ser idéntico al original en los tres casos.
* Resultado obtenido: PASS sin errores.

<img width="639" height="353" alt="image" src="https://github.com/user-attachments/assets/afb29934-e32a-4792-ac61-3c289e2c7d6f" />

**Prueba funcional de interfaz**

* Entrada: `¿cómo?`
* Procedimiento:
   1. En el modo **Texto → Braille**, escribir `¿cómo?` y traducir; copiar el braille generado.
   2. Cambiar al modo **Braille → Texto** y pegar ese braille.
   3. Presionar **Traducir a texto**.
* Resultado esperado: El resultado debe mostrar `¿cómo?` completo, con la apertura y el cierre correctos.
* Resultado obtenido: La interfaz mostró `¿cómo?` correctamente.

<img width="725" height="359" alt="image" src="https://github.com/user-attachments/assets/70ace500-f184-48c2-aa88-e5391ff458af" />

---

## Caso de prueba INV-16: Ambigüedad conocida — comillas angulares y comillas rectas

**Objetivo**
Documentar que las comillas angulares (`«` `»`) comparten celda con las comillas rectas (`"`) y, al no tener desambiguación por contexto implementada, siempre se decodifican como comillas rectas.

**Prueba unitaria (Jest)**

* Entrada: `«cita»`
* Resultado esperado: El texto decodificado debe ser `"cita"` (comportamiento esperado del sistema, no un error).
* Resultado obtenido: PASS — se obtuvo `"cita"` como estaba previsto.

<img width="601" height="328" alt="image" src="https://github.com/user-attachments/assets/80f47051-abfe-4c88-a2f4-6c8b850d2a52" />

**Prueba funcional de interfaz**

* Entrada: `«cita»`
* Procedimiento:
   1. En el modo **Texto → Braille**, escribir `«cita»` y traducir; copiar el braille generado.
   2. Cambiar al modo **Braille → Texto** y pegar ese braille.
   3. Presionar **Traducir a texto**.
* Resultado esperado: El resultado debe mostrar `"cita"` (con comillas rectas), evidenciando la celda compartida.
* Resultado obtenido: La interfaz mostró `"cita"`, confirmando la limitación documentada.

<img width="716" height="394" alt="image" src="https://github.com/user-attachments/assets/a2e0d22d-0dd9-4a6f-8dea-7362ac95d544" />

---

## Caso de prueba INV-17: + y / se distinguen por contexto numérico

**Objetivo**
Verificar que los operadores `+` y `/` (que comparten celda con `¡`/`!` e `í` respectivamente) se decodifiquen correctamente cuando aparecen en un contexto numérico, gracias a la desambiguación por contexto.

**Prueba unitaria (Jest)**

* Entrada: `3 + 5`, `3 / 4` y `(3 + 5) * 2 - 4 / 2`
* Resultado esperado: El texto decodificado debe ser idéntico al original en los tres casos.
* Resultado obtenido: PASS sin errores.

<img width="592" height="288" alt="image" src="https://github.com/user-attachments/assets/af416156-c3c3-4298-b380-ecf3912ec349" />

**Prueba funcional de interfaz**

* Entrada: `(3 + 5) * 2 - 4 / 2`
* Procedimiento:
   1. En el modo **Texto → Braille**, escribir `(3 + 5) * 2 - 4 / 2` y traducir; copiar el braille generado.
   2. Cambiar al modo **Braille → Texto** y pegar ese braille.
   3. Presionar **Traducir a texto**.
* Resultado esperado: El resultado debe mostrar `(3 + 5) * 2 - 4 / 2` con los operadores correctos.
* Resultado obtenido: La interfaz mostró la expresión completa correctamente.

<img width="678" height="391" alt="image" src="https://github.com/user-attachments/assets/e33ed3ae-3001-47e9-9203-36ec279c905a" />

---

## Caso de prueba INV-18 [LIMITACIÓN CONOCIDA]: í seguida de puntuación sin espacio

**Objetivo**
Dejar documentado, para su corrección futura, un caso real en el que la desambiguación de la í falla: cuando una palabra termina en í y le sigue un signo de puntuación pegado (sin espacio), el sistema la confunde con `/`.

**Prueba unitaria (Jest)**

* Entrada: `Sí.`
* Resultado esperado (comportamiento correcto, aún no implementado): `Sí.`
* Resultado obtenido (comportamiento actual): `S/.` — la í se decodifica como `/`.
* Estado: PASS respecto al comportamiento *actual* del sistema (la prueba documenta el bug a propósito); pendiente de corrección en el módulo `traductor-inverso.js`.

<img width="612" height="367" alt="image" src="https://github.com/user-attachments/assets/621a3102-eb94-4a37-ac0e-117ef0fa1a7f" />


**Prueba funcional de interfaz**

* Entrada: `Sí.`
* Procedimiento:
   1. En el modo **Texto → Braille**, escribir `Sí.` y traducir; copiar el braille generado.
   2. Cambiar al modo **Braille → Texto** y pegar ese braille.
   3. Presionar **Traducir a texto**.
* Resultado esperado (una vez corregido el bug): `Sí.`
* Resultado obtenido (actual): `S/.`, confirmando visualmente el bug en la interfaz.

<img width="740" height="395" alt="image" src="https://github.com/user-attachments/assets/5293fb78-3f1b-4f20-80b0-9a6af00a606b" />

---

## Caso de prueba INV-19: Carácter que no es braille Unicode

**Objetivo**
Verificar que un carácter fuera del rango Unicode braille (U+2800–U+283F) se cuente como "desconocido" y no aparezca en el texto resultante.

**Prueba unitaria (Jest)**

* Entrada: `a` (letra latina común, no un carácter braille)
* Resultado esperado: El texto resultante debe quedar vacío y debe contarse 1 celda desconocida.
* Resultado obtenido: PASS sin errores.

<img width="625" height="326" alt="image" src="https://github.com/user-attachments/assets/45256980-a731-4b66-84a9-9b0e0a89aacb" />

**Prueba funcional de interfaz**

* Entrada: `a`
* Procedimiento:
   1. Cambiar al modo **Braille → Texto**.
   2. Escribir directamente la letra `a` (no braille) en el campo de entrada.
   3. Presionar **Traducir a texto**.
* Resultado esperado: El resultado debe indicar 1 carácter no reconocido y no mostrar texto en el resultado.
* Resultado obtenido: La interfaz reportó correctamente 1 celda no reconocida.

<img width="712" height="275" alt="image" src="https://github.com/user-attachments/assets/27b23029-817c-4bdb-a521-38c44ae0f2c5" />

---

## Caso de prueba INV-20: Cadena vacía

**Objetivo**
Verificar que una cadena vacía no genere texto ni celdas desconocidas, y que la interfaz vuelva a su estado inicial.

**Prueba unitaria (Jest)**

* Entrada: `""` (cadena vacía)
* Resultado esperado: El texto resultante y el conteo de desconocidos deben quedar en cero.
* Resultado obtenido: PASS sin errores.

<img width="589" height="325" alt="image" src="https://github.com/user-attachments/assets/53ff632c-053b-4fa6-8e8f-8ea45a69ccbc" />

**Prueba funcional de interfaz**

* Entrada: *(campo vacío)*
* Procedimiento:
   1. Cambiar al modo **Braille → Texto**.
   2. Dejar el campo de entrada vacío (o presionar **Limpiar**).
   3. Presionar **Traducir a texto**.
* Resultado esperado: La interfaz debe mostrar el mensaje inicial ("Compón o pega braille y pulsa «Traducir a texto»") sin mostrar resultado ni acciones de impresión.
* Resultado obtenido: La interfaz mantuvo correctamente el estado inicial.

<img width="728" height="263" alt="image" src="https://github.com/user-attachments/assets/64a5c360-62ca-40ce-aee2-82ceaad079f1" />

---
