import { useState, useMemo, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import "./catalogo_ropa_accesorios.css";
import {
  categoriasCircularesRopa,
  marcasRopa,
  categoriasListaLateralRopa,
  productosRopaAccesorios,
} from "../../datos";

function CatalogoRopaAccesorios() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryCat = searchParams.get("categoria") || "";

  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(queryCat);
  const [marcaSeleccionada, setMarcaSeleccionada] = useState("");
  const [ordenSeleccionado, setOrdenSeleccionado] = useState("Recomendados");
  const [paginaActual, setPaginaActual] = useState(1);
  const [soloDomicilio, setSoloDomicilio] = useState(false);

  // Estados para desplegables de filtros laterales
  const [filtroMarcaAbierto, setFiltroMarcaAbierto] = useState(false);
  const [filtroTallaAbierto, setFiltroTallaAbierto] = useState(false);
  const [filtroPrecioAbierto, setFiltroPrecioAbierto] = useState(false);
  const [filtroDescuentosAbierto, setFiltroDescuentosAbierto] = useState(false);

  // Sincronizar parámetro de búsqueda de la URL
  useEffect(() => {
    if (queryCat) {
      setCategoriaSeleccionada(queryCat.toLowerCase());
    }
  }, [queryCat]);

  // Filtrado reactivo de productos
  const productosFiltrados = useMemo(() => {
    let resultado = [...productosRopaAccesorios];

    // Filtro por marca
    if (marcaSeleccionada) {
      resultado = resultado.filter(
        (p) => p.marca.toUpperCase() === marcaSeleccionada.toUpperCase()
      );
    }

    // Filtro por categoría
    if (categoriaSeleccionada) {
      const catLower = categoriaSeleccionada.toLowerCase();
      resultado = resultado.filter((p) => {
        const prodCat = (p.categoria || "").toLowerCase();
        const prodNombre = p.nombre.toLowerCase();
        return (
          prodCat.includes(catLower) ||
          prodNombre.includes(catLower) ||
          (catLower === "mujer" && (prodCat === "mujer" || prodNombre.includes("mujer") || prodNombre.includes("femenina") || prodNombre.includes("vestido") || prodNombre.includes("falda") || prodNombre.includes("blusa"))) ||
          (catLower === "hombre" && (prodCat === "hombre" || prodNombre.includes("hombre") || prodNombre.includes("masculina") || prodNombre.includes("camisa") || prodNombre.includes("chaqueta") || prodNombre.includes("jean"))) ||
          (catLower === "calzado" && (prodCat === "calzado" || prodNombre.includes("tenis") || prodNombre.includes("calzado") || prodNombre.includes("running"))) ||
          (catLower === "accesorios" && (prodCat === "accesorios" || prodNombre.includes("mochila") || prodNombre.includes("reloj") || prodNombre.includes("bufanda"))) ||
          (catLower === "relojes" && (prodCat === "relojes" || prodNombre.includes("reloj"))) ||
          (catLower === "belleza" && (prodCat === "belleza" || prodNombre.includes("belleza"))) ||
          (catLower === "parejas" && (prodCat === "parejas" || prodNombre.includes("pareja") || prodNombre.includes("coordinad")))
        );
      });
    }

    // Ordenamiento
    if (ordenSeleccionado === "Menor precio") {
      resultado.sort((a, b) => a.precioNumero - b.precioNumero);
    } else if (ordenSeleccionado === "Mayor precio") {
      resultado.sort((a, b) => b.precioNumero - a.precioNumero);
    }

    return resultado;
  }, [marcaSeleccionada, categoriaSeleccionada, ordenSeleccionado]);

  // Paginación (12 productos por página)
  const itemsPorPagina = 12;
  const paginasTotales = Math.ceil(productosFiltrados.length / itemsPorPagina) || 1;
  const inicioIndice = (paginaActual - 1) * itemsPorPagina;
  const productosPaginados = productosFiltrados.slice(
    inicioIndice,
    inicioIndice + itemsPorPagina
  );

  const toggleCategoria = (cat) => {
    const normalizada = cat.toLowerCase().replace("moda ", "");
    if (categoriaSeleccionada === normalizada) {
      setCategoriaSeleccionada("");
      setSearchParams({});
    } else {
      setCategoriaSeleccionada(normalizada);
      setSearchParams({ categoria: normalizada });
    }
    setPaginaActual(1);
  };

  const toggleMarca = (marca) => {
    setMarcaSeleccionada((prev) => (prev === marca ? "" : marca));
    setPaginaActual(1);
  };

  const handleFavorito = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.target.classList.toggle("fa-solid");
    e.target.classList.toggle("fa-regular");
    e.target.style.color = e.target.classList.contains("fa-solid")
      ? "#e63946"
      : "";
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
    <div className="catalogo-ropa-contenedor">
      {/* Categorías circulares */}
      <section className="categorias-circulares">
        {categoriasCircularesRopa.map((cat, idx) => (
          <div
            key={idx}
            className={`categoria ${
              categoriaSeleccionada === cat.categoria ? "activa" : ""
            }`}
            onClick={() => toggleCategoria(cat.categoria)}
          >
            <div className="imagen-cat">
              <img src={cat.imagen} alt={cat.titulo} />
            </div>
            <div className="titulo-cat">{cat.titulo}</div>
          </div>
        ))}
      </section>

      {/* Contenido Principal */}
      <main className="main">
        {/* Menú lateral de filtros */}
        <aside className="menu_lateral">
          <div className="contenido-menu">
            <div className="menu-texto">
              <h3>Moda</h3>
              <h2>Ropa y Accesorios</h2>
              <div className="resultados">
                Resultados ({productosFiltrados.length})
              </div>
            </div>

            {/* Filtro: Tipo de Entrega */}
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
                <input
                  type="checkbox"
                  checked={soloDomicilio}
                  onChange={(e) => setSoloDomicilio(e.target.checked)}
                />
              </div>
              <div className="info-entrega">
                <span className="texto-gratis">Gratis</span>
                <span className="texto-2">Llega mañana</span>
              </div>
            </div>

            {/* Filtro: Categoría */}
            <div className="filtro">
              <div className="filtro1">
                Categoría
                <i className="fa-solid fa-chevron-up"></i>
              </div>
              <div className="categorias-lista">
                {categoriasListaLateralRopa.map((cat, idx) => {
                  const valor = cat.toLowerCase().replace("moda ", "");
                  return (
                    <span
                      key={idx}
                      className={`categoria-lis ${
                        categoriaSeleccionada === valor ? "activa" : ""
                      }`}
                      onClick={() => toggleCategoria(valor)}
                    >
                      {cat}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Filtro: Marca */}
            <div className="filtro">
              <div
                className="filtro1"
                onClick={() => setFiltroMarcaAbierto(!filtroMarcaAbierto)}
              >
                Marca
                <i
                  className={`fa-solid ${
                    filtroMarcaAbierto
                      ? "fa-chevron-up"
                      : "fa-chevron-down"
                  }`}
                ></i>
              </div>
              {filtroMarcaAbierto && (
                <div className="opciones-filtro-lateral">
                  {marcasRopa.map((m, idx) => (
                    <div key={idx}>
                      <label>
                        <input
                          type="checkbox"
                          checked={marcaSeleccionada === m}
                          onChange={() => toggleMarca(m)}
                        />{" "}
                        {m}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Filtro: Talla */}
            <div className="filtro">
              <div
                className="filtro1"
                onClick={() => setFiltroTallaAbierto(!filtroTallaAbierto)}
              >
                Talla
                <i
                  className={`fa-solid ${
                    filtroTallaAbierto
                      ? "fa-chevron-up"
                      : "fa-chevron-down"
                  }`}
                ></i>
              </div>
              {filtroTallaAbierto && (
                <div className="opciones-filtro-lateral">
                  {["XS", "S", "M", "L", "XL"].map((talla, idx) => (
                    <div key={idx}>
                      <label>
                        <input type="checkbox" value={talla} /> {talla}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Filtro: Precio */}
            <div className="filtro">
              <div
                className="filtro1"
                onClick={() => setFiltroPrecioAbierto(!filtroPrecioAbierto)}
              >
                Precio
                <i
                  className={`fa-solid ${
                    filtroPrecioAbierto
                      ? "fa-chevron-up"
                      : "fa-chevron-down"
                  }`}
                ></i>
              </div>
              {filtroPrecioAbierto && (
                <div className="opciones-filtro-lateral">
                  <div>
                    <label>
                      <input type="checkbox" /> Menos de $100.000
                    </label>
                  </div>
                  <div>
                    <label>
                      <input type="checkbox" /> $100.000 - $200.000
                    </label>
                  </div>
                  <div>
                    <label>
                      <input type="checkbox" /> Más de $200.000
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Filtro: Descuentos */}
            <div className="filtro">
              <div
                className="filtro1"
                onClick={() =>
                  setFiltroDescuentosAbierto(!filtroDescuentosAbierto)
                }
              >
                Descuentos
                <i
                  className={`fa-solid ${
                    filtroDescuentosAbierto
                      ? "fa-chevron-up"
                      : "fa-chevron-down"
                  }`}
                ></i>
              </div>
              {filtroDescuentosAbierto && (
                <div className="opciones-filtro-lateral">
                  <div>
                    <label>
                      <input type="checkbox" /> 20% o más
                    </label>
                  </div>
                  <div>
                    <label>
                      <input type="checkbox" /> 30% o más
                    </label>
                  </div>
                  <div>
                    <label>
                      <input type="checkbox" /> 40% o más
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Sección Productos y Marcas */}
        <section className="marca">
          {/* Botones de Marca */}
          <div className="filtro-marca">
            <span className="titulo-marca">
              Filtrar por <strong>Marca</strong>
            </span>
            <div className="botones">
              {marcasRopa.map((m, idx) => (
                <button
                  key={idx}
                  className={marcaSeleccionada === m ? "activo" : ""}
                  onClick={() => toggleMarca(m)}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Ordenamiento y Paginación */}
          <div className="recomendacion">
            <div className="recomendacion1">
              <span>Ordenar por:</span>
              <select
                className="opciones-recomendacion"
                value={ordenSeleccionado}
                onChange={(e) => setOrdenSeleccionado(e.target.value)}
              >
                <option value="Recomendados">Recomendados</option>
                <option value="Menor precio">Menor precio</option>
                <option value="Mayor precio">Mayor precio</option>
              </select>
            </div>

            <div className="num-pagina">
              <i
                className="fa-solid fa-chevron-left"
                onClick={() =>
                  setPaginaActual((prev) => Math.max(prev - 1, 1))
                }
              ></i>
              {Array.from({ length: paginasTotales }, (_, i) => i + 1).map(
                (num) => (
                  <span
                    key={num}
                    className={`pag-2 ${
                      paginaActual === num ? "active" : ""
                    }`}
                    onClick={() => setPaginaActual(num)}
                  >
                    {num}
                  </span>
                )
              )}
              <i
                className="fa-solid fa-chevron-right"
                onClick={() =>
                  setPaginaActual((prev) =>
                    Math.min(prev + 1, paginasTotales)
                  )
                }
              ></i>
            </div>
          </div>

          {/* Grid de Productos */}
          <div className="tarjeta-producto">
            {productosPaginados.map((prod) => (
              <div className="tar-producto" key={prod.id}>
                <a href="#!">
                  <img src={prod.imagen} alt={prod.nombre} />
                </a>
                <div className="etiqueta">
                  <span>{prod.etiqueta || "MODA"}</span>
                </div>
                <div className="nom-producto">{prod.marca}</div>
                <div className="descripcion">{prod.nombre}</div>
                <div className="referencia">
                  {prod.referencia || "Por SENABELLA MODA"}
                </div>
                <i
                  className="fa-regular fa-heart favorite-btn"
                  onClick={handleFavorito}
                ></i>
                <div>
                  <div className="metodo">
                    <span className="unica">ÚNICA</span>
                    <span className="cmr">CMR</span>
                    <span className="debito">Débito</span>
                  </div>
                  <div className="precio">
                    {prod.precio}{" "}
                    {prod.descuento && (
                      <span className="descuento">{prod.descuento}</span>
                    )}
                  </div>
                  {prod.precioSecundario && (
                    <div className="precio-secundario">
                      {prod.precioSecundario}
                    </div>
                  )}
                  {prod.precioSecundario1 && (
                    <div className="precio-secundario1">
                      {prod.precioSecundario1}
                    </div>
                  )}
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
    </div>
  );
}

export default CatalogoRopaAccesorios;
