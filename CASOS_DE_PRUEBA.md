# Casos de Prueba — Traductor Braille
**Asignatura:** Construcción y Evolución de Software  
**Rama:** `documentacion`  
**Módulo testeado:** `brailleTranslator.js` → función `textoABraille(texto)`  
**Framework:** Jest  
**Comando de ejecución:** `npm test`

---

## Descripción general del caso de uso

El caso de uso principal de la aplicación *Traductor Braille* consiste en permitir al usuario ingresar un texto en español mediante un formulario web y obtener como resultado la representación en Braille Grado 1 (estándar ONCE B2), visualizada como cuadratines en pantalla. La lógica de conversión implementada en `textoABraille()` incluye:

- Convertir letras minúsculas del alfabeto español
- Manejar mayúsculas individuales y palabras completas en mayúsculas
- Aceptar vocales acentuadas (á, é, í, ó, ú)
- Reconocer la letra ñ
- Convertir números con el prefijo de número antepuesto
- Preservar los espacios tal como aparecen (sin normalización automática)
- Reemplazar caracteres no soportados con celdas de tipo `unknown`

La siguiente sección documenta los 14 casos de prueba empleados para validar el funcionamiento del módulo `brailleTranslator.js`.


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
![alt text](image-2.png)

### Prueba funcional de interfaz
- **Entrada:** `hola mundo`
- **Procedimiento:** 
1. Abrir la aplicación web en el navegador.
2. Ingresar el texto hola mundo en el área de entrada.
3. Presionar el botón de traducción.
4. Verificar la representación braille generada.
- **Resultado esperado:** El sistema debe mostrar correctamente la representación braille correspondiente al texto ingresado.
- **Resultado obtenido:** La interfaz generó correctamente los cuadratines braille sin errores visuales ni caracteres desconocidos.
![alt text](image-1.png)
![alt text](image-9.png)

---

### Caso de Prueba 2: Una mayúscula sola genera indicador simple
### Objetivo
Verificar que una sola letra mayúscula genere el prefijo May. una única vez antes de la letra.
### Prueba unitaria (Jest)
- **Entrada:** `Casa`
- **Resultado esperado:** Primera celda con special:"mayúscula" y mayusculaDoble: undefined,seguida de la celda de "c".
- **Resultado obtenido:** PASS sin errores.
![alt text](image-3.png)

### Prueba funcional de interfaz
- **Entrada:** `Casa`
- **Procedimiento:**
  1. Ingresar `Casa` en el área de texto.
  2. Presionar **Traducir a braille**.
  3. Verificar que aparece un solo indicador may. antes de la C.
- **Resultado esperado:** Un cuadratín may. seguido de c, a, s, a.
- **Resultado obtenido:** La interfaz mostró correctamente 
  may. | c | a | s | a.
![alt text](image-4.png)
![alt text](image-8.png)

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
![alt text](image-5.png)

### Prueba funcional de interfaz
- **Entrada:** `HOLA`
- **Procedimiento:**
  1. Ingresar `HOLA` en el área de texto.
  2. Presionar **Traducir a braille**.
  3. Verificar que aparece un solo bloque may.×2 al inicio.
- **Resultado esperado:** Un bloque may.×2 seguido de h, o, l, a.
- **Resultado obtenido:** La interfaz mostró correctamente 
  el indicador doble agrupado en recuadro azul.
![alt text](image-6.png)
![alt text](image-7.png)
---

## Caso de Prueba 4: Transcripción de vocales acentuadas
### Objetivo
Verificar que las vocales con tilde se conviertan a sus celdas Braille específicas del español.

### Prueba unitaria (Jest)
- **Entrada:** `áéíóú`
- **Resultado esperado:**  Celdas braille válidas para cada vocal acentuada, sin caracteres desconocidos.
- **Resultado obtenido:** PASS sin errores.
![alt text](image-12.png)

### Prueba funcional de interfaz
- **Entrada:** `áéíóú`
- **Procedimiento:**
  1. Ingresar `áéíóú` en el área de texto.
  2. Presionar **Traducir a braille**.
  3. Verificar que no aparecen celdas amarillas.
- **Resultado esperado:** 5 cuadratines braille sin advertencias.
- **Resultado obtenido:** Se tradujo correctamente las vocales con acento. 
  sin caracteres desconocidos.
![alt text](image-10.png)
![alt text](image-11.png)

----
## Caso de Prueba 5: Transcripción completa del alfabeto español
### Objetivo
Verificar que todas las letras del alfabeto español sean reconocidas y traducidas correctamente a sus respectivas celdas Braille.

