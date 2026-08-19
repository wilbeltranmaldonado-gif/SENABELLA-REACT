import { Routes, Route } from "react-router-dom";

import Encabezado from "./componentes/encabezado/encabezado";
import Pie_de_pagina from "./componentes/pie_de_pagina/pie_de_pagina"



function App() {

    return (
        <>
            <Encabezado />

            <main>
                <h1>Senabella</h1>
                <p>Estamos migrando el proyecto a React.</p>
            </main>

            <Pie_de_pagina />
        </>
    );
}

export default App;