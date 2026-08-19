
// ==========================================
// HEADER
// ==========================================

const headerHTML = `
    <header class="contenido_principal">

        <button class="boton-hamburguesa" id="boton-hamburguesa" aria-label="Abrir menú">
            <i class="fa-solid fa-bars"></i>
        </button>

        <div class="logo">
            <a href="inicio.html">
                <img src="../recursos/logo.png"
                     alt="Senabella"
                     width="130"
                     height="50">
            </a>
        </div>

        <div class="contenedor-busqueda">
            <input
                type="text"
                class="entrada-busqueda"
                placeholder="Buscar en Senabella.com"
            >

            <button class="boton-busqueda">
                <i class="fa-solid fa-magnifying-glass"></i>
            </button>
        </div>

        <button id="theme-toggle" class="btn btn-outline-secondary">
            <i class="fa-solid fa-moon"></i>
            <span class="texto-modo">Modo oscuro</span>
        </button>

        <div class="acciones-usuario">

            <div class="cuenta-usuario">
                <div class="texto-usuario texto-usuario-bold">
                    <a href="usuario.html" id="enlace-cuenta">Mi cuenta</a>
                </div>
            </div>

            <a href="favoritos.html">
                <i class="fa-regular fa-heart icono-corazon"></i>
            </a>

            <a href="carrito.html" class="icono-carrito">
                <i class="fa-solid fa-cart-shopping"></i>
                <p class="contador-carrito"> 0 </p>
            </a>

        </div>

    </header>

    <!-- OVERLAY PARA MENU MOVIL -->
    <div class="menu-movil-overlay" id="menu-movil-overlay"></div>

    <!-- MENU LATERAL MOVIL -->
    <nav class="menu-movil" id="menu-movil">
        <div class="menu-movil-cabecera">
            <span class="menu-movil-titulo">Menú</span>
            <button class="menu-movil-cerrar" id="menu-movil-cerrar" aria-label="Cerrar menú">
                <i class="fa-solid fa-xmark"></i>
            </button>
        </div>
        <div class="menu-movil-enlaces">
            <a href="inicio.html"><i class="fa-solid fa-house"></i> Inicio</a>
            <a href="catalogo.html"><i class="fa-solid fa-microchip"></i> Productos Tecnológicos</a>
            <a href="catalogo_ropa_accesorios.html"><i class="fa-solid fa-shirt"></i> Ropa y Accesorios</a>
            <a href="vender.html"><i class="fa-solid fa-store"></i> Vende en Senabella.com</a>
            <a href="tarjetas.html"><i class="fa-solid fa-credit-card"></i> Tarjetas y cuentas</a>
            <a href="parejas.html"><i class="fa-solid fa-heart"></i> Parejas</a>
            <a href="contacto.html"><i class="fa-solid fa-envelope"></i> Contáctanos</a>
            <a href="soporte.html"><i class="fa-solid fa-headset"></i> Soporte</a>
            <a href="favoritos.html"><i class="fa-regular fa-heart"></i> Favoritos</a>
            <a href="carrito.html"><i class="fa-solid fa-cart-shopping"></i> Carrito</a>
        </div>
    </nav>

    <div class="sub-navegacion">

        <div class="menu-desplegable">
            <button class="boton-ubicacion boton-desplegable" id="boton-ubicacion">
                <i class="fa-solid fa-location-dot"></i>
                <span id="texto-ubicacion">Ingresa tu ubicación</span>
                <i class="fa-solid fa-chevron-down"></i>
            </button>
            <div class="contenido-desplegable" id="menu-ubicacion" style="min-width:220px;">
                <a href="#" class="opcion-ciudad" data-ciudad="Bogotá">Bogotá</a>
                <a href="#" class="opcion-ciudad" data-ciudad="Medellín">Medellín</a>
                <a href="#" class="opcion-ciudad" data-ciudad="Cali">Cali</a>
                <a href="#" class="opcion-ciudad" data-ciudad="Barranquilla">Barranquilla</a>
                <a href="#" class="opcion-ciudad" data-ciudad="Cartagena">Cartagena</a>
                <a href="#" class="opcion-ciudad" data-ciudad="Bucaramanga">Bucaramanga</a>
                <a href="#" class="opcion-ciudad" data-ciudad="Pereira">Pereira</a>
                <a href="#" class="opcion-ciudad" data-ciudad="Manizales">Manizales</a>
                <a href="#" class="opcion-ciudad" data-ciudad="Santa Marta">Santa Marta</a>
                <a href="#" class="opcion-ciudad" data-ciudad="Cúcuta">Cúcuta</a>
                <a href="#" class="opcion-ciudad" data-ciudad="Villavicencio">Villavicencio</a>
                <a href="#" class="opcion-ciudad" data-ciudad="Ibagué">Ibagué</a>
            </div>
        </div>

        <div class="enlaces-navegacion">

            <a href="catalogo.html">
                Productos Tecnológicos
            </a>

            <a href="catalogo_ropa_accesorios.html">
                Ropa y Accesorios
            </a>

            <a href="vender.html">
                Vende en Senabella.com
            </a>

            
        <!-- TARJETAS Y CUENTAS -->

        <div class="menu-desplegable">

            <button class="boton-desplegable" id="boton-tarjetas">
                Tarjetas y cuentas
                <i class="fa-solid fa-chevron-down"></i>
            </button>

            <div class="contenido-desplegable" id="menu-tarjetas">

                <a href="tarjetas.html">
                    Tarjetas
                </a>

            </div>

        </div>

            <a href="parejas.html">
                Parejas
            </a>


             <!-- AYUDA -->

        <div class="menu-desplegable">

            <button class="boton-desplegable" id="boton-ayuda">
                Ayuda
                <i class="fa-solid fa-chevron-down"></i>
            </button>

            <div class="contenido-desplegable" id="menu-ayuda">

                <a href="contacto.html">
                    Contáctanos
                </a>

                <a href="soporte.html">
                    Soporte
                </a>

            </div>

        </div>


    </div>
`;

