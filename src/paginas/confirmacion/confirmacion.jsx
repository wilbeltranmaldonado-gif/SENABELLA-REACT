import { Link } from "react-router-dom";
import "./confirmacion.css";

function Confirmacion() {
  let orden = {};
  try { orden = JSON.parse(localStorage.getItem("ultima_orden_senabella")) || {}; } catch { orden = {}; }
  return <main className="contenedor-confirmacion"><div className="tarjeta-confirmacion"><div className="icono-exito-wrapper"><i className="fa-solid fa-check" /></div><h1 className="titulo-confirmacion">¡Gracias por tu compra!</h1><p className="subtitulo-confirmacion">Tu pedido ha sido confirmado y ya estamos procesándolo.</p><div className="resumen-pedido-box"><h3>Detalles de tu Orden</h3><div className="detalle-grid"><Detalle label="Número de Orden" valor={orden.numero || "No disponible"} /><Detalle label="Fecha de Compra" valor={orden.fecha || "No disponible"} /><Detalle label="Método de Pago" valor={orden.metodoPago || "No disponible"} /><Detalle label="Total Pagado" valor={orden.total || "$ 0"} /><div className="detalle-item" style={{ gridColumn: "1 / -1", marginTop: 10 }}><span className="label">Dirección de Envío</span><span className="valor">{orden.direccion || "No disponible"}{orden.ciudad ? `, ${orden.ciudad}` : ""}</span></div></div></div><div className="acciones-confirmacion"><Link to="/" className="btn-volver-inicio">Volver al Inicio</Link><Link to="/usuario" state={{ seccion: "mis-compras" }} className="btn-ver-mis-compras">Ver mis compras</Link></div></div></main>;
}
function Detalle({ label, valor }) { return <div className="detalle-item"><span className="label">{label}</span><span className="valor">{valor}</span></div>; }
export default Confirmacion;