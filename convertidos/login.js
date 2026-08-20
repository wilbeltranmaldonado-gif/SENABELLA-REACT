document.addEventListener('DOMContentLoaded', () => {
  // --- Elementos del Formulario de Login ---
  const formulario      = document.getElementById('formularioLogin');
  const correoInput     = document.getElementById('correoLogin');
  const contrasenaInput = document.getElementById('contrasenaLogin');
  const mensajeError    = document.getElementById('mensajeError');
  const mensajeExito    = document.getElementById('mensajeExito');

  // --- Elementos de Modo Oscuro ---
  const btnModoOscuro = document.getElementById('btnModoOscuro') || document.querySelector('.boton-modo-oscuro');

  // ==========================================
  // 1. LÓGICA DE MODO OSCURO
  // ==========================================
  const actualizarBotonModoOscuro = (isDark) => {
    if (!btnModoOscuro) return;
    const icono = btnModoOscuro.querySelector('i');
    const texto = btnModoOscuro.querySelector('span');
    if (isDark) {
      if (icono) icono.className = 'fa-solid fa-sun';
      if (texto) texto.textContent = 'Modo Claro';
    } else {
      if (icono) icono.className = 'fa-solid fa-moon';
      if (texto) texto.textContent = 'Modo Oscuro';
    }
  };

  if (localStorage.getItem('modo-oscuro') === 'activo') {
    document.body.classList.add('modo-oscuro');
    actualizarBotonModoOscuro(true);
  }

  if (btnModoOscuro) {
    btnModoOscuro.addEventListener('click', () => {
      document.body.classList.toggle('modo-oscuro');
      const esOscuro = document.body.classList.contains('modo-oscuro');
      localStorage.setItem('modo-oscuro', esOscuro ? 'activo' : 'inactivo');
      actualizarBotonModoOscuro(esOscuro);
    });
  }

  // ==========================================
  // 2. MOSTRAR / OCULTAR CONTRASEÑA
  // ==========================================
  document.querySelectorAll('.btn-toggle-pass').forEach((boton) => {
    boton.addEventListener('click', () => {
      const input = document.getElementById(boton.getAttribute('data-target'));
      const icono = boton.querySelector('i');
      if (!input) return;
      if (input.type === 'password') {
        input.type = 'text';
        if (icono) icono.className = 'fa-solid fa-eye-slash';
      } else {
        input.type = 'password';
        if (icono) icono.className = 'fa-solid fa-eye';
      }
    });
  });

  // ==========================================
  // 3. PROCESO DE INICIO DE SESIÓN
  // ==========================================
  if (formulario) {
    formulario.addEventListener('submit', (evento) => {
      evento.preventDefault();
      ocultarMensajes();

      const correo     = correoInput ? correoInput.value.trim() : '';
      const contrasena = contrasenaInput ? contrasenaInput.value : '';

      // Validar campos vacíos
      if (!correo) {
        mostrarError('Por favor, ingresa tu correo electrónico.');
        correoInput?.focus();
        return;
      }
      if (!correoInput.checkValidity()) {
        mostrarError('Por favor, ingresa un correo electrónico válido.');
        correoInput?.focus();
        return;
      }
      if (!contrasena) {
        mostrarError('Por favor, ingresa tu contraseña.');
        contrasenaInput?.focus();
        return;
      }

      // ── Validación real contra la base de usuarios ──────────────────
      if (!window.SenabellaUsuarios) {
        mostrarError('Error interno. Recarga la página e intenta de nuevo.');
        return;
      }

      const resultado = window.SenabellaUsuarios.validarLogin(correo, contrasena);

      if (!resultado.ok) {
        mostrarError(resultado.mensaje);
        contrasenaInput?.focus();
        return;
      }

      // ── Login exitoso ────────────────────────────────────────────────
      const usuario = resultado.usuario;
      const nombre  = usuario.nombre || correo.split('@')[0];
      const rol     = usuario.rol || 'cliente';

      localStorage.setItem('senabella_sesion', 'activa');
      localStorage.setItem('senabella_rol', rol);
      localStorage.setItem('senabella_usuario', JSON.stringify({
        id:     usuario.id,
        nombre: nombre,
        correo: usuario.correo,
        rol:    rol,
      }));

      iniciarSesionExitoso(nombre, rol);
    });
  }

  function iniciarSesionExitoso(nombre, rol) {
    if (rol === 'administrador') {
      mostrarExito(`¡Bienvenido, ${nombre}! Redirigiendo al panel de administración...`);
      setTimeout(() => { window.location.href = 'administrador.html'; }, 1200);
    } else {
      mostrarExito(`¡Bienvenido de nuevo, ${nombre}! Redirigiendo a tu perfil...`);
      setTimeout(() => { window.location.href = 'usuario.html'; }, 1200);
    }
  }

  // ==========================================
  // FUNCIONES DE ALERTA DE MENSAJES
  // ==========================================
  function mostrarError(texto) {
    if (!mensajeError) return;
    mensajeError.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> <span>${texto}</span>`;
    mensajeError.style.display = 'flex';
  }

  function mostrarExito(texto) {
    if (!mensajeExito) return;
    mensajeExito.innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>${texto}</span>`;
    mensajeExito.style.display = 'flex';
  }

  function ocultarMensajes() {
    if (mensajeError) mensajeError.style.display = 'none';
    if (mensajeExito) mensajeExito.style.display = 'none';
  }
});
