# Documentación del ambiente de desarrollo

Para el desarrollo del proyecto se definió un ambiente de trabajo que permitiera al equipo programar de forma organizada, colaborar simultáneamente y mantener un control adecuado de los cambios realizados durante todo el proceso. Las herramientas seleccionadas fueron escogidas por su facilidad de uso, compatibilidad y utilidad en proyectos colaborativos de desarrollo web.


# Herramientas seleccionadas

## Visual Studio Code

Como entorno de desarrollo se utilizó Visual Studio Code como editor principal. Esta herramienta facilitó la escritura y organización del código para el resaltado de sintaxis, detección de errores y administración integrada de Git.

Además, permitió trabajar de manera más eficiente mediante extensiones orientadas al desarrollo en HTML, CSS y JavaScript, ayudando a mantener una estructura de código más limpia y organizada.



## Git como sistema de control de versiones

Para gestionar los cambios realizados en el proyecto se utilizó Git. Esta herramienta permitió registrar cada modificación realizada en el código fuente, facilitando el seguimiento del trabajo de cada integrante y evitando la pérdida de información importante.

El uso de Git ayudó también a mantener distintas versiones del proyecto y resolver conflictos cuando varios miembros trabajaban sobre archivos similares. Gracias a esto, el equipo pudo desarrollar funcionalidades de manera paralela sin afectar la estabilidad del sistema principal.


## GitHub para el trabajo colaborativo

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

Cada integrante desarrolló nuevas funcionalidades o correcciones en ramas independientes creadas a partir de la rama principal.

Para el desarrollo colaborativo del proyecto se aplicó la metodología GitHub Flow, la cual permite organizar el trabajo del equipo mediante ramas independientes, evitando modificaciones directas sobre la rama principal.

El flujo aplicado fue:

1. Clonar el repositorio desde GitHub.
2. Acceder a la rama correspondiente.
3. Actualizar cambios mediante git pull.
4. Realizar modificaciones.
5. Guardar cambios con git add y git commit.
6. Subir cambios mediante git push.
7. Integrar cambios a la rama principal una vez validados.

Este flujo permitió mantener estabilidad en el proyecto y trabajo simultáneo entre integrantes.


# Estrategia de ramificación - GitHub Flow

Para mantener un mejor control del desarrollo y evitar conflictos en el código, se aplicó una estrategia de ramificación basada en GitHub Flow. Utilizando una rama principal y ramas auxiliares para documentación y desarrollo.

## Estructura de ramas utilizada

Ejemplos de ramas utilizadas durante el desarrollo:


```plaintext
main
│
├── documentacion
│
├── feature/abecedario
├── feature/numeros-signos
├── feature/acentos-validacion
├── feature/senaletica
└── feature/interfaz-pruebas
```


## Descripción de ramas

### `main`

Contiene la versión estable y funcional del sistema.


### `documentacion`

Contiene toda la documentación técnica y funcional del proyecto:

* Diseño arquitectónico
* Ambiente de desarrollo / Ramificación
* Documentación técnica
* Casos de prueba
* Manual de usuario


### Ramas `feature`

Cada integrante desarrolló una funcionalidad específica de manera independiente:

* **feature/abecedario:** Traducción del alfabeto braille
* **feature/numeros-signos:** Conversión de números y signos básicos
* **feature/acentos-validacion:** Soporte para vocales acentuadas y validación de entradas
* **feature/senaletica:** Generación visual de señalética braille
* **feature/interfaz-pruebas:** Interfaz gráfica y validaciones funcionales



# Justificación de la estrategia

Se seleccionó **GitHub Flow** debido a su simplicidad, facilidad de integración y control eficiente del trabajo colaborativo.

Esta estrategia permitió:

* Separar funcionalidades por integrante.
* Evitar conflictos de sobrescritura.
* Mantener la estabilidad de la rama principal.
* Llevar trazabilidad de cambios.


# Resultado obtenido

La estrategia permitió desarrollar el sistema de forma ordenada, colaborativa y controlada, garantizando una correcta evolución del software y cumplimiento de los objetivos establecidos para el proyecto.
