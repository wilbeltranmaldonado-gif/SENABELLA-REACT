// Esta vista lista y gestiona los pedidos recibidos por la tienda.

import { useEffect, useState, useMemo } from "react";
import { obtenerPedidosAdmin, pedidosDemo } from "../../../datos";
import ModalEditarPedido from "./modalEditarPedido";

function Pedidos() {
  const normalizarOrdenes = (ordenes) => ordenes.map((orden) => ({
    ...orden,
    estado: orden.estado === "pendiente-verificacion" ? "pendiente" : orden.estado
  }));

  const [pedidos, setPedidos] = useState(() => normalizarOrdenes(obtenerPedidosAdmin()));
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [filtroProducto, setFiltroProducto] = useState("todos");
  const [filtroMetodoPago, setFiltroMetodoPago] = useState("todos");
  const [busqueda, setBusqueda] = useState("");
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);

  useEffect(() => {
    const actualizarPedidos = () => {
      setPedidos(normalizarOrdenes(obtenerPedidosAdmin()));
    };
    actualizarPedidos();
    window.addEventListener("storage", actualizarPedidos);
    window.addEventListener("senabella_orders_updated", actualizarPedidos);
    return () => {
      window.removeEventListener("storage", actualizarPedidos);
      window.removeEventListener("senabella_orders_updated", actualizarPedidos);
    };
  }, []);

  const parsearPrecio = (texto) => parseFloat(String(texto || "").replace(/[^\d]/g, "")) || 0;

  // Lista de productos únicos presentes en los pedidos
  const listaProductosUnicos = useMemo(() => {
    const productosMap = new Map();
    pedidos.forEach((p) => {
      const prods = Array.isArray(p.productos) ? p.productos : [];
      prods.forEach((prod) => {
        const nombre = String(prod.nombre || "").trim();
        if (nombre) {
          const actual = productosMap.get(nombre) || 0;
          productosMap.set(nombre, actual + (parseInt(prod.cantidad, 10) || 1));
        }
      });
    });
    return Array.from(productosMap.entries()).sort((a, b) => b[1] - a[1]);
  }, [pedidos]);

  // Conteo por estado para los chips de filtro
  const conteoEstados = useMemo(() => {
    const conteo = { todos: pedidos.length, pendiente: 0, procesando: 0, enviado: 0, completado: 0, cancelado: 0 };
    pedidos.forEach((p) => {
      const est = p.estado;
      if (conteo[est] !== undefined) {
        conteo[est] += 1;
      }
    });
    return conteo;
  }, [pedidos]);

  // Filtrado reactivo integral
  const pedidosFiltrados = useMemo(() => {
    return pedidos.filter((pedido) => {
      // Filtro por Estado
      const coincideEstado = filtroEstado === "todos" || pedido.estado === filtroEstado;

      // Filtro por Producto
      let coincideProducto = true;
      if (filtroProducto !== "todos") {
        const prods = Array.isArray(pedido.productos) ? pedido.productos : [];
        coincideProducto = prods.some((p) => String(p.nombre || "").trim().toLowerCase() === filtroProducto.toLowerCase());
      }

      // Filtro por Método de Pago
      let coincideMetodo = true;
      if (filtroMetodoPago !== "todos") {
        const metodoStr = String(pedido.metodoPago || "").toLowerCase();
        coincideMetodo = metodoStr.includes(filtroMetodoPago.toLowerCase());
      }

      // Buscador
      const q = busqueda.trim().toLowerCase();
      let coincideBusqueda = true;
      if (q) {
        const idPedido = String(pedido.id || pedido.numero || "").toLowerCase();
        const clienteNom = String(pedido.cliente?.nombre || pedido.cliente || "").toLowerCase();
        const email = String(pedido.email || pedido.cliente?.email || "").toLowerCase();
        const ciudad = String(pedido.ciudad || pedido.cliente?.ciudad || "").toLowerCase();
        const prodsNombres = Array.isArray(pedido.productos)
          ? pedido.productos.map((p) => String(p.nombre || "").toLowerCase()).join(" ")
          : "";

        coincideBusqueda =
          idPedido.includes(q) ||
          clienteNom.includes(q) ||
          email.includes(q) ||
          ciudad.includes(q) ||
          prodsNombres.includes(q);
      }

      return coincideEstado && coincideProducto && coincideMetodo && coincideBusqueda;
    });
  }, [pedidos, filtroEstado, filtroProducto, filtroMetodoPago, busqueda]);

  // Métricas de los pedidos filtrados
  const totalFacturadoFiltrado = useMemo(() => {
    return pedidosFiltrados.reduce((total, p) => total + parsearPrecio(p.total), 0);
  }, [pedidosFiltrados]);

  const hayFiltrosActivos = filtroEstado !== "todos" || filtroProducto !== "todos" || filtroMetodoPago !== "todos" || busqueda.trim() !== "";

  const limpiarTodosLosFiltros = () => {
    setFiltroEstado("todos");
    setFiltroProducto("todos");
    setFiltroMetodoPago("todos");
    setBusqueda("");
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

  const cambiarEstado = (id, nuevoEstado) => {
    const base = pedidos.length ? pedidos : pedidosDemo;
    const pedidosActualizados = base.map((pedido) => {
      const identificador = pedido.id || pedido.numero;
      return identificador === id ? { ...pedido, estado: nuevoEstado } : pedido;
    });
    localStorage.setItem("senabella_admin_orders", JSON.stringify(pedidosActualizados));
    setPedidos(pedidosActualizados);
    setTimeout(() => {
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new Event("senabella_orders_updated"));
    }, 0);
  };

  const guardarPedidoEditado = (pedidoActualizado) => {
    const id = pedidoActualizado.id || pedidoActualizado.numero;
    const base = pedidos.length ? pedidos : pedidosDemo;
    const actualizados = base.map((p) => {
      const identificador = p.id || p.numero;
      return identificador === id ? pedidoActualizado : p;
    });
    localStorage.setItem("senabella_admin_orders", JSON.stringify(actualizados));
    setPedidos(actualizados);
    setPedidoSeleccionado(null);
    setTimeout(() => {
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new Event("senabella_orders_updated"));
    }, 0);
  };

  const handleEliminarPedido = (id) => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar el pedido ${id}? Esta acción no se puede deshacer.`)) {
      return;
    }
    const base = pedidos.length ? pedidos : pedidosDemo;
    const actualizados = base.filter((p) => {
      const identificador = p.id || p.numero;
      return identificador !== id;
    });
    localStorage.setItem("senabella_admin_orders", JSON.stringify(actualizados));
    setPedidos(actualizados);
    setPedidoSeleccionado(null);
    setTimeout(() => {
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new Event("senabella_orders_updated"));
    }, 0);
    if (window.SenabellaToast) {
      window.SenabellaToast(`Pedido ${id} eliminado correctamente`, "fa-trash-can", "exito");
    }
  };

  return (
    <div className="vista-pedidos">
      {/* CABECERA DE LA VISTA */}
      <div className="admin-cabecera-vista" style={{ marginBottom: "16px" }}>
        <div>
          <h2 className="admin-seccion-titulo" style={{ margin: "0 0 4px 0" }}>
            Gestión de Pedidos
          </h2>
          <span style={{ fontSize: "12px", color: "#64748b" }}>
            Control de envíos, cobros y detalles de transacciones
          </span>
        </div>

        {/* RESUMEN RÁPIDO */}
        <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
          <span className="admin-badge" style={{ padding: "6px 12px", fontSize: "12px", background: "#eff6ff", color: "#2563eb", fontWeight: 600 }}>
            <i className="fa-solid fa-receipt"></i> {pedidosFiltrados.length} pedidos
          </span>
          <span className="admin-badge" style={{ padding: "6px 12px", fontSize: "12px", background: "#f0fdf4", color: "#16a34a", fontWeight: 700 }}>
            $ {Math.round(totalFacturadoFiltrado).toLocaleString("es-CO")}
          </span>
        </div>
      </div>

      {/* TOOLBAR Y FILTROS ESTÉTICOS */}
      <div className="pedidos-toolbar-estetico">
        {/* FILTRO 1: CHIPS DE ESTADO */}
        <div className="pedidos-filtro-chips">
          <button
            className={`pedidos-chip-btn ${filtroEstado === "todos" ? "activo" : ""}`}
            onClick={() => setFiltroEstado("todos")}
          >
            <span>Todos</span>
            <span className="pedidos-chip-contador">{conteoEstados.todos}</span>
          </button>
          <button
            className={`pedidos-chip-btn ${filtroEstado === "pendiente" ? "activo" : ""}`}
            onClick={() => setFiltroEstado("pendiente")}
          >
            <i className="fa-solid fa-clock" style={{ color: "#eab308", fontSize: "11px" }}></i>
            <span>Pendientes</span>
            <span className="pedidos-chip-contador">{conteoEstados.pendiente}</span>
          </button>
          <button
            className={`pedidos-chip-btn ${filtroEstado === "procesando" ? "activo" : ""}`}
            onClick={() => setFiltroEstado("procesando")}
          >
            <i className="fa-solid fa-gear" style={{ color: "#3b82f6", fontSize: "11px" }}></i>
            <span>Procesando</span>
            <span className="pedidos-chip-contador">{conteoEstados.procesando}</span>
          </button>
          <button
            className={`pedidos-chip-btn ${filtroEstado === "enviado" ? "activo" : ""}`}
            onClick={() => setFiltroEstado("enviado")}
          >
            <i className="fa-solid fa-truck" style={{ color: "#a855f7", fontSize: "11px" }}></i>
            <span>Enviados</span>
            <span className="pedidos-chip-contador">{conteoEstados.enviado}</span>
          </button>
          <button
            className={`pedidos-chip-btn ${filtroEstado === "completado" ? "activo" : ""}`}
            onClick={() => setFiltroEstado("completado")}
          >
            <i className="fa-solid fa-circle-check" style={{ color: "#22c55e", fontSize: "11px" }}></i>
            <span>Completados</span>
            <span className="pedidos-chip-contador">{conteoEstados.completado}</span>
          </button>
          <button
            className={`pedidos-chip-btn ${filtroEstado === "cancelado" ? "activo" : ""}`}
            onClick={() => setFiltroEstado("cancelado")}
          >
            <i className="fa-solid fa-circle-xmark" style={{ color: "#ef4444", fontSize: "11px" }}></i>
            <span>Cancelados</span>
            <span className="pedidos-chip-contador">{conteoEstados.cancelado}</span>
          </button>
        </div>

        {/* FILTROS SECUNDARIOS: PRODUCTO, MÉTODO Y BÚSQUEDA */}
        <div className="pedidos-filtros-bar">
          {/* FILTRO POR PRODUCTO DEL CATÁLOGO */}
          <select
            value={filtroProducto}
            onChange={(e) => setFiltroProducto(e.target.value)}
            className="pedidos-select-estetico"
            title="Filtrar pedidos por producto"
          >
            <option value="todos">Todos los productos</option>
            {listaProductosUnicos.map(([nombreProd, cant]) => (
              <option key={nombreProd} value={nombreProd}>
                {nombreProd.length > 28 ? nombreProd.substring(0, 28) + "..." : nombreProd} ({cant} uds)
              </option>
            ))}
          </select>

          {/* FILTRO POR MÉTODO DE PAGO */}
          <select
            value={filtroMetodoPago}
            onChange={(e) => setFiltroMetodoPago(e.target.value)}
            className="pedidos-select-estetico"
            style={{ minWidth: "160px" }}
            title="Filtrar por método de pago"
          >
            <option value="todos">Todos los métodos</option>
            <option value="nequi">Nequi</option>
            <option value="banco">Bancolombia</option>
            <option value="daviplata">Daviplata</option>
            <option value="contraentrega">Pago Contra Entrega</option>
          </select>

          {/* BUSCADOR ESTÉTICO */}
          <div className="pedidos-search-wrap">
            <i className="fa-solid fa-magnifying-glass icono-lupa"></i>
            <input
              type="text"
              placeholder="Buscar por cliente, ID, email, ciudad o producto..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="pedidos-search-input"
            />
          </div>

          {/* BOTÓN LIMPIAR FILTROS */}
          {hayFiltrosActivos && (
            <button
              className="pedidos-btn-limpiar"
              onClick={limpiarTodosLosFiltros}
              title="Restablecer todos los filtros"
            >
              <i className="fa-solid fa-filter-circle-xmark"></i> Limpiar
            </button>
          )}
        </div>
      </div>

      {/* TABLA DE PEDIDOS */}
      <div className="admin-tabla-contenedor">
        <table className="admin-tabla">
          <thead>
            <tr>
              <th>ID Pedido</th>
              <th>Cliente</th>
              <th>Email</th>
              <th>Total</th>
              <th>Items</th>
              <th>Estado</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pedidosFiltrados.map((pedido, index) => {
              const identificador = pedido.id || pedido.numero;
              const cantidadItems = pedido.items || pedido.productos?.length || 0;
              return (
                <tr key={identificador || index}>
                  <td><strong>{pedido.id || pedido.numero}</strong></td>
                  <td>{pedido.cliente?.nombre || pedido.cliente || "Cliente"}</td>
                  <td>{pedido.email || pedido.cliente?.email || "-"}</td>
                  <td><strong>{pedido.total}</strong></td>
                  <td>
                    <span className="admin-badge" style={{ fontSize: "11px" }}>
                      {cantidadItems} {cantidadItems === 1 ? "artículo" : "artículos"}
                    </span>
                  </td>
                  <td>
                    <span className={`admin-badge ${obtenerClaseEstado(pedido.estado)}`}>
                      {pedido.estado}
                    </span>
                  </td>
                  <td>{pedido.fecha}</td>
                  <td>
                    <div className="admin-acciones-tabla">
                      <button
                        className="admin-boton-icono"
                        title="Ver y editar detalles del pedido"
                        onClick={() => setPedidoSeleccionado(pedido)}
                      >
                        <i className="fa-solid fa-eye"></i>
                      </button>
                      <select 
                        value={pedido.estado}
                        onChange={(e) => cambiarEstado(identificador, e.target.value)}
                        className="admin-select-estado"
                      >
                        <option value="pendiente">Pendiente</option>
                        <option value="procesando">Procesando</option>
                        <option value="enviado">Enviado</option>
                        <option value="completado">Completado</option>
                        <option value="cancelado">Cancelado</option>
                      </select>
                      <button
                        className="admin-boton-icono admin-boton-eliminar"
                        title="Eliminar pedido"
                        onClick={() => handleEliminarPedido(identificador)}
                      >
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {pedidosFiltrados.length === 0 && (
        <div className="admin-vacio" style={{ padding: "40px 20px" }}>
          <i className="fa-solid fa-inbox" style={{ fontSize: "36px", color: "#94a3b8", marginBottom: "12px" }}></i>
          <p style={{ margin: "0 0 12px 0", color: "#64748b", fontWeight: 500 }}>
            No se encontraron pedidos con los filtros aplicados.
          </p>
          {hayFiltrosActivos && (
            <button className="admin-boton" onClick={limpiarTodosLosFiltros}>
              <i className="fa-solid fa-filter-circle-xmark"></i> Restablecer filtros
            </button>
          )}
        </div>
      )}

      {/* MODAL MINIMALISTA Y EDITABLE DE DETALLES DEL PEDIDO */}
      {pedidoSeleccionado && (
        <ModalEditarPedido
          pedido={pedidoSeleccionado}
          alCerrar={() => setPedidoSeleccionado(null)}
          alGuardar={guardarPedidoEditado}
          alEliminar={handleEliminarPedido}
        />
      )}
    </div>
  );
}

export default Pedidos;