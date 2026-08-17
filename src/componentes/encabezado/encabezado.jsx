import { useEffect, useState } from "react";
import "./encabezado.css";

import logo from "../../../recursos/logo.png";

function Encabezado() {

    // ==========================================
    // MODO OSCURO
    // ==========================================

    const [modoOscuro, setModoOscuro] = useState(
        localStorage.getItem("modoOscuro") === "activado"
    );


    // ==========================================
    // UBICACIÓN
    // ==========================================

    const [ubicacion, setUbicacion] = useState(
        localStorage.getItem("ubicacion") || ""
    );


    // ==========================================
    // MENÚS
    // ==========================================

    const [menuTarjetas, setMenuTarjetas] = useState(false);
    const [menuAyuda, setMenuAyuda] = useState(false);


    // ==========================================
    // MODO OSCURO
    // ==========================================

    useEffect(() => {

        if (modoOscuro) {

            document.body.classList.add("modo-oscuro");

            localStorage.setItem(
                "modoOscuro",
                "activado"
            );

        } else {

            document.body.classList.remove("modo-oscuro");

            localStorage.setItem(
                "modoOscuro",
                "desactivado"
            );
        }

    }, [modoOscuro]);


    // ==========================================
    // UBICACIÓN
    // ==========================================

    function cambiarUbicacion() {

        const ciudad = prompt("¿Cuál es tu ciudad?");

        if (ciudad !== null && ciudad.trim() !== "") {

            const ciudadLimpia = ciudad.trim();

            setUbicacion(ciudadLimpia);

            localStorage.setItem(
                "ubicacion",
                ciudadLimpia
            );
        }
    }


    return (
        <>

            {/* ==========================================
                HEADER PRINCIPAL
            ========================================== */}

            <header className="contenido_principal">

                {/* LOGO */}

                <div className="logo">

                    <a href="/">

                        <img
                            src={logo}
                            alt="Senabella"
                            width="130"
                            height="50"
                        />

                    </a>

                </div>


                {/* BUSCADOR */}

                <div className="contenedor-busqueda">

                    <input
                        type="text"
                        className="entrada-busqueda"
                        placeholder="Buscar en Senabella.com"
                    />

                    <button
                        className="boton-busqueda"
                        type="button"
                    >
                        <i className="fa-solid fa-magnifying-glass"></i>
                    </button>

                </div>


                {/* MODO OSCURO */}

                <button
                    id="theme-toggle"
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => setModoOscuro(!modoOscuro)}
                >

                    {modoOscuro ? (
                        <>
                            <i className="fa-solid fa-sun"></i>
                            {" "}Modo claro
                        </>
                    ) : (
                        <>
                            <i className="fa-solid fa-moon"></i>
                            {" "}Modo oscuro
                        </>
                    )}

                </button>


                {/* ACCIONES DEL USUARIO */}

                <div className="acciones-usuario">

                    <div className="cuenta-usuario">

                        <div className="texto-usuario texto-usuario-bold">

                            <a href="/usuario">
                                Mi cuenta
                            </a>

                        </div>

                    </div>


                    {/* FAVORITOS */}

                    <a href="#">

                        <i className="fa-regular fa-heart icono-corazon"></i>

                    </a>


                    {/* CARRITO */}

                    <a
                        href="/carrito"
                        className="icono-carrito"
                    >

                        <i className="fa-solid fa-cart-shopping"></i>

                        <p className="contador-carrito">
                            0
                        </p>

                    </a>

                </div>

            </header>


            {/* ==========================================
                SUB NAVEGACIÓN
            ========================================== */}

            <div className="sub-navegacion">

                {/* UBICACIÓN */}

                <button
                    className="boton-ubicacion"
                    type="button"
                    onClick={cambiarUbicacion}
                >

                    <i className="fa-solid fa-location-dot"></i>

                    {ubicacion
                        ? ubicacion
                        : "Ingresa tu ubicación"
                    }

                </button>


                {/* ENLACES */}

                <div className="enlaces-navegacion">

                    <a href="/">
                        Vende en Senabella.com
                    </a>


                    {/* ==================================
                        TARJETAS Y CUENTAS
                    ================================== */}

                    <div className="menu-desplegable">

                        <button
                            className={`boton-desplegable ${
                                menuTarjetas ? "activo" : ""
                            }`}
                            type="button"
                            onClick={() =>
                                setMenuTarjetas(!menuTarjetas)
                            }
                        >

                            Tarjetas y cuentas

                            <i className="fa-solid fa-chevron-down"></i>

                        </button>


                        <div
                            className={`contenido-desplegable ${
                                menuTarjetas ? "mostrar" : ""
                            }`}
                        >

                            <a href="/catalogo">
                                Tarjetas
                            </a>

                            <a href="#">
                                Cuentas
                            </a>

                            <a href="#">
                                Tarjetas de regalo
                            </a>

                        </div>

                    </div>


                    {/* PAREJAS */}

                    <a href="/parejas">
                        Parejas
                    </a>


                    {/* ==================================
                        AYUDA
                    ================================== */}

                    <div className="menu-desplegable">

                        <button
                            className={`boton-desplegable ${
                                menuAyuda ? "activo" : ""
                            }`}
                            type="button"
                            onClick={() =>
                                setMenuAyuda(!menuAyuda)
                            }
                        >

                            Ayuda

                            <i className="fa-solid fa-chevron-down"></i>

                        </button>


                        <div
                            className={`contenido-desplegable ${
                                menuAyuda ? "mostrar" : ""
                            }`}
                            id="menu-ayuda"
                        >

                            <a href="#">
                                Preguntas frecuentes
                            </a>

                            <a href="#">
                                Contáctanos
                            </a>

                            <a href="#">
                                Soporte
                            </a>

                        </div>

                    </div>

                </div>

            </div>

        </>
    );
}

export default Encabezado;