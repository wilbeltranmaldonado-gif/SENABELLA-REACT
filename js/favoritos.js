// ==========================================
// GESTIÓN DE FAVORITOS EN LOCALSTORAGE
// ==========================================

window.SenabellaFavoritos = {
  KEY: "senabella_favoritos_db",

  obtenerTodos: function () {
    try {
      const datos = localStorage.getItem(this.KEY);
      return datos ? JSON.parse(datos) : [];
    } catch (e) {
      return [];
    }
  },

  guardar: function (items) {
    try {
      localStorage.setItem(this.KEY, JSON.stringify(items));
      // Disparar evento personalizado para actualizar iconos en otras páginas
      window.dispatchEvent(new Event('favoritosActualizados'));
    } catch (e) {
      console.error("Error al guardar favoritos:", e);
    }
  },

  agregar: function (producto) {
    // Solo permite favoritos si hay sesión activa
    const sesionActiva = localStorage.getItem("senabella_sesion") === "activa";
    if (!sesionActiva) {
      if (window.SenabellaToast) {
        window.SenabellaToast("Inicia sesión para guardar favoritos", "fa-user-lock", "advertencia");
      } else {
        alert("Debes iniciar sesión para agregar favoritos.");
      }
      setTimeout(function() {
        window.location.href = "login.html";
      }, 1500);
      return false;
    }

    let items = this.obtenerTodos();
    
    // Verificar si ya existe (por ID o por nombre)
    let idUnico = producto.id || producto.nombre.toLowerCase().trim();
    
    let existe = items.some(item => 
      (item.id && item.id === idUnico) || 
      (item.nombre.toLowerCase().trim() === idUnico)
    );

    if (!existe) {
      // Agregar timestamp para ordenamiento
      producto.fechaAgregado = new Date().getTime();
      items.push(producto);
      this.guardar(items);
      return true; // Se agregó
    }
    return false; // Ya existía
  },

  eliminar: function (identificador) {
    let idBusqueda = identificador.toLowerCase().trim();
    let items = this.obtenerTodos().filter(item => {
      let idItem = item.id ? item.id.toLowerCase() : item.nombre.toLowerCase().trim();
      return idItem !== idBusqueda;
    });
    this.guardar(items);
  },

  esFavorito: function(identificador) {
    if (!identificador) return false;
    let idBusqueda = identificador.toLowerCase().trim();
    let items = this.obtenerTodos();
    return items.some(item => {
      let idItem = item.id ? item.id.toLowerCase() : item.nombre.toLowerCase().trim();
      return idItem === idBusqueda;
    });
  },

  limpiarTodos: function() {
    this.guardar([]);
  },

  sincronizarBotones: function() {
    // 1. Catálogos (.favorite-btn)
    document.querySelectorAll(".favorite-btn").forEach(function(btn) {
      let tarjeta = btn.closest(".tar-producto");
      if(tarjeta) {
        let marca = tarjeta.querySelector(".nom-producto") ? tarjeta.querySelector(".nom-producto").textContent.trim() : "";
        let descripcion = tarjeta.querySelector(".descripcion") ? tarjeta.querySelector(".descripcion").textContent.trim() : "";
        let nombreProd = marca + " - " + descripcion;
        let esFav = window.SenabellaFavoritos.esFavorito(nombreProd);
        
        if (esFav) {
          btn.classList.remove("fa-regular");
          btn.classList.add("fa-solid");
          btn.style.color = "#e63946";
        } else {
          btn.classList.add("fa-regular");
          btn.classList.remove("fa-solid");
          btn.style.color = "";
        }
      }
    });

    // 2. Inicio y Parejas (.btn-favorito)
    document.querySelectorAll(".btn-favorito").forEach(function(btn) {
      let card = btn.closest(".card");
      if (card) {
        let nombreProd = card.querySelector(".card-title") ? card.querySelector(".card-title").textContent.trim() : "";
        let esFav = window.SenabellaFavoritos.esFavorito(nombreProd);
        let ic = btn.querySelector("i");
        if (ic) {
          if (esFav) {
            ic.classList.remove("fa-regular");
            ic.classList.add("fa-solid");
            ic.style.color = "#e63946";
            btn.classList.add("favorito-activo");
          } else {
            ic.classList.add("fa-regular");
            ic.classList.remove("fa-solid");
            ic.style.color = "#767676";
            btn.classList.remove("favorito-activo");
          }
        }
      }
    });

    // 3. Detalle Producto (#btn-favorito-detalle)
    let btnDetalle = document.getElementById("btn-favorito-detalle");
    if (btnDetalle) {
      let titulo = document.querySelector(".info-producto h1") ? document.querySelector(".info-producto h1").textContent.trim() : "";
      let esFav = window.SenabellaFavoritos.esFavorito(titulo);
      let ic = btnDetalle.querySelector("i");
      if (ic) {
        ic.className = esFav ? "fa-solid fa-heart" : "fa-regular fa-heart";
      }
      btnDetalle.classList.toggle("activo", esFav);
    }
  }
};

