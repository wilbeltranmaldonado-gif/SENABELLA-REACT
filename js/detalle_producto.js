// Función para actualizar los datos de la vista con el producto guardado
function actualizarDetalleProducto() {
    let productoGuardado = localStorage.getItem("productoSeleccionado");
    if (!productoGuardado) return;

    let producto = JSON.parse(productoGuardado);

    let imagenPrincipal = document.querySelector(".imagen-producto > img");
    let miniaturas = document.querySelectorAll(".mini-miniaturas img");
    let tituloEl = document.querySelector(".info-producto h1");
    let categoriaEl = document.querySelector(".info-producto .categoria");
    let descripcionEl = document.querySelector(".info-producto .descripcion");
    let precioActualEl = document.querySelector(".precio-actual");
    let precioAntiguoEl = document.querySelector(".precio-antiguo");

    if (tituloEl && producto.titulo) tituloEl.textContent = producto.titulo;
    if (categoriaEl && producto.marca) categoriaEl.textContent = producto.marca;
    if (descripcionEl && producto.descripcion) descripcionEl.textContent = producto.descripcion;

    if (imagenPrincipal && producto.imagen) {
        imagenPrincipal.src = producto.imagen;
        imagenPrincipal.alt = producto.titulo || "Producto";

        miniaturas.forEach(function (miniatura) {
            miniatura.src = producto.imagen;
        });
    }

    if (precioActualEl && producto.precioActual) precioActualEl.textContent = producto.precioActual;
    if (precioAntiguoEl && producto.precioAntiguo) precioAntiguoEl.textContent = producto.precioAntiguo;

    let btnVolverCatalogo = document.querySelector(".btn-terciario-catalogo");
    if (btnVolverCatalogo && producto.origen) {
        btnVolverCatalogo.href = producto.origen;
    }

    // Actualizar características dinámicas según la información del producto
    let listaEspec = document.querySelector(".lista-especificaciones");
    if (listaEspec && producto.descripcion) {
        let desc = producto.descripcion.toLowerCase();
        let especs = [];

        if (desc.includes("kindle")) {
            especs = [
                "Pantalla de 7 pulgadas con tecnología e-paper antirreflejos",
                "Almacenamiento de 32 GB Signature Edition",
                "Batería de alta duración para semanas de lectura continuada"
            ];
        } else if (desc.includes("impresora") || desc.includes("smart tank")) {
            especs = [
                "Impresión multifuncional (Imprime, escanea y copia)",
                "Conexión inalámbrica Wi-Fi de alta velocidad",
                "Incluye sistema de tintas continuas con gran rendimiento"
            ];
        } else if (desc.includes("portátil") || desc.includes("ryzen") || desc.includes("hp") || desc.includes("lenovo")) {
            especs = [
                "Procesador potente para multitarea y rendimiento fluido",
                "Pantalla Full HD de alta definición y bordes delgados",
                "Almacenamiento SSD ultra rápido y memoria RAM de alto rendimiento"
            ];
        } else if (desc.includes("starlink")) {
            especs = [
                "Internet satelital de alta velocidad y baja latencia",
                "Kit estándar V4 con fácil instalación plug and play",
                "Diseñado para soportar condiciones climáticas extremas"
            ];
        } else if (desc.includes("tablet")) {
            especs = [
                "Pantalla táctil con excelente resolución y colores vivos",
                "Sistema de altavoces envolventes para multimedia",
                "Incluye funda de protección y auriculares Moto Buds"
            ];
        } else if (desc.includes("disco") || desc.includes("toshiba")) {
            especs = [
                "Capacidad de almacenamiento masivo de 2 TB",
                "Conexión de alta velocidad USB 3.0 compatible con PC y Mac",
                "Incluye estuche de protección resistente a impactos"
            ];
        } else {
            especs = [
                "Diseño de alta calidad con garantía oficial",
                "Excelente relación calidad-precio y durabilidad",
                "Envío asegurado y soporte técnico prioritario"
            ];
        }

        listaEspec.innerHTML = "";
        especs.forEach(function (item) {
            let li = document.createElement("li");
            li.textContent = item;
            listaEspec.appendChild(li);
        });
    }

    actualizarEstadoFavorito();
}

function actualizarEstadoFavorito() {
    let btnFav = document.getElementById("btn-favorito-detalle");
    if (!btnFav) return;

    let titulo = document.querySelector(".info-producto h1")?.textContent.trim() || "";
    let esFav = window.SenabellaFavoritos ? window.SenabellaFavoritos.esFavorito(titulo) : false;

    let icono = btnFav.querySelector("i");
    if (icono) {
        icono.className = esFav ? "fa-solid fa-heart" : "fa-regular fa-heart";
    }
    btnFav.classList.toggle("activo", esFav);
}

// Intentar actualizar inmediatamente por si los elementos DOM ya existen
actualizarDetalleProducto();

