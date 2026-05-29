# Documentación del ambiente de desarrollo

Para el desarrollo del proyecto se definió un ambiente de trabajo que permitiera al equipo programar de forma organizada, colaborar simultáneamente y mantener un control adecuado de los cambios realizados durante todo el proceso. Las herramientas seleccionadas fueron escogidas por su facilidad de uso, compatibilidad y utilidad en proyectos colaborativos de desarrollo web.


# Herramientas seleccionadas

## Visual Studio Code

Como entorno de desarrollo se utilizó Visual Studio Code como editor principal. Esta herramienta facilitó la escritura y organización del código para el resaltado de sintaxis, detección de errores y administración integrada de Git.

Además, permitió trabajar de manera más eficiente mediante extensiones orientadas al desarrollo en HTML, CSS y JavaScript, ayudando a mantener una estructura de código más limpia y organizada.



## Git como sistema de control de versiones

Para gestionar los cambios realizados en el proyecto se utilizó Git. Esta herramienta permitió registrar cada modificación realizada en el código fuente, facilitando el seguimiento del trabajo de cada integrante y evitando la pérdida de información importante.

El uso de Git ayudó también a mantener distintas versiones del proyecto y resolver conflictos cuando varios miembros trabajaban sobre archivos similares. Gracias a esto, el equipo pudo desarrollar funcionalidades de manera paralela sin afectar la estabilidad del sistema principal.


## GitHub

El repositorio del proyecto fue alojado en GitHub, plataforma que permitió almacenar el código de forma remota y centralizar el trabajo colaborativo del equipo.

GitHub fue utilizado para organizar el flujo de trabajo mediante ramas, commits y Pull Requests. Esto permitió revisar cambios antes de integrarlos al proyecto principal y mantener una mejor coordinación entre los integrantes.


## Tecnologías de desarrollo utilizadas

El proyecto fue desarrollado utilizando tecnologías web que permitieron construir tanto la estructura visual como la lógica funcional de la aplicación.

### HTML5

Se utilizó HTML5 para crear la estructura principal de las páginas web, organizando elementos como botones, formularios, textos e interfaces de usuario.

### CSS3

CSS3 fue empleado para el diseño y la apariencia visual del sistema. Gracias a esta tecnología se pudo mejorar la presentación de la interfaz, aplicar estilos personalizados y brindar una experiencia más amigable para el usuario.

### JavaScript

JavaScript se utilizó para implementar la lógica y funcionalidades dinámicas del proyecto. Permitió realizar validaciones, interacción con el usuario y comportamiento dinámico dentro de la aplicación.


# Requisitos mínimos del entorno de desarrollo

Para garantizar el correcto funcionamiento del proyecto y facilitar el trabajo colaborativo entre los integrantes del equipo, se establecieron algunos requisitos mínimos de hardware y software para el entorno de desarrollo.

## Requisitos de software

- Sistema operativo Windows 10 o superior.
- Visual Studio Code como editor de código.
- Git instalado para el control de versiones.
- Navegador web moderno compatible con HTML5, CSS3 y JavaScript.
- Cuenta activa en GitHub para acceso al repositorio remoto.


# Flujo de trabajo aplicado

El equipo trabajó utilizando la estrategia GitHub Flow, la cual permitió mantener un desarrollo organizado y seguro sin trabajar directamente sobre la rama principal del proyecto.

La rama principal utilizada fue:

- `main` → contiene únicamente versiones estables y funcionales del proyecto.

Cada integrante trabajó en ramas independientes denominadas `feature`, desarrollando módulos específicos del sistema antes de integrarlos a la rama principal.

Para el desarrollo colaborativo del proyecto se aplicó la metodología GitHub Flow, la cual permite organizar el trabajo del equipo mediante ramas independientes, evitando modificaciones directas sobre la rama principal.

El flujo aplicado fue:

1. Clonar el repositorio desde GitHub.
2. Crear una rama `feature` a partir de `main`.
3. Actualizar cambios mediante `git pull`.
4. Desarrollar funcionalidades de manera independiente.
5. Registrar cambios usando `git add` y `git commit`.
6. Subir cambios mediante `git push`.
7. Validar funcionamiento del módulo.
8. Integrar cambios hacia `main` mediante merge.

