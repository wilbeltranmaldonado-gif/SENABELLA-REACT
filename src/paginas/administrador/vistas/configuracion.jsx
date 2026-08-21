// =============================================================================
// VISTA: CONFIGURACIÓN DEL SISTEMA
// -----------------------------------------------------------------------------
// Esta pantalla permite al administrador:
// 1. Modificar los datos generales de la tienda (Nombre comercial, correo, teléfono).
// 2. Definir moneda e idioma principal.
// 3. Activar o desactivar preferencias de notificaciones automáticas.
// 4. Guardar los cambios directamente en localStorage.
// =============================================================================

import { useState, useEffect } from "react";

function Configuracion() {
  // Estado que contiene todos los parámetros de configuración de la tienda
  const [configuracion, setConfiguracion] = useState({
    nombreTienda: "Senabella",
    email: "contacto@senabella.com",
    telefono: "+57 300 123 4567",
    moneda: "COP",
    idioma: "es",
    notificacionesEmail: true,
    notificacionesPedidos: true,
    notificacionesStock: true
  });

  // Estado para mostrar un mensaje temporal de "Guardado con éxito"
  const [guardado, setGuardado] = useState(false);

  // Carga la configuración guardada previamente en el navegador
  useEffect(() => {
    const configGuardada = localStorage.getItem("senabella_config");
    if (configGuardada) {
      setConfiguracion(JSON.parse(configGuardada));
    }
  }, []);

  // Controla los cambios en los campos de texto y casillas de verificación (checkbox)
  const manejarCambio = (e) => {
    const { name, value, type, checked } = e.target;
    setConfiguracion({
      ...configuracion,
      [name]: type === "checkbox" ? checked : value
    });
  };

  // Guarda la configuración actualizada en localStorage
  const guardarConfiguracion = (e) => {
    e.preventDefault();
    localStorage.setItem("senabella_config", JSON.stringify(configuracion));
    setGuardado(true);
    setTimeout(() => setGuardado(false), 3000);
  };

  return (
    <div className="vista-configuracion">
      <div className="admin-cabecera-vista">
        <h2 className="admin-seccion-titulo">Configuración del sistema</h2>
      </div>

      <form onSubmit={guardarConfiguracion} className="admin-configuracion-form">
        {/* INFORMACIÓN GENERAL */}
        <div className="admin-seccion">
          <h3 className="admin-seccion-subtitulo">Información general</h3>
          <div className="admin-form-grid">
            <div className="admin-form-grupo">
              <label>Nombre de la tienda</label>
              <input
                type="text"
                name="nombreTienda"
                value={configuracion.nombreTienda}
                onChange={manejarCambio}
              />
            </div>
            <div className="admin-form-grupo">
              <label>Email de contacto</label>
              <input
                type="email"
                name="email"
                value={configuracion.email}
                onChange={manejarCambio}
              />
            </div>
            <div className="admin-form-grupo">
              <label>Teléfono</label>
              <input
                type="text"
                name="telefono"
                value={configuracion.telefono}
                onChange={manejarCambio}
              />
            </div>
          </div>
        </div>

        {/* PREFERENCIAS */}
        <div className="admin-seccion">
          <h3 className="admin-seccion-subtitulo">Preferencias</h3>
          <div className="admin-form-grid">
            <div className="admin-form-grupo">
              <label>Moneda</label>
              <select
                name="moneda"
                value={configuracion.moneda}
                onChange={manejarCambio}
              >
                <option value="COP">Peso Colombiano (COP)</option>
                <option value="USD">Dólar Americano (USD)</option>
                <option value="EUR">Euro (EUR)</option>
              </select>
            </div>
            <div className="admin-form-grupo">
              <label>Idioma</label>
              <select
                name="idioma"
                value={configuracion.idioma}
                onChange={manejarCambio}
              >
                <option value="es">Español</option>
                <option value="en">English</option>
                <option value="pt">Português</option>
              </select>
            </div>
          </div>
        </div>

        {/* NOTIFICACIONES */}
        <div className="admin-seccion">
          <h3 className="admin-seccion-subtitulo">Notificaciones</h3>
          <div className="admin-form-checkboxes">
            <label className="admin-checkbox">
              <input
                type="checkbox"
                name="notificacionesEmail"
                checked={configuracion.notificacionesEmail}
                onChange={manejarCambio}
              />
              <span>Recibir notificaciones por email</span>
            </label>
            <label className="admin-checkbox">
              <input
                type="checkbox"
                name="notificacionesPedidos"
                checked={configuracion.notificacionesPedidos}
                onChange={manejarCambio}
              />
              <span>Notificaciones de nuevos pedidos</span>
            </label>
            <label className="admin-checkbox">
              <input
                type="checkbox"
                name="notificacionesStock"
                checked={configuracion.notificacionesStock}
                onChange={manejarCambio}
              />
              <span>Alertas de stock bajo</span>
            </label>
          </div>
        </div>

        {/* BOTONES DE ACCIÓN */}
        <div className="admin-configuracion-acciones">
          <button type="submit" className="admin-boton admin-boton-primario">
            <i className="fa-solid fa-save"></i> Guardar cambios
          </button>
          {guardado && (
            <span className="admin-guardado-exito">
              <i className="fa-solid fa-check"></i> Configuración guardada exitosamente
            </span>
          )}
        </div>
      </form>
    </div>
  );
}

export default Configuracion;