document.addEventListener("DOMContentLoaded", function () {
    // Asegurar actualización completa al estar listo el DOM
    actualizarDetalleProducto();

    // Gestión del botón de favoritos (Corazón)
    let btnFav = document.getElementById("btn-favorito-detalle");
    if (btnFav) {
        btnFav.addEventListener("click", function () {
            let titulo = document.querySelector(".info-producto h1")?.textContent.trim() || "Producto Senabella";
            let marca = document.querySelector(".info-producto .categoria")?.textContent.trim() || "SENABELLA";
            let precioText = document.querySelector(".precio-actual")?.textContent.trim() || "$ 0";
            let img = document.querySelector(".imagen-producto > img")?.src || "";

            let prodFav = {
                id: titulo,
                nombre: titulo,
                marca: marca,
                precioTexto: precioText,
                imagen: img,
                referencia: marca
            };

            if (window.SenabellaFavoritos) {
                let esFav = window.SenabellaFavoritos.esFavorito(titulo);
                if (esFav) {
                    window.SenabellaFavoritos.eliminar(titulo);
                    if (window.SenabellaToast) {
                        window.SenabellaToast("Producto eliminado de favoritos", "fa-heart-crack");
                    }
                    actualizarEstadoFavorito();
                } else {
                    let resultado = window.SenabellaFavoritos.agregar(prodFav);
                    if (resultado !== false) {
                        if (window.SenabellaToast) {
                            window.SenabellaToast("¡Producto guardado en favoritos!", "fa-heart");
                        }
                        actualizarEstadoFavorito();
                    }
                }
            }
        });
    }

    let imagenPrincipal = document.querySelector(".imagen-producto > img");
    let miniaturas = document.querySelectorAll(".mini-miniaturas img");

    // Cambiar imagen al hacer clic en miniaturas
    if (miniaturas.length > 0) {
        miniaturas.forEach(function (miniatura) {
            miniatura.addEventListener("click", function () {
                if (imagenPrincipal) {
                    imagenPrincipal.src = miniatura.src;
                    imagenPrincipal.alt = miniatura.alt;
                }
            });
        });
    }

    // Funcionalidad para los botones (Agregar al carrito y Comprar ahora)
    let btnAgregarCarrito = document.querySelector(".btn-primario");
    let btnComprarAhora = document.querySelector(".btn-secundario");

    function obtenerDatosActualesProducto() {
        let titulo = document.querySelector(".info-producto h1")?.textContent.trim() || "Producto Senabella";
        let marca = document.querySelector(".info-producto .categoria")?.textContent.trim() || "SENABELLA";
        let precioText = document.querySelector(".precio-actual")?.textContent.trim() || "$ 0";
        let img = document.querySelector(".imagen-producto > img")?.src || "";

        return {
            nombre: titulo,
            marca: marca,
            color: "Estándar",
            precioText: precioText,
            img: img,
            cantidad: 1
        };
    }

    if (btnAgregarCarrito) {
        btnAgregarCarrito.addEventListener("click", function () {
            let prod = obtenerDatosActualesProducto();

            if (window.SenabellaCart) {
                window.SenabellaCart.agregarProducto(prod);
            }

            // Crear notificación elegante personalizada si no existe el helper
            let contenedorToast = document.getElementById("contenedor-toast");
            if (!contenedorToast) {
                contenedorToast = document.createElement("div");
                contenedorToast.id = "contenedor-toast";
                document.body.appendChild(contenedorToast);
            }

            let toast = document.createElement("div");
            toast.className = "toast-senabella toast-exito";
            toast.innerHTML =
                '<i class="fa-solid fa-circle-check"></i>' +
                '<span>¡<strong>' + prod.marca + '</strong> se agregó al carrito!</span>' +
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
        });
    }

    if (btnComprarAhora) {
        btnComprarAhora.addEventListener("click", function () {
            let prod = obtenerDatosActualesProducto();

            if (window.SenabellaCart) {
                window.SenabellaCart.agregarProducto(prod);
            }

            // Redirigir directamente al carrito para finalizar la compra
            window.location.href = "carrito.html";
        });
    }

    // Funcionalidad interactiva para la sección "También te puede interesar"
    let tarjetasRecomendaciones = document.querySelectorAll(".reco-card");
    tarjetasRecomendaciones.forEach(function (card) {
        card.addEventListener("click", function () {
            let titulo = card.querySelector("h3")?.textContent.trim() || "Producto recomendado";
            let descripcion = card.querySelector("p")?.textContent.trim() || "Excelente producto de tecnología con garantía oficial Senabella.";
            let precio = card.querySelector("span")?.textContent.trim() || "$ 0";
            let img = card.querySelector("img")?.src || "";
            
            // Extraer marca desde la primera palabra del título
            let marca = titulo.split(" ")[0] || "SENABELLA";

            // Calcular un precio antiguo de referencia (+20%)
            let precioNum = parseFloat(precio.replace(/[^\d]/g, "")) || 0;
            let precioAntiguoNum = Math.round(precioNum * 1.25);
            let precioAntiguoText = precioAntiguoNum > 0 ? "$ " + precioAntiguoNum.toLocaleString("es-CO") : "$ 0";

            let nuevoProducto = {
                titulo: titulo,
                marca: marca.toUpperCase(),
                descripcion: descripcion,
                precioActual: precio,
                precioAntiguo: precioAntiguoText,
                imagen: img
            };

            // Guardar el nuevo producto seleccionado en localStorage y actualizar la vista
            localStorage.setItem("productoSeleccionado", JSON.stringify(nuevoProducto));
            actualizarDetalleProducto();

            // Desplazar suavemente a la parte superior para mostrar el producto cargado
            window.scrollTo({ top: 0, behavior: "smooth" });

            // Mostrar notificación toast de confirmación
            let contenedorToast = document.getElementById("contenedor-toast");
            if (!contenedorToast) {
                contenedorToast = document.createElement("div");
                contenedorToast.id = "contenedor-toast";
                document.body.appendChild(contenedorToast);
            }

            let toast = document.createElement("div");
            toast.className = "toast-senabella toast-exito";
            toast.innerHTML =
                '<i class="fa-solid fa-eye"></i>' +
                '<span>Cargado: <strong>' + titulo + '</strong></span>' +
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
            }, 3000);
        });
    });
});

