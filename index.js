const loginContainer = document.getElementById('loginContainer');
const blocNotas = document.getElementById('blocNotas');
const btnLogin = document.getElementById('btnLogin');
const loginError = document.getElementById('loginError');
const btnCerrarSesion = document.getElementById('btnCerrarSesion');
const perfilUsuario = document.getElementById('perfilUsuario');
const formulario = document.getElementById('formulario');
const listado = document.getElementById('listado');
const buscador = document.getElementById('buscadorNombre');
const imagenPerfil = document.getElementById('imagenPerfil');
const inputImagenPerfil = document.getElementById('inputImagenPerfil');
const letraPerfil = document.getElementById('letraPerfil');

const btnAnotar = document.getElementById('btnAnotar');
const notaTexto = document.getElementById('notaTexto');
const listaNotas = document.getElementById('listaNotas');

const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

let correoUsuario = '';
let datosOriginales = null;

function mostrarLogin() {
  loginContainer.style.display = 'block';
  blocNotas.style.display = 'none';
  perfilUsuario.style.display = 'none';
  btnCerrarSesion.style.display = 'none';
}
function mostrarBloc() {
  loginContainer.style.display = 'none';
  blocNotas.style.display = 'flex';
  perfilUsuario.style.display = 'flex';
  btnCerrarSesion.style.display = 'inline-block';
  cargarImagenPerfil();
  cargarDatosGuardados();
  cargarNotasRapidas();
}

btnLogin.addEventListener('click', () => {
  const emailVal = document.getElementById('email').value.trim().toLowerCase();
  const passVal = document.getElementById('password').value;

  if (!emailVal) {
    loginError.textContent = 'Por favor ingresa un correo válido.';
    return;
  }
  if (passVal !== 'Claro1') {
    loginError.textContent = 'Contraseña incorrecta.';
    return;
  }

  correoUsuario = emailVal;
  loginError.textContent = '';
  document.getElementById('email').value = '';
  document.getElementById('password').value = '';

  mostrarBloc();
});

btnCerrarSesion.addEventListener('click', () => {
  correoUsuario = '';
  listado.innerHTML = '<h2>📌 Listado</h2>';
  listaNotas.innerHTML = '';
  imagenPerfil.style.display = 'none';
  letraPerfil.style.display = 'none';
  perfilUsuario.style.display = 'none';
  mostrarLogin();
});

// ======================= ENTRADAS =========================
formulario.addEventListener('submit', function(e) {
  e.preventDefault();
  const nombre = document.getElementById('nombre').value.trim();
  const fecha = document.getElementById('fecha').value;
  const precio1 = document.getElementById('precio1').value;
  const precio2 = document.getElementById('precio2').value;

  if (!nombre || !fecha) return;

  const mesNombre = meses[new Date(fecha).getMonth()];
  if (!datosOriginales) datosOriginales = {};
  if (!datosOriginales[mesNombre]) datosOriginales[mesNombre] = [];

  datosOriginales[mesNombre].push({ nombre, fecha, precio1, precio2 });
  localStorage.setItem('blocNotas_' + correoUsuario, JSON.stringify(datosOriginales));

  cargarDatosGuardados();
  if (buscador.value.trim() !== "") aplicarFiltroNombre();

  formulario.reset();
});

function crearEntrada(data, mes, orden) {
  const entrada = document.createElement('div');
  entrada.className = 'entrada';
  entrada.innerHTML = `
    <strong>${orden}. ${data.nombre}</strong><br/>
    Fecha: ${data.fecha}<br/>
    Plan Anterior: $${data.precio1}<br/>
    Plan Nuevo: $${data.precio2}
    <button class="eliminar">&times;</button>
  `;

  entrada.querySelector('.eliminar').addEventListener('click', () => {
    entrada.remove();
    const mesDiv = document.getElementById('mes-' + mes);
    if (mesDiv && mesDiv.querySelectorAll('.entrada').length === 0) mesDiv.remove();
    guardarDatosGuardados();
    cargarDatosGuardados();
    aplicarFiltroNombre();
  });

  return entrada;
}

function guardarDatosGuardados() {
  const data = {};
  document.querySelectorAll('[id^="mes-"]').forEach(mesDiv => {
    const mes = mesDiv.id.replace('mes-', '');
    data[mes] = [];
    mesDiv.querySelectorAll('.entrada').forEach(entrada => {
      const lines = entrada.innerText.split('\n');
      const nombre = lines[0].split('. ')[1];
      const fecha = lines[1].replace('Fecha: ', '');
      const precio1 = lines[2].replace('Plan Anterior: $', '');
      const precio2 = lines[3].replace('Plan Nuevo: $', '');
      data[mes].push({ nombre, fecha, precio1, precio2 });
    });
  });
  localStorage.setItem('blocNotas_' + correoUsuario, JSON.stringify(data));
}

