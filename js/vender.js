/* ==========================================
   SENABELLA VENDEDORES - LÓGICA & INTERACTIVIDAD
   ========================================== */

document.addEventListener("DOMContentLoaded", () => {
  // 1. OBSERVADOR DE ANIMACIONES SCROLL (FADE-IN)
  const elementosAnimados = document.querySelectorAll(".fade-in");
  if (elementosAnimados.length > 0) {
    const observador = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (entrada.isIntersecting) {
            entrada.target.classList.add("visible");
            observador.unobserve(entrada.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    elementosAnimados.forEach((el) => observador.observe(el));
  }

  // 2. SIMULADOR DE GANANCIAS PARA VENDEDORES
  const selectCategoria = document.getElementById("sim-categoria");
  const rangoVentas = document.getElementById("sim-ventas-range");
  const rangoValorDisplay = document.getElementById("sim-ventas-val");
  
  const displayVentasBrutas = document.getElementById("sim-res-ventas");
  const displayComision = document.getElementById("sim-res-comision");
  const displayGananciaNeta = document.getElementById("sim-res-ganancia");

  // Tarifas de referencia por categoría (Precio promedio estimado por unidad y % comisión)
  const configuracionCategorias = {
    moda: { precioPromedio: 85000, comisionPct: 0.08 },
    calzado: { precioPromedio: 120000, comisionPct: 0.09 },
    tecnologia: { precioPromedio: 250000, comisionPct: 0.07 },
    hogar: { precioPromedio: 95000, comisionPct: 0.08 },
    belleza: { precioPromedio: 60000, comisionPct: 0.08 }
  };

  function formatearCOP(valor) {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0
    }).format(valor);
  }

  function actualizarCalculoSimulador() {
    if (!selectCategoria || !rangoVentas) return;

    const categoriaSeleccionada = selectCategoria.value || "moda";
    const cantidadUnidades = parseInt(rangoVentas.value, 10) || 50;

    if (rangoValorDisplay) {
      rangoValorDisplay.textContent = `${cantidadUnidades} unidades / mes`;
    }

    const config = configuracionCategorias[categoriaSeleccionada] || configuracionCategorias.moda;
    const ventasBrutas = cantidadUnidades * config.precioPromedio;
    const comisionTotal = ventasBrutas * config.comisionPct;
    const gananciaNeta = ventasBrutas - comisionTotal;

    if (displayVentasBrutas) displayVentasBrutas.textContent = formatearCOP(ventasBrutas);
    if (displayComision) displayComision.textContent = `-${formatearCOP(comisionTotal)} (${(config.comisionPct * 100).toFixed(0)}%)`;
    if (displayGananciaNeta) displayGananciaNeta.textContent = formatearCOP(gananciaNeta);
  }

  if (rangoVentas) {
    rangoVentas.addEventListener("input", actualizarCalculoSimulador);
  }
  if (selectCategoria) {
    selectCategoria.addEventListener("change", actualizarCalculoSimulador);
  }
  actualizarCalculoSimulador();

  // 3. ACORDEÓN PREGUNTAS FRECUENTES (FAQ)
  const botonesFaq = document.querySelectorAll(".boton-faq");
  botonesFaq.forEach((boton) => {
    boton.addEventListener("click", () => {
      const item = boton.closest(".item-faq");
      const yaActivo = item.classList.contains("active");

      // Cerrar otros abiertos
      document.querySelectorAll(".item-faq").forEach((otroItem) => {
        otroItem.classList.remove("active");
      });

      if (!yaActivo) {
        item.classList.add("active");
      }
    });
  });

  // 4. PESTAÑAS TIPO VENDEDOR EN FORMULARIO (Persona Natural vs Empresa)
  const botonesPestana = document.querySelectorAll(".boton-pestana");
  const etiquetaDocumento = document.getElementById("etiqueta-documento");
  const entradaDocumento = document.getElementById("entrada-documento");
  const etiquetaMarca = document.getElementById("etiqueta-marca");

  botonesPestana.forEach((pestana) => {
    pestana.addEventListener("click", () => {
      botonesPestana.forEach((p) => p.classList.remove("active"));
      pestana.classList.add("active");

      const tipo = pestana.getAttribute("data-tipo");
      if (tipo === "empresa") {
        if (etiquetaDocumento) etiquetaDocumento.textContent = "NIT de la Empresa";
        if (entradaDocumento) entradaDocumento.placeholder = "Ej: 900.123.456-7";
        if (etiquetaMarca) etiquetaMarca.textContent = "Razón Social o Nombre Comercial";
      } else {
        if (etiquetaDocumento) etiquetaDocumento.textContent = "Número de Cédula (CC / CE)";
        if (entradaDocumento) entradaDocumento.placeholder = "Ej: 1.098.765.432";
        if (etiquetaMarca) etiquetaMarca.textContent = "Nombre de tu Marca o Tienda";
      }
    });
  });

  // 5. VALIDACIÓN EN TIEMPO REAL - TELÉFONO
  const camposTelVender = document.querySelectorAll('input[type="tel"].campo-entrada');
  camposTelVender.forEach(function(campoTel) {
    // Filtrar letras al escribir
    campoTel.addEventListener("input", function () {
      this.value = this.value.replace(/[^0-9+\s\-]/g, "");
      if (this.value.length > 15) this.value = this.value.slice(0, 15);
    });
    // Bloquear teclas no numéricas
    campoTel.addEventListener("keydown", function (e) {
      const permitidas = ["Backspace","Delete","Tab","Escape","Enter","ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Home","End"];
      if (permitidas.includes(e.key) || e.ctrlKey || e.metaKey) return;
      if (!/^[0-9+\s\-]$/.test(e.key)) e.preventDefault();
    });
    // Bloquear pegado de letras
    campoTel.addEventListener("paste", function (e) {
      e.preventDefault();
      const texto = (e.clipboardData || window.clipboardData).getData("text");
      this.value = texto.replace(/[^0-9+\s\-]/g, "").slice(0, 15);
    });
  });

  // 6. ENVÍO DEL FORMULARIO DE REGISTRO
  const formulario = document.getElementById("formulario-registro-vender");
  const botonEnviar = document.getElementById("boton-enviar-vender");

  if (formulario && botonEnviar) {
    formulario.addEventListener("submit", (e) => {
      e.preventDefault();

      // Validar teléfono antes de enviar
      const telInput = formulario.querySelector('input[type="tel"]');
      if (telInput) {
        const soloDigitos = telInput.value.replace(/[^0-9]/g, "");
        if (soloDigitos.length < 7 || soloDigitos.length > 15) {
          alert("El número de teléfono debe tener entre 7 y 15 dígitos.");
          telInput.focus();
          return;
        }
      }

      const contenidoOriginal = botonEnviar.innerHTML;
      botonEnviar.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Procesando tu registro...';
      botonEnviar.disabled = true;

      setTimeout(() => {
        botonEnviar.innerHTML = '<i class="fa-solid fa-check-circle"></i> ¡Solicitud Recibida con Éxito!';
        botonEnviar.style.backgroundColor = "#10b981";
        botonEnviar.style.color = "#ffffff";

        if (window.SenabellaToast) {
          window.SenabellaToast(
            "¡Gracias por unirte! Un asesor comercial te contactará en menos de 24 horas.",
            "fa-shop",
            "exito"
          );
        } else {
          alert("¡Gracias por registrarte! Un asesor comercial te contactará pronto para activar tu tienda.");
        }

        setTimeout(() => {
          formulario.reset();
          botonEnviar.innerHTML = contenidoOriginal;
          botonEnviar.style.backgroundColor = "";
          botonEnviar.style.color = "";
          botonEnviar.disabled = false;
        }, 3500);
      }, 1400);
    });
  }
  // 9. Botón Volver Arriba
  let btnUp = document.createElement("button");
  btnUp.id = "btn-volver-arriba";
  btnUp.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
  document.body.appendChild(btnUp);

  window.addEventListener("scroll", function () {
    btnUp.classList.toggle("btn-arriba-visible", window.scrollY > 400);
  });
  btnUp.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

});
