import { useState, useEffect } from "react";
import "./favoritos.css";
import { Link } from "react-router-dom";
import { productosIniciales } from "../../datos";

// ==========================================
// CLAVE DE FAVORITOS EN LOCALSTORAGE
// ==========================================
const CLAVE_FAVORITOS = "senabella_favoritos_db";

function obtenerFavoritosGuardados() {
  try {
    const datos = localStorage.getItem(CLAVE_FAVORITOS);
    return datos ? JSON.parse(datos) : [];
  } catch {
    return [];
  }
}

function guardarFavoritosEnStorage(lista) {
  try {
    localStorage.setItem(CLAVE_FAVORITOS, JSON.stringify(lista));
  } catch (e) {
    console.error("Error al guardar favoritos:", e);
  }
}

function obtenerImagen(producto) {
  return producto.imagen || producto.img || "";
}

function obtenerPrecio(producto) {
  return producto.precio || producto.precioTexto || "$ 0";
}

// ==========================================
// UTILIDADES GLOBALES DE FAVORITOS
// ==========================================
export function iniciarFavoritosGlobal() {
  if (window.SenabellaFavoritos) return;

  window.SenabellaFavoritos = {
    obtenerLista() {
      return obtenerFavoritosGuardados();
    },

    esFavorito(nombre) {
      return this.obtenerLista().some(
        (f) => f.nombre?.trim().toLowerCase() === nombre?.trim().toLowerCase()
      );
    },

    toggleFavorito(producto) {
      const lista = this.obtenerLista();
      const idx = lista.findIndex(
        (f) => f.nombre?.trim().toLowerCase() === producto.nombre?.trim().toLowerCase()
      );
      if (idx !== -1) {
        lista.splice(idx, 1);
      } else {
        lista.push({ ...producto });
      }
      guardarFavoritosEnStorage(lista);
      window.dispatchEvent(new CustomEvent("senabella-favoritos-actualizado"));
      return idx === -1;
    },

    limpiarTodo() {
      guardarFavoritosEnStorage([]);
      window.dispatchEvent(new CustomEvent("senabella-favoritos-actualizado"));
    },
  };
}