function cargarDatosGuardados() {
  listado.innerHTML = '<h2>📌 Listado</h2>';
  const guardado = localStorage.getItem('blocNotas_' + correoUsuario);
  if (guardado) {
    const datos = JSON.parse(guardado);
    datosOriginales = datos;
    Object.keys(datos).forEach(mes => {
      const mesDiv = document.createElement('div');
      mesDiv.id = 'mes-' + mes;
      mesDiv.innerHTML = `<div class="mes">${mes}</div>`;
      datos[mes].forEach((entradaData, index) => {
        const entrada = crearEntrada(entradaData, mes, index + 1);
        mesDiv.appendChild(entrada);
      });
      listado.appendChild(mesDiv);
    });
  } else {
    datosOriginales = null;
  }
}

// ======================= BUSCADOR =========================
function aplicarFiltroNombre() {
  const filtro = buscador.value.trim().toLowerCase();
  if (!datosOriginales) return cargarDatosGuardados();

  listado.innerHTML = '<h2>📌 Listado</h2>';
  let hayCoincidencias = false;

  Object.keys(datosOriginales).forEach(mes => {
    const entradasFiltradas = datosOriginales[mes].filter(e => e.nombre.toLowerCase().includes(filtro));
    if (entradasFiltradas.length > 0) {
      hayCoincidencias = true;
      const mesDiv = document.createElement('div');
      mesDiv.id = 'mes-' + mes;
      mesDiv.innerHTML = `<div class="mes">${mes}</div>`;
      entradasFiltradas.forEach((entradaData, index) => {
        const entrada = crearEntrada(entradaData, mes, index + 1);
        mesDiv.appendChild(entrada);
      });
      listado.appendChild(mesDiv);
    }
  });

  if (!hayCoincidencias) {
    listado.innerHTML += '<div style="color:#999;text-align:center;font-weight:bold;margin-top:30px;">Sin resultados</div>';
  }
}
buscador.addEventListener('input', aplicarFiltroNombre);

// ======================= NOTAS RÁPIDAS =========================
function cargarNotasRapidas() {
  const notasGuardadas = JSON.parse(localStorage.getItem('notasRapidas_' + correoUsuario)) || [];
  listaNotas.innerHTML = '';
  notasGuardadas.forEach(nota => {
    const div = document.createElement('div');
    div.className = 'notaItem';
    div.textContent = nota;
    listaNotas.appendChild(div);
  });
}

btnAnotar.addEventListener('click', () => {
  const texto = notaTexto.value.trim();
  if (texto) {
    const notasGuardadas = JSON.parse(localStorage.getItem('notasRapidas_' + correoUsuario)) || [];
    notasGuardadas.push(texto);
    localStorage.setItem('notasRapidas_' + correoUsuario, JSON.stringify(notasGuardadas));
    notaTexto.value = '';
    cargarNotasRapidas();
  }
});

// ======================= Imagen de Perfil =========================
perfilUsuario.addEventListener('click', () => inputImagenPerfil.click());

inputImagenPerfil.addEventListener('change', () => {
  const file = inputImagenPerfil.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = e => {
      const imgData = e.target.result;
      mostrarImagenPerfil(imgData);
      localStorage.setItem('imagenPerfil_' + correoUsuario, imgData);
    };
    reader.readAsDataURL(file);
  }
});

function cargarImagenPerfil() {
  const key = 'imagenPerfil_' + correoUsuario.trim().toLowerCase();
  const imgGuardada = localStorage.getItem(key);
  if (imgGuardada) {
    mostrarImagenPerfil(imgGuardada);
  } else {
    imagenPerfil.style.display = 'none';
    letraPerfil.style.display = 'flex';
    letraPerfil.textContent = correoUsuario.charAt(0).toUpperCase();
    perfilUsuario.classList.add('no-image');
  }
}

function mostrarImagenPerfil(src) {
  imagenPerfil.src = src;
  imagenPerfil.style.display = 'block';
  letraPerfil.style.display = 'none';
  letraPerfil.textContent = '';
  perfilUsuario.classList.remove('no-image');
}

// ======================= Contraseña - Mostrar/Ocultar =========================
const togglePasswordBtn = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');

togglePasswordBtn.addEventListener('click', () => {
  const isPassword = passwordInput.getAttribute('type') === 'password';
  passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
  togglePasswordBtn.setAttribute('aria-label', isPassword ? 'Ocultar contraseña' : 'Mostrar contraseña');
  togglePasswordBtn.innerHTML = isPassword ? `
    <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M17.94 17.94A10.05 10.05 0 0 1 12 20c-7 0-11-8-11-8a19.33 19.33 0 0 1 5-5"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  ` : `
    <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  `;
});

// ======================= Modo Oscuro =========================
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  themeToggle.classList.toggle('dark');
  localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
});
window.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    themeToggle.classList.add('dark');
  }
  mostrarLogin();
});
