import { useState } from "react";

function Clientes() {
  const [clientes, setClientes] = useState([
    { id: 1, nombre: "María García", email: "maria@email.com", telefono: "+57 300 123 4567", pedidos: 12, totalGastado: "$1,450.00", fechaRegistro: "2024-01-15" },
    { id: 2, nombre: "Juan Rodríguez", email: "juan@email.com", telefono: "+57 310 234 5678", pedidos: 8, totalGastado: "$890.00", fechaRegistro: "2024-02-20" },
    { id: 3, nombre: "Ana Martínez", email: "ana@email.com", telefono: "+57 320 345 6789", pedidos: 15, totalGastado: "$2,100.00", fechaRegistro: "2024-01-10" },
    { id: 4, nombre: "Carlos López", email: "carlos@email.com", telefono: "+57 300 456 7890", pedidos: 5, totalGastado: "$450.00", fechaRegistro: "2024-03-05" },
  ]);

  const [busqueda, setBusqueda] = useState("");

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
                    <button className="admin-boton-icono" title="Ver detalles">
                      <i className="fa-solid fa-eye"></i>
                    </button>
                    <button className="admin-boton-icono" title="Editar">
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
    </div>
  );
}

export default Clientes;