document.addEventListener('DOMContentLoaded', () => {
  // --- Elementos del Formulario ---
  const formulario = document.getElementById('formularioRegistro');
  const nombreInput = document.getElementById('nombreCompleto');
  const correoInput = document.getElementById('correoElectronico');
  const celularInput = document.getElementById('celular');
  const contrasenaInput = document.getElementById('contrasena');
  const confirmarContrasenaInput = document.getElementById('confirmarContrasena');
  const aceptoTerminos = document.getElementById('aceptoTerminos');
  const mensajeError = document.getElementById('mensajeError');
  const mensajeExito = document.getElementById('mensajeExito');

  // --- Elementos de Medición de Contraseña ---
  const fortalezaProgreso = document.getElementById('fortalezaProgreso');
  const fortalezaTexto = document.getElementById('fortalezaTexto');
  const coincidenciaTexto = document.getElementById('coincidenciaTexto');

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

  // Verificar preferencia guardada
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
  const togglePassButtons = document.querySelectorAll('.btn-toggle-pass');
  togglePassButtons.forEach((boton) => {
    boton.addEventListener('click', () => {
      const targetId = boton.getAttribute('data-target');
      const input = document.getElementById(targetId);
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
  // 3. RESTRICCIÓN DE CARACTERES EN NOMBRE
  // ==========================================
  const patronSoloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;

  if (nombreInput) {
    nombreInput.addEventListener('input', () => {
      nombreInput.value = nombreInput.value.replace(/[0-9]/g, '');
    });
  }

  if (celularInput) {
    celularInput.addEventListener('input', () => {
      celularInput.value = celularInput.value.replace(/[^0-9\s]/g, '');
    });
    // Bloquear teclas no numéricas
    celularInput.addEventListener('keydown', (e) => {
      const permitidas = ["Backspace","Delete","Tab","Escape","Enter","ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Home","End"];
      if (permitidas.includes(e.key) || e.ctrlKey || e.metaKey) return;
      if (!/^[0-9\s]$/.test(e.key)) e.preventDefault();
    });
    // Bloquear pegado de letras
    celularInput.addEventListener('paste', (e) => {
      e.preventDefault();
      const texto = (e.clipboardData || window.clipboardData).getData('text');
      celularInput.value = texto.replace(/[^0-9\s]/g, '').slice(0, 12);
    });
  }

  // ==========================================
  // 4. MEDIDOR DE FORTALEZA DE CONTRASEÑA
  // ==========================================
  if (contrasenaInput && fortalezaProgreso && fortalezaTexto) {
    contrasenaInput.addEventListener('input', () => {
      const valor = contrasenaInput.value;
      const fortaleza = calcularFortaleza(valor);

      if (valor.length === 0) {
        fortalezaProgreso.style.width = '0%';
        fortalezaProgreso.style.backgroundColor = 'transparent';
        fortalezaTexto.textContent = 'Ingresa una contraseña';
        fortalezaTexto.style.color = 'var(--color-texto-secundario)';
      } else if (fortaleza < 2) {
        fortalezaProgreso.style.width = '33%';
        fortalezaProgreso.style.backgroundColor = 'var(--color-error)';
        fortalezaTexto.textContent = 'Contraseña Débil';
        fortalezaTexto.style.color = 'var(--color-error)';
      } else if (fortaleza < 4) {
        fortalezaProgreso.style.width = '66%';
        fortalezaProgreso.style.backgroundColor = 'var(--color-advertencia)';
        fortalezaTexto.textContent = 'Contraseña Media';
        fortalezaTexto.style.color = 'var(--color-advertencia)';
      } else {
        fortalezaProgreso.style.width = '100%';
        fortalezaProgreso.style.backgroundColor = 'var(--color-exito)';
        fortalezaTexto.textContent = 'Contraseña Fuerte';
        fortalezaTexto.style.color = 'var(--color-exito)';
      }

      verificarCoincidencia();
    });
  }

  function calcularFortaleza(pass) {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  }

  // ==========================================
  // 5. VALIDACIÓN DE COINCIDENCIA EN TIEMPO REAL
  // ==========================================
  if (confirmarContrasenaInput) {
    confirmarContrasenaInput.addEventListener('input', verificarCoincidencia);
  }

  function verificarCoincidencia() {
    if (!confirmarContrasenaInput || !coincidenciaTexto) return;
    const val1 = contrasenaInput ? contrasenaInput.value : '';
    const val2 = confirmarContrasenaInput.value;

    if (val2.length === 0) {
      coincidenciaTexto.innerHTML = '';
      coincidenciaTexto.className = 'coincidencia-texto';
      return;
    }

    if (val1 === val2) {
      coincidenciaTexto.innerHTML = '<i class="fa-solid fa-circle-check"></i> Las contraseñas coinciden';
      coincidenciaTexto.className = 'coincidencia-texto valido';
    } else {
      coincidenciaTexto.innerHTML = '<i class="fa-solid fa-circle-xmark"></i> Las contraseñas no coinciden';
      coincidenciaTexto.className = 'coincidencia-texto invalido';
    }
  }

  // ==========================================
  // 6. VALIDACIÓN Y ENVÍO DEL FORMULARIO
  // ==========================================
  if (formulario) {
    formulario.addEventListener('submit', (evento) => {
      evento.preventDefault();
      ocultarMensajes();

      const nombreTexto = nombreInput ? nombreInput.value.trim() : '';

      // Validar Nombre
      if (nombreTexto === '') {
        mostrarError('Por favor, ingresa tu nombre completo.');
        if (nombreInput) nombreInput.focus();
        return;
      }

      if (!patronSoloLetras.test(nombreTexto)) {
        mostrarError('El nombre solo puede contener letras y espacios.');
        if (nombreInput) nombreInput.focus();
        return;
      }

      // Validar Correo
      if (!correoInput || !correoInput.checkValidity() || correoInput.value.trim() === '') {
        mostrarError('Por favor, ingresa un correo electrónico válido.');
        if (correoInput) correoInput.focus();
        return;
      }

      // Verificar que el correo no esté ya registrado
      if (window.SenabellaUsuarios) {
        const yaExiste = window.SenabellaUsuarios.buscarPorCorreo(correoInput.value.trim());
        if (yaExiste) {
          mostrarError('Ya existe una cuenta con ese correo electrónico.');
          if (correoInput) correoInput.focus();
          return;
        }
      }

      // Validar Celular
      const celularTexto = celularInput ? celularInput.value.trim() : '';
      if (celularTexto === '') {
        mostrarError('Por favor, ingresa tu número de celular.');
        if (celularInput) celularInput.focus();
        return;
      }

      // Validar Contraseña
      if (!contrasenaInput || contrasenaInput.value.length < 8) {
        mostrarError('La contraseña debe tener al menos 8 caracteres.');
        if (contrasenaInput) contrasenaInput.focus();
        return;
      }

      // Validar Coincidencia de Contraseñas
      if (contrasenaInput.value !== confirmarContrasenaInput.value) {
        mostrarError('Las contraseñas no coinciden.');
        if (confirmarContrasenaInput) confirmarContrasenaInput.focus();
        return;
      }

      // Guardar en la base de datos central de usuarios
      const correoFinal  = correoInput ? correoInput.value.trim() : '';
      const passwordFinal = contrasenaInput ? contrasenaInput.value : '';

      if (window.SenabellaUsuarios) {
        window.SenabellaUsuarios.crear({
          nombre:   nombreTexto,
          correo:   correoFinal,
          password: passwordFinal,
          rol:      'cliente',
        });
      }

      // Si todo es válido
      mostrarExito('¡Cuenta creada con éxito! Redirigiendo al inicio de sesión...');
      formulario.reset();
      
      // Reiniciar medidores dinámicos
      if (fortalezaProgreso) {
        fortalezaProgreso.style.width = '0%';
        fortalezaProgreso.style.backgroundColor = 'transparent';
      }
      if (fortalezaTexto) {
        fortalezaTexto.textContent = 'Ingresa una contraseña';
        fortalezaTexto.style.color = 'var(--color-texto-secundario)';
      }
      if (coincidenciaTexto) {
        coincidenciaTexto.innerHTML = '';
      }

      // Redirigir a Login (login.html) tras 1.2 segundos para que inicie sesión manualmente
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 1200);
    });
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