// ==========================================
// COMPONENTE FAVORITOS
// ==========================================
function Favoritos() {
  const [favoritos, setFavoritos] = useState(() => obtenerFavoritosGuardados());
  const [ordenSeleccionado, setOrdenSeleccionado] = useState("recientes");

  useEffect(() => {
    iniciarFavoritosGlobal();
    const sincronizar = () => setFavoritos(obtenerFavoritosGuardados());
    window.addEventListener("senabella-favoritos-actualizado", sincronizar);
    return () => window.removeEventListener("senabella-favoritos-actualizado", sincronizar);
  }, []);

  useEffect(() => {
    guardarFavoritosEnStorage(favoritos);
  }, [favoritos]);

  const mostrarToast = (mensaje, tipo = "exito") => {
    if (window.SenabellaToast) {
      window.SenabellaToast(mensaje, tipo === "exito" ? "fa-circle-check" : "fa-circle-info", tipo);
    }
  };

  const eliminarFavorito = (nombre) => {
    const favoritosActualizados = favoritos.filter(
      (f) => f.nombre?.trim().toLowerCase() !== nombre?.trim().toLowerCase()
    );
    setFavoritos(favoritosActualizados);
    guardarFavoritosEnStorage(favoritosActualizados);
    window.dispatchEvent(new CustomEvent("senabella-favoritos-actualizado"));
    mostrarToast("Producto eliminado de favoritos", "info");
  };

  const limpiarTodos = () => {
    setFavoritos([]);
    guardarFavoritosEnStorage([]);
    window.dispatchEvent(new CustomEvent("senabella-favoritos-actualizado"));
    mostrarToast("Se eliminaron todos los favoritos", "info");
  };

  const agregarAlCarrito = (prod) => {
    if (window.SenabellaCart) {
      window.SenabellaCart.agregarProducto({
        nombre: prod.nombre,
        marca: prod.marca || "SENABELLA",
        precioText: obtenerPrecio(prod),
        img: obtenerImagen(prod),
        cantidad: 1,
      });
    }
    if (window.SenabellaToast) {
      window.SenabellaToast(
        `${prod.nombre?.slice(0, 32)}... añadido al carrito`,
        "fa-cart-plus",
        "exito"
      );
    } else {
      mostrarToast(`${prod.nombre?.slice(0, 32)}... añadido al carrito`);
    }
  };

  const favoritosOrdenados = [...favoritos].sort((a, b) => {
    if (ordenSeleccionado === "nombre-az") return (a.nombre || "").localeCompare(b.nombre || "");
    if (ordenSeleccionado === "nombre-za") return (b.nombre || "").localeCompare(a.nombre || "");
    if (ordenSeleccionado === "precio-asc") {
      const pa = parseFloat((a.precio || "0").replace(/[^\d]/g, "")) || 0;
      const pb = parseFloat((b.precio || "0").replace(/[^\d]/g, "")) || 0;
      return pa - pb;
    }
    if (ordenSeleccionado === "precio-desc") {
      const pa = parseFloat((a.precio || "0").replace(/[^\d]/g, "")) || 0;
      const pb = parseFloat((b.precio || "0").replace(/[^\d]/g, "")) || 0;
      return pb - pa;
    }
    return 0;
  });

  const nombresEnFavoritos = new Set(favoritos.map((f) => f.nombre?.trim().toLowerCase()));
  const sugerencias = productosIniciales
    .filter((p) => !nombresEnFavoritos.has(p.nombre?.trim().toLowerCase()))
    .slice(0, 4);

  return (
    <>
      {/* HERO */}
      <section className="favoritos-hero">
        <div className="favoritos-hero-contenido">
          <i className="fa-solid fa-heart favoritos-hero-icono"></i>
          <div>
            <h1 className="favoritos-titulo">Mis Favoritos</h1>
            <p className="favoritos-subtitulo">
              {favoritos.length === 0
                ? "Aún no tienes productos guardados"
                : `${favoritos.length} producto${favoritos.length !== 1 ? "s" : ""} guardado${favoritos.length !== 1 ? "s" : ""}`}
            </p>
          </div>
        </div>
      </section>

      <main className="favoritos-main">
        <section className="favoritos-seccion">
          {favoritos.length === 0 ? (
            <div className="favoritos-vacio">
              <i className="fa-regular fa-heart favoritos-vacio-icono"></i>
              <h2 className="favoritos-vacio-titulo">Tu lista de favoritos está vacía</h2>
              <p className="favoritos-vacio-texto">
                Agrega productos que te interesen haciendo clic en el corazón{" "}
                <i className="fa-regular fa-heart"></i> dentro de cada producto.
              </p>
              <Link to="/catalogo" className="favoritos-btn-catalogo">
                <i className="fa-solid fa-shop"></i> Explorar catálogo
              </Link>
            </div>
          ) : (
            <>
              {/* BARRA DE HERRAMIENTAS */}
              <div className="favoritos-barra">
                <div className="favoritos-barra-izq">
                  <span className="favoritos-contador">
                    {favoritosOrdenados.length} producto{favoritosOrdenados.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="favoritos-barra-der">
                  <label className="favoritos-orden-label" htmlFor="orden-favoritos">
                    Ordenar por:
                  </label>
                  <select
                    id="orden-favoritos"
                    className="favoritos-orden-select"
                    value={ordenSeleccionado}
                    onChange={(e) => setOrdenSeleccionado(e.target.value)}
                  >
                    <option value="recientes">Más recientes</option>
                    <option value="nombre-az">Nombre A–Z</option>
                    <option value="nombre-za">Nombre Z–A</option>
                    <option value="precio-asc">Menor precio</option>
                    <option value="precio-desc">Mayor precio</option>
                  </select>
                  <button className="favoritos-btn-limpiar" onClick={limpiarTodos}>
                    <i className="fa-solid fa-trash-can"></i> Limpiar todo
                  </button>
                </div>
              </div>

              {/* GRID DE TARJETAS */}
              <div className="favoritos-grid">
                {favoritosOrdenados.map((prod, idx) => (
                  <div className="fav-tarjeta" key={prod.nombre + idx}>
                    {prod.promocion && (
                      <span className="fav-promocion">{prod.promocion}</span>
                    )}
                    <button
                      className="fav-btn-quitar"
                      title="Quitar de favoritos"
                      onClick={() => eliminarFavorito(prod.nombre)}
                    >
                      <i className="fa-solid fa-heart"></i>
                    </button>
                    <a href="#">
                      <img src={obtenerImagen(prod)} alt={prod.nombre} className="fav-imagen" />
                    </a>
                    <div className="fav-etiquetas">
                      {prod.etiqueta && <span className="fav-etiqueta">{prod.etiqueta}</span>}
                      {prod.envioGratis && (
                        <span className="fav-etiqueta-envio">Envío gratis</span>
                      )}
                    </div>
                    <div className="fav-marca">{prod.marca}</div>
                    <div className="fav-nombre">{prod.nombre}</div>
                    {prod.referencia && (
                      <div className="fav-referencia">
                        {prod.referencia}
                        {prod.verificado && (
                          <i className="fa-solid fa-circle-check fav-verificado"></i>
                        )}
                      </div>
                    )}
                    <div className="fav-metodo">
                      <span className="fav-unica">ÚNICA</span>
                      <span className="fav-cmr">CMR</span>
                      <span className="fav-debito">Débito</span>
                    </div>
                    <div className="fav-precio">
                      {obtenerPrecio(prod)}
                      {prod.descuento && (
                        <span className="fav-descuento">{prod.descuento}</span>
                      )}
                    </div>
                    {prod.precioSecundario && (
                      <div className="fav-precio-secundario">{prod.precioSecundario}</div>
                    )}
                    <button
                      className="fav-btn-carrito"
                      onClick={() => agregarAlCarrito(prod)}
                    >
                      <i className="fa-solid fa-cart-plus"></i> Añadir al carrito
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>

        {/* SUGERENCIAS */}
        {sugerencias.length > 0 && (
          <section className="favoritos-sugerencias">
            <h2 className="favoritos-sugerencias-titulo">También te puede gustar</h2>
            <div className="favoritos-sugerencias-grid">
              {sugerencias.map((prod) => (
                <div className="fav-sugerencia-tarjeta" key={prod.id}>
                  <img
                    src={prod.imagen}
                    alt={prod.nombre}
                    className="fav-sugerencia-imagen"
                  />
                  <p className="fav-sugerencia-marca">{prod.marca}</p>
                  <h4 className="fav-sugerencia-nombre">{prod.nombre}</h4>
                  <div className="fav-sugerencia-precio">
                    <p className="fav-sugerencia-precio-texto">{prod.precio}</p>
                    {prod.descuento && (
                      <span className="fav-sugerencia-descuento">{prod.descuento}</span>
                    )}
                  </div>
                  <div className="fav-sugerencia-acciones">
                    <button
                      className="fav-sugerencia-btn-carrito"
                      onClick={() => agregarAlCarrito(prod)}
                    >
                      <i className="fa-solid fa-cart-plus"></i> Añadir
                    </button>
                    <button
                      className="fav-sugerencia-btn-fav"
                      title="Agregar a favoritos"
                      onClick={() => {
                        iniciarFavoritosGlobal();
                        const agregado = window.SenabellaFavoritos.toggleFavorito(prod);
                        mostrarToast(
                          agregado
                            ? "Producto agregado a favoritos"
                            : "Producto eliminado de favoritos",
                          agregado ? "exito" : "info"
                        );
                      }}
                    >
                      <i className="fa-regular fa-heart"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

    </>
  );
}

export default Favoritos;
