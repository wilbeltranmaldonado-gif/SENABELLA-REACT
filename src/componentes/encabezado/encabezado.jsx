import { useState, useEffect } from "react";

// ==========================================
// HEADER (versión React)
// ==========================================
// Nota: este componente asume que Font Awesome ya está cargado
// globalmente en tu proyecto (igual que en tu versión original en HTML),
// y que las clases CSS (contenido_principal, sub-navegacion, etc.)
// siguen definidas en tu hoja de estilos.

export default function Encabezado() {
  const [modoOscuro, setModoOscuro] = useState(false);
  const [ubicacion, setUbicacion] = useState("");
  const [menuTarjetasAbierto, setMenuTarjetasAbierto] = useState(false);
  const [menuAyudaAbierto, setMenuAyudaAbierto] = useState(false);

  // ==========================================
  // Cargar preferencias guardadas al montar
  // ==========================================
  useEffect(() => {
    const modoGuardado = localStorage.getItem("modoOscuro");

    if (modoGuardado === "activado") {
      setModoOscuro(true);
      document.body.classList.add("modo-oscuro");
    }

    const ubicacionGuardada = localStorage.getItem("ubicacion");

    if (ubicacionGuardada) {
      setUbicacion(ubicacionGuardada);
    }
  }, []);

  // ==========================================
  // MODO OSCURO
  // ==========================================
  const alternarModoOscuro = () => {
    const nuevoEstado = !modoOscuro;
    setModoOscuro(nuevoEstado);

    if (nuevoEstado) {
      document.body.classList.add("modo-oscuro");
      localStorage.setItem("modoOscuro", "activado");
    } else {
      document.body.classList.remove("modo-oscuro");
      localStorage.setItem("modoOscuro", "desactivado");
    }
  };

  // ==========================================
  // UBICACIÓN
  // ==========================================
  const cambiarUbicacion = () => {
    const ciudad = prompt("¿Cuál es tu ciudad?");

    if (ciudad !== null && ciudad.trim() !== "") {
      const ciudadLimpia = ciudad.trim();
      setUbicacion(ciudadLimpia);
      localStorage.setItem("ubicacion", ciudadLimpia);
    }
  };

  return (
    <>
      <header className="contenido_principal">
        <div className="logo">
          <a href="inicio.html">
            <img
              src="../recursos/logo.png"
              alt="Senabella"
              width="130"
              height="50"
            />
          </a>
        </div>

        <div className="contenedor-busqueda">
          <input
            type="text"
            className="entrada-busqueda"
            placeholder="Buscar en Senabella.com"
          />

          <button className="boton-busqueda">
            <i className="fa-solid fa-magnifying-glass"></i>
          </button>
        </div>

        <button
          id="theme-toggle"
          className="btn btn-outline-secondary"
          onClick={alternarModoOscuro}
        >
          {modoOscuro ? (
            <>
              <i className="fa-solid fa-sun"></i> Modo claro
            </>
          ) : (
            <>
              <i className="fa-solid fa-moon"></i> Modo oscuro
            </>
          )}
        </button>

        <div className="acciones-usuario">
          <div className="cuenta-usuario">
            <div className="texto-usuario texto-usuario-bold">
              <a href="usuario.html">Mi cuenta</a>
            </div>
          </div>

          <a href="#">
            <i className="fa-regular fa-heart icono-corazon"></i>
          </a>

          <a href="carrito.html" className="icono-carrito">
            <i className="fa-solid fa-cart-shopping"></i>
            <p className="contador-carrito"> 0 </p>
          </a>
        </div>
      </header>

      <div className="sub-navegacion">
        <div className="boton-ubicacion" onClick={cambiarUbicacion}>
          <i className="fa-solid fa-location-dot"></i>
          {ubicacion ? ` ${ubicacion}` : " Ingresa tu ubicación"}
        </div>

        <div className="enlaces-navegacion">
          <a href="inicio.html">Vende en Senabella.com</a>

          {/* TARJETAS Y CUENTAS */}
          <div className="menu-desplegable">
            <button
              className={`boton-desplegable${menuTarjetasAbierto ? " activo" : ""}`}
              id="boton-tarjetas"
              onClick={() => setMenuTarjetasAbierto(!menuTarjetasAbierto)}
            >
              Tarjetas y cuentas
              <i className="fa-solid fa-chevron-down"></i>
            </button>

            <div
              className={`contenido-desplegable${menuTarjetasAbierto ? " mostrar" : ""}`}
              id="menu-tarjetas"
            >
              <a href="catalogo.html">Tarjetas</a>
              <a href="cuentas.html">Cuentas</a>
              <a href="regalos.html">Tarjetas de regalo</a>
            </div>
          </div>

          <a href="parejas.html">Parejas</a>

          {/* AYUDA */}
          <div className="menu-desplegable">
            <button
              className={`boton-desplegable${menuAyudaAbierto ? " activo" : ""}`}
              id="boton-ayuda"
              onClick={() => setMenuAyudaAbierto(!menuAyudaAbierto)}
            >
              Ayuda
              <i className="fa-solid fa-chevron-down"></i>
            </button>

            <div
              className={`contenido-desplegable${menuAyudaAbierto ? " mostrar" : ""}`}
              id="menu-ayuda"
            >
              <a href="preguntas.html">Preguntas frecuentes</a>
              <a href="contacto.html">Contáctanos</a>
              <a href="soporte.html">Soporte</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
