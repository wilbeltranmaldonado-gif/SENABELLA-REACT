// =============================================================================
// COMPONENTE PRINCIPAL: PANEL DE ADMINISTRADOR (SENABELLA)
// -----------------------------------------------------------------------------
// Este componente actúa como el "esqueleto" o contenedor maestro del panel de control.
// Controla:
// 1. La barra lateral de navegación (Sidebar) para cambiar entre secciones/vistas.
// 2. La barra superior (Topbar) con modo oscuro y campana de notificaciones.
// 3. El estado de la sesión y el modal de confirmación para cerrar sesión.
// 4. El renderizado dinámico de la vista seleccionada (Resumen, Pedidos, Productos, etc.)
// =============================================================================

import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { obtenerPedidosAdmin } from "../../datos";
import "./administrador.css";
import "./encabezado.css";

// --- IMPORTACIÓN DE TODAS LAS VISTAS DISPONIBLES EN EL PANEL ---
import Resumen from "./vistas/resumen";
import Pedidos from "./vistas/pedidos";
import Productos from "./vistas/productos";
import Clientes from "./vistas/clientes";
import Categorias from "./vistas/categorias";
import Proveedores from "./vistas/proveedores";
import Usuarios from "./vistas/usuarios";
import Reportes from "./vistas/reportes";
import Configuracion from "./vistas/configuracion";

/**
 * Función auxiliar: Revisa el stock y pedidos para generar alertas automáticas
 * (por ejemplo: si un producto tiene poco inventario o hay compras pendientes de atención).
 */
function obtenerNotificaciones() {
  try {
    const productos = JSON.parse(
      localStorage.getItem("senabella_admin_products") || "[]",
    );
    const pedidos = obtenerPedidosAdmin();
    // Contamos productos con stock bajo (entre 1 y 10 unidades)
    const stockBajo = productos.filter(
      (producto) => Number(producto.stock) > 0 && Number(producto.stock) <= 10,
    ).length;
    // Contamos pedidos que están esperando atención
    const pedidosPendientes = pedidos.filter((pedido) =>
      ["pendiente", "pendiente-verificacion", "procesando"].includes(
        pedido.estado,
      ),
    ).length;
    // Retornamos la lista de alertas formateadas con sus íconos y textos
    return [
      ...(stockBajo
        ? [
            {
              id: "stockBajo",
              icono: "fa-triangle-exclamation",
              clase: "texto-warning",
              titulo: "Stock bajo",
              texto: `${stockBajo} producto${stockBajo === 1 ? "" : "s"} necesita${stockBajo === 1 ? "" : "n"} reposición.`,
              vista: "productos",
            },
          ]
        : []),
      ...(pedidosPendientes
        ? [
            {
              id: "pedidoNuevo",
              icono: "fa-cart-shopping",
              clase: "texto-info",
              titulo: "Pedidos pendientes",
              texto: `${pedidosPendientes} pedido${pedidosPendientes === 1 ? "" : "s"} requiere${pedidosPendientes === 1 ? "" : "n"} atención.`,
              vista: "pedidos",
            },
          ]
        : []),
    ];
  } catch {
    return [];
  }
}

/**
 * Función auxiliar: Cuenta la cantidad de registros en cada módulo
 * para mostrar las insignias (badges con números) en el menú lateral.
 */
function calcularCantidadesSidebar() {
  let pedidos = 0;
  let productos = 0;
  let clientes = 0;
  let categorias = 0;
  let proveedores = 0;
  let usuarios = 0;

  try {
    pedidos = obtenerPedidosAdmin().length;
  } catch {
    pedidos = 0;
  }

  try {
    const prodsGuardados = JSON.parse(
      localStorage.getItem("senabella_admin_products") || "null",
    );
    if (Array.isArray(prodsGuardados) && prodsGuardados.length > 0) {
      productos = prodsGuardados.length;
    } else {
      productos = 15;
    }
  } catch {
    productos = 15;
  }

  try {
    const usrs = JSON.parse(localStorage.getItem("senabella_usuarios") || "[]");
    const noAdmin = usrs.filter((u) => u.rol !== "administrador");
    clientes = noAdmin.length > 0 ? noAdmin.length : 3;
    usuarios = usrs.length > 0 ? usrs.length : 4;
  } catch {
    clientes = 3;
    usuarios = 4;
  }

  try {
    const cats = JSON.parse(
      localStorage.getItem("senabella_categories") || "null",
    );
    categorias = Array.isArray(cats) && cats.length > 0 ? cats.length : 5;
  } catch {
    categorias = 5;
  }

  try {
    const sups = JSON.parse(
      localStorage.getItem("senabella_suppliers") || "null",
    );
    proveedores = Array.isArray(sups) && sups.length > 0 ? sups.length : 3;
  } catch {
    proveedores = 3;
  }

  return { pedidos, productos, clientes, categorias, proveedores, usuarios };
}

