import { Routes, Route } from "react-router-dom";

import Encabezado from "./componentes/encabezado/encabezado";
import PieDePagina from "./componentes/pie_de_pagina/pie_de_pagina";

import Inicio from "./paginas/inicio/inicio";
import Catalogo from "./paginas/catalogo/catalogo";

function App() {
    return (
        <>
            <Encabezado />

            <Routes>
                <Route path="/" element={<Inicio />} />
                <Route path="/catalogo" element={<Catalogo />} />
            </Routes>

            <PieDePagina />
        </>
    );
}

export default App;