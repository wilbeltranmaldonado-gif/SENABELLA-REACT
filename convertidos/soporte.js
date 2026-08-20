const articulos = [
  // Mis Pedidos
  { 
    id: 1, 
    titulo: "¿Cómo realizar seguimiento a mi pedido en tiempo real?", 
    tiempo: "2 min", 
    cat: "Mis Pedidos", 
    keywords: ["pedidos", "pedido", "rastreo", "guia", "seguimiento", "donde esta mi pedido", "estado"],
    contenido: `
      <h4>Seguimiento paso a paso</h4>
      <p>Puedes rastrear el estado de tu compra fácilmente siguiendo estos pasos:</p>
      <ul>
        <li>Ingresa a tu cuenta de Senabella y ve a la sección <strong>Mis Pedidos</strong>.</li>
        <li>Selecciona el pedido que deseas consultar y haz clic en <strong>Ver Detalle</strong>.</li>
        <li>Copia el número de guía e ingresa al portal de la transportadora (Servientrega, Coordinadora o Envía).</li>
      </ul>
      <p>También recibirás notificaciones por correo electrónico en cada etapa del transporte.</p>`
  },
  { 
    id: 2, 
    titulo: "¿Puedo modificar o cambiar los productos de un pedido ya realizado?", 
    tiempo: "2 min", 
    cat: "Mis Pedidos", 
    keywords: ["pedidos", "pedido", "modificar", "cambiar", "cancelar", "editar"],
    contenido: `
      <h4>Modificación de pedidos</h4>
      <p>Una vez confirmado el pedido, nuestro centro de distribución inicia la preparación inmediatamente.</p>
      <p>Si necesitas modificar la talla, color o dirección, dispones de <strong>30 minutos</strong> desde la compra para notificarnos a través del formulario de contacto.</p>`
  },
  { 
    id: 3, 
    titulo: "¿Qué hago si mi pedido aparece entregado pero no lo he recibido?", 
    tiempo: "3 min", 
    cat: "Mis Pedidos", 
    keywords: ["pedidos", "pedido", "entregado", "no recibido", "perdido", "novedad"],
    contenido: `
      <h4>Verificación de entrega</h4>
      <p>Si la guía de transporte figura como entregada pero no tienes tu paquete:</p>
      <ul>
        <li>Verifica en portería, recepción o con familiares/vecinos cercanos.</li>
        <li>Comprueba que la dirección ingresada en el checkout sea la correcta.</li>
        <li>Si pasadas 24 horas no aparece, escríbenos para abrir una investigación formal con la transportadora.</li>
      </ul>`
  },

  // Envíos y Entregas
  { 
    id: 4, 
    titulo: "Tiempos y costos de envío a nivel nacional", 
    tiempo: "2 min", 
    cat: "Envíos y Entregas", 
    keywords: ["envíos y entregas", "envios", "envio", "entregas", "entrega", "costo", "tarifa", "tiempo", "cobertura"],
    contenido: `
      <h4>Tiempos estimados de entrega</h4>
      <ul>
        <li><strong>Ciudades principales (Bogotá, Medellín, Cali, Barranquilla):</strong> 1 a 3 días hábiles.</li>
        <li><strong>Ciudades intermedias:</strong> 3 a 5 días hábiles.</li>
        <li><strong>Municipios y zonas especiales:</strong> 5 a 8 días hábiles.</li>
      </ul>
      <p>El envío es <strong>GRATIS</strong> por compras superiores a $150.000 COP en toda Colombia.</p>`
  },
  { 
    id: 5, 
    titulo: "¿Cómo funciona el servicio de Envío Express en el mismo día?", 
    tiempo: "2 min", 
    cat: "Envíos y Entregas", 
    keywords: ["envíos y entregas", "envios", "express", "mismo dia", "urgente", "rapido", "bogota"],
    contenido: `
      <h4>Entrega el mismo día en Bogotá</h4>
      <p>Para la ciudad de Bogotá ofrecemos entrega el mismo día si realizas tu pedido de lunes a viernes antes de las 12:00 PM.</p>
      <p>Tiene un costo tarifa fija de $18.000 COP y la entrega se realiza en franja horaria de 2:00 PM a 8:00 PM.</p>`
  },
  { 
    id: 6, 
    titulo: "¿Qué sucede si no me encuentro en casa al momento de la entrega?", 
    tiempo: "2 min", 
    cat: "Envíos y Entregas", 
    keywords: ["envíos y entregas", "ausente", "reintento", "visita", "transportadora"],
    contenido: `
      <h4>Gestión de reintentos</h4>
      <p>La empresa de mensajería realizará hasta 3 intentos de entrega en la dirección indicada.</p>
      <p>En cada intento te enviarán un mensaje SMS o correo informando la novedad de visita.</p>`
  },

  // Cambios y Devoluciones
  { 
    id: 7, 
    titulo: "Pasos para gestionar una devolución o cambio de prenda", 
    tiempo: "3 min", 
    cat: "Cambios y Devoluciones", 
    keywords: ["cambios y devoluciones", "cambios", "devoluciones", "devolucion", "cambio", "retracto", "talla"],
    contenido: `
      <h4>Proceso de cambio o devolución</h4>
      <p>Cuentas con <strong>30 días calendario</strong> tras la entrega para realizar cambios de productos sin uso.</p>
      <ol>
        <li>La prenda debe contar con sus marquillas, etiquetas originales y empaque en perfecto estado.</li>
        <li>Completa la solicitud en el módulo de Contacto o Soporte.</li>
        <li>Lleva la prenda con la guía de devolución a cualquier punto autorizado de correo.</li>
      </ol>`
  },
  { 
    id: 8, 
    titulo: "¿Quién cubre los costos de envío por cambios de producto?", 
    tiempo: "2 min", 
    cat: "Cambios y Devoluciones", 
    keywords: ["cambios y devoluciones", "costo", "flete", "quien paga", "envio cambio"],
    contenido: `
      <h4>Política de fletes por cambio</h4>
      <p>Si la devolución es por un defecto de calidad o error en el despacho por parte de Senabella, <strong>nosotros asumimos el 100% de los fletes</strong>.</p>
      <p>Si deseas cambiar por otra talla, color o modelo por gusto personal, el costo del envío de retorno corre por cuenta del comprador.</p>`
  },
  { 
    id: 9, 
    titulo: "Política de reembolso de dinero y derecho de retracto", 
    tiempo: "3 min", 
    cat: "Cambios y Devoluciones", 
    keywords: ["cambios y devoluciones", "reembolso", "retracto", "devolucion dinero", "banco", "tarjeta"],
    contenido: `
      <h4>Derecho de retracto legal</h4>
      <p>De acuerdo con el Estatuto del Consumidor, cuentas con 5 días hábiles siguientes a la entrega para ejercer el retracto de compra.</p>
      <p>El dinero será abonado a tu cuenta bancaria o reversado a tu tarjeta de crédito en un plazo máximo de 15 días hábiles.</p>`
  },

  // Pagos y Facturación
  { 
    id: 10, 
    titulo: "¿Qué hago si mi pago con tarjeta fue rechazado?", 
    tiempo: "1 min", 
    cat: "Pagos y Facturación", 
    keywords: ["pagos y facturación", "pagos", "facturacion", "pago", "rechazado", "tarjeta", "error", "banco"],
    contenido: `
      <h4>Solución a pagos rechazados</h4>
      <p>Si tu pago no fue procesado exitosamente, revisa los siguientes puntos:</p>
      <ul>
        <li>Verifica que los datos digitados (CVV, fecha de vencimiento) coincidan exactamente.</li>
        <li>Confirma con tu entidad bancaria si tienes habilitadas compras por internet.</li>
        <li>Prueba abonar a través de PSE (Nequi / Daviplata) o Addi.</li>
      </ul>`
  },
  { 
    id: 11, 
    titulo: "Medios de pago disponibles y compras a cuotas", 
    tiempo: "2 min", 
    cat: "Pagos y Facturación", 
    keywords: ["pagos y facturación", "medios de pago", "pse", "nequi", "addi", "efecty", "tarjeta", "cuotas"],
    contenido: `
      <h4>Métodos de pago habilitados</h4>
      <p>En Senabella disponemos de diversas opciones para tu comodidad:</p>
      <ul>
        <li>Tarjetas de Crédito/Débito (Visa, Mastercard, Amex, Diners).</li>
        <li>PSE (Transferencia bancaria directa, Nequi y Daviplata).</li>
        <li>Financiación a cuotas sin tarjeta con <strong>Addi</strong>.</li>
        <li>Pago presencial en efectivo a través de giros en puntos <strong>Efecty</strong>.</li>
      </ul>`
  },
  { 
    id: 12, 
    titulo: "¿Cómo descargar mi factura electrónica de venta?", 
    tiempo: "2 min", 
    cat: "Pagos y Facturación", 
    keywords: ["pagos y facturación", "factura", "factura electronica", "dian", "pdf"],
    contenido: `
      <h4>Obtención de factura electrónica</h4>
      <p>Tras cada compra aprobada, el sistema emite automáticamente la factura electrónica validada por la DIAN.</p>
      <p>Recibirás un archivo PDF y XML en tu correo registrado, o puedes consultar tus facturas en <strong>Mi Cuenta > Mis Pedidos</strong>.</p>`
  },

  // Mi Cuenta
  { 
    id: 13, 
    titulo: "Guía de tallas: ¿Cómo elegir la medida perfecta?", 
    tiempo: "4 min", 
    cat: "Mi Cuenta", 
    keywords: ["mi cuenta", "cuenta", "tallas", "medidas", "pecho", "cintura", "cadera", "guia de tallas"],
    contenido: `
      <h4>Cómo tomar tus medidas</h4>
      <p>Utiliza una cinta métrica sobre el cuerpo para obtener la medida en centímetros:</p>
      <ul>
        <li><strong>Busto / Pecho:</strong> Mide la parte más prominente sobre el pecho.</li>
        <li><strong>Cintura:</strong> Mide el contorno de la zona más estrecha del abdomen.</li>
        <li><strong>Cadera:</strong> Mide la parte más ancha de la cadera.</li>
      </ul>
      <p>Compara tus centímetros con nuestra tabla oficial de tallas en cada ficha de producto.</p>`
  },
  { 
    id: 14, 
    titulo: "¿Cómo restablecer o cambiar la contraseña de mi cuenta?", 
    tiempo: "2 min", 
    cat: "Mi Cuenta", 
    keywords: ["mi cuenta", "cuenta", "contraseña", "clave", "recuperar", "olvide"],
    contenido: `
      <h4>Recuperación de contraseña</h4>
      <p>Para recuperar tu clave de acceso:</p>
      <ol>
        <li>Presiona el botón de <strong>Iniciar Sesión</strong>.</li>
        <li>Selecciona el enlace <em>"¿Olvidaste tu contraseña?"</em>.</li>
        <li>Introduce el e-mail asociado a tu cuenta y recibirás un enlace de restauración instantáneo.</li>
      </ol>`
  },
  { 
    id: 15, 
    titulo: "Edición de datos personales y direcciones guardadas", 
    tiempo: "2 min", 
    cat: "Mi Cuenta", 
    keywords: ["mi cuenta", "cuenta", "datos", "perfil", "direccion", "editar"],
    contenido: `
      <h4>Administración del perfil</h4>
      <p>En el panel de tu cuenta puedes actualizar tus números telefónicos de contacto y agregar múltiples direcciones de entrega para agilizar tus futuras compras.</p>`
  },

  // Promociones y Cupones
  { 
    id: 16, 
    titulo: "¿Cómo ingresar un código de descuento o Gift Card?", 
    tiempo: "1 min", 
    cat: "Promociones y Cupones", 
    keywords: ["promociones y cupones", "promociones", "cupones", "cupon", "descuento", "gift card", "codigo"],
    contenido: `
      <h4>Aplicación de cupones</h4>
      <p>Durante la pantalla de resumen de pago (Checkout):</p>
      <ol>
        <li>Busca la casilla llamada <strong>"¿Tienes un cupón de descuento?"</strong>.</li>
        <li>Escribe el código promocional en mayúsculas sin espacios.</li>
        <li>Haz clic en el botón <strong>Aplicar</strong> para recalcular el valor total.</li>
      </ol>`
  },
  { 
    id: 17, 
    titulo: "Términos y condiciones de ofertas de temporada", 
    tiempo: "2 min", 
    cat: "Promociones y Cupones", 
    keywords: ["promociones y cupones", "promociones", "oferta", "descuentos", "cyber", "rebajas"],
    contenido: `
      <h4>Condiciones generales de promociones</h4>
      <p>Los cupones de descuento y promociones activas no son acumulables con otras promociones del sitio salvo indicación contraria.</p>
      <p>Las compras en prendas marcadas como <em>Outlet / Remate Final</em> aplican únicamente para cambios de talla según disponibilidad de stock.</p>`
  },

  // Garantías y Calidad
  { 
    id: 18, 
    titulo: "¿Cómo tramitar una garantía por defectos de fábrica?", 
    tiempo: "3 min", 
    cat: "Garantías y Calidad", 
    keywords: ["garantías y calidad", "garantias", "calidad", "defecto", "costura", "reclamo", "imperfeccion"],
    contenido: `
      <h4>Solicitud de garantía</h4>
      <p>Todas las prendas Senabella poseen <strong>30 días de garantía legal</strong> contra defectos de confección o cierres.</p>
      <p>Envíanos fotos detalladas de la falla junto con tu número de pedido a través de nuestro formulario de contacto para aprobar el cambio o reparación sin costo.</p>`
  },
  { 
    id: 19, 
    titulo: "Guía de lavado y conservación de prendas delicadas", 
    tiempo: "2 min", 
    cat: "Garantías y Calidad", 
    keywords: ["garantías y calidad", "garantias", "calidad", "lavado", "cuidado", "telas", "mantenimiento"],
    contenido: `
      <h4>Tips de conservación</h4>
      <ul>
        <li>Lava prendas delicadas a mano o en ciclo suave con jabón neutro.</li>
        <li>Evita el uso de secadoras automáticas a altas temperaturas.</li>
        <li>Seca a la sombra y plancha por el revés de la prenda a temperatura moderada.</li>
      </ul>`
  },

  // Tiendas Físicas
  { 
    id: 20, 
    titulo: "Ubicaciones y horarios de nuestras tiendas físicas", 
    tiempo: "2 min", 
    cat: "Tiendas Físicas", 
    keywords: ["tiendas físicas", "tiendas", "boutiques", "locales", "ubicar", "donde comprar", "horarios"],
    contenido: `
      <h4>Boutiques Senabella en Colombia</h4>
      <p>Visita nuestras tiendas exclusivas para conocer y probar nuestras colecciones:</p>
      <ul>
        <li><strong>Bogotá:</strong> C.C. Unicentro - Local 204 (10:00 AM a 8:00 PM)</li>
        <li><strong>Medellín:</strong> C.C. El Tesoro - Local 115 (10:00 AM a 8:00 PM)</li>
        <li><strong>Cali:</strong> C.C. Chipichape - Local 310 (10:00 AM a 8:00 PM)</li>
      </ul>`
  }
];

