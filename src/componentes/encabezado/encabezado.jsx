// Este componente renderiza el encabezado principal, el menú y los accesos rápidos del usuario.

import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "./encabezado.css";
import { ENLACES_MENU_MOVIL } from "../../datos";
import { iniciarFavoritosGlobal } from "../../paginas/favoritos/favoritos";
import { obtenerStockDeProducto } from "../../utilidades/inventario";
import { esBusquedaDeRopa } from "../../utilidades/busqueda";

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
        '<i class="fa-solid ' +
        (icono || "fa-circle-check") +
        '"></i>' +
        "<span>" +
        mensaje +
        "</span>" +
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
      } catch {
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
      const stockMaximo = obtenerStockDeProducto(producto.nombre);
      if (stockMaximo <= 0) {
        if (window.SenabellaToast) {
          window.SenabellaToast(
            `"${producto.nombre}" está agotado en inventario`,
            "fa-triangle-exclamation",
            "error",
          );
        }
        return false;
      }

      const items = this.obtenerItems();
      const existente = items.find(
        (item) =>
          item.nombre.trim().toLowerCase() ===
          producto.nombre.trim().toLowerCase(),
      );

      if (existente) {
        const cantidadSolicitada = parseInt(producto.cantidad) || 1;
        const cantidadActual = parseInt(existente.cantidad) || 1;
        if (cantidadActual >= stockMaximo) {
          if (window.SenabellaToast) {
            window.SenabellaToast(
              `Máximo alcanzado: Solo hay ${stockMaximo} unidad(es) de "${producto.nombre}"`,
              "fa-circle-info",
              "advertencia",
            );
          }
          return false;
        }
        existente.cantidad = Math.min(
          stockMaximo,
          cantidadActual + cantidadSolicitada,
        );
        existente.checked = true;
      } else {
        items.push({
          nombre: producto.nombre.trim(),
          marca: producto.marca || "SENABELLA",
          color: producto.color || "Estándar",
          precioText: producto.precioText || "$ 0",
          img: producto.img || "",
          cantidad: Math.min(stockMaximo, parseInt(producto.cantidad) || 1),
          checked: true,
        });
      }

      this.guardarItems(items);
      return true;
    },

    eliminarProducto(nombre) {
      const items = this.obtenerItems().filter(
        (item) =>
          item.nombre.trim().toLowerCase() !== nombre.trim().toLowerCase(),
      );
      this.guardarItems(items);
    },

    limpiarComprados() {
      const items = this.obtenerItems().filter((item) => !item.checked);
      this.guardarItems(items);
    },

    obtenerTotalCantidad() {
      const items = this.obtenerItems();
      return items.reduce(
        (sum, item) => sum + (parseInt(item.cantidad) || 1),
        0,
      );
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
  const [ubicacion, setUbicacion] = useState("Ciudad");
  const [menuAyudaAbierto, setMenuAyudaAbierto] = useState(false);
  const [menuMovilAbierto, setMenuMovilAbierto] = useState(false);
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [cantidadCarrito, setCantidadCarrito] = useState(0);
  const [cantidadFavoritos, setCantidadFavoritos] = useState(0);
  const [cuenta, setCuenta] = useState({
    texto: "Iniciar sesión",
    href: "/login",
    isReact: true,
  });
  const navigate = useNavigate();


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
    let ubicacionGuardada = localStorage.getItem("ubicacion");
    if (!ubicacionGuardada) {
      try {
        const user = JSON.parse(localStorage.getItem("senabella_usuario"));
        if (user && user.ciudad) {
          ubicacionGuardada = user.ciudad;
          localStorage.setItem("ubicacion", user.ciudad);
        }
      } catch (e) {
        console.error(e);
      }
    }
    if (ubicacionGuardada) {
      setUbicacion(ubicacionGuardada);
    } else {
      setUbicacion("Ciudad");
    }

    // Enlace de cuenta según sesión / rol
    const sesionActiva = localStorage.getItem("senabella_sesion") === "activa";
    const rolUsuario = localStorage.getItem("senabella_rol");

    if (!sesionActiva) {
      setCuenta({ texto: "Iniciar sesión", href: "/login", isReact: true });
    } else if (rolUsuario === "administrador") {
      setCuenta({
        texto: "Panel Admin",
        href: "/administrador",
        isReact: true,
      });
    } else {
      setCuenta({ texto: "Mi cuenta", href: "/usuario", isReact: true });
    }

    // Sistemas globales (toast y carrito)
    iniciarToastGlobal();
    iniciarCarritoGlobal();
    setCantidadCarrito(window.SenabellaCart.obtenerTotalCantidad());
    iniciarFavoritosGlobal();
    setCantidadFavoritos(window.SenabellaFavoritos.obtenerLista().length);

    // Prellenar buscador si viene un término en la URL
    const urlParams = new URLSearchParams(window.location.search);
    const terminoUrl = urlParams.get("busqueda") || urlParams.get("q");
    if (terminoUrl) {
      setTerminoBusqueda(terminoUrl);
    }
  }, []);

  useEffect(() => {
    const actualizarFavoritos = () => {
      setCantidadFavoritos(
        window.SenabellaFavoritos?.obtenerLista().length || 0,
      );
    };
    window.addEventListener(
      "senabella-favoritos-actualizado",
      actualizarFavoritos,
    );
    return () =>
      window.removeEventListener(
        "senabella-favoritos-actualizado",
        actualizarFavoritos,
      );
  }, []);

  useEffect(() => {
    const actualizarUbicacion = () => {
      let ubicacionGuardada = localStorage.getItem("ubicacion");
      try {
        const user = JSON.parse(localStorage.getItem("senabella_usuario"));
        if (user && user.ciudad) {
          ubicacionGuardada = user.ciudad;
        }
      } catch (e) {
        console.error(e);
      }
      if (ubicacionGuardada) {
        setUbicacion(ubicacionGuardada);
      } else {
        setUbicacion("Ciudad");
      }
    };

    actualizarUbicacion();
    window.addEventListener("storage", actualizarUbicacion);
    window.addEventListener(
      "senabella_ubicacion_actualizada",
      actualizarUbicacion,
    );
    window.addEventListener(
      "senabella-ubicacion-actualizada",
      actualizarUbicacion,
    );
    return () => {
      window.removeEventListener("storage", actualizarUbicacion);
      window.removeEventListener(
        "senabella_ubicacion_actualizada",
        actualizarUbicacion,
      );
      window.removeEventListener(
        "senabella-ubicacion-actualizada",
        actualizarUbicacion,
      );
    };
  }, []);

  // ------------------------------------------
  // Escuchar actualizaciones del carrito
  // ------------------------------------------
  useEffect(() => {
    const actualizar = () =>
      setCantidadCarrito(window.SenabellaCart.obtenerTotalCantidad());
    window.addEventListener(EVENTO_CARRITO_ACTUALIZADO, actualizar);
    return () =>
      window.removeEventListener(EVENTO_CARRITO_ACTUALIZADO, actualizar);
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
  // ------------------------------------------
  // BÚSQUEDA
  // ------------------------------------------
  const ejecutarBusqueda = () => {
    const termino = terminoBusqueda.trim();
    if (!termino) {
      const rutaActual = window.location.pathname.toLowerCase();
      if (rutaActual.includes("/catalogo-ropa-accesorios")) {
        navigate("/catalogo-ropa-accesorios");
      } else {
        navigate("/catalogo");
      }
      return;
    }

    const destino = esBusquedaDeRopa(termino)
      ? "/catalogo-ropa-accesorios"
      : "/catalogo";

    navigate(`${destino}?busqueda=${encodeURIComponent(termino)}`);
  };

  const manejarEnterBusqueda = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      ejecutarBusqueda();
    }
  };

  return (
    <>
      <header className='contenido_principal'>
        <button
          className='boton-hamburguesa'
          id='boton-hamburguesa'
          aria-label='Abrir menú'
          onClick={(e) => {
            e.stopPropagation();
            setMenuMovilAbierto(true);
          }}
        >
          <i className='fa-solid fa-bars'></i>
        </button>

        <div className='logo'>
          <Link to='/'>
            <img
              src='../src/assets/logo.png'
              alt='Senabella'
              width='130'
              height='50'
            />
          </Link>
        </div>

        <div className='contenedor-busqueda'>
          <input
            type='text'
            className='entrada-busqueda'
            placeholder='Buscar en Senabella.com'
            value={terminoBusqueda}
            onChange={(e) => setTerminoBusqueda(e.target.value)}
            onKeyDown={manejarEnterBusqueda}
          />

          <button className='boton-busqueda' onClick={ejecutarBusqueda}>
            <i className='fa-solid fa-magnifying-glass'></i>
          </button>
        </div>

        <button
          id='theme-toggle'
          className='btn btn-outline-secondary'
          onClick={alternarModoOscuro}
        >
          <i className={`fa-solid ${modoOscuro ? "fa-sun" : "fa-moon"}`}></i>
          <span className='texto-modo'>
            {modoOscuro ? "Modo claro" : "Modo oscuro"}
          </span>
        </button>

        <div className='acciones-usuario'>
          <div className='cuenta-usuario'>
            <div className='texto-usuario texto-usuario-bold'>
              {cuenta.isReact ? (
                <Link to={cuenta.href} id='enlace-cuenta'>
                  {cuenta.texto}
                </Link>
              ) : (
                <a href={cuenta.href} id='enlace-cuenta'>
                  {cuenta.texto}
                </a>
              )}
            </div>
          </div>

          <Link
            to='/favoritos'
            className={`icono-favoritos${cantidadFavoritos > 0 ? " favoritos-con-productos" : ""}`}
            aria-label={`Favoritos: ${cantidadFavoritos} productos`}
          >
            <i
              className={`${cantidadFavoritos > 0 ? "fa-solid" : "fa-regular"} fa-heart icono-corazon`}
            ></i>
            {cantidadFavoritos > 0 && (
              <span className='contador-favoritos'>{cantidadFavoritos}</span>
            )}
          </Link>

          <Link to='/carrito' className='icono-carrito'>
            <i className='fa-solid fa-cart-shopping'></i>
            <p className='contador-carrito'> {cantidadCarrito} </p>
          </Link>
        </div>
      </header>

      {/* OVERLAY PARA MENÚ MÓVIL */}
      <div
        className={`menu-movil-overlay${menuMovilAbierto ? " overlay-visible" : ""}`}
        id='menu-movil-overlay'
        onClick={() => setMenuMovilAbierto(false)}
      ></div>

      {/* MENÚ LATERAL MÓVIL */}
      <nav
        className={`menu-movil${menuMovilAbierto ? " menu-movil-abierto" : ""}`}
        id='menu-movil'
      >
        <div className='menu-movil-cabecera'>
          <span className='menu-movil-titulo'>Menú</span>
          <button
            className='menu-movil-cerrar'
            id='menu-movil-cerrar'
            aria-label='Cerrar menú'
            onClick={() => setMenuMovilAbierto(false)}
          >
            <i className='fa-solid fa-xmark'></i>
          </button>
        </div>
        <div className='menu-movil-enlaces'>
          {ENLACES_MENU_MOVIL.map((enlace) => {
            const isReactRoute = enlace.href.startsWith("/");
            const esEnlaceFavoritos = enlace.texto === "Favoritos";
            const contenidoEnlace = (
              <>
                <i
                  className={`${esEnlaceFavoritos && cantidadFavoritos > 0 ? "fa-solid fa-heart favoritos-movil-con-productos" : enlace.icono}`}
                ></i>
                {enlace.texto}
                {esEnlaceFavoritos && cantidadFavoritos > 0 && (
                  <span className='contador-favoritos contador-favoritos-movil'>
                    {cantidadFavoritos}
                  </span>
                )}
              </>
            );

            if (esEnlaceFavoritos) {
              return (
                <Link
                  to='/favoritos'
                  key={enlace.href}
                  className='enlace-favoritos-movil'
                  aria-label={`Favoritos: ${cantidadFavoritos} productos`}
                >
                  {contenidoEnlace}
                </Link>
              );
            }

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

      <div className='sub-navegacion'>
        <div className='indicador-ubicacion'>
          <i className='fa-solid fa-location-dot'></i>
          <span id='texto-ubicacion'>{ubicacion}</span>
        </div>

        <div className='enlaces-navegacion'>
          <NavLink to='/catalogo'>Productos Tecnológicos</NavLink>
          <NavLink to='/catalogo-ropa-accesorios'>Ropa y Accesorios</NavLink>

          {/* TARJETAS Y CUENTAS */}
          <NavLink to='/tarjeta'>Tarjeta Senabella</NavLink>

          <NavLink to='/parejas'>Parejas</NavLink>

          {/* AYUDA */}
          <div className='menu-desplegable'>
            <button
              className={`boton-desplegable${menuAyudaAbierto ? " activo" : ""}`}
              id='boton-ayuda'
              onClick={() => setMenuAyudaAbierto(!menuAyudaAbierto)}
            >
              Ayuda
              <i className='fa-solid fa-chevron-down'></i>
            </button>

            <div
              className={`contenido-desplegable${menuAyudaAbierto ? " mostrar" : ""}`}
              id='menu-ayuda'
            >
              <NavLink
                to='/contacto'
                onClick={() => setMenuAyudaAbierto(false)}
              >
                Contáctanos
              </NavLink>
              <NavLink to='/soporte' onClick={() => setMenuAyudaAbierto(false)}>
                Soporte
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