Este flujo permitió mantener estabilidad en el proyecto y trabajo simultáneo entre integrantes.


# Estrategia de ramificación - GitHub Flow

Para mantener un mejor control del desarrollo y evitar conflictos en el código, se aplicó una estrategia de ramificación basada en GitHub Flow. Utilizando una rama principal y ramas auxiliares para documentación y desarrollo.

Se trabajó utilizando:

- Una rama principal (`main`)
- Una rama de documentación (`documentacion`)
- Varias ramas `feature` para funcionalidades específicas

## Estructura de ramas utilizada

Ejemplos de ramas utilizadas durante el desarrollo:


```plaintext
main
│
├── documentacion
│
├── feature/datos-braille
├── feature/traductor-base
├── feature/senaletica
├── feature/interfaz
└── feature/styles
```

<img width="1623" height="685" alt="{B344BCAD-1FDB-43E0-BF56-ECD6AFE83163}" src="https://github.com/user-attachments/assets/656c2faa-9e15-4bd6-8179-2edd7bd1221f" />



## Descripción de ramas

## `main`

Contiene la versión estable y funcional del sistema.


## `documentacion`

Contiene toda la documentación técnica y funcional del proyecto:

- Ambiente de desarrollo
- Estrategia de ramificación
- Diseño arquitectónico
- Manual de usuario
- Casos de prueba
- Documentación técnica


# Ramas `feature`

Cada rama fue utilizada para desarrollar módulos independientes del sistema.

## `feature/datos-braille`

Contiene las estructuras y patrones braille del sistema:

- Letras
- Números
- Signos
- Vocales acentuadas
- Símbolos especiales


## `feature/traductor-base`

Implementa la lógica principal de traducción de texto español hacia braille.


## `feature/senaletica`

Desarrolla la generación visual e impresión de señalética braille accesible.


## `feature/interfaz`

Gestiona la interacción del usuario, eventos de la interfaz y conexión entre módulos del sistema.


## `feature/frontend`

Contiene la estructura visual desarrollada con HTML y CSS para la interfaz gráfica del proyecto.


![alt text](image.png)


# Integración de módulos

Debido a la dependencia funcional entre componentes, las ramas fueron integradas progresivamente siguiendo un orden lógico.

El flujo de integración aplicado fue:

```plaintext
feature/datos-braille
↓
feature/traductor-base
↓
feature/senaletica
↓
feature/interfaz
↓
feature/styles
```

Esto permitió integrar primero la lógica base del sistema y posteriormente las capas visuales e interacción de usuario.

![alt text]({2814EFFD-3072-4D40-9490-588A9526956C}.png)


# Validación mediante pruebas

Para verificar el correcto funcionamiento del sistema se realizaron pruebas automatizadas utilizando Jest y Node.js.

Durante las pruebas se detectó inicialmente un problema relacionado con operadores matemáticos (`+`, `*`, `/`), los cuales eran identificados como caracteres desconocidos por el traductor.

![alt text]({6BA2AA19-9B12-4B29-B708-015D5CE5E2E7}.png)


Posteriormente el problema fue corregido agregando soporte para dichos signos en el módulo correspondiente.

Finalmente se obtuvo una ejecución exitosa de los 15 casos de prueba definidos para el proyecto.

![alt text]({C8B85ED8-59CA-495C-97DC-67E8B6CD1B72}.png)


# Justificación de la estrategia utilizada

La metodología GitHub Flow fue seleccionada debido a su simplicidad y facilidad para el trabajo colaborativo.

Esta estrategia permitió:

- Separar funcionalidades por integrante.
- Mantener control de cambios.
- Evitar sobrescritura de código.
- Integrar módulos de forma segura.
- Validar funcionalidades antes de llegar a `main`.
- Mantener estabilidad en el sistema principal.


# Resultado obtenido

La estrategia de desarrollo aplicada permitió construir el sistema de manera modular, organizada y colaborativa. El uso de ramas independientes, integración progresiva y validación mediante pruebas permitió mantener estabilidad.