### Prueba unitaria (Jest)
* **Entrada:** `abcdefghijklmnñopqrstuvwxyz`
* **Resultado esperado:** Todas las letras deben generar celdas braille válidas sin caracteres desconocidos.
* **Resultado obtenido:** PASS sin errores.
![alt text](image-21.png)

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
  ![alt text](image-18.png)
---

## Caso de Prueba 6: Transcripción de la vocal ü
### Objetivo
Verificar que la vocal `ü` sea reconocida y traducida correctamente a Braille.
### Prueba unitaria (Jest)
* **Entrada:** `pingüino`
* **Resultado esperado:** La palabra debe traducirse completamente sin caracteres desconocidos, incluyendo la vocal `ü`.
* **Resultado obtenido:** PASS sin errores.
![alt text](image-22.png)

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
![alt text](image-19.png)
![alt text](image-20.png)
---

## Caso de Prueba 7: Transcripción de signos de puntuación
### Objetivo
Verificar que distintos signos de puntuación y símbolos del español se traduzcan correctamente a sus respectivas celdas Braille.
### Prueba unitaria (Jest)
* **Entrada:** `"Hola, mundo; ¿cómo estás? ¡Bien!"`
* **Resultado esperado:** Todos los signos de puntuación deben generar celdas braille válidas sin producir caracteres desconocidos.
* **Resultado obtenido:** PASS sin errores.
![alt text](image-23.png)

### Prueba funcional de interfaz
* **Entrada:**`"Hola, mundo; ¿cómo estás? ¡Bien!"`
* **Procedimiento:**
  1. Ingresar el texto en el área de entrada.
  2. Presionar **Traducir a braille**.
  3. Verificar visualmente la representación de los signos de puntuación.
* **Resultado esperado:** La interfaz debe representar correctamente comillas, coma, punto y coma, signos de interrogación y signos de exclamación.
* **Resultado obtenido:**
  La interfaz generó correctamente todos los signos de puntuación sin advertencias ni caracteres desconocidos.
![alt text](image-24.png)
![alt text](image-25.png)

---

## Caso de Prueba 8: Transcripción de números
### Objetivo
Verificar que el sistema traduzca correctamente los números del 0 al 9 utilizando el prefijo numérico Braille correspondiente.
### Prueba unitaria (Jest)
- **Entrada:**  `0123456789`
- **Resultado esperado:** La primera celda debe corresponder al indicador numérico (`#`) y los diez dígitos deben generar celdas Braille válidas sin caracteres desconocidos.
- **Resultado obtenido:** PASS sin errores.
![alt text](image-26.png)

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
![alt text](image-27.png)
![alt text](image-28.png)
---
## Caso de Prueba 9: Transcripción de operadores matemáticos básicos
### Objetivo
Verificar que los operadores matemáticos básicos (`+`, `*`, `/`) sean reconocidos y traducidos correctamente a sus respectivas celdas Braille.
### Prueba unitaria (Jest) — Ejecución inicial
* **Entrada:** `(3 + 5) * 2 - 4 / 2`
* **Resultado esperado:** Todos los operadores matemáticos deben generar celdas braille válidas sin caracteres desconocidos.
* **Resultado obtenido:** La prueba falló debido a que el sistema no reconoció correctamente tres operadores matemáticos presentes en la expresión.
![alt text](image-30.png)
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
![alt text](image-29.png)
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
  ![alt text](image-31.png)
  ![alt text](image-32.png)
---

## Caso de Prueba 10: Fecha con guiones
### Objetivo
Verificar que una fecha en formato DD-MM-YYYY  se traduzca correctamente con prefijos numéricos  y guiones entre grupos.

### Prueba unitaria (Jest)
- **Entrada:** `25-11-2025`
- **Resultado esperado:** desconocidos === 0, 
  celdas válidas con guiones entre números.
- **Resultado obtenido:** PASS
![alt text](image-52.png)
### Prueba funcional de interfaz
- **Entrada:** `25-11-2025`
- **Procedimiento:**
  1. Ingresar la fecha en el área de texto.
  2. Presionar **Traducir a braille**.
  3. Verificar prefijos # y guiones correctos.
- **Resultado esperado:** # 2 5 - # 1 1 - # 2 0 2 5
- **Resultado obtenido:** La interfaz generó correctamente la fecha con guiones.
![alt text](image-34.png)
![alt text](image-35.png)

