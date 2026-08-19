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

function Administrador() {
  const [vistaActual, setVistaActual] = useState("resumen");
  const [sidebarAbierto, setSidebarAbierto] = useState(false);
  const [modoOscuro, setModoOscuro] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [menuNotificacionesAbierto, setMenuNotificacionesAbierto] = useState(false);
  const [menuPerfilAbierto, setMenuPerfilAbierto] = useState(false);
  const [contadorNotificaciones, setContadorNotificaciones] = useState(3);
  
  const sidebarRef = useRef(null);
  const overlayRef = useRef(null);

  // ==========================================
  // EFECTOS INICIALES
  // ==========================================

  useEffect(() => {
    // Para pruebas: crear usuario admin si no existe
    if (!localStorage.getItem("senabella_usuarios_db")) {
      const usuariosDemo = [
        { id: 1, nombre: "Admin Senabella", email: "admin@senabella.com", password: "admin123", rol: "administrador", fechaRegistro: "2024-01-01" },
        { id: 2, nombre: "Usuario Demo", email: "usuario@email.com", password: "usuario123", rol: "usuario", fechaRegistro: "2024-02-15" }
      ];
      localStorage.setItem("senabella_usuarios_db", JSON.stringify(usuariosDemo));
    }

    // Verificar si el usuario es administrador
    const sesionActiva = localStorage.getItem("senabella_sesion") === "activa";
    const rolUsuario = localStorage.getItem("senabella_rol");

    // Para pruebas: si no hay sesión activa, configurar automáticamente como admin
    if (!sesionActiva) {
      localStorage.setItem("senabella_sesion", "activa");
      localStorage.setItem("senabella_rol", "administrador");
    }

    // Modo oscuro
    if (localStorage.getItem("modoOscuro") === "activado") {
      setModoOscuro(true);
      document.body.classList.add("modo-oscuro");
    }
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
  // MODO OSCURO
  // ==========================================

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
    window.location.href = "login.html";
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
      { id: "pedidos", icono: "fa-cart-shopping", texto: "Pedidos", badge: "6" },
      { id: "productos", icono: "fa-box", texto: "Productos" },
      { id: "clientes", icono: "fa-users", texto: "Clientes" },
    ]},
    { titulo: "Catálogo", items: [
      { id: "categorias", icono: "fa-tags", texto: "Categorías" },
      { id: "proveedores", icono: "fa-truck-field", texto: "Proveedores" },
      { id: "usuarios", icono: "fa-user-shield", texto: "Usuarios", badge: "0" },
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
          <img src="../assets/logo.png" alt="Senabella" onError={(e) => { e.target.style.display = 'none'; }} />
          <span>Admin</span>
          <span className="admin-badge-pro">PRO</span>
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

          <div className="admin-buscador">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input 
              type="text" 
              placeholder="Buscar pedidos, productos o clientes..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            {busqueda && (
              <button 
                className="admin-buscador-limpiar" 
                onClick={() => setBusqueda("")}
                title="Limpiar búsqueda"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            )}
          </div>

          <div className="admin-topbar-acciones">
            <button 
              className="admin-icono-boton" 
              onClick={alternarModoOscuro}
              title="Cambiar modo"
            >
              <i className={`fa-solid ${modoOscuro ? "fa-sun" : "fa-moon"}`}></i>
            </button>

            {/* NOTIFICACIONES */}
            <div className="admin-menu-desplegable">
              <button 
                className="admin-icono-boton" 
                onClick={() => setMenuNotificacionesAbierto(!menuNotificacionesAbierto)}
                title="Notificaciones"
              >
                <i className="fa-solid fa-bell"></i>
                {contadorNotificaciones > 0 && (
                  <span className="admin-punto-badge">{contadorNotificaciones}</span>
                )}
              </button>
              <div className={`admin-dropdown${menuNotificacionesAbierto ? " mostrar" : ""}`}>
                <div className="admin-dropdown-titulo">Notificaciones</div>
                <a 
                  href="#" 
                  className="admin-dropdown-item"
                  onClick={(e) => {
                    e.preventDefault();
                    if (contadorNotificaciones > 0) {
                      setContadorNotificaciones(contadorNotificaciones - 1);
                    }
                  }}
                >
                  <i className="fa-solid fa-triangle-exclamation texto-warning"></i>
                  <div>
                    <strong>Stock bajo</strong>
                    <p>4 productos están por agotarse</p>
                  </div>
                </a>
                <a 
                  href="#" 
                  className="admin-dropdown-item"
                  onClick={(e) => {
                    e.preventDefault();
                    if (contadorNotificaciones > 0) {
                      setContadorNotificaciones(contadorNotificaciones - 1);
                    }
                  }}
                >
                  <i className="fa-solid fa-cart-shopping texto-info"></i>
                  <div>
                    <strong>Pedido nuevo</strong>
                    <p>#SN-10482 recién se registró</p>
                  </div>
                </a>
                <a 
                  href="#" 
                  className="admin-dropdown-item"
                  onClick={(e) => {
                    e.preventDefault();
                    if (contadorNotificaciones > 0) {
                      setContadorNotificaciones(contadorNotificaciones - 1);
                    }
                  }}
                >
                  <i className="fa-solid fa-star texto-success"></i>
                  <div>
                    <strong>Reseña nueva</strong>
                    <p>Zapatillas Runner recibió 5 estrellas</p>
                  </div>
                </a>
              </div>
            </div>

            {/* PERFIL */}
            <div className="admin-menu-desplegable">
              <button 
                className="admin-perfil-boton"
                onClick={() => setMenuPerfilAbierto(!menuPerfilAbierto)}
              >
                <span className="admin-avatar">AD</span>
                <span className="admin-perfil-nombre">Admin Senabella</span>
                <i className="fa-solid fa-chevron-down"></i>
              </button>
              <div className={`admin-dropdown admin-dropdown-derecha${menuPerfilAbierto ? " mostrar" : ""}`}>
                <a href="usuario.html" className="admin-dropdown-item-simple">
                  <i className="fa-regular fa-user"></i> Mi perfil
                </a>
                <button 
                  type="button" 
                  className="admin-dropdown-item-simple"
                  onClick={() => cambiarVista("configuracion")}
                >
                  <i className="fa-solid fa-gear"></i> Configuración
                </button>
                <button 
                  type="button" 
                  className="admin-dropdown-item-simple"
                  onClick={cerrarSesion}
                >
                  <i className="fa-solid fa-power-off"></i> Cerrar sesión
                </button>
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