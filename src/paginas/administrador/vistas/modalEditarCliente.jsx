// =============================================================================
// COMPONENTE: MODAL PARA VER Y EDITAR DATOS DEL CLIENTE
// -----------------------------------------------------------------------------
// Esta ventana emergente permite al administrador:
// 1. Modificar el nombre, correo electrónico y número de celular del cliente.
// 2. Actualizar la dirección y ciudad de entrega predeterminada.
// 3. Cambiar el estado de la cuenta (Activo / Inactivo).
// 4. Consultar métricas del cliente (fecha de registro, pedidos y total gastado).
// =============================================================================

import { useState } from "react";

function ModalEditarCliente({ cliente, alCerrar, alGuardar }) {
  // Estado local para manejar los datos del formulario de edición del cliente
  const [formData, setFormData] = useState({
    id: cliente.id,
    nombre: cliente.nombre || "",
    correo: cliente.correo || cliente.email || "",
    celular: cliente.celular || cliente.telefono || "",
    ciudad: cliente.ciudad || "",
    direccion: cliente.direccion || "",
    estado: cliente.estado || "activo",
    rol: cliente.rol || "cliente",
    fechaRegistro: cliente.fechaRegistro || "-",
    pedidos: cliente.pedidos || 0,
    totalGastado: cliente.totalGastado || "$ 0"
  });

  // Manejador para actualizar cualquier campo del formulario
  const handleChange = (campo, valor) => {
    setFormData((prev) => ({ ...prev, [campo]: valor }));
  };

  // Validación y envío de datos modificados
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nombre.trim() || !formData.correo.trim()) {
      alert("Por favor completa el nombre y el correo del cliente.");
      return;
    }
    alGuardar(formData);
  };

  const inicial = String(formData.nombre || "C").charAt(0).toUpperCase();

  return (
    <div className="admin-modal-overlay" onClick={alCerrar} style={{ backdropFilter: "blur(4px)", background: "rgba(15, 23, 42, 0.6)" }}>
      <div 
        className="admin-modal" 
        onClick={(e) => e.stopPropagation()} 
        style={{ maxWidth: "600px", width: "92%", borderRadius: "16px", overflow: "hidden", boxShadow: "0 20px 40px rgba(0,0,0,0.25)" }}
      >
        {/* CABECERA ESTÉTICA */}
        <div className="admin-modal-cabecera" style={{ background: "#f8fafc", padding: "18px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e2e8f0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "50%", background: "linear-gradient(135deg, #84b814 0%, #65900c 100%)", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", fontWeight: 700, boxShadow: "0 2px 8px rgba(132, 184, 20, 0.3)" }}>
              {inicial}
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: "17px", color: "#0f172a", fontWeight: 700 }}>
                Editar Perfil de Cliente
              </h3>
              <div style={{ display: "flex", gap: "8px", alignItems: "center", marginTop: "3px" }}>
                <span style={{ fontSize: "12px", color: "#64748b" }}>ID #{cliente.id}</span>
                <span className="admin-badge" style={{ fontSize: "11px", textTransform: "capitalize" }}>
                  {formData.estado}
                </span>
              </div>
            </div>
          </div>
          
          <button className="admin-boton-icono" onClick={alCerrar} title="Cerrar modal">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* CUERPO CON FORMULARIO */}
        <form onSubmit={handleSubmit} style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* TARJETA 1: DATOS PERSONALES */}
          <div style={{ background: "#fafbfc", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "16px" }}>
            <h4 style={{ margin: "0 0 12px 0", fontSize: "13px", color: "#475569", textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 700, display: "flex", alignItems: "center", gap: "7px" }}>
              <i className="fa-solid fa-user" style={{ color: "#84b814" }}></i> Información de Contacto
            </h4>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: "12px" }}>
              <div className="admin-form-grupo" style={{ margin: 0 }}>
                <label style={{ fontSize: "12px", color: "#475569", marginBottom: "4px" }}>Nombre Completo</label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => handleChange("nombre", e.target.value)}
                  placeholder="Ej: Laura Gómez"
                  required
                  style={{ borderRadius: "8px", padding: "8px 12px", fontSize: "13.5px" }}
                />
              </div>

              <div className="admin-form-grupo" style={{ margin: 0 }}>
                <label style={{ fontSize: "12px", color: "#475569", marginBottom: "4px" }}>Correo Electrónico</label>
                <input
                  type="email"
                  value={formData.correo}
                  onChange={(e) => handleChange("correo", e.target.value)}
                  placeholder="laura@ejemplo.com"
                  required
                  style={{ borderRadius: "8px", padding: "8px 12px", fontSize: "13.5px" }}
                />
              </div>

              <div className="admin-form-grupo" style={{ margin: 0 }}>
                <label style={{ fontSize: "12px", color: "#475569", marginBottom: "4px" }}>Teléfono / Celular</label>
                <input
                  type="text"
                  value={formData.celular}
                  onChange={(e) => handleChange("celular", e.target.value)}
                  placeholder="+57 300 123 4567"
                  style={{ borderRadius: "8px", padding: "8px 12px", fontSize: "13.5px" }}
                />
              </div>

              <div className="admin-form-grupo" style={{ margin: 0 }}>
                <label style={{ fontSize: "12px", color: "#475569", marginBottom: "4px" }}>Estado de la Cuenta</label>
                <select
                  value={formData.estado}
                  onChange={(e) => handleChange("estado", e.target.value)}
                  style={{ borderRadius: "8px", padding: "8px 12px", fontSize: "13.5px" }}
                >
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                  <option value="bloqueado">Bloqueado</option>
                </select>
              </div>
            </div>
          </div>

          {/* TARJETA 2: DIRECCIÓN Y ENVÍO */}
          <div style={{ background: "#fafbfc", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "16px" }}>
            <h4 style={{ margin: "0 0 12px 0", fontSize: "13px", color: "#475569", textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 700, display: "flex", alignItems: "center", gap: "7px" }}>
              <i className="fa-solid fa-location-dot" style={{ color: "#3b82f6" }}></i> Dirección de Entrega
            </h4>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: "12px" }}>
              <div className="admin-form-grupo" style={{ margin: 0 }}>
                <label style={{ fontSize: "12px", color: "#475569", marginBottom: "4px" }}>Ciudad</label>
                <input
                  type="text"
                  value={formData.ciudad}
                  onChange={(e) => handleChange("ciudad", e.target.value)}
                  placeholder="Ej: Bogotá, Medellín, Cali..."
                  style={{ borderRadius: "8px", padding: "8px 12px", fontSize: "13.5px" }}
                />
              </div>

              <div className="admin-form-grupo" style={{ margin: 0 }}>
                <label style={{ fontSize: "12px", color: "#475569", marginBottom: "4px" }}>Dirección Completa</label>
                <input
                  type="text"
                  value={formData.direccion}
                  onChange={(e) => handleChange("direccion", e.target.value)}
                  placeholder="Ej: Calle 123 # 45 - 67"
                  style={{ borderRadius: "8px", padding: "8px 12px", fontSize: "13.5px" }}
                />
              </div>
            </div>
          </div>

          {/* TARJETA 3: RESUMEN COMERCIAL */}
          <div style={{ background: "#ffffff", border: "1px dashed #cbd5e1", borderRadius: "12px", padding: "14px 18px", display: "flex", justifyContent: "space-around", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
            <div style={{ textAlign: "center" }}>
              <span style={{ fontSize: "11.5px", color: "#64748b", display: "block" }}>Pedidos Totales</span>
              <strong style={{ fontSize: "16px", color: "#0f172a" }}>{formData.pedidos} órdenes</strong>
            </div>
            <div style={{ width: "1px", height: "30px", background: "#e2e8f0" }}></div>
            <div style={{ textAlign: "center" }}>
              <span style={{ fontSize: "11.5px", color: "#64748b", display: "block" }}>Total Facturado</span>
              <strong style={{ fontSize: "16px", color: "#2563eb" }}>{formData.totalGastado}</strong>
            </div>
            <div style={{ width: "1px", height: "30px", background: "#e2e8f0" }}></div>
            <div style={{ textAlign: "center" }}>
              <span style={{ fontSize: "11.5px", color: "#64748b", display: "block" }}>Registrado Desde</span>
              <strong style={{ fontSize: "14px", color: "#475569" }}>{formData.fechaRegistro}</strong>
            </div>
          </div>

          {/* PIE CON BOTONES */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "8px" }}>
            <button type="button" className="admin-boton admin-boton-secundario" onClick={alCerrar}>
              <i className="fa-solid fa-xmark"></i> Cancelar
            </button>
            <button type="submit" className="admin-boton admin-boton-primario">
              <i className="fa-solid fa-floppy-disk"></i> Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalEditarCliente;
