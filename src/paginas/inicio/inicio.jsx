import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./inicio.css";

const categorias = [
  {
    nombre: "OFERTAS",
    categoria: "ofertas",
    imagen:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSr5trp8CEafbpi6qOXT-FjQ11HqgD7petZxuYnIIeCfA&s=10",
  },
  {
    nombre: "TECNO",
    categoria: "tecno",
    imagen:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlsVX5r-2gPMvY9Y6HJo19zQbHxYIn9izOfNFlfNPc7w&s=10",
  },
  {
    nombre: "MUJER",
    categoria: "mujer",
    imagen:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4j0PMoypc__UeVq6nD4bIh6qFQ4FaGSnEI4GclFl7iw&s=10",
  },
  {
    nombre: "HOMBRE",
    categoria: "hombre",
    imagen:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWwkq93t5FnksulxA2YfZpSKAUiaqGZ7sNWSgR0wOtoQ&s=10",
  },
  {
    nombre: "CALZADO",
    categoria: "calzado",
    imagen:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREmL4kn7HnCXVri8EmYY9FT-MtzgKWj5fhj7F1MvHkRQ&s=10",
  },
];

const productos = [
  {
    nombre: "Cámara digital",
    precio: "$ 1.299.900",
    imagen:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6v1HiWNeKzYFIctvNOkEp9OtNfTmGEj1MNsNhXed1vQ&s=10",
    categoria: "tecno ofertas",
    descuento: "-15%",
  },
  {
    nombre: "PlayStation 4",
    precio: "$ 3.999.900",
    imagen:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSn8UWZ26nTqWpCzbzjgGJU_NAVvXz8R8f0GvMHIz4FdA&s=10",
    categoria: "tecno",
    nuevo: true,
  },
  {
    nombre: "Tableta gráfica digital",
    precio: "$ 2.657.900",
    imagen:
      "https://media.falabella.com/falabellaCO/119583403_01/w=276,h=276,fit=pad",
    categoria: "tecno",
  },
  {
    nombre: "Audifonos Xiaomi Redmi Buds 8 Lite",
    precio: "$107.750",
    imagen:
      "https://media.falabella.com/falabellaCO/155500313_01/w=1200,h=1200,fit=pad",
    categoria: "tecno ofertas",
    descuento: "-30%",
  },
];

const promociones = [
  {
    imagen:
      "https://images.falabella.com/v3/assets/blt088e6fffbba20f16/bltb64adf7df7412925/6a59c7ae3d25ec046fccbe95/powercard16_home_suplementos_desk.jpg?auto=webp&disable=upscale&quality=70&width=1280",
    busqueda: "suplementos",
  },
  {
    imagen:
      "https://images.falabella.com/v3/assets/blt088e6fffbba20f16/bltf413d366cc29e9bf/6a5a7cfd5c7ce2611d2d8c44/powercard10_home_belleza_desk.jpg?auto=webp&disable=upscale&quality=70&width=1280",
    busqueda: "belleza",
  },
  {
    imagen:
      "https://images.falabella.com/v3/assets/blt088e6fffbba20f16/blt5da4c0580b8c656d/6a59c7bf15befe0a433a8a5a/powercard7_home_relojes_desk.jpg?auto=webp&disable=upscale&quality=70&width=1280",
    busqueda: "reloj",
  },
  {
    imagen:
      "https://images.falabella.com/v3/assets/blt088e6fffbba20f16/bltd4a47313d2285f26/6a63ec4398a7f19022344b73/powercard9_home_moda_mujer_desk.jpg?auto=webp&disable=upscale&quality=70&width=1280",
    busqueda: "mujer",
  },
  {
    imagen:
      "https://images.falabella.com/v3/assets/blt088e6fffbba20f16/bltc8501095a0ace138/6a59c7ae1d6cdc171efb0209/powercard14_home_ropa_cama_desk.jpg?auto=webp&disable=upscale&quality=70&width=1280",
    busqueda: "cama",
  },
  {
    imagen:
      "https://images.falabella.com/v3/assets/blt088e6fffbba20f16/blt1626d2cca9a6757c/6a59c7ae1d6cdc852ffb020d/powercard13_home_tablets_desk.jpg?auto=webp&disable=upscale&quality=70&width=1280",
    busqueda: "tablets",
  },
  {
    imagen:
      "https://images.falabella.com/v3/assets/blt088e6fffbba20f16/blt51f7cce65f3e83cd/6a677af55f2918326a139dd0/Imperdible3_home_computador_lenovo_ideapad_cyber_desk.jpg?auto=webp&disable=upscale&quality=70&width=1280",
    busqueda: "lenovo",
  },
  {
    imagen:
      "https://images.falabella.com/v3/assets/blt088e6fffbba20f16/blt008e3e85bf2c1c75/6a675c0cb08d720383bb7b25/Imperdible2_home_electro_tv_samsung_40pul_cyber_desk.jpg?auto=webp&disable=upscale&quality=70&width=1280",
    busqueda: "samsung",
  },
];

