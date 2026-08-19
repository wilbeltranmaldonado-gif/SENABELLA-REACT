import { useState } from "react";

function Productos() {
  const [productos, setProductos] = useState([
    { id: 1, nombre: "Auriculares Bluetooth", categoria: "Audio", precio: "$89.99", stock: 45, estado: "activo" },
    { id: 2, nombre: "Smartwatch Pro", categoria: "Relojes", precio: "$199.99", stock: 23, estado: "activo" },
    { id: 3, nombre: "Cargador USB-C", categoria: "Cargadores", precio: "$29.99", stock: 120, estado: "activo" },
    { id: 4, nombre: "Batería Portátil", categoria: "Accesorios", precio: "$49.99", stock: 8, estado: "bajo" },
    { id: 5, nombre: "Teclado Mecánico", categoria: "Computación", precio: "$79.99", stock: 0, estado: "agotado" },
  ]);

  const [modalAbierto, setModalAbierto] = useState(false);
  const [productoEditando, setProductoEditando] = useState(null);
  const [busqueda, setBusqueda] = useState("");

  const obtenerClaseEstado = (estado) => {
    const clases = {
      activo: "estado-exito",
      bajo: "estado-advertencia",
      agotado: "estado-error"
    };
    return clases[estado] || "";
  };

  const productosFiltrados = productos.filter(producto =>
    producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    producto.categoria.toLowerCase().includes(busqueda.toLowerCase())
  );

  const abrirModal = (producto = null) => {
    setProductoEditando(producto || {
      id: null,
      nombre: "",
      categoria: "",
      precio: "",
      stock: 0,
      estado: "activo"
    });
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setProductoEditando(null);
  };

  const guardarProducto = (e) => {
    e.preventDefault();
    if (productoEditando.id) {
      // Editar producto existente
      setProductos(productos.map(p =>
        p.id === productoEditando.id ? productoEditando : p
      ));
    } else {
      // Agregar nuevo producto
      const nuevoProducto = {
        ...productoEditando,
        id: Math.max(...productos.map(p => p.id)) + 1
      };
      setProductos([...productos, nuevoProducto]);
    }
    cerrarModal();
  };

  const eliminarProducto = (id) => {
    if (confirm("¿Estás seguro de eliminar este producto?")) {
      setProductos(productos.filter(p => p.id !== id));
    }
  };

  return (
    <div className="vista-productos">
      <div className="admin-cabecera-vista">
        <h2 className="admin-seccion-titulo">Gestión de productos</h2>
        <div className="admin-filtros">
          <input
            type="text"
            placeholder="Buscar productos..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="admin-input-busqueda"
          />
          <button 
            className="admin-boton admin-boton-primario"
            onClick={() => abrirModal()}
          >
            <i className="fa-solid fa-plus"></i> Agregar producto
          </button>
        </div>
      </div>

      <div className="admin-tabla-contenedor">
        <table className="admin-tabla">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productosFiltrados.map((producto) => (
              <tr key={producto.id}>
                <td>{producto.id}</td>
                <td>{producto.nombre}</td>
                <td>{producto.categoria}</td>
                <td>{producto.precio}</td>
                <td>{producto.stock}</td>
                <td>
                  <span className={`admin-badge ${obtenerClaseEstado(producto.estado)}`}>
                    {producto.estado}
                  </span>
                </td>
                <td>
                  <div className="admin-acciones-tabla">
                    <button 
                      className="admin-boton-icono" 
                      title="Editar"
                      onClick={() => abrirModal(producto)}
                    >
                      <i className="fa-solid fa-pen"></i>
                    </button>
                    <button 
                      className="admin-boton-icono admin-boton-icono-danger" 
                      title="Eliminar"
                      onClick={() => eliminarProducto(producto.id)}
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {productosFiltrados.length === 0 && (
        <div className="admin-vacio">
          <i className="fa-solid fa-box-open"></i>
          <p>No se encontraron productos</p>
        </div>
      )}

      {/* MODAL DE PRODUCTO */}
      {modalAbierto && (
        <div className="admin-modal-overlay" onClick={cerrarModal}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-cabecera">
              <h3>{productoEditando?.id ? "Editar producto" : "Agregar producto"}</h3>
              <button onClick={cerrarModal}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <form onSubmit={guardarProducto} className="admin-modal-cuerpo">
              <div className="admin-form-grupo">
                <label>Nombre del producto</label>
                <input
                  type="text"
                  value={productoEditando?.nombre || ""}
                  onChange={(e) => setProductoEditando({...productoEditando, nombre: e.target.value})}
                  required
                />
              </div>
              <div className="admin-form-grupo">
                <label>Categoría</label>
                <input
                  type="text"
                  value={productoEditando?.categoria || ""}
                  onChange={(e) => setProductoEditando({...productoEditando, categoria: e.target.value})}
                  required
                />
              </div>
              <div className="admin-form-grupo">
                <label>Precio</label>
                <input
                  type="text"
                  value={productoEditando?.precio || ""}
                  onChange={(e) => setProductoEditando({...productoEditando, precio: e.target.value})}
                  required
                />
              </div>
              <div className="admin-form-grupo">
                <label>Stock</label>
                <input
                  type="number"
                  value={productoEditando?.stock || 0}
                  onChange={(e) => setProductoEditando({...productoEditando, stock: parseInt(e.target.value)})}
                  required
                />
              </div>
              <div className="admin-form-grupo">
                <label>Estado</label>
                <select
                  value={productoEditando?.estado || "activo"}
                  onChange={(e) => setProductoEditando({...productoEditando, estado: e.target.value})}
                >
                  <option value="activo">Activo</option>
                  <option value="bajo">Stock bajo</option>
                  <option value="agotado">Agotado</option>
                </select>
              </div>
              <div className="admin-modal-pie">
                <button type="button" onClick={cerrarModal}>Cancelar</button>
                <button type="submit" className="admin-boton-primario">
                  {productoEditando?.id ? "Actualizar" : "Agregar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Productos;