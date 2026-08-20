import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { validarLogin } from "../../utils/usuariosBd";
import "./login.css";

function Login() {
  const [formData, setFormData] = useState({
    correo: "",
    contrasena: ""
  });
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [recordarSesion, setRecordarSesion] = useState(false);
  const [mensajeError, setMensajeError] = useState("");
  const [mensajeExito, setMensajeExito] = useState("");
  const navigate = useNavigate();

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const manejarSubmit = (e) => {
    e.preventDefault();
    setMensajeError("");
    setMensajeExito("");

    const correo = formData.correo.trim();
    const contrasena = formData.contrasena;

    if (!correo) {
      setMensajeError("Por favor, ingresa tu correo electrónico.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      setMensajeError("Por favor, ingresa un correo electrónico válido.");
      return;
    }
    if (!contrasena) {
      setMensajeError("Por favor, ingresa tu contraseña.");
      return;
    }

    const resultado = validarLogin(correo, contrasena);

    if (!resultado.ok) {
      setMensajeError(resultado.mensaje);
      return;
    }

    // Login exitoso
    const usuario = resultado.usuario;
    const nombre = usuario.nombre || correo.split("@")[0];
    const rol = usuario.rol || "cliente";

    localStorage.setItem("senabella_sesion", "activa");
    localStorage.setItem("senabella_rol", rol);
    localStorage.setItem("senabella_usuario", JSON.stringify({
      id: usuario.id,
      nombre: nombre,
      email: usuario.correo,
      correo: usuario.correo,
      rol: rol,
    }));

    if (recordarSesion) {
      localStorage.setItem("recordar_sesion", "true");
    }

    if (rol === "administrador") {
      setMensajeExito(`¡Bienvenido, ${nombre}! Redirigiendo al panel de administración...`);
      setTimeout(() => { navigate("/administrador"); }, 1200);
    } else {
      setMensajeExito(`¡Bienvenido de nuevo, ${nombre}! Redirigiendo a tu perfil...`);
      setTimeout(() => { navigate("/usuario"); }, 1200);
    }
  };

  return (
    <div className="auth-page">
      {/* Botón regresar al inicio */}
      <Link to="/" className="boton-regresar" title="Volver al inicio">
        <i className="fa-solid fa-arrow-left"></i>
        <span>Inicio</span>
      </Link>

      {/* Contenedor principal de inicio de sesión */}
      <main className="contenedor-registro">
        <div className="tarjeta-registro">
          <h2>Bienvenido de nuevo</h2>
          <p className="subtitulo">Ingresa tus datos para acceder a tu cuenta de Senabella</p>

          <form onSubmit={manejarSubmit} className="formulario" noValidate>
            {/* Campo Correo */}
            <div className="grupo-campo">
              <label htmlFor="correoLogin">Correo electrónico</label>
              <div className="campo-wrapper">
                <input
                  type="email"
                  id="correoLogin"
                  name="correo"
                  value={formData.correo}
                  onChange={manejarCambio}
                  placeholder="nombre@ejemplo.com"
                  maxLength="32"
                  required
                />
                <i className="fa-solid fa-envelope icono-campo"></i>
              </div>
            </div>

            {/* Campo Contraseña */}
            <div className="grupo-campo">
              <label htmlFor="contrasenaLogin">Contraseña</label>
              <div className="campo-wrapper">
                <input
                  type={mostrarContrasena ? "text" : "password"}
                  id="contrasenaLogin"
                  name="contrasena"
                  value={formData.contrasena}
                  onChange={manejarCambio}
                  className="has-toggle"
                  placeholder="Ingresa tu contraseña"
                  maxLength="30"
                  required
                />
                <i className="fa-solid fa-lock icono-campo"></i>
                <button
                  type="button"
                  className="btn-toggle-pass"
                  onClick={() => setMostrarContrasena(!mostrarContrasena)}
                  title="Ver / Ocultar contraseña"
                >
                  <i className={`fa-solid ${mostrarContrasena ? "fa-eye-slash" : "fa-eye"}`}></i>
                </button>
              </div>
            </div>

            {/* Opciones adicionales */}
            <div className="grupo-opciones">
              <label className="opcion-checkbox">
                <input
                  type="checkbox"
                  checked={recordarSesion}
                  onChange={(e) => setRecordarSesion(e.target.checked)}
                />
                <span>Recordarme</span>
              </label>
            </div>

            {/* Alertas de estado */}
            {mensajeError && (
              <div className="mensaje-error" style={{ display: "flex" }}>
                <i className="fa-solid fa-triangle-exclamation"></i>
                <span>{mensajeError}</span>
              </div>
            )}
            {mensajeExito && (
              <div className="mensaje-exito" style={{ display: "flex" }}>
                <i className="fa-solid fa-circle-check"></i>
                <span>{mensajeExito}</span>
              </div>
            )}

            {/* Botón Iniciar Sesión */}
            <button type="submit" className="boton-registro">
              <i className="fa-solid fa-right-to-bracket"></i> Iniciar sesión
            </button>
          </form>

          <div className="pie-tarjeta">
            <p>¿No tienes una cuenta? <Link to="/registro">Crea tu cuenta aquí</Link></p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Login;