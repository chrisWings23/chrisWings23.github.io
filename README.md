# 📝 Bloc de Notas Personal

Este es un proyecto web desarrollado en HTML, CSS y JavaScript puro, que simula un bloc de notas personal con autenticación simple, modo oscuro/claro y almacenamiento local por usuario. Incluye funcionalidades para registrar planes, ver un historial y anotar comentarios personales o notas adicionales.

## 🚀 Características

- ✅ **Inicio de sesión con validación por contraseña**
- 🌗 **Modo claro/oscuro** con botón de alternancia y persistencia entre sesiones
- 📌 **Formulario principal** para ingresar:
  - Nombre
  - Fecha
  - Plan anterior
  - Plan nuevo
- 📋 **Listado organizado por mes** con función de búsqueda por nombre
- 🗒️ **Notas adicionales independientes** con su propio cuadro y botón para añadir
- 🧠 **Datos almacenados en `localStorage` por usuario**
- 🖼️ **Soporte para foto de perfil o inicial automática**
- 🔒 Contraseña por defecto: `Claro1`

## 🧪 Cómo usar

1. **Abre el archivo `index.html`** en tu navegador.
2. **Ingresa cualquier correo** (sirve para identificar al usuario) y la contraseña `Claro1`.
3. Una vez dentro:
   - Puedes llenar el formulario para registrar un nuevo cambio de plan.
   - Buscar por nombre en el listado.
   - Agregar notas personales en el campo de texto y presionar “Anotar”.
   - Ver lo anotado en el panel de la derecha.
4. **Todo se guarda automáticamente en `localStorage`**, por lo que los datos se mantienen si recargas la página.

## 📁 Estructura del Proyecto


## 🧩 Personalización

- **Contraseña de acceso:** Puedes cambiarla en el archivo HTML, dentro del bloque:
  ```javascript
  if (passVal !== 'Claro1') {
    loginError.textContent = 'Contraseña incorrecta.';
    return;
  }
