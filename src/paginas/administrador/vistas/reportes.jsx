// Esta vista presenta reportes y métricas clave del negocio.

import { useState, useEffect, useMemo } from "react";
import { obtenerPedidosAdmin } from "../../../datos";

function extraerMesDeFecha(fechaStr) {
  if (!fechaStr) return new Date().getMonth();
  const str = String(fechaStr).toLowerCase();

  // Buscar formato YYYY-MM o YYYY/MM
  const matchISO = str.match(/(\d{4})[-/](\d{1,2})/);
  if (matchISO) {
    const mesNum = parseInt(matchISO[2], 10) - 1;
    if (mesNum >= 0 && mesNum <= 11) return mesNum;
  }

  // Buscar nombres de meses en español
  const nombresMeses = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
  ];
  for (let i = 0; i < nombresMeses.length; i++) {
    if (str.includes(nombresMeses[i])) return i;
  }

  const d = new Date(fechaStr);
  if (!isNaN(d.getTime())) return d.getMonth();

  return new Date().getMonth();
}

function Reportes() {
  const [tipoReporte, setTipoReporte] = useState("ventas"); // "ventas", "productos", "pedidos", "clientes"
  const [periodo, setPeriodo] = useState("todos"); // "todos", "este_mes", "ultimos_30", "ultimos_7"
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [busqueda, setBusqueda] = useState("");
  const [reporteGeneradoInfo, setReporteGeneradoInfo] = useState(null);

  // Estados de datos
  const [pedidos, setPedidos] = useState(() => obtenerPedidosAdmin());
  const [usuarios, setUsuarios] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("senabella_usuarios") || "[]");
    } catch {
      return [];
    }
  });

  // Recargar datos reactivamente
  const recargarDatos = () => {
    setPedidos(obtenerPedidosAdmin());
    try {
      setUsuarios(JSON.parse(localStorage.getItem("senabella_usuarios") || "[]"));
    } catch {
      setUsuarios([]);
    }
  };

  useEffect(() => {
    recargarDatos();
    window.addEventListener("storage", recargarDatos);
    window.addEventListener("senabella_orders_updated", recargarDatos);
    return () => {
      window.removeEventListener("storage", recargarDatos);
      window.removeEventListener("senabella_orders_updated", recargarDatos);
    };
  }, []);

  const parsearPrecio = (texto) => parseFloat(String(texto || "").replace(/[^\d]/g, "")) || 0;
  const formatearMoneda = (val) => "$ " + Math.round(val || 0).toLocaleString("es-CO");

  // Filtrado de pedidos según período y estado
  const pedidosFiltrados = useMemo(() => {
    const ahora = new Date();
    return pedidos.filter((pedido) => {
      // Filtro de estado
      if (filtroEstado !== "todos") {
        const est = pedido.estado === "pendiente-verificacion" ? "pendiente" : pedido.estado;
        if (est !== filtroEstado) return false;
      }

      // Filtro de período
      if (periodo === "todos") return true;

      const mesIndex = extraerMesDeFecha(pedido.fecha);
      if (periodo === "este_mes") {
        return mesIndex === ahora.getMonth();
      }

      const fechaPedido = new Date(pedido.fecha);
      if (isNaN(fechaPedido.getTime())) return true;

      if (periodo === "ultimos_30") {
        const limite = new Date(ahora.getTime() - 30 * 24 * 60 * 60 * 1000);
        return fechaPedido >= limite;
      }
      if (periodo === "ultimos_7") {
        const limite = new Date(ahora.getTime() - 7 * 24 * 60 * 60 * 1000);
        return fechaPedido >= limite;
      }

      return true;
    });
  }, [pedidos, periodo, filtroEstado]);

  // Métricas de Ventas
  const totalIngresos = useMemo(() => {
    return pedidosFiltrados.reduce((acc, p) => acc + parsearPrecio(p.total), 0);
  }, [pedidosFiltrados]);

  const pedidosCompletadosCount = useMemo(() => {
    return pedidosFiltrados.filter((p) => p.estado === "completado").length;
  }, [pedidosFiltrados]);

  const ticketPromedio = useMemo(() => {
    return pedidosFiltrados.length > 0 ? Math.round(totalIngresos / pedidosFiltrados.length) : 0;
  }, [totalIngresos, pedidosFiltrados]);

  // Métricas de Productos
  const productosVendidosData = useMemo(() => {
    const conteo = {};
    pedidosFiltrados.forEach((pedido) => {
      const listaProds = Array.isArray(pedido.productos) ? pedido.productos : [];
      listaProds.forEach((prod) => {
        const nombre = prod.nombre || "Producto";
        const cantidad = Number(prod.cantidad) || 1;
        const precioUnitario = parsearPrecio(prod.precioText || prod.precio);
        const subtotal = precioUnitario * cantidad;
        const categoria = prod.categoria || "Catálogo";
        const img = prod.img || prod.imagen || "";

        if (!conteo[nombre]) {
          conteo[nombre] = {
            nombre,
            categoria,
            img,
            cantidad: 0,
            ingresos: 0,
            precioUnitario: precioUnitario || 0
          };
        }
        conteo[nombre].cantidad += cantidad;
        conteo[nombre].ingresos += subtotal;
        if (!conteo[nombre].precioUnitario && precioUnitario) {
          conteo[nombre].precioUnitario = precioUnitario;
        }
      });
    });

    return Object.values(conteo).sort((a, b) => b.ingresos - a.ingresos);
  }, [pedidosFiltrados]);

  const totalUnidadesVendidas = useMemo(() => {
    return productosVendidosData.reduce((acc, p) => acc + p.cantidad, 0);
  }, [productosVendidosData]);

  const productoEstrella = productosVendidosData[0] || null;

  // Métricas de Clientes
  const clientesData = useMemo(() => {
    const mapa = {};

    pedidosFiltrados.forEach((pedido) => {
      const clienteNombre = pedido.cliente?.nombre || pedido.cliente || "Cliente";
      const email = pedido.cliente?.email || pedido.email || "Sin email";
      const telefono = pedido.cliente?.telefono || pedido.telefono || "-";
      const ciudad = pedido.cliente?.ciudad || pedido.ciudad || "No especificada";
      const totalPedido = parsearPrecio(pedido.total);

      if (!mapa[email]) {
        mapa[email] = {
          nombre: clienteNombre,
          email,
          telefono,
          ciudad,
          totalCompras: 0,
          totalGastado: 0,
          ultimoPedidoFecha: pedido.fecha || "-"
        };
      }
      mapa[email].totalCompras += 1;
      mapa[email].totalGastado += totalPedido;
    });

    return Object.values(mapa).sort((a, b) => b.totalGastado - a.totalGastado);
  }, [pedidosFiltrados]);

  // Métricas de Estados de Pedidos
  const distribucionEstados = useMemo(() => {
    const estados = { completado: 0, procesando: 0, pendiente: 0, enviado: 0, cancelado: 0 };
    const valores = { completado: 0, procesando: 0, pendiente: 0, enviado: 0, cancelado: 0 };

    pedidosFiltrados.forEach((p) => {
      const estado = p.estado === "pendiente-verificacion" ? "pendiente" : p.estado || "pendiente";
      if (estados[estado] !== undefined) {
        estados[estado] += 1;
        valores[estado] += parsearPrecio(p.total);
      }
    });

    return { estados, valores };
  }, [pedidosFiltrados]);

  // Desglose por Método de Pago
  const desgloseMetodosPago = useMemo(() => {
    const mapa = {};
    pedidosFiltrados.forEach((p) => {
      let metodo = p.metodoPago || "Transferencia Bancaria";
      if (metodo.toLowerCase().includes("nequi")) metodo = "Nequi";
      else if (metodo.toLowerCase().includes("banco")) metodo = "Bancolombia";
      else if (metodo.toLowerCase().includes("daviplata")) metodo = "Daviplata";
      else if (metodo.toLowerCase().includes("contraentrega") || metodo.toLowerCase().includes("entrega")) metodo = "Pago Contra Entrega";

      const totalNum = parsearPrecio(p.total);
      if (!mapa[metodo]) {
        mapa[metodo] = { nombre: metodo, monto: 0, cantidad: 0 };
      }
      mapa[metodo].monto += totalNum;
      mapa[metodo].cantidad += 1;
    });

    return Object.values(mapa).sort((a, b) => b.monto - a.monto);
  }, [pedidosFiltrados]);

  // Desglose de Ingresos por Categoría
  const desgloseCategorias = useMemo(() => {
    const mapa = {};
    pedidosFiltrados.forEach((p) => {
      const prods = Array.isArray(p.productos) ? p.productos : [];
      prods.forEach((prod) => {
        const cat = prod.categoria || "Tecnología";
        const subtotal = parsearPrecio(prod.precioText || prod.precio) * (Number(prod.cantidad) || 1);
        if (!mapa[cat]) {
          mapa[cat] = { categoria: cat, monto: 0, unidades: 0 };
        }
        mapa[cat].monto += subtotal;
        mapa[cat].unidades += Number(prod.cantidad) || 1;
      });
    });

    return Object.values(mapa).sort((a, b) => b.monto - a.monto);
  }, [pedidosFiltrados]);

  // Métricas de ventas extremas
  const metricaMayorVenta = useMemo(() => {
    if (!pedidosFiltrados.length) return null;
    let max = pedidosFiltrados[0];
    let maxVal = parsearPrecio(max.total);
    pedidosFiltrados.forEach((p) => {
      const val = parsearPrecio(p.total);
      if (val > maxVal) {
        max = p;
        maxVal = val;
      }
    });
    return { ...max, valorNum: maxVal };
  }, [pedidosFiltrados]);

  const metricaMenorVenta = useMemo(() => {
    if (!pedidosFiltrados.length) return null;
    let min = pedidosFiltrados[0];
    let minVal = parsearPrecio(min.total);
    pedidosFiltrados.forEach((p) => {
      const val = parsearPrecio(p.total);
      if (val < minVal) {
        min = p;
        minVal = val;
      }
    });
    return { ...min, valorNum: minVal };
  }, [pedidosFiltrados]);

  const promedioItemsPorPedido = useMemo(() => {
    if (!pedidosFiltrados.length) return "0";
    const totalItems = pedidosFiltrados.reduce((acc, p) => acc + (p.items || p.productos?.length || 1), 0);
    return (totalItems / pedidosFiltrados.length).toFixed(1);
  }, [pedidosFiltrados]);

  const tasaEfectividad = useMemo(() => {
    if (!pedidosFiltrados.length) return "0%";
    const completados = pedidosFiltrados.filter((p) => p.estado === "completado").length;
    return ((completados / pedidosFiltrados.length) * 100).toFixed(0) + "%";
  }, [pedidosFiltrados]);

  // Generar Reporte
  const generarReporte = () => {
    recargarDatos();
    const fechaHora = new Date().toLocaleString("es-CO", {
      dateStyle: "medium",
      timeStyle: "short"
    });
    setReporteGeneradoInfo({
      tipo: tipoReporte.toUpperCase(),
      fecha: fechaHora,
      totalRegistros:
        tipoReporte === "productos"
          ? productosVendidosData.length
          : tipoReporte === "clientes"
          ? clientesData.length
          : pedidosFiltrados.length
    });
    if (window.SenabellaToast) {
      window.SenabellaToast("Reporte generado con datos actualizados", "fa-file-circle-check", "exito");
    }
  };

  // Descargar Reporte en CSV compatible con Excel
  const descargarReporteCSV = () => {
    let encabezados = [];
    let filas = [];

    if (tipoReporte === "ventas") {
      encabezados = ["ID Pedido", "Cliente", "Email", "Fecha", "Metodo de Pago", "Items", "Total", "Estado"];
      filas = pedidosFiltrados.map((p) => [
        p.id || p.numero,
        p.cliente?.nombre || p.cliente || "Cliente",
        p.cliente?.email || p.email || "-",
        p.fecha || "-",
        p.metodoPago || "-",
        p.items || p.productos?.length || 1,
        p.total || "$ 0",
        p.estado
      ]);
    } else if (tipoReporte === "productos") {
      encabezados = ["Producto", "Categoria", "Precio Unitario", "Unidades Vendidas", "Ingresos Totales", "% Participacion"];
      filas = productosVendidosData.map((p) => [
        p.nombre,
        p.categoria,
        formatearMoneda(p.precioUnitario),
        p.cantidad,
        formatearMoneda(p.ingresos),
        totalIngresos > 0 ? ((p.ingresos / totalIngresos) * 100).toFixed(1) + "%" : "0%"
      ]);
    } else if (tipoReporte === "pedidos") {
      encabezados = ["Estado", "Cantidad de Pedidos", "% del Total", "Monto Acumulado"];
      const totalPeds = pedidosFiltrados.length || 1;
      filas = Object.entries(distribucionEstados.estados).map(([estado, cant]) => [
        estado.toUpperCase(),
        cant,
        ((cant / totalPeds) * 100).toFixed(1) + "%",
        formatearMoneda(distribucionEstados.valores[estado])
      ]);
    } else if (tipoReporte === "clientes") {
      encabezados = ["Cliente", "Email", "Telefono", "Ciudad", "Total Pedidos", "Total Invertido", "Ultima Compra"];
      filas = clientesData.map((c) => [
        c.nombre,
        c.email,
        c.telefono,
        c.ciudad,
        c.totalCompras,
        formatearMoneda(c.totalGastado),
        c.ultimoPedidoFecha
      ]);
    }

    // Agregar BOM UTF-8 (\uFEFF) para abrir correctamente acentos en Excel
    const contenidoCSV = "\uFEFF" + [encabezados, ...filas]
      .map((fila) => fila.map((celda) => `"${String(celda).replace(/"/g, '""')}"`).join(";"))
      .join("\r\n");

    const blob = new Blob([contenidoCSV], { type: "text/csv;charset=utf-8;" });
    const enlace = document.createElement("a");
    enlace.href = URL.createObjectURL(blob);
    enlace.download = `Reporte_SENABELLA_${tipoReporte.toUpperCase()}_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(enlace);
    enlace.click();
    document.body.removeChild(enlace);
    URL.revokeObjectURL(enlace.href);

    if (window.SenabellaToast) {
      window.SenabellaToast("Archivo descargado correctamente", "fa-download", "exito");
    }
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
    <div className="vista-reportes">
      {/* CABECERA Y FILTROS */}
      <div className="admin-cabecera-vista">
        <div>
          <h2 className="admin-seccion-titulo" style={{ margin: "0 0 4px 0" }}>
            Reportes y Estadísticas
          </h2>
          <span style={{ fontSize: "12px", color: "#64748b" }}>
            Análisis de ventas, pedidos, catálogo y clientes
          </span>
        </div>

        <div className="admin-filtros">
          <select
            value={tipoReporte}
            onChange={(e) => setTipoReporte(e.target.value)}
            className="admin-select"
            title="Seleccionar tipo de reporte"
          >
            <option value="ventas">Reporte de Ventas</option>
            <option value="productos">Rendimiento de Productos</option>
            <option value="pedidos">Estados de Pedidos</option>
            <option value="clientes">Reporte de Clientes</option>
          </select>

          <select
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value)}
            className="admin-select"
            title="Seleccionar rango de tiempo"
          >
            <option value="todos">Todo el histórico</option>
            <option value="este_mes">Este mes</option>
            <option value="ultimos_30">Últimos 30 días</option>
            <option value="ultimos_7">Últimos 7 días</option>
          </select>

          {tipoReporte === "ventas" && (
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="admin-select"
              title="Filtrar por estado del pedido"
            >
              <option value="todos">Todos los estados</option>
              <option value="completado">Solo Completados</option>
              <option value="pendiente">Solo Pendientes</option>
              <option value="procesando">Solo Procesando</option>
              <option value="enviado">Solo Enviados</option>
              <option value="cancelado">Solo Cancelados</option>
            </select>
          )}

          <button className="admin-boton admin-boton-primario" onClick={generarReporte}>
            <i className="fa-solid fa-arrows-rotate"></i> Actualizar
          </button>
          <button className="admin-boton" onClick={descargarReporteCSV} title="Descargar reporte en formato Excel/CSV">
            <i className="fa-solid fa-file-excel"></i> Exportar CSV
          </button>
          <button className="admin-boton" onClick={() => window.print()} title="Imprimir o guardar PDF">
            <i className="fa-solid fa-print"></i> Imprimir
          </button>
        </div>
      </div>

      {/* NOTIFICACIÓN DE GENERACIÓN */}
      {reporteGeneradoInfo && (
        <div className="admin-mensaje-exito" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <span>
            <i className="fa-solid fa-circle-check"></i> Reporte de <strong>{reporteGeneradoInfo.tipo}</strong> actualizado el {reporteGeneradoInfo.fecha} ({reporteGeneradoInfo.totalRegistros} registros).
          </span>
          <button onClick={() => setReporteGeneradoInfo(null)} style={{ background: "none", border: "none", color: "inherit", cursor: "pointer" }}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
      )}

      {/* TARJETAS KPI PRINCIPALES */}
      <div className="admin-grid-estadisticas">
        <div className="admin-tarjeta-estadistica">
          <div className="admin-tarjeta-icono" style={{ backgroundColor: "#eff6ff", color: "#2563eb" }}>
            <i className="fa-solid fa-dollar-sign"></i>
          </div>
          <div className="admin-tarjeta-contenido">
            <h3>Ingresos Totales</h3>
            <p className="admin-tarjeta-valor">{formatearMoneda(totalIngresos)}</p>
            <p className="admin-tarjeta-cambio positivo">
              <i className="fa-solid fa-chart-line"></i> {pedidosFiltrados.length} transacciones
            </p>
          </div>
        </div>

        <div className="admin-tarjeta-estadistica">
          <div className="admin-tarjeta-icono" style={{ backgroundColor: "#f0fdf4", color: "#16a34a" }}>
            <i className="fa-solid fa-bag-shopping"></i>
          </div>
          <div className="admin-tarjeta-contenido">
            <h3>Pedidos Registrados</h3>
            <p className="admin-tarjeta-valor">{pedidosFiltrados.length}</p>
            <p className="admin-tarjeta-cambio positivo">
              <i className="fa-solid fa-check"></i> {pedidosCompletadosCount} completados
            </p>
          </div>
        </div>

        <div className="admin-tarjeta-estadistica">
          <div className="admin-tarjeta-icono" style={{ backgroundColor: "#faf5ff", color: "#9333ea" }}>
            <i className="fa-solid fa-receipt"></i>
          </div>
          <div className="admin-tarjeta-contenido">
            <h3>Ticket Promedio</h3>
            <p className="admin-tarjeta-valor">{formatearMoneda(ticketPromedio)}</p>
            <p className="admin-tarjeta-cambio positivo">
              <i className="fa-solid fa-arrow-trend-up"></i> Por orden
            </p>
          </div>
        </div>

        <div className="admin-tarjeta-estadistica">
          <div className="admin-tarjeta-icono" style={{ backgroundColor: "#fff7ed", color: "#ea580c" }}>
            <i className="fa-solid fa-cubes"></i>
          </div>
          <div className="admin-tarjeta-contenido">
            <h3>Unidades Vendidas</h3>
            <p className="admin-tarjeta-valor">{totalUnidadesVendidas}</p>
            <p className="admin-tarjeta-cambio positivo">
              <i className="fa-solid fa-star"></i> {productoEstrella ? productoEstrella.nombre.substring(0, 16) + "..." : "Sin ventas"}
            </p>
          </div>
        </div>
      </div>

      {/* TARJETA FUNCIONAL: CENTRO DE ANÁLISIS Y DESGLOSE FINANCIERO */}
      <div className="admin-seccion">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
          <div>
            <h3 className="admin-seccion-subtitulo" style={{ margin: "0 0 4px 0" }}>
              Panel de Rendimiento Financiero y Métodos de Pago
            </h3>
            <span style={{ fontSize: "12px", color: "#64748b" }}>
              Desglose detallado de captación de ingresos y métricas operativas
            </span>
          </div>

          <span className="admin-badge" style={{ backgroundColor: "#eff6ff", color: "#2563eb", fontWeight: 700 }}>
            {pedidosFiltrados.length} pedidos analizados
          </span>
        </div>

        {/* GRID DE ANÁLISIS EN 2 COLUMNAS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "16px" }}>
          {/* COLUMNA 1: DESGLOSE POR MÉTODO DE PAGO */}
          <div style={{ background: "#fafbfc", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "18px" }}>
            <h4 style={{ margin: "0 0 14px 0", fontSize: "14px", fontWeight: 700, color: "#0f172a", display: "flex", alignItems: "center", gap: "8px" }}>
              <i className="fa-solid fa-wallet" style={{ color: "#2563eb" }}></i> Distribución por Método de Pago
            </h4>
            
            {desgloseMetodosPago.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {desgloseMetodosPago.map((metodo, i) => {
                  const porcentaje = totalIngresos > 0 ? ((metodo.monto / totalIngresos) * 100).toFixed(1) : 0;
                  return (
                    <div key={i} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "13px" }}>
                        <span style={{ fontWeight: 600, color: "#1e293b" }}>{metodo.nombre}</span>
                        <span style={{ fontWeight: 700, color: "#2563eb" }}>{formatearMoneda(metodo.monto)} <small style={{ color: "#64748b", fontWeight: 500 }}>({metodo.cantidad} ped.)</small></span>
                      </div>
                      <div style={{ width: "100%", height: "7px", background: "#e2e8f0", borderRadius: "4px", overflow: "hidden" }}>
                        <div style={{ width: `${Math.min(porcentaje, 100)}%`, height: "100%", background: "#2563eb", borderRadius: "4px", transition: "width .3s ease" }}></div>
                      </div>
                      <span style={{ fontSize: "11px", color: "#64748b", textAlign: "right" }}>{porcentaje}% del total</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p style={{ fontSize: "13px", color: "#94a3b8", margin: 0 }}>No hay pagos registrados en este período.</p>
            )}
          </div>

          {/* COLUMNA 2: RENDIMIENTO Y RESUMEN OPERATIVO */}
          <div style={{ background: "#fafbfc", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "18px", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "14px" }}>
            <h4 style={{ margin: "0", fontSize: "14px", fontWeight: 700, color: "#0f172a", display: "flex", alignItems: "center", gap: "8px" }}>
              <i className="fa-solid fa-chart-pie" style={{ color: "#84b814" }}></i> Indicadores de Eficiencia Operativa
            </h4>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "12px" }}>
                <span style={{ fontSize: "11px", color: "#64748b", display: "block", textTransform: "uppercase", fontWeight: 600 }}>Mayor Facturación</span>
                <strong style={{ fontSize: "15px", color: "#16a34a", display: "block", marginTop: "2px" }}>
                  {metricaMayorVenta ? formatearMoneda(metricaMayorVenta.valorNum) : "$ 0"}
                </strong>
                <small style={{ fontSize: "11px", color: "#94a3b8" }}>{metricaMayorVenta ? metricaMayorVenta.id || metricaMayorVenta.numero : "-"}</small>
              </div>

              <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "12px" }}>
                <span style={{ fontSize: "11px", color: "#64748b", display: "block", textTransform: "uppercase", fontWeight: 600 }}>Menor Facturación</span>
                <strong style={{ fontSize: "15px", color: "#0f172a", display: "block", marginTop: "2px" }}>
                  {metricaMenorVenta ? formatearMoneda(metricaMenorVenta.valorNum) : "$ 0"}
                </strong>
                <small style={{ fontSize: "11px", color: "#94a3b8" }}>{metricaMenorVenta ? metricaMenorVenta.id || metricaMenorVenta.numero : "-"}</small>
              </div>

              <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "12px" }}>
                <span style={{ fontSize: "11px", color: "#64748b", display: "block", textTransform: "uppercase", fontWeight: 600 }}>Promedio Artículos</span>
                <strong style={{ fontSize: "15px", color: "#2563eb", display: "block", marginTop: "2px" }}>
                  {promedioItemsPorPedido} uds
                </strong>
                <small style={{ fontSize: "11px", color: "#94a3b8" }}>Por cada pedido</small>
              </div>

              <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "12px" }}>
                <span style={{ fontSize: "11px", color: "#64748b", display: "block", textTransform: "uppercase", fontWeight: 600 }}>Tasa de Éxito</span>
                <strong style={{ fontSize: "15px", color: "#84b814", display: "block", marginTop: "2px" }}>
                  {tasaEfectividad}
                </strong>
                <small style={{ fontSize: "11px", color: "#94a3b8" }}>Pedidos completados</small>
              </div>
            </div>

            {/* BARRA DE CATEGORÍAS */}
            {desgloseCategorias.length > 0 && (
              <div style={{ borderTop: "1px dashed #e2e8f0", paddingTop: "10px" }}>
                <span style={{ fontSize: "11.5px", color: "#64748b", fontWeight: 600, display: "block", marginBottom: "6px" }}>Ventas por Categoría principal:</span>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {desgloseCategorias.slice(0, 4).map((c, i) => (
                    <span key={i} className="admin-badge" style={{ fontSize: "11px" }}>
                      {c.categoria}: {formatearMoneda(c.monto)}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* TABLA DETALLADA SEGÚN EL REPORTE ACTIVO */}
      <div className="admin-seccion">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", flexWrap: "wrap", gap: "10px" }}>
          <h3 className="admin-seccion-subtitulo" style={{ margin: 0 }}>
            {tipoReporte === "ventas" && `Detalle de Ventas (${pedidosFiltrados.length})`}
            {tipoReporte === "productos" && `Desglose por Producto (${productosVendidosData.length})`}
            {tipoReporte === "pedidos" && "Resumen por Estado de Pedido"}
            {tipoReporte === "clientes" && `Cartera de Clientes (${clientesData.length})`}
          </h3>

          <input
            type="text"
            placeholder="Filtrar en esta tabla..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="admin-input-busqueda"
            style={{ width: "240px" }}
          />
        </div>

        <div className="admin-tabla-contenedor">
          {/* TABLA 1: REPORTE DE VENTAS */}
          {tipoReporte === "ventas" && (
            <table className="admin-tabla">
              <thead>
                <tr>
                  <th>ID Pedido</th>
                  <th>Cliente</th>
                  <th>Fecha</th>
                  <th>Método de Pago</th>
                  <th>Items</th>
                  <th>Total Facturado</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {pedidosFiltrados
                  .filter((p) => {
                    const q = busqueda.toLowerCase();
                    return (
                      String(p.id || p.numero).toLowerCase().includes(q) ||
                      String(p.cliente?.nombre || p.cliente || "").toLowerCase().includes(q) ||
                      String(p.estado || "").toLowerCase().includes(q)
                    );
                  })
                  .map((pedido, idx) => (
                    <tr key={pedido.id || idx}>
                      <td><strong>{pedido.id || pedido.numero}</strong></td>
                      <td>{pedido.cliente?.nombre || pedido.cliente || "Cliente"}</td>
                      <td>{pedido.fecha || "-"}</td>
                      <td>{pedido.metodoPago || "Transferencia"}</td>
                      <td>{pedido.items || pedido.productos?.length || 1} uds</td>
                      <td><strong>{pedido.total}</strong></td>
                      <td>
                        <span className={`admin-badge ${obtenerClaseEstado(pedido.estado)}`}>
                          {pedido.estado}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}

          {/* TABLA 2: REPORTE DE PRODUCTOS */}
          {tipoReporte === "productos" && (
            <table className="admin-tabla">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Categoría</th>
                  <th>Precio Unitario</th>
                  <th>Unidades Vendidas</th>
                  <th>Ingresos Totales</th>
                  <th>% Participación</th>
                </tr>
              </thead>
              <tbody>
                {productosVendidosData
                  .filter((p) => p.nombre.toLowerCase().includes(busqueda.toLowerCase()) || p.categoria.toLowerCase().includes(busqueda.toLowerCase()))
                  .map((prod, idx) => {
                    const participacion = totalIngresos > 0 ? ((prod.ingresos / totalIngresos) * 100).toFixed(1) : 0;
                    return (
                      <tr key={idx}>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            {prod.img ? (
                              <img src={prod.img} alt={prod.nombre} style={{ width: "32px", height: "32px", borderRadius: "6px", objectFit: "cover" }} />
                            ) : (
                              <i className="fa-solid fa-box" style={{ color: "#94a3b8" }}></i>
                            )}
                            <strong>{prod.nombre}</strong>
                          </div>
                        </td>
                        <td><span className="admin-badge">{prod.categoria}</span></td>
                        <td>{formatearMoneda(prod.precioUnitario)}</td>
                        <td><strong>{prod.cantidad}</strong> uds</td>
                        <td style={{ color: "#2563eb", fontWeight: 700 }}>{formatearMoneda(prod.ingresos)}</td>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <div style={{ width: "60px", height: "6px", background: "#e2e8f0", borderRadius: "3px", overflow: "hidden" }}>
                              <div style={{ width: `${Math.min(participacion, 100)}%`, height: "100%", background: "#84b814" }}></div>
                            </div>
                            <span style={{ fontSize: "12px" }}>{participacion}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          )}

          {/* TABLA 3: REPORTE DE PEDIDOS POR ESTADO */}
          {tipoReporte === "pedidos" && (
            <table className="admin-tabla">
              <thead>
                <tr>
                  <th>Estado del Pedido</th>
                  <th>Cantidad de Pedidos</th>
                  <th>% del Total</th>
                  <th>Monto Facturado Acumulado</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(distribucionEstados.estados).map(([estado, cant]) => {
                  const totalPeds = pedidosFiltrados.length || 1;
                  const porcentaje = ((cant / totalPeds) * 100).toFixed(1);
                  return (
                    <tr key={estado}>
                      <td>
                        <span className={`admin-badge ${obtenerClaseEstado(estado)}`} style={{ textTransform: "capitalize" }}>
                          {estado}
                        </span>
                      </td>
                      <td><strong>{cant}</strong> pedidos</td>
                      <td>{porcentaje}%</td>
                      <td><strong>{formatearMoneda(distribucionEstados.valores[estado])}</strong></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          {/* TABLA 4: REPORTE DE CLIENTES */}
          {tipoReporte === "clientes" && (
            <table className="admin-tabla">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Email</th>
                  <th>Teléfono</th>
                  <th>Ciudad</th>
                  <th>Total Pedidos</th>
                  <th>Total Invertido</th>
                  <th>Última Actividad</th>
                </tr>
              </thead>
              <tbody>
                {clientesData
                  .filter((c) => c.nombre.toLowerCase().includes(busqueda.toLowerCase()) || c.email.toLowerCase().includes(busqueda.toLowerCase()))
                  .map((cliente, idx) => (
                    <tr key={idx}>
                      <td><strong>{cliente.nombre}</strong></td>
                      <td>{cliente.email}</td>
                      <td>{cliente.telefono}</td>
                      <td>{cliente.ciudad}</td>
                      <td><strong>{cliente.totalCompras}</strong> pedidos</td>
                      <td style={{ color: "#16a34a", fontWeight: 700 }}>{formatearMoneda(cliente.totalGastado)}</td>
                      <td>{cliente.ultimoPedidoFecha}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default Reportes;