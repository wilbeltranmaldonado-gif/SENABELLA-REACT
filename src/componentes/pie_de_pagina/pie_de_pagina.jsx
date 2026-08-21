// Este componente muestra el pie de página con información útil y enlaces del sitio.

import { Link } from "react-router-dom";
import "./pie_de_pagina.css";

function Footer() {
  return (
    <footer className='pie-pagina'>
      <div className='pie-pagina-superior'>
        <div>
          <h3>Servicio al cliente</h3>
          <Link to='/soporte'>Ayuda</Link>
          <Link to='/soporte' state={{ busqueda: "cambios y devoluciones" }}>
            Cambio y devoluciones
          </Link>
          <Link to='/soporte' state={{ busqueda: "garantías" }}>
            Garantías
          </Link>
        </div>

        <div>
          <h3>Compra segura</h3>
          <Link to='/catalogo'>Envíos</Link>
          <Link to='/catalogo'>Promociones</Link>
        </div>

        <div>
          <h3>Acerca de Senabella</h3>
          <Link to='/contacto'>Nuestra empresa</Link>
          <Link to='/contacto'>Trabaja con nosotros</Link>
        </div>
      </div>

      <div className='pie-pagina-inferior'>
        <p>© 2026 Senabella. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}

export default Footer;
