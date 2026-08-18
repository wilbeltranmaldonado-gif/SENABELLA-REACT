// ==========================================
// REDIRECCIÓN AL DETALLE DEL PRODUCTO
// ==========================================

function verProductoParejas(titulo, marca, descripcion, precioActual, precioAntiguo, imagen) {
  localStorage.setItem("productoSeleccionado", JSON.stringify({
    titulo: titulo,
    marca: marca,
    descripcion: descripcion,
    precioActual: precioActual,
    precioAntiguo: precioAntiguo,
    imagen: imagen,
    referencia: marca
  }));
  window.location.href = "detalle_producto.html";
}

// ==========================================
// ANIMACIONES AL HACER SCROLL
// ==========================================

const secciones = document.querySelectorAll(
  ".parejas-info-cards, .parejas-galeria, .productos-parejas, .parejas-cta"
);

// Agregar clase inicial para ocultar
secciones.forEach(function (seccion) {
  seccion.style.opacity = "0";
  seccion.style.transform = "translateY(30px)";
  seccion.style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out";
});

// Observer para animar cuando se ven en pantalla
const observer = new IntersectionObserver(
  function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

secciones.forEach(function (seccion) {
  observer.observe(seccion);
});

// ==========================================
// SCROLL SUAVE AL HACER CLIC EN "EXPLORAR"
// ==========================================

const botonExplorar = document.querySelector(".boton-hero");

if (botonExplorar) {
  botonExplorar.addEventListener("click", function (e) {
    const destino = document.querySelector("#catalogo-parejas");
    if (destino) {
      e.preventDefault();
      destino.scrollIntoView({ behavior: "smooth" });
    }
  });
}

// ==========================================
// AGREGAR AL CARRITO
// ==========================================
document.addEventListener("DOMContentLoaded", function () {
  const botonesCarrito = document.querySelectorAll(".btn-agregar-carrito");

  botonesCarrito.forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();

      const card = btn.closest(".card");
      if (!card) return;

      const nombre = card.querySelector(".card-title").textContent.trim();
      const precio = card.querySelector(".card-text").textContent.trim();
      const img = card.querySelector("img") ? card.querySelector("img").src : "";

      if (window.SenabellaCart) {
        window.SenabellaCart.agregarProducto({
          nombre: nombre,
          marca: "SENABELLA",
          color: "Único",
          precioText: precio,
          img: img,
          cantidad: 1
        });
      }

      // Feedback visual en el botón
      const btnOriginalText = btn.innerHTML;
      btn.innerHTML = '<i class="fa-solid fa-check"></i> Agregado';
      btn.style.background = "linear-gradient(135deg, #27ae60, #2ecc71)";
      btn.style.color = "#ffffff";

      setTimeout(function () {
        btn.innerHTML = btnOriginalText;
        btn.style.background = "";
        btn.style.color = "";
      }, 1500);

      // Si existe el sistema de Toasts (opcional)
      if (window.SenabellaToast) {
        window.SenabellaToast(nombre + " agregado al carrito", "fa-cart-shopping", "exito");
      }
    });
  });

  // Agregar botones de favoritos dinámicamente a las tarjetas
  const tarjetasParejas = document.querySelectorAll(".productos-parejas-grid .card");
  tarjetasParejas.forEach(function (card) {
    let cardBody = card.querySelector(".card-body");
    
    // Crear el botón de favoritos
    let btnFav = document.createElement("button");
    btnFav.className = "btn-favorito";
    btnFav.style.position = "absolute";
    btnFav.style.top = "10px";
    btnFav.style.right = "10px";
    btnFav.style.background = "rgba(255, 255, 255, 0.9)";
    btnFav.style.border = "none";
    btnFav.style.borderRadius = "50%";
    btnFav.style.width = "35px";
    btnFav.style.height = "35px";
    btnFav.style.display = "flex";
    btnFav.style.alignItems = "center";
    btnFav.style.justifyContent = "center";
    btnFav.style.boxShadow = "0 2px 5px rgba(0,0,0,0.1)";
    btnFav.style.cursor = "pointer";
    btnFav.style.zIndex = "10";
    
    let nombreProd = card.querySelector(".card-title").textContent.trim();
    let esFavGlobal = window.SenabellaFavoritos && window.SenabellaFavoritos.esFavorito(nombreProd);
    
    if (esFavGlobal) {
      btnFav.innerHTML = '<i class="fa-solid fa-heart" style="color: #e63946; font-size: 18px;"></i>';
      btnFav.classList.add("favorito-activo");
    } else {
      btnFav.innerHTML = '<i class="fa-regular fa-heart" style="font-size: 18px; color: #767676;"></i>';
    }

    // Insertar en la tarjeta (relativo al card que tiene position relative por defecto de bootstrap)
    card.style.position = "relative";
    card.appendChild(btnFav);

    btnFav.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      let ic = btnFav.querySelector("i");
      let esFav = ic.classList.contains("fa-solid");

      if (esFav) {
        ic.classList.add("fa-regular");
        ic.classList.remove("fa-solid");
        ic.style.color = "#767676";
        btnFav.classList.remove("favorito-activo");
        if (window.SenabellaFavoritos) {
          window.SenabellaFavoritos.eliminar(nombreProd);
        }
        if (window.SenabellaToast) {
          window.SenabellaToast("Eliminado de favoritos", "fa-heart-crack");
        }
      } else {
        let precioActual = card.querySelector(".card-text").textContent.trim();
        let img = card.querySelector("img") ? card.querySelector("img").src : "";
        
        if (window.SenabellaFavoritos) {
          let resultado = window.SenabellaFavoritos.agregar({
            nombre: nombreProd,
            marca: "COLECCIÓN PAREJAS",
            imagen: img,
            precioTexto: precioActual,
            referencia: "SENABELLA"
          });
          // Solo actualizar icono y toast si se agregó (sesión activa)
          if (resultado !== false) {
            ic.classList.remove("fa-regular");
            ic.classList.add("fa-solid");
            ic.style.color = "#e63946";
            btnFav.classList.add("favorito-activo");
            if (window.SenabellaToast) {
              window.SenabellaToast("Agregado a favoritos", "fa-heart");
            }
          }
          // Si resultado === false: favoritos.js ya mostró aviso de login
        }
      }
    });
  });
});
