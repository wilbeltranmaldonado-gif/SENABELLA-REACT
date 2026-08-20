import { useState } from "react";

const PRODUCTOS_ADMIN_KEY = "senabella_admin_products";
const productosPredeterminados = [
  { id: 1, nombre: "Auriculares Bluetooth", categoria: "Audio", precio: "$89.99", stock: 45, estado: "activo", imagen: "" },
  { id: 2, nombre: "Smartwatch Pro", categoria: "Relojes", precio: "$199.99", stock: 23, estado: "activo", imagen: "" },
  { id: 3, nombre: "Cargador USB-C", categoria: "Cargadores", precio: "$29.99", stock: 120, estado: "activo", imagen: "" },
  { id: 4, nombre: "Batería Portátil", categoria: "Accesorios", precio: "$49.99", stock: 8, estado: "bajo", imagen: "" },
  { id: 5, nombre: "Teclado Mecánico", categoria: "Computación", precio: "$79.99", stock: 0, estado: "agotado", imagen: "" },
];

const leerProductos = () => {
  try {
    const guardados = JSON.parse(localStorage.getItem(PRODUCTOS_ADMIN_KEY) || "null");
    return Array.isArray(guardados) ? guardados : productosPredeterminados;
  } catch {
    return productosPredeterminados;
  }
};

function Productos() {
  const [productos, setProductos] = useState(leerProductos);

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
      estado: "activo",
      imagen: ""
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
      const productosActualizados = productos.map(p =>
        p.id === productoEditando.id ? productoEditando : p
      );
      setProductos(productosActualizados);
      localStorage.setItem(PRODUCTOS_ADMIN_KEY, JSON.stringify(productosActualizados));
    } else {
      // Agregar nuevo producto
      const nuevoProducto = {
        ...productoEditando,
        id: productos.length > 0 ? Math.max(...productos.map(p => p.id)) + 1 : 1
      };
      const productosActualizados = [...productos, nuevoProducto];
      setProductos(productosActualizados);
      localStorage.setItem(PRODUCTOS_ADMIN_KEY, JSON.stringify(productosActualizados));
    }
    cerrarModal();
  };

  const eliminarProducto = (id) => {
    if (confirm("¿Estás seguro de eliminar este producto?")) {
      const productosActualizados = productos.filter(p => p.id !== id);
      setProductos(productosActualizados);
      localStorage.setItem(PRODUCTOS_ADMIN_KEY, JSON.stringify(productosActualizados));
    }
  };

  const cargarImagen = (e) => {
    const archivo = e.target.files?.[0];
    if (!archivo) return;
    const lector = new FileReader();
    lector.onload = () => setProductoEditando((producto) => ({ ...producto, imagen: lector.result }));
    lector.readAsDataURL(archivo);
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
                  onChange={(e) => setProductoEditando({
                    ...productoEditando,
                    stock: Number(e.target.value) || 0
                  })}
                  required
                />
              </div>
              <div className="admin-form-grupo">
                <label htmlFor="imagen-producto">Imagen del producto</label>
                <input id="imagen-producto" type="file" accept="image/*" onChange={cargarImagen} />
                {productoEditando?.imagen && (
                  <img
                    src={productoEditando.imagen}
                    alt="Vista previa del producto"
                    style={{ width: "90px", height: "90px", objectFit: "cover", marginTop: "8px" }}
                  />
                )}
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