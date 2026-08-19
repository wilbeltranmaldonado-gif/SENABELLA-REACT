import { useState, useEffect, useMemo } from "react";
import "./tarjeta.css";
import logoImg from "../../assets/logo.png";

function Tarjeta() {
  const [formData, setFormData] = useState({
    nombreCompleto: "",
    documento: "",
    correo: "",
    telefono: "",
    programa: "",
    centro: "",
    terminos: false,
  });

  const [procesando, setProcesando] = useState(false);
  const [solicitudEnviada, setSolicitudEnviada] = useState(false);

  // Generar datos estables para las 20 partículas del hero
  const particulas = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: `${(i * 19 + 7) % 100}%`,
      top: `${(i * 29 + 13) % 100}%`,
      animationDelay: `${((i * 0.7) % 6).toFixed(1)}s`,
      animationDuration: `${(4 + ((i * 1.3) % 4)).toFixed(1)}s`,
    }));
  }, []);

  // Animación al hacer scroll (Intersection Observer)
  useEffect(() => {
    const elementos = document.querySelectorAll(
      ".beneficio-tarjeta, .stat-item, .paso-item"
    );

    const observador = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (entrada.isIntersecting) {
            entrada.target.style.opacity = "1";
            entrada.target.style.transform = "translateY(0)";
            observador.unobserve(entrada.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    elementos.forEach((el, index) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(30px)";
      el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
      observador.observe(el);
    });

    return () => observador.disconnect();
  }, [solicitudEnviada]);

  // Animación de contadores de estadísticas
  useEffect(() => {
    const animarContador = (elemento, valorFinal, duracion) => {
      const esNumero = /^\d/.test(valorFinal);
      if (!esNumero) return;

      const numero = parseInt(valorFinal.replace(/[^0-9]/g, ""), 10);
      const sufijo = valorFinal.replace(/[0-9,]/g, "");
      const tieneFormato = valorFinal.includes(",");

      let inicio = 0;
      const incremento = numero / (duracion / 16);
      const intervalo = setInterval(() => {
        inicio += incremento;
        if (inicio >= numero) {
          inicio = numero;
          clearInterval(intervalo);
        }

        let textoNumero = Math.floor(inicio).toString();
        if (tieneFormato) {
          textoNumero = Math.floor(inicio).toLocaleString("es-CO");
        }

        elemento.textContent = textoNumero + sufijo;
      }, 16);
    };

    const statsGrid = document.querySelector(".stats-grid");
    if (!statsGrid) return;

    const contadorObservador = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (entrada.isIntersecting) {
            const stats = entrada.target.querySelectorAll(".stat-numero");
            stats.forEach((stat) => {
              animarContador(stat, stat.textContent, 2000);
            });
            contadorObservador.unobserve(entrada.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    contadorObservador.observe(statsGrid);

    return () => contadorObservador.disconnect();
  }, []);

  // Manejadores de cambios con validaciones
  const handleNombreChange = (e) => {
    const limpio = e.target.value.replace(/[0-9]/g, "").slice(0, 32);
    setFormData((prev) => ({ ...prev, nombreCompleto: limpio }));
  };

  const handleDocumentoChange = (e) => {
    const limpio = e.target.value.replace(/[^0-9]/g, "").slice(0, 28);
    setFormData((prev) => ({ ...prev, documento: limpio }));
  };

  const handleCorreoChange = (e) => {
    setFormData((prev) => ({ ...prev, correo: e.target.value.slice(0, 50) }));
  };

  const handleTelefonoChange = (e) => {
    const limpio = e.target.value.replace(/[^0-9+\s-]/g, "").slice(0, 15);
    setFormData((prev) => ({ ...prev, telefono: limpio }));
  };

  const handleTelefonoKeyDown = (e) => {
    const permitidas = [
      "Backspace",
      "Delete",
      "Tab",
      "Escape",
      "Enter",
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown",
      "Home",
      "End",
    ];
    if (permitidas.includes(e.key) || e.ctrlKey || e.metaKey) return;
    if (!/^[0-9+\s-]$/.test(e.key)) {
      e.preventDefault();
    }
  };

  const handleTelefonoPaste = (e) => {
    e.preventDefault();
    const texto = (e.clipboardData || window.clipboardData).getData("text");
    const limpio = texto.replace(/[^0-9+\s-]/g, "").slice(0, 15);
    setFormData((prev) => ({ ...prev, telefono: limpio }));
  };

  const handleProgramaChange = (e) => {
    setFormData((prev) => ({ ...prev, programa: e.target.value.slice(0, 100) }));
  };

  const handleScrollToForm = (e) => {
    e.preventDefault();
    const formSection = document.getElementById("formulario-solicitud");
    if (formSection) {
      formSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setProcesando(true);

    setTimeout(() => {
      setProcesando(false);
      setSolicitudEnviada(true);
    }, 1500);
  };

  const nombrePreview = formData.nombreCompleto.trim()
    ? formData.nombreCompleto.trim().toUpperCase()
    : "JUAN PÉREZ";

  return (
    <main>
      {/* HERO SECTION */}
      <section className="tarjetas-hero">
        <div className="hero-particulas" id="hero-particulas">
          {particulas.map((p) => (
            <div
              key={p.id}
              className="hero-particula"
              style={{
                left: p.left,
                top: p.top,
                animationDelay: p.animationDelay,
                animationDuration: p.animationDuration,
              }}
            />
          ))}
        </div>
        <div className="hero-contenido">
          <span className="hero-etiqueta">
            <i className="fa-solid fa-id-card"></i>
            Exclusivo para estudiantes SENA
          </span>
          <h1>
            Tarjeta <span>Senabella</span>
          </h1>
          <p>
            Tu tarjeta exclusiva para estudiantes del SENA. Disfruta de
            beneficios, descuentos y mucho más en todos nuestros productos.
          </p>
          <a
            href="#formulario-solicitud"
            className="hero-boton"
            onClick={handleScrollToForm}
          >
            <i className="fa-solid fa-paper-plane"></i>
            Solicitar Ahora
          </a>
        </div>
      </section>

      {/* SECCIÓN BENEFICIOS */}
      <section className="beneficios-seccion" id="beneficios">
        <div className="beneficios-contenedor">
          <h2 className="seccion-titulo">
            Beneficios <span>Exclusivos</span>
          </h2>
          <p className="seccion-subtitulo">
            Descubre todo lo que tu Tarjeta Senabella puede hacer por ti
          </p>

          <div className="beneficios-grid">
            {/* Beneficio 1 */}
            <div className="beneficio-tarjeta">
              <div className="beneficio-icono">
                <i className="fa-solid fa-percent"></i>
              </div>
              <h3>Descuentos Exclusivos</h3>
              <p>
                Hasta un 30% de descuento en marcas seleccionadas y productos
                favoritos.
              </p>
              <div className="beneficio-badge">Popular</div>
            </div>

            {/* Beneficio 2 */}
            <div className="beneficio-tarjeta">
              <div className="beneficio-icono">
                <i className="fa-solid fa-truck-fast"></i>
              </div>
              <h3>Envío Gratis</h3>
              <p>
                Disfruta de envíos sin costo en todos los comercios aliados a nivel
                nacional.
              </p>
              <div className="beneficio-badge">Nuevo</div>
            </div>

            {/* Beneficio 3 */}
            <div className="beneficio-tarjeta">
              <div className="beneficio-icono">
                <i className="fa-solid fa-coins"></i>
              </div>
              <h3>Puntos por Compra</h3>
              <p>
                Acumula puntos con cada compra y canjéalos por productos o
                descuentos.
              </p>
            </div>

            {/* Beneficio 4 */}
            <div className="beneficio-tarjeta">
              <div className="beneficio-icono">
                <i className="fa-solid fa-star"></i>
              </div>
              <h3>Promociones Especiales</h3>
              <p>
                Acceso anticipado a ofertas y promociones exclusivas para
                miembros.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN VISTA PREVIA TARJETA */}
      <section className="preview-seccion">
        <div className="preview-contenedor">
          <h2 className="seccion-titulo">
            Tu Tarjeta <span>Digital</span>
          </h2>
          <p className="seccion-subtitulo">
            Lleva tus beneficios a donde quieras
          </p>

          <div className="tarjeta-preview-wrapper">
            <div className="tarjeta-fisica" id="tarjeta-fisica">
              {/* Decoraciones */}
              <div className="tarjeta-circulo tarjeta-circulo-1"></div>
              <div className="tarjeta-circulo tarjeta-circulo-2"></div>
              <div className="tarjeta-circulo tarjeta-circulo-3"></div>

              {/* Contenido de la tarjeta */}
              <div className="tarjeta-header">
                <div className="tarjeta-logo">
                  <img src={logoImg} alt="Senabella" height="30" />
                </div>
                <div className="tarjeta-tipo">
                  <i className="fa-solid fa-wifi"></i>
                </div>
              </div>

              <div className="tarjeta-chip">
                <i className="fa-solid fa-microchip"></i>
              </div>

              <div className="tarjeta-numero">
                **** &nbsp; **** &nbsp; **** &nbsp; 4281
              </div>

              <div className="tarjeta-footer">
                <div className="tarjeta-titular">
                  <span className="tarjeta-label">TITULAR</span>
                  <span className="tarjeta-valor" id="preview-nombre">
                    {nombrePreview}
                  </span>
                </div>
                <div className="tarjeta-vencimiento">
                  <span className="tarjeta-label">VENCE</span>
                  <span className="tarjeta-valor">12/28</span>
                </div>
                <div className="tarjeta-marca">
                  <i className="fa-solid fa-graduation-cap"></i>
                  SENA
                </div>
              </div>
            </div>
          </div>

          {/* Estadísticas */}
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-numero" id="stat-usuarios">
                5,000+
              </div>
              <div className="stat-texto">Estudiantes activos</div>
            </div>
            <div className="stat-item">
              <div className="stat-numero">150+</div>
              <div className="stat-texto">Comercios aliados</div>
            </div>
            <div className="stat-item">
              <div className="stat-numero">30%</div>
              <div className="stat-texto">Descuento máximo</div>
            </div>
            <div className="stat-item">
              <div className="stat-numero">24/7</div>
              <div className="stat-texto">Soporte disponible</div>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN FORMULARIO */}
      <section className="formulario-seccion" id="formulario-solicitud">
        <div className="formulario-contenedor">
          <div className="formulario-info">
            <h2 className="seccion-titulo texto-blanco">
              Solicita tu <span>Tarjeta</span>
            </h2>
            <p className="seccion-subtitulo texto-blanco-opaco">
              Completa el formulario y recibe tu tarjeta en tu centro de
              formación.
            </p>

            <div className="pasos-lista">
              <div className="paso-item">
                <div className="paso-numero">1</div>
                <div className="paso-texto">
                  <strong>Completa tus datos</strong>
                  <span>Llena el formulario con tu información personal</span>
                </div>
              </div>
              <div className="paso-item">
                <div className="paso-numero">2</div>
                <div className="paso-texto">
                  <strong>Verificación</strong>
                  <span>Validaremos tu matrícula con el SENA</span>
                </div>
              </div>
              <div className="paso-item">
                <div className="paso-numero">3</div>
                <div className="paso-texto">
                  <strong>Recibe tu tarjeta</strong>
                  <span>Recógela en tu centro de formación</span>
                </div>
              </div>
            </div>
          </div>

          <div className="formulario-card">
            {!solicitudEnviada ? (
              <form id="formulario-tarjeta" onSubmit={handleSubmit}>
                <div className="grupo-fila">
                  <div className="grupo-campo">
                    <label htmlFor="nombre-completo">
                      <i className="fa-solid fa-user"></i>
                      Nombre completo
                    </label>
                    <input
                      type="text"
                      id="nombre-completo"
                      placeholder="Ej: Juan Pérez García"
                      maxLength={32}
                      value={formData.nombreCompleto}
                      onChange={handleNombreChange}
                      required
                    />
                  </div>
                  <div className="grupo-campo">
                    <label htmlFor="documento">
                      <i className="fa-solid fa-id-card"></i>
                      Número de documento
                    </label>
                    <input
                      type="text"
                      id="documento"
                      placeholder="Ej: 1234567890"
                      inputMode="numeric"
                      maxLength={28}
                      value={formData.documento}
                      onChange={handleDocumentoChange}
                      required
                    />
                  </div>
                </div>

                <div className="grupo-fila">
                  <div className="grupo-campo">
                    <label htmlFor="correo">
                      <i className="fa-solid fa-envelope"></i>
                      Correo electrónico
                    </label>
                    <input
                      type="email"
                      id="correo"
                      placeholder="Ej: juan@ejemplo.com"
                      maxLength={50}
                      value={formData.correo}
                      onChange={handleCorreoChange}
                      required
                    />
                  </div>
                  <div className="grupo-campo">
                    <label htmlFor="telefono">
                      <i className="fa-solid fa-phone"></i>
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      id="telefono"
                      placeholder="Ej: 300 123 4567"
                      maxLength={15}
                      value={formData.telefono}
                      onChange={handleTelefonoChange}
                      onKeyDown={handleTelefonoKeyDown}
                      onPaste={handleTelefonoPaste}
                      required
                    />
                  </div>
                </div>

                <div className="grupo-campo">
                  <label htmlFor="programa">
                    <i className="fa-solid fa-book"></i>
                    Programa de formación SENA
                  </label>
                  <input
                    type="text"
                    id="programa"
                    placeholder="Ej: Tecnólogo en Análisis y Desarrollo de Software"
                    maxLength={100}
                    value={formData.programa}
                    onChange={handleProgramaChange}
                    required
                  />
                </div>

                <div className="grupo-campo">
                  <label htmlFor="centro">
                    <i className="fa-solid fa-building"></i>
                    Centro de formación
                  </label>
                  <select
                    id="centro"
                    value={formData.centro}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, centro: e.target.value }))
                    }
                    required
                  >
                    <option value="">Selecciona tu centro...</option>
                    <option value="servicios-financieros">
                      Centro de Servicios Financieros
                    </option>
                    <option value="gestion-mercados">
                      Centro de Gestión de Mercados
                    </option>
                    <option value="tecnologias-transporte">
                      Centro de Tecnologías del Transporte
                    </option>
                    <option value="gestion-industrial">
                      Centro de Gestión Industrial
                    </option>
                    <option value="electricidad-electronica">
                      Centro de Electricidad, Electrónica y Telecomunicaciones
                    </option>
                    <option value="manufactura-textil">
                      Centro de Manufactura en Textil y Cuero
                    </option>
                    <option value="servicios-salud">
                      Centro de Formación en Servicios de Salud
                    </option>
                    <option value="gestion-administrativa">
                      Centro de Gestión Administrativa
                    </option>
                  </select>
                </div>

                <div className="formulario-check">
                  <input
                    type="checkbox"
                    id="terminos"
                    checked={formData.terminos}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        terminos: e.target.checked,
                      }))
                    }
                    required
                  />
                  <label htmlFor="terminos">
                    Acepto los <a href="#!">términos y condiciones</a> y la{" "}
                    <a href="#!">política de privacidad</a>
                  </label>
                </div>

                <button
                  type="submit"
                  className="boton-solicitar"
                  id="boton-solicitar"
                  disabled={procesando}
                >
                  {procesando ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin"></i> Procesando...
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-paper-plane"></i> Solicitar mi
                      tarjeta
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="mensaje-exito mostrar" id="mensaje-exito">
                <div className="exito-icono">
                  <i className="fa-solid fa-circle-check"></i>
                </div>
                <h4>¡Solicitud enviada exitosamente!</h4>
                <p>
                  Revisaremos tus datos y te notificaremos al correo electrónico
                  proporcionado cuando tu tarjeta esté lista.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

export default Tarjeta;
