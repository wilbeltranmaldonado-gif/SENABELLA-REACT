import { useState, useEffect, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import "./encabezado.css";
import { CIUDADES, ENLACES_MENU_MOVIL } from "../../datos";

const EVENTO_CARRITO_ACTUALIZADO = "senabella-cart-actualizado";

// ==========================================
// UTILIDADES GLOBALES (Toast y Carrito)
// ==========================================
// Se exponen en window para mantener compatibilidad con cualquier
// página/script que todavía no esté migrado a React.

function iniciarToastGlobal() {
  if (window.SenabellaToast) return;

  let contenedorToast = document.getElementById("contenedor-toast");
  if (!contenedorToast) {
    contenedorToast = document.createElement("div");
    contenedorToast.id = "contenedor-toast";
    document.body.appendChild(contenedorToast);
  }

  window.SenabellaToast = function (mensaje, icono, tipo) {
    try {
      const toast = document.createElement("div");
      toast.className = "toast-senabella toast-" + (tipo || "exito");
      toast.innerHTML =
        '<i class="fa-solid ' + (icono || "fa-circle-check") + '"></i>' +
        "<span>" + mensaje + "</span>" +
        '<button class="toast-cerrar"><i class="fa-solid fa-xmark"></i></button>';

      contenedorToast.appendChild(toast);
      setTimeout(() => toast.classList.add("toast-visible"), 10);

      toast.querySelector(".toast-cerrar").addEventListener("click", () => {
        toast.classList.remove("toast-visible");
        setTimeout(() => toast.remove(), 300);
      });

      setTimeout(() => {
        toast.classList.remove("toast-visible");
        setTimeout(() => toast.remove(), 300);
      }, 3500);
    } catch (e) {
      console.error("SenabellaToast error:", e);
    }
  };
}

function iniciarCarritoGlobal() {
  if (window.SenabellaCart) return;

  window.SenabellaCart = {
    KEY: "senabella_cart_db",

    obtenerItems() {
      try {
        const datos = localStorage.getItem(this.KEY);
        return datos ? JSON.parse(datos) : [];
      } catch (e) {
        return [];
      }
    },

    guardarItems(items) {
      try {
        localStorage.setItem(this.KEY, JSON.stringify(items));
        this.actualizarBadge();
      } catch (e) {
        console.error("Error al guardar carrito:", e);
      }
    },

    agregarProducto(producto) {
      const items = this.obtenerItems();
      const existente = items.find(
        (item) => item.nombre.trim().toLowerCase() === producto.nombre.trim().toLowerCase()
      );

      if (existente) {
        existente.cantidad = (parseInt(existente.cantidad) || 1) + (parseInt(producto.cantidad) || 1);
        existente.checked = true;
      } else {
        items.push({
          nombre: producto.nombre.trim(),
          marca: producto.marca || "SENABELLA",
          color: producto.color || "Estándar",
          precioText: producto.precioText || "$ 0",
          img: producto.img || "",
          cantidad: parseInt(producto.cantidad) || 1,
          checked: true,
        });
      }

      this.guardarItems(items);
    },

    eliminarProducto(nombre) {
      const items = this.obtenerItems().filter(
        (item) => item.nombre.trim().toLowerCase() !== nombre.trim().toLowerCase()
      );
      this.guardarItems(items);
    },

    limpiarComprados() {
      const items = this.obtenerItems().filter((item) => !item.checked);
      this.guardarItems(items);
    },

    obtenerTotalCantidad() {
      const items = this.obtenerItems();
      return items.reduce((sum, item) => sum + (parseInt(item.cantidad) || 1), 0);
    },

    actualizarBadge() {
      // En vez de tocar el DOM directamente (React lo sobreescribiría),
      // disparamos un evento que el Header escucha para actualizar su estado.
      window.dispatchEvent(new CustomEvent(EVENTO_CARRITO_ACTUALIZADO));
    },
  };
}

// ==========================================
// COMPONENTE HEADER
// ==========================================

export default function Header() {
  const [modoOscuro, setModoOscuro] = useState(false);
  const [ubicacion, setUbicacion] = useState("Ingresa tu ubicación");
  const [menuUbicacionAbierto, setMenuUbicacionAbierto] = useState(false);
  const [menuTarjetasAbierto, setMenuTarjetasAbierto] = useState(false);
  const [menuAyudaAbierto, setMenuAyudaAbierto] = useState(false);
  const [menuMovilAbierto, setMenuMovilAbierto] = useState(false);
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [cantidadCarrito, setCantidadCarrito] = useState(0);
  const [cuenta, setCuenta] = useState({ texto: "Iniciar sesión", href: "login.html" });

  const contenedorUbicacionRef = useRef(null);

  // ------------------------------------------
  // Carga inicial (equivalente al bloque de arriba en el JS original)
  // ------------------------------------------
  useEffect(() => {
    // Modo oscuro
    if (localStorage.getItem("modoOscuro") === "activado") {
      setModoOscuro(true);
      document.body.classList.add("modo-oscuro");
    }

    // Ubicación guardada
    const ubicacionGuardada = localStorage.getItem("ubicacion");
    if (ubicacionGuardada) {
      setUbicacion(ubicacionGuardada);
    }

    // Enlace de cuenta según sesión / rol
    const sesionActiva = localStorage.getItem("senabella_sesion") === "activa";
    const rolUsuario = localStorage.getItem("senabella_rol");

    if (!sesionActiva) {
      setCuenta({ texto: "Iniciar sesión", href: "login.html" });
    } else if (rolUsuario === "administrador") {
      setCuenta({ texto: "Panel Admin", href: "administrador.html" });
    } else {
      setCuenta({ texto: "Mi cuenta", href: "usuario.html" });
    }

    // Sistemas globales (toast y carrito)
    iniciarToastGlobal();
    iniciarCarritoGlobal();
    setCantidadCarrito(window.SenabellaCart.obtenerTotalCantidad());

    // Prellenar buscador si viene un término en la URL
    const urlParams = new URLSearchParams(window.location.search);
    const terminoUrl = urlParams.get("busqueda") || urlParams.get("q");
    if (terminoUrl) {
      setTerminoBusqueda(terminoUrl);
    }
  }, []);

  // ------------------------------------------
  // Escuchar actualizaciones del carrito
  // ------------------------------------------
  useEffect(() => {
    const actualizar = () => setCantidadCarrito(window.SenabellaCart.obtenerTotalCantidad());
    window.addEventListener(EVENTO_CARRITO_ACTUALIZADO, actualizar);
    return () => window.removeEventListener(EVENTO_CARRITO_ACTUALIZADO, actualizar);
  }, []);

  // ------------------------------------------
  // Cerrar dropdown de ubicación al hacer click fuera
  // ------------------------------------------
  useEffect(() => {
    function manejarClickFuera(e) {
      if (contenedorUbicacionRef.current && !contenedorUbicacionRef.current.contains(e.target)) {
        setMenuUbicacionAbierto(false);
      }
    }
    document.addEventListener("click", manejarClickFuera);
    return () => document.removeEventListener("click", manejarClickFuera);
  }, []);

  // ------------------------------------------
  // Cerrar menú móvil con Escape + bloquear scroll cuando está abierto
  // ------------------------------------------
  useEffect(() => {
    function manejarEscape(e) {
      if (e.key === "Escape" && menuMovilAbierto) {
        setMenuMovilAbierto(false);
      }
    }
    document.addEventListener("keydown", manejarEscape);
    document.body.style.overflow = menuMovilAbierto ? "hidden" : "";
    return () => document.removeEventListener("keydown", manejarEscape);
  }, [menuMovilAbierto]);

  // ------------------------------------------
  // MODO OSCURO
  // ------------------------------------------
  const alternarModoOscuro = () => {
    const nuevoEstado = !modoOscuro;
    setModoOscuro(nuevoEstado);

    if (nuevoEstado) {
      document.body.classList.add("modo-oscuro");
      localStorage.setItem("modoOscuro", "activado");
    } else {
      document.body.classList.remove("modo-oscuro");
      localStorage.setItem("modoOscuro", "desactivado");
    }
  };

  // ------------------------------------------
  // UBICACIÓN
  // ------------------------------------------
  const seleccionarCiudad = (ciudad) => {
    setUbicacion(ciudad);
    localStorage.setItem("ubicacion", ciudad);
    setMenuUbicacionAbierto(false);
  };

  // ------------------------------------------
  // BÚSQUEDA
  // ------------------------------------------
  const ejecutarBusqueda = () => {
    const termino = terminoBusqueda.trim();
    const esPaginaCatalogo = window.location.pathname.toLowerCase().endsWith("catalogo.html");

    if (!esPaginaCatalogo) {
      window.location.href = termino
        ? `catalogo.html?busqueda=${encodeURIComponent(termino)}`
        : "catalogo.html";
    } else {
      const url = new URL(window.location.href);
      if (termino) {
        url.searchParams.set("busqueda", termino);
      } else {
        url.searchParams.delete("busqueda");
      }
      window.history.pushState({}, "", url);
      document.dispatchEvent(new CustomEvent("busquedaEjecutada", { detail: termino }));
    }
  };

  const manejarEnterBusqueda = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      ejecutarBusqueda();
    }
  };

  return (
    <>
      <header className="contenido_principal">
        <button
          className="boton-hamburguesa"
          id="boton-hamburguesa"
          aria-label="Abrir menú"
          onClick={(e) => {
            e.stopPropagation();
            setMenuMovilAbierto(true);
          }}
        >
          <i className="fa-solid fa-bars"></i>
        </button>

        <div className="logo">
          <Link to="/">
            <img src="../src/assets/logo.png" alt="Senabella" width="130" height="50" />
          </Link>
        </div>

        <div className="contenedor-busqueda">
          <input
            type="text"
            className="entrada-busqueda"
            placeholder="Buscar en Senabella.com"
            value={terminoBusqueda}
            onChange={(e) => setTerminoBusqueda(e.target.value)}
            onKeyDown={manejarEnterBusqueda}
          />

          <button className="boton-busqueda" onClick={ejecutarBusqueda}>
            <i className="fa-solid fa-magnifying-glass"></i>
          </button>
        </div>

        <button id="theme-toggle" className="btn btn-outline-secondary" onClick={alternarModoOscuro}>
          <i className={`fa-solid ${modoOscuro ? "fa-sun" : "fa-moon"}`}></i>
          <span className="texto-modo">{modoOscuro ? "Modo claro" : "Modo oscuro"}</span>
        </button>

        <div className="acciones-usuario">
          <div className="cuenta-usuario">
            <div className="texto-usuario texto-usuario-bold">
              <a href={cuenta.href} id="enlace-cuenta">
                {cuenta.texto}
              </a>
            </div>
          </div>

          <a href="favoritos.html">
            <i className="fa-regular fa-heart icono-corazon"></i>
          </a>

          <Link to="/carrito" className="icono-carrito">
            <i className="fa-solid fa-cart-shopping"></i>
            <p className="contador-carrito"> {cantidadCarrito} </p>
          </Link>
        </div>
      </header>

      {/* OVERLAY PARA MENÚ MÓVIL */}
      <div
        className={`menu-movil-overlay${menuMovilAbierto ? " overlay-visible" : ""}`}
        id="menu-movil-overlay"
        onClick={() => setMenuMovilAbierto(false)}
      ></div>

      {/* MENÚ LATERAL MÓVIL */}
      <nav className={`menu-movil${menuMovilAbierto ? " menu-movil-abierto" : ""}`} id="menu-movil">
        <div className="menu-movil-cabecera">
          <span className="menu-movil-titulo">Menú</span>
          <button
            className="menu-movil-cerrar"
            id="menu-movil-cerrar"
            aria-label="Cerrar menú"
            onClick={() => setMenuMovilAbierto(false)}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div className="menu-movil-enlaces">
          {ENLACES_MENU_MOVIL.map((enlace) => {
            const isReactRoute = enlace.href.startsWith("/");
            return isReactRoute ? (
              <Link to={enlace.href} key={enlace.href}>
                <i className={enlace.icono}></i> {enlace.texto}
              </Link>
            ) : (
              <a href={enlace.href} key={enlace.href}>
                <i className={enlace.icono}></i> {enlace.texto}
              </a>
            );
          })}
        </div>
      </nav>

      <div className="sub-navegacion">
        <div className="menu-desplegable" ref={contenedorUbicacionRef}>
          <button
            className="boton-ubicacion boton-desplegable"
            id="boton-ubicacion"
            onClick={(e) => {
              e.stopPropagation();
              setMenuUbicacionAbierto(!menuUbicacionAbierto);
            }}
          >
            <i className="fa-solid fa-location-dot"></i>
            <span id="texto-ubicacion">{ubicacion}</span>
            <i className="fa-solid fa-chevron-down"></i>
          </button>

          <div
            className={`contenido-desplegable${menuUbicacionAbierto ? " mostrar" : ""}`}
            id="menu-ubicacion"
            style={{ minWidth: "220px" }}
          >
            {CIUDADES.map((ciudad) => (
              <a
                href="#"
                className="opcion-ciudad"
                key={ciudad}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  seleccionarCiudad(ciudad);
                }}
              >
                {ciudad}
              </a>
            ))}
          </div>
        </div>

        <div className="enlaces-navegacion">
          <NavLink to="/catalogo">Productos Tecnológicos</NavLink>
          <NavLink to="/catalogo-ropa-accesorios">Ropa y Accesorios</NavLink>
    
          {/* TARJETAS Y CUENTAS */}
          <NavLink to="/tarjeta">Tarjeta Senabella</NavLink>

          <NavLink to="/parejas">Parejas</NavLink>

          {/* AYUDA */}
          <div className="menu-desplegable">
            <button
              className={`boton-desplegable${menuAyudaAbierto ? " activo" : ""}`}
              id="boton-ayuda"
              onClick={() => setMenuAyudaAbierto(!menuAyudaAbierto)}
            >
              Ayuda
              <i className="fa-solid fa-chevron-down"></i>
            </button>

            <div
              className={`contenido-desplegable${menuAyudaAbierto ? " mostrar" : ""}`}
              id="menu-ayuda"
            >
              <a href="contacto.html">Contáctanos</a>
              <a href="soporte.html">Soporte</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}