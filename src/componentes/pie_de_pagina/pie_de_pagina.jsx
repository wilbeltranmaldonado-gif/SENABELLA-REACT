import { Link } from "react-router-dom";
import "./pie_de_pagina.css";

function Footer() {
  return (
    <footer className="pie-pagina">
      <div className="pie-pagina-superior">
        <div>
          <h3>Servicio al cliente</h3>
          <a href="soporte.html">Ayuda</a>
          <a href="contacto.html">Cambio y devoluciones</a>
          <a href="contacto.html">Garantías</a>
        </div>

        <div>
          <h3>Compra segura</h3>
          <a href="tarjetas.html">Formas de pago</a>
          <Link to="/catalogo">Envíos</Link>
          <Link to="/catalogo">Promociones</Link>
        </div>

        <div>
          <h3>Acerca de Senabella</h3>
          <a href="contacto.html">Nuestra empresa</a>
          <a href="contacto.html">Trabaja con nosotros</a>
          <Link to="/catalogo">Tiendas</Link>
        </div>
      </div>

      <div className="pie-pagina-inferior">
        <p>© 2026 Senabella. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}

export default Footer;