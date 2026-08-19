import { useState } from "react";

function Proveedores() {
  const [proveedores, setProveedores] = useState([
    { id: 1, nombre: "TechSupply Inc.", contacto: "Juan Pérez", email: "juan@techsupply.com", telefono: "+57 300 111 2222", productos: 45 },
    { id: 2, nombre: "Global Electronics", contacto: "María López", email: "maria@globalelectronics.com", telefono: "+57 310 333 4444", productos: 32 },
    { id: 3, nombre: "Digital Accessories", contacto: "Carlos Ruiz", email: "carlos@digitalacc.com", telefono: "+57 320 555 6666", productos: 28 },
  ]);

  const [modalAbierto, setModalAbierto] = useState(false);
  const [proveedorEditando, setProveedorEditando] = useState(null);

  const abrirModal = (proveedor = null) => {
    setProveedorEditando(proveedor || {
      id: null,
      nombre: "",
      contacto: "",
      email: "",
      telefono: "",
      productos: 0
    });
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setProveedorEditando(null);
  };

  const guardarProveedor = (e) => {
    e.preventDefault();
    if (proveedorEditando.id) {
      setProveedores(proveedores.map(p =>
        p.id === proveedorEditando.id ? proveedorEditando : p
      ));
    } else {
      const nuevoProveedor = {
        ...proveedorEditando,
        id: Math.max(...proveedores.map(p => p.id)) + 1
      };
      setProveedores([...proveedores, nuevoProveedor]);
    }
    cerrarModal();
  };

  const eliminarProveedor = (id) => {
    if (confirm("¿Estás seguro de eliminar este proveedor?")) {
      setProveedores(proveedores.filter(p => p.id !== id));
    }
  };

  return (
    <div className="vista-proveedores">
      <div className="admin-cabecera-vista">
        <h2 className="admin-seccion-titulo">Gestión de proveedores</h2>
        <button 
          className="admin-boton admin-boton-primario"
          onClick={() => abrirModal()}
        >
          <i className="fa-solid fa-plus"></i> Agregar proveedor
        </button>
      </div>

      <div className="admin-tabla-contenedor">
        <table className="admin-tabla">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Contacto</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Productos</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {proveedores.map((proveedor) => (
              <tr key={proveedor.id}>
                <td>{proveedor.id}</td>
                <td>{proveedor.nombre}</td>
                <td>{proveedor.contacto}</td>
                <td>{proveedor.email}</td>
                <td>{proveedor.telefono}</td>
                <td>{proveedor.productos}</td>
                <td>
                  <div className="admin-acciones-tabla">
                    <button onClick={() => abrirModal(proveedor)}>
                      <i className="fa-solid fa-pen"></i>
                    </button>
                    <button onClick={() => eliminarProveedor(proveedor.id)}>
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL DE PROVEEDOR */}
      {modalAbierto && (
        <div className="admin-modal-overlay" onClick={cerrarModal}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-cabecera">
              <h3>{proveedorEditando?.id ? "Editar proveedor" : "Agregar proveedor"}</h3>
              <button onClick={cerrarModal}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <form onSubmit={guardarProveedor} className="admin-modal-cuerpo">
              <div className="admin-form-grupo">
                <label>Nombre del proveedor</label>
                <input
                  type="text"
                  value={proveedorEditando?.nombre || ""}
                  onChange={(e) => setProveedorEditando({...proveedorEditando, nombre: e.target.value})}
                  required
                />
              </div>
              <div className="admin-form-grupo">
                <label>Persona de contacto</label>
                <input
                  type="text"
                  value={proveedorEditando?.contacto || ""}
                  onChange={(e) => setProveedorEditando({...proveedorEditando, contacto: e.target.value})}
                  required
                />
              </div>
              <div className="admin-form-grupo">
                <label>Email</label>
                <input
                  type="email"
                  value={proveedorEditando?.email || ""}
                  onChange={(e) => setProveedorEditando({...proveedorEditando, email: e.target.value})}
                  required
                />
              </div>
              <div className="admin-form-grupo">
                <label>Teléfono</label>
                <input
                  type="text"
                  value={proveedorEditando?.telefono || ""}
                  onChange={(e) => setProveedorEditando({...proveedorEditando, telefono: e.target.value})}
                  required
                />
              </div>
              <div className="admin-modal-pie">
                <button type="button" onClick={cerrarModal}>Cancelar</button>
                <button type="submit" className="admin-boton-primario">
                  {proveedorEditando?.id ? "Actualizar" : "Agregar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Proveedores;