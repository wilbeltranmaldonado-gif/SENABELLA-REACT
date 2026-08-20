import { useState, useRef } from "react";
import "./contacto.css";

function Contacto() {
  // ==========================================
  // ESTADO DEL FORMULARIO
  // ==========================================
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [asunto, setAsunto] = useState("");
  const [mensaje, setMensaje] = useState("");

  const [errorTelefono, setErrorTelefono] = useState(false);
  const [contadorColor, setContadorColor] = useState("#888");

  // Estado de envío
  const [enviando, setEnviando] = useState(false);
  const [formularioEnviado, setFormularioEnviado] = useState(false);

  // Referencias a los inputs
  const nombreRef = useRef(null);
  const emailRef = useRef(null);
  const telefonoRef = useRef(null);
  const mensajeRef = useRef(null);

  // ==========================================
  // UTILIDADES DE VALIDACIÓN
  // ==========================================
  const limpiarTelefono = (valor) => valor.replace(/[^0-9+\s-]/g, "");

  const validarLongitudTelefono = (valor) => {
    const soloDigitos = valor.replace(/[^0-9]/g, "");
    return soloDigitos.length === 0 || (soloDigitos.length >= 7 && soloDigitos.length <= 15);
  };

  const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // ==========================================
  // HANDLERS DE INPUTS
  // ==========================================
  const handleNombreChange = (e) => {
    setNombre(e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]/g, "").slice(0, 80));
  };

  const handleTelefonoChange = (e) => {
    const valorLimpio = limpiarTelefono(e.target.value).slice(0, 15);
    setTelefono(valorLimpio);
    setErrorTelefono(valorLimpio.length > 0 && !validarLongitudTelefono(valorLimpio));
  };

  const handleTelefonoKeyDown = (e) => {
    const teclasFuncionales = [
      "Backspace", "Delete", "Tab", "Escape", "Enter",
      "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown",
      "Home", "End",
    ];
    if (teclasFuncionales.includes(e.key) || e.ctrlKey || e.metaKey) return;
    if (!/^[0-9+\s-]$/.test(e.key)) e.preventDefault();
  };

  const handleTelefonoPaste = (e) => {
    e.preventDefault();
    const texto = (e.clipboardData || window.clipboardData).getData("text");
    const limpio = limpiarTelefono(texto).slice(0, 15);
    setTelefono(limpio);
    setErrorTelefono(limpio.length > 0 && !validarLongitudTelefono(limpio));
  };

  const handleMensajeChange = (e) => {
    const len = e.target.value.length;
    setMensaje(e.target.value);
    const texto = len + " / 1000 caracteres";
    setContadorColor(len >= 900 ? "#e74c3c" : len >= 700 ? "#f39c12" : "#888");
    // contador texto se muestra vía estado derivado
    e.target.setAttribute("data-contador", texto);
  };

  // ==========================================
  // ENVIAR FORMULARIO
  // ==========================================
  const handleSubmit = (e) => {
    e.preventDefault();

    if (nombre.trim().length < 3) {
      alert("El nombre debe tener al menos 3 caracteres.");
      nombreRef.current?.focus();
      return;
    }

    if (!validarEmail(email.trim())) {
      alert("Por favor ingresa un correo electrónico válido.");
      emailRef.current?.focus();
      return;
    }

    if (telefono.trim().length > 0 && !validarLongitudTelefono(telefono.trim())) {
      alert("El número de teléfono debe tener entre 7 y 15 dígitos.");
      telefonoRef.current?.focus();
      return;
    }

    if (mensaje.trim().length < 10) {
      alert("El mensaje es muy corto. Por favor detalla un poco más tu consulta.");
      mensajeRef.current?.focus();
      return;
    }

    // Simular envío (1.5 segundos)
    setEnviando(true);

    setTimeout(() => {
      setEnviando(false);
      setFormularioEnviado(true);

      // Restaurar estado del formulario después de 5 segundos
      setTimeout(() => {
        setFormularioEnviado(false);
        setNombre("");
        setEmail("");
        setTelefono("");
        setAsunto("");
        setMensaje("");
        setErrorTelefono(false);
        setContadorColor("#888");
        if (mensajeRef.current) {
          mensajeRef.current.setAttribute("data-contador", "0 / 1000 caracteres");
        }
      }, 5000);
    }, 1500);
  };

  // ==========================================
  // COPIAR AL PORTAPAPELES EN CANALES
  // ==========================================
  const copiarAlPortapapeles = (texto, tipo) => {
    navigator.clipboard
      .writeText(texto)
      .then(() => {
        alert("¡" + tipo + " copiado al portapapeles: " + texto + "!");
      })
      .catch(() => {
        console.error("Error al copiar al portapapeles.");
      });
  };

  const manejarClickCanal = (e, texto, tipo) => {
    if (e.target.tagName !== "A" && e.target.closest("a") === null) {
      e.preventDefault();
      copiarAlPortapapeles(texto, tipo);
    }
  };

  // ==========================================
  // RENDER
  // ==========================================
  const contadorMensaje = mensaje.length + " / 1000 caracteres";

  return (
    <>
      {/* HERO / BANNER SUPERIOR */}
      <section className="contacto-hero">
        <div className="contacto-hero-contenido">
          <span className="badge-hero">
            <i className="fa-solid fa-headset"></i> ATENCIÓN AL CLIENTE
          </span>
          <h1>
            ¿Necesitas ayuda? <span>Contáctanos</span>
          </h1>
          <p>
            Estamos aquí para resolver tus dudas, escuchar tus sugerencias y
            ayudarte con tus compras en Senabella.
          </p>
        </div>
      </section>

      {/* CONTENEDOR PRINCIPAL */}
      <main className="contacto-contenedor">
        {/* TARJETAS DE CANALES DE CONTACTO */}
        <section className="canales-contacto">
          <div
            className="canal-tarjeta"
            id="canal-telefono"
            onClick={(e) => manejarClickCanal(e, "(601) 345 6789", "Teléfono")}
          >
            <div className="canal-icono">
              <i className="fa-solid fa-phone"></i>
            </div>
            <h3>Llámanos</h3>
            <p>
              Atención personalizada de lunes a sábado. Nuestros asesores están
              listos para ayudarte.
            </p>
            <a href="tel:+576013456789" className="canal-enlace">
              (601) 345 6789
              <i className="fa-solid fa-arrow-right"></i>
            </a>
          </div>

          <div
            className="canal-tarjeta"
            id="canal-whatsapp"
            onClick={(e) => manejarClickCanal(e, "+57 300 123 4567", "WhatsApp")}
          >
            <div className="canal-icono">
              <i className="fa-brands fa-whatsapp"></i>
            </div>
            <h3>WhatsApp</h3>
            <p>
              Escríbenos directamente por WhatsApp y recibe respuesta rápida a
              todas tus consultas.
            </p>
            <a
              href="https://wa.me/573001234567"
              target="_blank"
              rel="noopener noreferrer"
              className="canal-enlace"
            >
              +57 300 123 4567
              <i className="fa-solid fa-arrow-right"></i>
            </a>
          </div>

          <div
            className="canal-tarjeta"
            id="canal-email"
            onClick={(e) => manejarClickCanal(e, "soporte@senabella.com", "Correo")}
          >
            <div className="canal-icono">
              <i className="fa-solid fa-envelope"></i>
            </div>
            <h3>Correo electrónico</h3>
            <p>
              Envíanos un email y te responderemos en un plazo máximo de 24
              horas hábiles.
            </p>
            <a href="mailto:soporte@senabella.com" className="canal-enlace">
              soporte@senabella.com
              <i className="fa-solid fa-arrow-right"></i>
            </a>
          </div>
        </section>

        {/* FORMULARIO + MAPA Y HORARIO */}
        <section className="contacto-grid">
          {/* FORMULARIO DE CONTACTO */}
          <div className="formulario-tarjeta">
            <h2>Envíanos un mensaje</h2>
            <p className="formulario-subtitulo">
              Completa el formulario y nos pondremos en contacto contigo pronto.
            </p>

            <form
              id="formulario-contacto"
              onSubmit={handleSubmit}
              style={{ display: formularioEnviado ? "none" : "block" }}
            >
              <div className="grupo-fila">
                <div className="grupo-campo">
                  <label htmlFor="nombre">Nombre completo</label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    placeholder="Ej: María García"
                    required
                    maxLength="80"
                    autoComplete="name"
                    value={nombre}
                    onChange={handleNombreChange}
                    ref={nombreRef}
                  />
                </div>

                <div className="grupo-campo">
                  <label htmlFor="email">Correo electrónico</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="tu@correo.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    ref={emailRef}
                  />
                </div>
              </div>

              <div className="grupo-fila">
                <div className="grupo-campo">
                  <label htmlFor="telefono">Teléfono (opcional)</label>
                  <input
                    type="tel"
                    id="telefono"
                    name="telefono"
                    placeholder="+57 300 000 0000"
                    maxLength="15"
                    minLength="7"
                    inputMode="numeric"
                    autoComplete="tel"
                    value={telefono}
                    onChange={handleTelefonoChange}
                    onKeyDown={handleTelefonoKeyDown}
                    onPaste={handleTelefonoPaste}
                    ref={telefonoRef}
                    style={{
                      borderColor: errorTelefono ? "#e74c3c" : "",
                    }}
                  />
                  <small
                    className="campo-ayuda"
                    id="error-telefono"
                    style={{
                      color: "#e74c3c",
                      display: errorTelefono ? "block" : "none",
                    }}
                  >
                    ⚠ Solo se permiten números, +, espacios y guiones. Mínimo 7 y
                    máximo 15 caracteres.
                  </small>
                </div>

                <div className="grupo-campo">
                  <label htmlFor="asunto">Asunto</label>
                  <select
                    id="asunto"
                    name="asunto"
                    required
                    value={asunto}
                    onChange={(e) => setAsunto(e.target.value)}
                  >
                    <option value="" disabled>
                      Selecciona un asunto
                    </option>
                    <option value="pedido">Información sobre un pedido</option>
                    <option value="devolucion">Cambios y devoluciones</option>
                    <option value="producto">Consulta sobre un producto</option>
                    <option value="pago">Problemas con el pago</option>
                    <option value="sugerencia">Sugerencias</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
              </div>

              <div className="grupo-campo">
                <label htmlFor="mensaje">Tu mensaje</label>
                <textarea
                  id="mensaje"
                  name="mensaje"
                  placeholder="Cuéntanos cómo podemos ayudarte..."
                  required
                  maxLength="1000"
                  value={mensaje}
                  onChange={handleMensajeChange}
                  ref={mensajeRef}
                ></textarea>
                <small
                  className="campo-ayuda"
                  id="contador-mensaje"
                  style={{ color: contadorColor, fontSize: "0.78rem" }}
                >
                  {contadorMensaje}
                </small>
              </div>

              <button
                type="submit"
                className="boton-enviar"
                id="btn-enviar"
                disabled={enviando}
              >
                {enviando ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin"></i> Enviando...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-paper-plane"></i> Enviar mensaje
                  </>
                )}
              </button>
            </form>

            {/* Mensaje de éxito */}
            <div
              className={`mensaje-exito ${formularioEnviado ? "mostrar" : ""}`}
              id="mensaje-exito"
            >
              <i className="fa-solid fa-circle-check"></i>
              <h4>¡Mensaje enviado con éxito!</h4>
              <p>
                Nuestro equipo te responderá en un plazo máximo de 24 horas
                hábiles.
              </p>
            </div>
          </div>

          {/* PANEL DERECHO: MAPA + HORARIO */}
          <div className="info-panel">
            {/* Mapa */}
            <div className="mapa-tarjeta">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.9098253097097!2d-74.0720872!3d4.6097102!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f99a7a1e98d73%3A0x4ba4dd7a22f06e18!2sBogot%C3%A1%2C%20Colombia!5e0!3m2!1ses!2s!4v1700000000000!5m2!1ses!2s"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación de Senabella"
              ></iframe>
              <div className="mapa-info">
                <h3>Nuestra sede principal</h3>

                <div className="dato-ubicacion">
                  <i className="fa-solid fa-location-dot"></i>
                  <span>
                    Carrera 7 #32-16, Centro Comercial Senabella, Bogotá D.C.,
                    Colombia
                  </span>
                </div>

                <div className="dato-ubicacion">
                  <i className="fa-solid fa-phone"></i>
                  <span>(601) 345 6789</span>
                </div>

                <div className="dato-ubicacion">
                  <i className="fa-solid fa-envelope"></i>
                  <span>soporte@senabella.com</span>
                </div>
              </div>
            </div>

            {/* Horario */}
            <div className="horario-tarjeta">
              <h3>
                <i className="fa-regular fa-clock"></i>
                Horario de atención
              </h3>

              <div className="fila-horario">
                <span className="dia">Lunes - Viernes</span>
                <span className="hora">8:00 AM - 6:00 PM</span>
              </div>

              <div className="fila-horario">
                <span className="dia">Sábado</span>
                <span className="hora">9:00 AM - 2:00 PM</span>
              </div>

              <div className="fila-horario">
                <span className="dia">Domingo y festivos</span>
                <span className="hora cerrado">Cerrado</span>
              </div>
            </div>
          </div>
        </section>

        {/* PREGUNTAS FRECUENTES */}
        <section className="faq-seccion">
          <h2>Preguntas frecuentes</h2>

          <div className="faq-grid">
            <FaqItem texto="¿Cuánto tiempo tarda un envío?">
              Los envíos dentro de Bogotá se realizan en 1 a 3 días hábiles. Para
              otras ciudades de Colombia, el tiempo estimado es de 3 a 7 días
              hábiles dependiendo de la ubicación.
            </FaqItem>

            <FaqItem texto="¿Cómo puedo hacer una devolución?">
              Tienes hasta 30 días calendario para solicitar una devolución.
              Ingresa a "Mi cuenta" &gt; "Mis pedidos" y selecciona el producto
              que deseas devolver. Nuestro equipo coordinará la recolección.
            </FaqItem>

            <FaqItem texto="¿Qué métodos de pago aceptan?">
              Aceptamos tarjetas de crédito y débito (Visa, Mastercard, American
              Express), PSE, efectivo en puntos Efecty y Baloto, y pagos contra
              entrega en ciudades seleccionadas.
            </FaqItem>

            <FaqItem texto="¿Cómo puedo rastrear mi pedido?">
              Una vez confirmado tu pedido, recibirás un correo con el número de
              seguimiento. También puedes rastrearlo desde "Mi cuenta" &gt; "Mis
              pedidos" en nuestra página.
            </FaqItem>
          </div>
        </section>
      </main>
    </>
  );
}

// ==========================================
// COMPONENTE FAQ (ACORDEÓN)
// ==========================================
function FaqItem({ texto, children }) {
  const [activo, setActivo] = useState(false);

  return (
    <div
      className={`faq-item ${activo ? "activo" : ""}`}
      onClick={() => setActivo(!activo)}
    >
      <div className="faq-pregunta">
        <span>{texto}</span>
        <i className="fa-solid fa-chevron-down"></i>
      </div>
      <div className="faq-respuesta">{children}</div>
    </div>
  );
}

export default Contacto;
