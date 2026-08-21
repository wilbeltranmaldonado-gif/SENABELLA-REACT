// =============================================================================
// COMPONENTE: PANEL DE ADMINISTRADOR (SENABELLA)
// -----------------------------------------------------------------------------
// Contenedor principal que administra la navegación del panel:
// - Menú lateral (Sidebar) con contadores en tiempo real.
// - Barra superior (Topbar) con Modo Oscuro y Notificaciones de stock/pedidos.
// - Conmutador dinámico de vistas y modal de confirmación de cierre de sesión.
// =============================================================================

import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { obtenerPedidosAdmin } from "../../datos";
import "./administrador.css";
import "./encabezado.css";

// Vistas del panel
import Resumen from "./vistas/resumen";
import Pedidos from "./vistas/pedidos";
import Productos from "./vistas/productos";
import Clientes from "./vistas/clientes";
import Categorias from "./vistas/categorias";
import Proveedores from "./vistas/proveedores";
import Usuarios from "./vistas/usuarios";
import Reportes from "./vistas/reportes";
import Configuracion from "./vistas/configuracion";

// Mapeo de vistas para renderizado directo
const MAPA_VISTAS = {
  resumen: { componente: Resumen, titulo: "Resumen general" },
  pedidos: { componente: Pedidos, titulo: "Gestión de pedidos" },
  productos: { componente: Productos, titulo: "Gestión de productos" },
  clientes: { componente: Clientes, titulo: "Gestión de clientes" },
  categorias: { componente: Categorias, titulo: "Gestión de categorías" },
  proveedores: { componente: Proveedores, titulo: "Gestión de proveedores" },
  usuarios: { componente: Usuarios, titulo: "Gestión de usuarios" },
  reportes: { componente: Reportes, titulo: "Reportes y estadísticas" },
  configuracion: { componente: Configuracion, titulo: "Configuración del sistema" },
};

// Helper para leer datos de localStorage de forma segura
const leerLocalStorage = (clave, valorPorDefecto = []) => {
  try {
    const data = localStorage.getItem(clave);
    return data ? JSON.parse(data) : valorPorDefecto;
  } catch {
    return valorPorDefecto;
  }
};

// Genera alertas de stock bajo y pedidos pendientes
function obtenerNotificaciones() {
  const productos = leerLocalStorage("senabella_admin_products", []);
  const pedidos = obtenerPedidosAdmin();

  const stockBajo = productos.filter((p) => Number(p.stock) > 0 && Number(p.stock) <= 10).length;
  const pedidosPendientes = pedidos.filter((p) => ["pendiente", "pendiente-verificacion", "procesando"].includes(p.estado)).length;

  const alertas = [];
  if (stockBajo > 0) {
    alertas.push({
      id: "stockBajo",
      icono: "fa-triangle-exclamation",
      clase: "texto-warning",
      titulo: "Stock bajo",
      texto: `${stockBajo} producto${stockBajo === 1 ? "" : "s"} necesita${stockBajo === 1 ? "" : "n"} reposición.`,
      vista: "productos",
    });
  }
  if (pedidosPendientes > 0) {
    alertas.push({
      id: "pedidoNuevo",
      icono: "fa-cart-shopping",
      clase: "texto-info",
      titulo: "Pedidos pendientes",
      texto: `${pedidosPendientes} pedido${pedidosPendientes === 1 ? "" : "s"} requiere${pedidosPendientes === 1 ? "" : "n"} atención.`,
      vista: "pedidos",
    });
  }
  return alertas;
}

// Cuenta la cantidad de elementos para los badges del menú lateral
function calcularCantidadesSidebar() {
  const pedidos = obtenerPedidosAdmin().length;
  const productos = (leerLocalStorage("senabella_admin_products", null) || Array(15)).length;
  const usuarios = leerLocalStorage("senabella_usuarios", Array(4));
  const clientes = usuarios.filter((u) => u.rol !== "administrador").length || 3;
  const categorias = (leerLocalStorage("senabella_categories", null) || Array(5)).length;
  const proveedores = (leerLocalStorage("senabella_suppliers", null) || Array(3)).length;

  return { pedidos, productos, clientes, categorias, proveedores, usuarios: usuarios.length || 4 };
}

