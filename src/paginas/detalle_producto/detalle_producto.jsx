import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { iniciarFavoritosGlobal } from "../favoritos/favoritos";
import "../../../css/detalle_producto.css";

const productoInicial = {
  titulo: "Smartphone Galaxy A54 5G",
  marca: "Celulares y accesorios",
  descripcion:
    "Pantalla Full HD+, cámara trasera de 50 MP, batería de larga duración y rendimiento ideal para trabajar, estudiar y disfrutar contenido en alta calidad.",
  precioActual: "$ 249.990",
  precioAntiguo: "$ 329.990",
  imagen:
    "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80",
  origen: "/catalogo",
};

const recomendaciones = [
  {
    titulo: "iPhone 15",
    descripcion: "Potente, elegante y excelente para fotos.",
    precio: "$ 799.990",
    imagen: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80",
  },
  {
    titulo: "Motorola Edge",
    descripcion: "Gran pantalla y batería de larga duración.",
    precio: "$ 329.990",
    imagen: "https://media.falabella.com.co/falabellaCO/73645747_1/width=480,height=480,quality=70,format=webp,fit=pad",
  },
  {
    titulo: "Samsung S24",
    descripcion: "Rendimiento premium con cámara avanzada.",
    precio: "$ 699.990",
    imagen: "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=600&q=80",
  },
  {
    titulo: "Xiaomi Redmi Note",
    descripcion: "Ideal para quienes buscan buen valor.",
    precio: "$ 239.990",
    imagen: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=600&q=80",
  },
];

function obtenerProductoSeleccionado() {
  try {
    const guardado = JSON.parse(localStorage.getItem("productoSeleccionado") || "null");
    return guardado ? { ...productoInicial, ...guardado } : productoInicial;
  } catch {
    return productoInicial;
  }
}

function obtenerEspecificaciones(descripcion) {
  const texto = descripcion.toLowerCase();
  if (texto.includes("kindle")) {
    return [
      "Pantalla de 7 pulgadas con tecnología e-paper antirreflejos",
      "Almacenamiento de 32 GB Signature Edition",
      "Batería de alta duración para semanas de lectura continuada",
    ];
  }
  if (texto.includes("impresora") || texto.includes("smart tank")) {
    return [
      "Impresión multifuncional (Imprime, escanea y copia)",
      "Conexión inalámbrica Wi-Fi de alta velocidad",
      "Incluye sistema de tintas continuas con gran rendimiento",
    ];
  }
  if (texto.includes("portátil") || texto.includes("ryzen") || texto.includes("hp") || texto.includes("lenovo")) {
    return [
      "Procesador potente para multitarea y rendimiento fluido",
      "Pantalla Full HD de alta definición y bordes delgados",
      "Almacenamiento SSD ultra rápido y memoria RAM de alto rendimiento",
    ];
  }
  if (texto.includes("starlink")) {
    return [
      "Internet satelital de alta velocidad y baja latencia",
      "Kit estándar V4 con fácil instalación plug and play",
      "Diseñado para soportar condiciones climáticas extremas",
    ];
  }
  if (texto.includes("tablet")) {
    return [
      "Pantalla táctil con excelente resolución y colores vivos",
      "Sistema de altavoces envolventes para multimedia",
      "Incluye funda de protección y auriculares Moto Buds",
    ];
  }
  if (texto.includes("disco") || texto.includes("toshiba")) {
    return [
      "Capacidad de almacenamiento masivo de 2 TB",
      "Conexión de alta velocidad USB 3.0 compatible con PC y Mac",
      "Incluye estuche de protección resistente a impactos",
    ];
  }
  return [
    "Diseño de alta calidad con garantía oficial",
    "Excelente relación calidad-precio y durabilidad",
    "Envío asegurado y soporte técnico prioritario",
  ];
}

