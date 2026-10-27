# LouuuGic

Un espacio en español para entrenar la lógica matemática y construir hábitos, un día a la vez. Aplicación web adaptable a móviles y escritorio, sin cuentas ni dependencias de producción.

## Qué puedes hacer

- Resolver retos **aleatorios** de suma, resta, multiplicación, división exacta y potencias pequeñas. Cada reto tiene una solución con dos fichas.
- Elegir entre tres niveles, pedir pistas, activar sonido y practicar durante un minuto contrarreloj.
- Crear y editar metas con horario, icono, color, fechas de inicio y fin y repetición diaria, por días de la semana o para una sola fecha.
- Marcar metas como pendientes, cumplidas o no cumplidas desde un calendario mensual con los días reales de cada mes.
- Revisar rachas, XP, estadísticas y un calendario anual de doce meses.
- Exportar e importar un respaldo personal en formato JSON.

## Ejecutar en tu equipo

Necesitas **Node.js 22 o posterior** y npm. Desde la carpeta principal del repositorio:

```bash
npm start
```

Abre **http://127.0.0.1:4173**. No necesitas ejecutar `npm install`: el proyecto usa las herramientas incluidas en Node.js. Sirve la aplicación por HTTP; abrir `index.html` directamente como archivo no permite cargar los módulos de JavaScript.

## Comprobar el proyecto

```bash
npm run check
```

Comprueba la sintaxis y ejecuta seis pruebas que cubren 15.000 retos aleatorios, calendarios, repetición de metas, rachas y validación de respaldos. El flujo de [GitHub Actions](.github/workflows/check.yml) ejecuta este mismo comando en los pushes a `main` y en las solicitudes de cambios.

Para las comprobaciones opcionales en un navegador local:

```bash
npm run test:browser
```

Se necesita Google Chrome, Chromium o Microsoft Edge instalado. El script busca ubicaciones habituales en Windows, macOS y Linux; puedes indicar otra ruta con la variable `CHROME_PATH`. Abre un perfil de prueba independiente y guarda las capturas y resultados en `louuugic/artifacts/`, una carpeta excluida de Git.

## Subir a GitHub

El repositorio se publica desde **esta carpeta principal**, donde está este README. La aplicación vive en `louuugic/` y se incluye completa como archivos normales.

1. Crea un repositorio vacío en GitHub. Deja sin seleccionar la creación automática de README, licencia y `.gitignore`, porque el proyecto ya tiene su primer commit.
2. Copia la URL del repositorio y reemplaza `TU_USUARIO` y `TU_REPOSITORIO` en estos comandos:

   ```bash
   git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
   git push -u origin main
   ```

Necesitas autenticar Git con tu cuenta de GitHub. Los archivos temporales, respaldos de herramientas, paquetes de publicación y configuración local están excluidos por [`.gitignore`](.gitignore).

Referencia: [guía oficial para subir un proyecto local a GitHub](https://docs.github.com/en/migrations/importing-source-code/using-the-command-line-to-import-source-code/adding-locally-hosted-code-to-github).

## Publicar en Netlify

Conecta el repositorio de GitHub a Netlify y utiliza la carpeta principal como directorio base. El archivo [`netlify.toml`](netlify.toml) ya indica la configuración:

| Ajuste | Valor |
| --- | --- |
| Directorio base | Raíz del repositorio; dejar vacío |
| Comando de compilación | Dejar vacío |
| Directorio de publicación | `louuugic/dist` |

También puedes arrastrar la carpeta `louuugic/dist` a Netlify Drop para una publicación manual. `dist` contiene directamente el código editable y los archivos que usa el navegador; debe permanecer en Git.

Referencia: [configuración de publicación de Netlify](https://docs.netlify.com/build/configure-builds/file-based-configuration/).

## Estructura

```text
.
├── .github/workflows/check.yml  # Comprobaciones automáticas
├── README.md                   # Inicio e instrucciones de publicación
├── netlify.toml                # Configuración para el repositorio completo
├── package.json                # Comandos desde la carpeta principal
└── louuugic/
    ├── dist/                   # HTML, CSS, JavaScript y recursos de la aplicación
    ├── scripts/                # Servidor local y comprobaciones de navegador
    ├── tests/                  # Pruebas de lógica y respaldos
    └── README.md               # Documentación de la aplicación
```

## Datos de cada visitante

Las metas y estadísticas se guardan en el almacenamiento local de **cada navegador**. Publicar el código en GitHub no publica esos datos personales. No hay cuentas, servidor ni sincronización entre dispositivos. Borrar los datos del sitio elimina el progreso local; puedes exportar un respaldo desde **Ajustes y respaldo** e importarlo en otro navegador.

El diseño utiliza fuentes de Google con alternativas del sistema. No hay analítica ni servicios externos para almacenar las metas.
