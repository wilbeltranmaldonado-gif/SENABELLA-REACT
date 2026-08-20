import { useState, useRef } from "react";

function ModalEditarPedido({ pedido, alCerrar, alGuardar }) {
  const [formData, setFormData] = useState(() => {
    const clienteNombre = pedido.cliente?.nombre || pedido.cliente || "";
    const email = pedido.cliente?.email || pedido.email || "";
    const telefono = pedido.cliente?.telefono || pedido.telefono || "";
    const prods = Array.isArray(pedido.productos) && pedido.productos.length > 0
      ? pedido.productos.map((p) => ({
          nombre: p.nombre || "Producto",
          cantidad: Number(p.cantidad) || 1,
          precioText: p.precioText || p.precio || "$ 0",
          img: p.img || p.imagen || ""
        }))
      : [];

    return {
      id: pedido.id || pedido.numero || "",
      numero: pedido.numero || pedido.id || "",
      clienteNombre,
      email,
      telefono,
      direccion: pedido.direccion || "",
      ciudad: pedido.ciudad || "",
      estado: pedido.estado === "pendiente-verificacion" ? "pendiente" : pedido.estado || "pendiente",
      fecha: pedido.fecha || new Date().toLocaleDateString("es-CO"),
      metodoPago: pedido.metodoPago || "Transferencia Bancaria",
      total: pedido.total || "$ 0",
      comprobante: pedido.comprobante || null,
      productos: prods
    };
  });

  const [nuevoProductoNombre, setNuevoProductoNombre] = useState("");
  const [nuevoProductoPrecio, setNuevoProductoPrecio] = useState("");
  const [guardando, setGuardando] = useState(false);
  const fileInputRef = useRef(null);

  const parsearPrecio = (texto) => parseFloat(String(texto || "").replace(/[^\d]/g, "")) || 0;
  const formatearMoneda = (val) => "$ " + Math.round(val).toLocaleString("es-CO");

  const recalcularTotal = (nuevaListaProds) => {
    const suma = nuevaListaProds.reduce((acc, p) => {
      const precio = parsearPrecio(p.precioText);
      return acc + precio * (Number(p.cantidad) || 1);
    }, 0);
    return suma > 0 ? formatearMoneda(suma) : formData.total;
  };

  const handleCambioTexto = (campo, valor) => {
    setFormData((prev) => ({ ...prev, [campo]: valor }));
  };

  const handleCambiarCantidad = (indice, delta) => {
    setFormData((prev) => {
      const nuevosProductos = prev.productos.map((prod, idx) => {
        if (idx === indice) {
          const nuevaCant = Math.max(1, (Number(prod.cantidad) || 1) + delta);
          return { ...prod, cantidad: nuevaCant };
        }
        return prod;
      });
      const nuevoTotal = recalcularTotal(nuevosProductos);
      return { ...prev, productos: nuevosProductos, total: nuevoTotal };
    });
  };

  const handleEliminarProducto = (indice) => {
    setFormData((prev) => {
      const nuevosProductos = prev.productos.filter((_, idx) => idx !== indice);
      const nuevoTotal = recalcularTotal(nuevosProductos);
      return { ...prev, productos: nuevosProductos, total: nuevoTotal };
    });
  };

  const handleAgregarProducto = (e) => {
    e.preventDefault();
    if (!nuevoProductoNombre.trim()) return;

    const precioNum = parsearPrecio(nuevoProductoPrecio) || 50000;
    const nuevoProd = {
      nombre: nuevoProductoNombre.trim(),
      cantidad: 1,
      precioText: formatearMoneda(precioNum),
      img: ""
    };

    setFormData((prev) => {
      const nuevosProds = [...prev.productos, nuevoProd];
      const nuevoTotal = recalcularTotal(nuevosProds);
      return { ...prev, productos: nuevosProds, total: nuevoTotal };
    });

    setNuevoProductoNombre("");
    setNuevoProductoPrecio("");
  };

  const handleSubirComprobante = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const lector = new FileReader();
      lector.onload = (eventoLectura) => {
        setFormData((prev) => ({ ...prev, comprobante: eventoLectura.target?.result }));
      };
      lector.readAsDataURL(file);
    }
  };

  const handleEliminarComprobante = () => {
    setFormData((prev) => ({ ...prev, comprobante: null }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setGuardando(true);

    const pedidoActualizado = {
      ...pedido,
      id: formData.id,
      numero: formData.numero,
      cliente: {
        nombre: formData.clienteNombre,
        email: formData.email,
        telefono: formData.telefono,
        direccion: formData.direccion,
        ciudad: formData.ciudad
      },
      email: formData.email,
      telefono: formData.telefono,
      direccion: formData.direccion,
      ciudad: formData.ciudad,
      estado: formData.estado,
      fecha: formData.fecha,
      metodoPago: formData.metodoPago,
      total: formData.total,
      comprobante: formData.comprobante,
      productos: formData.productos,
      items: formData.productos.reduce((sum, p) => sum + (Number(p.cantidad) || 1), 0)
    };

    setTimeout(() => {
      alGuardar(pedidoActualizado);
      setGuardando(false);
    }, 250);
  };

  const obtenerClaseEstado = (estado) => {
    const clases = {
      completado: "estado-exito",
      procesando: "estado-info",
      pendiente: "estado-advertencia",
      enviado: "estado-primario",
      cancelado: "estado-error"
    };
    return clases[estado] || "";
  };

  return (
    <div className="admin-modal-overlay modal-pedido-overlay" onClick={alCerrar}>
      <div className="admin-modal modal-pedido-minimalista" onClick={(e) => e.stopPropagation()}>
        {/* CABECERA MINIMALISTA */}
        <div className="modal-pedido-header">
          <div className="modal-pedido-header-info">
            <span className="modal-pedido-pill-id">{formData.id || formData.numero}</span>
            <h2>Editar Detalles del Pedido</h2>
          </div>
          <button className="modal-pedido-btn-cerrar" onClick={alCerrar} title="Cerrar ventana">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* CUERPO CON SCROLL ELEGANTE */}
        <form onSubmit={handleSubmit} className="modal-pedido-form">
          <div className="modal-pedido-grid">
            {/* SECCIÓN 1: ESTADO Y METADATOS */}
            <div className="modal-pedido-card">
              <h3 className="modal-pedido-seccion-titulo">
                <i className="fa-solid fa-receipt"></i> Estado y Facturación
              </h3>
              <div className="modal-pedido-fila-inputs">
                <div className="modal-pedido-campo">
                  <label>Estado del pedido</label>
                  <select
                    value={formData.estado}
                    onChange={(e) => handleCambioTexto("estado", e.target.value)}
                    className={`modal-pedido-select-estado ${obtenerClaseEstado(formData.estado)}`}
                  >
                    <option value="pendiente">🟡 Pendiente</option>
                    <option value="procesando">🔵 Procesando</option>
                    <option value="enviado">🟣 Enviado</option>
                    <option value="completado">🟢 Completado</option>
                    <option value="cancelado">🔴 Cancelado</option>
                  </select>
                </div>
                <div className="modal-pedido-campo">
                  <label>Total del pedido</label>
                  <input
                    type="text"
                    value={formData.total}
                    onChange={(e) => handleCambioTexto("total", e.target.value)}
                    className="modal-pedido-input"
                    placeholder="$ 0"
                    required
                  />
                </div>
              </div>

              <div className="modal-pedido-fila-inputs">
                <div className="modal-pedido-campo">
                  <label>Método de pago</label>
                  <input
                    type="text"
                    value={formData.metodoPago}
                    onChange={(e) => handleCambioTexto("metodoPago", e.target.value)}
                    className="modal-pedido-input"
                    placeholder="Bancolombia, Nequi, etc."
                  />
                </div>
                <div className="modal-pedido-campo">
                  <label>Fecha de orden</label>
                  <input
                    type="text"
                    value={formData.fecha}
                    onChange={(e) => handleCambioTexto("fecha", e.target.value)}
                    className="modal-pedido-input"
                  />
                </div>
              </div>
            </div>

            {/* SECCIÓN 2: INFORMACIÓN DEL CLIENTE */}
            <div className="modal-pedido-card">
              <h3 className="modal-pedido-seccion-titulo">
                <i className="fa-solid fa-user"></i> Información del Cliente
              </h3>
              <div className="modal-pedido-campo">
                <label>Nombre del cliente</label>
                <input
                  type="text"
                  value={formData.clienteNombre}
                  onChange={(e) => handleCambioTexto("clienteNombre", e.target.value)}
                  className="modal-pedido-input"
                  placeholder="Nombre completo"
                  required
                />
              </div>
              <div className="modal-pedido-fila-inputs">
                <div className="modal-pedido-campo">
                  <label>Correo electrónico</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleCambioTexto("email", e.target.value)}
                    className="modal-pedido-input"
                    placeholder="correo@ejemplo.com"
                  />
                </div>
                <div className="modal-pedido-campo">
                  <label>Teléfono de contacto</label>
                  <input
                    type="text"
                    value={formData.telefono}
                    onChange={(e) => handleCambioTexto("telefono", e.target.value)}
                    className="modal-pedido-input"
                    placeholder="300 123 4567"
                  />
                </div>
              </div>
            </div>

            {/* SECCIÓN 3: DIRECCIÓN DE ENTREGA */}
            <div className="modal-pedido-card">
              <h3 className="modal-pedido-seccion-titulo">
                <i className="fa-solid fa-location-dot"></i> Datos de Entrega
              </h3>
              <div className="modal-pedido-fila-inputs">
                <div className="modal-pedido-campo" style={{ flex: 2 }}>
                  <label>Dirección completa</label>
                  <input
                    type="text"
                    value={formData.direccion}
                    onChange={(e) => handleCambioTexto("direccion", e.target.value)}
                    className="modal-pedido-input"
                    placeholder="Calle, Carrera, Apto / Casa"
                  />
                </div>
                <div className="modal-pedido-campo" style={{ flex: 1 }}>
                  <label>Ciudad</label>
                  <input
                    type="text"
                    value={formData.ciudad}
                    onChange={(e) => handleCambioTexto("ciudad", e.target.value)}
                    className="modal-pedido-input"
                    placeholder="Ej. Bogotá"
                  />
                </div>
              </div>
            </div>

            {/* SECCIÓN 4: COMPROBANTE DE PAGO */}
            <div className="modal-pedido-card">
              <h3 className="modal-pedido-seccion-titulo">
                <i className="fa-solid fa-image"></i> Comprobante de Pago
              </h3>
              {formData.comprobante ? (
                <div className="modal-pedido-comprobante-preview">
                  <img src={formData.comprobante} alt="Comprobante de pago" />
                  <div className="modal-pedido-comprobante-acciones">
                    <button
                      type="button"
                      className="modal-pedido-btn-mini btn-danger"
                      onClick={handleEliminarComprobante}
                    >
                      <i className="fa-solid fa-trash-can"></i> Quitar comprobante
                    </button>
                  </div>
                </div>
              ) : (
                <div className="modal-pedido-comprobante-vacio">
                  <i className="fa-solid fa-receipt"></i>
                  <p>Sin comprobante adjunto</p>
                  <label className="modal-pedido-btn-mini btn-subir">
                    <i className="fa-solid fa-upload"></i> Subir imagen
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleSubirComprobante}
                      style={{ display: "none" }}
                    />
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* SECCIÓN 5: ARTÍCULOS / PRODUCTOS */}
          <div className="modal-pedido-card" style={{ marginTop: "16px" }}>
            <div className="modal-pedido-card-header-flex">
              <h3 className="modal-pedido-seccion-titulo" style={{ margin: 0 }}>
                <i className="fa-solid fa-box"></i> Productos del Pedido ({formData.productos.length})
              </h3>
            </div>

            {formData.productos.length > 0 ? (
              <div className="modal-pedido-lista-productos">
                {formData.productos.map((prod, idx) => (
                  <div key={idx} className="modal-pedido-item-producto">
                    <div className="modal-pedido-prod-img">
                      {prod.img ? (
                        <img src={prod.img} alt={prod.nombre} />
                      ) : (
                        <i className="fa-solid fa-box"></i>
                      )}
                    </div>
                    <div className="modal-pedido-prod-info">
                      <input
                        type="text"
                        value={prod.nombre}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFormData((prev) => ({
                            ...prev,
                            productos: prev.productos.map((p, i) => (i === idx ? { ...p, nombre: val } : p))
                          }));
                        }}
                        className="modal-pedido-input-prod-nombre"
                        placeholder="Nombre del producto"
                      />
                      <input
                        type="text"
                        value={prod.precioText}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFormData((prev) => {
                            const actualizados = prev.productos.map((p, i) => (i === idx ? { ...p, precioText: val } : p));
                            return { ...prev, productos: actualizados, total: recalcularTotal(actualizados) };
                          });
                        }}
                        className="modal-pedido-input-prod-precio"
                        placeholder="$ 0"
                      />
                    </div>
                    <div className="modal-pedido-prod-controles">
                      <div className="modal-pedido-stepper">
                        <button type="button" onClick={() => handleCambiarCantidad(idx, -1)} title="Disminuir">
                          <i className="fa-solid fa-minus"></i>
                        </button>
                        <span>{prod.cantidad || 1}</span>
                        <button type="button" onClick={() => handleCambiarCantidad(idx, 1)} title="Aumentar">
                          <i className="fa-solid fa-plus"></i>
                        </button>
                      </div>
                      <button
                        type="button"
                        className="modal-pedido-btn-eliminar-prod"
                        onClick={() => handleEliminarProducto(idx)}
                        title="Eliminar producto"
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="modal-pedido-sin-productos">No hay productos en este pedido.</p>
            )}

            {/* FORMULARIO PARA AGREGAR PRODUCTO */}
            <div className="modal-pedido-agregar-producto-bar">
              <input
                type="text"
                placeholder="Nombre del nuevo producto..."
                value={nuevoProductoNombre}
                onChange={(e) => setNuevoProductoNombre(e.target.value)}
                className="modal-pedido-input"
                style={{ flex: 2 }}
              />
              <input
                type="text"
                placeholder="Precio ($)"
                value={nuevoProductoPrecio}
                onChange={(e) => setNuevoProductoPrecio(e.target.value)}
                className="modal-pedido-input"
                style={{ flex: 1 }}
              />
              <button
                type="button"
                className="admin-boton admin-boton-primario"
                onClick={handleAgregarProducto}
                style={{ padding: "8px 14px", fontSize: "13px" }}
              >
                <i className="fa-solid fa-plus"></i> Añadir
              </button>
            </div>
          </div>

          {/* PIE DEL MODAL CON ACCIONES */}
          <div className="modal-pedido-footer">
            <div className="modal-pedido-total-resumen">
              <span>Total a facturar:</span>
              <strong>{formData.total}</strong>
            </div>
            <div className="modal-pedido-botones-accion">
              <button
                type="button"
                className="admin-boton admin-boton-secundario"
                onClick={alCerrar}
                disabled={guardando}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="admin-boton admin-boton-primario"
                disabled={guardando}
              >
                {guardando ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin"></i> Guardando...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-floppy-disk"></i> Guardar Cambios
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalEditarPedido;
