# LouuuGic

La guía para subir el repositorio completo a GitHub y conectarlo a Netlify está en el [README principal](../README.md). Los comandos de esta página se ejecutan desde la carpeta `louuugic`.

Una aplicación en español para entrenar la lógica matemática y seguir metas personales. Funciona sin cuentas y sin dependencias de producción.

## Abrir en tu equipo

Con Node.js 22 o posterior, ejecuta `npm start` desde esta carpeta y abre http://127.0.0.1:4173. Sirve la carpeta por HTTP; abrir el HTML directamente como archivo no permite cargar los módulos de JavaScript.

## Publicar en Netlify

Arrastra la carpeta `dist` a Netlify Drop. También puedes conectar este proyecto a Netlify: `netlify.toml` publica `dist` sin comando de compilación. Si el repositorio contiene esta aplicación dentro de `louuugic`, selecciona `louuugic` como directorio base.

Cada visitante obtiene sus propios datos en el almacenamiento local de su navegador. No hay cuentas, servidor, sincronización en la nube ni acceso a las metas de otros visitantes. En **Ajustes y respaldo** se puede exportar un archivo JSON e importarlo en otro navegador. Borrar los datos del sitio elimina el progreso local. El diseño usa fuentes de Google con fuentes de sistema como alternativa; no hay analítica ni servicios externos para almacenar metas.

## Funciones

- Retos aleatorios de suma, resta, multiplicación, división exacta y potencias pequeñas; tres niveles, pistas, sonido opcional y modo de 60 segundos.
- Selección de dos fichas con orden, comprobación, explicación del resultado, XP y estadísticas reales.
- Metas editables con rango horario, repetición diaria, días personalizados o una sola fecha, fechas de inicio y fin, color e icono.
- Calendario mensual real, agenda por fecha y estados pendiente, cumplida y no cumplida. Se puede marcar el día actual o días anteriores.
- Resumen de siete días, calendario anual de doce meses, rachas que respetan los días de descanso y logros.
- Diseño adaptable a móvil, navegación por teclado, movimiento reducido y respaldo validado antes de importar.

## Verificación

`npm run check` comprueba sintaxis y prueba 15.000 retos aleatorios, calendarios, repetición de metas, rachas y validación de respaldos.

`npm run test:browser` ejecuta las comprobaciones opcionales de interfaz con Chrome, Chromium o Edge instalado. Puedes indicar una ubicación diferente con `CHROME_PATH`. Los resultados se guardan en `artifacts/`, excluida de Git.

Inspiración: [Habitify](https://habitify.me/onboarding-instruction/create-new-habit), [Goal4](https://goal4.app/) y la [presentación de Habitify en YouTube](https://www.youtube.com/watch?v=kYmDyC389Y8).
