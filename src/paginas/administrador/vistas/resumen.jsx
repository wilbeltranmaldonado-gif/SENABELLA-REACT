import { useEffect, useRef, useState, useMemo } from "react";
import { productosIniciales, obtenerPedidosAdmin, pedidosDemo } from "../../../datos";
import ModalEditarPedido from "./modalEditarPedido";

function cargarDatosDashboard() {
  try {
    const pedidos = obtenerPedidosAdmin();
    const productos = JSON.parse(localStorage.getItem("senabella_admin_products") || "[]");
    const usuarios = JSON.parse(localStorage.getItem("senabella_usuarios") || "[]");
    const ventas = pedidos.reduce((total, pedido) => total + (Number(String(pedido.total || "").replace(/[^\d]/g, "")) || 0), 0);
    return {
      pedidos,
      ventas,
      productos: (Array.isArray(productos) ? productos.length : 0) + productosIniciales.length,
      clientes: Array.isArray(usuarios) ? usuarios.filter((usuario) => usuario.rol !== "administrador").length : 0,
      pedidosPendientes: pedidos.filter((pedido) => pedido.estado !== "completado").length
    };
  } catch {
    return { pedidos: obtenerPedidosAdmin(), ventas: 0, productos: 0, clientes: 0, pedidosPendientes: 0 };
  }
}

