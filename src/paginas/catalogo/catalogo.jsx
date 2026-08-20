import { useState, useEffect } from "react";
import "./catalogo.css";
import { Link } from "react-router-dom";
import {
  categoriasCirculares,
  productosIniciales,
  marcasBotones,
  categoriasListaLateral,
} from "../../datos";
import { iniciarFavoritosGlobal } from "../favoritos/favoritos";

function Catalogo() {
  const [productosAdmin, setProductosAdmin] = useState(() => {
    try {
      const productos = JSON.parse(localStorage.getItem("senabella_admin_products") || "[]");
      return Array.isArray(productos) ? productos : [];
    } catch {
      return [];
    }
  });
  const [paginaActual, setPaginaActual] = useState(1);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  const [marcaSeleccionada, setMarcaSeleccionada] = useState("");

  const [filtroEntregaAbierto, setFiltroEntregaAbierto] = useState(true);
  const [filtroCategoriaAbierto, setFiltroCategoriaAbierto] = useState(true);
  const [filtroMarcaAbierto, setFiltroMarcaAbierto] = useState(true);
  const [filtroPrecioAbierto, setFiltroPrecioAbierto] = useState(true);

  useEffect(() => {
    const actualizarProductos = () => {
      try {
        const productos = JSON.parse(localStorage.getItem("senabella_admin_products") || "[]");
        setProductosAdmin(Array.isArray(productos) ? productos : []);
      } catch {
        setProductosAdmin([]);
      }
    };
    actualizarProductos();
    window.addEventListener("storage", actualizarProductos);
    return () => window.removeEventListener("storage", actualizarProductos);
  }, []);

  const productosAdministrados = productosAdmin.map((producto) => ({
    ...producto,
    marca: "SENABELLA",
    imagen: producto.imagen || "https://via.placeholder.com/480x480?text=Producto",
    referencia: producto.categoria,
    precioNumero: Number(String(producto.precio).replace(/[^\d]/g, "")) || 0,
  }));
  const productosDisponibles = Array.from(
    new Map([...productosAdministrados, ...productosIniciales].map((producto) => [producto.nombre, producto])).values()
  );
  
  // ==========================================
  // LÓGICA DE FILTRADO
  // ==========================================
  
  const productosFiltrados = productosDisponibles.filter(prod => {
    let cumpleMarca = marcaSeleccionada === "" || prod.marca === marcaSeleccionada;
    let cumpleCategoria = true;
    
    if (categoriaSeleccionada !== "") {
      cumpleCategoria = prod.nombre.toLowerCase().includes(categoriaSeleccionada) ||
              prod.marca.toLowerCase().includes(categoriaSeleccionada) ||
              prod.categoria?.toLowerCase().includes(categoriaSeleccionada);
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

  const agregarFavorito = (e, prod) => {
    e.preventDefault();
    e.stopPropagation();
    // Inicializar si aún no está disponible
    iniciarFavoritosGlobal();
    const esFav = window.SenabellaFavoritos.toggleFavorito({
      nombre: prod.nombre,
      marca: prod.marca || "SENABELLA",
      imagen: prod.imagen,
      precio: prod.precio,
      descuento: prod.descuento,
      etiqueta: prod.etiqueta,
      envioGratis: prod.envioGratis,
      referencia: prod.referencia,
      verificado: prod.verificado,
      precioSecundario: prod.precioSecundario,
      promocion: prod.promocion,
    });
    e.target.classList.toggle("fa-solid", esFav);
    e.target.classList.toggle("fa-regular", !esFav);
    e.target.style.color = esFav ? "#e63946" : "";
    if (window.SenabellaToast) {
      window.SenabellaToast(
        esFav ? "Agregado a favoritos" : "Eliminado de favoritos",
        esFav ? "fa-heart" : "fa-heart-crack",
        "exito"
      );
    }
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
              <div 
                className="filtro1" 
                onClick={() => setFiltroEntregaAbierto(!filtroEntregaAbierto)}
                style={{ cursor: 'pointer' }}
              >
                Tipo de Entrega
                <i className={`fa-solid ${filtroEntregaAbierto ? "fa-chevron-up" : "fa-chevron-down"}`}></i>
              </div>
              {filtroEntregaAbierto && (
                <>
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
                </>
              )}
            </div>

            <div className="filtro">
              <div 
                className="filtro1"
                onClick={() => setFiltroCategoriaAbierto(!filtroCategoriaAbierto)}
                style={{ cursor: 'pointer' }}
              >
                Categoría
                <i className={`fa-solid ${filtroCategoriaAbierto ? "fa-chevron-up" : "fa-chevron-down"}`}></i>
              </div>
              {filtroCategoriaAbierto && (
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
              )}
            </div>

            {/* Agregamos solo algunos filtros de ejemplo de los muchos que había */}
            <div className="filtro">
              <div 
                className="filtro1"
                onClick={() => setFiltroMarcaAbierto(!filtroMarcaAbierto)}
                style={{ cursor: 'pointer' }}
              >
                Marca
                <i className={`fa-solid ${filtroMarcaAbierto ? "fa-chevron-up" : "fa-chevron-down"}`}></i>
              </div>
              {filtroMarcaAbierto && (
                <div className="opciones-filtro-lateral">
                  {marcasBotones.map((m, idx) => (
                    <div key={idx}>
                      <label>
                        <input
                          type="checkbox"
                          checked={marcaSeleccionada === m}
                          onChange={() => setMarcaSeleccionada(marcaSeleccionada === m ? "" : m)}
                        />{" "}
                        {m}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="filtro">
              <div 
                className="filtro1"
                onClick={() => setFiltroPrecioAbierto(!filtroPrecioAbierto)}
                style={{ cursor: 'pointer' }}
              >
                Precio
                <i className={`fa-solid ${filtroPrecioAbierto ? "fa-chevron-up" : "fa-chevron-down"}`}></i>
              </div>
              {filtroPrecioAbierto && (
                <div className="opciones-filtro-lateral">
                  <div><label><input type="checkbox" /> Menos de $500.000</label></div>
                  <div><label><input type="checkbox" /> $500.000 - $1.000.000</label></div>
                  <div><label><input type="checkbox" /> $1.000.000 - $2.000.000</label></div>
                  <div><label><input type="checkbox" /> Más de $2.000.000</label></div>
                </div>
              )}
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
                
                <i className="fa-regular fa-heart favorite-btn" onClick={(e) => agregarFavorito(e, prod)} style={{ cursor: 'pointer' }}></i>
                
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
