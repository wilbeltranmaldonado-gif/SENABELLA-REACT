import { useState, useEffect, useRef } from "react";

function Reportes() {
  const [tipoReporte, setTipoReporte] = useState("ventas");
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    // Cargar Chart.js dinámicamente
    const loadChartJS = async () => {
      if (typeof Chart === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.4/chart.umd.min.js';
        script.async = true;
        script.onload = inicializarGrafica;
        document.head.appendChild(script);
      } else {
        inicializarGrafica();
      }
    };

    const inicializarGrafica = () => {
      // Destruir gráfica existente si hay una
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current?.getContext('2d');
      if (!ctx) return;

      let data, opciones;

      if (tipoReporte === "ventas") {
        data = {
          labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago'],
          datasets: [{
            label: 'Ventas 2024',
            data: [12000, 19000, 15000, 25000, 22000, 30000, 28000, 35000],
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.4,
            fill: true
          }]
        };
        opciones = {
          type: 'line',
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'top' } },
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
        };
      } else if (tipoReporte === "productos") {
        data = {
          labels: ['Audio', 'Relojes', 'Cargadores', 'Computación', 'Accesorios'],
          datasets: [{
            label: 'Productos por categoría',
            data: [45, 23, 67, 89, 134],
            backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']
          }]
        };
        opciones = {
          type: 'doughnut',
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'right' } }
          }
        };
      } else {
        data = {
          labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
          datasets: [{
            label: 'Pedidos por día',
            data: [45, 52, 38, 65, 78, 92, 35],
            backgroundColor: '#10b981'
          }]
        };
        opciones = {
          type: 'bar',
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'top' } },
            scales: { y: { beginAtZero: true } }
          }
        };
      }

      chartInstance.current = new Chart(ctx, {
        type: opciones.type,
        data: data,
        options: opciones.options
      });
    };

    loadChartJS();

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [tipoReporte]);

  const estadisticas = [
    { titulo: "Ingresos totales", valor: "$186,000", icono: "fa-dollar-sign", color: "blue" },
    { titulo: "Pedidos completados", valor: "1,245", icono: "fa-check-circle", color: "green" },
    { titulo: "Promedio por pedido", valor: "$149.40", icono: "fa-receipt", color: "purple" },
    { titulo: "Tasa de conversión", valor: "3.2%", icono: "fa-percentage", color: "orange" },
  ];

  return (
    <div className="vista-reportes">
      <div className="admin-cabecera-vista">
        <h2 className="admin-seccion-titulo">Reportes y estadísticas</h2>
        <select 
          value={tipoReporte}
          onChange={(e) => setTipoReporte(e.target.value)}
          className="admin-select"
        >
          <option value="ventas">Ventas</option>
          <option value="productos">Productos</option>
          <option value="pedidos">Pedidos</option>
        </select>
      </div>

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
          <canvas ref={chartRef}></canvas>
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
              <tr>
                <td>Ventas totales</td>
                <td>$35,000</td>
                <td>$28,000</td>
                <td className="texto-success">+25%</td>
              </tr>
              <tr>
                <td>Nuevos clientes</td>
                <td>89</td>
                <td>72</td>
                <td className="texto-success">+23.6%</td>
              </tr>
              <tr>
                <td>Pedidos</td>
                <td>234</td>
                <td>198</td>
                <td className="texto-success">+18.2%</td>
              </tr>
              <tr>
                <td>Tasa de devolución</td>
                <td>2.1%</td>
                <td>2.8%</td>
                <td className="texto-success">-25%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Reportes;