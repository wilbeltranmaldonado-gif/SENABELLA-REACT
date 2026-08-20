// Esta vista ofrece ayuda, dudas frecuentes y soporte al cliente.

import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./soporte.css";
import articulosDatos from "../../datos/articulosSoporte";

// ==========================================
// CATEGORÍAS ESTÁTICAS (preservadas del HTML original)
// ==========================================
const categorias = [
  { icono: "fa-solid fa-box-open", titulo: "Mis Pedidos", desc: "Rastreo, modificaciones y estado de compras" },
  { icono: "fa-solid fa-truck-fast", titulo: "Envíos y Entregas", desc: "Tiempos, fletes express y cobertura nacional" },
  { icono: "fa-solid fa-rotate-left", titulo: "Cambios y Devoluciones", desc: "Políticas de retracto, tallas y devoluciones" },
  { icono: "fa-solid fa-credit-card", titulo: "Pagos y Facturación", desc: "PSE, tarjetas, Addi, Efecty y facturación" },
  { icono: "fa-solid fa-user", titulo: "Mi Cuenta", desc: "Guía de tallas, contraseñas y datos personales" },
  { icono: "fa-solid fa-tags", titulo: "Promociones y Cupones", desc: "Redención de códigos, ofertas y gift cards" },
  { icono: "fa-solid fa-shield-halved", titulo: "Garantías y Calidad", desc: "Defectos de fábrica y cuidado de prendas" },
  { icono: "fa-solid fa-store", titulo: "Tiendas Físicas", desc: "Ubicaciones, horarios y compras en boutique" },
];

// ==========================================
// PREGUNTAS FRECUENTES (preservadas del HTML original)
// ==========================================
const preguntasFAQ = [
  { texto: "¿Dónde encuentro mi número de guía?", respuesta: "Tu número de guía se enviará automáticamente a tu correo electrónico una vez el pedido haya sido despachado. También puedes encontrarlo en \"Mi Cuenta\" > \"Mis Pedidos\"." },
  { texto: "¿Puedo cancelar o editar un pedido?", respuesta: "Sí, puedes solicitar cambios o cancelar tu pedido dentro de los primeros 30 minutos de haber realizado la compra antes de que entre a preparación." },
  { texto: "¿Los productos tienen garantía?", respuesta: "Todos nuestros productos cuentan con garantía de 30 días calendario por defectos de fábrica. Conserva tu factura para hacerla efectiva." },
  { texto: "¿Qué medios de pago puedo utilizar?", respuesta: "Aceptamos tarjetas de crédito/débito, PSE (Nequi/Daviplata), Addi (cuotas sin tarjeta) y pago en efectivo en puntos Efecty." },
  { texto: "¿Cuánto demora un envío nacional?", respuesta: "En ciudades principales como Bogotá, Medellín y Cali el tiempo es de 1 a 3 días hábiles. En el resto del país de 3 a 5 días hábiles." },
  { texto: "¿Cómo solicito un cambio de talla?", respuesta: "Tienes hasta 30 días calendario tras recibir tu pedido. Ingresa a la sección de soporte o contáctanos para generar tu autorización de cambio." },
  { texto: "¿Dónde están ubicadas las tiendas físicas?", respuesta: "Contamos con boutiques físicas en Bogotá (C.C. Unicentro), Medellín (C.C. El Tesoro) y Cali (C.C. Chipichape)." },
  { texto: "¿Cómo aplico un cupón de descuento?", respuesta: "En la pantalla de pago (Checkout), introduce tu código en la casilla \"¿Tienes un cupón?\" y presiona \"Aplicar\"." },
];

