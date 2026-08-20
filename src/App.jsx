import { Routes, Route, useLocation } from "react-router-dom";

import Encabezado from "./componentes/encabezado/encabezado";
import PieDePagina from "./componentes/pie_de_pagina/pie_de_pagina";

import Inicio from "./paginas/inicio/inicio";
import Catalogo from "./paginas/catalogo/catalogo";
import CatalogoRopaAccesorios from "./paginas/catalogo_ropa_accesorios/catalogo_ropa_accesorios";
import Carrito from "./paginas/carrito/carrito";
import Tarjeta from "./paginas/tarjeta/tarjeta";
import Administrador from "./paginas/administrador/administrador";
import Parejas from "./paginas/parejas/Parejas";
import Login from "./paginas/login/login";
import Registro from "./paginas/registro/registro";
import Usuario from "./paginas/usuario/usuario";
import Contacto from "./paginas/contacto/contacto";
import Soporte from "./paginas/soporte/soporte";
import Favoritos from "./paginas/favoritos/favoritos";
import Checkout from "./paginas/checkout/checkout";
import Confirmacion from "./paginas/confirmacion/confirmacion";

function App() {
    const location = useLocation();

    // Rutas donde NO se muestra el encabezado ni el pie de página
    const rutasSinLayout = ["/administrador", "/login", "/registro"];
    const ocultarLayout = rutasSinLayout.includes(location.pathname);

    return (
        <>
            {!ocultarLayout && <Encabezado />}

            <Routes>
                <Route path="/" element={<Inicio />} />
                <Route path="/catalogo" element={<Catalogo />} />
                <Route path="/catalogo-ropa-accesorios" element={<CatalogoRopaAccesorios />} />
                <Route path="/carrito" element={<Carrito />} />
                <Route path="/tarjeta" element={<Tarjeta />} />
                <Route path="/administrador" element={<Administrador />} />
                <Route path="/parejas" element={<Parejas />} />
                <Route path="/login" element={<Login />} />
                <Route path="/registro" element={<Registro />} />
                <Route path="/usuario" element={<Usuario />} />
                <Route path="/contacto" element={<Contacto />} />
                <Route path="/soporte" element={<Soporte />} />
                <Route path="/favoritos" element={<Favoritos />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/confirmacion" element={<Confirmacion />} />
            </Routes>

            {!ocultarLayout && <PieDePagina />}
        </>
    );
}

export default App;