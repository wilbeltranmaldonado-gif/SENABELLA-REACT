import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./inicio.css";
import {
  productosInicio as productos,
  categoriasInicio as categorias,
  promocionesInicio as promociones,
  bannersInicio as banners,
} from "../../datos";
import { iniciarFavoritosGlobal } from "../favoritos/favoritos";

function Inicio() {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [productoModal, setProductoModal] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [mostrarArriba, setMostrarArriba] = useState(false);
  const navigate = useNavigate();
  const mostrarToast = (mensaje, tipo = "exito") => {
    if (window.SenabellaToast) {
      const icono = tipo === "info" ? "fa-circle-info" : tipo === "advertencia" ? "fa-triangle-exclamation" : "fa-circle-check";
      window.SenabellaToast(mensaje, icono, tipo);
    }
  };

  // ==========================================
  // MODAL
  // ==========================================

  const abrirVistaRapida = (producto) => {
    localStorage.setItem("productoSeleccionado", JSON.stringify({
      ...producto,
      titulo: producto.nombre,
      marca: producto.marca || "SENABELLA",
      precioActual: producto.precio,
      descripcion: producto.descripcion || `${producto.nombre}. Producto seleccionado de Senabella con compra segura y soporte especializado.`,
      origen: "/",
    }));
    navigate("/detalle_producto");
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setProductoModal(null);
    document.body.style.overflow = "";
  };

  // ==========================================
  // SCROLL
  // ==========================================

  useEffect(() => {
    iniciarFavoritosGlobal(); // Inicializar favoritos globales al montar
    const manejarScroll = () => {
      setMostrarArriba(window.scrollY > 400);
    };

    window.addEventListener("scroll", manejarScroll);

    return () => {
      window.removeEventListener("scroll", manejarScroll);
      document.body.style.overflow = "";
    };
  }, []);

  // ==========================================
  // ESCAPE PARA CERRAR MODAL
  // ==========================================

  useEffect(() => {
    const manejarEscape = (e) => {
      if (e.key === "Escape") {
        cerrarModal();
      }
    };

    document.addEventListener("keydown", manejarEscape);

    return () => {
      document.removeEventListener("keydown", manejarEscape);
    };
  }, []);

  // ==========================================
  // ANIMACIONES AL HACER SCROLL
  // ==========================================

  useEffect(() => {
    const elementos = document.querySelectorAll(
      ".seccion-animada, .elemento-animado"
    );

    const observer = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (entrada.isIntersecting) {
            entrada.target.classList.add("animado");
          }
        });
      },
      {
        threshold: 0.1,
      }
    );

    elementos.forEach((elemento) => observer.observe(elemento));

    return () => observer.disconnect();
  }, []);

  // ==========================================
  // CARRUSEL
  // ==========================================

  const [slideActual, setSlideActual] = useState(0);

  useEffect(() => {
    const intervalo = setInterval(() => {
      setSlideActual((actual) => (actual + 1) % banners.length);
    }, 5000);

    return () => clearInterval(intervalo);
  }, []);

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <>
      <main className="container my-4">

        {/* ==========================================
            BANNER OFERTA
        ========================================== */}

        <section className="banner-oferta seccion-animada mb-4">
          <div className="banner-oferta-contenido">
            <div className="banner-oferta-texto">
              <span className="badge-oferta">
                <i className="fa-solid fa-bolt"></i> CYBER OFERTAS
              </span>

              <h2>
                ¡Hasta 70% de descuento en productos seleccionados!
              </h2>

              <p>
                Encuentra los mejores precios en Senabella
              </p>
            </div>

            <Link
              to="/catalogo?categoria=ofertas"
              className="btn btn-light fw-bold px-4 py-2 text-dark rounded-pill"
            >
              Ver Ofertas
            </Link>
          </div>
        </section>

        {/* ==========================================
            CATEGORÍAS
        ========================================== */}

        <section className="row row-cols-2 row-cols-sm-3 row-cols-md-5 g-3 text-center mb-4 categorias-inicio seccion-animada">

          {categorias.map((categoria) => (
            <div className="col" key={categoria.categoria}>
              <Link
                to={categoria.ruta}
                className="categoria-link"
              >
                <div className="p-3 border rounded shadow-sm hover-shadow bg-white h-100">

                  <img
                    src={categoria.imagen}
                    alt={categoria.nombre}
                    className="img-fluid mb-2 rounded"
                  />

                  <div className="fw-bold fs-7">
                    {categoria.nombre}
                  </div>

                </div>
              </Link>
            </div>
          ))}

        </section>

        {/* ==========================================
            CARRUSEL
        ========================================== */}

        <section
          id="bannerCarousel"
          className="carousel slide mb-5 seccion-animada"
        >

          <div className="carousel-indicators">

            {banners.map((_, index) => (
              <button
                key={index}
                type="button"
                className={slideActual === index ? "active" : ""}
                onClick={() => setSlideActual(index)}
                aria-label={`Slide ${index + 1}`}
              ></button>
            ))}

          </div>

          <div className="carousel-inner rounded shadow-sm">

            {banners.map((banner, index) => (
              <div
                className={`carousel-item ${
                  slideActual === index ? "active" : ""
                }`}
                key={banner}
              >
                <Link to="/catalogo?categoria=ofertas">
                  <img
                    src={banner}
                    className="d-block w-100"
                    alt={`Promoción Banner ${index + 1}`}
                  />
                </Link>
              </div>
            ))}

          </div>

          <button
            className="carousel-control-prev"
            type="button"
            onClick={() =>
              setSlideActual(
                (slideActual - 1 + banners.length) % banners.length
              )
            }
          >
            <span className="carousel-control-prev-icon"></span>
            <span className="visually-hidden">
              Anterior
            </span>
          </button>

          <button
            className="carousel-control-next"
            type="button"
            onClick={() =>
              setSlideActual(
                (slideActual + 1) % banners.length
              )
            }
          >
            <span className="carousel-control-next-icon"></span>
            <span className="visually-hidden">
              Siguiente
            </span>
          </button>

          {/* Barra de progreso */}
          <div
            className="barra-progreso-carrusel"
            key={slideActual}
          ></div>

        </section>

        {/* ==========================================
            PRODUCTOS
        ========================================== */}

        <section className="mb-5 seccion-animada">

          <div className="d-flex justify-content-between align-items-center mb-3">

            <h2 className="h4 m-0">
              Lo más vendido en tecnología
            </h2>

            <Link
              to="/catalogo"
              className="btn btn-outline-primary btn-sm"
            >
              Ver catálogo completo
            </Link>

          </div>

          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-4 g-4 productos-grid">

            {productos.map((producto, index) => (
              <div
                className="col elemento-animado"
                style={{
                  transitionDelay: `${index * 0.06}s`,
                }}
                key={producto.nombre}
              >

                <div
                  className="card h-100 shadow-sm border-0"
                  onClick={() => abrirVistaRapida(producto)}
                >

                  {producto.descuento && (
                    <div className="card-badge">
                      {producto.descuento}
                    </div>
                  )}

                  {producto.nuevo && (
                    <div className="card-badge badge-nuevo">
                      Nuevo
                    </div>
                  )}

                  <img
                    src={producto.imagen}
                    className="card-img-top p-3 object-fit-contain"
                    height="200"
                    alt={producto.nombre}
                    loading="lazy"
                  />

                  <div className="card-body position-relative d-flex flex-column justify-content-between">
                    <i 
                      className="fa-regular fa-heart favorite-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Inicializar y usar el sistema global de favoritos
                        if (!window.SenabellaFavoritos) {
                          import("../favoritos/favoritos").then(m => m.iniciarFavoritosGlobal());
                        }
                        const esFav = window.SenabellaFavoritos
                          ? window.SenabellaFavoritos.toggleFavorito({
                              nombre: producto.nombre,
                              marca: "SENABELLA",
                              imagen: producto.imagen,
                              precio: producto.precio,
                            })
                          : false;
                        mostrarToast(
                          esFav ? "Agregado a favoritos" : "Eliminado de favoritos",
                          "exito"
                        );
                        e.currentTarget.classList.toggle('fa-regular');
                        e.currentTarget.classList.toggle('fa-solid');
                        e.currentTarget.style.color = e.currentTarget.classList.contains('fa-solid') ? '#e63946' : '';
                      }}
                      title="Agregar a Favoritos"
                    ></i>

                    <div>
                      <h3 className="card-title h6 text-truncate" title={producto.nombre}>
                        {producto.nombre}
                      </h3>

                      <p className="card-text fw-bold text-success">
                        {producto.precio}
                      </p>
                    </div>

                    <button 
                      className="btn-agregar-carrito mt-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.SenabellaCart) {
                          window.SenabellaCart.agregarProducto({
                            nombre: producto.nombre,
                            precioText: producto.precio,
                            img: producto.imagen,
                            cantidad: 1
                          });
                        }
                        mostrarToast(`${producto.nombre} agregado al carrito`, "exito");
                      }}
                    >
                      <i className="fa-solid fa-cart-plus"></i> Añadir al carrito
                    </button>
                  </div>

                </div>

              </div>
            ))}

          </div>
        </section>

        {/* ==========================================
            PROMOCIONES
        ========================================== */}

        <section className="containersg mb-5 seccion-animada">

          <h2 className="h4 mb-3 text-capitalize">
            Lo mejor en promociones
          </h2>

          <div className="row row-cols-2 row-cols-md-4 g-3 promos-grid">

            {promociones.map((promo, index) => (
              <div
                className="col elemento-animado"
                style={{
                  transitionDelay: `${index * 0.06}s`,
                }}
                key={promo.imagen}
              >

                <Link to={promo.ruta}>
                  <img
                    className="img-fluid rounded shadow-sm promo-img"
                    src={promo.imagen}
                    alt={`Promoción especial ${index + 1}`}
                    loading="lazy"
                  />
                </Link>

              </div>
            ))}

          </div>

        </section>

      </main>

      {/* ==========================================
          MODAL VISTA RÁPIDA
      ========================================== */}

      {modalAbierto && productoModal && (

        <div
          className="modal-overlay modal-visible"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              cerrarModal();
            }
          }}
        >

          <div className="modal-contenido">

            <button
              className="modal-cerrar"
              onClick={cerrarModal}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>

            <div className="modal-cuerpo">

              <div className="modal-imagen">

                <img
                  src={productoModal.imagen}
                  alt={productoModal.nombre}
                />

              </div>

              <div className="modal-info">

                <h2 className="modal-nombre">
                  {productoModal.nombre}
                </h2>

                <p className="modal-precio">
                  {productoModal.precio}
                </p>

                <div className="modal-rating">

                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star-half-stroke"></i>

                  <span className="modal-rating-text">
                    4.5 (128 reseñas)
                  </span>

                </div>

                <p className="modal-descripcion">
                  Producto de alta calidad disponible en Senabella.
                  Envío gratis a todo Colombia.
                </p>

                <div className="modal-cantidad">

                  <label>
                    Cantidad:
                  </label>

                  <div className="modal-selector-cantidad">

                    <button
                      onClick={() =>
                        setCantidad((cantidad) =>
                          cantidad > 1 ? cantidad - 1 : 1
                        )
                      }
                    >
                      −
                    </button>

                    <span className="modal-num-cantidad">
                      {cantidad}
                    </span>

                    <button
                      onClick={() =>
                        setCantidad((cantidad) =>
                          cantidad < 20 ? cantidad + 1 : 20
                        )
                      }
                    >
                      +
                    </button>

                  </div>

                </div>

                <div className="modal-acciones">

                  <button
                    className="modal-btn-carrito"
                    onClick={() => {
                      if (window.SenabellaCart) {
                        window.SenabellaCart.agregarProducto({
                          nombre: productoModal.nombre,
                          precioText: productoModal.precio,
                          img: productoModal.imagen,
                          cantidad: cantidad
                        });
                      }
                      mostrarToast(
                        `${productoModal.nombre} agregado al carrito`,
                        "exito"
                      );
                      cerrarModal();
                    }}
                  >
                    <i className="fa-solid fa-cart-plus"></i>
                    Agregar al carrito
                  </button>

                  <button
                    className="modal-btn-comprar"
                    onClick={() => {
                      mostrarToast(
                        "Redirigiendo al checkout",
                        "fa-bolt",
                        "info"
                      );
                      cerrarModal();
                    }}
                  >
                    <i className="fa-solid fa-bolt"></i>
                    Comprar ahora
                  </button>

                </div>

                <div className="modal-beneficios">

                  <div>
                    <i className="fa-solid fa-truck-fast"></i>
                    Envío gratis
                  </div>

                  <div>
                    <i className="fa-solid fa-shield-halved"></i>
                    Compra protegida
                  </div>

                  <div>
                    <i className="fa-solid fa-rotate-left"></i>
                    Devolución gratis
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      )}



      {/* ==========================================
          VOLVER ARRIBA
      ========================================== */}

      <button
        id="btn-volver-arriba"
        className={
          mostrarArriba ? "btn-arriba-visible" : ""
        }
        onClick={() =>
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          })
        }
      >
        <i className="fa-solid fa-arrow-up"></i>
      </button>

    </>
  );
}

export default Inicio;