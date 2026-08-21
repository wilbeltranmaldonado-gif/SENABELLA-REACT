// Esta vista permite ver y actualizar la información del perfil del usuario.

import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./usuario.css";
import {
  MUNICIPIOS_COLOMBIA_AGRUPADOS,
  TODOS_LOS_MUNICIPIOS,
} from "../../datos";

function Usuario() {
  const [seccionActiva, setSeccionActiva] = useState("mi-perfil");
  const [usuario, setUsuario] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("senabella_usuario")) || {};
    } catch {
      return {};
    }
  });
  const [ordenes, setOrdenes] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("senabella_user_orders")) || [];
    } catch {
      return [];
    }
  });
  const [mensajePerfil, setMensajePerfil] = useState({ texto: "", tipo: "" });
  const [mensajeEnvio, setMensajeEnvio] = useState({ texto: "", tipo: "" });
  const [modalLogoutAbierto, setModalLogoutAbierto] = useState(false);

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

    const sincronizarDatosUsuario = () => {
      try {
        const u = JSON.parse(localStorage.getItem("senabella_usuario")) || {};
        const ubicacionGuardada = localStorage.getItem("ubicacion");
        if (ubicacionGuardada) {
          u.ciudad = ubicacionGuardada;
        }
        setUsuario(u);
        const ords =
          JSON.parse(localStorage.getItem("senabella_user_orders")) || [];
        setOrdenes(ords);
      } catch (e) {
        console.error(e);
      }
    };

    sincronizarDatosUsuario();
    window.addEventListener("storage", sincronizarDatosUsuario);
    window.addEventListener(
      "senabella_orders_updated",
      sincronizarDatosUsuario,
    );
    window.addEventListener(
      "senabella_ubicacion_actualizada",
      sincronizarDatosUsuario,
    );
    window.addEventListener(
      "senabella-ubicacion-actualizada",
      sincronizarDatosUsuario,
    );
    return () => {
      window.removeEventListener("storage", sincronizarDatosUsuario);
      window.removeEventListener(
        "senabella_orders_updated",
        sincronizarDatosUsuario,
      );
      window.removeEventListener(
        "senabella_ubicacion_actualizada",
        sincronizarDatosUsuario,
      );
      window.removeEventListener(
        "senabella-ubicacion-actualizada",
        sincronizarDatosUsuario,
      );
    };
  }, [navigate]);

  const confirmarCerrarSesion = () => {
    localStorage.removeItem("senabella_sesion");
    localStorage.removeItem("senabella_rol");
    localStorage.removeItem("senabella_usuario");
    localStorage.removeItem("recordar_sesion");
    navigate("/");
    setTimeout(() => window.location.reload(), 100);
  };

  const guardarPerfil = (e) => {
    e.preventDefault();
    const nombre = e.target.elements.nombre.value.trim();
    const email = e.target.elements.email.value.trim();
    const celular = e.target.elements.celular.value.trim();
    const password = e.target.elements.password.value;

    if (!nombre) {
      setMensajePerfil({
        texto: "Por favor ingresa tu nombre completo.",
        tipo: "error",
      });
      return;
    }
    if (!email || !/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
      setMensajePerfil({
        texto: "Ingresa un correo electrónico válido.",
        tipo: "error",
      });
      return;
    }
    if (password && password.length < 6) {
      setMensajePerfil({
        texto: "La contraseña debe tener mínimo 6 caracteres.",
        tipo: "error",
      });
      return;
    }

    const actualizado = { ...usuario, nombre, email, celular };
    if (password) actualizado.password = password;

    localStorage.setItem("senabella_usuario", JSON.stringify(actualizado));
    setUsuario(actualizado);

    setMensajePerfil({
      texto: "✓ Datos de perfil guardados correctamente.",
      tipo: "exito",
    });
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
      setMensajeEnvio({
        texto: "Por favor ingresa tu celular de contacto.",
        tipo: "error",
      });
      return;
    }
    if (!direccion) {
      setMensajeEnvio({
        texto: "Por favor ingresa una dirección de envío.",
        tipo: "error",
      });
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
      ciudad,
    };

    localStorage.setItem("senabella_usuario", JSON.stringify(actualizado));
    setUsuario(actualizado);

    // Sincronizar en la base de datos de usuarios
    try {
      const usuariosBD = JSON.parse(
        localStorage.getItem("senabella_usuarios") || "[]",
      );
      const emailActual = (usuario.email || usuario.correo || "").toLowerCase();
      const idx = usuariosBD.findIndex(
        (u) => (u.correo || u.email || "").toLowerCase() === emailActual,
      );
      if (idx !== -1) {
        usuariosBD[idx] = {
          ...usuariosBD[idx],
          celular: actualizado.celular,
          direccion: actualizado.direccion,
          ciudad: actualizado.ciudad,
        };
        localStorage.setItem("senabella_usuarios", JSON.stringify(usuariosBD));
      }
    } catch (err) {
      console.warn(
        "Error al sincronizar datos de envío con senabella_usuarios:",
        err,
      );
    }

    if (ciudad) {
      localStorage.setItem("ubicacion", ciudad);
      window.dispatchEvent(new Event("senabella_ubicacion_actualizada"));
      window.dispatchEvent(new Event("senabella-ubicacion-actualizada"));
    }

    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new Event("senabella_orders_updated"));

    setMensajeEnvio({
      texto: "✓ Datos de envío guardados correctamente.",
      tipo: "exito",
    });
    if (window.SenabellaToast) {
      window.SenabellaToast(
        "Datos de envío actualizados",
        "fa-circle-check",
        "exito",
      );
    }
    setTimeout(() => setMensajeEnvio({ texto: "", tipo: "" }), 4000);
  };

  const handleCambioCiudad = (nuevaCiudad) => {
    setUsuario((prev) => ({ ...prev, ciudad: nuevaCiudad }));
    if (nuevaCiudad) {
      localStorage.setItem("ubicacion", nuevaCiudad);
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new Event("senabella_ubicacion_actualizada"));
      window.dispatchEvent(new Event("senabella-ubicacion-actualizada"));
    }
  };

  const menuItems = [
    { id: "mi-perfil", texto: "Mi Perfil", icono: "fa-user" },
    {
      id: "datos-envio",
      texto: "Datos de Envío y Contacto",
      icono: "fa-address-card",
    },
    { id: "mis-compras", texto: "Mis compras", icono: "fa-box-open" },
  ];

  return (
    <div className='contenedor contenedor-usuario'>
      <div className='migas-pan'>
        <Link to='/'>
          <i className='fa-solid fa-chevron-left'></i> Inicio
        </Link>
        <span className='migas-separador'>/</span>
        <span>Mi cuenta</span>
      </div>

      <h1 className='titulo-pagina'>Panel de Usuario</h1>

      <div className='diseno-perfil'>
        {/* BARRA LATERAL */}
        <nav className='barra-lateral'>
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`elemento-menu ${seccionActiva === item.id ? "activo" : ""}`}
              onClick={() => setSeccionActiva(item.id)}
            >
              <div className='elemento-menu-izquierda'>
                <i className={`fa-solid ${item.icono}`}></i>
                <span>{item.texto}</span>
              </div>
              <i className='fa-solid fa-chevron-right'></i>
            </button>
          ))}
          <button
            className='elemento-menu elemento-menu-logout'
            onClick={() => setModalLogoutAbierto(true)}
          >
            <div className='elemento-menu-izquierda'>
              <i className='fa-solid fa-power-off'></i>
              <span>Cerrar sesión</span>
            </div>
            <i className='fa-solid fa-chevron-right'></i>
          </button>
        </nav>

        {/* CONTENIDO PRINCIPAL */}
        <main className='tarjeta-contenido'>
          {seccionActiva === "mi-perfil" && (
            <div className='seccion-usuario-panel'>
              <h2 className='titulo-seccion'>Información Personal</h2>
              <form
                onSubmit={guardarPerfil}
                className='formulario-usuario'
                noValidate
              >
                <div className='usuario-grupo-campo'>
                  <label className='usuario-label'>Nombre completo *</label>
                  <input
                    name='nombre'
                    type='text'
                    value={usuario.nombre || ""}
                    onChange={(e) =>
                      setUsuario({ ...usuario, nombre: e.target.value })
                    }
                    required
                    placeholder='Ej. María García'
                    className='usuario-input'
                  />
                </div>
                <div className='usuario-grupo-campo'>
                  <label className='usuario-label'>Correo electrónico *</label>
                  <input
                    name='email'
                    type='email'
                    value={usuario.email || usuario.correo || ""}
                    onChange={(e) =>
                      setUsuario({
                        ...usuario,
                        email: e.target.value,
                        correo: e.target.value,
                      })
                    }
                    required
                    placeholder='Ej. maria@email.com'
                    className='usuario-input'
                  />
                </div>
                <div className='usuario-grupo-campo'>
                  <label className='usuario-label'>Celular de contacto</label>
                  <input
                    name='celular'
                    type='tel'
                    value={usuario.celular || ""}
                    onChange={(e) =>
                      setUsuario({ ...usuario, celular: e.target.value })
                    }
                    placeholder='Ej. 300 123 4567'
                    className='usuario-input'
                  />
                </div>
                <div className='usuario-grupo-campo'>
                  <label className='usuario-label'>
                    Nueva contraseña{" "}
                    <span className='usuario-hint'>
                      (dejar en blanco para no cambiarla)
                    </span>
                  </label>
                  <input
                    name='password'
                    type='password'
                    placeholder='Mínimo 6 caracteres'
                    className='usuario-input'
                  />
                </div>
                <button type='submit' className='usuario-boton-guardar'>
                  <i className='fa-solid fa-floppy-disk'></i> Guardar Cambios
                </button>
                {mensajePerfil.texto && (
                  <div
                    className={`usuario-alerta ${mensajePerfil.tipo === "exito" ? "alerta-exito" : "alerta-error"}`}
                  >
                    <i
                      className={`fa-solid ${mensajePerfil.tipo === "exito" ? "fa-circle-check" : "fa-triangle-exclamation"}`}
                    ></i>
                    <span>{mensajePerfil.texto}</span>
                  </div>
                )}
              </form>
            </div>
          )}

          {seccionActiva === "mis-compras" && (
            <div className='seccion-usuario-panel'>
              <h2 className='titulo-seccion'>Mis compras realizadas</h2>
              {ordenes.length === 0 ? (
                <div className='usuario-estado-vacio'>
                  <i className='fa-solid fa-box-open'></i>
                  <p>Aún no has realizado ninguna compra en Senabella.</p>
                  <Link to='/catalogo' className='usuario-boton-comprar'>
                    <i className='fa-solid fa-bag-shopping'></i> Explorar
                    Catálogo
                  </Link>
                </div>
              ) : (
                <div className='usuario-lista-ordenes'>
                  {ordenes.map((orden, index) => (
                    <div key={index} className='usuario-orden-card'>
                      <div className='usuario-orden-header'>
                        <div>
                          <span className='usuario-orden-numero'>
                            Orden: {orden.numero}
                          </span>
                          <span className='usuario-orden-fecha'>
                            {orden.fecha}
                          </span>
                        </div>
                        <span className='usuario-orden-total'>
                          {orden.total}
                        </span>
                      </div>
                      <div className='usuario-orden-detalles'>
                        <p>
                          <strong>Método de pago:</strong>{" "}
                          {String(orden.metodoPago || "").toUpperCase()}
                        </p>
                        <p>
                          <strong>Dirección de entrega:</strong>{" "}
                          {orden.direccion || "-"}, {orden.ciudad || ""}
                        </p>
                      </div>
                      {orden.productos && orden.productos.length > 0 && (
                        <div className='usuario-orden-productos'>
                          <strong>Productos en esta orden:</strong>
                          {orden.productos.map((prod, i) => (
                            <div
                              key={i}
                              className='usuario-orden-producto-fila'
                            >
                              <div className='usuario-prod-thumb-info'>
                                {prod.img || prod.imagen ? (
                                  <img
                                    src={prod.img || prod.imagen}
                                    alt={prod.nombre}
                                    className='usuario-prod-thumb'
                                  />
                                ) : (
                                  <div className='usuario-prod-thumb-vacio'>
                                    <i className='fa-solid fa-box'></i>
                                  </div>
                                )}
                                <span className='usuario-prod-nombre'>
                                  {prod.cantidad || 1}x {prod.nombre}
                                </span>
                              </div>
                              <span className='usuario-prod-precio'>
                                {prod.precioText ||
                                  `$ ${Math.round(prod.precio || 0).toLocaleString("es-CO")}`}
                              </span>
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
            <div className='seccion-usuario-panel'>
              <h2 className='titulo-seccion'>Datos de Envío y Contacto</h2>
              <form onSubmit={guardarEnvio} className='formulario-usuario'>
                <div className='usuario-grupo-campo'>
                  <label className='usuario-label'>Nombre del Titular</label>
                  <input
                    type='text'
                    value={usuario.nombre || ""}
                    readOnly
                    className='usuario-input usuario-input-readonly'
                    title='El nombre se modifica desde la pestaña Mi Perfil'
                  />
                </div>
                <div className='usuario-grupo-campo'>
                  <label className='usuario-label'>Celular de Contacto *</label>
                  <input
                    name='celular'
                    type='tel'
                    value={usuario.celular || ""}
                    onChange={(e) =>
                      setUsuario({ ...usuario, celular: e.target.value })
                    }
                    required
                    placeholder='Ej. 300 123 4567'
                    className='usuario-input'
                  />
                </div>
                <div className='usuario-grupo-campo'>
                  <label className='usuario-label'>Dirección de Envío *</label>
                  <input
                    name='direccion'
                    type='text'
                    value={usuario.direccion || ""}
                    onChange={(e) =>
                      setUsuario({ ...usuario, direccion: e.target.value })
                    }
                    required
                    placeholder='Ej. Calle 123 # 45 - 67, Apto 201'
                    className='usuario-input'
                  />
                </div>
                <div className='usuario-grupo-campo'>
                  <label className='usuario-label'>
                    Ciudad / Municipio de Entrega *
                  </label>
                  <select
                    name='ciudad'
                    value={usuario.ciudad || ""}
                    onChange={(e) => handleCambioCiudad(e.target.value)}
                    required
                    className='usuario-input usuario-select'
                  >
                    <option value=''>
                      -- Selecciona tu municipio o ciudad --
                    </option>
                    {MUNICIPIOS_COLOMBIA_AGRUPADOS.map((grupo) => (
                      <optgroup
                        key={grupo.departamento}
                        label={grupo.departamento}
                      >
                        {grupo.municipios.map((mun) => (
                          <option key={mun} value={mun}>
                            {mun}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                    {usuario.ciudad &&
                      !TODOS_LOS_MUNICIPIOS.includes(usuario.ciudad) && (
                        <option value={usuario.ciudad}>{usuario.ciudad}</option>
                      )}
                  </select>
                </div>
                <button type='submit' className='usuario-boton-guardar'>
                  <i className='fa-solid fa-floppy-disk'></i> Guardar Datos de
                  Envío
                </button>
                {mensajeEnvio.texto && (
                  <div
                    className={`usuario-alerta ${mensajeEnvio.tipo === "exito" ? "alerta-exito" : "alerta-error"}`}
                  >
                    <i
                      className={`fa-solid ${mensajeEnvio.tipo === "exito" ? "fa-circle-check" : "fa-triangle-exclamation"}`}
                    ></i>
                    <span>{mensajeEnvio.texto}</span>
                  </div>
                )}
              </form>
            </div>
          )}
        </main>
      </div>

      {/* MODAL DE CONFIRMACIÓN DE CIERRE DE SESIÓN */}
      {modalLogoutAbierto && (
        <div
          className='admin-modal-overlay'
          onClick={() => setModalLogoutAbierto(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 99999,
          }}
        >
          <div
            className='usuario-modal-confirmacion'
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "420px",
              width: "90%",
              borderRadius: "16px",
              background: "#ffffff",
              textAlign: "center",
              padding: "28px 24px",
              boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
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
                fontSize: "19px",
                color: "#0f172a",
                fontWeight: 700,
              }}
            >
              ¿Cerrar tu sesión?
            </h3>

            <p
              style={{
                margin: "0 0 24px 0",
                fontSize: "14px",
                color: "#64748b",
                lineHeight: "1.5",
              }}
            >
              Tendrás que volver a iniciar sesión para acceder a tu historial de
              compras y datos de envío.
            </p>

            <div
              style={{ display: "flex", gap: "12px", justifyContent: "center" }}
            >
              <button
                type='button'
                onClick={() => setModalLogoutAbierto(false)}
                style={{
                  flex: 1,
                  padding: "10px 16px",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                  background: "#f8fafc",
                  color: "#334155",
                  fontWeight: 600,
                  fontSize: "14px",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  transition: "all 0.2s ease",
                }}
              >
                <i className='fa-solid fa-xmark'></i> Cancelar
              </button>
              <button
                type='button'
                onClick={confirmarCerrarSesion}
                style={{
                  flex: 1,
                  padding: "10px 16px",
                  borderRadius: "8px",
                  border: "none",
                  background: "linear-gradient(135deg, #ef4444, #dc2626)",
                  color: "#ffffff",
                  fontWeight: 700,
                  fontSize: "14px",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  boxShadow: "0 4px 12px rgba(220, 38, 38, 0.3)",
                  transition: "all 0.2s ease",
                }}
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

export default Usuario;
