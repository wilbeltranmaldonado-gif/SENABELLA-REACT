import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../../css/detalle_producto.css";
import { productosIniciales, productosRopaAccesorios } from "../../datos";
import { iniciarFavoritosGlobal } from "../favoritos/favoritos";
import imagenFallback from "../../assets/teclado.webp";

const PRODUCTOS_ADMIN_KEY = "senabella_admin_products";
const PRODUCTO_SELECCIONADO_KEY = "productoSeleccionado";

function leerProductoSeleccionado() {
  try {
    return JSON.parse(localStorage.getItem(PRODUCTO_SELECCIONADO_KEY) || "null");
  } catch {
    return null;
  }
}

function leerProductosAdmin() {
  try {
    const productos = JSON.parse(localStorage.getItem(PRODUCTOS_ADMIN_KEY) || "[]");
    return Array.isArray(productos) ? productos : [];
  } catch {
    return [];
  }
}

function precioNumero(precio) {
  return Number(String(precio || "0").replace(/[^\d]/g, "")) || 0;
}

function precioAnterior(producto) {
  if (producto.precioAntiguo) return producto.precioAntiguo;
  if (producto.precioSecundario1) return producto.precioSecundario1;
  if (producto.precioSecundario) return producto.precioSecundario;
  const precio = precioNumero(producto.precioActual || producto.precio);
  return precio ? `$ ${Math.round(precio * 1.25).toLocaleString("es-CO")}` : "$ 0";
}

function normalizarProducto(producto) {
  const nombre = producto?.titulo || producto?.nombre || "Producto Senabella";
  const imagen = producto?.imagen || producto?.img || imagenFallback;
  const precio = producto?.precioActual || producto?.precio || "$ 0";
  return {
    ...producto,
    id: producto?.id || nombre,
    titulo: nombre,
    nombre,
    marca: producto?.marca || producto?.categoria || "SENABELLA",
    descripcion: producto?.descripcion || `${nombre}. Producto seleccionado de Senabella con compra segura y soporte especializado.`,
    imagen,
    precioActual: precio,
    precioAntiguo: precioAnterior(producto || {}),
    origen: producto?.origen || "/catalogo",
  };
}

function manejarErrorImagen(evento) {
  if (evento.currentTarget.src !== imagenFallback) {
    evento.currentTarget.src = imagenFallback;
  }
}

function obtenerEspecificaciones(producto) {
  const texto = `${producto.titulo} ${producto.descripcion}`.toLowerCase();
  if (texto.includes("kindle")) return ["Pantalla de 7 pulgadas con tecnología e-paper antirreflejos", "Almacenamiento de 32 GB Signature Edition", "Batería de alta duración para semanas de lectura continuada"];
  if (texto.includes("impresora") || texto.includes("smart tank")) return ["Impresión multifuncional: imprime, escanea y copia", "Conexión inalámbrica Wi-Fi de alta velocidad", "Sistema de tintas continuas con gran rendimiento"];
  if (texto.includes("portátil") || texto.includes("ryzen") || texto.includes("laptop")) return ["Procesador potente para multitarea y rendimiento fluido", "Pantalla Full HD de alta definición", "Almacenamiento SSD y memoria RAM de alto rendimiento"];
  if (texto.includes("starlink")) return ["Internet satelital de alta velocidad y baja latencia", "Kit estándar V4 de fácil instalación", "Diseñado para soportar condiciones climáticas extremas"];
  if (texto.includes("tablet")) return ["Pantalla táctil con excelente resolución", "Sistema de altavoces para contenido multimedia", "Diseño ligero y cómodo para llevar"];
  if (texto.includes("disco") || texto.includes("toshiba")) return ["Capacidad de almacenamiento masivo de 2 TB", "Conexión USB 3.0 compatible con PC y Mac", "Estuche de protección resistente a impactos"];
  if (producto.categoria === "mujer" || producto.categoria === "hombre" || producto.categoria === "calzado") return ["Diseño actual y materiales seleccionados", "Acabados cómodos para uso diario", "Compra segura con soporte Senabella"];
  return ["Diseño de alta calidad con garantía oficial", "Excelente relación calidad-precio", "Envío asegurado y soporte técnico prioritario"];
}

