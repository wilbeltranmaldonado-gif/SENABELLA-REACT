// ==========================================
// CARRITO DE COMPRAS - SENABELLA
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

  // 1. SISTEMA DE NOTIFICACIONES TOAST
  if (!window.SenabellaToast) {
    let contenedorToast = document.getElementById("contenedor-toast");
    if (!contenedorToast) {
      contenedorToast = document.createElement("div");
      contenedorToast.id = "contenedor-toast";
      document.body.appendChild(contenedorToast);
    }

    window.SenabellaToast = function (mensaje, icono, tipo) {
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
    };
  }

  // 2. PARSEAR Y FORMATEAR MONEDA COLOMBIANA
  function parsearPrecio(texto) {
    if (!texto) return 0;
    return parseFloat(texto.replace(/[^\d]/g, "")) || 0;
  }

  function formatearPrecio(numero) {
    return "$ " + Math.round(numero).toLocaleString("es-CO");
  }

  // 3. ACTUALIZAR CONTADOR EN EL HEADER
  function actualizarContadorHeader() {
    if (window.SenabellaCart) {
      window.SenabellaCart.actualizarBadge();
    }
  }

  // 4. SINCRONIZAR ESTADO LOCAL DE FILAS CON LA BASE DE DATOS
  function sincronizarConDB() {
    let filas = document.querySelectorAll(".fila-producto");
    let items = [];

    filas.forEach(function (fila) {
      let nombre = fila.querySelector(".nombre-producto")?.textContent.trim() || "";
      let marca = fila.querySelector(".marca-producto")?.textContent.trim() || "SENABELLA";
      let color = fila.querySelector(".color-producto strong")?.textContent.trim() || "Estándar";
      let precioText = fila.querySelector(".precio-actual")?.textContent.trim() || "$ 0";
      let img = fila.querySelector(".imagen-producto")?.src || "";
      let cantidad = parseInt(fila.querySelector(".selector-cantidad p")?.textContent) || 1;
      let checked = fila.querySelector('input[type="checkbox"]')?.checked ?? true;

      if (nombre) {
        items.push({ nombre, marca, color, precioText, img, cantidad, checked });
      }
    });

    if (window.SenabellaCart) {
      window.SenabellaCart.guardarItems(items);
    }
  }

  // 5. RECALCULAR RESUMEN DE LA ORDEN Y PRODUCTOS SELECCIONADOS
  function recalcularResumen() {
    let filas = document.querySelectorAll(".fila-producto");
    let totalPrecio = 0;
    let cantidadProductosTotal = 0;
    let cantidadProductosSeleccionados = 0;

    for (let i = 0; i < filas.length; i++) {
      let fila = filas[i];
      let check = fila.querySelector('input[type="checkbox"]');
      let precioEl = fila.querySelector(".precio-actual");
      let cantidadEl = fila.querySelector(".selector-cantidad p");

      let cantidad = cantidadEl ? (parseInt(cantidadEl.textContent) || 1) : 1;
      cantidadProductosTotal += cantidad;

      if (check && check.checked && precioEl) {
        let precio = parsearPrecio(precioEl.textContent);
        totalPrecio += precio * cantidad;
        cantidadProductosSeleccionados += cantidad;
      }
    }

    // Actualizar etiquetas en la interfaz
    let tituloCantidad = document.querySelector(".cantidad-carrito");
    let resumenSubtotalLabel = document.querySelector(".fila-resumen p");
    let precioResumen = document.querySelector(".precio-resumen");
    let precioTotal = document.querySelector(".precio-total");

    if (tituloCantidad) {
      tituloCantidad.textContent = "(" + cantidadProductosTotal + " " + (cantidadProductosTotal === 1 ? "producto" : "productos") + ")";
    }

    if (resumenSubtotalLabel) {
      resumenSubtotalLabel.textContent = "Productos (" + cantidadProductosSeleccionados + ")";
    }

    if (precioResumen) precioResumen.textContent = formatearPrecio(totalPrecio);
    if (precioTotal) precioTotal.textContent = formatearPrecio(totalPrecio);

    verificarEstadoCarritoVacio();
    sincronizarConDB();

    return totalPrecio;
  }

  // 6. CONTROL DE VISTA CARRITO VACÍO
  function verificarEstadoCarritoVacio() {
    let contenedorItems = document.getElementById("contenedor-items-carrito");
    let vistaVacio = document.getElementById("vista-carrito-vacio");
    let filas = document.querySelectorAll(".fila-producto");

    if (!contenedorItems || !vistaVacio) return;

    if (filas.length === 0) {
      contenedorItems.style.display = "none";
      vistaVacio.style.display = "block";
    } else {
      contenedorItems.style.display = "block";
      vistaVacio.style.display = "none";
    }
  }

  // 7. RENDERIZAR PRODUCTOS DESDE BASE DE DATOS LOCAL (LOCALSTORAGE)
  function cargarProductosDesdeDB() {
    let items = window.SenabellaCart ? window.SenabellaCart.obtenerItems() : [];
    let contenedorItems = document.getElementById("contenedor-items-carrito");
    let vistaVacio = document.getElementById("vista-carrito-vacio");

    if (!contenedorItems || !vistaVacio) return;

    if (items.length === 0) {
      contenedorItems.style.display = "none";
      vistaVacio.style.display = "block";
      recalcularResumen();
      return;
    }

    contenedorItems.style.display = "block";
    vistaVacio.style.display = "none";

    let tarjetaCarrito = contenedorItems.querySelector(".tarjeta-carrito");
    if (!tarjetaCarrito) {
      tarjetaCarrito = document.createElement("div");
      tarjetaCarrito.className = "tarjeta-carrito";
      contenedorItems.appendChild(tarjetaCarrito);
    }

    let todosMarcados = items.every(function (it) { return it.checked; });

    let cabecera = `
      <div class="cabecera-vendedor">
        <label class="contenedor-casilla">
          <input type="checkbox" id="check-vendedor-master" ${todosMarcados ? "checked" : ""} />
          <span class="marca-casilla"></span>
          <p class="texto-vendedor">Vendido por <strong class="nombre-vendedor">Senabella</strong></p>
        </label>
        <i class="fa-solid fa-chevron-up"></i>
      </div>
      <div class="divisor-tarjeta"></div>
    `;

    let filasHTML = "";
    items.forEach(function (item) {
      filasHTML += `
        <div class="fila-producto" data-nombre="${item.nombre}">
          <label class="contenedor-casilla">
            <input type="checkbox" ${item.checked ? "checked" : ""} />
            <span class="marca-casilla"></span>
          </label>
          <img src="${item.img || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnaxViT3U737FB2Z2wgIYSxpYhUeo0T-NOcwgXHJPl5A&s=10'}" alt="${item.nombre}" class="imagen-producto" />
          <div class="detalles-producto">
            <h3 class="nombre-producto">${item.nombre}</h3>
            <p class="marca-producto">${item.marca || 'SENABELLA'}</p>
            <p class="color-producto">Color: <strong>${item.color || 'Estándar'}</strong></p>
          </div>
          <div class="caja-precio-producto">
            <div class="fila-precio">
              <p class="precio-actual">${item.precioText}</p>
            </div>
          </div>
          <div class="caja-acciones-producto">
            <i class="fa-solid fa-trash-can icono-opciones" title="Eliminar producto"></i>
            <div class="selector-cantidad">
              <button><i class="fa-solid fa-minus"></i></button>
              <p>${item.cantidad || 1}</p>
              <button><i class="fa-solid fa-plus"></i></button>
            </div>
          </div>
        </div>
        <div class="divisor-tarjeta"></div>
      `;
    });

    let garantia = `
      <div class="caja-garantia">
        <i class="fa-solid fa-chevron-down"></i>
      </div>
    `;

    tarjetaCarrito.innerHTML = cabecera + filasHTML + garantia;

    // Vincular eventos
    tarjetaCarrito.querySelectorAll(".fila-producto").forEach(vincularEventosFila);
    vincularEventosCabeceraVendedor(tarjetaCarrito);

    recalcularResumen();
  }

  // 8. EVENTOS DE FILA INDIVIDUAL
  function vincularEventosFila(fila) {
    let check = fila.querySelector('input[type="checkbox"]');
    if (check) {
      check.addEventListener("change", function () {
        recalcularResumen();
      });
    }

    let selector = fila.querySelector(".selector-cantidad");
    if (selector) {
      let btnMenos = selector.querySelector("button:first-child");
      let btnMas = selector.querySelector("button:last-child");
      let numEl = selector.querySelector("p");

      if (btnMenos && numEl) {
        btnMenos.addEventListener("click", function () {
          let cant = parseInt(numEl.textContent) || 1;
          if (cant > 1) {
            numEl.textContent = cant - 1;
            recalcularResumen();
          }
        });
      }

      if (btnMas && numEl) {
        btnMas.addEventListener("click", function () {
          let cant = parseInt(numEl.textContent) || 1;
          if (cant < 20) {
            numEl.textContent = cant + 1;
            recalcularResumen();
          } else {
            window.SenabellaToast("Límite máximo de 20 unidades alcanzado", "fa-circle-info", "info");
          }
        });
      }
    }

    // Icono papelera para eliminar producto
    let iconoEliminar = fila.querySelector(".icono-opciones");
    if (iconoEliminar) {
      iconoEliminar.style.cursor = "pointer";
      iconoEliminar.title = "Eliminar producto";
      iconoEliminar.addEventListener("click", function () {
        let nombre = fila.querySelector(".nombre-producto")?.textContent.trim() || "Producto";
        fila.remove();
        if (window.SenabellaCart) {
          window.SenabellaCart.eliminarProducto(nombre);
        }
        recalcularResumen();
        window.SenabellaToast(nombre.substring(0, 30) + "... eliminado del carrito", "fa-trash-can", "info");
      });
    }
  }

  // 9. EVENTOS DE CABECERA DE VENDEDOR
  function vincularEventosCabeceraVendedor(tarjeta) {
    let checkVendedor = tarjeta.querySelector(".cabecera-vendedor input[type='checkbox']");
    if (checkVendedor) {
      checkVendedor.addEventListener("change", function () {
        let estaMarcado = checkVendedor.checked;
        tarjeta.querySelectorAll(".fila-producto input[type='checkbox']").forEach(function (chk) {
          chk.checked = estaMarcado;
        });
        recalcularResumen();
      });
    }

    let flechaVendedor = tarjeta.querySelector(".cabecera-vendedor .fa-chevron-up, .cabecera-vendedor .fa-chevron-down");
    if (flechaVendedor) {
      flechaVendedor.style.cursor = "pointer";
      flechaVendedor.addEventListener("click", function () {
        let elementos = tarjeta.querySelectorAll(".fila-producto, .caja-garantia, .divisor-tarjeta");
        let estaVisible = flechaVendedor.classList.contains("fa-chevron-up");
        elementos.forEach(function (el) {
          el.style.display = estaVisible ? "none" : "";
        });

        flechaVendedor.classList.toggle("fa-chevron-up", !estaVisible);
        flechaVendedor.classList.toggle("fa-chevron-down", estaVisible);
      });
    }
  }

  // 10. AGREGAR PRODUCTOS DESDE SUGERENCIAS ("¿Y SI LE SUMAS LO ÚLTIMO?")
  let botonesSugerencia = document.querySelectorAll(".tarjeta-sugerencia .boton-ver-producto");
  botonesSugerencia.forEach(function (btn) {
    btn.addEventListener("click", function () {
      let tarjetaSugerida = btn.closest(".tarjeta-sugerencia");
      if (!tarjetaSugerida) return;

      let nombre = tarjetaSugerida.querySelector(".nombre-sugerencia")?.textContent.trim() || "Producto Sugerido";
      let marca = tarjetaSugerida.querySelector(".marca-sugerencia")?.textContent.trim() || "SENABELLA";
      let precioText = tarjetaSugerida.querySelector(".precio-sugerencia")?.textContent.trim() || 
                       tarjetaSugerida.querySelector("p:not(.marca-sugerencia):not(.nombre-sugerencia):not(.precio-antiguo-pequeno)")?.textContent.trim() || "$ 199.900";
      let img = tarjetaSugerida.querySelector(".imagen-sugerencia")?.src || "";

      if (window.SenabellaCart) {
        window.SenabellaCart.agregarProducto({
          nombre: nombre,
          marca: marca,
          color: "Estándar",
          precioText: precioText,
          img: img,
          cantidad: 1
        });
      }

      // Animación en el botón de la sugerencia
      let textoOriginal = btn.textContent;
      btn.innerHTML = '<i class="fa-solid fa-check"></i> ¡Agregado!';
      btn.style.backgroundColor = "#aad100";
      btn.style.color = "#222";

      setTimeout(function () {
        btn.textContent = textoOriginal;
        btn.style.backgroundColor = "";
        btn.style.color = "";
      }, 1500);

      cargarProductosDesdeDB();
      window.SenabellaToast(nombre + " agregado al carrito", "fa-cart-plus", "exito");
    });
  });

  // 11. PROCESO DE COMPRA (BOTÓN CONTINUAR COMPRA / PAGAR)
  let botonPagar = document.querySelector(".tarjeta-resumen .boton-pagar") || document.querySelector(".boton-pagar");
  if (botonPagar) {
    botonPagar.addEventListener("click", function (e) {
      e.preventDefault();
      let total = recalcularResumen();
      let filas = document.querySelectorAll(".fila-producto");

      if (filas.length === 0) {
        window.SenabellaToast("Tu carrito está vacío. Agrega productos para continuar.", "fa-basket-shopping", "advertencia");
        return;
      }

      if (total <= 0) {
        window.SenabellaToast("Selecciona al menos un producto para continuar la compra", "fa-triangle-exclamation", "advertencia");
        return;
      }

      if (localStorage.getItem('senabella_sesion') !== 'activa') {
        window.SenabellaToast("Debes iniciar sesión para realizar una compra", "fa-user-lock", "advertencia");
        setTimeout(function () {
          window.location.href = "login.html";
        }, 2000);
        return;
      }

      // Validar datos de envío completos
      let usuario = {};
      try {
        usuario = JSON.parse(localStorage.getItem('senabella_usuario')) || {};
      } catch(e) {}

      if (!usuario.direccion || !usuario.ciudad || !usuario.celular) {
        window.SenabellaToast("Completa tus Datos de Envío y Contacto en tu perfil antes de comprar", "fa-address-card", "advertencia");
        setTimeout(function () {
          // Redirigir al perfil (podría manejarse que se abra en esa pestaña usando LocalStorage o params)
          window.location.href = "usuario.html";
        }, 2000);
        return;
      }

      botonPagar.disabled = true;
      botonPagar.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Redirigiendo al checkout...';

      // Redirigir a la página de checkout
      setTimeout(function () {
        window.location.href = "checkout.html";
      }, 500);
    });
  }

  // INICIALIZAR Y CARGAR DESDE LA BASE DE DATOS LOCAL EN EL INICIO DE LA PÁGINA
  cargarProductosDesdeDB();
});