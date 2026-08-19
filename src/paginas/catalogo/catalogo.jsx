import { useState } from "react";
import "./catalogo.css";
import { Link } from "react-router-dom";
import {
  categoriasCirculares,
  productosIniciales,
  marcasBotones,
  categoriasListaLateral,
} from "../../datos";

function Catalogo() {
  const [paginaActual, setPaginaActual] = useState(1);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  const [marcaSeleccionada, setMarcaSeleccionada] = useState("");
  
  // ==========================================
  // LÓGICA DE FILTRADO
  // ==========================================
  
  const productosFiltrados = productosIniciales.filter(prod => {
    let cumpleMarca = marcaSeleccionada === "" || prod.marca === marcaSeleccionada;
    let cumpleCategoria = true;
    
    if (categoriaSeleccionada !== "") {
       cumpleCategoria = prod.nombre.toLowerCase().includes(categoriaSeleccionada) || 
                         prod.marca.toLowerCase().includes(categoriaSeleccionada);
    }
    
    return cumpleMarca && cumpleCategoria;
  });

  // Paginación (12 items por página aprox, pero aquí son 17 en total)
  const itemsPorPagina = 12;
  const paginasTotales = Math.ceil(productosFiltrados.length / itemsPorPagina);
  const inicioIndice = (paginaActual - 1) * itemsPorPagina;
  const productosPaginados = productosFiltrados.slice(inicioIndice, inicioIndice + itemsPorPagina);

  // ==========================================
  // MANEJADORES
  // ==========================================
  
  const toggleCategoria = (cat) => {
    setCategoriaSeleccionada(prev => prev === cat ? "" : cat);
    setPaginaActual(1);
  };
  
  const toggleMarca = (marca) => {
    setMarcaSeleccionada(prev => prev === marca ? "" : marca);
    setPaginaActual(1);
  };

  const agregarFavorito = (e) => {
    e.preventDefault();
    e.target.classList.toggle("fa-solid");
    e.target.classList.toggle("fa-regular");
    e.target.style.color = e.target.classList.contains("fa-solid") ? "#e63946" : "";
  };

  const handleAgregarAlCarrito = (prod) => {
    if (window.SenabellaCart) {
      window.SenabellaCart.agregarProducto({
        nombre: prod.nombre,
        marca: prod.marca || "SENABELLA",
        precioText: prod.precio,
        img: prod.imagen,
        cantidad: 1,
      });
    }
    if (window.SenabellaToast) {
      window.SenabellaToast(
        `${prod.nombre.slice(0, 32)}... añadido al carrito`,
        "fa-cart-plus",
        "exito"
      );
    }
  };

  return (
    <>
      <section className="categorias-circulares">
        {categoriasCirculares.map((cat, idx) => (
          <div 
            className={`categoria ${categoriaSeleccionada === cat.categoria ? 'circulo-activo' : ''}`} 
            key={idx}
            onClick={() => toggleCategoria(cat.categoria)}
            style={{ cursor: 'pointer', transform: categoriaSeleccionada === cat.categoria ? 'scale(1.08)' : '' }}
          >
            <div className="imagen-cat" style={{ border: categoriaSeleccionada === cat.categoria ? '2px solid #84b814' : '' }}>
              <img src={cat.imagen} alt={cat.titulo} />
            </div>
            <div className="titulo-cat">{cat.titulo}</div>
          </div>
        ))}
      </section>

      <main className="main">
        {/* Menu lateral */}
        <aside className="menu_lateral">
          <div className="contenido-menu">
            <div className="menu-texto">
              <h3>Tecnología</h3>
              <h2>Computadores</h2>
              <div className="resultados">Resultados ({productosFiltrados.length})</div>
            </div>

            <div className="filtro">
              <div className="filtro1">
                Tipo de Entrega
                <i className="fa-solid fa-chevron-up"></i>
              </div>
              <div className="opcion-domicilio">
                <div>
                  <i className="fa-solid fa-truck"></i>
                  Envío a domicilio
                </div>
                <input type="checkbox" />
              </div>
              <div className="info-entrega">
                <span className="texto-gratis">Gratis</span>
                <span className="texto-2">Llega mañana</span>
              </div>
            </div>

            <div className="filtro">
              <div className="filtro1">
                Categoría
                <i className="fa-solid fa-chevron-up"></i>
              </div>
              <div className="categorias-lista">
                {categoriasListaLateral.map((cat, i) => (
                  <span 
                    key={i} 
                    className="categoria-lis" 
                    style={{ cursor: 'pointer' }}
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>

            {/* Agregamos solo algunos filtros de ejemplo de los muchos que había */}
            <div className="filtro">
              <div className="filtro1">
                Marca
                <i className="fa-solid fa-chevron-down"></i>
              </div>
            </div>
            
            <div className="filtro">
              <div className="filtro1">
                Precio
                <i className="fa-solid fa-chevron-down"></i>
              </div>
            </div>
          </div>
        </aside>

        {/* Productos */}
        <section className="marca">
          <div className="filtro-marca">
            <span className="titulo-marca">Filtrar por <strong>Marca</strong></span>
            <div className="botones" style={{ scrollBehavior: "smooth" }}>
              {marcasBotones.map(marca => (
                <button 
                  key={marca}
                  className={marcaSeleccionada === marca ? 'sn-activo' : ''}
                  style={marcaSeleccionada === marca ? { background: '#84b814', color: '#fff' } : {}}
                  onClick={() => toggleMarca(marca)}
                >
                  {marca}
                </button>
              ))}
            </div>
            <button className="boton-flecha" onClick={(e) => {
              const contenedor = e.currentTarget.previousElementSibling;
              if (contenedor) contenedor.scrollLeft += 220;
            }}>
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          </div>

          <div className="recomendacion">
            <div className="recomendacion1">
              <span>Ordenar por:</span>
              <select className="opciones-recomendacion">
                <option>Recomendados</option>
                <option>Menor precio</option>
                <option>Mayor precio</option>
              </select>
            </div>
            <div className="num-pagina">
              <i 
                className="fa-solid fa-chevron-left" 
                style={{ cursor: 'pointer' }}
                onClick={() => setPaginaActual(prev => Math.max(1, prev - 1))}
              ></i>
              
              {Array.from({ length: paginasTotales }).map((_, i) => (
                <span 
                  key={i} 
                  className={`pag-2 ${paginaActual === i + 1 ? 'active' : ''}`}
                  style={{ 
                    cursor: 'pointer', 
                    fontWeight: paginaActual === i + 1 ? 'bold' : 'normal',
                    color: paginaActual === i + 1 ? '#84b814' : ''
                  }}
                  onClick={() => setPaginaActual(i + 1)}
                >
                  {i + 1}
                </span>
              ))}
              
              <i 
                className="fa-solid fa-chevron-right"
                style={{ cursor: 'pointer' }}
                onClick={() => setPaginaActual(prev => Math.min(paginasTotales, prev + 1))}
              ></i>
            </div>
          </div>

          <div className="tarjeta-producto">
            {productosPaginados.map(prod => (
              <div className="tar-producto" key={prod.id}>
                {prod.promocion && <span className="promocion">{prod.promocion}</span>}
                <a href="#">
                  <img src={prod.imagen} alt={prod.marca} />
                </a>
                <div className="etiqueta">
                  <span>{prod.etiqueta}</span>
                  {prod.envioGratis && <span className="etiqueta-envio">Envío gratis</span>}
                </div>
                <div className="nom-producto">{prod.marca}</div>
                <div className="descripcion">{prod.nombre}</div>
                <div className="referencia">
                  {prod.referencia} {prod.verificado && <i className="fa-solid fa-check-circle"></i>}
                </div>
                
                <i className="fa-regular fa-heart favorite-btn" onClick={agregarFavorito} style={{ cursor: 'pointer' }}></i>
                
                <div>
                  <div className="metodo">
                    <span className="unica">ÚNICA</span>
                    <span className="cmr">CMR</span>
                    <span className="debito">Débito</span>
                  </div>
                  <div className="precio">
                    {prod.precio}
                    {prod.descuento && <span className="descuento">{prod.descuento}</span>}
                  </div>
                  {prod.precioSecundario && <div className="precio-secundario">{prod.precioSecundario}</div>}
                  {prod.precioSecundario1 && <div className="precio-secundario1">{prod.precioSecundario1}</div>}
                </div>

                <button
                  className="btn-agregar-carrito"
                  onClick={() => handleAgregarAlCarrito(prod)}
                >
                  <i className="fa-solid fa-cart-plus"></i> Añadir al carrito
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}

export default Catalogo;
