import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./inicio.css";

function Inicio() {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [productoModal, setProductoModal] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [toast, setToast] = useState(null);
  const [mostrarArriba, setMostrarArriba] = useState(false);

  // ==========================================
  // PRODUCTOS
  // ==========================================

  const productos = [
    {
      nombre: "Cámara digital",
      precio: "$ 1.299.900",
      imagen:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6v1HiWNeKzYFIctVnOkEp9OtNfTmGEj1MNsNhXed1vQ&s=10",
      descuento: "-15%",
      categoria: "tecno",
    },
    {
      nombre: "PlayStation 4",
      precio: "$ 3.999.900",
      imagen:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSn8UWZ26nTqWpCzbzjgGJU_NAVvXz8R8f0GvMHIz4FdA&s=10",
      nuevo: true,
      categoria: "tecno",
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
      descuento: "-30%",
      categoria: "tecno",
    },
  ];

  const categorias = [
    {
      nombre: "OFERTAS",
      categoria: "ofertas",
      imagen:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSr5trp8CEafbpi6qOXT-FjQ11HqgD7petZxuYnIIeCfA&s=10",
      ruta: "/catalogo?categoria=ofertas",
    },
    {
      nombre: "TECNO",
      categoria: "tecno",
      imagen:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlsVX5r-2gPMvY9Y6HJo19zqBHxYIn9izOfNFlfNPc7w&s=10",
      ruta: "/catalogo?categoria=tecno",
    },
    {
      nombre: "MUJER",
      categoria: "mujer",
      imagen:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4j0PMoypc__UeVq6nD4bIh6qFQ4FaGSnEI4GclFl7iw&s=10",
      ruta: "/catalogo-ropa-accesorios?categoria=mujer",
    },
    {
      nombre: "HOMBRE",
      categoria: "hombre",
      imagen:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWwkq93t5FnksulxA2YfZpSKAUiaqGZ7sNWSgR0wOtoQ&s=10",
      ruta: "/catalogo-ropa-accesorios?categoria=hombre",
    },
    {
      nombre: "CALZADO",
      categoria: "calzado",
      imagen:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREmL4kn7HnCXVri8EmYY9FT-MtzgKWj5fhj7F1MvHkRQ&s=10",
      ruta: "/catalogo-ropa-accesorios?categoria=calzado",
    },
  ];

  const promociones = [
    {
      imagen:
        "https://images.falabella.com/v3/assets/blt088e6fffbba20f16/bltb64adf7df7412925/6a59c7ae3d25ec046fccbe95/powercard16_home_suplementos_desk.jpg?auto=webp&disable=upscale&quality=70&width=1280",
      ruta: "/catalogo?busqueda=suplementos",
    },
    {
      imagen:
        "https://images.falabella.com/v3/assets/blt088e6fffbba20f16/bltf413d366cc29e9bf/6a5a7cfd5c7ce2611d2d8c44/powercard10_home_belleza_desk.jpg?auto=webp&disable=upscale&quality=70&width=1280",
      ruta: "/catalogo?busqueda=belleza",
    },
    {
      imagen:
        "https://images.falabella.com/v3/assets/blt088e6fffbba20f16/blt5da4c0580b8c656d/6a59c7bf15befe0a433a8a5a/powercard7_home_relojes_desk.jpg?auto=webp&disable=upscale&quality=70&width=1280",
      ruta: "/catalogo?busqueda=reloj",
    },
    {
      imagen:
        "https://images.falabella.com/v3/assets/blt088e6fffbba20f16/bltd4a47313d2285f26/6a63ec4398a7f19022344b73/powercard9_home_moda_mujer_desk.jpg?auto=webp&disable=upscale&quality=70&width=1280",
      ruta: "/catalogo-ropa-accesorios?categoria=mujer",
    },
    {
      imagen:
        "https://images.falabella.com/v3/assets/blt088e6fffbba20f16/bltc8501095a0ace138/6a59c7ae1d6cdc171efb0209/powercard14_home_ropa_cama_desk.jpg?auto=webp&disable=upscale&quality=70&width=1280",
      ruta: "/catalogo?busqueda=cama",
    },
    {
      imagen:
        "https://images.falabella.com/v3/assets/blt088e6fffbba20f16/blt1626d2cca9a6757c/6a59c7ae1d6cdc852ffb020d/powercard13_home_tablets_desk.jpg?auto=webp&disable=upscale&quality=70&width=1280",
      ruta: "/catalogo?categoria=tablets",
    },
    {
      imagen:
        "https://images.falabella.com/v3/assets/blt088e6fffbba20f16/blt51f7cce65f3e83cd/6a677af55f2918326a139dd0/Imperdible3_home_computador_lenovo_ideapad_cyber_desk.jpg?auto=webp&disable=upscale&quality=70&width=1280",
      ruta: "/catalogo?busqueda=lenovo",
    },
    {
      imagen:
        "https://images.falabella.com/v3/assets/blt088e6fffbba20f16/blt008e3e85bf2c1c75/6a675c0cb08d720383bb7b25/Imperdible2_home_electro_tv_samsung_40pul_cyber_desk.jpg?auto=webp&disable=upscale&quality=70&width=1280",
      ruta: "/catalogo?busqueda=samsung",
    },
  ];

  // ==========================================
  // TOAST
  // ==========================================

  const mostrarToast = (mensaje, tipo = "exito") => {
    setToast({ mensaje, tipo });

    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // ==========================================
  // MODAL
  // ==========================================

  const abrirVistaRapida = (producto) => {
    setProductoModal(producto);
    setCantidad(1);
    setModalAbierto(true);
    document.body.style.overflow = "hidden";
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

  const banners = [
    "https://images.falabella.com/v3/assets/blt088e6fffbba20f16/bltbe35baee88cd51d6/6a57c00691d0075f65be69d8/Banner-doble02-landing-mujer-colombia-disena-dto-cyber_desk.png?auto=webp&disable=upscale&quality=70&width=1280",
    "https://images.falabella.com/v3/assets/blt088e6fffbba20f16/bltc5b14ee48b0288b5/6a57defcade6f5a0546e68e4/Banner-doble02-landing-mujer-imperdibles-accesorios-relojes-MK-price-cyber_desk.png?auto=webp&disable=upscale&quality=70&width=1280",
    "https://images.falabella.com/v3/assets/blt088e6fffbba20f16/blt0d2994fac24f0fb9/6a29da3fec6a5e4bb177ac7e/bannerdoble07_landing_tecnologia_computadores_mejorestablets_30dcto_desk.jpg?auto=webp&disable=upscale&quality=70&width=1280",
  ];

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

                  <div className="card-body">

                    <h3 className="card-title h6">
                      {producto.nombre}
                    </h3>

                    <p className="card-text fw-bold text-success">
                      {producto.precio}
                    </p>

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
          TOAST
      ========================================== */}

      {toast && (
        <div className={`toast-senabella toast-${toast.tipo} toast-visible`}>

          <i
            className={`fa-solid ${
              toast.tipo === "info"
                ? "fa-circle-info"
                : toast.tipo === "advertencia"
                ? "fa-triangle-exclamation"
                : "fa-circle-check"
            }`}
          ></i>

          <span>
            {toast.mensaje}
          </span>

          <button onClick={() => setToast(null)}>
            <i className="fa-solid fa-xmark"></i>
          </button>

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