const banners = [
  {
    imagen:
      "https://images.falabella.com/v3/assets/blt088e6fffbba20f16/bltbe35baee88cd51d6/6a57c00691d0075f65be69d8/Banner-doble02-landing-mujer-colombia-disena-dto-cyber_desk.png?auto=webp&disable=upscale&quality=70&width=1280",
    ruta: "/catalogo-ropa-accesorios",
  },
  {
    imagen:
      "https://images.falabella.com/v3/assets/blt088e6fffbba20f16/bltc5b14ee48b0288b5/6a57defcade6f5a0546e68e4/Banner-doble02-landing-mujer-imperdibles-accesorios-relojes-MK-price-cyber_desk.png?auto=webp&disable=upscale&quality=70&width=1280",
    ruta: "/catalogo-ropa-accesorios",
  },
  {
    imagen:
      "https://images.falabella.com/v3/assets/blt088e6fffbba20f16/blt0d2994fac24f0fb9/6a29da3fec6a5e4bb177ac7e/bannerdoble07_landing_tecnologia_computadores_mejorestablets_30dcto_desk.jpg?auto=webp&disable=upscale&quality=70&width=1280",
    ruta: "/catalogo",
  },
];

function Inicio() {
  const navigate = useNavigate();

  const [modalProducto, setModalProducto] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [toast, setToast] = useState(null);
  const [bannerActivo, setBannerActivo] = useState(0);
  const [animados, setAnimados] = useState(false);

  useEffect(() => {
    const intervalo = setInterval(() => {
      setBannerActivo((actual) => (actual + 1) % banners.length);
    }, 5000);

    return () => clearInterval(intervalo);
  }, []);

  useEffect(() => {
    const mostrarAnimaciones = () => {
      if (window.scrollY > 50) {
        setAnimados(true);
      }
    };

    window.addEventListener("scroll", mostrarAnimaciones);
    mostrarAnimaciones();

    return () => window.removeEventListener("scroll", mostrarAnimaciones);
  }, []);

  useEffect(() => {
    if (!toast) return;

    const tiempo = setTimeout(() => {
      setToast(null);
    }, 3500);

    return () => clearTimeout(tiempo);
  }, [toast]);

  const mostrarToast = (mensaje, tipo = "exito", icono = "fa-circle-check") => {
    setToast({
      mensaje,
      tipo,
      icono,
    });
  };

  const irCategoria = (categoria) => {
    if (["mujer", "hombre", "calzado"].includes(categoria)) {
      navigate(`/catalogo-ropa-accesorios?categoria=${categoria}`);
    } else {
      navigate(`/catalogo?categoria=${categoria}`);
    }
  };

  const agregarCarrito = (producto, cantidadProducto = 1) => {
    if (window.SenabellaCart) {
      window.SenabellaCart.agregarProducto({
        nombre: producto.nombre,
        marca: "TECNOLOGÍA",
        color: "Estándar",
        precioText: producto.precio,
        img: producto.imagen,
        cantidad: cantidadProducto,
      });
    }

    mostrarToast(
      `${cantidadProducto}x ${producto.nombre} agregado(s) al carrito`,
      "exito",
      "fa-cart-shopping"
    );
  };

  const manejarFavorito = (producto) => {
    if (!window.SenabellaFavoritos) {
      mostrarToast("No se pudo acceder a favoritos", "advertencia", "fa-triangle-exclamation");
      return;
    }

    const esFavorito = window.SenabellaFavoritos.esFavorito(producto.nombre);

    if (esFavorito) {
      window.SenabellaFavoritos.eliminar(producto.nombre);
      mostrarToast("Eliminado de favoritos", "info", "fa-heart-crack");
    } else {
      const resultado = window.SenabellaFavoritos.agregar({
        nombre: producto.nombre,
        marca: "SENABELLA",
        imagen: producto.imagen,
        precioTexto: producto.precio,
        referencia: "SENABELLA",
      });

      if (resultado !== false) {
        mostrarToast("Agregado a favoritos", "exito", "fa-heart");
      }
    }
  };

  const abrirModal = (producto) => {
    setModalProducto(producto);
    setCantidad(1);
    document.body.style.overflow = "hidden";
  };

  const cerrarModal = () => {
    setModalProducto(null);
    document.body.style.overflow = "";
  };

  const irDetalle = (producto) => {
    localStorage.setItem(
      "productoSeleccionado",
      JSON.stringify({
        marca: "TECNOLOGÍA",
        titulo: producto.nombre,
        descripcion:
          producto.nombre +
          " - Excelente opción con garantía oficial Senabella.",
        imagen: producto.imagen,
        precioActual: producto.precio,
        precioAntiguo: "$ 0",
        referencia: "Por SENABELLA",
      })
    );

    navigate("/detalle-producto");
  };

  const manejarPromocion = (busqueda) => {
    if (busqueda === "mujer") {
      navigate("/catalogo-ropa-accesorios?categoria=mujer");
    } else if (busqueda === "tablets") {
      navigate("/catalogo?categoria=tablets");
    } else {
      navigate(`/catalogo?busqueda=${busqueda}`);
    }
  };

  return (
    <>
      <main className="container my-4 inicio-page">

        {/* BANNER DE OFERTA */}
        <section className={`banner-oferta seccion-animada ${animados ? "animado" : ""} mb-4`}>
          <div className="banner-oferta-contenido">
            <div className="banner-oferta-texto">
              <span className="badge-oferta">
                <i className="fa-solid fa-bolt"></i> CYBER OFERTAS
              </span>

              <h2>¡Hasta 70% de descuento en productos seleccionados!</h2>

              <p>Encuentra los mejores precios en Senabella</p>
            </div>

            <button
              className="btn btn-light fw-bold px-4 py-2 text-dark rounded-pill"
              onClick={() => navigate("/catalogo?categoria=ofertas")}
            >
              Ver Ofertas
            </button>
          </div>
        </section>

        {/* CATEGORÍAS */}
        <section
          className={`row row-cols-2 row-cols-sm-3 row-cols-md-5 g-3 text-center mb-4 categorias-inicio seccion-animada ${
            animados ? "animado" : ""
          }`}
        >
          {categorias.map((categoria) => (
            <div className="col" key={categoria.categoria}>
              <div
                className="p-3 border rounded shadow-sm hover-shadow bg-white h-100"
                onClick={() => irCategoria(categoria.categoria)}
              >
                <img
                  src={categoria.imagen}
                  alt={categoria.nombre}
                  className="img-fluid mb-2 rounded categoria-imagen"
                />

                <div className="fw-bold fs-7">{categoria.nombre}</div>
              </div>
            </div>
          ))}
        </section>

        {/* CARRUSEL */}
        <section
          id="bannerCarousel"
          className={`carousel slide mb-5 seccion-animada ${
            animados ? "animado" : ""
          }`}
        >
          <div className="carousel-indicators">
            {banners.map((_, index) => (
              <button
                key={index}
                type="button"
                className={bannerActivo === index ? "active" : ""}
                onClick={() => setBannerActivo(index)}
                aria-label={`Slide ${index + 1}`}
              />
            ))}
          </div>

          <div className="carousel-inner rounded shadow-sm">
            {banners.map((banner, index) => (
              <div
                key={index}
                className={`carousel-item ${
                  bannerActivo === index ? "active" : ""
                }`}
              >
                <img
                  src={banner.imagen}
                  className="d-block w-100"
                  alt={`Promoción Banner ${index + 1}`}
                  onClick={() => navigate(banner.ruta)}
                />
              </div>
            ))}
          </div>

          <button
            className="carousel-control-prev"
            type="button"
            onClick={() =>
              setBannerActivo(
                bannerActivo === 0 ? banners.length - 1 : bannerActivo - 1
              )
            }
          >
            <span className="carousel-control-prev-icon"></span>
            <span className="visually-hidden">Anterior</span>
          </button>

          <button
            className="carousel-control-next"
            type="button"
            onClick={() =>
              setBannerActivo((bannerActivo + 1) % banners.length)
            }
          >
            <span className="carousel-control-next-icon"></span>
            <span className="visually-hidden">Siguiente</span>
          </button>
        </section>

        {/* PRODUCTOS TECNOLÓGICOS */}
        <section
          className={`mb-5 seccion-animada ${
            animados ? "animado" : ""
          }`}
        >
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="h4 m-0">Lo más vendido en tecnología</h2>

            <button
              className="btn btn-outline-primary btn-sm"
              onClick={() => navigate("/catalogo")}
            >
              Ver catálogo completo
            </button>
          </div>

          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-4 g-4 productos-grid">
            {productos.map((producto, index) => (
              <div
                className={`col elemento-animado ${
                  animados ? "animado" : ""
                }`}
                key={producto.nombre}
                style={{ transitionDelay: `${index * 0.06}s` }}
              >
                <div className="card h-100 shadow-sm border-0 producto-card">

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

                  {/* SOLO LA IMAGEN ABRE LA VISTA RÁPIDA */}
                  <img
                    src={producto.imagen}
                    className="card-img-top producto-imagen"
                    alt={producto.nombre}
                    loading="lazy"
                    onClick={() => abrirModal(producto)}
                  />

                  <div className="card-body d-flex flex-column justify-content-between">
                    <div>
                      <h3
                        className="card-title h6 text-truncate"
                        title={producto.nombre}
                      >
                        {producto.nombre}
                      </h3>

                      <p className="card-text fw-bold text-success">
                        {producto.precio}
                      </p>
                    </div>

                    <div className="acciones-producto">
                      <button
                        className="btn-agregar-carrito"
                        onClick={() => agregarCarrito(producto)}
                      >
                        <i className="fa-solid fa-cart-plus"></i>
                        Agregar
                      </button>

                      <button
                        className={`btn-favorito ${
                          window.SenabellaFavoritos?.esFavorito?.(
                            producto.nombre
                          )
                            ? "favorito-activo"
                            : ""
                        }`}
                        onClick={() => manejarFavorito(producto)}
                        aria-label="Agregar a favoritos"
                      >
                        <i
                          className={
                            window.SenabellaFavoritos?.esFavorito?.(
                              producto.nombre
                            )
                              ? "fa-solid fa-heart"
                              : "fa-regular fa-heart"
                          }
                        ></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PROMOCIONES */}
        <section
          className={`containersg mb-5 seccion-animada ${
            animados ? "animado" : ""
          }`}
        >
          <h2 className="h4 mb-3 text-capitalize">
            Lo mejor en promociones
          </h2>

          <div className="row row-cols-2 row-cols-md-4 g-3 promos-grid">
            {promociones.map((promo, index) => (
              <div className="col" key={index}>
                <img
                  className="img-fluid rounded shadow-sm promo-img"
                  src={promo.imagen}
                  alt={`Promoción especial ${index + 1}`}
                  loading="lazy"
                  onClick={() => manejarPromocion(promo.busqueda)}
                />
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* MODAL DE VISTA RÁPIDA */}
      {modalProducto && (
        <div
          className="modal-overlay modal-visible"
          onClick={cerrarModal}
        >
          <div
            className="modal-contenido"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-cerrar"
              onClick={cerrarModal}
              aria-label="Cerrar"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>

            <div className="modal-cuerpo">

              <div className="modal-imagen">
                <img
                  src={modalProducto.imagen}
                  alt={modalProducto.nombre}
                />
              </div>

              <div className="modal-info">

                <h2 className="modal-nombre">
                  {modalProducto.nombre}
                </h2>

                <p className="modal-precio">
                  {modalProducto.precio}
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
                  <label>Cantidad:</label>

                  <div className="modal-selector-cantidad">
                    <button
                      onClick={() =>
                        setCantidad((actual) =>
                          actual > 1 ? actual - 1 : 1
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
                        setCantidad((actual) =>
                          actual < 20 ? actual + 1 : 20
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
                      agregarCarrito(modalProducto, cantidad);
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
                        "info",
                        "fa-bolt"
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

                <button
                  className="modal-ver-detalle"
                  onClick={() => {
                    cerrarModal();
                    irDetalle(modalProducto);
                  }}
                >
                  Ver detalles del producto
                </button>

              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div className="contenedor-toast">
          <div className={`toast-senabella toast-${toast.tipo} toast-visible`}>
            <i className={`fa-solid ${toast.icono}`}></i>

            <span>{toast.mensaje}</span>

            <button
              className="toast-cerrar"
              onClick={() => setToast(null)}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>
      )}

      {/* BOTÓN VOLVER ARRIBA */}
      <button
        id="btn-volver-arriba"
        className={animados ? "btn-arriba-visible" : ""}
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