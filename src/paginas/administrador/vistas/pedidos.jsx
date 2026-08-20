import { useEffect, useState } from "react";

function Pedidos() {
  const pedidosDemo = [
    { id: "#SN-10482", cliente: "María García", email: "maria@email.com", total: "$125.00", estado: "completado", fecha: "2024-08-19", items: 3 },
    { id: "#SN-10481", cliente: "Juan Rodríguez", email: "juan@email.com", total: "$89.50", estado: "procesando", fecha: "2024-08-19", items: 2 },
    { id: "#SN-10480", cliente: "Ana Martínez", email: "ana@email.com", total: "$234.00", estado: "pendiente", fecha: "2024-08-18", items: 5 },
    { id: "#SN-10479", cliente: "Carlos López", email: "carlos@email.com", total: "$56.00", estado: "completado", fecha: "2024-08-18", items: 1 },
    { id: "#SN-10478", cliente: "Laura Sánchez", email: "laura@email.com", total: "$178.00", estado: "enviado", fecha: "2024-08-17", items: 4 },
    { id: "#SN-10477", cliente: "Pedro González", email: "pedro@email.com", total: "$312.00", estado: "cancelado", fecha: "2024-08-17", items: 6 },
  ];
  const [pedidos, setPedidos] = useState(() => {
    try {
      const ordenes = JSON.parse(localStorage.getItem("senabella_admin_orders") || "[]");
      return ordenes.length ? ordenes : pedidosDemo;
    } catch {
      return pedidosDemo;
    }
  });

  useEffect(() => {
    const actualizarPedidos = () => {
      try {
        const ordenes = JSON.parse(localStorage.getItem("senabella_admin_orders") || "[]");
        if (ordenes.length) setPedidos(ordenes);
      } catch {
        // Conserva los datos mostrados si el almacenamiento está incompleto.
      }
    };
    window.addEventListener("storage", actualizarPedidos);
    return () => window.removeEventListener("storage", actualizarPedidos);
  }, []);

  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [busqueda, setBusqueda] = useState("");

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
    setPedidos(pedidos.map(pedido => 
      pedido.id === id ? { ...pedido, estado: nuevoEstado } : pedido
    ));
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
            {pedidosFiltrados.map((pedido, index) => (
              <tr key={index}>
                <td>{pedido.id || pedido.numero}</td>
                <td>{pedido.cliente?.nombre || pedido.cliente || "Cliente"}</td>
                <td>{pedido.email || pedido.cliente?.email || "-"}</td>
                <td>{pedido.total}</td>
                <td>{pedido.items}</td>
                <td>
                  <span className={`admin-badge ${obtenerClaseEstado(pedido.estado)}`}>
                    {pedido.estado}
                  </span>
                </td>
                <td>{pedido.fecha}</td>
                <td>
                  <div className="admin-acciones-tabla">
                    <button className="admin-boton-icono" title="Ver detalles">
                      <i className="fa-solid fa-eye"></i>
                    </button>
                    <select 
                      value={pedido.estado}
                      onChange={(e) => cambiarEstado(pedido.id, e.target.value)}
                      className="admin-select-estado"
                    >
                      <option value="pendiente">Pendiente</option>
                      <option value="procesando">Procesando</option>
                      <option value="enviado">Enviado</option>
                      <option value="completado">Completado</option>
                      <option value="cancelado">Cancelado</option>
                    </select>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pedidosFiltrados.length === 0 && (
        <div className="admin-vacio">
          <i className="fa-solid fa-inbox"></i>
          <p>No se encontraron pedidos</p>
        </div>
      )}
    </div>
  );
}

export default Pedidos;