function Resumen() {
  const [datos, setDatos] = useState(() => cargarDatosDashboard());
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [criterioTopProductos, setCriterioTopProductos] = useState("unidades"); // "unidades" o "ingresos"
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const guardarPedidoEditado = (pedidoActualizado) => {
    const id = pedidoActualizado.id || pedidoActualizado.numero;
    const base = datos.pedidos.length ? datos.pedidos : pedidosDemo;
    const actualizados = base.map((p) => {
      const identificador = p.id || p.numero;
      return identificador === id ? pedidoActualizado : p;
    });
    localStorage.setItem("senabella_admin_orders", JSON.stringify(actualizados));
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new Event("senabella_orders_updated"));
    setPedidoSeleccionado(null);
  };

  useEffect(() => {
    const actualizarDatos = () => setDatos(cargarDatosDashboard());
    actualizarDatos();
    window.addEventListener("storage", actualizarDatos);
    window.addEventListener("senabella_orders_updated", actualizarDatos);
    // Cargar Chart.js dinámicamente
    const loadChartJS = async () => {
      if (typeof Chart === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.4/chart.umd.min.js';
        script.async = true;
        script.onload = inicializarGraficas;
        document.head.appendChild(script);
      } else {
        inicializarGraficas();
      }
    };

    const inicializarGraficas = () => {
      // Destruir gráfica existente si hay una
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current?.getContext('2d');
      if (!ctx) return;

      try {
        // Crear gráfica de ventas simplificada
        chartInstance.current = new Chart(ctx, {
          type: 'line',
          data: {
            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
            datasets: [{
              label: 'Ventas 2024',
              data: [12000, 19000, 15000, 25000, 22000, 30000, 28000, 35000, 32000, 38000, 42000, 45000],
              borderColor: '#3b82f6',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              tension: 0.4,
              fill: true,
              pointBackgroundColor: '#3b82f6',
              pointBorderColor: '#fff',
              pointBorderWidth: 2,
              pointRadius: 4,
              pointHoverRadius: 6
            }, {
              label: 'Ventas 2023',
              data: [8000, 12000, 10000, 18000, 15000, 22000, 20000, 25000, 23000, 28000, 32000, 35000],
              borderColor: '#94a3b8',
              backgroundColor: 'rgba(148, 163, 184, 0.1)',
              tension: 0.4,
              fill: true,
              pointBackgroundColor: '#94a3b8',
              pointBorderColor: '#fff',
              pointBorderWidth: 2,
              pointRadius: 4,
              pointHoverRadius: 6
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'top',
                labels: {
                  usePointStyle: true,
                  padding: 20
                }
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  callback: function(value) {
                    return '$' + value.toLocaleString();
                  }
                }
              }
            }
          }
        });
      } catch (error) {
        console.error('Error al crear la gráfica:', error);
      }
    };

    loadChartJS();

    return () => {
      window.removeEventListener("storage", actualizarDatos);
      window.removeEventListener("senabella_orders_updated", actualizarDatos);
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  // Datos de ejemplo para las tarjetas
  const estadisticas = [
    {
      titulo: "Ventas totales",
      valor: `$ ${datos.ventas.toLocaleString("es-CO")}`,
      cambio: `${datos.pedidos.length} pedidos`,
      positivo: true,
      icono: "fa-dollar-sign",
      color: "blue"
    },
    {
      titulo: "Pedidos",
      valor: String(datos.pedidos.length),
      cambio: `${datos.pedidosPendientes} pendientes`,
      positivo: true,
      icono: "fa-cart-shopping",
      color: "green"
    },
    {
      titulo: "Clientes",
      valor: String(datos.clientes),
      cambio: "cuentas registradas",
      positivo: true,
      icono: "fa-users",
      color: "purple"
    },
    {
      titulo: "Productos",
      valor: String(datos.productos),
      cambio: "en catálogo",
      positivo: false,
      icono: "fa-box",
      color: "orange"
    }
  ];

  // Relacionar todos aquellos pedidos que aún no se hayan completado
  const pedidosNoCompletados = datos.pedidos
    .filter((pedido) => pedido.estado !== "completado")
    .map((pedido) => ({
      ...pedido,
      id: pedido.id || pedido.numero,
      clienteNombre: pedido.cliente?.nombre || pedido.cliente || "Cliente",
      email: pedido.cliente?.email || pedido.email || "-",
      total: pedido.total,
      estado: pedido.estado === "pendiente-verificacion" ? "pendiente" : pedido.estado,
      fecha: pedido.fecha
    }));

  // ==========================================
  // CÁLCULO DINÁMICO DE PRODUCTOS MÁS VENDIDOS
  // ==========================================
  const [vistaModoProductos, setVistaModoProductos] = useState("tabla"); // "tabla" o "tarjetas"
  const [busquedaProducto, setBusquedaProducto] = useState("");

  const todosProductosVendidos = useMemo(() => {
    const conteo = {};

    datos.pedidos.forEach((pedido) => {
      const listaProds = Array.isArray(pedido.productos) ? pedido.productos : [];
      listaProds.forEach((item) => {
        const nombre = item.nombre || "Producto";
        const cantidad = Number(item.cantidad) || 1;
        const precioUnitario = Number(String(item.precioText || item.precio || "0").replace(/[^\d]/g, "")) || 0;
        const imagen = item.img || item.imagen || "";
        const categoria = item.categoria || "Catálogo";

        if (!conteo[nombre]) {
          conteo[nombre] = {
            nombre,
            ventas: 0,
            ingresos: 0,
            precioUnitario: precioUnitario || 0,
            imagen,
            categoria,
            pedidosAsociados: []
          };
        }

        conteo[nombre].ventas += cantidad;
        conteo[nombre].ingresos += precioUnitario * cantidad;
        if (!conteo[nombre].precioUnitario && precioUnitario) {
          conteo[nombre].precioUnitario = precioUnitario;
        }
        conteo[nombre].pedidosAsociados.push({
          pedidoId: pedido.id || pedido.numero,
          cliente: pedido.cliente?.nombre || pedido.cliente || "Cliente",
          fecha: pedido.fecha,
          cantidad
        });
        if (!conteo[nombre].imagen && imagen) {
          conteo[nombre].imagen = imagen;
        }
      });
    });

    const lista = Object.values(conteo);

    if (criterioTopProductos === "ingresos") {
      lista.sort((a, b) => b.ingresos - a.ingresos);
    } else {
      lista.sort((a, b) => b.ventas - a.ventas);
    }

    return lista;
  }, [datos.pedidos, criterioTopProductos]);

  const productosMasVendidosFiltrados = useMemo(() => {
    if (!busquedaProducto.trim()) return todosProductosVendidos;
    const query = busquedaProducto.toLowerCase();
    return todosProductosVendidos.filter(
      (p) => p.nombre.toLowerCase().includes(query) || p.categoria.toLowerCase().includes(query)
    );
  }, [todosProductosVendidos, busquedaProducto]);

  const maximoMetrica = useMemo(() => {
    if (!todosProductosVendidos.length) return 1;
    return criterioTopProductos === "ingresos"
      ? Math.max(...todosProductosVendidos.map((p) => p.ingresos), 1)
      : Math.max(...todosProductosVendidos.map((p) => p.ventas), 1);
  }, [todosProductosVendidos, criterioTopProductos]);

  const totalUnidadesVendidas = useMemo(() => {
    return todosProductosVendidos.reduce((total, p) => total + p.ventas, 0);
  }, [todosProductosVendidos]);

  const obtenerClaseEstado = (estado) => {
    const clases = {
      completado: "estado-exito",
      procesando: "estado-info",
      pendiente: "estado-advertencia",
      "pendiente-verificacion": "estado-advertencia",
      enviado: "estado-primario",
      cancelado: "estado-error"
    };
    return clases[estado] || "";
  };

  return (
    <div className="vista-resumen">
      {/* ==========================================
           TARJETAS DE ESTADÍSTICAS
      ========================================== */}
      <div className="admin-grid-estadisticas">
        {estadisticas.map((stat, index) => (
          <div key={index} className="admin-tarjeta-estadistica">
            <div className="admin-tarjeta-icono">
              <i className={`fa-solid ${stat.icono}`}></i>
            </div>
            <div className="admin-tarjeta-contenido">
              <h3>{stat.titulo}</h3>
              <p className="admin-tarjeta-valor">{stat.valor}</p>
              <p className={`admin-tarjeta-cambio ${stat.positivo ? "positivo" : "negativo"}`}>
                <i className={`fa-solid ${stat.positivo ? "fa-arrow-up" : "fa-arrow-down"}`}></i>
                {stat.cambio}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ==========================================
           PEDIDOS RECIENTES (NO COMPLETADOS)
      ========================================== */}
      <div className="admin-seccion">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "8px" }}>
          <h2 className="admin-seccion-titulo" style={{ margin: 0 }}>
            Pedidos recientes por completar
          </h2>
          <span style={{ fontSize: "13px", color: "#64748b", fontWeight: "500" }}>
            {pedidosNoCompletados.length} {pedidosNoCompletados.length === 1 ? "pedido pendiente" : "pedidos pendientes"}
          </span>
        </div>

        <div className="admin-tabla-contenedor">
          <table className="admin-tabla">
            <thead>
              <tr>
                <th>ID Pedido</th>
                <th>Cliente</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pedidosNoCompletados.length > 0 ? (
                pedidosNoCompletados.map((pedido, index) => (
                  <tr key={pedido.id || index}>
                    <td>{pedido.id}</td>
                    <td>{pedido.clienteNombre}</td>
                    <td>{pedido.total}</td>
                    <td>
                      <span className={`admin-badge ${obtenerClaseEstado(pedido.estado)}`}>
                        {pedido.estado}
                      </span>
                    </td>
                    <td>{pedido.fecha}</td>
                    <td>
                      <button
                        className="admin-boton-icono"
                        title="Ver detalles"
                        onClick={() => setPedidoSeleccionado(pedido)}
                      >
                        <i className="fa-solid fa-eye"></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "24px", color: "#64748b" }}>
                    No hay pedidos pendientes por completar actualmente.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL MINIMALISTA Y EDITABLE DE DETALLES DEL PEDIDO */}
      {pedidoSeleccionado && (
        <ModalEditarPedido
          pedido={pedidoSeleccionado}
          alCerrar={() => setPedidoSeleccionado(null)}
          alGuardar={guardarPedidoEditado}
        />
      )}

      {/* ==========================================
           RELACIÓN DE PRODUCTOS MÁS VENDIDOS
      ========================================== */}
      <div className="admin-seccion">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <h2 className="admin-seccion-titulo" style={{ margin: "0 0 4px 0" }}>
              Relación de productos más vendidos
            </h2>
            <span style={{ fontSize: "12px", color: "#64748b" }}>
              {todosProductosVendidos.length} productos registrados con ventas ({totalUnidadesVendidas} unidades en total)
            </span>
          </div>

          <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
            <input
              type="text"
              placeholder="Buscar en relación..."
              value={busquedaProducto}
              onChange={(e) => setBusquedaProducto(e.target.value)}
              className="admin-input-busqueda"
              style={{ width: "190px", padding: "6px 12px", fontSize: "13px" }}
            />

            <div style={{ display: "flex", background: "#f1f5f9", borderRadius: "8px", padding: "2px", border: "1px solid #e2e8f0" }}>
              <button
                className={`admin-boton ${criterioTopProductos === "unidades" ? "admin-boton-primario" : ""}`}
                style={{ padding: "5px 10px", fontSize: "12px", borderRadius: "6px", border: 0 }}
                onClick={() => setCriterioTopProductos("unidades")}
                title="Ordenar por unidades vendidas"
              >
                <i className="fa-solid fa-boxes-stacked"></i> Unidades
              </button>
              <button
                className={`admin-boton ${criterioTopProductos === "ingresos" ? "admin-boton-primario" : ""}`}
                style={{ padding: "5px 10px", fontSize: "12px", borderRadius: "6px", border: 0 }}
                onClick={() => setCriterioTopProductos("ingresos")}
                title="Ordenar por ingresos recaudados"
              >
                <i className="fa-solid fa-dollar-sign"></i> Ingresos
              </button>
            </div>

            <div style={{ display: "flex", background: "#f1f5f9", borderRadius: "8px", padding: "2px", border: "1px solid #e2e8f0" }}>
              <button
                className={`admin-boton ${vistaModoProductos === "tabla" ? "admin-boton-primario" : ""}`}
                style={{ padding: "5px 10px", fontSize: "12px", borderRadius: "6px", border: 0 }}
                onClick={() => setVistaModoProductos("tabla")}
                title="Vista de Relación (Tabla)"
              >
                <i className="fa-solid fa-table-list"></i> Tabla
              </button>
              <button
                className={`admin-boton ${vistaModoProductos === "tarjetas" ? "admin-boton-primario" : ""}`}
                style={{ padding: "5px 10px", fontSize: "12px", borderRadius: "6px", border: 0 }}
                onClick={() => setVistaModoProductos("tarjetas")}
                title="Vista de Tarjetas"
              >
                <i className="fa-solid fa-grip"></i> Tarjetas
              </button>
            </div>
          </div>
        </div>

        {/* MODO TABLA (RELACIÓN FORMAL) */}
        {vistaModoProductos === "tabla" ? (
          <div className="admin-tabla-contenedor">
            <table className="admin-tabla">
              <thead>
                <tr>
                  <th style={{ width: "60px", textAlign: "center" }}>Pos.</th>
                  <th>Producto</th>
                  <th>Categoría</th>
                  <th style={{ textAlign: "center" }}>Uds. Vendidas</th>
                  <th>Precio Ref.</th>
                  <th>Total Recaudado</th>
                  <th style={{ minWidth: "140px" }}>Participación</th>
                  <th style={{ width: "90px", textAlign: "center" }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productosMasVendidosFiltrados.length > 0 ? (
                  productosMasVendidosFiltrados.map((prod, index) => {
                    const valorActual = criterioTopProductos === "ingresos" ? prod.ingresos : prod.ventas;
                    const porcentaje = Math.round((valorActual / maximoMetrica) * 100);
                    const rankClase = index === 0 ? "rank-1" : index === 1 ? "rank-2" : index === 2 ? "rank-3" : "";

                    return (
                      <tr key={prod.nombre}>
                        <td style={{ textAlign: "center" }}>
                          <span className={`admin-producto-top-rank ${rankClase}`} style={{ position: "static", display: "inline-block" }}>
                            #{index + 1}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <div className="admin-producto-top-img-wrap" style={{ width: "40px", height: "40px", borderRadius: "8px" }}>
                              {prod.imagen ? (
                                <img
                                  src={prod.imagen}
                                  alt={prod.nombre}
                                  onError={(e) => {
                                    e.target.style.display = "none";
                                    if (e.target.parentElement) {
                                      e.target.parentElement.innerHTML = `<i class="fa-solid fa-box" style="color: #94a3b8; font-size: 16px;"></i>`;
                                    }
                                  }}
                                />
                              ) : (
                                <i className="fa-solid fa-box" style={{ color: "#94a3b8", fontSize: "16px" }}></i>
                              )}
                            </div>
                            <strong style={{ fontSize: "13px", color: "#1e293b" }}>{prod.nombre}</strong>
                          </div>
                        </td>
                        <td>
                          <span className="admin-producto-top-categoria">{prod.categoria}</span>
                        </td>
                        <td style={{ textAlign: "center", fontWeight: "700" }}>
                          <span style={{ background: "#e0f2fe", color: "#0369a1", padding: "3px 10px", borderRadius: "12px", fontSize: "12px" }}>
                            {prod.ventas} {prod.ventas === 1 ? "ud." : "uds."}
                          </span>
                        </td>
                        <td style={{ color: "#64748b", fontSize: "13px" }}>
                          {prod.precioUnitario ? `$ ${prod.precioUnitario.toLocaleString("es-CO")}` : "-"}
                        </td>
                        <td style={{ fontWeight: "700", color: "#2563eb" }}>
                          ${prod.ingresos.toLocaleString("es-CO")}
                        </td>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <div className="admin-producto-top-barra" style={{ height: "6px", flex: 1, margin: 0 }}>
                              <div
                                className="admin-producto-top-barra-progreso"
                                style={{ width: `${Math.max(porcentaje, 6)}%` }}
                              ></div>
                            </div>
                            <span style={{ fontSize: "11px", color: "#64748b", width: "32px", textAlign: "right" }}>{porcentaje}%</span>
                          </div>
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <button
                            className="admin-boton-icono"
                            title="Ver detalles del producto"
                            onClick={() => setProductoSeleccionado(prod)}
                          >
                            <i className="fa-solid fa-eye"></i>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="8" style={{ textAlign: "center", padding: "24px", color: "#64748b" }}>
                      No se encontraron productos en la relación.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          /* MODO TARJETAS */
          <div className="admin-grid-productos-top">
            {productosMasVendidosFiltrados.map((prod, index) => {
              const valorActual = criterioTopProductos === "ingresos" ? prod.ingresos : prod.ventas;
              const porcentaje = Math.round((valorActual / maximoMetrica) * 100);
              const rankClase = index === 0 ? "rank-1" : index === 1 ? "rank-2" : index === 2 ? "rank-3" : "";

              return (
                <div
                  key={prod.nombre}
                  className="admin-producto-top-card"
                  onClick={() => setProductoSeleccionado(prod)}
                  title="Haz clic para ver detalles del producto"
                >
                  <span className={`admin-producto-top-rank ${rankClase}`}>
                    #{index + 1}
                  </span>

                  <div className="admin-producto-top-header">
                    <div className="admin-producto-top-img-wrap">
                      {prod.imagen ? (
                        <img
                          src={prod.imagen}
                          alt={prod.nombre}
                          onError={(e) => {
                            e.target.style.display = "none";
                            if (e.target.parentElement) {
                              e.target.parentElement.innerHTML = `<i class="fa-solid fa-box" style="color: #94a3b8; font-size: 24px;"></i>`;
                            }
                          }}
                        />
                      ) : (
                        <i className="fa-solid fa-box" style={{ color: "#94a3b8", fontSize: "24px" }}></i>
                      )}
                    </div>
                    <div className="admin-producto-top-info">
                      <h4 className="admin-producto-top-nombre" title={prod.nombre}>
                        {prod.nombre}
                      </h4>
                      <span className="admin-producto-top-categoria">
                        {prod.categoria}
                      </span>
                    </div>
                  </div>

                  <div className="admin-producto-top-metricas">
                    <div className="admin-producto-top-metrica-item">
                      <span className="admin-producto-top-metrica-etiqueta">Unidades vendidas</span>
                      <span className="admin-producto-top-metrica-valor">
                        {prod.ventas} {prod.ventas === 1 ? "unidad" : "unidades"}
                      </span>
                    </div>
                    <div className="admin-producto-top-metrica-item" style={{ textAlign: "right" }}>
                      <span className="admin-producto-top-metrica-etiqueta">Total recaudado</span>
                      <span className="admin-producto-top-metrica-valor" style={{ color: "#2563eb" }}>
                        ${prod.ingresos.toLocaleString("es-CO")}
                      </span>
                    </div>
                  </div>

                  <div className="admin-producto-top-barra">
                    <div
                      className="admin-producto-top-barra-progreso"
                      style={{ width: `${Math.max(porcentaje, 6)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MODAL DETALLES DEL PRODUCTO TOP */}
      {productoSeleccionado && (
        <div className="admin-modal-overlay" onClick={() => setProductoSeleccionado(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-cabecera">
              <h3>Rendimiento de {productoSeleccionado.nombre}</h3>
              <button onClick={() => setProductoSeleccionado(null)} title="Cerrar">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div className="admin-modal-cuerpo">
              <div style={{ display: "flex", gap: "16px", alignItems: "center", marginBottom: "16px" }}>
                <div style={{ width: "80px", height: "80px", borderRadius: "12px", overflow: "hidden", background: "#f8fafc", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {productoSeleccionado.imagen ? (
                    <img src={productoSeleccionado.imagen} alt={productoSeleccionado.nombre} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <i className="fa-solid fa-box" style={{ fontSize: "32px", color: "#94a3b8" }}></i>
                  )}
                </div>
                <div>
                  <h4 style={{ margin: "0 0 6px 0", fontSize: "16px" }}>{productoSeleccionado.nombre}</h4>
                  <span className="admin-producto-top-categoria">{productoSeleccionado.categoria}</span>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "18px" }}>
                <div style={{ background: "#f8fafc", padding: "12px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                  <span style={{ fontSize: "12px", color: "#64748b" }}>Total vendido</span>
                  <p style={{ fontSize: "18px", fontWeight: "700", margin: "4px 0 0 0", color: "#0f172a" }}>
                    {productoSeleccionado.ventas} uds.
                  </p>
                </div>
                <div style={{ background: "#f8fafc", padding: "12px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                  <span style={{ fontSize: "12px", color: "#64748b" }}>Ingresos generados</span>
                  <p style={{ fontSize: "18px", fontWeight: "700", margin: "4px 0 0 0", color: "#2563eb" }}>
                    ${productoSeleccionado.ingresos.toLocaleString("es-CO")}
                  </p>
                </div>
              </div>

              <h4>Historial de compras en pedidos</h4>
              {productoSeleccionado.pedidosAsociados?.length > 0 ? (
                <ul style={{ listStyle: "none", padding: 0, margin: "10px 0 0 0" }}>
                  {productoSeleccionado.pedidosAsociados.map((item, idx) => (
                    <li
                      key={idx}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "8px 12px",
                        borderBottom: "1px solid #f1f5f9",
                        fontSize: "13px"
                      }}
                    >
                      <span>
                        <strong>{item.pedidoId}</strong> — {item.cliente}
                      </span>
                      <span style={{ color: "#64748b" }}>
                        {item.cantidad} {item.cantidad === 1 ? "ud." : "uds."} ({item.fecha})
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ color: "#64748b" }}>Sin historial de pedidos disponible.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Resumen;