// Agregar el header a la página
document.body.insertAdjacentHTML("afterbegin", headerHTML);

// Asegurar que exista un sistema global de toasts (igual que en carrito.js / inicio.js)
if (!window.SenabellaToast) {
  (function initGlobalToast() {
    let contenedorToast = document.getElementById("contenedor-toast");
    if (!contenedorToast) {
      contenedorToast = document.createElement("div");
      contenedorToast.id = "contenedor-toast";
      document.body.appendChild(contenedorToast);
    }

    window.SenabellaToast = function (mensaje, icono, tipo) {
      try {
        let toast = document.createElement("div");
        toast.className = "toast-senabella toast-" + (tipo || "exito");
        toast.innerHTML =
          '<i class="fa-solid ' + (icono || "fa-circle-check") + '"></i>' +
          '<span>' + mensaje + '</span>' +
          '<button class="toast-cerrar"><i class="fa-solid fa-xmark"></i></button>';

        contenedorToast.appendChild(toast);
        setTimeout(function () { toast.classList.add("toast-visible"); }, 10);

        toast.querySelector(".toast-cerrar").addEventListener("click", function () {
          toast.classList.remove("toast-visible");
          setTimeout(function () { toast.remove(); }, 300);
        });

        setTimeout(function () {
          toast.classList.remove("toast-visible");
          setTimeout(function () { toast.remove(); }, 300);
        }, 3500);
      } catch (e) {
        // Silenciar errores de toast para no romper otras interacciones
        console.error('SenabellaToast error:', e);
      }
    };
  })();
}


// ==========================================
// ENLACE DE CUENTA (Iniciar sesión / Mi cuenta / Panel Admin)
// ==========================================
// Según si hay una sesión activa y el rol guardado (cliente o administrador),
// el enlace del encabezado cambia de texto y de destino.

(function actualizarEnlaceCuenta() {

    const enlaceCuenta = document.querySelector("#enlace-cuenta");
    if (!enlaceCuenta) return;

    const sesionActiva = localStorage.getItem("senabella_sesion") === "activa";
    const rolUsuario = localStorage.getItem("senabella_rol");

    if (!sesionActiva) {
        enlaceCuenta.textContent = "Iniciar sesión";
        enlaceCuenta.setAttribute("href", "login.html");
    } else if (rolUsuario === "administrador") {
        enlaceCuenta.textContent = "Panel Admin";
        enlaceCuenta.setAttribute("href", "administrador.html");
    } else {
        enlaceCuenta.textContent = "Mi cuenta";
        enlaceCuenta.setAttribute("href", "usuario.html");
    }

})();