function DetalleProducto() {
  const navigate = useNavigate();
  const [producto, setProducto] = useState(() => normalizarProducto(leerProductoSeleccionado() || productosIniciales[0]));
  const [imagenSeleccionada, setImagenSeleccionada] = useState(null);
  const [favoritosVersion, setFavoritosVersion] = useState(0);
  iniciarFavoritosGlobal();
  const imagenActiva = imagenSeleccionada || producto.imagen;
  const esFavorito = favoritosVersion >= 0 && window.SenabellaFavoritos.esFavorito(producto.nombre);

  const todosLosProductos = [
    ...productosIniciales,
    ...productosRopaAccesorios,
    ...leerProductosAdmin(),
  ].map(normalizarProducto);

  useEffect(() => {
    const actualizarProducto = () => {
      const guardado = leerProductoSeleccionado();
      if (guardado) {
        setImagenSeleccionada(null);
        setProducto(normalizarProducto(guardado));
      }
    };
    window.addEventListener("senabella-producto-seleccionado", actualizarProducto);
    return () => window.removeEventListener("senabella-producto-seleccionado", actualizarProducto);
  }, []);

  useEffect(() => {
    const sincronizarFavoritos = () => setFavoritosVersion((version) => version + 1);
    window.addEventListener("senabella-favoritos-actualizado", sincronizarFavoritos);
    return () => window.removeEventListener("senabella-favoritos-actualizado", sincronizarFavoritos);
  }, []);

  const recomendaciones = todosLosProductos
    .filter((item) => item.nombre !== producto.nombre)
    .slice(0, 4);

  const guardarProducto = (item) => {
    const seleccionado = normalizarProducto(item);
    localStorage.setItem(PRODUCTO_SELECCIONADO_KEY, JSON.stringify(seleccionado));
    setImagenSeleccionada(null);
    setProducto(seleccionado);
    window.dispatchEvent(new CustomEvent("senabella-producto-seleccionado"));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const alternarFavorito = () => {
    iniciarFavoritosGlobal();
    const nuevoEstado = window.SenabellaFavoritos.toggleFavorito({
      ...producto,
      nombre: producto.nombre,
      marca: producto.marca,
      imagen: producto.imagen,
      precio: producto.precioActual,
      precioTexto: producto.precioActual,
    });
    setFavoritosVersion((version) => version + 1);
    window.SenabellaToast?.(
      nuevoEstado ? "Producto guardado en favoritos" : "Producto eliminado de favoritos",
      nuevoEstado ? "fa-heart" : "fa-heart-crack",
      "exito"
    );
  };

  const productoCarrito = {
    nombre: producto.nombre,
    marca: producto.marca,
    color: "Estándar",
    precioText: producto.precioActual,
    img: producto.imagen,
    cantidad: 1,
  };

  const agregarAlCarrito = () => {
    const agregado = window.SenabellaCart?.agregarProducto(productoCarrito);
    if (agregado) {
      window.SenabellaToast?.("Producto agregado al carrito", "fa-cart-plus", "exito");
    }
    return agregado;
  };

  const comprarAhora = () => {
    const agregado = agregarAlCarrito();
    if (agregado) {
      navigate("/carrito");
    }
  };

  return (
    <div className="detalle-producto-page">
      <main className="pagina-producto">
      <div className="contenedor-volver">
        <Link to={producto.origen || "/catalogo"} className="btn-volver"><i className="fa-solid fa-arrow-left"></i> Volver</Link>
      </div>

      <section className="tarjeta-producto">
        <div className="imagen-producto">
          <button className={`btn-favorito-detalle${esFavorito ? " activo" : ""}`} onClick={alternarFavorito} title={esFavorito ? "Quitar de favoritos" : "Guardar en favoritos"} aria-label={esFavorito ? "Quitar de favoritos" : "Guardar en favoritos"}>
            <i className={esFavorito ? "fa-solid fa-heart" : "fa-regular fa-heart"}></i>
          </button>
          <img src={imagenActiva} alt={producto.titulo} onError={manejarErrorImagen} />
          <div className="mini-miniaturas">
            {[producto.imagen, producto.imagen, producto.imagen].map((imagen, indice) => (
              <img key={`${imagen}-${indice}`} src={imagen} alt={`Vista ${indice + 1} de ${producto.titulo}`} onError={manejarErrorImagen} onClick={() => setImagenSeleccionada(imagen)} />
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
          <div className="beneficios">
            <span><i className="fa-solid fa-truck"></i> Envío gratis</span>
            <span><i className="fa-solid fa-credit-card"></i> Pago con tarjeta</span>
            <span><i className="fa-solid fa-shield-halved"></i> Compra segura</span>
          </div>
          <ul className="lista-especificaciones">{obtenerEspecificaciones(producto).map((item) => <li key={item}>{item}</li>)}</ul>
          <div className="acciones-producto">
            <button className="btn-primario" onClick={agregarAlCarrito}>Agregar al carrito</button>
            <button className="btn-secundario" onClick={comprarAhora}>Comprar ahora</button>
            <Link to={producto.origen || "/catalogo"} className="btn-terciario-catalogo"><i className="fa-solid fa-store"></i> Volver al catálogo</Link>
          </div>
        </div>
      </section>

      <section className="recomendaciones">
        <div className="recomendaciones-header"><h2>También te puede interesar</h2><p>Descubre productos recomendados de Senabella.</p></div>
        <div className="carousel">
          {recomendaciones.map((item) => (
            <article className="reco-card" key={`${item.id}-${item.nombre}`} onClick={() => guardarProducto(item)}>
              <img src={item.imagen} alt={item.titulo} onError={manejarErrorImagen} />
              <h3>{item.titulo}</h3>
              <p>{item.descripcion}</p>
              <span>{item.precioActual}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="info-grid">
        <article className="info-box"><h3>¿Por qué comprarlo?</h3><p>Combina diseño, rendimiento y una experiencia de compra confiable para tus necesidades.</p></article>
        <article className="info-box"><h3>Compra segura</h3><p>Procesamos tu pedido con opciones de pago y seguimiento desde tu cuenta.</p><span>★★★★★ Compra confiable</span></article>
        <article className="info-box"><h3>Garantía y soporte</h3><p>Cuenta con asistencia y soporte Senabella para resolver tus dudas después de la compra.</p></article>
      </section>
      </main>
    </div>
  );
}

export default DetalleProducto;