## Caso de Prueba 11: Palabra con vocal acentuada í

### Objetivo
Verificar que la palabra "sandía" con la vocal 
í acentuada se traduzca correctamente.
### Prueba unitaria (Jest)
- **Entrada:** `sandía`
- **Resultado esperado:** 6 celdas, 
  desconocidos === 0.
- **Resultado obtenido:** PASS
![alt text](image-53.png)

### Prueba funcional de interfaz
- **Entrada:** `sandía`
- **Procedimiento:**
  1. Ingresar `sandía` en el área de texto.
  2. Presionar **Traducir a braille**.
  3. Verificar 6 cuadratines sin advertencias.
- **Resultado esperado:** s|a|n|d|í|a sin errores.
- **Resultado obtenido:** La interfaz generó 
  correctamente los 6 cuadratines.
![alt text](image-37.png)
![alt text](image-38.png)

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
![alt text](image-54.png)
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
![alt text](image-40.png)
![alt text](image-41.png)

## Caso de Prueba 13: Número con coma decimal

### Objetivo
Verificar que un número con coma decimal como 20,15 no genere un prefijo # doble después de la coma.
### Prueba unitaria (Jest) — Ejecución inicial
- **Entrada:** `20,15`
- **Resultado esperado:** El prefijo numérico # aparece solo una vez al inicio del número.
- **Resultado obtenido:** El prefijo # apareció dos veces, una antes del 20 y otra antes del 15, lo que no corresponde al estándar Braille español por loq eu la prueba falló.
![alt text](image-42.png)

### Análisis del fallo
Al encontrar la coma, el traductor interpretaba que la secuencia numérica había terminado. Cuando llegaba al dígito 1 después de la coma, lo trataba como el inicio de un número nuevo y añadía otro prefijo #. Sin embargo en Braille español, la coma entre dígitos actúa como separador decimal y los números que siguen pertenecen a la misma secuencia,por lo que no deben llevar un nuevo prefijo.

### Solución aplicada
Se modificó la lógica en traductor-base.js para detectar cuando una coma está entre dos secuencias de dígitos y mantener el modo numérico activo, evitando así que se inserte un prefijo # adicional.
### Re-ejecución
- **Resultado obtenido:** El prefijo numérico 
  aparece solo una vez al inicio, quedando la 
  traducción como # | 2 | 0 | , | 1 | 5.
![alt text](image-55.png)
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
![alt text](image-45.png)
- **Resultado obtenido (tras corrección):** 
  La interfaz generó correctamente una sola 
  secuencia numérica sin prefijo doble.
![alt text](image-44.png)

---
## Caso de Prueba 14: Número con punto decimal
### Objetivo
Verificar que un número con punto decimal como `46.37` mantenga una sola secuencia numérica y no genere un prefijo `#` adicional después del punto.

### Prueba unitaria (Jest)
* **Entrada:** `46.37`

* **Resultado esperado:** El prefijo numérico `#` debe aparecer únicamente una vez al inicio del número decimal.
* **Resultado obtenido:** La prueba se ejecutó correctamente y el sistema mantuvo una sola secuencia numérica sin insertar un segundo prefijo `#` después del punto decimal.

![alt text](image-56.png)

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

![alt text](image-47.png)
![alt text](image-48.png)
---
## Caso de Prueba 15: Manejo de múltiples espacios consecutivos
### Objetivo
Verificar que múltiples espacios consecutivos se mantengan correctamente en la traducción Braille y se representen como separaciones visibles entre palabras.

### Prueba unitaria (Jest)
- **Entrada:** `hola     mundo` (5 espacios)
- **Resultado esperado:** La salida debe contener múltiples celdas de tipo `space` entre las palabras, manteniendo la separación original del texto.
- **Resultado obtenido:** PASS — los espacios fueron procesados correctamente sin errores.
![alt text](image-57.png)

### Prueba funcional de interfaz
- **Entrada:** `hola     mundo`
- **Procedimiento:**
  1. Abrir la aplicación web.
  2. Ingresar el texto `hola     mundo` con 5 espacios consecutivos.
  3. Presionar el botón **Traducir a braille**.
  4. Verificar visualmente la separación entre las palabras.
- **Resultado esperado:** La interfaz debe mostrar una separación visible equivalente a los espacios ingresados, sin eliminar ni colapsar espacios.

- **Resultado obtenido:** La interfaz mantuvo correctamente la separación entre palabras y representó los espacios sin alterar el formato original del texto.

![alt text](image-50.png)
![alt text](image-51.png)
---