document.addEventListener("DOMContentLoaded", () => {
  
  // ==========================================
  // BUSCADOR Y FILTRADO DE ARTÍCULOS
  // ==========================================
  const inputBusqueda = document.querySelector("#busqueda-soporte");
  const btnBuscar = document.querySelector("#btn-buscar");
  const contenedorArticulos = document.querySelector(".articulos-lista");
  const tituloSeccion = document.querySelector(".articulos-destacados h2");

  const renderizarArticulos = (lista) => {
    contenedorArticulos.innerHTML = "";
    
    if (lista.length === 0) {
      contenedorArticulos.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #888;">
          <i class="fa-solid fa-magnifying-glass" style="font-size: 40px; margin-bottom: 16px; color: #ccc;"></i>
          <p style="font-size: 1.1rem; font-weight: 600;">No se encontraron artículos que coincidan con tu búsqueda.</p>
          <p style="font-size: 0.9rem;">Intenta con palabras clave como "envíos", "cambios", "tallas", "pagos" o selecciones una categoría.</p>
        </div>`;
      return;
    }
    
    lista.forEach(art => {
      contenedorArticulos.innerHTML += `
        <div class="articulo-item">
          <i class="fa-regular fa-file-lines"></i>
          <div class="articulo-info">
            <a href="#" data-id="${art.id}">${art.titulo}</a>
            <span>Categoría: <strong>${art.cat}</strong> &bull; Lectura de ${art.tiempo}</span>
          </div>
        </div>`;
    });
  };

  // Render inicial: muestra 6 artículos populares
  renderizarArticulos(articulos.slice(0, 6));

  const realizarBusqueda = (queryForzada) => {
    const rawQuery = queryForzada !== undefined ? queryForzada : inputBusqueda.value;
    const query = rawQuery.trim().toLowerCase();
    
    if (query.length > 0) {
      btnBuscar.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
      btnBuscar.disabled = true;
      
      setTimeout(() => {
        const resultados = articulos.filter(a => {
          const tituloMatch = a.titulo.toLowerCase().includes(query);
          const catMatch = a.cat.toLowerCase().includes(query) || query.includes(a.cat.toLowerCase());
          const keywordMatch = a.keywords && a.keywords.some(k => k.toLowerCase().includes(query) || query.includes(k.toLowerCase()));
          return tituloMatch || catMatch || keywordMatch;
        });

        tituloSeccion.textContent = `Resultados para "${rawQuery.trim()}" (${resultados.length})`;
        renderizarArticulos(resultados);
        
        btnBuscar.innerHTML = 'Buscar';
        btnBuscar.disabled = false;
        document.querySelector(".articulos-destacados").scrollIntoView({ behavior: 'smooth' });
      }, 300);
      
    } else {
      tituloSeccion.textContent = "Artículos populares";
      renderizarArticulos(articulos.slice(0, 6));
    }
  };

  btnBuscar.addEventListener("click", () => realizarBusqueda());
  inputBusqueda.addEventListener("keyup", (e) => {
    if (e.key === "Enter" || inputBusqueda.value.trim() === "") realizarBusqueda();
  });

  // Clic en tarjetas de categorías
  document.querySelectorAll(".categoria-tarjeta").forEach(tarjeta => {
    tarjeta.addEventListener("click", (e) => {
      e.preventDefault();
      const catNombre = tarjeta.querySelector("h3").textContent.trim();
      inputBusqueda.value = catNombre;
      realizarBusqueda(catNombre);
    });
  });

  // ==========================================
  // MODAL DE ARTÍCULOS DETALLADOS
  // ==========================================
  const modalArticulo = document.querySelector('#modal-articulo');
  
  const abrirModal = (articulo) => {
    document.querySelector('#modal-titulo').textContent = articulo.titulo;
    document.querySelector('#modal-cat').textContent = articulo.cat;
    document.querySelector('#modal-tiempo').textContent = articulo.tiempo;
    
    document.querySelector('#modal-texto').innerHTML = articulo.contenido || `
      <h4>Información detallada</h4>
      <p>Contenido explicativo sobre <strong>${articulo.titulo.toLowerCase()}</strong>.</p>`;
      
    modalArticulo.classList.add('activo');
  };

  const cerrarModalArticulo = () => modalArticulo.classList.remove('activo');

  if (document.querySelector('#cerrar-articulo')) {
    document.querySelector('#cerrar-articulo').addEventListener('click', cerrarModalArticulo);
  }
  
  modalArticulo.addEventListener('click', (e) => { 
    if (e.target === modalArticulo) cerrarModalArticulo(); 
  });
  
  contenedorArticulos.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (link) {
      e.preventDefault();
      const idStr = link.getAttribute('data-id');
      const tituloStr = link.textContent.trim();
      
      let artEncontrado = null;
      if (idStr) {
        artEncontrado = articulos.find(a => a.id === parseInt(idStr));
      }
      if (!artEncontrado) {
        artEncontrado = articulos.find(a => a.titulo.trim() === tituloStr) || {
          titulo: tituloStr,
          cat: 'Soporte General',
          tiempo: '2 min',
          contenido: `<p>Información detallada para ${tituloStr}. Si requieres más asistencia por favor ponte en contacto con nuestro equipo.</p>`
        };
      }
      
      abrirModal(artEncontrado);
    }
  });

  // ==========================================
  // PREGUNTAS FRECUENTES (FAQ) ACCORDION
  // ==========================================
  const preguntasFAQ = document.querySelectorAll(".faq-item");
  
  preguntasFAQ.forEach(item => {
    item.addEventListener("click", () => {
      preguntasFAQ.forEach(otro => { 
        if (otro !== item) otro.classList.remove("activo"); 
      });
      item.classList.toggle("activo");
    });
  });

});
