import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { CIUDADES } from "../../datos";
import "./usuario.css";

function Usuario() {
  const [seccionActiva, setSeccionActiva] = useState("mi-perfil");
  const [usuario, setUsuario] = useState(() => {
    try { return JSON.parse(localStorage.getItem("senabella_usuario")) || {}; }
    catch { return {}; }
  });
  const [ordenes, setOrdenes] = useState(() => {
    try { return JSON.parse(localStorage.getItem("senabella_user_orders")) || []; }
    catch { return []; }
  });
  const [mensajePerfil, setMensajePerfil] = useState({ texto: "", tipo: "" });
  const [mensajeEnvio, setMensajeEnvio] = useState({ texto: "", tipo: "" });
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.seccion) {
      setSeccionActiva(location.state.seccion);
    }
  }, [location.state]);

  useEffect(() => {
    // Verificar sesión
    if (localStorage.getItem("senabella_sesion") !== "activa") {
      navigate("/login");
      return;
    }
  }, [navigate]);

  const handleLogout = () => {
    if (window.confirm("¿Seguro que quieres cerrar sesión?")) {
      localStorage.removeItem("senabella_sesion");
      localStorage.removeItem("senabella_rol");
      localStorage.removeItem("ubicacion");
      navigate("/");
      setTimeout(() => window.location.reload(), 100);
    }
  };

  const guardarPerfil = (e) => {
    e.preventDefault();
    const nombre = e.target.elements.nombre.value.trim();
    const email = e.target.elements.email.value.trim();
    const celular = e.target.elements.celular.value.trim();
    const password = e.target.elements.password.value;

    if (!nombre) {
      setMensajePerfil({ texto: "Por favor ingresa tu nombre completo.", tipo: "error" });
      return;
    }
    if (!email || !/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
      setMensajePerfil({ texto: "Ingresa un correo electrónico válido.", tipo: "error" });
      return;
    }
    if (password && password.length < 6) {
      setMensajePerfil({ texto: "La contraseña debe tener mínimo 6 caracteres.", tipo: "error" });
      return;
    }

    const actualizado = { ...usuario, nombre, email, celular };
    if (password) actualizado.password = password;
    
    localStorage.setItem("senabella_usuario", JSON.stringify(actualizado));
    setUsuario(actualizado);
    
    setMensajePerfil({ texto: "✓ Datos de perfil guardados correctamente.", tipo: "exito" });
    if (window.SenabellaToast) {
      window.SenabellaToast("Perfil actualizado", "fa-circle-check", "exito");
    }
    e.target.elements.password.value = "";
    
    setTimeout(() => setMensajePerfil({ texto: "", tipo: "" }), 4000);
  };

  const guardarEnvio = (e) => {
    e.preventDefault();
    const celular = e.target.elements.celular.value.trim();
    const direccion = e.target.elements.direccion.value.trim();
    const ciudad = e.target.elements.ciudad.value.trim();

    if (!celular) {
      setMensajeEnvio({ texto: "Por favor ingresa tu celular de contacto.", tipo: "error" });
      return;
    }
    if (!direccion) {
      setMensajeEnvio({ texto: "Por favor ingresa una dirección de envío.", tipo: "error" });
      return;
    }
    if (!ciudad) {
      setMensajeEnvio({ texto: "Por favor ingresa la ciudad.", tipo: "error" });
      return;
    }

    const actualizado = { 
      ...usuario, 
      celular: celular.replace(/[^0-9\s]/g, ""), 
      direccion, 
      ciudad 
    };
    
    localStorage.setItem("senabella_usuario", JSON.stringify(actualizado));
    // Sincronizar la ciudad con la ubicación del encabezado
    if (ciudad) {
      localStorage.setItem("ubicacion", ciudad);
      window.dispatchEvent(new Event("senabella-ubicacion-actualizada"));
    }
    setUsuario(actualizado);

    setMensajeEnvio({ texto: "✓ Datos de envío guardados correctamente.", tipo: "exito" });
    if (window.SenabellaToast) {
      window.SenabellaToast("Datos de envío actualizados", "fa-circle-check", "exito");
    }
    setTimeout(() => setMensajeEnvio({ texto: "", tipo: "" }), 4000);
  };

  const menuItems = [
    { id: "mi-perfil", texto: "Mi Perfil", icono: "fa-user" },
    { id: "mis-compras", texto: "Mis compras", icono: "fa-box-open" },
    { id: "datos-envio", texto: "Datos de Envío y Contacto", icono: "fa-address-card" },
  ];

  return (
    <div className="contenedor contenedor-usuario">
      <div className="migas-pan">
        <Link to="/"><i className="fa-solid fa-chevron-left"></i> Inicio</Link>
        <span className="migas-separador">/</span>
        <span>Mi cuenta</span>
      </div>

      <h1 className="titulo-pagina">Panel de Usuario</h1>

      <div className="diseno-perfil">
        {/* BARRA LATERAL */}
        <nav className="barra-lateral">
          {menuItems.map(item => (
            <button
              key={item.id}
              className={`elemento-menu ${seccionActiva === item.id ? "activo" : ""}`}
              onClick={() => setSeccionActiva(item.id)}
            >
              <div className="elemento-menu-izquierda">
                <i className={`fa-solid ${item.icono}`}></i>
                <span>{item.texto}</span>
              </div>
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          ))}
          <button className="elemento-menu elemento-menu-logout" onClick={handleLogout}>
            <div className="elemento-menu-izquierda">
              <i className="fa-solid fa-power-off"></i>
              <span>Cerrar sesión</span>
            </div>
            <i className="fa-solid fa-chevron-right"></i>
          </button>
        </nav>

        {/* CONTENIDO PRINCIPAL */}
        <main className="tarjeta-contenido">
          {seccionActiva === "mi-perfil" && (
            <div className="seccion-usuario-panel">
              <h2 className="titulo-seccion">Información Personal</h2>
              <form onSubmit={guardarPerfil} className="formulario-usuario" noValidate>
                <div className="usuario-grupo-campo">
                  <label className="usuario-label">Nombre completo *</label>
                  <input
                    name="nombre"
                    type="text"
                    defaultValue={usuario.nombre || ""}
                    required
                    placeholder="Ej. María García"
                    className="usuario-input"
                  />
                </div>
                <div className="usuario-grupo-campo">
                  <label className="usuario-label">Correo electrónico *</label>
                  <input
                    name="email"
                    type="email"
                    defaultValue={usuario.email || usuario.correo || ""}
                    required
                    placeholder="Ej. maria@email.com"
                    className="usuario-input"
                  />
                </div>
                <div className="usuario-grupo-campo">
                  <label className="usuario-label">Celular de contacto</label>
                  <input
                    name="celular"
                    type="tel"
                    defaultValue={usuario.celular || ""}
                    placeholder="Ej. 300 123 4567"
                    className="usuario-input"
                  />
                </div>
                <div className="usuario-grupo-campo">
                  <label className="usuario-label">
                    Nueva contraseña <span className="usuario-hint">(dejar en blanco para no cambiarla)</span>
                  </label>
                  <input
                    name="password"
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    className="usuario-input"
                  />
                </div>
                <button type="submit" className="usuario-boton-guardar">
                  <i className="fa-solid fa-floppy-disk"></i> Guardar Cambios
                </button>
                {mensajePerfil.texto && (
                  <div className={`usuario-alerta ${mensajePerfil.tipo === "exito" ? "alerta-exito" : "alerta-error"}`}>
                    <i className={`fa-solid ${mensajePerfil.tipo === "exito" ? "fa-circle-check" : "fa-triangle-exclamation"}`}></i>
                    <span>{mensajePerfil.texto}</span>
                  </div>
                )}
              </form>
            </div>
          )}

          {seccionActiva === "mis-compras" && (
            <div className="seccion-usuario-panel">
              <h2 className="titulo-seccion">Mis compras realizadas</h2>
              {ordenes.length === 0 ? (
                <div className="usuario-estado-vacio">
                  <i className="fa-solid fa-box-open"></i>
                  <p>Aún no has realizado ninguna compra en Senabella.</p>
                  <Link to="/catalogo" className="usuario-boton-comprar">
                    <i className="fa-solid fa-bag-shopping"></i> Explorar Catálogo
                  </Link>
                </div>
              ) : (
                <div className="usuario-lista-ordenes">
                  {ordenes.map((orden, index) => (
                    <div key={index} className="usuario-orden-card">
                      <div className="usuario-orden-header">
                        <div>
                          <span className="usuario-orden-numero">Orden: {orden.numero}</span>
                          <span className="usuario-orden-fecha">{orden.fecha}</span>
                        </div>
                        <span className="usuario-orden-total">{orden.total}</span>
                      </div>
                      <div className="usuario-orden-detalles">
                        <p><strong>Método de pago:</strong> {String(orden.metodoPago || "").toUpperCase()}</p>
                        <p><strong>Dirección de entrega:</strong> {orden.direccion || "-"}, {orden.ciudad || ""}</p>
                      </div>
                      {orden.productos && orden.productos.length > 0 && (
                        <div className="usuario-orden-productos">
                          <strong>Productos en esta orden:</strong>
                          {orden.productos.map((prod, i) => (
                            <div key={i} className="usuario-orden-producto-fila">
                              <div className="usuario-prod-thumb-info">
                                {prod.img || prod.imagen ? (
                                  <img src={prod.img || prod.imagen} alt={prod.nombre} className="usuario-prod-thumb" />
                                ) : (
                                  <div className="usuario-prod-thumb-vacio"><i className="fa-solid fa-box"></i></div>
                                )}
                                <span className="usuario-prod-nombre">{prod.cantidad || 1}x {prod.nombre}</span>
                              </div>
                              <span className="usuario-prod-precio">{prod.precioText || `$ ${Math.round(prod.precio || 0).toLocaleString("es-CO")}`}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {seccionActiva === "datos-envio" && (
            <div className="seccion-usuario-panel">
              <h2 className="titulo-seccion">Datos de Envío y Contacto</h2>
              <form onSubmit={guardarEnvio} className="formulario-usuario">
                <div className="usuario-grupo-campo">
                  <label className="usuario-label">Nombre del Titular</label>
                  <input
                    type="text"
                    value={usuario.nombre || ""}
                    readOnly
                    className="usuario-input usuario-input-readonly"
                    title="El nombre se modifica desde la pestaña Mi Perfil"
                  />
                </div>
                <div className="usuario-grupo-campo">
                  <label className="usuario-label">Celular de Contacto *</label>
                  <input
                    name="celular"
                    type="tel"
                    defaultValue={usuario.celular || ""}
                    required
                    placeholder="Ej. 300 123 4567"
                    className="usuario-input"
                  />
                </div>
                <div className="usuario-grupo-campo">
                  <label className="usuario-label">Dirección de Envío *</label>
                  <input
                    name="direccion"
                    type="text"
                    defaultValue={usuario.direccion || ""}
                    required
                    placeholder="Ej. Calle 123 # 45 - 67, Apto 201"
                    className="usuario-input"
                  />
                </div>
                <div className="usuario-grupo-campo">
                  <label className="usuario-label">Ciudad *</label>
                  <select
                    name="ciudad"
                    required
                    defaultValue={usuario.ciudad || ""}
                    className="usuario-input"
                  >
                    <option value="">Selecciona tu ciudad</option>
                    {CIUDADES.map((ciudad) => (
                      <option key={ciudad} value={ciudad}>{ciudad}</option>
                    ))}
                  </select>
                </div>
                <button type="submit" className="usuario-boton-guardar">
                  <i className="fa-solid fa-floppy-disk"></i> Guardar Datos de Envío
                </button>
                {mensajeEnvio.texto && (
                  <div className={`usuario-alerta ${mensajeEnvio.tipo === "exito" ? "alerta-exito" : "alerta-error"}`}>
                    <i className={`fa-solid ${mensajeEnvio.tipo === "exito" ? "fa-circle-check" : "fa-triangle-exclamation"}`}></i>
                    <span>{mensajeEnvio.texto}</span>
                  </div>
                )}
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Usuario;