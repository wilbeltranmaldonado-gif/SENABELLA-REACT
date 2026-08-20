import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./administrador.css";
import "./encabezado.css";

// Importar las vistas
import Resumen from "./vistas/resumen";
import Pedidos from "./vistas/pedidos";
import Productos from "./vistas/productos";
import Clientes from "./vistas/clientes";
import Categorias from "./vistas/categorias";
import Proveedores from "./vistas/proveedores";
import Usuarios from "./vistas/usuarios";
import Reportes from "./vistas/reportes";
import Configuracion from "./vistas/configuracion";

function obtenerNotificaciones() {
  try {
    const productos = JSON.parse(localStorage.getItem("senabella_admin_products") || "[]");
    const pedidos = JSON.parse(localStorage.getItem("senabella_admin_orders") || "[]");
    const stockBajo = productos.filter((producto) => Number(producto.stock) > 0 && Number(producto.stock) <= 10).length;
    const pedidosPendientes = pedidos.filter((pedido) => ["pendiente", "pendiente-verificacion", "procesando"].includes(pedido.estado)).length;
    return [
      ...(stockBajo ? [{ id: "stockBajo", icono: "fa-triangle-exclamation", clase: "texto-warning", titulo: "Stock bajo", texto: `${stockBajo} producto${stockBajo === 1 ? "" : "s"} necesita${stockBajo === 1 ? "" : "n"} reposición.`, vista: "productos" }] : []),
      ...(pedidosPendientes ? [{ id: "pedidoNuevo", icono: "fa-cart-shopping", clase: "texto-info", titulo: "Pedidos pendientes", texto: `${pedidosPendientes} pedido${pedidosPendientes === 1 ? "" : "s"} requiere${pedidosPendientes === 1 ? "" : "n"} atención.`, vista: "pedidos" }] : [])
    ];
  } catch {
    return [];
  }
}

