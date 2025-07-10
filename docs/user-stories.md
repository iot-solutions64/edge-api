# User stories
Este documento contiene las historias de usuario que se han definido para el proyecto con sus criterios de aceptación.

## TS-US08: Verificar humedad del suelo

**Como** desarrollador  
**Quiero** agregar un indicador de la humedad del suelo  
**Para** que los usuarios puedan ver el estado de los suelos de sus cultivos

### Criterios de aceptación

- **Escenario 1: Suelo con humedad dentro de los parámetros normales**
  - Dado que el endpoint/usuario está disponible
  - Cuando una solicitud GET sea enviada al presionar el botón "Detalles del cultivo"
  - Y la humedad del suelo esté dentro de los parámetros aceptables (high: 80%-100%, medio: 60%-80%, bajo: 40%-60%) para el tipo de cultivo que es
  - Entonces se recibe una respuesta con el estado 200
  - Y la página mostrará todos los datos importantes del suelo
  - Y el mensaje "Humedad favorable" es mostrado

- **Escenario 2: Suelo con humedad ligeramente fuera de los parámetros normales**
  - Dado que el endpoint/usuario está disponible
  - Cuando una solicitud GET sea enviada al presionar el botón "Detalles del cultivo"
  - Y la humedad del suelo esté ligeramente fuera de los parámetros aceptables (high: 75%-79%, medio: 55%-59%  - o 81%-85%, bajo: 35%-39% o 61%-65%) para el tipo de cultivo que es
  - Entonces se recibe una respuesta con el estado 200
  - Y la página mostrará todos los datos importantes del suelo
  - Y el mensaje "Humedad ligeramente desfavorable, se recomienda una acción" es mostrado

- **Escenario 3: Suelo con humedad fuera de los parámetros normales**
  - Dado que el endpoint/usuario está disponible
  - Cuando una solicitud GET sea enviada al presionar el botón "Detalles del cultivo"
  - Y la humedad del suelo esté muy por fuera de los parámetros aceptables (high: < 75%, medio: < 55% o > 85%,  - bajo: < 35% o > 65%) para el tipo de cultivo que es
  - Entonces se recibe una respuesta con el estado 200
  - Y la página mostrará todos los datos importantes del suelo
  - Y el mensaje "Humedad desfavorable, se requiere acción" es mostrado

- **Escenario 4: Suelo inundado**
  - Dado que el endpoint/usuario está disponible
  - Cuando una solicitud GET sea enviada al presionar el botón "Detalles del cultivo"
  - Y el suelo se encuentre inundado
  - Entonces se recibe una respuesta con el estado 200
  - Y la página mostrará todos los datos importantes del suelo, junto con un botón "Acciones Recomendadas"
  - Y el mensaje "Suelo inundado, se requiere acción inmediata" es mostrado

- **Escenario 5: Suelo seco**
  - Dado que el endpoint/usuario está disponible
  - Cuando una solicitud GET sea enviada al presionar el botón "Detalles del cultivo"
  - Y el suelo se encuentre muy seco (humedad < 10%)
  - Entonces se recibe una respuesta con el estado 200
  - Y la página mostrará todos los datos importantes del suelo, junto con un botón "Acciones Recomendadas"
  - Y el mensaje "Suelo seco, se requiere acción inmediata" es mostrado

## TS-US09: Verificar temperatura del suelo	

**Como** desarrollador  
**Quiero** agregar un indicador de la temperatura del suelo  
**Para** que los usuarios puedan ver el estado de los suelos de sus cultivos

### Criterios de aceptación

- **Escenario 1: Suelo con temperatura dentro de los parámetros normales**
  - Dado que el endpoint/usuario está disponible
  - Cuando una solicitud GET sea enviada al presionar el botón "Detalles del cultivo"
  - Y la temperatura del suelo esté dentro de los parámetros aceptables (Tropicales/calor: 20–30°C, Templados: 15–25°C, Frescos/resistentes: 10–20°C) para el tipo de cultivo que es
  - Entonces se recibe una respuesta con el estado 200
  - Y la página mostrará todos los datos importantes del suelo
  - Y el mensaje "Temperatura favorable" es mostrado

- **Escenario 2: Suelo con temperatura ligeramente fuera de los parámetros normales**
  - Dado que el endpoint/usuario está disponible
  - Cuando una solicitud GET sea enviada al presionar el botón "Detalles del cultivo"
  - Y la temperatura del suelo esté ligeramente fuera de los parámetros aceptables (Tropicales/calor: 16-19°C o 31-34°C, Templados: 11-14°C o 25-28°C, Frescos/resistentes: 6-9°C o 21-24°C) para el tipo de cultivo que es
  - Entonces se recibe una respuesta con el estado 200
  - Y la página mostrará todos los datos importantes del suelo
  - Y el mensaje "Temperatura ligeramente desfavorable, se recomienda una acción" es mostrado

- **Escenario 3: Suelo con temperatura fuera de los parámetros normales**
  - Dado que el endpoint/usuario está disponible
  - Cuando una solicitud GET sea enviada al presionar el botón "Detalles del cultivo"
  - Y la temperatura del suelo esté muy por fuera de los parámetros aceptables (Tropicales/calor: < 15°C o > 35°C, Templados: < 11°C o > 28°C, Frescos/resistentes: < 6°C o > 24°C) para el tipo de cultivo que es
  - Entonces se recibe una respuesta con el estado 200
  - Y la página mostrará todos los datos importantes del suelo
  - Y el mensaje "Temperatura desfavorable, se requiere acción" es mostrado

- **Escenario 4: Suelo en llamas**
  - Dado que el endpoint/usuario está disponible
  - Cuando una solicitud GET sea enviada al presionar el botón "Detalles del cultivo"
  - Y el suelo está en llamas
  - Entonces se recibe una respuesta con el estado 200
  - Y la página mostrará todos los datos importantes del suelo, junto con un botón "Acciones Recomendadas"
  - Y el mensaje "Suelo en llamas, acción inmediata requerida" es mostrado