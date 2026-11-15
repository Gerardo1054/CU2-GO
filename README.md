# CU2 GO

## Sistema de gestión de incidencias del campus CU2 – BUAP

### Descripción

CU2 GO es una aplicación web que permite a los alumnos registrar incidencias dentro del campus CU2 y a los administradores consultar, gestionar y dar seguimiento a los reportes.

### Tecnologías utilizadas

- React y Vite: frontend.
- Node.js y Express: backend.
- MySQL 8.4: base de datos.
- Docker y Docker Compose: ejecución de los servicios.
- JWT y cookies HttpOnly: autenticación.
- Multer: carga de evidencias.

### Funcionalidades

**Alumno**
- Registro e inicio de sesión.
- Creación de incidencias.
- Selección de edificio y salón.
- Adjuntar fotografías y videos.
- Consultar sus incidencias.

**Administrador**
- Inicio y cierre de sesión.
- Consultar todas las incidencias.
- Visualizar evidencias.
- Cambiar el estado de una incidencia.
- Agregar observaciones.
- Consultar el historial de seguimiento.

### Requisitos

- Docker Desktop.
- Node.js y npm.
- Navegador web.

### Instalación y ejecución

**1. Configurar las variables de entorno**

Crear los archivos `.env` utilizando los ejemplos proporcionados:

En la carpeta principal:

```bash
cp .env.example .env
```

Dentro de la carpeta principal, crear el archivo del backend:

```bash
cp backend/.env.example backend/.env
```

Editar ambos archivos y establecer las contraseñas y claves necesarias. La contraseña del usuario MySQL debe coincidir en las configuraciones correspondientes.

**2. Iniciar los servicios**

Abrir una terminal en la carpeta principal `CU2-GO` y ejecutar:

```bash
docker compose up -d --build
```

Este comando inicia MySQL y el backend.

**3. Comprobar los contenedores**

```bash
docker compose ps
```

**4. Iniciar el frontend**

Abrir otra terminal y entrar a la carpeta del frontend:

```bash
cd frontend
npm install
npm run dev
```

**5. Abrir la aplicación**

http://localhost:5173/

### Direcciones de los servicios

- Frontend: http://localhost:5173/
- Backend: http://localhost:3000/
- Estado de la API: http://localhost:3000/api/status

### Base de datos

La configuración de MySQL se encuentra en `compose.yaml` y el archivo de inicialización está en `database/init.sql`.

Docker utiliza un volumen persistente para conservar los datos de la base de datos entre reinicios.

### Evidencias

Las fotografías y videos adjuntados a las incidencias se almacenan en:

`backend/uploads/evidencias/`

### Seguridad

Las contraseñas y claves secretas se configuran mediante archivos de entorno. Estos archivos no deben compartirse ni incluirse en repositorios públicos.

Los archivos `.env.example` contienen únicamente valores de referencia para configurar el proyecto.

### Detener los servicios

Para detener los contenedores sin eliminar los datos de MySQL:

```bash
docker compose down
```

### Autores

Claudio Gerardo De la Rosa Guzmán | 202441947

Ingrid Andreé González López | 202443886