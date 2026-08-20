const CLAVE_BD = "senabella_usuarios";
const CORREO_ADMIN = "admin@senabella.com";

/* ------------------------------------------------------------------
   Helpers internos
------------------------------------------------------------------ */
function _codificar(texto) {
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
export function obtenerUsuarios() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_BD) || "[]");
  } catch (e) {
    return [];
  }
}

export function guardarUsuarios(lista) {
  localStorage.setItem(CLAVE_BD, JSON.stringify(lista));
}

export function buscarPorCorreo(correo) {
  const lista = obtenerUsuarios();
  return lista.find((u) => u.correo.toLowerCase() === correo.toLowerCase()) || null;
}

export function crearUsuario({ nombre, correo, password, celular = "", direccion = "", ciudad = "", rol = "cliente" }) {
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
    celular,
    direccion,
    ciudad,
    rol,
    estado: "activo",
    fechaRegistro: _hoy(),
  };
  lista.push(nuevo);
  guardarUsuarios(lista);
  return { ok: true, mensaje: "Usuario creado correctamente.", usuario: nuevo };
}

export function actualizarUsuario(id, cambios) {
  const lista = obtenerUsuarios();
  const idx = lista.findIndex((u) => u.id === id);
  if (idx === -1) return { ok: false, mensaje: "Usuario no encontrado." };

  if (cambios.password) cambios.password = _codificar(cambios.password);

  lista[idx] = { ...lista[idx], ...cambios };
  guardarUsuarios(lista);
  return { ok: true, mensaje: "Usuario actualizado." };
}

export function alternarEstado(id) {
  const lista = obtenerUsuarios();
  const u = lista.find((u) => u.id === id);
  if (!u) return { ok: false, mensaje: "Usuario no encontrado." };
  if (u.correo === CORREO_ADMIN) {
    return { ok: false, mensaje: "No se puede bloquear al administrador principal." };
  }
  u.estado = u.estado === "activo" ? "bloqueado" : "activo";
  guardarUsuarios(lista);
  return { ok: true, mensaje: `Usuario ${u.estado}.`, estado: u.estado };
}

export function eliminarUsuario(id) {
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

export function validarLogin(correo, password) {
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
const ADMIN_PASSWORD = "Admin";

function _inicializar() {
  const lista = obtenerUsuarios();
  const adminIdx = lista.findIndex((u) => u.correo === CORREO_ADMIN);

  if (adminIdx === -1) {
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
    lista[adminIdx].password = _codificar(ADMIN_PASSWORD);
    lista[adminIdx].estado = "activo";
  }

  guardarUsuarios(lista);
}

// Ejecutar inicialización al importar este módulo
_inicializar();
