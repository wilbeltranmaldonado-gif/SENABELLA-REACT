import { useState } from "react";

function Categorias() {
  const [categorias, setCategorias] = useState([
    { id: 1, nombre: "Audio", descripcion: "Auriculares, parlantes y sistemas de sonido", productos: 45 },
    { id: 2, nombre: "Relojes", descripcion: "Smartwatches y relojes tradicionales", productos: 23 },
    { id: 3, nombre: "Cargadores", descripcion: "Cargadores y cables para dispositivos", productos: 67 },
    { id: 4, nombre: "Computación", descripcion: "Laptops, tablets y accesorios", productos: 89 },
    { id: 5, nombre: "Accesorios", descripcion: "Fundas, protectores y accesorios varios", productos: 134 },
  ]);

  const [modalAbierto, setModalAbierto] = useState(false);
  const [categoriaEditando, setCategoriaEditando] = useState(null);

  const abrirModal = (categoria = null) => {
    setCategoriaEditando(categoria || {
      id: null,
      nombre: "",
      descripcion: "",
      productos: 0
    });
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setCategoriaEditando(null);
  };

  const guardarCategoria = (e) => {
    e.preventDefault();
    if (categoriaEditando.id) {
      setCategorias(categorias.map(c =>
        c.id === categoriaEditando.id ? categoriaEditando : c
      ));
    } else {
      const nuevaCategoria = {
        ...categoriaEditando,
        id: Math.max(...categorias.map(c => c.id)) + 1
      };
      setCategorias([...categorias, nuevaCategoria]);
    }
    cerrarModal();
  };

  const eliminarCategoria = (id) => {
    if (confirm("¿Estás seguro de eliminar esta categoría?")) {
      setCategorias(categorias.filter(c => c.id !== id));
    }
  };

  return (
    <div className="vista-categorias">
      <div className="admin-cabecera-vista">
        <h2 className="admin-seccion-titulo">Gestión de categorías</h2>
        <button 
          className="admin-boton admin-boton-primario"
          onClick={() => abrirModal()}
        >
          <i className="fa-solid fa-plus"></i> Agregar categoría
        </button>
      </div>

      <div className="admin-grid-categorias">
        {categorias.map((categoria) => (
          <div key={categoria.id} className="admin-categoria-card">
            <div className="admin-categoria-icono">
              <i className="fa-solid fa-tags"></i>
            </div>
            <h3>{categoria.nombre}</h3>
            <p>{categoria.descripcion}</p>
            <div className="admin-categoria-stats">
              <span>{categoria.productos} productos</span>
            </div>
            <div className="admin-categoria-acciones">
              <button onClick={() => abrirModal(categoria)}>
                <i className="fa-solid fa-pen"></i>
              </button>
              <button onClick={() => eliminarCategoria(categoria.id)}>
                <i className="fa-solid fa-trash"></i>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL DE CATEGORÍA */}
      {modalAbierto && (
        <div className="admin-modal-overlay" onClick={cerrarModal}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-cabecera">
              <h3>{categoriaEditando?.id ? "Editar categoría" : "Agregar categoría"}</h3>
              <button onClick={cerrarModal}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <form onSubmit={guardarCategoria} className="admin-modal-cuerpo">
              <div className="admin-form-grupo">
                <label>Nombre de la categoría</label>
                <input
                  type="text"
                  value={categoriaEditando?.nombre || ""}
                  onChange={(e) => setCategoriaEditando({...categoriaEditando, nombre: e.target.value})}
                  required
                />
              </div>
              <div className="admin-form-grupo">
                <label>Descripción</label>
                <textarea
                  value={categoriaEditando?.descripcion || ""}
                  onChange={(e) => setCategoriaEditando({...categoriaEditando, descripcion: e.target.value})}
                  rows="3"
                />
              </div>
              <div className="admin-modal-pie">
                <button type="button" onClick={cerrarModal}>Cancelar</button>
                <button type="submit" className="admin-boton-primario">
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