// ==========================================
// MODO OSCURO
// ==========================================

const botonModo = document.querySelector("#theme-toggle");

// Revisar si ya había un modo guardado
const modoGuardado = localStorage.getItem("modoOscuro");

if (modoGuardado === "activado") {

    document.body.classList.add("modo-oscuro");

    botonModo.innerHTML =
        '<i class="fa-solid fa-sun"></i> Modo claro';
}


// Cambiar modo
botonModo.addEventListener("click", function () {

    document.body.classList.toggle("modo-oscuro");

    if (document.body.classList.contains("modo-oscuro")) {

        botonModo.innerHTML =
            '<i class="fa-solid fa-sun"></i> Modo claro';

        localStorage.setItem(
            "modoOscuro",
            "activado"
        );

    } else {

        botonModo.innerHTML =
            '<i class="fa-solid fa-moon"></i> Modo oscuro';

        localStorage.setItem(
            "modoOscuro",
            "desactivado"
        );
    }

});


// ==========================================
// UBICACIÓN (DROPDOWN DE CIUDADES)
// ==========================================

const botonUbicacion = document.querySelector("#boton-ubicacion");
const menuUbicacion = document.querySelector("#menu-ubicacion");
const textoUbicacion = document.querySelector("#texto-ubicacion");

// Revisar si existe una ubicación guardada
const ubicacionGuardada = localStorage.getItem("ubicacion");

if (ubicacionGuardada && textoUbicacion) {
    textoUbicacion.textContent = ubicacionGuardada;
}

// Abrir / cerrar dropdown
if (botonUbicacion && menuUbicacion) {
    botonUbicacion.addEventListener("click", function (e) {
        e.stopPropagation();
        menuUbicacion.classList.toggle("mostrar");
    });

    // Seleccionar ciudad
    const opcionesCiudad = menuUbicacion.querySelectorAll(".opcion-ciudad");
    for (let i = 0; i < opcionesCiudad.length; i++) {
        opcionesCiudad[i].addEventListener("click", function (e) {
            e.preventDefault();
            e.stopPropagation();
            const ciudad = opcionesCiudad[i].getAttribute("data-ciudad");
            textoUbicacion.textContent = ciudad;
            localStorage.setItem("ubicacion", ciudad);
            menuUbicacion.classList.remove("mostrar");
        });
    }

    // Cerrar al hacer click fuera
    document.addEventListener("click", function () {
        menuUbicacion.classList.remove("mostrar");
    });
}


// ==========================================
// MENÚ TARJETAS Y CUENTAS
// ==========================================

const botonTarjetas = document.querySelector("#boton-tarjetas");
const menuTarjetas = document.querySelector("#menu-tarjetas");

botonTarjetas.addEventListener("click", function () {
    menuTarjetas.classList.toggle("mostrar");
});


// ==========================================
// MENÚ AYUDA
// ==========================================

const botonAyuda = document.querySelector("#boton-ayuda");
const menuAyuda = document.querySelector("#menu-ayuda");

botonAyuda.addEventListener("click", function () {
    menuAyuda.classList.toggle("mostrar");
});


// ==========================================
// BASE DE DATOS SIMULADA DEL CARRITO (LOCALSTORAGE)
// ==========================================

