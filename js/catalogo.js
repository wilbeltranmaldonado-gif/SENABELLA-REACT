document.addEventListener("DOMContentLoaded", function () {

  // 1. Elementos y datos
  let gridProductos = document.querySelector(".tarjeta-producto");
  let numResultados = document.querySelector(".resultados");

  // Sincronizar productos creados/actualizados en el Panel de Administración (localStorage)
  function sincronizarProductosAdmin() {
    if (!gridProductos) return;

    let prodsLS = [];
    try {
      prodsLS = JSON.parse(localStorage.getItem("senabella_productos")) || [];
    } catch (e) {
      prodsLS = [];
    }
    
    // Si no hay productos en localStorage, intentamos usar PRODUCTOS_SEMILLA si está definido globalmente (cargado via script)
    if (!prodsLS.length && typeof PRODUCTOS_SEMILLA !== "undefined") {
      prodsLS = [...PRODUCTOS_SEMILLA];
      localStorage.setItem("senabella_productos", JSON.stringify(prodsLS));
    }
    
    if (!prodsLS.length) return;

    // LIMPIAR el contenedor para que solo se muestren los productos dinámicos 
    // y reflejen las ediciones/eliminaciones del administrador.
    gridProductos.innerHTML = "";

    let esPaginaRopa = window.location.pathname.includes("ropa");

    // Sincronizar botones de marcas dinámicas
    let contenedorBotonesMarcas = document.querySelector(".filtro-marca .botones");
    if (contenedorBotonesMarcas) {
      const marcasExistentes = Array.from(contenedorBotonesMarcas.querySelectorAll("button")).map(b => b.textContent.trim().toUpperCase());
      prodsLS.forEach(p => {
        if (p.marca) {
          const mUpper = p.marca.trim().toUpperCase();
          if (mUpper && !marcasExistentes.includes(mUpper)) {
            marcasExistentes.push(mUpper);
            const btnM = document.createElement("button");
            btnM.textContent = mUpper;
            contenedorBotonesMarcas.appendChild(btnM);
          }
        }
      });
    }

    prodsLS.forEach(prod => {
      const cat = (prod.categoria || "").toLowerCase();
      const esRopaOFashion = cat.includes("ropa") || cat.includes("calzado") || cat.includes("accesorios") || cat.includes("belleza") || cat.includes("relojes");

      if (esPaginaRopa && !esRopaOFashion) return;
      if (!esPaginaRopa && esRopaOFashion && !cat.includes("tecnología")) return;

      const tituloComparar = prod.nombre.toLowerCase();
      const yaExiste = Array.from(gridProductos.querySelectorAll(".tar-producto")).some(el => {
        const desc = el.querySelector(".descripcion") ? el.querySelector(".descripcion").textContent.trim().toLowerCase() : "";
        return desc.includes(tituloComparar);
      });

      if (!yaExiste) {
        const tarjetaEl = document.createElement("div");
        tarjetaEl.className = "tar-producto";
        const precioFormateado = "$ " + Math.round(prod.precio).toLocaleString("es-CO");
        const precioAntiguoFormateado = prod.precioAntiguo ? "$ " + Math.round(prod.precioAntiguo).toLocaleString("es-CO") : "";
        const descText = prod.descuento ? `-${prod.descuento}%` : "";

        tarjetaEl.innerHTML = `
          <a href="detalle_producto.html">
            <img src="${prod.imagen || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop'}" alt="${prod.nombre}" />
          </a>
          <div class="etiqueta"><span>${prod.descuento ? 'OFERTA' : 'NUEVO'}</span></div>
          <div class="nom-producto">${(prod.marca || "SENABELLA").toUpperCase()}</div>
          <div class="descripcion">${prod.nombre}${prod.descripcion ? ' - ' + prod.descripcion : ''}</div>
          <div class="referencia">${prod.referencia || 'Por SENABELLA'}</div>
          <i class="fa-regular fa-heart favorite-btn"></i>
          <div>
            <div class="metodo">
              <span class="unica">ÚNICA</span>
              <span class="cmr">CMR</span>
              <span class="debito">Débito</span>
            </div>
            <div class="precio">
              ${precioFormateado}
              ${descText ? `<span class="descuento">${descText}</span>` : ''}
            </div>
            ${precioAntiguoFormateado ? `<div class="precio-secundario1">${precioAntiguoFormateado}</div>` : ''}
          </div>
        `;

        gridProductos.appendChild(tarjetaEl);
      }
    });
  }

  sincronizarProductosAdmin();

  let productos = Array.from(document.querySelectorAll(".tar-producto"));
  let filtroMarcaButtons = document.querySelectorAll(".filtro-marca .botones button");
  let categoriasCirculares = document.querySelectorAll(".categorias-circulares .categoria");
  let categoriasLista = document.querySelectorAll(".categorias-lista .categoria-lis");
  let paginacionNumeros = document.querySelectorAll(".num-pagina span.pag-2");
  let paginacionFlechaIzq = document.querySelector(".num-pagina .fa-chevron-left");
  let paginacionFlechaDer = document.querySelector(".num-pagina .fa-chevron-right");
  let selectOrden = document.querySelector(".opciones-recomendacion");

  let estadoFiltro = {
    marcas: [],
    categoria: "",
    busqueda: "",
    procesadores: [],
    rams: [],
    pantallas: [],
    resoluciones: [],
    precioMax: null,
    descuentoMin: null,
    paginaActual: 1
  };

  const ITEMS_POR_PAGINA = 12; // mostrar 12 productos por página
  let matchedTarjetas = []; // tarjetas que cumplen filtros actualmente

  // Inicializar la vista con filtros por defecto y paginación activa
  aplicarFiltros();

  // 2. Slider horizontal de marcas (Botón Flecha)
  let contenedorBotones = document.querySelector(".botones");
  let flecha = document.querySelector(".boton-flecha");

  if (contenedorBotones && flecha) {
    contenedorBotones.style.scrollBehavior = "smooth";
    flecha.addEventListener("click", function () {
      contenedorBotones.scrollLeft += 220;
    });
  }


  function renderPagination(totalPaginas) {
    const cont = document.querySelector('.num-pagina');
    if (!cont) return;

    let html = '<i class="fa-solid fa-chevron-left"></i>';
    for (let i = 1; i <= totalPaginas; i++) {
      html += '<span class="pag-2" data-pagina="' + i + '">' + i + '</span>';
    }
    html += '<i class="fa-solid fa-chevron-right"></i>';

    cont.innerHTML = html;

    // Re-bind handlers
    paginacionNumeros = document.querySelectorAll('.num-pagina span.pag-2');
    paginacionFlechaIzq = document.querySelector('.num-pagina .fa-chevron-left');
    paginacionFlechaDer = document.querySelector('.num-pagina .fa-chevron-right');

    paginacionNumeros.forEach(function (pagBtn) {
      pagBtn.style.cursor = 'pointer';
      pagBtn.addEventListener('click', function () {
        let numPag = parseInt(this.getAttribute('data-pagina'));
        if (!isNaN(numPag)) cambiarPagina(numPag);
      });
    });

    if (paginacionFlechaIzq) {
      paginacionFlechaIzq.style.cursor = 'pointer';
      paginacionFlechaIzq.addEventListener('click', function () {
        if (estadoFiltro.paginaActual > 1) cambiarPagina(estadoFiltro.paginaActual - 1);
      });
    }

    if (paginacionFlechaDer) {
      paginacionFlechaDer.style.cursor = 'pointer';
      paginacionFlechaDer.addEventListener('click', function () {
        const total = Math.max(1, Math.ceil(matchedTarjetas.length / ITEMS_POR_PAGINA));
        if (estadoFiltro.paginaActual < total) cambiarPagina(estadoFiltro.paginaActual + 1);
      });
    }
  }

  function aplicarFiltros() {
    matchedTarjetas = [];

    productos.forEach(function (tarjeta) {
      let nomMarcaEl = tarjeta.querySelector(".nom-producto");
      let descEl = tarjeta.querySelector(".descripcion");
      let precioEl = tarjeta.querySelector(".precio");
      let descuentoEl = tarjeta.querySelector(".descuento");

      let marcaTexto = nomMarcaEl ? nomMarcaEl.textContent.trim().toUpperCase() : "";
      let descTexto = descEl ? descEl.textContent.trim().toLowerCase() : "";
      // Extraer solo el texto directo del nodo precio (sin el span de descuento)
      let precioTexto = "0";
      if (precioEl) {
        let precioNode = Array.from(precioEl.childNodes).find(n => n.nodeType === Node.TEXT_NODE);
        precioTexto = precioNode ? precioNode.textContent.replace(/[^\d]/g, "") : precioEl.textContent.replace(/[^\d]/g, "");
      }
      let precioValor = parseFloat(precioTexto) || 0;
      let descuentoTexto = descuentoEl ? descuentoEl.textContent.replace(/[^\d]/g, "") : "0";
      let descuentoValor = parseFloat(descuentoTexto) || 0;

      // Filtro de Marca (lista múltiple o individual)
      let cumpleMarca = estadoFiltro.marcas.length === 0 || estadoFiltro.marcas.includes(marcaTexto);

      // Filtro de Categoría Inteligente
      let cumpleCategoria = true;
      if (estadoFiltro.categoria && estadoFiltro.categoria.trim() !== "") {
        let catFiltro = estadoFiltro.categoria.toLowerCase().trim();
        if (catFiltro === "portátil" || catFiltro === "portátiles") {
          cumpleCategoria = descTexto.includes("portátil") || descTexto.includes("laptop") || descTexto.includes("kindle");
        } else if (catFiltro === "impresora" || catFiltro === "impresoras") {
          cumpleCategoria = descTexto.includes("impresora") || descTexto.includes("tinta") || descTexto.includes("smart tank");
        } else if (catFiltro === "tablet" || catFiltro === "tablets") {
          cumpleCategoria = descTexto.includes("tablet") || descTexto.includes("tableta") || descTexto.includes("pad");
        } else if (catFiltro === "disco" || catFiltro === "almacenamiento") {
          cumpleCategoria = descTexto.includes("disco") || descTexto.includes("ssd") || descTexto.includes("tb");
        } else if (catFiltro === "monitor" || catFiltro === "monitores") {
          cumpleCategoria = descTexto.includes("monitor") || descTexto.includes("pantalla");
        } else if (catFiltro === "software") {
          cumpleCategoria = descTexto.includes("software") || descTexto.includes("licencia") || descTexto.includes("365") || descTexto.includes("windows");
        } else if (catFiltro === "desktop" || catFiltro === "desktops" || catFiltro === "escritorio" || catFiltro === "todo en uno") {
          cumpleCategoria = descTexto.includes("desktop") || descTexto.includes("escritorio") || descTexto.includes("all in one") || descTexto.includes("todo en uno");
        } else if (catFiltro === "accesorio" || catFiltro === "accesorios") {
          cumpleCategoria = descTexto.includes("mouse") || descTexto.includes("teclado") || descTexto.includes("soporte") || descTexto.includes("hub") || descTexto.includes("adaptador") || descTexto.includes("estuche") || descTexto.includes("audifonos") || descTexto.includes("audífonos") || descTexto.includes("kit");
        } else if (catFiltro === "mujer" || catFiltro === "moda mujer") {
          cumpleCategoria = descTexto.includes("mujer") || descTexto.includes("femenina") || descTexto.includes("vestido") || descTexto.includes("rosa");
        } else if (catFiltro === "hombre" || catFiltro === "moda hombre") {
          cumpleCategoria = descTexto.includes("hombre") || descTexto.includes("masculina") || descTexto.includes("camisa") || descTexto.includes("chaqueta");
        } else if (catFiltro === "calzado") {
          cumpleCategoria = descTexto.includes("tenis") || descTexto.includes("calzado") || descTexto.includes("zapatos") || descTexto.includes("botas");
        } else if (catFiltro === "tecno") {
          cumpleCategoria = !descTexto.includes("vestido") && !descTexto.includes("chaqueta") && !descTexto.includes("tenis");
        } else if (catFiltro === "relojes" || catFiltro === "reloj") {
          cumpleCategoria = descTexto.includes("reloj") || descTexto.includes("relojes") || descTexto.includes("smartwatch");
        } else if (catFiltro === "belleza") {
          cumpleCategoria = descTexto.includes("belleza") || descTexto.includes("perfume") || descTexto.includes("maquillaje") || descTexto.includes("suero") || descTexto.includes("labial") || descTexto.includes("crema");
        } else if (catFiltro === "ofertas") {
          cumpleCategoria = descuentoValor > 0;
        } else {
          cumpleCategoria = descTexto.includes(catFiltro);
        }
      }

      // Filtro de Búsqueda por texto (Marca, Descripción, Referencia)
      let cumpleBusqueda = true;
      if (estadoFiltro.busqueda && estadoFiltro.busqueda.trim() !== "") {
        let busqLimpia = estadoFiltro.busqueda.trim().toLowerCase();
        let refEl = tarjeta.querySelector(".referencia");
        let refTexto = refEl ? refEl.textContent.trim().toLowerCase() : "";
        cumpleBusqueda = marcaTexto.toLowerCase().includes(busqLimpia) ||
                         descTexto.includes(busqLimpia) ||
                         refTexto.includes(busqLimpia);
      }

      // Filtro de Procesador
      let cumpleProcesador = estadoFiltro.procesadores.length === 0 || estadoFiltro.procesadores.some(p => descTexto.includes(p.toLowerCase()));

      // Filtro de Memoria RAM
      let cumpleRAM = estadoFiltro.rams.length === 0 || estadoFiltro.rams.some(r => descTexto.includes(r.toLowerCase()));

      // Filtro de Pantalla
      let cumplePantalla = estadoFiltro.pantallas.length === 0 || estadoFiltro.pantallas.some(p => descTexto.includes(p.toLowerCase()));

      // Filtro de Resolución
      let cumpleResolucion = estadoFiltro.resoluciones.length === 0 || estadoFiltro.resoluciones.some(r => descTexto.includes(r.toLowerCase()));

      // Filtro de Precio
      let cumplePrecio = true;
      if (estadoFiltro.precioMax !== null) {
        if (estadoFiltro.precioMax === 500000) cumplePrecio = precioValor < 500000;
        else if (estadoFiltro.precioMax === 1000000) cumplePrecio = precioValor >= 500000 && precioValor <= 1000000;
        else if (estadoFiltro.precioMax === 2000000) cumplePrecio = precioValor > 1000000;
      }

      // Filtro de Descuento
      let cumpleDescuento = estadoFiltro.descuentoMin === null || descuentoValor >= estadoFiltro.descuentoMin;

      if (cumpleMarca && cumpleCategoria && cumpleProcesador && cumpleRAM && cumplePantalla && cumpleResolucion && cumplePrecio && cumpleDescuento && cumpleBusqueda) {
        matchedTarjetas.push(tarjeta);
        tarjeta.style.display = "none"; // ocultar por defecto; mostrar según pagina
      } else {
        tarjeta.style.display = "none";
      }
    });

    // Actualizar contador de resultados
    if (numResultados) {
      numResultados.textContent = "Resultados (" + matchedTarjetas.length + ")";
    }

    // Renderizar paginación según cantidad de resultados
    const contPaginacion = document.querySelector('.num-pagina');
    const totalPaginas = Math.max(1, Math.ceil(matchedTarjetas.length / ITEMS_POR_PAGINA));
    renderPagination(totalPaginas);

    // Ajustar paginaActual si excede
    if (estadoFiltro.paginaActual > totalPaginas) estadoFiltro.paginaActual = totalPaginas;

    // Mostrar la página actual
    mostrarPagina(estadoFiltro.paginaActual);

    if (window.SenabellaToast && (estadoFiltro.marcas.length > 0 || estadoFiltro.categoria || estadoFiltro.busqueda)) {
      let textoToast = "Filtrando por: " + (estadoFiltro.busqueda || estadoFiltro.marcas.join(", ") || estadoFiltro.categoria);
      window.SenabellaToast(textoToast, "fa-filter");
    }
  }

  // 4. Filtros de Marcas superiores (Botones de Marca)
  filtroMarcaButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      let marcaSeleccionada = this.textContent.trim().toUpperCase();

      if (this.classList.contains("sn-activo")) {
        this.classList.remove("sn-activo");
        this.style.background = "";
        this.style.color = "";
        estadoFiltro.marcas = estadoFiltro.marcas.filter(m => m !== marcaSeleccionada);
      } else {
        filtroMarcaButtons.forEach(function (b) {
          b.classList.remove("sn-activo");
          b.style.background = "";
          b.style.color = "";
        });
        this.classList.add("sn-activo");
        this.style.background = "#84b814";
        this.style.color = "#fff";
        estadoFiltro.marcas = [marcaSeleccionada];
      }
      aplicarFiltros();
    });
  });

  // 5. Botones Circulares Superiores (Categorías circulares - Sin contorno permanente al desmarcar)
  categoriasCirculares.forEach(function (cat) {
    cat.style.cursor = "pointer";
    let imgDiv = cat.querySelector(".imagen-cat");

    cat.addEventListener("click", function () {
      let titulo = this.querySelector(".titulo-cat") ? this.querySelector(".titulo-cat").textContent.trim() : "";
      let yaActivo = this.classList.contains("circulo-activo");

      // Limpiar estado activo de todos los círculos
      categoriasCirculares.forEach(function (c) {
        c.classList.remove("circulo-activo");
        c.style.transform = "";
        let iDiv = c.querySelector(".imagen-cat");
        if (iDiv) {
          iDiv.style.border = "";
          iDiv.style.borderColor = "";
          iDiv.style.boxShadow = "";
        }
      });

      if (!yaActivo) {
        this.classList.add("circulo-activo");
        this.style.transform = "scale(1.08)";
        if (imgDiv) {
          imgDiv.style.border = "2px solid #84b814";
          imgDiv.style.boxShadow = "0 0 10px rgba(132, 184, 20, 0.4)";
        }

        // Mapear nombres clave para filtrar la descripción
        if (titulo.toLowerCase().includes("portátiles")) estadoFiltro.categoria = "portátil";
        else if (titulo.toLowerCase().includes("impresoras")) estadoFiltro.categoria = "impresora";
        else if (titulo.toLowerCase().includes("tablets")) estadoFiltro.categoria = "tablet";
        else if (titulo.toLowerCase().includes("almacenamiento")) estadoFiltro.categoria = "disco";
        else if (titulo.toLowerCase().includes("monitores")) estadoFiltro.categoria = "monitor";
        else if (titulo.toLowerCase().includes("software")) estadoFiltro.categoria = "software";
        else estadoFiltro.categoria = titulo.split(" ")[0];
      } else {
        estadoFiltro.categoria = "";
      }

      aplicarFiltros();
    });
  });

  // 6. Botones del menú lateral izquierdo (Categorías y Filtros desplegables funcionales)
  categoriasLista.forEach(function (catItem) {
    catItem.style.cursor = "pointer";
    catItem.addEventListener("click", function () {
      let textoCat = this.textContent.trim();
      let yaActiva = this.classList.contains("cat-lista-activa");

      categoriasLista.forEach(function (c) {
        c.classList.remove("cat-lista-activa");
        c.style.fontWeight = "normal";
        c.style.color = "";
      });

      if (!yaActiva) {
        this.classList.add("cat-lista-activa");
        this.style.fontWeight = "bold";
        this.style.color = "#84b814";

        if (textoCat.toLowerCase().includes("portátiles")) estadoFiltro.categoria = "portátil";
        else if (textoCat.toLowerCase().includes("impresoras")) estadoFiltro.categoria = "impresora";
        else if (textoCat.toLowerCase().includes("tablets")) estadoFiltro.categoria = "tablet";
        else if (textoCat.toLowerCase().includes("accesorios")) estadoFiltro.categoria = "accesorio";
        else if (textoCat.toLowerCase().includes("desktops") || textoCat.toLowerCase().includes("todo en uno")) estadoFiltro.categoria = "desktop";
        else if (textoCat.toLowerCase().includes("monitores")) estadoFiltro.categoria = "monitor";
        else if (textoCat.toLowerCase().includes("software")) estadoFiltro.categoria = "software";
        else estadoFiltro.categoria = textoCat.split(" ")[0];
      } else {
        estadoFiltro.categoria = "";
      }

      aplicarFiltros();
    });
  });

  // Acordeones interactivos desplegables del menú lateral
  let desplegablesIzquierda = document.querySelectorAll(".menu_lateral .filtro1");
  desplegablesIzquierda.forEach(function (headerFiltro) {
    headerFiltro.style.cursor = "pointer";
    headerFiltro.addEventListener("click", function () {
      let contenedorPadre = this.closest(".filtro");
      let icono = this.querySelector("i");
      let contenidoOculto = contenedorPadre.querySelectorAll(".opcion-domicilio, .info-entrega, .categorias-lista, .opciones-filtro-lateral");

      if (contenidoOculto.length > 0) {
        let estaVisible = contenidoOculto[0].style.display !== "none";
        contenidoOculto.forEach(function (el) {
          el.style.display = estaVisible ? "none" : "block";
        });
        if (icono) {
          icono.classList.toggle("fa-chevron-up", !estaVisible);
          icono.classList.toggle("fa-chevron-down", estaVisible);
        }
      }
    });
  });

  // Escuchar checkboxes del menú lateral
  document.querySelectorAll(".opciones-filtro-lateral input[type='checkbox']").forEach(function (input) {
    input.addEventListener("change", function () {
      let filtroPadre = this.closest(".filtro").querySelector(".filtro1").textContent.trim();

      // Recopilar selección de marcas del menú lateral
      if (filtroPadre.includes("Marca")) {
        estadoFiltro.marcas = Array.from(document.querySelectorAll(".menu_lateral input[type='checkbox']:checked"))
          .filter(chk => chk.closest(".filtro").querySelector(".filtro1").textContent.includes("Marca"))
          .map(chk => chk.value.toUpperCase());
      }

      // Recopilar selección de procesadores
      if (filtroPadre.includes("Procesador")) {
        estadoFiltro.procesadores = Array.from(document.querySelectorAll(".menu_lateral input[type='checkbox']:checked"))
          .filter(chk => chk.closest(".filtro").querySelector(".filtro1").textContent.includes("Procesador"))
          .map(chk => chk.value);
      }

      // Recopilar selección de RAM
      if (filtroPadre.includes("Memoria RAM")) {
        estadoFiltro.rams = Array.from(document.querySelectorAll(".menu_lateral input[type='checkbox']:checked"))
          .filter(chk => chk.closest(".filtro").querySelector(".filtro1").textContent.includes("Memoria RAM"))
          .map(chk => chk.value);
      }

      // Recopilar selección de Pantalla
      if (filtroPadre.includes("Tamaño de pantalla")) {
        estadoFiltro.pantallas = Array.from(document.querySelectorAll(".menu_lateral input[type='checkbox']:checked"))
          .filter(chk => chk.closest(".filtro").querySelector(".filtro1").textContent.includes("Tamaño de pantalla"))
          .map(chk => chk.value);
      }

      // Recopilar selección de Resolución
      if (filtroPadre.includes("Resolución de pantalla")) {
        estadoFiltro.resoluciones = Array.from(document.querySelectorAll(".menu_lateral input[type='checkbox']:checked"))
          .filter(chk => chk.closest(".filtro").querySelector(".filtro1").textContent.includes("Resolución de pantalla"))
          .map(chk => chk.value);
      }

      // Recopilar selección de Precio
      if (filtroPadre.includes("Precio")) {
        let precioChk = document.querySelector(".menu_lateral input[type='checkbox']:checked");
        estadoFiltro.precioMax = precioChk ? parseFloat(precioChk.value) : null;
      }

      // Recopilar selección de Descuentos
      if (filtroPadre.includes("Descuentos")) {
        let descChk = document.querySelector(".menu_lateral input[type='checkbox']:checked");
        estadoFiltro.descuentoMin = descChk ? parseFloat(descChk.value) : null;
      }

      aplicarFiltros();
    });
  });

  // 7. Paginación de Productos (implementación con paginación dinámica)

  function mostrarPagina(numPag) {
    const total = Math.max(1, Math.ceil(matchedTarjetas.length / ITEMS_POR_PAGINA));
    if (numPag < 1) numPag = 1;
    if (numPag > total) numPag = total;

    // ocultar todas las tarjetas primero
    productos.forEach(function (t) { t.style.display = 'none'; });

    const inicio = (numPag - 1) * ITEMS_POR_PAGINA;
    const fin = inicio + ITEMS_POR_PAGINA;

    matchedTarjetas.forEach(function (t, idx) {
      if (idx >= inicio && idx < fin) t.style.display = 'block';
      else t.style.display = 'none';
    });

    // actualizar visual de botones de paginación
    if (paginacionNumeros && paginacionNumeros.length) {
      paginacionNumeros.forEach(function (span) {
        const p = parseInt(span.getAttribute('data-pagina') || span.textContent);
        if (p === numPag) {
          span.classList.add('active');
          span.style.fontWeight = 'bold';
          span.style.color = '#84b814';
        } else {
          span.classList.remove('active');
          span.style.fontWeight = 'normal';
          span.style.color = '';
        }
      });
    }

    estadoFiltro.paginaActual = numPag;

    if (window.SenabellaToast) {
      window.SenabellaToast('Página ' + numPag + ' cargada', 'fa-file-lines');
    }

    gridProductos.scrollIntoView({ behavior: 'smooth' });
  }

  function cambiarPagina(numPag) {
    mostrarPagina(numPag);
  }

  // 8. Ordenar productos por precio
  if (selectOrden && gridProductos) {
    selectOrden.addEventListener("change", function () {
      let tarjetas = Array.from(gridProductos.querySelectorAll(".tar-producto"));

      tarjetas.sort(function (a, b) {
        let precioAEl = a.querySelector(".precio");
        let precioBEl = b.querySelector(".precio");

        // Extraer solo el texto directo del nodo precio (sin el span de descuento)
        let getPrecioNum = function(el) {
          if (!el) return 0;
          let node = Array.from(el.childNodes).find(n => n.nodeType === Node.TEXT_NODE);
          let txt = node ? node.textContent : el.textContent;
          return parseFloat(txt.replace(/[^\d]/g, "")) || 0;
        };

        let numA = getPrecioNum(precioAEl);
        let numB = getPrecioNum(precioBEl);

        if (selectOrden.value === "Menor precio") {
          return numA - numB;
        } else if (selectOrden.value === "Mayor precio") {
          return numB - numA;
        }
        return 0;
      });

      tarjetas.forEach(function (t) {
        gridProductos.appendChild(t);
      });

      if (window.SenabellaToast) {
        window.SenabellaToast("Orden aplicado: " + selectOrden.value, "fa-arrow-down-wide-short");
      }
    });
  }

  // 9. Redirección dinámica al hacer clic en un producto (Guardar producto seleccionado)
  productos.forEach(function (card) {
    let enlace = card.querySelector("a");
    if (enlace) {
      enlace.addEventListener("click", function (e) {
        let titulo = card.querySelector(".descripcion")?.textContent.trim() || "Producto";
        let marca = card.querySelector(".nom-producto")?.textContent.trim() || "SENABELLA";
        let precioActual = card.querySelector(".precio")?.textContent.split("\n")[0].trim() || "$ 0";
        let precioAntiguo = card.querySelector(".precio-secundario1")?.textContent.trim() || "$ 0";
        let img = card.querySelector("img")?.src || "";

        let productoSeleccionado = {
          titulo: titulo,
          marca: marca,
          descripcion: titulo + " - Excelente opción con garantía oficial Senabella.",
          precioActual: precioActual,
          precioAntiguo: precioAntiguo,
          imagen: img
        };

        localStorage.setItem("productoSeleccionado", JSON.stringify(productoSeleccionado));
      });
    }
  });

  // 10. Botón Favoritos en las tarjetas
  let favButtons = document.querySelectorAll(".favorite-btn");
  favButtons.forEach(function (btn) {
    btn.style.cursor = "pointer";
    
    // Obtener información del producto
    let tarjeta = btn.closest(".tar-producto");
    let marca = tarjeta.querySelector(".nom-producto") ? tarjeta.querySelector(".nom-producto").textContent.trim() : "";
    let descripcion = tarjeta.querySelector(".descripcion") ? tarjeta.querySelector(".descripcion").textContent.trim() : "";
    let nombreProd = marca + " - " + descripcion;
    let imagen = tarjeta.querySelector("img") ? tarjeta.querySelector("img").src : "";
    let precioEl = tarjeta.querySelector(".precio");
    let precioActual = precioEl ? (precioEl.childNodes[0] ? precioEl.childNodes[0].textContent.trim() : precioEl.textContent.trim()) : "";
    let referencia = tarjeta.querySelector(".referencia") ? tarjeta.querySelector(".referencia").textContent.trim() : "";
    
    // Inicializar estado del corazón si ya es favorito
    let esFavGlobal = window.SenabellaFavoritos && window.SenabellaFavoritos.esFavorito(nombreProd);
    if (esFavGlobal) {
      btn.classList.remove("fa-regular");
      btn.classList.add("fa-solid");
      btn.style.color = "#e63946";
    }
    
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      
      let esFav = btn.classList.contains("fa-solid");
      
      if (esFav) {
        // Eliminar de favoritos
        btn.classList.add("fa-regular");
        btn.classList.remove("fa-solid");
        btn.style.color = "";
        if (window.SenabellaFavoritos) {
          window.SenabellaFavoritos.eliminar(nombreProd);
        }
        if (window.SenabellaToast) {
          window.SenabellaToast("Eliminado de favoritos", "fa-heart-crack");
        }
      } else {
        if (window.SenabellaFavoritos) {
          let resultado = window.SenabellaFavoritos.agregar({
            nombre: nombreProd,
            marca: marca,
            imagen: imagen,
            precioTexto: precioActual,
            referencia: referencia
          });
          
          if (resultado !== false) {
            btn.classList.remove("fa-regular");
            btn.classList.add("fa-solid");
            btn.style.color = "#e63946";
            if (window.SenabellaToast) {
              window.SenabellaToast("Agregado a tus favoritos", "fa-heart");
            }
          }
        }
      }
    });
  });

  // Ensure each tarjeta has visible action buttons (Agregar + Favorito) positioned correctly
  document.querySelectorAll('.tar-producto').forEach(function (tarjeta) {
    // Skip if actions already present
    if (tarjeta.querySelector('.acciones-producto')) return;

    const acciones = document.createElement('div');
    acciones.className = 'acciones-producto';

    // Crear botón Agregar al carrito
    const btnCarrito = document.createElement('button');
    btnCarrito.type = 'button';
    btnCarrito.className = 'btn-agregar-carrito';
    btnCarrito.innerHTML = '<i class="fa-solid fa-cart-plus"></i> Agregar';

    btnCarrito.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();

      const nombre = tarjeta.querySelector('.descripcion')?.textContent.trim() || 'Producto';
      const precio = tarjeta.querySelector('.precio')?.textContent.trim() || '$ 0';
      const img = tarjeta.querySelector('img')?.src || '';

      if (window.SenabellaCart) {
        window.SenabellaCart.agregarProducto({
          nombre: nombre,
          marca: tarjeta.querySelector('.nom-producto')?.textContent.trim() || 'SENABELLA',
          precioText: precio,
          img: img,
          cantidad: 1
        });
      }

      btnCarrito.innerHTML = '<i class="fa-solid fa-check"></i> Agregado';
      btnCarrito.classList.add('btn-agregado');
      setTimeout(function () {
        btnCarrito.innerHTML = '<i class="fa-solid fa-cart-plus"></i> Agregar';
        btnCarrito.classList.remove('btn-agregado');
      }, 1500);

      if (window.SenabellaToast) {
        window.SenabellaToast(nombre + ' agregado al carrito', 'fa-cart-shopping', 'exito');
      }
    });

    // Mover el icono favorite existente dentro de las acciones si existe
    const favIcon = tarjeta.querySelector('.favorite-btn');
    if (favIcon) {
      // Si el icono es un <i>, envolverlo en un botón para replicar la UI de inicio
      if (favIcon.tagName === 'I') {
        const wrapper = document.createElement('button');
        wrapper.type = 'button';
        wrapper.className = 'btn-favorito';
        // mover el icono dentro del wrapper (preserva event listeners en el <i>)
        const parent = favIcon.parentNode;
        if (parent) parent.removeChild(favIcon);
        wrapper.appendChild(favIcon);
        acciones.appendChild(btnCarrito);
        acciones.appendChild(wrapper);

        // redirigir clics del wrapper al icono para disparar los handlers existentes
        wrapper.addEventListener('click', function (ev) {
          ev.preventDefault();
          ev.stopPropagation();
          favIcon.click();
        });
      } else {
        // si no es <i> (por ejemplo ya era botón), simplemente mover
        acciones.appendChild(btnCarrito);
        acciones.appendChild(favIcon);
      }
    } else {
      // Si no hay icono favorito en la tarjeta, crear uno nuevo (con clase favorite-btn para que la lógica encuentre y sincronice después)
      acciones.appendChild(btnCarrito);
      const newFavBtn = document.createElement('button');
      newFavBtn.type = 'button';
      newFavBtn.className = 'btn-favorito';
      newFavBtn.innerHTML = '<i class="fa-regular fa-heart favorite-btn"></i>';
      acciones.appendChild(newFavBtn);

      // Delegar clic del nuevo wrapper al <i> interno (no hay handlers; sincronizar después)
      newFavBtn.addEventListener('click', function (ev) {
        ev.preventDefault();
        ev.stopPropagation();
        const innerIcon = newFavBtn.querySelector('.favorite-btn');
        if (innerIcon) innerIcon.click();
      });
    }

    // Insertar acciones antes del final de la tarjeta para que queden alineadas con el contenido
    tarjeta.appendChild(acciones);
  });

  // 10. Guardar datos del producto seleccionado para la vista detalle
  productos.forEach(function (producto) {
    producto.addEventListener("click", function (e) {
      if (e.target.classList.contains("favorite-btn")) return;

      let marca = producto.querySelector(".nom-producto") ? producto.querySelector(".nom-producto").textContent.trim() : "";
      let descripcion = producto.querySelector(".descripcion") ? producto.querySelector(".descripcion").textContent.trim() : "";
      let imagen = producto.querySelector("img") ? producto.querySelector("img").src : "";
      let precioEl = producto.querySelector(".precio");
      let precioActual = precioEl ? (precioEl.childNodes[0] ? precioEl.childNodes[0].textContent.trim() : precioEl.textContent.trim()) : "";
      let precioAntiguo = producto.querySelector(".precio-secundario1") ? producto.querySelector(".precio-secundario1").textContent.trim() : "";
      let referencia = producto.querySelector(".referencia") ? producto.querySelector(".referencia").textContent.trim() : "";

      let datosProducto = {
        marca: marca,
        titulo: marca + " - " + descripcion,
        descripcion: descripcion,
        imagen: imagen,
        precioActual: precioActual,
        precioAntiguo: precioAntiguo,
        referencia: referencia,
        origen: window.location.pathname.split('/').pop() || 'catalogo.html'
      };

      localStorage.setItem("productoSeleccionado", JSON.stringify(datosProducto));
    });
  });

  // 11. Escuchar parámetros de búsqueda en la URL y eventos desde el buscador del header
  let urlParamsBusqueda = new URLSearchParams(window.location.search);
  let terminoInicial = urlParamsBusqueda.get("busqueda") || urlParamsBusqueda.get("q");
  if (terminoInicial) {
    estadoFiltro.busqueda = terminoInicial;
    aplicarFiltros();
  }

  document.addEventListener("busquedaEjecutada", function (e) {
    estadoFiltro.busqueda = e.detail || "";
    aplicarFiltros();
  });

  // Global delegated toasts for favorites and carrito (covers both catalog pages)
  document.body.addEventListener('click', function (e) {
    // Favorites - handle clicks on heart icons or favorite wrappers
    const favWrapper = e.target.closest('.btn-favorito, .favorite-btn, .btn-favorito i, .favorite-btn i');
    if (favWrapper) {
      // Delay to let other handlers toggle classes
      setTimeout(function () {
        // find the actual icon element (i.favorite-btn or i.fa-heart)
        let icon = null;
        if (favWrapper.tagName && (favWrapper.tagName.toLowerCase() === 'i')) icon = favWrapper;
        else icon = favWrapper.querySelector('i') || favWrapper.querySelector('.favorite-btn');

        if (icon) {
          const isSolid = icon.classList.contains('fa-solid');
          if (window.SenabellaToast) {
            if (isSolid) window.SenabellaToast('Agregado a tus favoritos', 'fa-heart', 'exito');
            else window.SenabellaToast('Eliminado de favoritos', 'fa-heart-crack', 'info');
          }
        }
      }, 20);
      return;
    }

    // Carrito - clicks on add-to-cart buttons
    const cartBtn = e.target.closest('.btn-agregar-carrito');
    if (cartBtn) {
      // If the button already shows agregado state, still show toast
      setTimeout(function () {
        const text = cartBtn.textContent.trim();
        const nombre = cartBtn.closest('.tar-producto')?.querySelector('.descripcion')?.textContent.trim() || 'Producto';
        if (window.SenabellaToast) {
          if (text.toLowerCase().includes('agregado')) {
            window.SenabellaToast(nombre + ' agregado al carrito', 'fa-cart-shopping', 'exito');
          } else {
            window.SenabellaToast(nombre + ' agregado al carrito', 'fa-cart-shopping', 'exito');
          }
        }
      }, 10);
      return;
    }
  }, false);

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




