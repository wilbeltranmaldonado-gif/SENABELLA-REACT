import { Routes, Route } from "react-router-dom";

import Encabezado from "./componentes/encabezado/encabezado";
import PieDePagina from "./componentes/pie_de_pagina/pie_de_pagina";

import Inicio from "./paginas/inicio/inicio";
import Catalogo from "./paginas/catalogo/catalogo";
import CatalogoRopaAccesorios from "./paginas/catalogo_ropa_accesorios/catalogo_ropa_accesorios";
import Carrito from "./paginas/carrito/carrito";
import Tarjeta from "./paginas/tarjeta/tarjeta";

function App() {
    return (
        <>
            <Encabezado />

            <Routes>
                <Route path="/" element={<Inicio />} />
                <Route path="/catalogo" element={<Catalogo />} />
                <Route path="/catalogo-ropa-accesorios" element={<CatalogoRopaAccesorios />} />
                <Route path="/catalogo_ropa_accesorios" element={<CatalogoRopaAccesorios />} />
                <Route path="/carrito" element={<Carrito />} />
                <Route path="/tarjeta" element={<Tarjeta />} />
                <Route path="/tarjetas" element={<Tarjeta />} />
            </Routes>

            <PieDePagina />
        </>
    );
}

export default App;