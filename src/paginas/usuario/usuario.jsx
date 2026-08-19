import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./usuario.css";

function Usuario() {
  const [seccionActiva, setSeccionActiva] = useState("mi-perfil");
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar si el usuario está logueado
    const sesionActiva = localStorage.getItem("senabella_sesion") === "activa";
    if (!sesionActiva) {
      navigate("/login");
      return;
    }

    // Verificar el rol del usuario
    const rolUsuario = localStorage.getItem("senabella_rol");
    if (rolUsuario === "administrador") {
      navigate("/administrador");
      return;
    }

    // Cargar datos del usuario
    const usuarioGuardado = localStorage.getItem("senabella_usuario");
    if (usuarioGuardado) {
      setUsuario(JSON.parse(usuarioGuardado));
    }
  }, [navigate]);

  const cambiarSeccion = (seccion) => {
    setSeccionActiva(seccion);
  };

  const cerrarSesion = () => {
    localStorage.setItem("senabella_sesion", "inactiva");
    localStorage.removeItem("senabella_rol");
    localStorage.removeItem("senabella_usuario");
    localStorage.removeItem("recordar_sesion");
    window.location.href = "/";
  };

  const itemsMenu = [
    { id: "mi-perfil", icono: "fa-user", texto: "Mi Perfil" },
    { id: "mis-compras", icono: "fa-box-open", texto: "Mis compras" },
    { id: "datos-envio", icono: "fa-address-card", texto: "Datos de Envío y Contacto" },
  ];

  const renderizarContenido = () => {
    switch (seccionActiva) {
      case "mi-perfil":
        return <MiPerfil usuario={usuario} setUsuario={setUsuario} />;
      case "mis-compras":
        return <MisCompras usuario={usuario} />;
      case "datos-envio":
        return <DatosEnvio usuario={usuario} />;
      default:
        return <MiPerfil usuario={usuario} setUsuario={setUsuario} />;
    }
  };

  const obtenerTituloSeccion = () => {
    const titulos = {
      "mi-perfil": "Mi Perfil",
      "mis-compras": "Mis Compras",
      "datos-envio": "Datos de Envío y Contacto"
    };
    return titulos[seccionActiva] || "Mi Perfil";
  };

  if (!usuario) {
    return <div className="usuario-cargando">Cargando...</div>;
  }

  return (
    <div className="usuario-page">
      <div className="contenedor">
        {/* Ruta de navegación */}
        <div className="migas-pan">
          <Link to="/"><i className="fa-solid fa-chevron-left"></i> Inicio</Link>
        </div>

        <h1 className="titulo-pagina">Mi perfil</h1>

        <div className="diseno-perfil">
          {/* BARRA LATERAL/Menú de la cuenta */}
          <nav className="barra-lateral">
            {itemsMenu.map((item) => (
              <a
                href="#"
                key={item.id}
                className={`elemento-menu${seccionActiva === item.id ? " activo" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  cambiarSeccion(item.id);
                }}
              >
                <div className="elemento-menu-izquierda">
                  <i className={`fa-solid ${item.icono}`}></i>
                  <span>{item.texto}</span>
                </div>
                <i className="fa-solid fa-chevron-right"></i>
              </a>
            ))}

            <a
              href="#"
              className="elemento-menu cerrar-sesion"
              onClick={(e) => {
                e.preventDefault();
                cerrarSesion();
              }}
            >
              <div className="elemento-menu-izquierda">
                <i className="fa-solid fa-power-off"></i>
                <span>Cerrar sesión</span>
              </div>
              <i className="fa-solid fa-chevron-right"></i>
            </a>
          </nav>

          {/* Detalles de la pestaña activa */}
          <main className="tarjeta-contenido">
            <h2 className="titulo-seccion">{obtenerTituloSeccion()}</h2>
            <div className="lista-campos">
              {renderizarContenido()}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

// Componentes de cada sección
function MiPerfil({ usuario, setUsuario }) {
  const [editando, setEditando] = useState(false);
  const [formData, setFormData] = useState({
    nombre: usuario?.nombre || "",
    email: usuario?.email || "",
    telefono: "",
    direccion: ""
  });

  const guardarCambios = (e) => {
    e.preventDefault();
    setUsuario({ ...usuario, ...formData });
    localStorage.setItem("senabella_usuario", JSON.stringify({ ...usuario, ...formData }));
    setEditando(false);
  };

  if (editando) {
    return (
      <form onSubmit={guardarCambios} className="formulario-perfil">
        <div className="campo-grupo">
          <label>Nombre completo</label>
          <input
            type="text"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            required
          />
        </div>
        <div className="campo-grupo">
          <label>Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>
        <div className="campo-grupo">
          <label>Teléfono</label>
          <input
            type="tel"
            value={formData.telefono}
            onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
          />
        </div>
        <div className="campo-grupo">
          <label>Dirección</label>
          <input
            type="text"
            value={formData.direccion}
            onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
          />
        </div>
        <div className="acciones-formulario">
          <button type="button" onClick={() => setEditando(false)}>Cancelar</button>
          <button type="submit" className="btn-primario">Guardar cambios</button>
        </div>
      </form>
    );
  }

  return (
    <div className="perfil-vista">
      <div className="info-usuario">
        <div className="avatar-grande">
          <i className="fa-solid fa-user"></i>
        </div>
        <div className="detalles-usuario">
          <h3>{usuario?.nombre || "Usuario"}</h3>
          <p>{usuario?.email || ""}</p>
          <span className="rol-badge">{usuario?.rol || "usuario"}</span>
        </div>
      </div>
      <button className="btn-editar" onClick={() => setEditando(true)}>
        <i className="fa-solid fa-pen"></i> Editar perfil
      </button>
    </div>
  );
}

function MisCompras({ usuario }) {
  const compras = [
    { id: "#SN-10482", fecha: "2024-08-19", total: "$125.00", estado: "Entregado", productos: 3 },
    { id: "#SN-10478", fecha: "2024-08-17", total: "$178.00", estado: "En camino", productos: 4 },
    { id: "#SN-10470", fecha: "2024-08-15", total: "$89.50", estado: "Entregado", productos: 2 },
  ];

  return (
    <div className="compras-vista">
      <div className="compras-lista">
        {compras.map((compra) => (
          <div key={compra.id} className="compra-item">
            <div className="compra-info">
              <h4>{compra.id}</h4>
              <p>{compra.fecha}</p>
              <span className={`estado-compra ${compra.estado === "Entregado" ? "entregado" : "en-camino"}`}>
                {compra.estado}
              </span>
            </div>
            <div className="compra-total">
              <p>{compra.total}</p>
              <small>{compra.productos} productos</small>
            </div>
          </div>
        ))}
      </div>
      {compras.length === 0 && (
        <div className="sin-compras">
          <i className="fa-solid fa-box-open"></i>
          <p>No tienes compras aún</p>
        </div>
      )}
    </div>
  );
}

function DatosEnvio({ usuario }) {
  const [datos, setDatos] = useState({
    direccion: "",
    ciudad: "",
    departamento: "",
    codigoPostal: "",
    telefono: ""
  });

  const guardarDatos = (e) => {
    e.preventDefault();
    localStorage.setItem("senabella_datos_envio", JSON.stringify(datos));
    alert("Datos de envío guardados exitosamente");
  };

  return (
    <div className="envio-vista">
      <form onSubmit={guardarDatos} className="formulario-perfil">
        <div className="campo-grupo">
          <label>Dirección</label>
          <input
            type="text"
            value={datos.direccion}
            onChange={(e) => setDatos({ ...datos, direccion: e.target.value })}
            placeholder="Calle 123, Apto 45"
          />
        </div>
        <div className="campo-grupo">
          <label>Ciudad</label>
          <input
            type="text"
            value={datos.ciudad}
            onChange={(e) => setDatos({ ...datos, ciudad: e.target.value })}
            placeholder="Bogotá"
          />
        </div>
        <div className="campo-grupo">
          <label>Departamento</label>
          <input
            type="text"
            value={datos.departamento}
            onChange={(e) => setDatos({ ...datos, departamento: e.target.value })}
            placeholder="Cundinamarca"
          />
        </div>
        <div className="campo-grupo">
          <label>Código Postal</label>
          <input
            type="text"
            value={datos.codigoPostal}
            onChange={(e) => setDatos({ ...datos, codigoPostal: e.target.value })}
            placeholder="110111"
          />
        </div>
        <div className="campo-grupo">
          <label>Teléfono de contacto</label>
          <input
            type="tel"
            value={datos.telefono}
            onChange={(e) => setDatos({ ...datos, telefono: e.target.value })}
            placeholder="+57 300 123 4567"
          />
        </div>
        <div className="acciones-formulario">
          <button type="submit" className="btn-primario">Guardar datos de envío</button>
        </div>
      </form>
    </div>
  );
}

export default Usuario;