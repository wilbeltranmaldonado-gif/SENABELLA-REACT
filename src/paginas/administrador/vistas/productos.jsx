import { useState } from "react";
import { productosIniciales, productosRopaAccesorios } from "../../../datos";

const PRODUCTOS_ADMIN_KEY = "senabella_admin_products";
const CATEGORIAS_KEY = "senabella_categories";
const productosPredeterminados = [
  { id: 1, nombre: "Auriculares Bluetooth", marca: "JBL", categoria: "Audio", precio: "$ 89.900", precioNumero: 89900, stock: 45, estado: "activo", imagen: "https://media.falabella.com/falabellaCO/155500313_01/w=1200,h=1200,fit=pad" },
  { id: 2, nombre: "Smartwatch Pro", marca: "XIAOMI", categoria: "Relojes", precio: "$ 199.900", precioNumero: 199900, stock: 23, estado: "activo", imagen: "https://media.falabella.com/falabellaCO/139001771_01/w=480,h=480,fit=pad" },
  { id: 3, nombre: "Cargador USB-C", marca: "BELKIN", categoria: "Cargadores", precio: "$ 29.900", precioNumero: 29900, stock: 120, estado: "activo", imagen: "https://media.falabella.com/falabellaCO/140922701_01/w=1200,h=1200,fit=pad" },
  { id: 4, nombre: "Batería Portátil", marca: "ANKER", categoria: "Accesorios", precio: "$ 49.900", precioNumero: 49900, stock: 8, estado: "bajo", imagen: "https://media.falabella.com/falabellaCO/124164429_01/w=1200,h=1200,fit=pad" },
  { id: 5, nombre: "Teclado Mecánico", marca: "LOGITECH", categoria: "Computación", precio: "$ 79.900", precioNumero: 79900, stock: 0, estado: "agotado", imagen: "https://media.falabella.com/falabellaCO/124164429_01/w=1200,h=1200,fit=pad" },
];

const datosProductosActualizados = productosPredeterminados.reduce((datos, producto) => {
  datos[producto.nombre] = producto;
  return datos;
}, {});

const productosDelCatalogo = [...productosIniciales, ...productosRopaAccesorios].map((producto) => ({
  id: `catalogo-${producto.id}`,
  nombre: producto.nombre,
  categoria: producto.categoria || producto.etiqueta || "General",
  precio: producto.precio,
  stock: 10,
  estado: "activo",
  imagen: producto.imagen,
  marca: producto.marca || "SENABELLA",
  referencia: producto.referencia || "Catálogo Senabella",
  proveedor: "Sin proveedor",
  origenCatalogo: true
}));

const leerProductos = () => {
  try {
    const guardados = JSON.parse(localStorage.getItem(PRODUCTOS_ADMIN_KEY) || "null");
    const productosGuardados = Array.isArray(guardados) ? guardados : productosPredeterminados;
    const nombresGuardados = new Set(productosGuardados.map((producto) => producto.nombre));
    const faltantes = productosDelCatalogo.filter((producto) => !nombresGuardados.has(producto.nombre));
    const productosCompletos = [...productosGuardados, ...faltantes].map((producto) => ({
      ...producto,
      ...(datosProductosActualizados[producto.nombre] || {}),
      id: producto.id,
      stock: producto.stock,
      estado: producto.estado,
      proveedor: producto.proveedor && producto.proveedor !== "Sin proveedor"
        ? producto.proveedor
        : datosProductosActualizados[producto.nombre]?.marca || producto.marca || "Proveedor Senabella"
    }));
    localStorage.setItem(PRODUCTOS_ADMIN_KEY, JSON.stringify(productosCompletos));
    return productosCompletos;
  } catch {
    return [...productosPredeterminados, ...productosDelCatalogo];
  }
};

