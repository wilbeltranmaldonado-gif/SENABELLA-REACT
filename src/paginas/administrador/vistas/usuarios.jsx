import { useState, useEffect } from "react";

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState(null);

  useEffect(() => {
    // Cargar usuarios del localStorage (simulando la base de datos)
    const cargarUsuarios = () => {
      try {
        const datos = localStorage.getItem("senabella_usuarios_db");
        if (datos) {
          const usuariosDB = JSON.parse(datos);
          setUsuarios(usuariosDB);
        } else {
          // Datos de ejemplo si no hay nada en localStorage
          setUsuarios([
            { id: 1, nombre: "Admin Senabella", email: "admin@senabella.com", rol: "administrador", fechaRegistro: "2024-01-01" },
            { id: 2, nombre: "María García", email: "maria@email.com", rol: "usuario", fechaRegistro: "2024-02-15" },
            { id: 3, nombre: "Juan Rodríguez", email: "juan@email.com", rol: "usuario", fechaRegistro: "2024-03-20" },
          ]);
        }
      } catch (e) {
        console.error("Error al cargar usuarios:", e);
      }
    };

    cargarUsuarios();
  }, []);

  const obtenerClaseRol = (rol) => {
    const clases = {
      administrador: "rol-admin",
      usuario: "rol-usuario"
    };
    return clases[rol] || "";
  };

  const abrirModal = (usuario = null) => {
    setUsuarioEditando(usuario || {
      id: null,
      nombre: "",
      email: "",
      rol: "usuario",
      fechaRegistro: new Date().toISOString().split('T')[0]
    });
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setUsuarioEditando(null);
  };

  const guardarUsuario = (e) => {
    e.preventDefault();
    if (usuarioEditando.id) {
      setUsuarios(usuarios.map(u =>
        u.id === usuarioEditando.id ? usuarioEditando : u
      ));
    } else {
      const nuevoUsuario = {
        ...usuarioEditando,
        id: Math.max(...usuarios.map(u => u.id), 0) + 1
      };
      setUsuarios([...usuarios, nuevoUsuario]);
    }
    
    // Guardar en localStorage
    localStorage.setItem("senabella_usuarios_db", JSON.stringify(
      usuarioEditando.id 
        ? usuarios.map(u => u.id === usuarioEditando.id ? usuarioEditando : u)
        : [...usuarios, { ...usuarioEditando, id: Math.max(...usuarios.map(u => u.id), 0) + 1 }]
    ));
    
    cerrarModal();
  };

  const eliminarUsuario = (id) => {
    if (confirm("¿Estás seguro de eliminar este usuario?")) {
      const nuevosUsuarios = usuarios.filter(u => u.id !== id);
      setUsuarios(nuevosUsuarios);
      localStorage.setItem("senabella_usuarios_db", JSON.stringify(nuevosUsuarios));
    }
  };

  const cambiarRol = (id, nuevoRol) => {
    const nuevosUsuarios = usuarios.map(u =>
      u.id === id ? { ...u, rol: nuevoRol } : u
    );
    setUsuarios(nuevosUsuarios);
    localStorage.setItem("senabella_usuarios_db", JSON.stringify(nuevosUsuarios));
  };

  return (
    <div className="vista-usuarios">
      <div className="admin-cabecera-vista">
        <h2 className="admin-seccion-titulo">Gestión de usuarios</h2>
        <button 
          className="admin-boton admin-boton-primario"
          onClick={() => abrirModal()}
        >
          <i className="fa-solid fa-plus"></i> Agregar usuario
        </button>
      </div>

      <div className="admin-tabla-contenedor">
        <table className="admin-tabla">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Fecha registro</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => (
              <tr key={usuario.id}>
                <td>{usuario.id}</td>
                <td>{usuario.nombre}</td>
                <td>{usuario.email}</td>
                <td>
                  <span className={`admin-badge ${obtenerClaseRol(usuario.rol)}`}>
                    {usuario.rol}
                  </span>
                </td>
                <td>{usuario.fechaRegistro}</td>
                <td>
                  <div className="admin-acciones-tabla">
                    <button onClick={() => abrirModal(usuario)}>
                      <i className="fa-solid fa-pen"></i>
                    </button>
                    <select 
                      value={usuario.rol}
                      onChange={(e) => cambiarRol(usuario.id, e.target.value)}
                      className="admin-select-estado"
                    >
                      <option value="usuario">Usuario</option>
                      <option value="administrador">Administrador</option>
                    </select>
                    <button onClick={() => eliminarUsuario(usuario.id)}>
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {usuarios.length === 0 && (
        <div className="admin-vacio">
          <i className="fa-solid fa-users"></i>
          <p>No hay usuarios registrados</p>
        </div>
      )}

      {/* MODAL DE USUARIO */}
      {modalAbierto && (
        <div className="admin-modal-overlay" onClick={cerrarModal}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-cabecera">
              <h3>{usuarioEditando?.id ? "Editar usuario" : "Agregar usuario"}</h3>
              <button onClick={cerrarModal}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <form onSubmit={guardarUsuario} className="admin-modal-cuerpo">
              <div className="admin-form-grupo">
                <label>Nombre completo</label>
                <input
                  type="text"
                  value={usuarioEditando?.nombre || ""}
                  onChange={(e) => setUsuarioEditando({...usuarioEditando, nombre: e.target.value})}
                  required
                />
              </div>
              <div className="admin-form-grupo">
                <label>Email</label>
                <input
                  type="email"
                  value={usuarioEditando?.email || ""}
                  onChange={(e) => setUsuarioEditando({...usuarioEditando, email: e.target.value})}
                  required
                />
              </div>
              <div className="admin-form-grupo">
                <label>Rol</label>
                <select
                  value={usuarioEditando?.rol || "usuario"}
                  onChange={(e) => setUsuarioEditando({...usuarioEditando, rol: e.target.value})}
                >
                  <option value="usuario">Usuario</option>
                  <option value="administrador">Administrador</option>
                </select>
              </div>
              <div className="admin-modal-pie">
                <button type="button" onClick={cerrarModal}>Cancelar</button>
                <button type="submit" className="admin-boton-primario">
                  {usuarioEditando?.id ? "Actualizar" : "Agregar"}
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