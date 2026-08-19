import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./encabezado.css";

function Encabezado() {

  const navigate = useNavigate();
  const location = useLocation();

  const [modoOscuro, setModoOscuro] = useState(
    localStorage.getItem("modoOscuro") === "activado"
  );

  const [busqueda, setBusqueda] = useState("");

  const [ubicacion, setUbicacion] = useState(
    localStorage.getItem("ubicacion") || "Ingresa tu ubicación"
  );

  const [menuUbicacion, setMenuUbicacion] = useState(false);
  const [menuTarjetas, setMenuTarjetas] = useState(false);
  const [menuAyuda, setMenuAyuda] = useState(false);
  const [menuMovil, setMenuMovil] = useState(false);

  const [carrito, setCarrito] = useState(0);


  // ==========================================
  // MODO OSCURO
  // ==========================================

  useEffect(() => {

    if (modoOscuro) {
      document.body.classList.add("modo-oscuro");
      localStorage.setItem("modoOscuro", "activado");
    } else {
      document.body.classList.remove("modo-oscuro");
      localStorage.setItem("modoOscuro", "desactivado");
    }

  }, [modoOscuro]);


  // ==========================================
  // CARGAR CANTIDAD DEL CARRITO
  // ==========================================

  useEffect(() => {

    try {

      const datos = localStorage.getItem("senabella_cart_db");

      if (datos) {

        const productos = JSON.parse(datos);

        const total = productos.reduce(
          (suma, producto) =>
            suma + (parseInt(producto.cantidad) || 1),
          0
        );

        setCarrito(total);

      } else {

        setCarrito(0);

      }

    } catch (error) {

      setCarrito(0);

    }

  }, [location]);


  // ==========================================
  // CARGAR BÚSQUEDA DE LA URL
  // ==========================================

  useEffect(() => {

    const parametros = new URLSearchParams(location.search);

    const termino = parametros.get("busqueda") || "";

    setBusqueda(termino);

  }, [location.search]);


  // ==========================================
  // BUSCADOR
  // ==========================================

  function ejecutarBusqueda() {

    const termino = busqueda.trim();

    if (termino === "") {
      navigate("/catalogo");
      return;
    }

    navigate(
      `/catalogo?busqueda=${encodeURIComponent(termino)}`
    );

  }


  function manejarTecla(e) {

    if (e.key === "Enter") {
      e.preventDefault();
      ejecutarBusqueda();
    }

  }


  // ==========================================
  // UBICACIÓN
  // ==========================================

  function seleccionarCiudad(ciudad) {

    setUbicacion(ciudad);

    localStorage.setItem("ubicacion", ciudad);

    setMenuUbicacion(false);

  }


  // ==========================================
  // CERRAR MENÚS
  // ==========================================

  function cerrarMenus() {

    setMenuUbicacion(false);
    setMenuTarjetas(false);
    setMenuAyuda(false);

  }


  return (

    <>

      {/* =====================================
          HEADER PRINCIPAL
      ====================================== */}

      <header className="contenido_principal">

        {/* BOTÓN HAMBURGUESA */}

        <button
          className="boton-hamburguesa"
          onClick={() => setMenuMovil(true)}
          aria-label="Abrir menú"
        >

          <i className="fa-solid fa-bars"></i>

        </button>


        {/* =================================
            LOGO
        ================================== */}

        <div className="logo">

          <Link to="/">

            <img
              src="/assets/logo.png"
              alt="Senabella"
              width="130"
              height="50"
            />

          </Link>

        </div>


        {/* =================================
            BUSCADOR
        ================================== */}

        <div className="contenedor-busqueda">

          <input
            type="text"
            className="entrada-busqueda"
            placeholder="Buscar en Senabella.com"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            onKeyDown={manejarTecla}
          />

          <button
            className="boton-busqueda"
            onClick={ejecutarBusqueda}
            type="button"
          >

            <i className="fa-solid fa-magnifying-glass"></i>

          </button>

        </div>


        {/* =================================
            MODO OSCURO
        ================================== */}

        <button
          id="theme-toggle"
          className="btn btn-outline-secondary"
          onClick={() => setModoOscuro(!modoOscuro)}
          type="button"
        >

          <i
            className={
              modoOscuro
                ? "fa-solid fa-sun"
                : "fa-solid fa-moon"
            }
          ></i>

          <span className="texto-modo">

            {modoOscuro
              ? "Modo claro"
              : "Modo oscuro"}

          </span>

        </button>


        {/* =================================
            ACCIONES USUARIO
        ================================== */}

        <div className="acciones-usuario">

          {/* CUENTA */}

          <div className="cuenta-usuario">

            <div className="texto-usuario texto-usuario-bold">

              <Link
                to="/login"
                id="enlace-cuenta"
              >
                Iniciar sesión
              </Link>

            </div>

          </div>


          {/* FAVORITOS */}

          <Link to="/favoritos">

            <i className="fa-regular fa-heart icono-corazon"></i>

          </Link>


          {/* CARRITO */}

          <Link
            to="/carrito"
            className="icono-carrito"
          >

            <i className="fa-solid fa-cart-shopping"></i>

            <p className="contador-carrito">
              {carrito}
            </p>

          </Link>

        </div>

      </header>


      {/* =====================================
          OVERLAY MENÚ MÓVIL
      ====================================== */}

      {menuMovil && (

        <div
          className="menu-movil-overlay overlay-visible"
          onClick={() => setMenuMovil(false)}
        ></div>

      )}


      {/* =====================================
          MENÚ MÓVIL
      ====================================== */}

      <nav
        className={
          menuMovil
            ? "menu-movil menu-movil-abierto"
            : "menu-movil"
        }
      >

        <div className="menu-movil-cabecera">

          <span className="menu-movil-titulo">
            Menú
          </span>

          <button
            className="menu-movil-cerrar"
            onClick={() => setMenuMovil(false)}
            type="button"
          >

            <i className="fa-solid fa-xmark"></i>

          </button>

        </div>


        <div className="menu-movil-enlaces">

          <Link
            to="/"
            onClick={() => setMenuMovil(false)}
          >

            <i className="fa-solid fa-house"></i>

            Inicio

          </Link>


          <Link
            to="/catalogo"
            onClick={() => setMenuMovil(false)}
          >

            <i className="fa-solid fa-microchip"></i>

            Productos Tecnológicos

          </Link>

        </div>

      </nav>


      {/* =====================================
          SUB NAVEGACIÓN
      ====================================== */}

      <div className="sub-navegacion">


        {/* =================================
            UBICACIÓN
        ================================== */}

        <div className="menu-desplegable">

          <button
            className="boton-ubicacion boton-desplegable"
            onClick={(e) => {

              e.stopPropagation();

              setMenuUbicacion(!menuUbicacion);
              setMenuTarjetas(false);
              setMenuAyuda(false);

            }}
            type="button"
          >

            <i className="fa-solid fa-location-dot"></i>

            <span>
              {ubicacion}
            </span>

            <i className="fa-solid fa-chevron-down"></i>

          </button>


          {menuUbicacion && (

            <div
              className="contenido-desplegable mostrar"
              style={{ minWidth: "220px" }}
            >

              {[
                "Bogotá",
                "Medellín",
                "Cali",
                "Barranquilla",
                "Cartagena",
                "Bucaramanga",
                "Pereira",
                "Manizales",
                "Santa Marta",
                "Cúcuta",
                "Villavicencio",
                "Ibagué"
              ].map((ciudad) => (

                <a
                  href="#"
                  key={ciudad}
                  onClick={(e) => {

                    e.preventDefault();

                    seleccionarCiudad(ciudad);

                  }}
                >

                  {ciudad}

                </a>

              ))}

            </div>

          )}

        </div>


        {/* =================================
            ENLACES DE NAVEGACIÓN
        ================================== */}

        <div className="enlaces-navegacion">


          {/* PRODUCTOS TECNOLÓGICOS */}

          <Link to="/catalogo">

            Productos Tecnológicos

          </Link>


          {/* =================================
              TARJETAS Y CUENTAS
          ================================== */}

          <div className="menu-desplegable">

            <button
              className="boton-desplegable"
              onClick={() => {

                setMenuTarjetas(!menuTarjetas);
                setMenuAyuda(false);

              }}
              type="button"
            >

              Tarjetas y cuentas

              <i className="fa-solid fa-chevron-down"></i>

            </button>


            {menuTarjetas && (

              <div className="contenido-desplegable mostrar">

                <Link to="/tarjetas">

                  Tarjetas

                </Link>

              </div>

            )}

          </div>


          {/* =================================
              PAREJAS
          ================================== */}

          <Link to="/parejas">

            Parejas

          </Link>


          {/* =================================
              AYUDA
          ================================== */}

          <div className="menu-desplegable">

            <button
              className="boton-desplegable"
              onClick={() => {

                setMenuAyuda(!menuAyuda);
                setMenuTarjetas(false);

              }}
              type="button"
            >

              Ayuda

              <i className="fa-solid fa-chevron-down"></i>

            </button>


            {menuAyuda && (

              <div
                className="contenido-desplegable mostrar"
                id="menu-ayuda"
              >

                <Link to="/contacto">

                  Contáctanos

                </Link>

                <Link to="/soporte">

                  Soporte

                </Link>

              </div>

            )}

          </div>

        </div>

      </div>

    </>

  );

}

export default Encabezado;