function Soporte() {
  // ==========================================
  // ESTADO DE BÚSQUEDA Y RENDERIZADO
  // ==========================================
  const location = useLocation();
  const [busqueda, setBusqueda] = useState(location.state?.busqueda || "");
  const [resultadoArticulos, setResultadoArticulos] = useState(articulosDatos.slice(0, 6));
  const [tituloSeccion, setTituloSeccion] = useState("Artículos populares");
  const [buscando, setBuscando] = useState(false);

  // ==========================================
  // ESTADO DEL MODAL
  // ==========================================
  const [modalArticulo, setModalArticulo] = useState(null);
  const articulosDestacadosRef = useRef(null);

  // ==========================================
  // RENDER DE ARTÍCULOS
  // ==========================================
  const renderizarArticulos = (lista) => {
    if (lista.length === 0) {
      return (
        <div
          style={{
            gridColumn: "1 / -1",
            textAlign: "center",
            padding: "40px",
            color: "#888",
          }}
        >
          <i
            className="fa-solid fa-magnifying-glass"
            style={{ fontSize: "40px", marginBottom: "16px", color: "#ccc" }}
          ></i>
          <p style={{ fontSize: "1.1rem", fontWeight: 600 }}>
            No se encontraron artículos que coincidan con tu búsqueda.
          </p>
          <p style={{ fontSize: "0.9rem" }}>
            Intenta con palabras clave como "envíos", "cambios", "tallas",
            "pagos" o selecciones una categoría.
          </p>
        </div>
      );
    }

    return lista.map((art) => (
      <div className="articulo-item" key={art.id}>
        <i className="fa-regular fa-file-lines"></i>
        <div className="articulo-info">
          <a
            href="#"
            data-id={art.id}
            onClick={(e) => {
              e.preventDefault();
              setModalArticulo(art);
            }}
          >
            {art.titulo}
          </a>
          <span>
            Categoría: <strong>{art.cat}</strong> &bull; Lectura de {art.tiempo}
          </span>
        </div>
      </div>
    ));
  };

  // ==========================================
  // BÚSQUEDA / FILTRADO
  // ==========================================
  const realizarBusqueda = (queryForzada) => {
    const rawQuery = queryForzada !== undefined ? queryForzada : busqueda;
    const query = rawQuery.trim().toLowerCase();

    if (query.length > 0) {
      setBuscando(true);

      setTimeout(() => {
        const resultados = articulosDatos.filter((a) => {
          const tituloMatch = a.titulo.toLowerCase().includes(query);
          const catMatch =
            a.cat.toLowerCase().includes(query) ||
            query.includes(a.cat.toLowerCase());
          const keywordMatch =
            a.keywords &&
            a.keywords.some(
              (k) =>
                k.toLowerCase().includes(query) ||
                query.includes(k.toLowerCase())
            );
          return tituloMatch || catMatch || keywordMatch;
        });

        setTituloSeccion(`Resultados para "${rawQuery.trim()}" (${resultados.length})`);
        setResultadoArticulos(resultados);
        setBuscando(false);

        articulosDestacadosRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    } else {
      setTituloSeccion("Artículos populares");
      setResultadoArticulos(articulosDatos.slice(0, 6));
    }
  };

  const handleBuscarClick = () => realizarBusqueda();

  const handleBusquedaKeyUp = (e) => {
    if (e.key === "Enter" || busqueda.trim() === "") realizarBusqueda();
  };

  const handleCategoriaClick = (catNombre) => {
    setBusqueda(catNombre);
    realizarBusqueda(catNombre);
  };

  useEffect(() => {
    if (location.state?.busqueda) {
      const q = location.state.busqueda;
      setBusqueda(q);
      realizarBusqueda(q);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state?.busqueda]);

  // ==========================================
  // MODAL ARTÍCULO
  // ==========================================
  const cerrarModalArticulo = () => setModalArticulo(null);

  // ==========================================
  // RENDER
  // ==========================================
  return (
    <>
      {/* BARRA DE ESTADO DEL SISTEMA */}
      <div className="estado-sistema">
        <div className="estado-contenedor">
          <span className="punto-verde"></span>
          <p>
            <strong>Sistemas operativos:</strong> No hay retrasos reportados en
            envíos nacionales.
          </p>
        </div>
      </div>

      {/* HERO SOPORTE CON BUSCADOR */}
      <section className="soporte-hero">
        <h1>
          Centro de <span>Soporte</span>
        </h1>
        <p>¿En qué podemos ayudarte hoy?</p>

        <div className="buscador-soporte">
          <div className="input-grupo">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input
              type="text"
              id="busqueda-soporte"
              placeholder="Buscar artículos, guías o ayuda..."
              autoComplete="off"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              onKeyUp={handleBusquedaKeyUp}
            />
            <button
              id="btn-buscar"
              onClick={handleBuscarClick}
              disabled={buscando}
            >
              {buscando ? (
                <i className="fa-solid fa-spinner fa-spin"></i>
              ) : (
                "Buscar"
              )}
            </button>
          </div>
          <div className="sugerencias-busqueda">
            Ej: Tiempos de envío, devoluciones, medios de pago...
          </div>
        </div>
      </section>

      {/* CONTENEDOR PRINCIPAL */}
      <div className="soporte-contenedor">
        {/* CATEGORÍAS DE AYUDA */}
        <section className="seccion-categorias">
          <h2>Explorar por categorías</h2>

          <div className="categorias-grid">
            {categorias.map((cat, idx) => (
              <a
                href="#"
                className="categoria-tarjeta"
                key={idx}
                onClick={(e) => {
                  e.preventDefault();
                  handleCategoriaClick(cat.titulo);
                }}
              >
                <div className="cat-icono">
                  <i className={cat.icono}></i>
                </div>
                <h3>{cat.titulo}</h3>
                <p>{cat.desc}</p>
              </a>
            ))}
          </div>
        </section>

        {/* ARTÍCULOS DESTACADOS */}
        <section className="articulos-destacados" ref={articulosDestacadosRef}>
          <h2>{tituloSeccion}</h2>

          <div className="articulos-lista">
            {renderizarArticulos(resultadoArticulos)}
          </div>
        </section>

        {/* SECCIÓN DE PREGUNTAS FRECUENTES (FAQ) */}
        <section className="faq-soporte">
          <h2>Preguntas Rápidas</h2>
          <div className="faq-grid">
            <FaqSoporte
              preguntas={preguntasFAQ}
            />
          </div>
        </section>

        {/* BANNER DE CONTACTO */}
        <section className="banner-contacto">
          <div className="banner-contenido">
            <h3>¿No encontraste lo que buscabas?</h3>
            <p>
              Nuestro equipo de servicio al cliente está listo para ayudarte de
              forma personalizada.
            </p>
            <Link to="/contacto" className="boton-contacto">
              Ir a Contacto <i className="fa-solid fa-arrow-right"></i>
            </Link>
          </div>
          <div className="banner-imagen">
            <i className="fa-solid fa-headset"></i>
          </div>
        </section>
      </div>

      {/* MODAL DE LECTURA DE ARTÍCULO */}
      {modalArticulo && (
        <div
          className="modal-overlay activo"
          id="modal-articulo"
          onClick={cerrarModalArticulo}
        >
          <div className="modal-contenido" onClick={(e) => e.stopPropagation()}>
            <button className="cerrar-modal" id="cerrar-articulo" onClick={cerrarModalArticulo}>
              <i className="fa-solid fa-xmark"></i>
            </button>
            <div className="modal-header">
              <span className="modal-categoria" id="modal-cat">
                {modalArticulo.cat}
              </span>
              <h2 id="modal-titulo">{modalArticulo.titulo}</h2>
              <div className="modal-meta">
                <i className="fa-regular fa-clock"></i>
                <span id="modal-tiempo">{modalArticulo.tiempo}</span>
                <span className="modal-punto">•</span>
                <span>Actualizado hoy</span>
              </div>
            </div>
            <div
              className="modal-cuerpo"
              id="modal-texto"
              dangerouslySetInnerHTML={{
                __html:
                  modalArticulo.contenido ||
                  `<p>Información detallada sobre <strong>${modalArticulo.titulo.toLowerCase()}</strong>.</p>`,
              }}
            ></div>
            <div className="modal-footer">
              <p>¿Te resultó útil este artículo?</p>
              <div className="votos-utilidad">
                <button
                  className="btn-util"
                  onClick={() =>
                    alert("¡Gracias por tu retroalimentación!")
                  }
                >
                  <i className="fa-regular fa-thumbs-up"></i> Sí
                </button>
                <button
                  className="btn-util"
                  onClick={() =>
                    alert("Gracias. Trabajaremos para mejorarlo.")
                  }
                >
                  <i className="fa-regular fa-thumbs-down"></i> No
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ==========================================
// COMPONENTE FAQ SOPORTE (ACORDEÓN)
// ==========================================
function FaqSoporte({ preguntas }) {
  const [activo, setActivo] = useState(null);

  return preguntas.map((item, idx) => (
    <div
      className={`faq-item ${activo === idx ? "activo" : ""}`}
      key={idx}
      onClick={() => setActivo(activo === idx ? null : idx)}
    >
      <div className="faq-pregunta">
        <span>{item.texto}</span>
        <i className="fa-solid fa-chevron-down"></i>
      </div>
      <div className="faq-respuesta">{item.respuesta}</div>
    </div>
  ));
}

export default Soporte;
