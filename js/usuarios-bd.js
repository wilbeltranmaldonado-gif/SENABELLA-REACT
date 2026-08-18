/* =========================================================================
   SENABELLA · usuarios-bd.js
   Módulo compartido de gestión de usuarios — almacenamiento en localStorage.
   Incluido en: administrador.html, login.html, registro.html
   ========================================================================= */

(function (global) {
  "use strict";

  const CLAVE_BD = "senabella_usuarios";
  const CORREO_ADMIN = "admin@senabella.com";

  /* ------------------------------------------------------------------
     Helpers internos
  ------------------------------------------------------------------ */
  function _codificar(texto) {
    // Codificación mínima: Base64 (no es seguridad real, evita texto plano visible)
    try { return btoa(unescape(encodeURIComponent(texto))); } catch (e) { return btoa(texto); }
  }

  function _decodificar(codigo) {
    try { return decodeURIComponent(escape(atob(codigo))); } catch (e) { return atob(codigo); }
  }

  function _hoy() {
    return new Date().toLocaleDateString("es-CO", {
      day: "2-digit", month: "short", year: "numeric",
    });
  }

  /* ------------------------------------------------------------------
     CRUD de localStorage
  ------------------------------------------------------------------ */
  function obtenerUsuarios() {
    try {
      return JSON.parse(localStorage.getItem(CLAVE_BD) || "[]");
    } catch (e) {
      return [];
    }
  }

  function guardarUsuarios(lista) {
    localStorage.setItem(CLAVE_BD, JSON.stringify(lista));
  }

  function buscarPorCorreo(correo) {
    const lista = obtenerUsuarios();
    return lista.find((u) => u.correo.toLowerCase() === correo.toLowerCase()) || null;
  }

  /**
   * Crea un nuevo usuario.
   * @returns {{ ok: boolean, mensaje: string, usuario?: object }}
   */
  function crearUsuario({ nombre, correo, password, rol = "cliente" }) {
    if (!nombre || !correo || !password) {
      return { ok: false, mensaje: "Todos los campos son obligatorios." };
    }
    const lista = obtenerUsuarios();
    const existe = lista.find((u) => u.correo.toLowerCase() === correo.toLowerCase());
    if (existe) {
      return { ok: false, mensaje: "Ya existe un usuario con ese correo." };
    }
    const nuevo = {
      id: Date.now(),
      nombre: nombre.trim(),
      correo: correo.trim().toLowerCase(),
      password: _codificar(password),
      rol,                         // "cliente" | "administrador"
      estado: "activo",            // "activo" | "bloqueado"
      fechaRegistro: _hoy(),
    };
    lista.push(nuevo);
    guardarUsuarios(lista);
    return { ok: true, mensaje: "Usuario creado correctamente.", usuario: nuevo };
  }

  /**
   * Actualiza campos de un usuario por id.
   * @returns {{ ok: boolean, mensaje: string }}
   */
  function actualizarUsuario(id, cambios) {
    const lista = obtenerUsuarios();
    const idx = lista.findIndex((u) => u.id === id);
    if (idx === -1) return { ok: false, mensaje: "Usuario no encontrado." };

    // Si se envía nueva contraseña, codificarla
    if (cambios.password) cambios.password = _codificar(cambios.password);

    lista[idx] = { ...lista[idx], ...cambios };
    guardarUsuarios(lista);
    return { ok: true, mensaje: "Usuario actualizado." };
  }

  /**
   * Cambia el estado de un usuario.
   */
  function alternarEstado(id) {
    const lista = obtenerUsuarios();
    const u = lista.find((u) => u.id === id);
    if (!u) return { ok: false, mensaje: "Usuario no encontrado." };
    // El admin principal no puede bloquearse
    if (u.correo === CORREO_ADMIN) {
      return { ok: false, mensaje: "No se puede bloquear al administrador principal." };
    }
    u.estado = u.estado === "activo" ? "bloqueado" : "activo";
    guardarUsuarios(lista);
    return { ok: true, mensaje: `Usuario ${u.estado}.`, estado: u.estado };
  }

  /**
   * Elimina un usuario por id.
   */
  function eliminarUsuario(id) {
    const lista = obtenerUsuarios();
    const u = lista.find((u) => u.id === id);
    if (!u) return { ok: false, mensaje: "Usuario no encontrado." };
    if (u.correo === CORREO_ADMIN) {
      return { ok: false, mensaje: "No se puede eliminar al administrador principal." };
    }
    const nueva = lista.filter((u) => u.id !== id);
    guardarUsuarios(nueva);
    return { ok: true, mensaje: "Usuario eliminado." };
  }

  /**
   * Valida credenciales de login.
   * @returns {{ ok: boolean, mensaje: string, usuario?: object }}
   */
  function validarLogin(correo, password) {
    const u = buscarPorCorreo(correo);
    if (!u) {
      return { ok: false, mensaje: "No existe ninguna cuenta con ese correo." };
    }
    if (u.estado === "bloqueado") {
      return { ok: false, mensaje: "Tu acceso ha sido bloqueado. Contacta al administrador." };
    }
    if (_decodificar(u.password) !== password) {
      return { ok: false, mensaje: "Contraseña incorrecta." };
    }
    return { ok: true, mensaje: "Acceso autorizado.", usuario: u };
  }

  /* ------------------------------------------------------------------
     Inicialización — crea o actualiza el admin por defecto
  ------------------------------------------------------------------ */
  const ADMIN_PASSWORD = "Admin";   // ← Cambia la contraseña aquí

  function _inicializar() {
    const lista = obtenerUsuarios();
    const adminIdx = lista.findIndex((u) => u.correo === CORREO_ADMIN);

    if (adminIdx === -1) {
      // El admin no existe — crearlo
      lista.unshift({
        id: 1,
        nombre: "Administrador",
        correo: CORREO_ADMIN,
        password: _codificar(ADMIN_PASSWORD),
        rol: "administrador",
        estado: "activo",
        fechaRegistro: _hoy(),
      });
    } else {
      // El admin ya existe — sincronizar la contraseña con el código fuente
      lista[adminIdx].password = _codificar(ADMIN_PASSWORD);
      lista[adminIdx].estado = "activo";  // asegurar que no esté bloqueado
    }

    guardarUsuarios(lista);
  }

  _inicializar();

  /* ------------------------------------------------------------------
     API pública
  ------------------------------------------------------------------ */
  global.SenabellaUsuarios = {
    obtener: obtenerUsuarios,
    buscarPorCorreo,
    crear: crearUsuario,
    actualizar: actualizarUsuario,
    alternarEstado,
    eliminar: eliminarUsuario,
    validarLogin,
  };

})(window);
