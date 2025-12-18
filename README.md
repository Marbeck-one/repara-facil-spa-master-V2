
# 🔧 ReparaFácil SPA - Frontend

![React](https://img.shields.io/badge/React-18.x-blue?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.x-purple?style=for-the-badge&logo=bootstrap)
![Status](https://img.shields.io/badge/Estado-Finalizado-success?style=for-the-badge)

> **Asignatura:** DESARROLLO FULLSTACK II_001D

## 📖 Descripción del Proyecto

**ReparaFácil SPA** es una aplicación web moderna diseñada para la gestión integral de servicios de reparación. La plataforma conecta a clientes con técnicos especializados, permitiendo administrar agendas, garantías y seguimiento de servicios mediante un sistema de roles diferenciados.

Este repositorio contiene el **Frontend** de la aplicación, construido con React y Vite, implementando una arquitectura modular, gestión de estado global y seguridad mediante JWT.

---

## 🚀 Características Principales

* **🔐 Autenticación y Seguridad:** Login y Registro con validación JWT. Protección de rutas basada en roles (`ADMIN`, `TECNICO`, `CLIENTE`).
* **👥 Gestión de Usuarios:** CRUD completo de clientes y asignación de técnicos.
* **🛠️ Servicios y Garantías:** Solicitud de reparaciones, seguimiento de estados y gestión de garantías.
* **📅 Agenda:** Calendario interactivo para técnicos y administradores.
* **💬 Chat Integrado:** Sistema de mensajería para comunicación entre cliente y soporte/técnico.
* **🧪 Testing:** Pruebas unitarias implementadas con Vitest y React Testing Library.

---

## 🛠️ Tecnologías Utilizadas

* **Core:** React 18, React DOM.
* **Build Tool:** Vite.
* **Estilos:** Bootstrap 5, React-Bootstrap, CSS Modules.
* **Enrutamiento:** React Router DOM v6.
* **Http Client:** Axios (con interceptores para Token JWT).
* **Testing:** Vitest, JSDOM.

---

## ⚙️ Pre-requisitos

Antes de iniciar, asegúrate de tener instalado:

1.  **Node.js** (v18 o superior recomendado).
2.  **NPM** (gestor de paquetes).
3.  El **Backend (API Spring Boot)** debe estar ejecutándose en el puerto `8082` (por defecto) para que la aplicación funcione correctamente.

---

## 💻 Instalación y Despliegue Local

Sigue estos pasos para levantar el proyecto en tu máquina:

### 1. Clonar el repositorio
```bash
git clone [https://github.com/tu-usuario/repara-facil-spa.git](https://github.com/tu-usuario/repara-facil-spa.git)
cd repara-facil-spa

```

### 2. Instalar dependencias

```bash
npm install

```

### 3. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto (basado en el archivo `.env` de ejemplo si existe) y define la URL de tu API Backend:

```env
VITE_API_URL=http://localhost:8082/api

```

### 4. Ejecutar en modo desarrollo

Para iniciar el servidor local con Vite:

```bash
npm run dev

```

La aplicación estará disponible en: `http://localhost:5173`

---

## 🧪 Ejecución de Pruebas (Testing)

El proyecto cuenta con una suite de pruebas unitarias para validar componentes críticos como el Login y el registro.
Para ejecutar los tests:

```bash
npm test

```

Esto ejecutará `vitest run` y mostrará el reporte de cobertura en la consola.

---

## 📦 Construcción para Producción

Para generar los archivos estáticos optimizados para subir a un servidor (Netlify, Vercel, AWS, etc.):

```bash
npm run build

```

Esto creará una carpeta `dist/` con todo el código minificado y listo para desplegar.

Para previsualizar la build localmente:

```bash
npm run preview

```

---

## 📂 Estructura del Proyecto

```plaintext
src/
├── api/            # Configuración de Axios y servicios (endpoints)
├── components/     # Componentes reutilizables (Navbar, Cards, Modales)
├── context/        # Context API (AuthContext, AppContext, CartContext)
├── pages/          # Vistas principales (Home, Login, Dashboards)
├── routes/         # Configuración de rutas protegidas (PrivateRoute, RoleRoute)
├── tests/          # Pruebas unitarias (Login.spec.jsx, etc.)
└── main.jsx        # Punto de entrada de la aplicación

```

---

## 📊 Visualización del Diagrama de Base de Datos

El repositorio incluye el modelo entidad-relación en el archivo **`MER-Reparafacil.md`**. Para visualizarlo gráficamente, sigue estos pasos:

1. **Instalar Extensión:** Asegúrate de tener instalada la extensión **Markdown Preview Mermaid Support** en VS Code.
2. **Abrir Archivo:** Abre `MER-Reparafacil.md` en el editor.
3. **Ejecutar Vista Previa:**
* Presiona `Ctrl + Shift + V` (Windows/Linux) o `Cmd + Shift + V` (Mac).
* O haz clic en el ícono de **Vista Previa** (lupa con hoja) en la esquina superior derecha.



---

## 👤 Autores

Proyecto desarrollado por el equipo de **ReparaFácil** para la asignatura de Desarrollo Fullstack II.

En especial:

* **MARBECK-ONE (BECKER)**
* **THRAGG969 (MASSIMO)**

```



```
