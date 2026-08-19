// ==========================================
// TARJETAS - JAVASCRIPT
// ==========================================


// ==========================================
// PARTÍCULAS DEL HERO
// ==========================================

function crearParticulas() {
    const contenedor = document.getElementById("hero-particulas");
    if (!contenedor) return;

    for (let i = 0; i < 20; i++) {
        const particula = document.createElement("div");
        particula.classList.add("hero-particula");
        particula.style.left = Math.random() * 100 + "%";
        particula.style.top = Math.random() * 100 + "%";
        particula.style.animationDelay = Math.random() * 6 + "s";
        particula.style.animationDuration = (4 + Math.random() * 4) + "s";
        contenedor.appendChild(particula);
    }
}

crearParticulas();


// ==========================================
// ANIMACIÓN AL HACER SCROLL
// ==========================================

function animarAlScroll() {
    const elementos = document.querySelectorAll(
        ".beneficio-tarjeta, .stat-item, .paso-item"
    );

    const observador = new IntersectionObserver(
        function (entradas) {
            entradas.forEach(function (entrada) {
                if (entrada.isIntersecting) {
                    entrada.target.style.opacity = "1";
                    entrada.target.style.transform = "translateY(0)";
                    observador.unobserve(entrada.target);
                }
            });
        },
        { threshold: 0.15 }
    );

    elementos.forEach(function (el, index) {
        el.style.opacity = "0";
        el.style.transform = "translateY(30px)";
        el.style.transition =
            "opacity 0.6s ease " + (index * 0.1) + "s, " +
            "transform 0.6s ease " + (index * 0.1) + "s";
        observador.observe(el);
    });
}

animarAlScroll();


// ==========================================
// VALIDACIONES Y PREVIEW DE LA TARJETA
// ==========================================

const campoNombre = document.getElementById("nombre-completo");
const campoDocumento = document.getElementById("documento");
const campoCorreo = document.getElementById("correo");
const campoTelefono = document.getElementById("telefono");
const campoPrograma = document.getElementById("programa");
const previewNombre = document.getElementById("preview-nombre");

// Validar Nombre: sin números y máximo 32 caracteres
if (campoNombre) {
    campoNombre.addEventListener("input", function () {
        this.value = this.value.replace(/[0-9]/g, "").slice(0, 32);

        const valor = this.value.trim();
        if (previewNombre) {
            previewNombre.textContent = valor.length > 0 ? valor.toUpperCase() : "JUAN PÉREZ";
        }
    });
}

// Validar Número de documento: solo números y máximo 32 caracteres
if (campoDocumento) {
    campoDocumento.addEventListener("input", function () {
        this.value = this.value.replace(/[^0-9]/g, "").slice(0, 32);
    });
}

// Validar Correo electrónico: máximo 50 caracteres
if (campoCorreo) {
    campoCorreo.addEventListener("input", function () {
        this.value = this.value.slice(0, 50);
    });
}

// Validar Teléfono: solo números, +, espacios, guiones. Máximo 15 caracteres
if (campoTelefono) {
    campoTelefono.addEventListener("input", function () {
        this.value = this.value.replace(/[^0-9+\s-]/g, "").slice(0, 15);
    });
    // Bloquear teclas no numéricas
    campoTelefono.addEventListener("keydown", function (e) {
        const permitidas = ["Backspace","Delete","Tab","Escape","Enter","ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Home","End"];
        if (permitidas.includes(e.key) || e.ctrlKey || e.metaKey) return;
        if (!/^[0-9+\s\-]$/.test(e.key)) e.preventDefault();
    });
    // Bloquear pegado de letras
    campoTelefono.addEventListener("paste", function (e) {
        e.preventDefault();
        const texto = (e.clipboardData || window.clipboardData).getData("text");
        this.value = texto.replace(/[^0-9+\s-]/g, "").slice(0, 15);
    });
}

// Validar Programa de formación: máximo 100 caracteres
if (campoPrograma) {
    campoPrograma.addEventListener("input", function () {
        this.value = this.value.slice(0, 100);
    });
}


// ==========================================
// FORMULARIO - ENVÍO
// ==========================================

const formulario = document.getElementById("formulario-tarjeta");
const mensajeExito = document.getElementById("mensaje-exito");
const botonSolicitar = document.getElementById("boton-solicitar");

if (formulario) {
    formulario.addEventListener("submit", function (evento) {
        evento.preventDefault();

        // Deshabilitar botón
        botonSolicitar.disabled = true;
        botonSolicitar.innerHTML =
            '<i class="fa-solid fa-spinner fa-spin"></i> Procesando...';

        // Simular envío
        setTimeout(function () {
            formulario.style.display = "none";
            mensajeExito.classList.add("mostrar");
        }, 1500);
    });
}


// ==========================================
// ANIMACIÓN CONTADORES (STATS)
// ==========================================

function animarContador(elemento, valorFinal, duracion) {
    const esNumero = /^\d/.test(valorFinal);
    if (!esNumero) return;

    const numero = parseInt(valorFinal.replace(/[^0-9]/g, ""));
    const sufijo = valorFinal.replace(/[0-9,]/g, "");
    const tieneFormato = valorFinal.includes(",");

    let inicio = 0;
    const incremento = numero / (duracion / 16);
    const intervalo = setInterval(function () {
        inicio += incremento;
        if (inicio >= numero) {
            inicio = numero;
            clearInterval(intervalo);
        }

        let textoNumero = Math.floor(inicio).toString();
        if (tieneFormato) {
            textoNumero = Math.floor(inicio).toLocaleString("es-CO");
        }

        elemento.textContent = textoNumero + sufijo;
    }, 16);
}

const contadorObservador = new IntersectionObserver(
    function (entradas) {
        entradas.forEach(function (entrada) {
            if (entrada.isIntersecting) {
                const stats = entrada.target.querySelectorAll(".stat-numero");
                stats.forEach(function (stat) {
                    animarContador(stat, stat.textContent, 2000);
                });
                contadorObservador.unobserve(entrada.target);
            }
        });
    },
    { threshold: 0.3 }
);

const statsGrid = document.querySelector(".stats-grid");
if (statsGrid) {
    contadorObservador.observe(statsGrid);
}


// ==========================================
// SCROLL SUAVE PARA LINKS INTERNOS
// ==========================================

document.querySelectorAll('a[href^="#"]').forEach(function (enlace) {
    enlace.addEventListener("click", function (evento) {
        const destino = document.querySelector(this.getAttribute("href"));
        if (destino) {
            evento.preventDefault();
            destino.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    });
});