function DetalleProducto() {
  const navigate = useNavigate();
  const [producto, setProducto] = useState(obtenerProductoSeleccionado);
  const [imagenActiva, setImagenActiva] = useState(producto.imagen);
  const [esFavorito, setEsFavorito] = useState(false);

  useEffect(() => {
    iniciarFavoritosGlobal();
    setEsFavorito(window.SenabellaFavoritos.esFavorito(producto.titulo));
  }, [producto.titulo]);

  const mostrarToast = (mensaje, icono = "fa-circle-check") => {
    if (window.SenabellaToast) window.SenabellaToast(mensaje, icono, "exito");
  };

  const productoParaCarrito = {
    nombre: producto.titulo,
    marca: producto.marca,
    color: "Estándar",
    precioText: producto.precioActual,
    img: imagenActiva,
    cantidad: 1,
  };

  const alternarFavorito = () => {
    const nuevoEstado = window.SenabellaFavoritos.toggleFavorito({
      id: producto.titulo,
      nombre: producto.titulo,
      marca: producto.marca,
      precioTexto: producto.precioActual,
      imagen: imagenActiva,
      referencia: producto.marca,
    });
    setEsFavorito(nuevoEstado);
    mostrarToast(nuevoEstado ? "¡Producto guardado en favoritos!" : "Producto eliminado de favoritos", nuevoEstado ? "fa-heart" : "fa-heart-crack");
  };

  const agregarAlCarrito = () => {
    if (window.SenabellaCart) window.SenabellaCart.agregarProducto(productoParaCarrito);
    mostrarToast(`${producto.marca} se agregó al carrito!`);
  };

  const comprarAhora = () => {
    if (window.SenabellaCart) window.SenabellaCart.agregarProducto(productoParaCarrito);
    navigate("/carrito");
  };

  const cargarRecomendacion = (recomendacion) => {
    const precioNumero = Number(recomendacion.precio.replace(/[^\d]/g, "")) || 0;
    const nuevoProducto = {
      titulo: recomendacion.titulo,
      marca: recomendacion.titulo.split(" ")[0].toUpperCase(),
      descripcion: recomendacion.descripcion,
      precioActual: recomendacion.precio,
      precioAntiguo: `$ ${Math.round(precioNumero * 1.25).toLocaleString("es-CO")}`,
      imagen: recomendacion.imagen,
      origen: "/catalogo",
    };
    localStorage.setItem("productoSeleccionado", JSON.stringify(nuevoProducto));
    setProducto(nuevoProducto);
    setImagenActiva(nuevoProducto.imagen);
    window.scrollTo({ top: 0, behavior: "smooth" });
    mostrarToast(`Cargado: ${nuevoProducto.titulo}`, "fa-eye");
  };

  return (
    <main className="pagina-producto">
      <section className="tarjeta-producto">
        <div className="imagen-producto">
          <button className={`btn-favorito-detalle ${esFavorito ? "activo" : ""}`} title="Guardar en favoritos" onClick={alternarFavorito}>
            <i className={esFavorito ? "fa-solid fa-heart" : "fa-regular fa-heart"}></i>
          </button>
          <img src={imagenActiva} alt={producto.titulo} />
          <div className="mini-miniaturas">
            {["Vista frontal", "Vista posterior", "Accesorios"].map((alt) => (
              <img key={alt} src={producto.imagen} alt={alt} onClick={() => setImagenActiva(producto.imagen)} />
            ))}
          </div>
        </div>

        <div className="info-producto">
          <p className="categoria">{producto.marca}</p>
          <h1>{producto.titulo}</h1>
          <p className="descripcion">{producto.descripcion}</p>
          <div className="precios">
            <span className="precio-actual">{producto.precioActual}</span>
            <span className="precio-antiguo">{producto.precioAntiguo}</span>
          </div>
          <div className="beneficios"><span>Envío gratis</span><span>Pago con tarjeta</span><span>Recíbelo mañana</span></div>
          <ul className="lista-especificaciones">{obtenerEspecificaciones(producto.descripcion).map((item) => <li key={item}>{item}</li>)}</ul>
          <div className="acciones-producto">
            <button className="btn-primario" onClick={agregarAlCarrito}>Agregar al carrito</button>
            <button className="btn-secundario" onClick={comprarAhora}>Comprar ahora</button>
            <Link to={producto.origen || "/catalogo"} className="btn-terciario-catalogo"><i className="fa-solid fa-store"></i> Volver al catálogo</Link>
          </div>
        </div>
      </section>

      <section className="recomendaciones">
        <div className="recomendaciones-header"><h2>También te puede interesar</h2><p>Descubre celulares recomendados según tu estilo.</p></div>
        <div className="carousel">{recomendaciones.map((recomendacion) => (
          <article className="reco-card" key={recomendacion.titulo} onClick={() => cargarRecomendacion(recomendacion)}>
            <img src={recomendacion.imagen} alt={recomendacion.titulo} />
            <h3>{recomendacion.titulo}</h3><p>{recomendacion.descripcion}</p><span>{recomendacion.precio}</span>
          </article>
        ))}</div>
      </section>

      <section className="info-grid">
        <article className="info-box"><h3>¿Por qué comprarlo?</h3><p>Combina diseño moderno, rendimiento confiable y una experiencia visual excepcional para trabajo y entretenimiento.</p></article>
        <article className="info-box"><h3>Opiniones destacadas</h3><p>"Muy buena calidad de imagen y una batería que dura todo el día."</p><span>★★★★★ 4.8/5</span></article>
        <article className="info-box"><h3>Garantía y soporte</h3><p>Incluye asistencia técnica y cobertura de fábrica para una compra más segura y confiable.</p></article>
      </section>
    </main>
  );
}

export default DetalleProducto;