window.addEventListener('favoritosActualizados', function() {
  window.SenabellaFavoritos.sincronizarBotones();
});
window.addEventListener('storage', function(e) {
  if (e.key === window.SenabellaFavoritos.KEY) {
    window.SenabellaFavoritos.sincronizarBotones();
  }
});

// ==========================================
// LÓGICA DE LA PÁGINA DE FAVORITOS
// ==========================================

document.addEventListener("DOMContentLoaded", function () {
  
  // Solo ejecutar si estamos en la página de favoritos
  const gridFavoritos = document.getElementById("grid-favoritos");
  if (!gridFavoritos) return;

  const contadorEl = document.getElementById("contador-favoritos");
  const vistaVacia = document.getElementById("vista-vacia");
  const btnLimpiar = document.getElementById("btn-limpiar-todos");
  const selectOrdenar = document.getElementById("select-ordenar");

  // Renderizar la lista
  function renderizarFavoritos() {
    const items = window.SenabellaFavoritos.obtenerTodos();
    
    // Actualizar contador
    if (contadorEl) {
      contadorEl.textContent = `(${items.length})`;
    }

    // Mostrar estado vacío
    if (items.length === 0) {
      gridFavoritos.style.display = "none";
      if (btnLimpiar) btnLimpiar.style.display = "none";
      if (selectOrdenar) selectOrdenar.style.display = "none";
      if (vistaVacia) vistaVacia.style.display = "block";
      return;
    }

    // Mostrar grid
    gridFavoritos.style.display = "grid";
    if (btnLimpiar) btnLimpiar.style.display = "inline-block";
    if (selectOrdenar) selectOrdenar.style.display = "inline-block";
    if (vistaVacia) vistaVacia.style.display = "none";

    // Ordenar items
    let orden = selectOrdenar ? selectOrdenar.value : 'recientes';
    let itemsOrdenados = [...items];

    if (orden === 'recientes') {
      itemsOrdenados.sort((a, b) => (b.fechaAgregado || 0) - (a.fechaAgregado || 0));
    } else if (orden === 'menor-precio') {
      itemsOrdenados.sort((a, b) => parseFloat(a.precioTexto.replace(/[^\d]/g, "")) - parseFloat(b.precioTexto.replace(/[^\d]/g, "")));
    } else if (orden === 'mayor-precio') {
      itemsOrdenados.sort((a, b) => parseFloat(b.precioTexto.replace(/[^\d]/g, "")) - parseFloat(a.precioTexto.replace(/[^\d]/g, "")));
    }

    // Generar HTML
    gridFavoritos.innerHTML = "";
    
    itemsOrdenados.forEach(producto => {
      const precioLimpio = producto.precioTexto ? producto.precioTexto.replace(/[^\d]/g, "") : "0";
      
      const tarjeta = document.createElement("div");
      tarjeta.className = "tarjeta-favorito";
      tarjeta.setAttribute("data-id", producto.id || producto.nombre);
      
      tarjeta.innerHTML = `
        <button class="btn-quitar-favorito" title="Quitar de favoritos">
          <i class="fa-solid fa-trash"></i>
        </button>
        
        <div class="img-favorito-wrapper">
          <img src="${producto.imagen}" alt="${producto.nombre}" class="img-favorito">
        </div>
        
        <div class="info-favorito">
          <div class="marca-favorito">${producto.marca || 'SENABELLA'}</div>
          <div class="nombre-favorito" title="${producto.nombre}">${producto.nombre}</div>
          <div class="vendedor-favorito">Vendido por ${producto.referencia || 'SENABELLA'}</div>
          
          <div class="metodos-favorito">
            <span class="met-unica">ÚNICA</span>
            <span class="met-cmr">CMR</span>
          </div>

          <div class="precios-favorito">
            <div class="precio-actual-favorito">${producto.precioTexto || '$0'}</div>
          </div>
          
          <div class="acciones-tarjeta-favorito">
            <button class="btn-agregar-carrito">
              <i class="fa-solid fa-cart-plus"></i> Agregar
            </button>
            <button class="btn-ver-detalle" title="Ver detalles">
              <i class="fa-solid fa-eye"></i>
            </button>
          </div>
        </div>
      `;

      gridFavoritos.appendChild(tarjeta);

      // Eventos
      const btnQuitar = tarjeta.querySelector(".btn-quitar-favorito");
      btnQuitar.addEventListener("click", function(e) {
        e.stopPropagation();
        
        // Animación de salida
        tarjeta.classList.add("eliminando");
        
        setTimeout(() => {
          window.SenabellaFavoritos.eliminar(producto.id || producto.nombre);
          renderizarFavoritos();
          if (window.SenabellaToast) {
            window.SenabellaToast("Producto eliminado de favoritos", "fa-trash");
          }
        }, 350);
      });

      const btnComprar = tarjeta.querySelector(".btn-agregar-carrito");
      btnComprar.addEventListener("click", function(e) {
        e.stopPropagation();
        if (window.SenabellaCart) {
          window.SenabellaCart.agregarProducto({
            nombre: producto.nombre,
            marca: producto.marca,
            precioText: producto.precioTexto,
            img: producto.imagen,
            cantidad: 1
          });
          if (window.SenabellaToast) {
            window.SenabellaToast("Agregado al carrito", "fa-cart-check");
          }
        }
      });
      
      const btnVer = tarjeta.querySelector(".btn-ver-detalle");
      const imgWrap = tarjeta.querySelector(".img-favorito-wrapper");
      
      const verDetalle = function() {
        localStorage.setItem("productoSeleccionado", JSON.stringify({
          titulo: producto.nombre,
          marca: producto.marca,
          descripcion: producto.nombre,
          precioActual: producto.precioTexto,
          precioAntiguo: "",
          imagen: producto.imagen,
          referencia: producto.referencia
        }));
        window.location.href = "detalle_producto.html";
      };

      btnVer.addEventListener("click", verDetalle);
      imgWrap.addEventListener("click", verDetalle);
    });
  }

  // Inicializar
  renderizarFavoritos();

  // Evento ordenar
  if (selectOrdenar) {
    selectOrdenar.addEventListener("change", renderizarFavoritos);
  }

  // Evento limpiar todos
  if (btnLimpiar) {
    btnLimpiar.addEventListener("click", function() {
      if (confirm("¿Estás seguro de que quieres eliminar todos tus favoritos?")) {
        window.SenabellaFavoritos.limpiarTodos();
        renderizarFavoritos();
        if (window.SenabellaToast) {
          window.SenabellaToast("Favoritos limpiados", "fa-trash-can");
        }
      }
    });
  }

  // Escuchar si hay cambios desde otras pestañas
  window.addEventListener('storage', function(e) {
    if (e.key === window.SenabellaFavoritos.KEY) {
      renderizarFavoritos();
    }
  });

});
