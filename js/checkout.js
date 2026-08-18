// ==========================================
// CHECKOUT - SENABELLA
// ==========================================

document.addEventListener("DOMContentLoaded", function () {
  
  if (localStorage.getItem('senabella_sesion') !== 'activa') {
    alert("Debes iniciar sesión para acceder al checkout.");
    window.location.href = "login.html";
    return;
  }

  const contenedorProductos = document.getElementById("contenedor-productos-checkout");
  const badgeTotal = document.getElementById("badge-total-items");
  const subtotalEl = document.getElementById("resumen-subtotal");
  const totalEl = document.getElementById("resumen-total");
  const formCheckout = document.getElementById("form-checkout");
  const btnFinalizar = document.getElementById("btn-finalizar");

  // ==========================================
  // CARGAR DATOS DE ENVÍO DESDE EL PERFIL
  // ==========================================
  try {
    let usuario = JSON.parse(localStorage.getItem('senabella_usuario')) || {};
    let inputDir = document.getElementById("direccion");
    let inputCiudad = document.getElementById("ciudad");
    let inputTel = document.getElementById("telefono");

    if (inputDir && usuario.direccion) inputDir.value = usuario.direccion;
    if (inputCiudad && usuario.ciudad) inputCiudad.value = usuario.ciudad;
    if (inputTel && usuario.celular) inputTel.value = usuario.celular;
  } catch(e) {
    console.error("Error al cargar datos del usuario para el checkout");
  }
  // Función para parsear precio (string a número)
  function parsearPrecio(texto) {
    if (!texto) return 0;
    return parseFloat(texto.replace(/[^\d]/g, "")) || 0;
  }

  // Función para formatear precio (número a string COP)
  function formatearPrecio(numero) {
    return "$ " + Math.round(numero).toLocaleString("es-CO");
  }

  // Cargar y renderizar los productos del carrito
  function cargarResumenOrden() {
    // Obtener los items del localStorage (mismo key usado en carrito.js)
    let items;
    try {
      items = JSON.parse(localStorage.getItem("senabella_cart_db")) || [];
    } catch (e) {
      items = [];
    }

    // Filtrar solo los marcados para comprar
    let itemsComprar = items.filter(item => item.checked);

    if (itemsComprar.length === 0) {
      if (window.SenabellaToast) {
        window.SenabellaToast("No hay productos seleccionados para comprar.", "fa-basket-shopping", "advertencia");
      } else {
        alert("No hay productos seleccionados para comprar.");
      }
      setTimeout(() => {
        window.location.href = "carrito.html";
      }, 2000);
      return { totalPrecio: 0, itemsComprar: [] }; // Retornar un objeto por defecto para evitar undefined
    }

    let html = "";
    let totalPrecio = 0;
    let totalCantidad = 0;

    itemsComprar.forEach(item => {
      let cant = parseInt(item.cantidad) || 1;
      let precioNum = parsearPrecio(item.precioText);
      totalPrecio += (precioNum * cant);
      totalCantidad += cant;

      html += `
        <div class="producto-checkout">
          <div class="img-producto-checkout">
            <img src="${item.img || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnaxViT3U737FB2Z2wgIYSxpYhUeo0T-NOcwgXHJPl5A&s=10'}" alt="${item.nombre}">
            <div class="cantidad-badge">${cant}</div>
          </div>
          <div class="info-producto-checkout">
            <h4>${item.nombre}</h4>
            <p>${item.marca || 'SENABELLA'} - Color: ${item.color || 'Estándar'}</p>
            <div class="precio-producto-checkout">${item.precioText}</div>
          </div>
        </div>
      `;
    });

    // Inyectar HTML
    if (contenedorProductos) contenedorProductos.innerHTML = html;

    // Actualizar totales
    let totalFormateado = formatearPrecio(totalPrecio);
    if (badgeTotal) badgeTotal.textContent = totalCantidad + (totalCantidad === 1 ? " item" : " items");
    if (subtotalEl) subtotalEl.textContent = totalFormateado;
    if (totalEl) totalEl.textContent = totalFormateado;

    return { totalPrecio, itemsComprar };
  }

  // Inicializar resumen
  let datosOrden = cargarResumenOrden();

  // Lógica para mostrar/ocultar carga de comprobante según método de pago
  const radiosPago = document.querySelectorAll('input[name="metodo_pago"]');
  const contenedorComprobante = document.getElementById("contenedor-comprobante");
  const instruccionesPago = document.getElementById("instrucciones-pago");

  radiosPago.forEach(radio => {
    radio.addEventListener("change", function () {
      if (this.value === "banco") {
        contenedorComprobante.style.display = "block";
        instruccionesPago.innerHTML = "Realiza la transferencia a la cuenta <strong>Bancolombia Ahorros #123-456789-00</strong> a nombre de Senabella SAS.";
      } else if (this.value === "nequi") {
        contenedorComprobante.style.display = "block";
        instruccionesPago.innerHTML = "Transfiere a nuestra cuenta <strong>Nequi #300-123-4567</strong> a nombre de Senabella SAS.";
      } else {
        contenedorComprobante.style.display = "none";
      }
    });
  });

  // Validación y Envío del Formulario
  if (formCheckout) {
    formCheckout.addEventListener("submit", function (e) {
      e.preventDefault();

      // Validar manualmente (además de required de HTML5)
      let direccion = document.getElementById("direccion");
      let ciudad = document.getElementById("ciudad");
      let telefono = document.getElementById("telefono");
      let valido = true;

      // Limpiar errores previos
      document.querySelectorAll(".campo-checkout input, .campo-checkout select").forEach(el => el.classList.remove("error"));
      document.querySelectorAll(".mensaje-error").forEach(el => el.style.display = "none");

      if (!direccion.value.trim()) {
        direccion.classList.add("error");
        direccion.nextElementSibling.style.display = "block";
        valido = false;
      }

      if (!ciudad.value) {
        ciudad.classList.add("error");
        ciudad.nextElementSibling.style.display = "block";
        valido = false;
      }

      if (!telefono.value.trim()) {
        telefono.classList.add("error");
        telefono.nextElementSibling.style.display = "block";
        valido = false;
      }

      if (!valido) {
        if (window.SenabellaToast) {
          window.SenabellaToast("Por favor completa correctamente los datos de envío.", "fa-triangle-exclamation", "advertencia");
        } else {
          alert("Por favor completa correctamente los datos de envío.");
        }
        return;
      }

      // Obtener método de pago
      const metodoPago = document.querySelector('input[name="metodo_pago"]:checked').value;
      const archivoComprobante = document.getElementById("archivo-comprobante");

      // Validar comprobante si aplica
      if ((metodoPago === "banco" || metodoPago === "nequi") && archivoComprobante.files.length === 0) {
        archivoComprobante.classList.add("error");
        archivoComprobante.nextElementSibling.style.display = "block";
        if (window.SenabellaToast) {
          window.SenabellaToast("Debes adjuntar el comprobante de pago.", "fa-file-image", "advertencia");
        } else {
          alert("Debes adjuntar el comprobante de pago.");
        }
        return;
      }

      // Si todo está bien, procesar orden
      if (btnFinalizar) {
        btnFinalizar.disabled = true;
        btnFinalizar.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Procesando tu orden...';
      }

      // Función para procesar finalmente la orden
      const procesarOrdenFinal = (imagenBase64) => {
        // Generar un número de orden aleatorio
        const numeroOrden = "SENA-" + Math.floor(100000 + Math.random() * 900000);
        const fechaActual = new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });

        // Objeto para la confirmación del usuario
        const detalleOrden = {
          numero: numeroOrden,
          fecha: fechaActual,
          total: formatearPrecio(datosOrden.totalPrecio),
          metodoPago: metodoPago,
          direccion: direccion.value,
          ciudad: ciudad.value,
          productos: datosOrden.itemsComprar
        };

        localStorage.setItem("ultima_orden_senabella", JSON.stringify(detalleOrden));

        // Guardar en el historial de compras del usuario
        try {
          let ordenesUsuario = JSON.parse(localStorage.getItem("senabella_user_orders")) || [];
          ordenesUsuario.unshift(detalleOrden); // Agregar al principio
          localStorage.setItem("senabella_user_orders", JSON.stringify(ordenesUsuario));
        } catch (e) {
          console.error("Error guardando orden de usuario", e);
        }

        // Objeto para el Administrador
        const ordenAdmin = {
          numero: numeroOrden,
          fecha: fechaActual,
          total: formatearPrecio(datosOrden.totalPrecio),
          metodoPago: metodoPago,
          cliente: {
            direccion: direccion.value,
            ciudad: ciudad.value,
            telefono: document.getElementById("telefono").value
          },
          productos: datosOrden.itemsComprar,
          comprobante: imagenBase64,
          estado: (metodoPago === "contraentrega") ? "pendiente" : "pendiente-verificacion"
        };

        // Guardar en la base de datos simulada del administrador
        try {
          let ordenesAdmin = JSON.parse(localStorage.getItem("senabella_admin_orders")) || [];
          ordenesAdmin.unshift(ordenAdmin); // Agregar al principio
          localStorage.setItem("senabella_admin_orders", JSON.stringify(ordenesAdmin));
        } catch (e) {
          console.error("Error guardando orden de admin", e);
        }

        // Limpiar productos comprados del carrito
        try {
          let items = JSON.parse(localStorage.getItem("senabella_cart_db")) || [];
          let itemsRestantes = items.filter(item => !item.checked);
          localStorage.setItem("senabella_cart_db", JSON.stringify(itemsRestantes));
        } catch (e) { }

        // Redirigir a confirmación
        window.location.href = "confirmacion.html";
      };

      // Si requiere comprobante, leer la imagen. Si no, procesar directo tras un delay.
      if (archivoComprobante && archivoComprobante.files.length > 0) {
        const lector = new FileReader();
        lector.onload = function (e) {
          const imagenBase64 = e.target.result;
          setTimeout(() => procesarOrdenFinal(imagenBase64), 1000);
        };
        lector.readAsDataURL(archivoComprobante.files[0]);
      } else {
        setTimeout(() => procesarOrdenFinal(null), 1500);
      }

    });
  }

});