function Administrador() {
  const [vistaActual, setVistaActual] = useState("resumen");
  const [sidebarAbierto, setSidebarAbierto] = useState(false);
  const [menuNotificacionesAbierto, setMenuNotificacionesAbierto] = useState(false);
  const [notificaciones, setNotificaciones] = useState(obtenerNotificaciones);
  const [cantidades, setCantidades] = useState(calcularCantidadesSidebar);
  const [modoOscuro, setModoOscuro] = useState(() => localStorage.getItem("modoOscuro") === "activado");
  const [notificacionesLeidas, setNotificacionesLeidas] = useState({});
  const [modalLogoutAbierto, setModalLogoutAbierto] = useState(false);

  const sidebarRef = useRef(null);

  // Inicializar tema oscuro y clases en el body
  useEffect(() => {
    document.body.classList.add("cuerpo-admin");
    if (modoOscuro) {
      document.body.classList.add("modo-oscuro");
    } else {
      document.body.classList.remove("modo-oscuro");
    }
    return () => {
      document.body.classList.remove("cuerpo-admin");
      document.body.classList.remove("modo-oscuro");
    };
  }, [modoOscuro]);

  // Sincronizar contadores y notificaciones con eventos del sistema
  useEffect(() => {
    const sincronizar = () => {
      setCantidades(calcularCantidadesSidebar());
      setNotificaciones(obtenerNotificaciones());
    };
    window.addEventListener("storage", sincronizar);
    window.addEventListener("senabella_orders_updated", sincronizar);
    return () => {
      window.removeEventListener("storage", sincronizar);
      window.removeEventListener("senabella_orders_updated", sincronizar);
    };
  }, []);

  // Cerrar el menú lateral en móviles al hacer clic afuera
  useEffect(() => {
    const clickFuera = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target) && !e.target.closest("#adminBotonMenu")) {
        setSidebarAbierto(false);
      }
    };
    document.addEventListener("click", clickFuera);
    return () => document.removeEventListener("click", clickFuera);
  }, []);

  // Alternar entre modo claro y oscuro
  const alternarModoOscuro = () => {
    const nuevo = !modoOscuro;
    setModoOscuro(nuevo);
    localStorage.setItem("modoOscuro", nuevo ? "activado" : "desactivado");
  };

  // Cambiar vista activa y cerrar menú móvil
  const cambiarVista = (vista) => {
    setVistaActual(vista);
    setSidebarAbierto(false);
  };

  // Cerrar sesión y limpiar credenciales
  const ejecutarCerrarSesion = () => {
    localStorage.setItem("senabella_sesion", "inactiva");
    localStorage.removeItem("senabella_rol");
    localStorage.removeItem("senabella_usuario");
    localStorage.removeItem("recordar_sesion");
    window.location.href = "/";
  };

  // Definición de las secciones de navegación del Sidebar
  const itemsNavegacion = [
    {
      titulo: "General",
      items: [
        { id: "resumen", icono: "fa-gauge-high", texto: "Resumen" },
        { id: "pedidos", icono: "fa-cart-shopping", texto: "Pedidos", badge: String(cantidades.pedidos) },
        { id: "productos", icono: "fa-box", texto: "Productos", badge: String(cantidades.productos) },
        { id: "clientes", icono: "fa-users", texto: "Clientes", badge: String(cantidades.clientes) },
      ],
    },
    {
      titulo: "Catálogo",
      items: [
        { id: "categorias", icono: "fa-tags", texto: "Categorías", badge: String(cantidades.categorias) },
        { id: "proveedores", icono: "fa-truck-field", texto: "Proveedores", badge: String(cantidades.proveedores) },
        { id: "usuarios", icono: "fa-user-shield", texto: "Usuarios", badge: String(cantidades.usuarios) },
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

  // Componente y título de la vista actual
  const vistaSeleccionada = MAPA_VISTAS[vistaActual] || MAPA_VISTAS.resumen;
  const VistaComponente = vistaSeleccionada.componente;
  const noLeidas = notificaciones.filter((n) => !notificacionesLeidas[n.id]).length;

  return (
    <div className={`cuerpo-admin${modoOscuro ? " modo-oscuro" : ""}`}>
      {/* SIDEBAR LATERAL */}
      <aside className={`admin-sidebar${sidebarAbierto ? " sidebar-abierto" : ""}`} ref={sidebarRef}>
        <div className="admin-sidebar-logo">
          <img
            src="../src/assets/logo.png"
            alt="Senabella"
            style={{ width: "140px", height: "auto" }}
            onError={(e) => { e.target.style.display = "none"; }}
          />
        </div>

        <nav className="admin-nav">
          {itemsNavegacion.map((seccion, idx) => (
            <div key={idx}>
              <p className="admin-nav-titulo">{seccion.titulo}</p>
              {seccion.items.map((item) => (
                <a
                  href="#"
                  key={item.id}
                  className={`admin-nav-item${vistaActual === item.id ? " activo" : ""}`}
                  onClick={(e) => {
                    e.preventDefault();
                    cambiarVista(item.id);
                  }}
                >
                  <i className={`fa-solid ${item.icono}`}></i>
                  <span>{item.texto}</span>
                  {item.badge && <span className="admin-nav-badge">{item.badge}</span>}
                </a>
              ))}
            </div>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <Link to="/" onClick={() => setSidebarAbierto(false)}>
            <i className="fa-solid fa-store"></i> Volver a la tienda
          </Link>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setModalLogoutAbierto(true);
            }}
          >
            <i className="fa-solid fa-power-off"></i> Cerrar sesión
          </a>
        </div>
      </aside>

      {/* OVERLAY PARA MÓVILES */}
      <div
        className={`admin-overlay${sidebarAbierto ? " overlay-visible" : ""}`}
        onClick={() => setSidebarAbierto(false)}
      ></div>

      {/* CONTENIDO PRINCIPAL */}
      <div className="admin-main">
        {/* BARRA SUPERIOR (TOPBAR) */}
        <header className="admin-topbar">
          <button
            id="adminBotonMenu"
            className="admin-boton-menu"
            onClick={() => setSidebarAbierto(!sidebarAbierto)}
            aria-label="Abrir menú"
          >
            <i className="fa-solid fa-bars"></i>
          </button>

          <h1 className="admin-titulo-vista">{vistaSeleccionada.titulo}</h1>

          <div className="admin-topbar-acciones">
            {/* BOTÓN MODO OSCURO */}
            <button
              className="admin-icono-boton admin-boton-tema"
              onClick={alternarModoOscuro}
              title={modoOscuro ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
              aria-label={modoOscuro ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
            >
              <i className={`fa-solid ${modoOscuro ? "fa-sun" : "fa-moon"}`}></i>
            </button>

            {/* MENÚ DE NOTIFICACIONES */}
            <div className="admin-menu-desplegable">
              <button
                className="admin-icono-boton admin-boton-notificaciones"
                onClick={() => {
                  setNotificaciones(obtenerNotificaciones());
                  setMenuNotificacionesAbierto(!menuNotificacionesAbierto);
                }}
                title="Notificaciones"
              >
                <i className="fa-solid fa-bell"></i>
                {noLeidas > 0 && <span className="admin-punto-badge">{noLeidas}</span>}
              </button>

              <div className={`admin-dropdown admin-dropdown-notificaciones${menuNotificacionesAbierto ? " mostrar" : ""}`}>
                <div className="admin-dropdown-titulo">Notificaciones</div>
                {notificaciones.length === 0 ? (
                  <p className="admin-dropdown-item">No hay notificaciones nuevas.</p>
                ) : (
                  notificaciones.map((n) => (
                    <a
                      href="#"
                      key={n.id}
                      className={`admin-dropdown-item${!notificacionesLeidas[n.id] ? " no-leido" : ""}`}
                      onClick={(e) => {
                        e.preventDefault();
                        setNotificacionesLeidas((prev) => ({ ...prev, [n.id]: true }));
                        cambiarVista(n.vista);
                        setMenuNotificacionesAbierto(false);
                      }}
                    >
                      <i className={`fa-solid ${n.icono} ${n.clase}`}></i>
                      <div>
                        <strong>{n.titulo}</strong>
                        <p>{n.texto}</p>
                      </div>
                    </a>
                  ))
                )}
              </div>
            </div>
          </div>
        </header>

        {/* VISTA RENDERIZADA DINÁMICAMENTE */}
        <main className="admin-contenido">
          <VistaComponente />
        </main>
      </div>

      {/* MODAL DE CONFIRMACIÓN DE CIERRE DE SESIÓN */}
      {modalLogoutAbierto && (
        <div
          className="admin-modal-overlay"
          onClick={() => setModalLogoutAbierto(false)}
          style={{ backdropFilter: "blur(4px)", background: "rgba(15, 23, 42, 0.6)", zIndex: 9999 }}
        >
          <div
            className="admin-modal"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "420px",
              width: "90%",
              borderRadius: "16px",
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
              <i className="fa-solid fa-power-off"></i>
            </div>

            <h3 style={{ margin: "0 0 8px 0", fontSize: "18px", color: "#0f172a", fontWeight: 700 }}>
              ¿Cerrar sesión de administrador?
            </h3>

            <p style={{ margin: "0 0 24px 0", fontSize: "13.5px", color: "#64748b", lineHeight: "1.5" }}>
              Tendrás que volver a ingresar tus credenciales para acceder nuevamente al panel de control.
            </p>

            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <button
                type="button"
                className="admin-boton admin-boton-secundario"
                onClick={() => setModalLogoutAbierto(false)}
                style={{ flex: 1 }}
              >
                <i className="fa-solid fa-xmark"></i> Cancelar
              </button>
              <button
                type="button"
                className="admin-boton admin-boton-peligro"
                onClick={ejecutarCerrarSesion}
                style={{ flex: 1 }}
              >
                <i className="fa-solid fa-arrow-right-from-bracket"></i> Salir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Administrador;