function Administrador() {
  // --- ESTADOS PRINCIPALES DE LA PÁGINA ---
  const [vistaActual, setVistaActual] = useState("resumen"); // Cuál pestaña está abierta ('resumen', 'pedidos', etc.)
  const [sidebarAbierto, setSidebarAbierto] = useState(false); // Para abrir/cerrar el menú en pantallas pequeñas (móviles)
  const [menuNotificacionesAbierto, setMenuNotificacionesAbierto] =
    useState(false); // Desplegable de campana
  const [notificaciones, setNotificaciones] = useState(obtenerNotificaciones); // Lista de notificaciones activas
  const [cantidades, setCantidades] = useState(calcularCantidadesSidebar); // Contadores de productos, pedidos, etc.
  const [modoOscuro, setModoOscuro] = useState(false); // Tema visual claro/oscuro
  const [notificacionesLeidas, setNotificacionesLeidas] = useState({}); // Registro de notificaciones marcadas como leídas
  const sidebarRef = useRef(null);
  const overlayRef = useRef(null);

  // =========================================================================
  // EFECTO 1: CARGAR CONFIGURACIONES INICIALES Y TEMA
  // =========================================================================
  useEffect(() => {
    document.body.classList.add("cuerpo-admin");
    // Verificamos si el usuario tenía guardado el modo oscuro previamente
    if (localStorage.getItem("modoOscuro") === "activado") {
      setModoOscuro(true);
      document.body.classList.add("modo-oscuro");
    }

    // Limpieza al salir de la página
    return () => document.body.classList.remove("cuerpo-admin");
  }, []);

  // Función para alternar entre tema Claro y tema Oscuro
  const alternarModoOscuro = () => {
    const nuevoEstado = !modoOscuro;
    setModoOscuro(nuevoEstado);
    document.body.classList.toggle("modo-oscuro", nuevoEstado);
    localStorage.setItem(
      "modoOscuro",
      nuevoEstado ? "activado" : "desactivado",
    );
  };

  // Función para refrescar las notificaciones
  const actualizarNotificaciones = () =>
    setNotificaciones(obtenerNotificaciones());
  // Cálculo de cuántas notificaciones no han sido leídas
  const notificacionesNoLeidas = notificaciones.filter(
    (notificacion) => !notificacionesLeidas[notificacion.id],
  ).length;

  // =========================================================================
  // EFECTO 2: ESCUCHAR CAMBIOS EN EL ALMACENAMIENTO PARA AUTO-ACTUALIZAR DATOS
  // =========================================================================
  useEffect(() => {
    const actualizarCantidades = () => {
      setCantidades(calcularCantidadesSidebar());
      setNotificaciones(obtenerNotificaciones());
    };

    // Escuchamos eventos del sistema cuando se crea un pedido o producto nuevo
    window.addEventListener("storage", actualizarCantidades);
    window.addEventListener("senabella_orders_updated", actualizarCantidades);
    return () => {
      window.removeEventListener("storage", actualizarCantidades);
      window.removeEventListener(
        "senabella_orders_updated",
        actualizarCantidades,
      );
    };
  }, []);

  // =========================================================================
  // EFECTO 3: CERRAR EL MENÚ LATERAL SI EL USUARIO HACE CLICK AFUERA (EN MÓVIL)
  // =========================================================================
  useEffect(() => {
    function manejarClickFuera(e) {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target) &&
        !e.target.closest("#adminBotonMenu")
      ) {
        setSidebarAbierto(false);
      }
    }

    document.addEventListener("click", manejarClickFuera);
    return () => document.removeEventListener("click", manejarClickFuera);
  }, []);

  // Función para cambiar de vista (por ejemplo, de "Resumen" a "Productos")
  const cambiarVista = (vista) => {
    setVistaActual(vista);
    setSidebarAbierto(false); // Cerramos el sidebar en móvil al cambiar
  const cambiarVista = (vista) => {
    setVistaActual(vista);
    setSidebarAbierto(false); // Cerramos el sidebar en móvil al cambiar
  };

  // Estado para el modal emergente de cerrar sesión
  const [modalLogoutAbierto, setModalLogoutAbierto] = useState(false);

  // Abre el modal de confirmación antes de salir
  const solicitarCerrarSesion = () => {
    setModalLogoutAbierto(true);
    setSidebarAbierto(false);
  };

  // Limpia los datos de sesión en localStorage y redirige al inicio
  const ejecutarCerrarSesion = () => {
    localStorage.setItem("senabella_sesion", "inactiva");
    localStorage.removeItem("senabella_rol");
    localStorage.removeItem("senabella_usuario");
    localStorage.removeItem("recordar_sesion");
    window.location.href = "/";
  };

  // =========================================================================
  // RENDERIZADO CONDICIONAL: Muestra la vista según la opción elegida
  // =========================================================================
  const renderizarVista = () => {
    switch (vistaActual) {
      case "resumen":
        return <Resumen />;
      case "pedidos":
        return <Pedidos />;
      case "productos":
        return <Productos />;
      case "clientes":
        return <Clientes />;
      case "categorias":
        return <Categorias />;
      case "proveedores":
        return <Proveedores />;
      case "usuarios":
        return <Usuarios />;
      case "reportes":
        return <Reportes />;
      case "configuracion":
        return <Configuracion />;
      default:
        return <Resumen />;
    }
  };

  // =========================================================================
  // DEFINICIÓN DE MENÚS Y SECCIONES DEL SIDEBAR
  // =========================================================================
  const itemsNavegacion = [
    {
      titulo: "General",
      items: [
        { id: "resumen", icono: "fa-gauge-high", texto: "Resumen" },
        {
          id: "pedidos",
          icono: "fa-cart-shopping",
          texto: "Pedidos",
          badge: String(cantidades.pedidos),
        },
        {
          id: "productos",
          icono: "fa-box",
          texto: "Productos",
          badge: String(cantidades.productos),
        },
        {
          id: "clientes",
          icono: "fa-users",
          texto: "Clientes",
          badge: String(cantidades.clientes),
        },
      ],
    },
    {
      titulo: "Catálogo",
      items: [
        {
          id: "categorias",
          icono: "fa-tags",
          texto: "Categorías",
          badge: String(cantidades.categorias),
        },
        {
          id: "proveedores",
          icono: "fa-truck-field",
          texto: "Proveedores",
          badge: String(cantidades.proveedores),
        },
        {
          id: "usuarios",
          icono: "fa-user-shield",
          texto: "Usuarios",
          badge: String(cantidades.usuarios),
        },
      ],
    },
    {
      titulo: "Cuenta",
      items: [
        { id: "reportes", icono: "fa-chart-line", texto: "Reportes" },
        { id: "configuracion", icono: "fa-gear", texto: "Configuración" },
      ],
    },
  ];

  // Devuelve el título que se muestra en la cabecera superior según la vista activa
  const obtenerTituloVista = () => {
    const titulos = {
      resumen: "Resumen general",
      pedidos: "Gestión de pedidos",
      productos: "Gestión de productos",
      clientes: "Gestión de clientes",
      categorias: "Gestión de categorías",
      proveedores: "Gestión de proveedores",
      usuarios: "Gestión de usuarios",
      reportes: "Reportes y estadísticas",
      configuracion: "Configuración del sistema",
    };
    return titulos[vistaActual] || "Panel de administración";
  };

  return (
    <div className={`cuerpo-admin${modoOscuro ? " modo-oscuro" : ""}`}>
      {/* ==========================================
           SIDEBAR
      ========================================== */}
      <aside
        className={`admin-sidebar${sidebarAbierto ? " sidebar-abierto" : ""}`}
        ref={sidebarRef}
      >
        <div className='admin-sidebar-logo'>
          <img
            src='../src/assets/logo.png'
            alt='Senabella'
            style={{ width: "140px", height: "auto" }}
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        </div>

        <nav className='admin-nav'>
          {itemsNavegacion.map((seccion, index) => (
            <div key={index}>
              <p className='admin-nav-titulo'>{seccion.titulo}</p>
              {seccion.items.map((item) => (
                <a
                  href='#'
                  key={item.id}
                  className={`admin-nav-item${vistaActual === item.id ? " activo" : ""}`}
                  onClick={(e) => {
                    e.preventDefault();
                    cambiarVista(item.id);
                  }}
                >
                  <i className={`fa-solid ${item.icono}`}></i>
                  <span>{item.texto}</span>
                  {item.badge && (
                    <span className='admin-nav-badge'>{item.badge}</span>
                  )}
                </a>
              ))}
            </div>
          ))}
        </nav>

        <div className='admin-sidebar-footer'>
          <Link to='/' onClick={() => setSidebarAbierto(false)}>
            <i className='fa-solid fa-store'></i> Volver a la tienda
          </Link>
          <a
            href='#'
            onClick={(e) => {
              e.preventDefault();
              solicitarCerrarSesion();
            }}
          >
            <i className='fa-solid fa-power-off'></i> Cerrar sesión
          </a>
        </div>
      </aside>

      {/* Fondo oscuro al abrir el sidebar en móvil */}
      <div
        className={`admin-overlay${sidebarAbierto ? " overlay-visible" : ""}`}
        onClick={() => setSidebarAbierto(false)}
      ></div>

      {/* ==========================================
           CONTENIDO PRINCIPAL
      ========================================== */}
      <div className='admin-main'>
        {/* TOPBAR */}
        <header className='admin-topbar'>
          <button
            className='admin-boton-menu'
            onClick={() => setSidebarAbierto(!sidebarAbierto)}
            aria-label='Abrir menú'
          >
            <i className='fa-solid fa-bars'></i>
          </button>

          <h1 className='admin-titulo-vista'>{obtenerTituloVista()}</h1>

          <div className='admin-topbar-acciones'>
            <button
              className='admin-icono-boton admin-boton-tema'
              onClick={alternarModoOscuro}
              title={
                modoOscuro ? "Cambiar a modo claro" : "Cambiar a modo oscuro"
              }
              aria-label={
                modoOscuro ? "Cambiar a modo claro" : "Cambiar a modo oscuro"
              }
            >
              <i
                className={`fa-solid ${modoOscuro ? "fa-sun" : "fa-moon"}`}
              ></i>
            </button>

            {/* NOTIFICACIONES */}
            <div className='admin-menu-desplegable'>
              <button
                className='admin-icono-boton admin-boton-notificaciones'
                onClick={() => {
                  actualizarNotificaciones();
                  setMenuNotificacionesAbierto(!menuNotificacionesAbierto);
                }}
                title='Notificaciones'
              >
                <i className='fa-solid fa-bell'></i>
                {notificacionesNoLeidas > 0 && (
                  <span className='admin-punto-badge'>
                    {notificacionesNoLeidas}
                  </span>
                )}
              </button>
              <div
                className={`admin-dropdown admin-dropdown-notificaciones${menuNotificacionesAbierto ? " mostrar" : ""}`}
              >
                <div className='admin-dropdown-titulo'>Notificaciones</div>
                {notificaciones.length === 0 ? (
                  <p className='admin-dropdown-item'>
                    No hay notificaciones nuevas.
                  </p>
                ) : (
                  notificaciones.map((notificacion) => (
                    <a
                      href='#'
                      key={notificacion.id}
                      className={`admin-dropdown-item${!notificacionesLeidas[notificacion.id] ? " no-leido" : ""}`}
                      onClick={(e) => {
                        e.preventDefault();
                        setNotificacionesLeidas((prev) => ({
                          ...prev,
                          [notificacion.id]: true,
                        }));
                        cambiarVista(notificacion.vista);
                        setMenuNotificacionesAbierto(false);
                      }}
                    >
                      <i
                        className={`fa-solid ${notificacion.icono} ${notificacion.clase}`}
                      ></i>
                      <div>
                        <strong>{notificacion.titulo}</strong>
                        <p>{notificacion.texto}</p>
                      </div>
                    </a>
                  ))
                )}
              </div>
            </div>
          </div>
        </header>

        {/* CONTENIDO */}
        <main className='admin-contenido'>{renderizarVista()}</main>
      </div>

      {/* ==========================================
           MODAL DE CONFIRMACIÓN DE CIERRE DE SESIÓN
      ========================================== */}
      {modalLogoutAbierto && (
        <div
          className='admin-modal-overlay'
          onClick={() => setModalLogoutAbierto(false)}
          style={{
            backdropFilter: "blur(4px)",
            background: "rgba(15, 23, 42, 0.6)",
            zIndex: 9999,
          }}
        >
          <div
            className='admin-modal'
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "420px",
              width: "90%",
              borderRadius: "16px",
              overflow: "hidden",
              textAlign: "center",
              padding: "28px 24px",
              boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
            }}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                background: "#fee2e2",
                color: "#dc2626",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px auto",
                fontSize: "24px",
              }}
            >
              <i className='fa-solid fa-power-off'></i>
            </div>

            <h3
              style={{
                margin: "0 0 8px 0",
                fontSize: "18px",
                color: "#0f172a",
                fontWeight: 700,
              }}
            >
              ¿Cerrar sesión de administrador?
            </h3>

            <p
              style={{
                margin: "0 0 24px 0",
                fontSize: "13.5px",
                color: "#64748b",
                lineHeight: "1.5",
              }}
            >
              Tendrás que volver a ingresar tus credenciales para acceder
              nuevamente al panel de control.
            </p>

            <div
              style={{ display: "flex", gap: "12px", justifyContent: "center" }}
            >
              <button
                type='button'
                className='admin-boton admin-boton-secundario'
                onClick={() => setModalLogoutAbierto(false)}
                style={{ flex: 1 }}
              >
                <i className='fa-solid fa-xmark'></i> Cancelar
              </button>
              <button
                type='button'
                className='admin-boton admin-boton-peligro'
                onClick={ejecutarCerrarSesion}
                style={{ flex: 1 }}
              >
                <i className='fa-solid fa-arrow-right-from-bracket'></i> Salir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Administrador;
