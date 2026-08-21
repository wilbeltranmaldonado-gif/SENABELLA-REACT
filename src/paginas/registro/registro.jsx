// Este componente registra nuevos usuarios en la plataforma.

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { crearUsuario, buscarPorCorreo } from "../../utils/usuariosBd";
import "./registro.css";

function Registro() {
  const [formData, setFormData] = useState({
    nombreCompleto: "",
    correoElectronico: "",
    celular: "",
    contrasena: "",
    confirmarContrasena: "",
  });

  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);

  const [mensajeError, setMensajeError] = useState("");
  const [mensajeExito, setMensajeExito] = useState("");

  const navigate = useNavigate();

  const [modoOscuro, setModoOscuro] = useState(
    localStorage.getItem("modoOscuro") === "activado",
  );

  useEffect(() => {
    if (localStorage.getItem("modoOscuro") === "activado") {
      document.body.classList.add("modo-oscuro");
    } else {
      document.body.classList.remove("modo-oscuro");
    }
  }, []);

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

  const manejarCambio = (e) => {
    const { id, value } = e.target;

    // Restricciones de entrada
    let valorFinal = value;
    if (id === "nombreCompleto") {
      valorFinal = value.replace(/[0-9]/g, "");
    } else if (id === "celular") {
      valorFinal = value.replace(/[^0-9\s]/g, "");
    }

    setFormData({
      ...formData,
      [id]: valorFinal,
    });
  };

  const calcularFortaleza = (pass) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const fortaleza = calcularFortaleza(formData.contrasena);

  let fortalezaEstilos = {
    width: "0%",
    bg: "transparent",
    texto: "Ingresa una contraseña",
    color: "var(--color-texto-secundario)",
  };
  if (formData.contrasena.length > 0) {
    if (fortaleza < 2) {
      fortalezaEstilos = {
        width: "33%",
        bg: "var(--color-error)",
        texto: "Contraseña Débil",
        color: "var(--color-error)",
      };
    } else if (fortaleza < 4) {
      fortalezaEstilos = {
        width: "66%",
        bg: "var(--color-advertencia)",
        texto: "Contraseña Media",
        color: "var(--color-advertencia)",
      };
    } else {
      fortalezaEstilos = {
        width: "100%",
        bg: "var(--color-exito)",
        texto: "Contraseña Fuerte",
        color: "var(--color-exito)",
      };
    }
  }

  const manejarSubmit = (e) => {
    e.preventDefault();
    setMensajeError("");
    setMensajeExito("");

    const patronSoloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;

    if (!formData.nombreCompleto.trim()) {
      setMensajeError("Por favor, ingresa tu nombre completo.");
      return;
    }
    if (!patronSoloLetras.test(formData.nombreCompleto.trim())) {
      setMensajeError("El nombre solo puede contener letras y espacios.");
      return;
    }
    if (
      !formData.correoElectronico.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correoElectronico)
    ) {
      setMensajeError("Por favor, ingresa un correo electrónico válido.");
      return;
    }
    if (buscarPorCorreo(formData.correoElectronico.trim())) {
      setMensajeError("Ya existe una cuenta con ese correo electrónico.");
      return;
    }
    if (!formData.celular.trim()) {
      setMensajeError("Por favor, ingresa tu número de celular.");
      return;
    }
    if (formData.contrasena.length < 8) {
      setMensajeError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (formData.contrasena !== formData.confirmarContrasena) {
      setMensajeError("Las contraseñas no coinciden.");
      return;
    }

    const res = crearUsuario({
      nombre: formData.nombreCompleto,
      correo: formData.correoElectronico,
      password: formData.contrasena,
      celular: formData.celular,
      rol: "cliente",
    });

    if (res.ok) {
      setMensajeExito(
        "¡Cuenta creada con éxito! Redirigiendo al inicio de sesión...",
      );
      setFormData({
        nombreCompleto: "",
        correoElectronico: "",
        celular: "",
        contrasena: "",
        confirmarContrasena: "",
      });
      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } else {
      setMensajeError(res.mensaje);
    }
  };

  return (
    <div className='auth-page'>
      <Link to='/' className='boton-regresar' title='Volver al inicio'>
        <i className='fa-solid fa-arrow-left'></i>
        <span>Inicio</span>
      </Link>

      <button
        className='btn-modo-oscuro-flotante'
        onClick={alternarModoOscuro}
        title='Alternar Modo Oscuro'
      >
        <i className={modoOscuro ? "fa-solid fa-sun" : "fa-solid fa-moon"}></i>
      </button>

      <main className='contenedor-registro'>
        <div className='tarjeta-registro'>
          <h2>Crea tu cuenta</h2>
          <p className='subtitulo'>
            Ingresa tus datos para comprar en Senabella
          </p>

          <form onSubmit={manejarSubmit} className='formulario' noValidate>
            <div className='grupo-campo'>
              <label htmlFor='nombreCompleto'>Nombre completo</label>
              <div className='campo-wrapper'>
                <input
                  type='text'
                  id='nombreCompleto'
                  value={formData.nombreCompleto}
                  onChange={manejarCambio}
                  placeholder='Ej. Ana García'
                  maxLength='32'
                  required
                />
                <i className='fa-solid fa-user icono-campo'></i>
              </div>
            </div>

            <div className='grupo-campo'>
              <label htmlFor='correoElectronico'>Correo electrónico</label>
              <div className='campo-wrapper'>
                <input
                  type='email'
                  id='correoElectronico'
                  value={formData.correoElectronico}
                  onChange={manejarCambio}
                  placeholder='nombre@ejemplo.com'
                  maxLength='32'
                  required
                />
                <i className='fa-solid fa-envelope icono-campo'></i>
              </div>
            </div>

            <div className='grupo-campo'>
              <label htmlFor='celular'>Número de celular</label>
              <div className='campo-wrapper'>
                <input
                  type='tel'
                  id='celular'
                  value={formData.celular}
                  onChange={manejarCambio}
                  placeholder='Ej. 300 123 4567'
                  maxLength='12'
                  required
                />
                <i className='fa-solid fa-phone icono-campo'></i>
              </div>
            </div>

            <div className='grupo-campo'>
              <label htmlFor='contrasena'>Contraseña</label>
              <div className='campo-wrapper'>
                <input
                  type={mostrarContrasena ? "text" : "password"}
                  id='contrasena'
                  value={formData.contrasena}
                  onChange={manejarCambio}
                  className='has-toggle'
                  placeholder='Mínimo 8 caracteres'
                  maxLength='32'
                  required
                />
                <i className='fa-solid fa-lock icono-campo'></i>
                <button
                  type='button'
                  className='btn-toggle-pass'
                  onClick={() => setMostrarContrasena(!mostrarContrasena)}
                >
                  <i
                    className={`fa-solid ${mostrarContrasena ? "fa-eye-slash" : "fa-eye"}`}
                  ></i>
                </button>
              </div>
              <div className='fortaleza-contenedor'>
                <div className='fortaleza-barra'>
                  <div
                    className='fortaleza-progreso'
                    style={{
                      width: fortalezaEstilos.width,
                      backgroundColor: fortalezaEstilos.bg,
                    }}
                  ></div>
                </div>
                <span
                  className='fortaleza-texto'
                  style={{ color: fortalezaEstilos.color }}
                >
                  {fortalezaEstilos.texto}
                </span>
              </div>
            </div>

            <div className='grupo-campo'>
              <label htmlFor='confirmarContrasena'>Confirmar contraseña</label>
              <div className='campo-wrapper'>
                <input
                  type={mostrarConfirmar ? "text" : "password"}
                  id='confirmarContrasena'
                  value={formData.confirmarContrasena}
                  onChange={manejarCambio}
                  className='has-toggle'
                  placeholder='Repite tu contraseña'
                  maxLength='32'
                  required
                />
                <i className='fa-solid fa-shield-halved icono-campo'></i>
                <button
                  type='button'
                  className='btn-toggle-pass'
                  onClick={() => setMostrarConfirmar(!mostrarConfirmar)}
                >
                  <i
                    className={`fa-solid ${mostrarConfirmar ? "fa-eye-slash" : "fa-eye"}`}
                  ></i>
                </button>
              </div>
              {formData.confirmarContrasena.length > 0 && (
                <span
                  className={`coincidencia-texto ${formData.contrasena === formData.confirmarContrasena ? "valido" : "invalido"}`}
                >
                  <i
                    className={`fa-solid ${formData.contrasena === formData.confirmarContrasena ? "fa-circle-check" : "fa-circle-xmark"}`}
                  ></i>
                  {formData.contrasena === formData.confirmarContrasena
                    ? " Las contraseñas coinciden"
                    : " Las contraseñas no coinciden"}
                </span>
              )}
            </div>

            {mensajeError && (
              <div className='mensaje-error' style={{ display: "flex" }}>
                <i className='fa-solid fa-triangle-exclamation'></i>{" "}
                <span>{mensajeError}</span>
              </div>
            )}
            {mensajeExito && (
              <div className='mensaje-exito' style={{ display: "flex" }}>
                <i className='fa-solid fa-circle-check'></i>{" "}
                <span>{mensajeExito}</span>
              </div>
            )}

            <button type='submit' className='boton-registro'>
              <i className='fa-solid fa-user-plus'></i> Registrarme
            </button>
          </form>

          <div className='pie-tarjeta'>
            <p>
              ¿Ya tienes una cuenta? <Link to='/login'>Inicia sesión</Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Registro;