function Administrador() {
  const [vistaActual, setVistaActual] = useState("resumen");
  const [sidebarAbierto, setSidebarAbierto] = useState(false);
  const [menuNotificacionesAbierto, setMenuNotificacionesAbierto] = useState(false);
  const [notificaciones, setNotificaciones] = useState(obtenerNotificaciones);
  const [cantidadPedidos, setCantidadPedidos] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("senabella_admin_orders") || "[]").length;
    } catch {
      return 0;
    }
  });
  const [cantidadUsuarios, setCantidadUsuarios] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("senabella_usuarios") || "[]").filter((usuario) => usuario.rol !== "administrador").length;
    } catch {
      return 0;
    }
  });
  const [modoOscuro, setModoOscuro] = useState(false);
  const [notificacionesLeidas, setNotificacionesLeidas] = useState({});
  
  const sidebarRef = useRef(null);
  const overlayRef = useRef(null);

  // ==========================================
  // EFECTOS INICIALES
  // ==========================================

  useEffect(() => {
    // Modo oscuro
    if (localStorage.getItem("modoOscuro") === "activado") {
      setModoOscuro(true);
      document.body.classList.add("modo-oscuro");
    }
  }, []);

  const actualizarNotificaciones = () => setNotificaciones(obtenerNotificaciones());
  const notificacionesNoLeidas = notificaciones.filter((notificacion) => !notificacionesLeidas[notificacion.id]).length;

  useEffect(() => {
    const actualizarCantidadPedidos = () => {
      try {
        setCantidadPedidos(JSON.parse(localStorage.getItem("senabella_admin_orders") || "[]").length);
      } catch {
        setCantidadPedidos(0);
      }
    };

    window.addEventListener("storage", actualizarCantidadPedidos);
    const actualizarCantidadUsuarios = () => {
      try {
        setCantidadUsuarios(JSON.parse(localStorage.getItem("senabella_usuarios") || "[]").filter((usuario) => usuario.rol !== "administrador").length);
      } catch {
        setCantidadUsuarios(0);
      }
    };
    window.addEventListener("storage", actualizarCantidadUsuarios);
    return () => {
      window.removeEventListener("storage", actualizarCantidadPedidos);
      window.removeEventListener("storage", actualizarCantidadUsuarios);
    };
  }, []);

  // ==========================================
  // CERRAR MENÚS AL HACER CLICK FUERA
  // ==========================================

  useEffect(() => {
    function manejarClickFuera(e) {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target) && !e.target.closest("#adminBotonMenu")) {
        setSidebarAbierto(false);
      }
    }

    document.addEventListener("click", manejarClickFuera);
    return () => document.removeEventListener("click", manejarClickFuera);
  }, []);



  // ==========================================
  // CAMBIAR VISTA
  // ==========================================

  const cambiarVista = (vista) => {
    setVistaActual(vista);
    setSidebarAbierto(false);
  };

  // ==========================================
  // CERRAR SESIÓN
  // ==========================================

  const cerrarSesion = () => {
    localStorage.setItem("senabella_sesion", "inactiva");
    localStorage.removeItem("senabella_rol");
    localStorage.removeItem("senabella_usuario");
    localStorage.removeItem("recordar_sesion");
    window.location.href = "/";
  };

  // ==========================================
  // RENDERIZAR VISTA ACTUAL
  // ==========================================

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

  // ==========================================
  // ITEMS DE NAVEGACIÓN
  // ==========================================

  const itemsNavegacion = [
    { titulo: "General", items: [
      { id: "resumen", icono: "fa-gauge-high", texto: "Resumen" },
      { id: "pedidos", icono: "fa-cart-shopping", texto: "Pedidos", badge: String(cantidadPedidos) },
      { id: "productos", icono: "fa-box", texto: "Productos" },
      { id: "clientes", icono: "fa-users", texto: "Clientes" },
    ]},
    { titulo: "Catálogo", items: [
      { id: "categorias", icono: "fa-tags", texto: "Categorías" },
      { id: "proveedores", icono: "fa-truck-field", texto: "Proveedores" },
      { id: "usuarios", icono: "fa-user-shield", texto: "Usuarios", badge: String(cantidadUsuarios) },
    ]},
    { titulo: "Cuenta", items: [
      { id: "reportes", icono: "fa-chart-line", texto: "Reportes" },
      { id: "configuracion", icono: "fa-gear", texto: "Configuración" },
    ]},
  ];

  // ==========================================
  // OBTENER TÍTULO DE VISTA
  // ==========================================

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
    <div className="cuerpo-admin">
      {/* ==========================================
           SIDEBAR
      ========================================== */}
      <aside 
        className={`admin-sidebar${sidebarAbierto ? " sidebar-abierto" : ""}`} 
        ref={sidebarRef}
      >
        <div className="admin-sidebar-logo">
          <img src="../src/assets/logo.png" alt="Senabella" style={{ width: "140px", height: "auto" }} onError={(e) => { e.target.style.display = 'none'; }} />
        </div>

        <nav className="admin-nav">
          {itemsNavegacion.map((seccion, index) => (
            <div key={index}>
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
          <Link to="/" onClick={() => setSidebarAbierto(false)}><i className="fa-solid fa-store"></i> Volver a la tienda</Link>
          <a href="#" onClick={(e) => { e.preventDefault(); cerrarSesion(); }}>
            <i className="fa-solid fa-power-off"></i> Cerrar sesión
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
      <div className="admin-main">
        {/* TOPBAR */}
        <header className="admin-topbar">
          <button 
            className="admin-boton-menu" 
            onClick={() => setSidebarAbierto(!sidebarAbierto)}
            aria-label="Abrir menú"
          >
            <i className="fa-solid fa-bars"></i>
          </button>

          <h1 className="admin-titulo-vista">{obtenerTituloVista()}</h1>

          <div className="admin-topbar-acciones">
            {/* NOTIFICACIONES */}
            <div className="admin-menu-desplegable">
              <button 
                className="admin-icono-boton admin-boton-notificaciones" 
                onClick={() => {
                  actualizarNotificaciones();
                  setMenuNotificacionesAbierto(!menuNotificacionesAbierto);
                }}
                title="Notificaciones"
              >
                <i className="fa-solid fa-bell"></i>
                {notificacionesNoLeidas > 0 && (
                  <span className="admin-punto-badge">{notificacionesNoLeidas}</span>
                )}
              </button>
              <div className={`admin-dropdown admin-dropdown-notificaciones${menuNotificacionesAbierto ? " mostrar" : ""}`}>
                <div className="admin-dropdown-titulo">Notificaciones</div>
                {notificaciones.length === 0 ? <p className="admin-dropdown-item">No hay notificaciones nuevas.</p> : notificaciones.map((notificacion) => (
                  <a
                    href="#"
                    key={notificacion.id}
                    className={`admin-dropdown-item${!notificacionesLeidas[notificacion.id] ? " no-leido" : ""}`}
                    onClick={(e) => {
                      e.preventDefault();
                      setNotificacionesLeidas((prev) => ({ ...prev, [notificacion.id]: true }));
                      cambiarVista(notificacion.vista);
                      setMenuNotificacionesAbierto(false);
                    }}
                  >
                    <i className={`fa-solid ${notificacion.icono} ${notificacion.clase}`}></i>
                    <div><strong>{notificacion.titulo}</strong><p>{notificacion.texto}</p></div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </header>

        {/* CONTENIDO */}
        <main className="admin-contenido">
          {renderizarVista()}
        </main>
      </div>
    </div>
  );
}

export default Administrador;