// Este componente agrega el botón para volver al inicio de la página.

import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./boton_subir.css";

function BotonSubir() {
    const [visible, setVisible] = useState(false);
    const location = useLocation();

    // Rutas donde NO se muestra el botón (administrador, inicio, registro)
    const rutasOcultas = ["/administrador", "/", "/registro"];

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setVisible(true);
            } else {
                setVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    if (rutasOcultas.includes(location.pathname)) {
        return null;
    }

    return (
        <div className={`boton-subir ${visible ? "visible" : ""}`} onClick={scrollToTop}>
            <i className="fa-solid fa-arrow-up"></i>
        </div>
    );
}

export default BotonSubir;
