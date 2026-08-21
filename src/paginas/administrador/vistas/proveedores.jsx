// =============================================================================
// VISTA: GESTIÓN DE PROVEEDORES
// -----------------------------------------------------------------------------
// Esta pantalla permite al administrador:
// 1. Mantener un directorio de empresas proveedoras y marcas asociadas.
// 2. Registrar datos de contacto (persona de contacto, correo y teléfono).
// 3. Consultar cuántos productos suministra cada proveedor en el inventario.
// 4. Crear, editar y eliminar proveedores fácilmente.
// =============================================================================

import { useState } from "react";

const PROVEEDORES_KEY = "senabella_suppliers";

// Proveedores precargados en el sistema
const proveedoresIniciales = [
  {
    id: 1,
    nombre: "TechSupply Inc.",
    contacto: "Juan Pérez",
    email: "juan@techsupply.com",
    telefono: "+57 300 111 2222",
    productos: 0,
  },
  {
    id: 2,
    nombre: "Global Electronics",
    contacto: "María López",
    email: "maria@globalelectronics.com",
    telefono: "+57 310 333 4444",
    productos: 0,
  },
  {
    id: 3,
    nombre: "Digital Accessories",
    contacto: "Carlos Ruiz",
    email: "carlos@digitalacc.com",
    telefono: "+57 320 555 6666",
    productos: 0,
  },
];

/**
 * Lee los proveedores de localStorage o inicializa con los predeterminados.
 * Además, detecta automáticamente marcas de productos y las registra como proveedores si faltan.
 */
const leerProveedores = () => {
  let proveedoresGuardados = proveedoresIniciales;
  let productos = [];
  try {
    proveedoresGuardados =
      JSON.parse(localStorage.getItem(PROVEEDORES_KEY) || "null") ||
      proveedoresIniciales;
    productos = JSON.parse(
      localStorage.getItem("senabella_admin_products") || "[]",
    );
  } catch {
    return proveedoresIniciales;
  }
  const productosActualizados = productos.map((producto) => ({
    ...producto,
    proveedor:
      producto.proveedor && producto.proveedor !== "Sin proveedor"
        ? producto.proveedor
        : producto.marca || "Proveedor Senabella",
  }));
  localStorage.setItem(
    "senabella_admin_products",
    JSON.stringify(productosActualizados),
  );
  const nombres = new Set(
    proveedoresGuardados.map((proveedor) => proveedor.nombre),
  );
  const proveedoresDeProductos = productosActualizados
    .map((producto) => producto.proveedor)
    .filter(
      (proveedor) =>
        proveedor && proveedor !== "Sin proveedor" && !nombres.has(proveedor),
    );
  const nuevos = Array.from(new Set(proveedoresDeProductos)).map(
    (nombre, indice) => ({
      id:
        Math.max(
          ...proveedoresGuardados.map((proveedor) => Number(proveedor.id) || 0),
          0,
        ) +
        indice +
        1,
      nombre,
      contacto: "Contacto pendiente",
      email: "-",
      telefono: "-",
      productos: 0,
    }),
  );
  const todos = [...proveedoresGuardados, ...nuevos];
  localStorage.setItem(PROVEEDORES_KEY, JSON.stringify(todos));
  return todos;
};

