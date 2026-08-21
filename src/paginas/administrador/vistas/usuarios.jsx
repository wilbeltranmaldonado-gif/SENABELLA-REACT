// =============================================================================
// VISTA: GESTIÓN DE USUARIOS Y ROLES DEL SISTEMA
// -----------------------------------------------------------------------------
// Esta pantalla permite al administrador:
// 1. Ver todas las cuentas registradas en la plataforma (Administradores y Clientes).
// 2. Asignar o revocar privilegios (cambiar entre rol 'administrador' y 'cliente').
// 3. Modificar estados de cuenta ('activo' o 'inactivo').
// 4. Crear nuevas cuentas de acceso o eliminar usuarios existentes.
// =============================================================================

import { useState, useEffect, useMemo } from "react";
import {
  obtenerUsuarios,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario as borrarUsuario,
} from "../../../utilidades/usuariosBd";

function Usuarios() {
  // --- ESTADOS DE LA VISTA DE USUARIOS ---
  const [usuarios, setUsuarios] = useState([]); // Lista completa de usuarios
  const [busqueda, setBusqueda] = useState(""); // Filtro de búsqueda por texto
  const [filtroRol, setFiltroRol] = useState("todos"); // Filtro por rol ('administrador', 'cliente' o 'todos')
  const [modalAbierto, setModalAbierto] = useState(false); // Modal de creación/edición de usuario
  const [usuarioEditando, setUsuarioEditando] = useState(null); // Datos del usuario en edición

  // Carga inicial de usuarios desde la base de datos simulada en localStorage
  const cargarUsuarios = () => {
    try {
      setUsuarios(obtenerUsuarios());
    } catch (e) {
      console.error("Error al cargar usuarios:", e);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  // Filtra usuarios reactivamente según el texto y el rol seleccionado
  const usuariosFiltrados = useMemo(() => {
    return usuarios.filter((usuario) => {
      const coincideRol = filtroRol === "todos" || usuario.rol === filtroRol;
      const q = busqueda.trim().toLowerCase();
      const coincideBusqueda =
        !q ||
        String(usuario.nombre || "")
          .toLowerCase()
          .includes(q) ||
        String(usuario.correo || usuario.email || "")
          .toLowerCase()
          .includes(q) ||
        String(usuario.id || "")
          .toLowerCase()
          .includes(q);
      return coincideRol && coincideBusqueda;
    });
  }, [usuarios, filtroRol, busqueda]);

  // Devuelve la clase de estilo CSS para resaltar el rol
  const obtenerClaseRol = (rol) => {
    const clases = {
      administrador: "rol-admin",
      cliente: "rol-usuario",
      usuario: "rol-usuario",
    };
    return clases[rol] || "";
  };

  const abrirModal = (usuario = null) => {
    setUsuarioEditando(
      usuario || {
        id: null,
        nombre: "",
        correo: "",
        password: "",
        rol: "cliente",
        estado: "activo",
        fechaRegistro: new Date().toISOString().split("T")[0],
      },
    );
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setUsuarioEditando(null);
  };

  const guardarUsuario = (e) => {
    e.preventDefault();
    if (usuarioEditando.id) {
      actualizarUsuario(usuarioEditando.id, {
        nombre: usuarioEditando.nombre,
        correo: usuarioEditando.correo,
        rol: usuarioEditando.rol,
        estado: usuarioEditando.estado,
      });
      if (window.SenabellaToast) {
        window.SenabellaToast(
          "Usuario actualizado correctamente",
          "fa-user-check",
          "exito",
        );
      }
    } else {
      crearUsuario(usuarioEditando);
      if (window.SenabellaToast) {
        window.SenabellaToast(
          "Nuevo usuario creado con éxito",
          "fa-user-plus",
          "exito",
        );
      }
    }
    window.dispatchEvent(new Event("storage"));
    cargarUsuarios();
    cerrarModal();
  };

  const eliminarUsuario = (id, nombre) => {
    if (
      confirm(
        `¿Estás seguro de eliminar al usuario ${nombre || ""}? Esta acción no se puede deshacer.`,
      )
    ) {
      borrarUsuario(id);
      window.dispatchEvent(new Event("storage"));
      cargarUsuarios();
      if (window.SenabellaToast) {
        window.SenabellaToast(
          "Usuario eliminado correctamente",
          "fa-trash-can",
          "exito",
        );
      }
    }
  };

  const cambiarRol = (id, nuevoRol) => {
    actualizarUsuario(id, { rol: nuevoRol });
    window.dispatchEvent(new Event("storage"));
    cargarUsuarios();
    if (window.SenabellaToast) {
      window.SenabellaToast(
        `Rol actualizado a ${nuevoRol}`,
        "fa-shield-halved",
        "info",
      );
    }
  };

  return (
    <div className='vista-usuarios'>
      {/* CABECERA */}
      <div className='admin-cabecera-vista'>
        <div>
          <h2 className='admin-seccion-titulo' style={{ margin: "0 0 4px 0" }}>
            Gestión de Usuarios
          </h2>
          <span style={{ fontSize: "12px", color: "#64748b" }}>
            Administración de cuentas, credenciales y permisos del sistema
          </span>
        </div>

        <div className='admin-filtros'>
          <select
            value={filtroRol}
            onChange={(e) => setFiltroRol(e.target.value)}
            className='admin-select'
            title='Filtrar por rol'
          >
            <option value='todos'>Todos los roles</option>
            <option value='cliente'>Solo Clientes</option>
            <option value='administrador'>Solo Administradores</option>
          </select>

          <input
            type='text'
            placeholder='Buscar por nombre o correo...'
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className='admin-input-busqueda'
          />

          <button
            className='admin-boton admin-boton-primario'
            onClick={() => abrirModal()}
          >
            <i className='fa-solid fa-user-plus'></i> Agregar usuario
          </button>
        </div>
      </div>

      {/* TABLA DE USUARIOS */}
      <div className='admin-tabla-contenedor'>
        <table className='admin-tabla'>
          <thead>
            <tr>
              <th style={{ width: "60px" }}>ID</th>
              <th>Nombre y Apellido</th>
              <th>Correo Electrónico</th>
              <th>Rol / Permisos</th>
              <th>Fecha Registro</th>
              <th style={{ width: "180px", textAlign: "center" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuariosFiltrados.map((usuario) => (
              <tr key={usuario.id}>
                <td>
                  <strong>#{usuario.id}</strong>
                </td>
                <td>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <div
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        background: "#e2e8f0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#475569",
                        fontWeight: 700,
                        fontSize: "12px",
                      }}
                    >
                      {String(usuario.nombre || "U")
                        .charAt(0)
                        .toUpperCase()}
                    </div>
                    <strong>{usuario.nombre}</strong>
                  </div>
                </td>
                <td>{usuario.correo || usuario.email}</td>
                <td>
                  <span
                    className={`admin-badge ${obtenerClaseRol(usuario.rol)}`}
                    style={{ textTransform: "capitalize" }}
                  >
                    {usuario.rol}
                  </span>
                </td>
                <td>{usuario.fechaRegistro || "-"}</td>
                <td>
                  <div
                    className='admin-acciones-tabla'
                    style={{ justifyContent: "center" }}
                  >
                    {/* BOTÓN EDITAR */}
                    <button
                      className='admin-boton-icono'
                      title='Editar datos del usuario'
                      onClick={() => abrirModal(usuario)}
                    >
                      <i className='fa-solid fa-pen-to-square'></i>
                    </button>

                    {/* SELECTOR ROL RÁPIDO */}
                    <select
                      value={usuario.rol}
                      onChange={(e) => cambiarRol(usuario.id, e.target.value)}
                      className='admin-select-estado'
                      title='Cambiar rol del usuario'
                    >
                      <option value='cliente'>Cliente</option>
                      <option value='administrador'>Administrador</option>
                    </select>

                    {/* BOTÓN ELIMINAR */}
                    <button
                      className='admin-boton-icono admin-boton-eliminar'
                      title='Eliminar cuenta de usuario'
                      onClick={() =>
                        eliminarUsuario(usuario.id, usuario.nombre)
                      }
                    >
                      <i className='fa-solid fa-trash-can'></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {usuariosFiltrados.length === 0 && (
        <div className='admin-vacio'>
          <i
            className='fa-solid fa-users'
            style={{ fontSize: "32px", color: "#94a3b8", marginBottom: "10px" }}
          ></i>
          <p>
            No se encontraron usuarios registrados con los filtros aplicados.
          </p>
        </div>
      )}

      {/* MODAL DE EDICIÓN / CREACIÓN DE USUARIO */}
      {modalAbierto && (
        <div className='admin-modal-overlay' onClick={cerrarModal}>
          <div className='admin-modal' onClick={(e) => e.stopPropagation()}>
            <div className='admin-modal-cabecera'>
              <h3>
                <i
                  className={`fa-solid ${usuarioEditando?.id ? "fa-user-pen" : "fa-user-plus"}`}
                  style={{ marginRight: "8px", color: "#84b814" }}
                ></i>
                {usuarioEditando?.id ? "Editar usuario" : "Agregar usuario"}
              </h3>
              <button
                className='admin-boton-icono'
                onClick={cerrarModal}
                title='Cerrar ventana'
              >
                <i className='fa-solid fa-xmark'></i>
              </button>
            </div>

            <form onSubmit={guardarUsuario} className='admin-modal-cuerpo'>
              <div className='admin-form-grupo'>
                <label>Nombre completo</label>
                <input
                  type='text'
                  value={usuarioEditando?.nombre || ""}
                  onChange={(e) =>
                    setUsuarioEditando({
                      ...usuarioEditando,
                      nombre: e.target.value,
                    })
                  }
                  placeholder='Ej: Laura Gómez'
                  required
                />
              </div>

              <div className='admin-form-grupo'>
                <label>Correo electrónico</label>
                <input
                  type='email'
                  value={usuarioEditando?.correo || ""}
                  onChange={(e) =>
                    setUsuarioEditando({
                      ...usuarioEditando,
                      correo: e.target.value,
                    })
                  }
                  placeholder='usuario@correo.com'
                  required
                />
              </div>

              {!usuarioEditando?.id && (
                <div className='admin-form-grupo'>
                  <label>Contraseña</label>
                  <input
                    type='password'
                    value={usuarioEditando?.password || ""}
                    onChange={(e) =>
                      setUsuarioEditando({
                        ...usuarioEditando,
                        password: e.target.value,
                      })
                    }
                    placeholder='Mínimo 6 caracteres'
                    required
                  />
                </div>
              )}

              <div className='admin-form-grupo'>
                <label>Rol asignado</label>
                <select
                  value={usuarioEditando?.rol || "cliente"}
                  onChange={(e) =>
                    setUsuarioEditando({
                      ...usuarioEditando,
                      rol: e.target.value,
                    })
                  }
                >
                  <option value='cliente'>Cliente (Acceso a tienda)</option>
                  <option value='administrador'>
                    Administrador (Acceso total al panel)
                  </option>
                </select>
              </div>

              <div
                className='admin-modal-pie'
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "10px",
                  marginTop: "16px",
                }}
              >
                <button
                  type='button'
                  className='admin-boton admin-boton-secundario'
                  onClick={cerrarModal}
                >
                  <i className='fa-solid fa-xmark'></i> Cancelar
                </button>
                <button
                  type='submit'
                  className='admin-boton admin-boton-primario'
                >
                  <i className='fa-solid fa-floppy-disk'></i>{" "}
                  {usuarioEditando?.id ? "Guardar Cambios" : "Crear Usuario"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Usuarios;