window.SenabellaCart = {
    KEY: "senabella_cart_db",

    obtenerItems: function () {
        try {
            const datos = localStorage.getItem(this.KEY);
            return datos ? JSON.parse(datos) : [];
        } catch (e) {
            return [];
        }
    },

    guardarItems: function (items) {
        try {
            localStorage.setItem(this.KEY, JSON.stringify(items));
            this.actualizarBadge();
        } catch (e) {
            console.error("Error al guardar carrito:", e);
        }
    },

    agregarProducto: function (producto) {
        let items = this.obtenerItems();
        let existente = items.find(function (item) {
            return item.nombre.trim().toLowerCase() === producto.nombre.trim().toLowerCase();
        });

        if (existente) {
            existente.cantidad = (parseInt(existente.cantidad) || 1) + (parseInt(producto.cantidad) || 1);
            existente.checked = true;
        } else {
            items.push({
                nombre: producto.nombre.trim(),
                marca: producto.marca || "SENABELLA",
                color: producto.color || "Estándar",
                precioText: producto.precioText || "$ 0",
                img: producto.img || "",
                cantidad: parseInt(producto.cantidad) || 1,
                checked: true
            });
        }

        this.guardarItems(items);
    },

    eliminarProducto: function (nombre) {
        let items = this.obtenerItems().filter(function (item) {
            return item.nombre.trim().toLowerCase() !== nombre.trim().toLowerCase();
        });
        this.guardarItems(items);
    },

    limpiarComprados: function () {
        let items = this.obtenerItems().filter(function (item) {
            return !item.checked;
        });
        this.guardarItems(items);
    },

    obtenerTotalCantidad: function () {
        let items = this.obtenerItems();
        return items.reduce(function (sum, item) {
            return sum + (parseInt(item.cantidad) || 1);
        }, 0);
    },

    actualizarBadge: function () {
        let contador = document.querySelector(".contador-carrito");
        if (contador) {
            let total = this.obtenerTotalCantidad();
            contador.textContent = " " + total + " ";
        }
    }
};

// Sincronizar badge y preparar buscador al cargar cualquier página
document.addEventListener("DOMContentLoaded", function () {
    window.SenabellaCart.actualizarBadge();

    const entradaBusqueda = document.querySelector(".entrada-busqueda");
    const botonBusqueda = document.querySelector(".boton-busqueda");

    // Pre-llenar campo de búsqueda si hay parámetro en la URL
    const urlParams = new URLSearchParams(window.location.search);
    const terminoUrl = urlParams.get("busqueda") || urlParams.get("q");
    if (terminoUrl && entradaBusqueda) {
        entradaBusqueda.value = terminoUrl;
    }

    function ejecutarBusquedaHeader() {
        if (!entradaBusqueda) return;
        const termino = entradaBusqueda.value.trim();
        const esPaginaCatalogo = window.location.pathname.toLowerCase().endsWith("catalogo.html");

        if (!esPaginaCatalogo) {
            if (termino !== "") {
                window.location.href = `catalogo.html?busqueda=${encodeURIComponent(termino)}`;
            } else {
                window.location.href = "catalogo.html";
            }
        } else {
            const url = new URL(window.location.href);
            if (termino !== "") {
                url.searchParams.set("busqueda", termino);
            } else {
                url.searchParams.delete("busqueda");
            }
            window.history.pushState({}, "", url);
            document.dispatchEvent(new CustomEvent("busquedaEjecutada", { detail: termino }));
        }
    }

    if (botonBusqueda && entradaBusqueda) {
        botonBusqueda.addEventListener("click", ejecutarBusquedaHeader);
        entradaBusqueda.addEventListener("keydown", function (e) {
            if (e.key === "Enter") {
                e.preventDefault();
                ejecutarBusquedaHeader();
            }
        });
    }
});


// ==========================================
// MENÚ HAMBURGUESA MÓVIL
// ==========================================

(function iniciarMenuMovil() {
    const botonHamburguesa = document.querySelector("#boton-hamburguesa");
    const menuMovil = document.querySelector("#menu-movil");
    const menuMovilOverlay = document.querySelector("#menu-movil-overlay");
    const botonCerrar = document.querySelector("#menu-movil-cerrar");

    if (!botonHamburguesa || !menuMovil || !menuMovilOverlay || !botonCerrar) return;

    function abrirMenu() {
        menuMovil.classList.add("menu-movil-abierto");
        menuMovilOverlay.classList.add("overlay-visible");
        document.body.style.overflow = "hidden";
    }

    function cerrarMenu() {
        menuMovil.classList.remove("menu-movil-abierto");
        menuMovilOverlay.classList.remove("overlay-visible");
        document.body.style.overflow = "";
    }

    botonHamburguesa.addEventListener("click", function (e) {
        e.stopPropagation();
        abrirMenu();
    });

    botonCerrar.addEventListener("click", cerrarMenu);
    menuMovilOverlay.addEventListener("click", cerrarMenu);

    // Cerrar al presionar Escape
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && menuMovil.classList.contains("menu-movil-abierto")) {
            cerrarMenu();
        }
    });
})();