import { useEffect, useState } from "react";
import { obtenerPedidosAdmin, pedidosDemo } from "../../../datos";
import ModalEditarPedido from "./modalEditarPedido";

function Pedidos() {
  const normalizarOrdenes = (ordenes) => ordenes.map((orden) => ({
    ...orden,
    estado: orden.estado === "pendiente-verificacion" ? "pendiente" : orden.estado
  }));

  const [pedidos, setPedidos] = useState(() => normalizarOrdenes(obtenerPedidosAdmin()));
  const [filtroEstado, setFiltroEstado] = useState("todos");
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

  const pedidosFiltrados = pedidos.filter(pedido => {
    const coincideEstado = filtroEstado === "todos" || pedido.estado === filtroEstado;
    const idPedido = String(pedido.id || pedido.numero || "");
    const coincideBusqueda = 
      String(pedido.cliente?.nombre || pedido.cliente || "").toLowerCase().includes(busqueda.toLowerCase()) ||
      idPedido.toLowerCase().includes(busqueda.toLowerCase()) ||
      String(pedido.email || pedido.cliente?.email || "").toLowerCase().includes(busqueda.toLowerCase());
    return coincideEstado && coincideBusqueda;
  });

  const cambiarEstado = (id, nuevoEstado) => {
    setPedidos((pedidosActuales) => {
      const base = pedidosActuales.length ? pedidosActuales : pedidosDemo;
      const pedidosActualizados = base.map((pedido) => {
        const identificador = pedido.id || pedido.numero;
        return identificador === id ? { ...pedido, estado: nuevoEstado } : pedido;
      });
      localStorage.setItem("senabella_admin_orders", JSON.stringify(pedidosActualizados));
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new Event("senabella_orders_updated"));
      return pedidosActualizados;
    });
  };

  const guardarPedidoEditado = (pedidoActualizado) => {
    const id = pedidoActualizado.id || pedidoActualizado.numero;
    setPedidos((pedidosActuales) => {
      const base = pedidosActuales.length ? pedidosActuales : pedidosDemo;
      const actualizados = base.map((p) => {
        const identificador = p.id || p.numero;
        return identificador === id ? pedidoActualizado : p;
      });
      localStorage.setItem("senabella_admin_orders", JSON.stringify(actualizados));
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new Event("senabella_orders_updated"));
      return actualizados;
    });
    setPedidoSeleccionado(null);
  };

  const handleEliminarPedido = (id) => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar el pedido ${id}? Esta acción no se puede deshacer.`)) {
      return;
    }
    setPedidos((pedidosActuales) => {
      const base = pedidosActuales.length ? pedidosActuales : pedidosDemo;
      const actualizados = base.filter((p) => {
        const identificador = p.id || p.numero;
        return identificador !== id;
      });
      localStorage.setItem("senabella_admin_orders", JSON.stringify(actualizados));
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new Event("senabella_orders_updated"));
      return actualizados;
    });
    setPedidoSeleccionado(null);
    if (window.SenabellaToast) {
      window.SenabellaToast(`Pedido ${id} eliminado correctamente`, "fa-trash-can", "exito");
    }
  };

  return (
    <div className="vista-pedidos">
      <div className="admin-cabecera-vista">
        <h2 className="admin-seccion-titulo">Gestión de pedidos</h2>
        <div className="admin-filtros">
          <select 
            value={filtroEstado} 
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="admin-select"
          >
            <option value="todos">Todos los estados</option>
            <option value="pendiente">Pendiente</option>
            <option value="procesando">Procesando</option>
            <option value="enviado">Enviado</option>
            <option value="completado">Completado</option>
            <option value="cancelado">Cancelado</option>
          </select>
          <input
            type="text"
            placeholder="Buscar por cliente, email o ID..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="admin-input-busqueda"
          />
        </div>
      </div>

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
                <td>{pedido.id || pedido.numero}</td>
                <td>{pedido.cliente?.nombre || pedido.cliente || "Cliente"}</td>
                <td>{pedido.email || pedido.cliente?.email || "-"}</td>
                <td>{pedido.total}</td>
                <td>{cantidadItems}</td>
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
        <div className="admin-vacio">
          <i className="fa-solid fa-inbox"></i>
          <p>No se encontraron pedidos</p>
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