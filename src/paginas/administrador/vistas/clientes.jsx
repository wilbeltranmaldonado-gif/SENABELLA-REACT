import { useMemo, useState } from "react";
import { obtenerUsuarios } from "../../../utils/usuariosBd";

function Clientes() {
  const [busqueda, setBusqueda] = useState("");
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const clientes = useMemo(() => {
    let usuarios = [];
    let pedidos = [];
    try {
      usuarios = obtenerUsuarios().filter((usuario) => usuario.rol !== "administrador");
      pedidos = JSON.parse(localStorage.getItem("senabella_admin_orders") || "[]");
    } catch { return []; }
    return usuarios.map((usuario) => {
      const ordenes = pedidos.filter((pedido) => pedido.cliente?.email === usuario.correo);
      const total = ordenes.reduce((suma, pedido) => suma + (Number(String(pedido.total || "").replace(/[^\d]/g, "")) || 0), 0);
      return { ...usuario, email: usuario.correo, telefono: usuario.celular || "-", pedidos: ordenes.length, totalGastado: `$ ${total.toLocaleString("es-CO")}` };
    });
  }, []);

  const clientesFiltrados = clientes.filter(cliente =>
    cliente.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    cliente.email.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="vista-clientes">
      <div className="admin-cabecera-vista">
        <h2 className="admin-seccion-titulo">Gestión de clientes</h2>
        <div className="admin-filtros">
          <input
            type="text"
            placeholder="Buscar clientes..."
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
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Pedidos</th>
              <th>Total gastado</th>
              <th>Fecha registro</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientesFiltrados.map((cliente) => (
              <tr key={cliente.id}>
                <td>{cliente.id}</td>
                <td>{cliente.nombre}</td>
                <td>{cliente.email}</td>
                <td>{cliente.telefono}</td>
                <td>{cliente.pedidos}</td>
                <td>{cliente.totalGastado}</td>
                <td>{cliente.fechaRegistro}</td>
                <td>
                  <div className="admin-acciones-tabla">
                    <button className="admin-boton-icono" title="Ver detalles" onClick={() => setClienteSeleccionado(cliente)}>
                      <i className="fa-solid fa-eye"></i>
                    </button>
                    <button className="admin-boton-icono" title="Editar" onClick={() => setClienteSeleccionado(cliente)}>
                      <i className="fa-solid fa-pen"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {clientesFiltrados.length === 0 && (
        <div className="admin-vacio">
          <i className="fa-solid fa-users"></i>
          <p>No se encontraron clientes</p>
        </div>
      )}
      {clienteSeleccionado && (
        <div className="admin-modal-overlay" onClick={() => setClienteSeleccionado(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-cabecera"><h3>Detalle del cliente</h3><button onClick={() => setClienteSeleccionado(null)}><i className="fa-solid fa-xmark"></i></button></div>
            <div className="admin-modal-cuerpo">
              <p><strong>Nombre:</strong> {clienteSeleccionado.nombre}</p>
              <p><strong>Email:</strong> {clienteSeleccionado.email}</p>
              <p><strong>Teléfono:</strong> {clienteSeleccionado.telefono}</p>
              <p><strong>Pedidos:</strong> {clienteSeleccionado.pedidos}</p>
              <p><strong>Total gastado:</strong> {clienteSeleccionado.totalGastado}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Clientes;