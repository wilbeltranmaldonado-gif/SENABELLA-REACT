// Esta vista administra la creación y edición de categorías del catálogo.

import { useState } from "react";

const CATEGORIAS_KEY = "senabella_categories";
const categoriasIniciales = [
  {
    id: 1,
    nombre: "Audio",
    descripcion: "Auriculares, parlantes y sistemas de sonido",
    productos: 0,
  },
  {
    id: 2,
    nombre: "Relojes",
    descripcion: "Smartwatches y relojes tradicionales",
    productos: 0,
  },
  {
    id: 3,
    nombre: "Cargadores",
    descripcion: "Cargadores y cables para dispositivos",
    productos: 0,
  },
  {
    id: 4,
    nombre: "Computación",
    descripcion: "Laptops, tablets y accesorios",
    productos: 0,
  },
  {
    id: 5,
    nombre: "Accesorios",
    descripcion: "Fundas, protectores y accesorios varios",
    productos: 0,
  },
];

const normalizarNombreCategoria = (nombre) =>
  String(nombre || "General")
    .trim()
    .toLowerCase()
    .replace(/^\w/, (letra) => letra.toUpperCase());

const leerCategorias = () => {
  let categoriasGuardadas = categoriasIniciales;
  let productos = [];
  try {
    categoriasGuardadas =
      JSON.parse(localStorage.getItem(CATEGORIAS_KEY) || "null") ||
      categoriasIniciales;
    productos = JSON.parse(
      localStorage.getItem("senabella_admin_products") || "[]",
    );
  } catch {
    return categoriasIniciales;
  }

  const categoriasPorNombre = new Map(
    categoriasGuardadas.map((categoria) => [
      categoria.nombre.toLowerCase(),
      categoria,
    ]),
  );
  const nombresProductos = Array.from(
    new Set(
      productos.map((producto) =>
        normalizarNombreCategoria(producto.categoria),
      ),
    ),
  );
  let siguienteId =
    Math.max(
      ...categoriasGuardadas.map((categoria) => Number(categoria.id) || 0),
      0,
    ) + 1;

  nombresProductos.forEach((nombre) => {
    if (!categoriasPorNombre.has(nombre.toLowerCase())) {
      const nuevaCategoria = {
        id: siguienteId++,
        nombre,
        descripcion: `Productos de ${nombre}`,
        productos: 0,
      };
      categoriasGuardadas = [...categoriasGuardadas, nuevaCategoria];
      categoriasPorNombre.set(nombre.toLowerCase(), nuevaCategoria);
    }
  });

  const categoriasActualizadas = categoriasGuardadas.map((categoria) => ({
    ...categoria,
    productos: productos.filter(
      (producto) =>
        normalizarNombreCategoria(producto.categoria).toLowerCase() ===
        categoria.nombre.toLowerCase(),
    ).length,
  }));
  localStorage.setItem(CATEGORIAS_KEY, JSON.stringify(categoriasActualizadas));
  return categoriasActualizadas;
};

function Categorias() {
  const [categorias, setCategorias] = useState(leerCategorias);

  const [modalAbierto, setModalAbierto] = useState(false);
  const [categoriaEditando, setCategoriaEditando] = useState(null);

  const abrirModal = (categoria = null) => {
    setCategoriaEditando(
      categoria || {
        id: null,
        nombre: "",
        descripcion: "",
        productos: 0,
      },
    );
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setCategoriaEditando(null);
  };

  const guardarCategoria = (e) => {
    e.preventDefault();
    let categoriasActualizadas;
    if (categoriaEditando.id) {
      categoriasActualizadas = categorias.map((c) =>
        c.id === categoriaEditando.id ? categoriaEditando : c,
      );
    } else {
      const nuevaCategoria = {
        ...categoriaEditando,
        id: Math.max(...categorias.map((c) => c.id), 0) + 1,
      };
      categoriasActualizadas = [...categorias, nuevaCategoria];
    }
    setCategorias(categoriasActualizadas);
    localStorage.setItem(
      CATEGORIAS_KEY,
      JSON.stringify(categoriasActualizadas),
    );
    cerrarModal();
  };

  const eliminarCategoria = (id) => {
    if (confirm("¿Estás seguro de eliminar esta categoría?")) {
      const categoriasActualizadas = categorias.filter((c) => c.id !== id);
      setCategorias(categoriasActualizadas);
      localStorage.setItem(
        CATEGORIAS_KEY,
        JSON.stringify(categoriasActualizadas),
      );
    }
  };

  return (
    <div className='vista-categorias'>
      <div className='admin-cabecera-vista'>
        <h2 className='admin-seccion-titulo'>Gestión de categorías</h2>
        <button
          className='admin-boton admin-boton-primario'
          onClick={() => abrirModal()}
        >
          <i className='fa-solid fa-plus'></i> Agregar categoría
        </button>
      </div>

      <div className='admin-grid-categorias'>
        {categorias.map((categoria) => (
          <div key={categoria.id} className='admin-categoria-card'>
            <div className='admin-categoria-icono'>
              <i className='fa-solid fa-tags'></i>
            </div>
            <h3>{categoria.nombre}</h3>
            <p>{categoria.descripcion}</p>
            <div className='admin-categoria-stats'>
              <span>{categoria.productos} productos</span>
            </div>
            <div className='admin-categoria-acciones'>
              <button onClick={() => abrirModal(categoria)}>
                <i className='fa-solid fa-pen'></i>
              </button>
              <button onClick={() => eliminarCategoria(categoria.id)}>
                <i className='fa-solid fa-trash'></i>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL DE CATEGORÍA */}
      {modalAbierto && (
        <div className='admin-modal-overlay' onClick={cerrarModal}>
          <div className='admin-modal' onClick={(e) => e.stopPropagation()}>
            <div className='admin-modal-cabecera'>
              <h3>
                {categoriaEditando?.id
                  ? "Editar categoría"
                  : "Agregar categoría"}
              </h3>
              <button onClick={cerrarModal}>
                <i className='fa-solid fa-xmark'></i>
              </button>
            </div>
            <form onSubmit={guardarCategoria} className='admin-modal-cuerpo'>
              <div className='admin-form-grupo'>
                <label>Nombre de la categoría</label>
                <input
                  type='text'
                  value={categoriaEditando?.nombre || ""}
                  onChange={(e) =>
                    setCategoriaEditando({
                      ...categoriaEditando,
                      nombre: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className='admin-form-grupo'>
                <label>Descripción</label>
                <textarea
                  value={categoriaEditando?.descripcion || ""}
                  onChange={(e) =>
                    setCategoriaEditando({
                      ...categoriaEditando,
                      descripcion: e.target.value,
                    })
                  }
                  rows='3'
                />
              </div>
              <div className='admin-modal-pie'>
                <button type='button' onClick={cerrarModal}>
                  Cancelar
                </button>
                <button type='submit' className='admin-boton-primario'>
                  {categoriaEditando?.id ? "Actualizar" : "Agregar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Categorias;
