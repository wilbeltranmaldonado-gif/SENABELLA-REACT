// ==========================================
// CONFIRMACIÓN DE COMPRA - SENABELLA
// ==========================================

document.addEventListener("DOMContentLoaded", function () {
  
  // Elementos del DOM donde mostraremos los datos
  const elOrden = document.getElementById("conf-orden");
  const elFecha = document.getElementById("conf-fecha");
  const elMetodo = document.getElementById("conf-metodo");
  const elTotal = document.getElementById("conf-total");
  const elDireccion = document.getElementById("conf-direccion");

  // Obtener los datos de la orden guardados en localStorage
  let ordenGuardada;
  try {
    ordenGuardada = JSON.parse(localStorage.getItem("ultima_orden_senabella"));
  } catch (e) {
    console.error("No se pudo leer la orden", e);
  }

  if (ordenGuardada) {
    if (elOrden) elOrden.textContent = ordenGuardada.numero;
    if (elFecha) elFecha.textContent = ordenGuardada.fecha;
    if (elMetodo) elMetodo.textContent = ordenGuardada.metodoPago === 'pse' ? 'Transferencia PSE' : (ordenGuardada.metodoPago === 'contraentrega' ? 'Contra Entrega' : 'Tarjeta de Crédito / Débito');
    if (elTotal) elTotal.textContent = ordenGuardada.total;
    if (elDireccion) elDireccion.textContent = ordenGuardada.direccion + ", " + ordenGuardada.ciudad;
  } else {
    // Fallback si alguien entra a esta URL directo sin comprar
    if (elOrden) elOrden.textContent = "N/A";
    if (elFecha) elFecha.textContent = new Date().toLocaleDateString();
    if (elMetodo) elMetodo.textContent = "N/A";
    if (elTotal) elTotal.textContent = "$ 0";
    if (elDireccion) elDireccion.textContent = "Información no disponible";
  }

  // Notificación de éxito
  if (window.SenabellaToast && ordenGuardada) {
    setTimeout(() => {
      window.SenabellaToast("Orden " + ordenGuardada.numero + " generada exitosamente", "fa-circle-check", "exito");
    }, 500);
  }

  // Marcar el carrito como procesado (actualizar contador del header a 0 si no quedan items)
  if (window.SenabellaCart) {
    window.SenabellaCart.actualizarBadge();
  }

});
