// =============================================================================
// VISTA: GESTIÓN DE CLIENTES
// -----------------------------------------------------------------------------
// Esta pantalla permite al administrador:
// 1. Ver el directorio completo de clientes registrados (usuarios sin rol de admin).
// 2. Consultar el total de pedidos realizados y monto gastado por cada cliente.
// 3. Ver y editar la información de contacto (nombre, email, teléfono, ciudad, dirección).
// 4. Buscar clientes por cualquier campo (nombre, correo, celular o ciudad).
// =============================================================================

import { useState, useEffect, useMemo } from "react";
import {
  obtenerUsuarios,
  actualizarUsuario,
} from "../../../utilidades/usuariosBd";
import ModalEditarCliente from "./modalEditarCliente";

function Clientes() {
  // --- ESTADOS DE LA VISTA DE CLIENTES ---
  const [busqueda, setBusqueda] = useState(""); // Texto para buscar clientes
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null); // Cliente para ver/editar en modal
  const [usuariosRaw, setUsuariosRaw] = useState([]); // Lista de usuarios crudos de la BD
  const [pedidosRaw, setPedidosRaw] = useState([]); // Lista de pedidos crudos de la BD

  /**
   * Carga los usuarios que no son administradores y los pedidos registrados.
   */
  const cargarDatos = () => {
    try {
      // Filtramos únicamente a los clientes (excluimos a los administradores)
      const u = obtenerUsuarios().filter(
        (usuario) => usuario.rol !== "administrador",
      );
      const p = JSON.parse(
        localStorage.getItem("senabella_admin_orders") || "[]",
      );
      setUsuariosRaw(u);
      setPedidosRaw(p);
    } catch {
      setUsuariosRaw([]);
      setPedidosRaw([]);
    }
  };

  // Escuchamos cambios en localStorage para actualizar los datos en tiempo real
  useEffect(() => {
    cargarDatos();
    window.addEventListener("storage", cargarDatos);
    window.addEventListener("senabella_orders_updated", cargarDatos);
    return () => {
      window.removeEventListener("storage", cargarDatos);
      window.removeEventListener("senabella_orders_updated", cargarDatos);
    };
  }, []);

  const clientes = useMemo(() => {
    return usuariosRaw.map((usuario) => {
      const emailUsuario = (
        usuario.correo ||
        usuario.email ||
        ""
      ).toLowerCase();
      const ordenes = pedidosRaw.filter((pedido) => {
        const emailPedido = (
          pedido.cliente?.email ||
          pedido.email ||
          ""
        ).toLowerCase();
        return emailPedido && emailPedido === emailUsuario;
      });

      const total = ordenes.reduce((suma, pedido) => {
        return (
          suma + (Number(String(pedido.total || "").replace(/[^\d]/g, "")) || 0)
        );
      }, 0);

      return {
        ...usuario,
        email: usuario.correo || usuario.email || "-",
        telefono: usuario.celular || usuario.telefono || "-",
        ciudad: usuario.ciudad || "No especificada",
        direccion: usuario.direccion || "No especificada",
        pedidos: ordenes.length,
        totalGastado: `$ ${total.toLocaleString("es-CO")}`,
      };
    });
  }, [usuariosRaw, pedidosRaw]);

  const clientesFiltrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return clientes;
    return clientes.filter(
      (cliente) =>
        String(cliente.nombre || "")
          .toLowerCase()
          .includes(q) ||
        String(cliente.email || "")
          .toLowerCase()
          .includes(q) ||
        String(cliente.telefono || "")
          .toLowerCase()
          .includes(q) ||
        String(cliente.ciudad || "")
          .toLowerCase()
          .includes(q) ||
        String(cliente.id || "")
          .toLowerCase()
          .includes(q),
    );
  }, [clientes, busqueda]);

  const guardarClienteEditado = (clienteActualizado) => {
    // 1. Actualizar usuario en la base de datos local
    actualizarUsuario(clienteActualizado.id, {
      nombre: clienteActualizado.nombre,
      correo: clienteActualizado.correo,
      celular: clienteActualizado.celular,
      ciudad: clienteActualizado.ciudad,
      direccion: clienteActualizado.direccion,
      estado: clienteActualizado.estado,
    });

    // 2. Sincronizar nombre/contacto en las órdenes de compra asociadas
    try {
      const pedidos = JSON.parse(
        localStorage.getItem("senabella_admin_orders") || "[]",
      );
      const emailAntiguo = (
        clienteSeleccionado?.email ||
        clienteSeleccionado?.correo ||
        ""
      ).toLowerCase();
      const pedidosActualizados = pedidos.map((p) => {
        const emailPed = (p.cliente?.email || p.email || "").toLowerCase();
        if (emailPed === emailAntiguo) {
          return {
            ...p,
            email: clienteActualizado.correo,
            cliente: {
              ...(typeof p.cliente === "object" ? p.cliente : {}),
              nombre: clienteActualizado.nombre,
              email: clienteActualizado.correo,
              telefono: clienteActualizado.celular,
              ciudad: clienteActualizado.ciudad,
              direccion: clienteActualizado.direccion,
            },
          };
        }
        return p;
      });
      localStorage.setItem(
        "senabella_admin_orders",
        JSON.stringify(pedidosActualizados),
      );
    } catch (e) {
      console.warn("Error al sincronizar órdenes con el cliente:", e);
    }

    // 3. Notificar y refrescar
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new Event("senabella_orders_updated"));
    cargarDatos();
    setClienteSeleccionado(null);

    if (window.SenabellaToast) {
      window.SenabellaToast(
        "Datos del cliente guardados con éxito",
        "fa-user-check",
        "exito",
      );
    }
  };

  return (
    <div className='vista-clientes'>
      {/* CABECERA */}
      <div className='admin-cabecera-vista'>
        <div>
          <h2 className='admin-seccion-titulo' style={{ margin: "0 0 4px 0" }}>
            Gestión de Clientes
          </h2>
          <span style={{ fontSize: "12px", color: "#64748b" }}>
            Directorio comercial, compras acumuladas y datos de contacto
          </span>
        </div>

        <div className='admin-filtros'>
          <input
            type='text'
            placeholder='Buscar por nombre, email o ciudad...'
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className='admin-input-busqueda'
            style={{ width: "260px" }}
          />
        </div>
      </div>

      {/* TABLA DE CLIENTES */}
      <div className='admin-tabla-contenedor'>
        <table className='admin-tabla'>
          <thead>
            <tr>
              <th style={{ width: "60px" }}>ID</th>
              <th>Cliente</th>
              <th>Correo Electrónico</th>
              <th>Teléfono</th>
              <th>Ciudad</th>
              <th style={{ textAlign: "center" }}>Pedidos</th>
              <th>Total Gastado</th>
              <th>Fecha Registro</th>
              <th style={{ width: "90px", textAlign: "center" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientesFiltrados.map((cliente) => (
              <tr key={cliente.id}>
                <td>
                  <strong>#{cliente.id}</strong>
                </td>
                <td>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <div
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #84b814, #65900c)",
                        color: "#ffffff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        fontSize: "12px",
                      }}
                    >
                      {String(cliente.nombre || "C")
                        .charAt(0)
                        .toUpperCase()}
                    </div>
                    <strong>{cliente.nombre}</strong>
                  </div>
                </td>
                <td>{cliente.email}</td>
                <td>{cliente.telefono}</td>
                <td>{cliente.ciudad}</td>
                <td style={{ textAlign: "center" }}>
                  <span
                    className='admin-badge'
                    style={{
                      fontSize: "11px",
                      background: "#eff6ff",
                      color: "#2563eb",
                      fontWeight: 700,
                    }}
                  >
                    {cliente.pedidos}{" "}
                    {cliente.pedidos === 1 ? "orden" : "órdenes"}
                  </span>
                </td>
                <td style={{ color: "#16a34a", fontWeight: 700 }}>
                  {cliente.totalGastado}
                </td>
                <td>{cliente.fechaRegistro || "-"}</td>
                <td>
                  <div
                    className='admin-acciones-tabla'
                    style={{ justifyContent: "center" }}
                  >
                    <button
                      className='admin-boton-icono'
                      title='Editar datos del cliente'
                      onClick={() => setClienteSeleccionado(cliente)}
                    >
                      <i className='fa-solid fa-pen-to-square'></i>
                    </button>
                    <button
                      className='admin-boton-icono'
                      title='Ver detalles comerciales'
                      onClick={() => setClienteSeleccionado(cliente)}
                    >
                      <i className='fa-solid fa-eye'></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {clientesFiltrados.length === 0 && (
        <div className='admin-vacio'>
          <i
            className='fa-solid fa-users'
            style={{ fontSize: "32px", color: "#94a3b8", marginBottom: "10px" }}
          ></i>
          <p>No se encontraron clientes registrados con ese criterio.</p>
        </div>
      )}

      {/* MODAL ESTÉTICO DE EDICIÓN DE CLIENTE */}
      {clienteSeleccionado && (
        <ModalEditarCliente
          cliente={clienteSeleccionado}
          alCerrar={() => setClienteSeleccionado(null)}
          alGuardar={guardarClienteEditado}
        />
      )}
    </div>
  );
}

export default Clientes;
