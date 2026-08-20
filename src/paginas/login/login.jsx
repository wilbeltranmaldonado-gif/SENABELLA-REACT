import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const toggleContrasena = () => {
    setMostrarContrasena(!mostrarContrasena);
  };

  const manejarSubmit = (e) => {
    e.preventDefault();
    setMensajeError("");
    setMensajeExito("");

    // Validación básica
    if (!formData.correo || !formData.contrasena) {
      setMensajeError("Por favor completa todos los campos");
      return;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.correo)) {
      setMensajeError("Por favor ingresa un correo válido");
      return;
    }

    // Simular autenticación (en producción esto iría al backend)
    try {
      const usuarios = JSON.parse(localStorage.getItem("senabella_usuarios_db") || "[]");
      const usuario = usuarios.find(u => u.email === formData.correo && u.password === formData.contrasena);

      if (usuario) {
        // Login exitoso
        localStorage.setItem("senabella_sesion", "activa");
        localStorage.setItem("senabella_rol", usuario.rol);
        localStorage.setItem("senabella_usuario", JSON.stringify({
          id: usuario.id,
          nombre: usuario.nombre,
          email: usuario.email,
          rol: usuario.rol
        }));

        if (recordarSesion) {
          localStorage.setItem("recordar_sesion", "true");
        }

        setMensajeExito("¡Inicio de sesión exitoso!");

        // Redirigir según el rol
        setTimeout(() => {
          if (usuario.rol === "administrador") {
            navigate("/administrador");
          } else {
            navigate("/usuario");
          }
        }, 1000);
      } else {
        setMensajeError("Correo o contraseña incorrectos");
      }
    } catch (error) {
      setMensajeError("Error al iniciar sesión. Por favor intenta nuevamente.");
    }
  };

  return (
    <div className="login-page">
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

          <form onSubmit={manejarSubmit} className="formulario" novalidate>
            {/* Campo Correo */}
            <div className="grupo-campo">
              <label htmlFor="correoLogin">Correo electrónico</label>
              <div className="campo-wrapper">
                <input
                  type="email"
                  id="correoLogin"
                  name="correo"
                  placeholder="nombre@ejemplo.com"
                  maxLength="32"
                  value={formData.correo}
                  onChange={manejarCambio}
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
                  className="has-toggle"
                  placeholder="Ingresa tu contraseña"
                  maxLength="30"
                  value={formData.contrasena}
                  onChange={manejarCambio}
                  required
                />
                <i className="fa-solid fa-lock icono-campo"></i>
                <button
                  type="button"
                  className="btn-toggle-pass"
                  onClick={toggleContrasena}
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
                  id="recordarSesion"
                  checked={recordarSesion}
                  onChange={(e) => setRecordarSesion(e.target.checked)}
                />
                <span>Recordarme</span>
              </label>
            </div>

            {/* Alertas de estado */}
            {mensajeError && (
              <div className="mensaje-error">
                <i className="fa-solid fa-circle-exclamation"></i>
                {mensajeError}
              </div>
            )}
            {mensajeExito && (
              <div className="mensaje-exito">
                <i className="fa-solid fa-circle-check"></i>
                {mensajeExito}
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