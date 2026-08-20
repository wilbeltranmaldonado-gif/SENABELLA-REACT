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
import Usuario from "./paginas/usuario/usuario";
import Contacto from "./paginas/contacto/contacto";
import Soporte from "./paginas/soporte/soporte";

function App() {
    const location = useLocation();
    const esRutaAdministrador = location.pathname === "/administrador";

    return (
        <>
            {!esRutaAdministrador && <Encabezado />}

            <Routes>
                <Route path="/" element={<Inicio />} />
                <Route path="/catalogo" element={<Catalogo />} />
                <Route path="/catalogo-ropa-accesorios" element={<CatalogoRopaAccesorios />} />
                <Route path="/carrito" element={<Carrito />} />
                <Route path="/tarjeta" element={<Tarjeta />} />
                <Route path="/administrador" element={<Administrador />} />
                <Route path="/parejas" element={<Parejas />} />
                <Route path="/login" element={<Login />} />
                <Route path="/usuario" element={<Usuario />} />
                <Route path="/contacto" element={<Contacto />} />
                <Route path="/soporte" element={<Soporte />} />
            </Routes>

            {!esRutaAdministrador && <PieDePagina />}
        </>
    );
}

export default App;