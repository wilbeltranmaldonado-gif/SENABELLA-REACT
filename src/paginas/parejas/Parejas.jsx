// Esta vista presenta la sección de parejas y productos recomendados para ella y él.

import { useEffect, useState } from 'react';
import './parejas.css';
import { Link, useNavigate } from 'react-router-dom';
import imgPareja from '../../assets/pareja.jpeg';
import imgImages from '../../assets/images.jpeg';
import { iniciarFavoritosGlobal } from '../favoritos/favoritos';

function Parejas() {
  const navigate = useNavigate();
  const [favoritos, setFavoritos] = useState([]);

  const productosParejas = [
    { nombre: 'Chaqueta coordinada - Él', descripcion: 'Chaqueta coordinada para él - Diseño moderno y cómodo para salidas y celebraciones.', precio: '$189.900', precioAntiguo: '$209.900', imagen: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=400&q=80' },
    { nombre: 'Chaqueta coordinada - Ella', descripcion: 'Chaqueta coordinada para ella - Diseño romántico y ligero para celebraciones en pareja.', precio: '$179.900', precioAntiguo: '$199.900', imagen: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=400&q=80' },
    { nombre: 'Set camisetas pareja', descripcion: 'Set de camisetas coordinadas para pareja, diseño casual ideal para el día a día.', precio: '$129.900', precioAntiguo: '$149.900', imagen: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=400&q=80' },
    { nombre: 'Bufandas coordinadas', descripcion: 'Bufandas coordinadas para pareja, ideales para el frío. Tejido suave y abrigado.', precio: '$89.900', precioAntiguo: '$109.900', imagen: 'https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?auto=format&fit=crop&w=400&q=80' },
  ];

  useEffect(() => {
    iniciarFavoritosGlobal();
    const sincronizarFavoritos = () => setFavoritos(window.SenabellaFavoritos.obtenerLista());
    sincronizarFavoritos();
    window.addEventListener('senabella-favoritos-actualizado', sincronizarFavoritos);
    return () => window.removeEventListener('senabella-favoritos-actualizado', sincronizarFavoritos);
  }, []);

  useEffect(() => {
    // Animaciones al hacer scroll
    const secciones = document.querySelectorAll(
      ".parejas-info-cards, .parejas-galeria, .productos-parejas, .parejas-cta"
    );

    secciones.forEach(function (seccion) {
      seccion.style.opacity = "0";
      seccion.style.transform = "translateY(30px)";
      seccion.style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out";
    });

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    secciones.forEach(function (seccion) {
      observer.observe(seccion);
    });

    return () => {
      secciones.forEach(function (seccion) {
        observer.unobserve(seccion);
      });
    };
  }, []);

  const verProductoParejas = (titulo, marca, descripcion, precioActual, precioAntiguo, imagen) => {
    localStorage.setItem("productoSeleccionado", JSON.stringify({
      titulo: titulo,
      marca: marca,
      descripcion: descripcion,
      precioActual: precioActual,
      precioAntiguo: precioAntiguo,
      imagen: imagen,
      referencia: marca,
      origen: "/catalogo-ropa-accesorios"
    }));
    navigate("/detalle_producto"); 
  };

  const handleScroll = (e) => {
    e.preventDefault();
    const destino = document.querySelector("#catalogo-parejas");
    if (destino) {
      destino.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleAgregarCarrito = (e, producto) => {
    e.preventDefault();
    e.stopPropagation();

    if (window.SenabellaCart) {
      window.SenabellaCart.agregarProducto({
        nombre: producto.nombre,
        marca: "SENABELLA",
        color: "Único",
        precioText: producto.precio,
        img: producto.img,
        cantidad: 1
      });
    }

    const btn = e.currentTarget;
    const btnOriginalText = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-check"></i> Agregado';
    btn.style.background = "linear-gradient(135deg, #27ae60, #2ecc71)";
    btn.style.color = "#ffffff";

    setTimeout(function () {
      btn.innerHTML = btnOriginalText;
      btn.style.background = "";
      btn.style.color = "";
    }, 1500);

    if (window.SenabellaToast) {
      window.SenabellaToast(producto.nombre + " agregado al carrito", "fa-cart-shopping", "exito");
    }
  };

  const handleFavorito = (e, producto) => {
    e.preventDefault();
    e.stopPropagation();
    iniciarFavoritosGlobal();
    const agregado = window.SenabellaFavoritos.toggleFavorito({
      nombre: producto.nombre,
      marca: 'COLECCIÓN PAREJAS',
      imagen: producto.imagen,
      precio: producto.precio,
      referencia: 'SENABELLA',
    });
    if (window.SenabellaToast) {
      window.SenabellaToast(
        agregado ? 'Agregado a favoritos' : 'Eliminado de favoritos',
        agregado ? 'fa-heart' : 'fa-heart-crack',
        'exito'
      );
    }
  };

  const esFavorito = (nombre) => favoritos.some(
    (favorito) => favorito.nombre?.trim().toLowerCase() === nombre.trim().toLowerCase()
  );

  return (
    <main>
      {/* HERO / BANNER SUPERIOR */}
      <section className="parejas-hero">
        <div className="parejas-hero-contenido">
          <span className="badge-hero"><i className="fa-solid fa-heart"></i> COLECCIÓN PAREJAS</span>
          <h1>Ropa elegante para compartir <span>momentos inolvidables</span></h1>
          <p>Descubre outfits coordinados, tonos románticos y detalles sofisticados pensados para la vida en pareja.</p>
          <a href="#catalogo-parejas" className="boton-hero" onClick={handleScroll}>
            <i className="fa-solid fa-sparkles"></i> Explorar colección
          </a>
        </div>
      </section>

      {/* CONTENEDOR PRINCIPAL */}
      <div className="parejas-contenedor">

        {/* TARJETAS INFORMATIVAS */}
        <section className="parejas-info-cards">
          <div className="info-card" id="info-looks">
            <div className="info-card-icono">
              <i className="fa-solid fa-shirt"></i>
            </div>
            <h3>Looks coordinados</h3>
            <p>Conjuntos pensados para combinar con estilo. Colores, texturas y cortes que se complementan a la perfección.</p>
          </div>

          <div className="info-card" id="info-ocasiones">
            <div className="info-card-icono">
              <i className="fa-solid fa-champagne-glasses"></i>
            </div>
            <h3>Para cada ocasión</h3>
            <p>Desde cenas románticas hasta celebraciones especiales, tenemos el outfit perfecto para cada momento.</p>
          </div>

          <div className="info-card" id="info-entrega">
            <div className="info-card-icono">
              <i className="fa-solid fa-gift"></i>
            </div>
            <h3>Empaque de regalo</h3>
            <p>Servicio de empaque especial, asesoría personalizada y entrega cuidada para una experiencia memorable.</p>
          </div>
        </section>

        {/* GALERÍA DE PRODUCTOS */}
        <section className="parejas-galeria" id="catalogo-parejas">
          <div className="galeria-encabezado">
            <h2>Selección de inspiración</h2>
            <p>Looks pensados para una tienda de ropa romántica y moderna.</p>
          </div>

          <div className="galeria-grid">
            {/* Producto 1 */}
            <article className="galeria-card" style={{cursor:'pointer'}} onClick={() => verProductoParejas('Look de pareja','SENABELLA MODA','Propuesta elegante y romántica para celebraciones con estilo y coordinación.','$ 359.900','$ 399.900', imgPareja)}>
              <div className="galeria-card-imagen">
                <img src={imgPareja} alt="Look de pareja elegante" loading="lazy" />
                <div className="galeria-card-badge">Nuevo</div>
              </div>
              <div className="galeria-card-info">
                <h3>Look de pareja</h3>
                <p>Propuesta elegante y romántica pensada para celebraciones con estilo y coordinación.</p>
              </div>
            </article>

            {/* Producto 2 */}
            <article className="galeria-card" style={{cursor:'pointer'}} onClick={() => verProductoParejas('Conjunto coordinado','SENABELLA MODA','Propuesta moderna con tonos neutros y detalles sofisticados para coordinar el estilo.','$ 289.900','$ 329.900', imgImages)}>
              <div className="galeria-card-imagen">
                <img src={imgImages} alt="Conjunto para pareja" loading="lazy" />
                <div className="galeria-card-badge badge-oferta">-20%</div>
              </div>
              <div className="galeria-card-info">
                <h3>Conjunto coordinado</h3>
                <p>Propuesta moderna con tonos neutros y detalles sofisticados para coordinar el estilo.</p>
              </div>
            </article>

            {/* Producto 3 */}
            <article className="galeria-card" style={{cursor:'pointer'}} onClick={() => verProductoParejas('Detalle romántico','SENABELLA BOUTIQUE','Texturas suaves, cortes delicados y acabados inspirados en una boutique elegante para novios.','$ 199.900','$ 239.900','https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80')}>
              <div className="galeria-card-imagen">
                <img
                  src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80"
                  alt="Detalle romántico de ropa elegante" loading="lazy" />
                <div className="galeria-card-badge">Exclusivo</div>
              </div>
              <div className="galeria-card-info">
                <h3>Detalle romántico</h3>
                <p>Texturas suaves, cortes delicados y acabados inspirados en una boutique elegante para novios.</p>
              </div>
            </article>
          </div>
        </section>

        {/* PRODUCTOS PARA PAREJAS */}
        <section className="productos-parejas">
          <div className="productos-encabezado">
            <h2>Productos para parejas</h2>
            <Link to="/catalogo-ropa-accesorios" className="btn btn-outline-primary btn-sm">Ver todo</Link>
          </div>

          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-4 g-4 productos-parejas-grid">

            <div className="col">
              <div className="card h-100 shadow-sm border-0" style={{cursor:'pointer'}} onClick={() => verProductoParejas(productosParejas[0].nombre,'SENABELLA MODA',productosParejas[0].descripcion,productosParejas[0].precio,productosParejas[0].precioAntiguo,productosParejas[0].imagen)}>
                <div className="card-badge badge-nuevo">Nuevo</div>
                <button type="button" className={`btn-favorito ${esFavorito(productosParejas[0].nombre) ? 'favorito-activo' : ''}`} aria-label="Agregar a favoritos" onClick={(e) => handleFavorito(e, productosParejas[0])}>
                  <i className={`${esFavorito(productosParejas[0].nombre) ? 'fa-solid' : 'fa-regular'} fa-heart`}></i>
                </button>
                <img
                  src="https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=400&q=80"
                  className="card-img-top p-3 object-fit-contain" height="200" alt="Chaqueta coordinada para él" loading="lazy" />
                <div className="card-body d-flex flex-column justify-content-between">
                  <h3 className="card-title h6 text-truncate">Chaqueta coordinada - Él</h3>
                  <p className="card-text fw-bold text-success">$189.900</p>
                  <button className="btn-agregar-carrito" onClick={(e) => handleAgregarCarrito(e, {nombre: 'Chaqueta coordinada - Él', precio: '$189.900', img: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=400&q=80'})}>
                    <i className="fa-solid fa-cart-plus"></i> Agregar
                  </button>
                </div>
              </div>
            </div>

            <div className="col">
              <div className="card h-100 shadow-sm border-0" style={{cursor:'pointer'}} onClick={() => verProductoParejas(productosParejas[1].nombre,'SENABELLA MODA',productosParejas[1].descripcion,productosParejas[1].precio,productosParejas[1].precioAntiguo,productosParejas[1].imagen)}>
                <div className="card-badge badge-nuevo">Nuevo</div>
                <button type="button" className={`btn-favorito ${esFavorito(productosParejas[1].nombre) ? 'favorito-activo' : ''}`} aria-label="Agregar a favoritos" onClick={(e) => handleFavorito(e, productosParejas[1])}>
                  <i className={`${esFavorito(productosParejas[1].nombre) ? 'fa-solid' : 'fa-regular'} fa-heart`}></i>
                </button>
                <img
                  src="https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=400&q=80"
                  className="card-img-top p-3 object-fit-contain" height="200" alt="Chaqueta coordinada para ella" loading="lazy" />
                <div className="card-body d-flex flex-column justify-content-between">
                  <h3 className="card-title h6 text-truncate">Chaqueta coordinada - Ella</h3>
                  <p className="card-text fw-bold text-success">$179.900</p>
                  <button className="btn-agregar-carrito" onClick={(e) => handleAgregarCarrito(e, {nombre: 'Chaqueta coordinada - Ella', precio: '$179.900', img: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=400&q=80'})}>
                    <i className="fa-solid fa-cart-plus"></i> Agregar
                  </button>
                </div>
              </div>
            </div>

            <div className="col">
              <div className="card h-100 shadow-sm border-0" style={{cursor:'pointer'}} onClick={() => verProductoParejas(productosParejas[2].nombre,'SENABELLA MODA',productosParejas[2].descripcion,productosParejas[2].precio,productosParejas[2].precioAntiguo,productosParejas[2].imagen)}>
                <div className="card-badge">-15%</div>
                <button type="button" className={`btn-favorito ${esFavorito(productosParejas[2].nombre) ? 'favorito-activo' : ''}`} aria-label="Agregar a favoritos" onClick={(e) => handleFavorito(e, productosParejas[2])}>
                  <i className={`${esFavorito(productosParejas[2].nombre) ? 'fa-solid' : 'fa-regular'} fa-heart`}></i>
                </button>
                <img
                  src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=400&q=80"
                  className="card-img-top p-3 object-fit-contain" height="200" alt="Set de camisetas para pareja" loading="lazy" />
                <div className="card-body d-flex flex-column justify-content-between">
                  <h3 className="card-title h6 text-truncate">Set camisetas pareja</h3>
                  <p className="card-text fw-bold text-success">$129.900</p>
                  <button className="btn-agregar-carrito" onClick={(e) => handleAgregarCarrito(e, {nombre: 'Set camisetas pareja', precio: '$129.900', img: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=400&q=80'})}>
                    <i className="fa-solid fa-cart-plus"></i> Agregar
                  </button>
                </div>
              </div>
            </div>

            <div className="col">
              <div className="card h-100 shadow-sm border-0" style={{cursor:'pointer'}} onClick={() => verProductoParejas(productosParejas[3].nombre,'SENABELLA MODA',productosParejas[3].descripcion,productosParejas[3].precio,productosParejas[3].precioAntiguo,productosParejas[3].imagen)}>
                <div className="card-badge">-25%</div>
                <button type="button" className={`btn-favorito ${esFavorito(productosParejas[3].nombre) ? 'favorito-activo' : ''}`} aria-label="Agregar a favoritos" onClick={(e) => handleFavorito(e, productosParejas[3])}>
                  <i className={`${esFavorito(productosParejas[3].nombre) ? 'fa-solid' : 'fa-regular'} fa-heart`}></i>
                </button>
                <img
                  src="https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?auto=format&fit=crop&w=400&q=80"
                  className="card-img-top p-3 object-fit-contain" height="200" alt="Bufandas coordinadas pareja" loading="lazy" />
                <div className="card-body d-flex flex-column justify-content-between">
                  <h3 className="card-title h6 text-truncate">Bufandas coordinadas</h3>
                  <p className="card-text fw-bold text-success">$89.900</p>
                  <button className="btn-agregar-carrito" onClick={(e) => handleAgregarCarrito(e, {nombre: 'Bufandas coordinadas', precio: '$89.900', img: 'https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?auto=format&fit=crop&w=400&q=80'})}>
                    <i className="fa-solid fa-cart-plus"></i> Agregar
                  </button>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* CTA FINAL */}
        <section className="parejas-cta">
          <div className="parejas-cta-contenido">
            <i className="fa-solid fa-heart cta-icono"></i>
            <h2>¿Buscas el regalo perfecto para tu pareja?</h2>
            <p>Consulta con nuestros asesores de estilo y recibe recomendaciones personalizadas.</p>
            <Link to="/contacto" className="boton-cta">
              <i className="fa-solid fa-headset"></i> Hablar con un asesor
            </Link>
          </div>
        </section>

      </div>
    </main>
  );
}

export default Parejas;
