import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./usuario.css";

function Usuario() {
  const [seccionActiva, setSeccionActiva] = useState("mi-perfil");
  const [usuario, setUsuario] = useState({});
  const [ordenes, setOrdenes] = useState([]);
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

    try {
      const user = JSON.parse(localStorage.getItem("senabella_usuario")) || {};
      setUsuario(user);
    } catch (e) {
      console.error(e);
    }

    try {
      const orders = JSON.parse(localStorage.getItem("senabella_user_orders")) || [];
      setOrdenes(orders);
    } catch (e) {
      console.error(e);
    }
  }, [navigate]);

  const handleLogout = () => {
    if (window.confirm("¿Seguro que quieres cerrar sesión?")) {
      localStorage.removeItem("senabella_sesion");
      localStorage.removeItem("senabella_rol");
      navigate("/");
      // Forzar recarga si es necesario para limpiar estado global de encabezado
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
    
    setMensajePerfil({ texto: "\u2713 Datos guardados correctamente.", tipo: "exito" });
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
    setUsuario(actualizado);

    setMensajeEnvio({ texto: "\u2713 Datos de envío guardados correctamente.", tipo: "exito" });
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
    <div className="contenedor">
      <div className="migas-pan">
        <Link to="/"><i className="fa-solid fa-chevron-left"></i> Inicio</Link>
        <span style={{ margin: "0 8px", color: "var(--text-muted)" }}>/</span>
        <span>Mi cuenta</span>
      </div>

      <h1 className="titulo-pagina">Mi perfil</h1>

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
          <button className="elemento-menu" onClick={handleLogout}>
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
            <>
              <h2 className="titulo-seccion">Mi Perfil</h2>
              <form onSubmit={guardarPerfil} className="formulario" style={{ marginTop: "15px" }} noValidate>
                <div style={{ marginBottom: "15px" }}>
                  <label style={{ display: "block", marginBottom: "5px", fontWeight: 500 }}>Nombre completo *</label>
                  <input name="nombre" type="text" defaultValue={usuario.nombre || ""} required placeholder="Ej. María García" style={{ width: "100%", padding: "10px", border: "1px solid var(--border-color, #eee)", borderRadius: "8px" }} />
                </div>
                <div style={{ marginBottom: "15px" }}>
                  <label style={{ display: "block", marginBottom: "5px", fontWeight: 500 }}>Correo electrónico *</label>
                  <input name="email" type="email" defaultValue={usuario.email || ""} required placeholder="Ej. maria@email.com" style={{ width: "100%", padding: "10px", border: "1px solid var(--border-color, #eee)", borderRadius: "8px" }} />
                </div>
                <div style={{ marginBottom: "15px" }}>
                  <label style={{ display: "block", marginBottom: "5px", fontWeight: 500 }}>Celular</label>
                  <input name="celular" type="tel" defaultValue={usuario.celular || ""} placeholder="Ej. 300 123 4567" style={{ width: "100%", padding: "10px", border: "1px solid var(--border-color, #eee)", borderRadius: "8px" }} />
                </div>
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", marginBottom: "5px", fontWeight: 500 }}>
                    Nueva contraseña <span style={{ fontWeight: 400, color: "var(--text-muted, #666)", fontSize: "0.85em" }}>(dejar en blanco para no cambiarla)</span>
                  </label>
                  <input name="password" type="password" placeholder="Mínimo 6 caracteres" style={{ width: "100%", padding: "10px", border: "1px solid var(--border-color, #eee)", borderRadius: "8px" }} />
                </div>
                <button type="submit" style={{ width: "100%", padding: "13px", borderRadius: "8px", background: "var(--primary-color, #84b814)", color: "#fff", border: "none", fontSize: "1rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                  <i className="fa-solid fa-floppy-disk"></i> Guardar datos
                </button>
                {mensajePerfil.texto && (
                  <div style={{ marginTop: "14px", padding: "10px 14px", borderRadius: "8px", fontSize: "0.9rem", fontWeight: 500, backgroundColor: mensajePerfil.tipo === "exito" ? "#eafaf1" : "#fdecea", color: mensajePerfil.tipo === "exito" ? "#1e8449" : "#c0392b", border: mensajePerfil.tipo === "exito" ? "1px solid #a9dfbf" : "1px solid #f5c6c6" }}>
                    {mensajePerfil.texto}
                  </div>
                )}
              </form>
            </>
          )}

          {seccionActiva === "mis-compras" && (
            <>
              <h2 className="titulo-seccion">Mis compras</h2>
              {ordenes.length === 0 ? (
                <p className="estado-vacio">Aún no has realizado ninguna compra.</p>
              ) : (
                <div>
                  {ordenes.map((orden, index) => (
                    <div key={index} className="grupo-info" style={{ alignItems: "flex-start", flexDirection: "column", gap: "8px", marginBottom: "15px", border: "1px solid #eee", borderRadius: "8px", padding: "15px" }}>
                      <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span className="etiqueta-info">Orden: {orden.numero}</span>
                        <span style={{ fontWeight: "bold", color: "var(--color-exito, #27ae60)" }}>{orden.total}</span>
                      </div>
                      <div className="valor-info" style={{ fontSize: "0.9em", marginBottom: 0 }}>Fecha: {orden.fecha}</div>
                      <div className="valor-info" style={{ fontSize: "0.9em", marginBottom: 0 }}>Método: {orden.metodoPago?.toUpperCase()}</div>
                      <div className="valor-info" style={{ fontSize: "0.9em", marginBottom: 0 }}>Enviado a: {orden.direccion}, {orden.ciudad}</div>
                      {orden.productos && orden.productos.length > 0 && (
                        <div style={{ marginTop: "10px", width: "100%" }}>
                          <strong style={{ fontSize: "0.9em", display: "block", marginBottom: "8px" }}>Productos:</strong>
                          {orden.productos.map((prod, i) => (
                            <div key={i} style={{ fontSize: "0.85em", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #eee" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <img src={prod.imagen || "../assets/default-product.png"} alt={prod.nombre} style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "4px", border: "1px solid #ddd" }} />
                                <span>{prod.cantidad}x {prod.nombre}</span>
                              </div>
                              <span>${Math.round(prod.precio || 0).toLocaleString("es-CO")}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {seccionActiva === "datos-envio" && (
            <>
              <h2 className="titulo-seccion">Datos de Envío y Contacto</h2>
              <form onSubmit={guardarEnvio} className="formulario" style={{ marginTop: "15px" }}>
                <div style={{ marginBottom: "15px" }}>
                  <label style={{ display: "block", marginBottom: "5px", fontWeight: 500 }}>Nombre Completo</label>
                  <input type="text" value={usuario.nombre || ""} readOnly style={{ width: "100%", padding: "10px", border: "1px solid var(--border-color, #eee)", borderRadius: "8px", backgroundColor: "#f9f9f9", color: "#666" }} title="No se puede cambiar el nombre desde aquí" />
                </div>
                <div style={{ marginBottom: "15px" }}>
                  <label style={{ display: "block", marginBottom: "5px", fontWeight: 500 }}>Celular de Contacto *</label>
                  <input name="celular" type="tel" defaultValue={usuario.celular || ""} required placeholder="Ej. 300 123 4567" style={{ width: "100%", padding: "10px", border: "1px solid var(--border-color, #eee)", borderRadius: "8px" }} />
                </div>
                <div style={{ marginBottom: "15px" }}>
                  <label style={{ display: "block", marginBottom: "5px", fontWeight: 500 }}>Dirección de Envío *</label>
                  <input name="direccion" type="text" defaultValue={usuario.direccion || ""} required placeholder="Ej. Calle 123 # 45 - 67" style={{ width: "100%", padding: "10px", border: "1px solid var(--border-color, #eee)", borderRadius: "8px" }} />
                </div>
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", marginBottom: "5px", fontWeight: 500 }}>Ciudad *</label>
                  <input name="ciudad" type="text" defaultValue={usuario.ciudad || ""} required placeholder="Ej. Bogotá" style={{ width: "100%", padding: "10px", border: "1px solid var(--border-color, #eee)", borderRadius: "8px" }} />
                </div>
                <button type="submit" style={{ width: "100%", padding: "13px", borderRadius: "8px", background: "var(--primary-color, #84b814)", color: "#fff", border: "none", fontSize: "1rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                  <i className="fa-solid fa-floppy-disk"></i> Guardar datos
                </button>
                {mensajeEnvio.texto && (
                  <div style={{ marginTop: "14px", padding: "10px 14px", borderRadius: "8px", fontSize: "0.9rem", fontWeight: 500, backgroundColor: mensajeEnvio.tipo === "exito" ? "#eafaf1" : "#fdecea", color: mensajeEnvio.tipo === "exito" ? "#1e8449" : "#c0392b", border: mensajeEnvio.tipo === "exito" ? "1px solid #a9dfbf" : "1px solid #f5c6c6" }}>
                    {mensajeEnvio.texto}
                  </div>
                )}
              </form>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default Usuario;