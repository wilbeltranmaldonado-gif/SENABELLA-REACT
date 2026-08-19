document.addEventListener("DOMContentLoaded", function () {

  // 1. Barra de progreso para el carrusel
  let carrusel = document.querySelector("#bannerCarousel");
  if (carrusel) {
    let barra = document.createElement("div");
    barra.style.position = "absolute";
    barra.style.bottom = "0";
    barra.style.left = "0";
    barra.style.height = "4px";
    barra.style.width = "0%";
    barra.style.backgroundColor = "#84b814";
    barra.style.zIndex = "5";
    barra.style.transition = "width 5s linear";

    carrusel.style.position = "relative";
    carrusel.appendChild(barra);

    setTimeout(function () {
      barra.style.width = "100%";
    }, 100);

    carrusel.addEventListener("slide.bs.carousel", function () {
      barra.style.transition = "none";
      barra.style.width = "0%";
      setTimeout(function () {
        barra.style.transition = "width 5s linear";
        barra.style.width = "100%";
      }, 50);
    });
  }

  // 2. Sistema de Notificaciones Toast
  let contenedorToast = document.createElement("div");
  contenedorToast.id = "contenedor-toast";
  document.body.appendChild(contenedorToast);

  function mostrarToast(mensaje, icono, tipo) {
    let toast = document.createElement("div");
    toast.className = "toast-senabella toast-" + (tipo || "exito");
    toast.innerHTML = `
      <i class="fa-solid ${icono || 'fa-circle-check'}"></i>
      <span>${mensaje}</span>
      <button class="toast-cerrar"><i class="fa-solid fa-xmark"></i></button>
    `;

    contenedorToast.appendChild(toast);

    setTimeout(function () {
      toast.classList.add("toast-visible");
    }, 10);

    toast.querySelector(".toast-cerrar").addEventListener("click", function () {
      toast.classList.remove("toast-visible");
      setTimeout(function () { toast.remove(); }, 300);
    });

    setTimeout(function () {
      toast.classList.remove("toast-visible");
      setTimeout(function () { toast.remove(); }, 300);
    }, 3500);
  }
  window.SenabellaToast = mostrarToast;

  // 3. Categorías Clickeables (Redirección al Catálogo)
  let categorias = document.querySelectorAll(".categorias-inicio .col > div");
  let categoriasRopa = ["mujer", "hombre", "calzado"];
  for (let i = 0; i < categorias.length; i++) {
    categorias[i].style.cursor = "pointer";
    categorias[i].addEventListener("click", function () {
      let nombre = categorias[i].getAttribute("data-categoria");
      if (categoriasRopa.indexOf(nombre) !== -1) {
        window.location.href = "catalogo_ropa_accesorios.html?categoria=" + encodeURIComponent(nombre);
      } else {
        window.location.href = "catalogo.html?categoria=" + encodeURIComponent(nombre);
      }
    });
  }

  // 4. Botones de Acción en Tarjetas (Carrito y Favorito)
  let tarjetas = document.querySelectorAll(".productos-grid .card");
  for (let i = 0; i < tarjetas.length; i++) {
    let card = tarjetas[i];
    let acciones = document.createElement("div");
    acciones.className = "acciones-producto";

    let btnCarrito = document.createElement("button");
    btnCarrito.className = "btn-agregar-carrito";
    btnCarrito.innerHTML = '<i class="fa-solid fa-cart-plus"></i> Agregar';
    btnCarrito.addEventListener("click", function (e) {
      e.stopPropagation();
      let nombre = card.querySelector(".card-title").textContent.trim();
      let precio = card.querySelector(".card-text").textContent.trim();
      let img = card.querySelector("img") ? card.querySelector("img").src : "";

      if (window.SenabellaCart) {
        window.SenabellaCart.agregarProducto({
          nombre: nombre,
          marca: "TECNOLOGÍA",
          color: "Estándar",
          precioText: precio,
          img: img,
          cantidad: 1
        });
      }

      btnCarrito.innerHTML = '<i class="fa-solid fa-check"></i> Agregado';
      btnCarrito.classList.add("btn-agregado");
      setTimeout(function () {
        btnCarrito.innerHTML = '<i class="fa-solid fa-cart-plus"></i> Agregar';
        btnCarrito.classList.remove("btn-agregado");
      }, 1500);

      mostrarToast(nombre + " agregado al carrito - " + precio, "fa-cart-shopping", "exito");
    });

    let btnFav = document.createElement("button");
    btnFav.className = "btn-favorito";
    
    let nombreProd = card.querySelector(".card-title").textContent.trim();
    let esFavGlobal = window.SenabellaFavoritos && window.SenabellaFavoritos.esFavorito(nombreProd);
    
    if (esFavGlobal) {
      btnFav.innerHTML = '<i class="fa-solid fa-heart" style="color: #e63946;"></i>';
      btnFav.classList.add("favorito-activo");
    } else {
      btnFav.innerHTML = '<i class="fa-regular fa-heart"></i>';
    }

    btnFav.addEventListener("click", function (e) {
      e.stopPropagation();
      let ic = btnFav.querySelector("i");
      let esFav = ic.classList.contains("fa-solid");

      if (esFav) {
        ic.classList.add("fa-regular");
        ic.classList.remove("fa-solid");
        ic.style.color = "";
        btnFav.classList.remove("favorito-activo");
        if (window.SenabellaFavoritos) {
          window.SenabellaFavoritos.eliminar(nombreProd);
        }
        mostrarToast("Eliminado de favoritos", "fa-heart-crack", "info");
      } else {
        let precioActual = card.querySelector(".card-text").textContent.trim();
        let img = card.querySelector("img") ? card.querySelector("img").src : "";
        
        if (window.SenabellaFavoritos) {
          let resultado = window.SenabellaFavoritos.agregar({
            nombre: nombreProd,
            marca: "SENABELLA",
            imagen: img,
            precioTexto: precioActual,
            referencia: "SENABELLA"
          });
          // Solo actualizar icono y mostrar toast si se agregó correctamente
          if (resultado !== false) {
            ic.classList.remove("fa-regular");
            ic.classList.add("fa-solid");
            ic.style.color = "#e63946";
            btnFav.classList.add("favorito-activo");
            mostrarToast("Agregado a favoritos", "fa-heart", "exito");
          }
          // Si resultado === false: favoritos.js ya mostró el aviso de login
        }
      }
    });

    acciones.appendChild(btnCarrito);
    acciones.appendChild(btnFav);
    card.querySelector(".card-body").appendChild(acciones);

    card.style.cursor = "pointer";
    card.addEventListener("click", function (e) {
      if (e.target.closest(".btn-agregar-carrito") || e.target.closest(".btn-favorito")) return;

      let titulo = card.querySelector(".card-title") ? card.querySelector(".card-title").textContent.trim() : "Producto";
      let precioActual = card.querySelector(".card-text") ? card.querySelector(".card-text").textContent.trim() : "$ 0";
      let img = card.querySelector("img") ? card.querySelector("img").src : "";

      let productoSeleccionado = {
        marca: "TECNOLOGÍA",
        titulo: titulo,
        descripcion: titulo + " - Excelente opción con garantía oficial Senabella.",
        imagen: img,
        precioActual: precioActual,
        precioAntiguo: "$ 0",
        referencia: "Por SENABELLA"
      };

      localStorage.setItem("productoSeleccionado", JSON.stringify(productoSeleccionado));
      window.location.href = "detalle_producto.html";
    });
  }

  // 5. Modal de Vista Rápida
  let modal = document.createElement("div");
  modal.className = "modal-overlay";
  modal.innerHTML = `
    <div class="modal-contenido">
      <button class="modal-cerrar"><i class="fa-solid fa-xmark"></i></button>
      <div class="modal-cuerpo">
        <div class="modal-imagen"></div>
        <div class="modal-info">
          <h2 class="modal-nombre"></h2>
          <p class="modal-precio"></p>
          <div class="modal-rating">
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star-half-stroke"></i>
            <span class="modal-rating-text">4.5 (128 reseñas)</span>
          </div>
          <p class="modal-descripcion">Producto de alta calidad disponible en Senabella. Envío gratis a todo Colombia.</p>
          <div class="modal-cantidad">
            <label>Cantidad:</label>
            <div class="modal-selector-cantidad">
              <button class="modal-btn-menos">−</button>
              <span class="modal-num-cantidad">1</span>
              <button class="modal-btn-mas">+</button>
            </div>
          </div>
          <div class="modal-acciones">
            <button class="modal-btn-carrito"><i class="fa-solid fa-cart-plus"></i> Agregar al carrito</button>
            <button class="modal-btn-comprar"><i class="fa-solid fa-bolt"></i> Comprar ahora</button>
          </div>
          <div class="modal-beneficios">
            <div><i class="fa-solid fa-truck-fast"></i> Envío gratis</div>
            <div><i class="fa-solid fa-shield-halved"></i> Compra protegida</div>
            <div><i class="fa-solid fa-rotate-left"></i> Devolución gratis</div>
          </div>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  let numCant = modal.querySelector(".modal-num-cantidad");
  modal.querySelector(".modal-cerrar").addEventListener("click", cerrarModal);
  modal.addEventListener("click", function (e) {
    if (e.target === modal) cerrarModal();
  });

  modal.querySelector(".modal-btn-menos").addEventListener("click", function () {
    let n = parseInt(numCant.textContent) || 1;
    if (n > 1) numCant.textContent = n - 1;
  });

  modal.querySelector(".modal-btn-mas").addEventListener("click", function () {
    let n = parseInt(numCant.textContent) || 1;
    if (n < 20) numCant.textContent = n + 1;
  });

  modal.querySelector(".modal-btn-carrito").addEventListener("click", function () {
    let nombre = modal.querySelector(".modal-nombre").textContent.trim();
    let precio = modal.querySelector(".modal-precio").textContent.trim();
    let img = modal.querySelector(".modal-imagen img") ? modal.querySelector(".modal-imagen img").src : "";
    let cant = parseInt(numCant.textContent) || 1;

    if (window.SenabellaCart) {
      window.SenabellaCart.agregarProducto({
        nombre: nombre,
        marca: "TECNOLOGÍA",
        color: "Estándar",
        precioText: precio,
        img: img,
        cantidad: cant
      });
    }

    mostrarToast(cant + "x " + nombre + " agregado(s) al carrito", "fa-cart-shopping", "exito");
    cerrarModal();
  });

  modal.querySelector(".modal-btn-comprar").addEventListener("click", function () {
    mostrarToast("Redirigiendo al checkout", "fa-bolt", "info");
    cerrarModal();
  });

  function abrirVistaRapida(card) {
    let img = card.querySelector("img");
    modal.querySelector(".modal-imagen").innerHTML = '<img src="' + img.src + '" alt="' + img.alt + '">';
    modal.querySelector(".modal-nombre").textContent = card.querySelector(".card-title").textContent.trim();
    modal.querySelector(".modal-precio").textContent = card.querySelector(".card-text").textContent.trim();
    numCant.textContent = "1";
    modal.classList.add("modal-visible");
    document.body.style.overflow = "hidden";
  }

  function cerrarModal() {
    modal.classList.remove("modal-visible");
    document.body.style.overflow = "";
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") cerrarModal();
  });

  // 6. Animación al Hacer Scroll
  let animados = document.querySelectorAll(".productos-grid .col, .promos-grid .col");
  for (let i = 0; i < animados.length; i++) {
    animados[i].classList.add("elemento-animado");
    animados[i].style.transitionDelay = (i * 0.06) + "s";
  }

  function verificarScroll() {
    let els = document.querySelectorAll(".seccion-animada, .elemento-animado");
    for (let i = 0; i < els.length; i++) {
      if (els[i].getBoundingClientRect().top < window.innerHeight * 0.88) {
        els[i].classList.add("animado");
      }
    }
  }
  window.addEventListener("scroll", verificarScroll);
  verificarScroll();

  // // 7. Búsqueda en el Header
  // let inputBusq = document.querySelector(".entrada-busqueda");
  // let btnBusq = document.querySelector(".boton-busqueda");
  // if (inputBusq && btnBusq) {
  //   function buscar() {
  //     let t = inputBusq.value.trim().toLowerCase();
  //     let cols = document.querySelectorAll(".productos-grid .col");

  //     if (!t) {
  //       for (let i = 0; i < cols.length; i++) cols[i].style.display = "";
  //       return;
  //     }

  //     let enc = 0;
  //     for (let i = 0; i < cols.length; i++) {
  //       if (cols[i].textContent.toLowerCase().indexOf(t) !== -1) {
  //         cols[i].style.display = "";
  //         enc++;
  //       } else {
  //         cols[i].style.display = "none";
  //       }
  //     }
  //     mostrarToast(enc ? enc + " producto(s) encontrado(s)" : "Sin resultados para: " + t, "fa-magnifying-glass", enc ? "info" : "advertencia");
  //     let grid = document.querySelector(".productos-grid");
  //     if (grid) grid.scrollIntoView({ behavior: "smooth" });
  //   }

  //   btnBusq.addEventListener("click", buscar);
  //   inputBusq.addEventListener("keydown", function (e) {
  //     if (e.key === "Enter") buscar();
  //   });
  //   inputBusq.addEventListener("input", function () {
  //     if (!inputBusq.value.trim()) {
  //       let c = document.querySelectorAll(".productos-grid .col");
  //       for (let i = 0; i < c.length; i++) c[i].style.display = "";
  //     }
  //   });
  // }

  // 8. Imágenes de Promociones y Carrusel Funcionales
  let promoImgs = document.querySelectorAll(".promos-grid img");
  let busquedasPromo = [
    "suplementos",
    "belleza",
    "reloj",
    "mujer",
    "cama",
    "tablets",
    "lenovo",
    "samsung"
  ];
  let categoriasModaPromo = ["mujer"];
  for (let i = 0; i < promoImgs.length; i++) {
    promoImgs[i].style.cursor = "pointer";
    promoImgs[i].addEventListener("click", function () {
      let termino = busquedasPromo[i] || "ofertas";
      if (categoriasModaPromo.indexOf(termino) !== -1) {
        window.location.href = "catalogo_ropa_accesorios.html?categoria=" + encodeURIComponent(termino);
      } else if (termino === "tablets") {
        window.location.href = "catalogo.html?categoria=" + encodeURIComponent(termino);
      } else {
        window.location.href = "catalogo.html?busqueda=" + encodeURIComponent(termino);
      }
    });
  }

  let carouselImgs = document.querySelectorAll("#bannerCarousel img");
  for (let i = 0; i < carouselImgs.length; i++) {
    carouselImgs[i].style.cursor = "pointer";
    carouselImgs[i].addEventListener("click", function () {
      window.location.href = "catalogo.html?categoria=ofertas";
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