function Proveedores() {
  const [proveedores, setProveedores] = useState(leerProveedores);
  const [aviso, setAviso] = useState("");

  const [modalAbierto, setModalAbierto] = useState(false);
  const [proveedorEditando, setProveedorEditando] = useState(null);
  const contarProductos = (nombreProveedor) => {
    try {
      const productos = JSON.parse(
        localStorage.getItem("senabella_admin_products") || "[]",
      );
      return productos.filter(
        (producto) => producto.proveedor === nombreProveedor,
      ).length;
    } catch {
      return 0;
    }
  };

  const abrirModal = (proveedor = null) => {
    setProveedorEditando(
      proveedor || {
        id: null,
        nombre: "",
        contacto: "",
        email: "",
        telefono: "",
        productos: 0,
      },
    );
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setProveedorEditando(null);
  };

  const guardarProveedor = (e) => {
    e.preventDefault();
    let proveedoresActualizados;
    if (proveedorEditando.id) {
      proveedoresActualizados = proveedores.map((p) =>
        p.id === proveedorEditando.id ? proveedorEditando : p,
      );
    } else {
      const nuevoProveedor = {
        ...proveedorEditando,
        id: Math.max(...proveedores.map((p) => p.id), 0) + 1,
      };
      proveedoresActualizados = [...proveedores, nuevoProveedor];
    }
    setProveedores(proveedoresActualizados);
    localStorage.setItem(
      PROVEEDORES_KEY,
      JSON.stringify(proveedoresActualizados),
    );
    setAviso(
      proveedorEditando.id
        ? "Proveedor actualizado correctamente."
        : "Proveedor creado correctamente.",
    );
    cerrarModal();
  };

  const eliminarProveedor = (id) => {
    if (confirm("¿Estás seguro de eliminar este proveedor?")) {
      const proveedoresActualizados = proveedores.filter((p) => p.id !== id);
      setProveedores(proveedoresActualizados);
      localStorage.setItem(
        PROVEEDORES_KEY,
        JSON.stringify(proveedoresActualizados),
      );
      setAviso("Proveedor eliminado correctamente.");
    }
  };

  return (
    <div className='vista-proveedores'>
      {aviso && (
        <div className='admin-aviso-exito' role='status'>
          <i className='fa-solid fa-circle-check'></i>
          <span>{aviso}</span>
          <button onClick={() => setAviso("")} aria-label='Cerrar aviso'>
            <i className='fa-solid fa-xmark'></i>
          </button>
        </div>
      )}
      <div className='admin-cabecera-vista'>
        <h2 className='admin-seccion-titulo'>Gestión de proveedores</h2>
        <button
          className='admin-boton admin-boton-primario'
          onClick={() => abrirModal()}
        >
          <i className='fa-solid fa-plus'></i> Agregar proveedor
        </button>
      </div>

      <div className='admin-tabla-contenedor'>
        <table className='admin-tabla'>
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
                <td>{contarProductos(proveedor.nombre)}</td>
                <td>
                  <div className='admin-acciones-tabla'>
                    <button
                      className='admin-boton-icono'
                      title='Editar proveedor'
                      onClick={() => abrirModal(proveedor)}
                    >
                      <i className='fa-solid fa-pen'></i>
                    </button>
                    <button
                      className='admin-boton-icono admin-boton-icono-danger'
                      title='Eliminar proveedor'
                      onClick={() => eliminarProveedor(proveedor.id)}
                    >
                      <i className='fa-solid fa-trash'></i>
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
        <div className='admin-modal-overlay' onClick={cerrarModal}>
          <div className='admin-modal' onClick={(e) => e.stopPropagation()}>
            <div className='admin-modal-cabecera'>
              <h3>
                {proveedorEditando?.id
                  ? "Editar proveedor"
                  : "Agregar proveedor"}
              </h3>
              <button
                className='admin-modal-cerrar'
                onClick={cerrarModal}
                title='Cerrar'
              >
                <i className='fa-solid fa-xmark'></i>
              </button>
            </div>
            <form onSubmit={guardarProveedor} className='admin-modal-cuerpo'>
              <div className='admin-form-grupo'>
                <label>Nombre del proveedor</label>
                <input
                  type='text'
                  value={proveedorEditando?.nombre || ""}
                  onChange={(e) =>
                    setProveedorEditando({
                      ...proveedorEditando,
                      nombre: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className='admin-form-grupo'>
                <label>Persona de contacto</label>
                <input
                  type='text'
                  value={proveedorEditando?.contacto || ""}
                  onChange={(e) =>
                    setProveedorEditando({
                      ...proveedorEditando,
                      contacto: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className='admin-form-grupo'>
                <label>Email</label>
                <input
                  type='email'
                  value={proveedorEditando?.email || ""}
                  onChange={(e) =>
                    setProveedorEditando({
                      ...proveedorEditando,
                      email: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className='admin-form-grupo'>
                <label>Teléfono</label>
                <input
                  type='text'
                  value={proveedorEditando?.telefono || ""}
                  onChange={(e) =>
                    setProveedorEditando({
                      ...proveedorEditando,
                      telefono: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className='admin-modal-pie'>
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
                  <i
                    className={`fa-solid ${proveedorEditando?.id ? "fa-pen-to-square" : "fa-plus"}`}
                  ></i>
                  {proveedorEditando?.id
                    ? "Actualizar proveedor"
                    : "Crear proveedor"}
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