const leerCategorias = () => {
  try {
    const categorias = JSON.parse(localStorage.getItem(CATEGORIAS_KEY) || "[]");
    return Array.isArray(categorias) && categorias.length
      ? categorias
      : [{ id: 1, nombre: "General", descripcion: "Productos generales", productos: 0 }];
  } catch {
    return [{ id: 1, nombre: "General", descripcion: "Productos generales", productos: 0 }];
  }
};

const sincronizarCategorias = (productos) => {
  try {
    const categorias = leerCategorias();
    const categoriasActualizadas = categorias.map((categoria) => ({
      ...categoria,
      productos: productos.filter((producto) => String(producto.categoria || "General").toLowerCase() === String(categoria.nombre).toLowerCase()).length
    }));
    localStorage.setItem(CATEGORIAS_KEY, JSON.stringify(categoriasActualizadas));
  } catch {
    // La tabla de productos sigue funcionando aunque el almacenamiento este incompleto.
  }
};

function Productos() {
  const [productos, setProductos] = useState(leerProductos);
  const [categorias, setCategorias] = useState(leerCategorias);

  const [modalAbierto, setModalAbierto] = useState(false);
  const [productoEditando, setProductoEditando] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const proveedoresDisponibles = Array.from(new Set([
    "Proveedor Senabella",
    "TechSupply Inc.",
    "Global Electronics",
    "Digital Accessories",
    ...productos.map((producto) => producto.proveedor).filter(Boolean)
  ]));

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
      imagen: "",
      proveedor: "Sin proveedor"
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
      sincronizarCategorias(productosActualizados);
    } else {
      // Agregar nuevo producto
      const nuevoProducto = {
        ...productoEditando,
        id: productos.reduce((mayor, producto) => typeof producto.id === "number" ? Math.max(mayor, producto.id) : mayor, 0) + 1
      };
      const productosActualizados = [...productos, nuevoProducto];
      setProductos(productosActualizados);
      localStorage.setItem(PRODUCTOS_ADMIN_KEY, JSON.stringify(productosActualizados));
      sincronizarCategorias(productosActualizados);
    }
    cerrarModal();
  };

  const eliminarProducto = (id) => {
    if (confirm("¿Estás seguro de eliminar este producto?")) {
      const productosActualizados = productos.filter(p => p.id !== id);
      setProductos(productosActualizados);
      localStorage.setItem(PRODUCTOS_ADMIN_KEY, JSON.stringify(productosActualizados));
      sincronizarCategorias(productosActualizados);
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
              <th>Imagen</th>
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
                <td>
                  {producto.imagen ? (
                    <img
                      src={producto.imagen}
                      alt={producto.nombre}
                      style={{ width: "52px", height: "52px", objectFit: "cover", borderRadius: "8px" }}
                    />
                  ) : (
                    <span title="Sin imagen" style={{ display: "inline-flex", width: "52px", height: "52px", alignItems: "center", justifyContent: "center", background: "#f1f2f5", borderRadius: "8px" }}>
                      <i className="fa-solid fa-image"></i>
                    </span>
                  )}
                </td>
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
                <label htmlFor="categoria-producto">Categoría</label>
                <select
                  id="categoria-producto"
                  value={productoEditando?.categoria || categorias[0]?.nombre || "General"}
                  onChange={(e) => setProductoEditando({...productoEditando, categoria: e.target.value})}
                  required
                >
                  {categorias.map((categoria) => (
                    <option key={categoria.id} value={categoria.nombre}>{categoria.nombre}</option>
                  ))}
                </select>
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
              <div className="admin-form-grupo">
                <label>Proveedor</label>
                <select
                  value={productoEditando?.proveedor || "Sin proveedor"}
                  onChange={(e) => setProductoEditando({...productoEditando, proveedor: e.target.value})}
                >
                  <option value="Sin proveedor">Sin proveedor</option>
                  {proveedoresDisponibles.map((proveedor) => (
                    <option key={proveedor} value={proveedor}>{proveedor}</option>
                  ))}
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