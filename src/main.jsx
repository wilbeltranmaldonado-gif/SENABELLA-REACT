import React from "react";
import ReactDOM from "react-dom/client";
import '../src/componentes/encabezado/encabezado.css'
import '../src/componentes/pie_de_pagina/pie_de_pagina.css'
import App from './App.jsx'

import "./index.css";

import { BrowserRouter } from "react-router-dom";


ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>
);
