import { useEffect, useRef, useState } from "react";
import { productosIniciales } from "../../../datos";

function cargarDatosDashboard() {
  try {
    const pedidos = JSON.parse(localStorage.getItem("senabella_admin_orders") || "[]");
    const productos = JSON.parse(localStorage.getItem("senabella_admin_products") || "[]");
    const usuarios = JSON.parse(localStorage.getItem("senabella_usuarios") || "[]");
    const ventas = pedidos.reduce((total, pedido) => total + (Number(String(pedido.total || "").replace(/[^\d]/g, "")) || 0), 0);
    return {
      pedidos,
      ventas,
      productos: (Array.isArray(productos) ? productos.length : 0) + productosIniciales.length,
      clientes: Array.isArray(usuarios) ? usuarios.filter((usuario) => usuario.rol !== "administrador").length : 0,
      pedidosPendientes: pedidos.filter((pedido) => ["pendiente", "pendiente-verificacion", "procesando"].includes(pedido.estado)).length
    };
  } catch {
    return { pedidos: [], ventas: 0, productos: 0, clientes: 0, pedidosPendientes: 0 };
  }
}

function Resumen() {
  const [datos, setDatos] = useState(() => cargarDatosDashboard());
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    const actualizarDatos = () => setDatos(cargarDatosDashboard());
    actualizarDatos();
    window.addEventListener("storage", actualizarDatos);
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

  // Pedidos recientes
  const pedidosRecientes = datos.pedidos.slice(0, 5).map((pedido) => ({
    id: pedido.numero || pedido.id,
    cliente: pedido.cliente?.nombre || pedido.cliente || "Cliente",
    total: pedido.total,
    estado: pedido.estado,
    fecha: pedido.fecha
  }));

  const obtenerClaseEstado = (estado) => {
    const clases = {
      completado: "estado-exito",
      procesando: "estado-info",
      pendiente: "estado-advertencia",
      enviado: "estado-primario"
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
                {stat.cambio} vs mes anterior
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ==========================================
           PEDIDOS RECIENTES
      ========================================== */}
      <div className="admin-seccion">
        <h2 className="admin-seccion-titulo">Pedidos recientes</h2>
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
              {pedidosRecientes.map((pedido, index) => (
                <tr key={index}>
                  <td>{pedido.id}</td>
                  <td>{pedido.cliente}</td>
                  <td>{pedido.total}</td>
                  <td>
                    <span className={`admin-badge ${obtenerClaseEstado(pedido.estado)}`}>
                      {pedido.estado}
                    </span>
                  </td>
                  <td>{pedido.fecha}</td>
                  <td>
                    <button className="admin-boton-icono" title="Ver detalles">
                      <i className="fa-solid fa-eye"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ==========================================
           PRODUCTOS MÁS VENDIDOS
      ========================================== */}
      <div className="admin-seccion">
        <h2 className="admin-seccion-titulo">Productos más vendidos</h2>
        <div className="admin-grid-productos">
          {[ 
            { nombre: "Camisa Casual", ventas: 234, imagen: "/src/assets/camisa_1.jpg" },
            { nombre: "Camisa Formal", ventas: 189, imagen: "/src/assets/camisa_2.jpg" },
            { nombre: "Zapatos Deportivos", ventas: 156, imagen: "/src/assets/zapatos.jpg" },
            { nombre: "Hero Collection", ventas: 143, imagen: "/src/assets/hero.png" },
          ].map((producto, index) => (
            <div key={index} className="admin-producto-card">
              <img 
                src={producto.imagen} 
                alt={producto.nombre}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.style.display = 'flex';
                  e.target.parentElement.style.justifyContent = 'center';
                  e.target.parentElement.style.alignItems = 'center';
                  e.target.parentElement.innerHTML = `<div class="admin-producto-icono" style="background-color: #f1f2f5; color: #64748b; width: 60px; height: 60px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px;"><i class="fa-solid fa-image"></i></div>`;
                }}
              />
              <div className="admin-producto-info">
                <h4>{producto.nombre}</h4>
                <p>{producto.ventas} vendidos</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Resumen;