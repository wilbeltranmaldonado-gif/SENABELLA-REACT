import { useState, useEffect } from "react";

function obtenerDatosReporte() {
  try {
    const pedidos = JSON.parse(localStorage.getItem("senabella_admin_orders") || "[]");
    const usuarios = JSON.parse(localStorage.getItem("senabella_usuarios") || "[]");
    const ingresos = pedidos.reduce((total, pedido) => total + (Number(String(pedido.total || "").replace(/[^\d]/g, "")) || 0), 0);
    const completados = pedidos.filter((pedido) => pedido.estado === "completado").length;
    return { pedidos, ingresos, completados, usuarios: usuarios.filter((usuario) => usuario.rol !== "administrador").length };
  } catch {
    return { pedidos: [], ingresos: 0, completados: 0, usuarios: 0 };
  }
}

function Reportes() {
  const [tipoReporte, setTipoReporte] = useState("ventas");
  const [datos, setDatos] = useState(obtenerDatosReporte);
  const [reporteGenerado, setReporteGenerado] = useState(null);

  useEffect(() => {
    const actualizarDatos = () => setDatos(obtenerDatosReporte());
    actualizarDatos();
    window.addEventListener("storage", actualizarDatos);
    return () => window.removeEventListener("storage", actualizarDatos);
  }, []);

  const promedio = datos.pedidos.length ? Math.round(datos.ingresos / datos.pedidos.length) : 0;
  const ventasMensuales = Array.from({ length: 6 }, (_, indice) => {
    const fecha = new Date();
    fecha.setMonth(fecha.getMonth() - (5 - indice));
    const clave = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, "0")}`;
    const total = datos.pedidos
      .filter((pedido) => String(pedido.fecha || "").includes(fecha.toLocaleString("es-CO", { month: "long" })))
      .reduce((suma, pedido) => suma + (Number(String(pedido.total || "").replace(/[^\d]/g, "")) || 0), 0);
    return { clave, nombre: fecha.toLocaleString("es-CO", { month: "short" }), total };
  });
  const maxVentaMensual = Math.max(...ventasMensuales.map((venta) => venta.total), 1);
  const estadisticas = [
    { titulo: "Ingresos totales", valor: `$ ${datos.ingresos.toLocaleString("es-CO")}`, icono: "fa-dollar-sign", color: "blue" },
    { titulo: "Pedidos completados", valor: String(datos.completados), icono: "fa-check-circle", color: "green" },
    { titulo: "Promedio por pedido", valor: `$ ${promedio.toLocaleString("es-CO")}`, icono: "fa-receipt", color: "purple" },
    { titulo: "Clientes registrados", valor: String(datos.usuarios), icono: "fa-users", color: "orange" },
  ];

  const generarReporte = () => {
    setReporteGenerado({ tipo: tipoReporte, fecha: new Date().toLocaleString("es-CO") });
  };

  const obtenerFilasReporte = () => {
    if (tipoReporte === "ventas") {
      return [["Ingresos totales", `$ ${datos.ingresos.toLocaleString("es-CO")}`], ["Promedio por pedido", `$ ${promedio.toLocaleString("es-CO")}`]];
    }
    if (tipoReporte === "productos") {
      const conteo = {};
      datos.pedidos.flatMap((pedido) => pedido.productos || []).forEach((producto) => {
        conteo[producto.nombre] = (conteo[producto.nombre] || 0) + (Number(producto.cantidad) || 1);
      });
      return Object.entries(conteo).map(([nombre, cantidad]) => [nombre, cantidad]);
    }
    return [["Pedidos totales", datos.pedidos.length], ["Pedidos completados", datos.completados], ["Clientes registrados", datos.usuarios]];
  };

  const descargarReporte = () => {
    const filas = obtenerFilasReporte();
    const contenido = [["Métrica", "Valor"], ...filas]
      .map((fila) => fila.map((celda) => `"${String(celda).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const enlace = document.createElement("a");
    enlace.href = URL.createObjectURL(new Blob([contenido], { type: "text/csv;charset=utf-8" }));
    enlace.download = `reporte-${tipoReporte}-${new Date().toISOString().slice(0, 10)}.csv`;
    enlace.click();
    URL.revokeObjectURL(enlace.href);
  };

  return (
    <div className="vista-reportes">
      <div className="admin-cabecera-vista">
        <h2 className="admin-seccion-titulo">Reportes y estadísticas</h2>
        <div className="admin-filtros">
          <select
            value={tipoReporte}
            onChange={(e) => setTipoReporte(e.target.value)}
            className="admin-select"
          >
            <option value="ventas">Ventas</option>
            <option value="productos">Productos</option>
            <option value="pedidos">Pedidos</option>
          </select>
          <button className="admin-boton admin-boton-primario" onClick={generarReporte}>
            <i className="fa-solid fa-file-circle-check"></i> Generar reporte
          </button>
          <button className="admin-boton" onClick={descargarReporte} title="Descargar CSV">
            <i className="fa-solid fa-download"></i> Descargar
          </button>
          <button className="admin-boton" onClick={() => window.print()} title="Imprimir reporte">
            <i className="fa-solid fa-print"></i> Imprimir
          </button>
        </div>
      </div>

      {reporteGenerado && <p className="admin-mensaje-exito">Reporte de {reporteGenerado.tipo} generado el {reporteGenerado.fecha}.</p>}

      {/* ESTADÍSTICAS */}
      <div className="admin-grid-estadisticas">
        {estadisticas.map((stat, index) => (
          <div key={index} className="admin-tarjeta-estadistica">
            <div className="admin-tarjeta-icono">
              <i className={`fa-solid ${stat.icono}`}></i>
            </div>
            <div className="admin-tarjeta-contenido">
              <h3>{stat.titulo}</h3>
              <p className="admin-tarjeta-valor">{stat.valor}</p>
            </div>
          </div>
        ))}
      </div>

      {/* GRÁFICA */}
      <div className="admin-seccion">
        <h3 className="admin-seccion-subtitulo">
          {tipoReporte === "ventas" ? "Ventas mensuales" : 
           tipoReporte === "productos" ? "Productos por categoría" : 
           "Pedidos por día de la semana"}
        </h3>
        <div className="admin-grafica-contenedor">
          <div style={{ display: "flex", alignItems: "end", gap: "16px", height: "260px", padding: "20px 12px" }}>
            {ventasMensuales.map((venta) => (
              <div key={venta.clave} style={{ flex: 1, height: "100%", display: "flex", flexDirection: "column", justifyContent: "end", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "12px", color: "#64748b" }}>${venta.total.toLocaleString("es-CO")}</span>
                <div title={`${venta.nombre}: $ ${venta.total.toLocaleString("es-CO")}`} style={{ width: "100%", maxWidth: "44px", height: `${Math.max((venta.total / maxVentaMensual) * 180, venta.total ? 12 : 4)}px`, background: "#3b82f6", borderRadius: "6px 6px 0 0", transition: "height .3s ease" }}></div>
                <strong style={{ fontSize: "12px", textTransform: "capitalize" }}>{venta.nombre}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TABLA RESUMEN */}
      <div className="admin-seccion">
        <h3 className="admin-seccion-subtitulo">Resumen de actividad</h3>
        <div className="admin-tabla-contenedor">
          <table className="admin-tabla">
            <thead>
              <tr>
                <th>Métrica</th>
                <th>Este mes</th>
                <th>Mes anterior</th>
                <th>Cambio</th>
              </tr>
            </thead>
            <tbody>
              {obtenerFilasReporte().map(([metrica, valor]) => (
                <tr key={metrica}>
                  <td>{metrica}</td>
                  <td>{valor}</td>
                  <td>-</td>
                  <td className="texto-success">Actual</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Reportes;