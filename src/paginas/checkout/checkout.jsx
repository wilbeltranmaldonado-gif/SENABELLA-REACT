import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../css/checkout.css";

const leerJSON = (clave, valorInicial) => {
  try { return JSON.parse(localStorage.getItem(clave)) || valorInicial; } catch { return valorInicial; }
};
const parsearPrecio = (texto) => parseFloat(String(texto || "").replace(/[^\d]/g, "")) || 0;
const formatoMoneda = (valor) => "$ " + Math.round(valor).toLocaleString("es-CO");

function Checkout() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState({});
  const [items, setItems] = useState([]);
  const [metodoPago, setMetodoPago] = useState("banco");
  const [comprobante, setComprobante] = useState(null);
  const [errores, setErrores] = useState({});
  const [procesando, setProcesando] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("senabella_sesion") !== "activa") { navigate("/login", { replace: true }); return; }
    setUsuario(leerJSON("senabella_usuario", {}));
    const seleccionados = leerJSON("senabella_cart_db", []).filter((item) => item.checked);
    if (seleccionados.length === 0) { navigate("/carrito", { replace: true }); return; }
    setItems(seleccionados);
  }, [navigate]);

  const totalItems = items.reduce((total, item) => total + (parseInt(item.cantidad, 10) || 1), 0);
  const totalPrecio = items.reduce((total, item) => total + parsearPrecio(item.precioText) * (parseInt(item.cantidad, 10) || 1), 0);

  const mostrarAviso = (mensaje) => window.SenabellaToast ? window.SenabellaToast(mensaje, "fa-triangle-exclamation", "advertencia") : window.alert(mensaje);

  const procesarOrden = (imagenBase64) => {
    const numero = "SENA-" + Math.floor(100000 + Math.random() * 900000);
    const fecha = new Date().toLocaleDateString("es-CO", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" });
    const detalleOrden = { numero, fecha, total: formatoMoneda(totalPrecio), metodoPago, direccion: usuario.direccion, ciudad: usuario.ciudad, productos: items };
    const ordenAdmin = {
      ...detalleOrden,
      cliente: {
        nombre: usuario.nombre || "Cliente",
        email: usuario.email || "-",
        direccion: usuario.direccion,
        ciudad: usuario.ciudad,
        telefono: usuario.celular
      },
      items: items.length,
      comprobante: imagenBase64,
      estado: "pendiente"
    };
    localStorage.setItem("ultima_orden_senabella", JSON.stringify(detalleOrden));
    localStorage.setItem("senabella_user_orders", JSON.stringify([detalleOrden, ...leerJSON("senabella_user_orders", [])]));
    localStorage.setItem("senabella_admin_orders", JSON.stringify([ordenAdmin, ...leerJSON("senabella_admin_orders", [])]));
    localStorage.setItem("senabella_cart_db", JSON.stringify(leerJSON("senabella_cart_db", []).filter((item) => !item.checked)));
    navigate("/confirmacion");
  };

  const enviarFormulario = (evento) => {
    evento.preventDefault();
    const nuevosErrores = {};
    if (!usuario.direccion?.trim()) nuevosErrores.direccion = true;
    if (!usuario.ciudad?.trim()) nuevosErrores.ciudad = true;
    if (!usuario.celular?.trim()) nuevosErrores.telefono = true;
    if ((metodoPago === "banco" || metodoPago === "nequi") && !comprobante) nuevosErrores.comprobante = true;
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length) { mostrarAviso("Por favor completa correctamente los datos de envío y pago."); return; }
    setProcesando(true);
    if (comprobante) {
      const lector = new FileReader();
      lector.onload = (eventoLectura) => setTimeout(() => procesarOrden(eventoLectura.target.result), 700);
      lector.readAsDataURL(comprobante);
    } else setTimeout(() => procesarOrden(null), 700);
  };

  const textoPago = metodoPago === "nequi" ? <>Transfiere a nuestra cuenta <strong>Nequi #300-123-4567</strong> a nombre de Senabella SAS.</> : <>Realiza la transferencia a la cuenta <strong>Bancolombia Ahorros #123-456789-00</strong> a nombre de Senabella SAS.</>;

  return <main className="contenedor-checkout">
    <section className="seccion-formulario">
      <h2 className="titulo-seccion-checkout">Finalizar Compra</h2>
      <form id="form-checkout" onSubmit={enviarFormulario}>
        <div className="paso-checkout"><h3><i className="fa-solid fa-truck" /> 1. Datos de Envío</h3><div className="grupo-inputs full"><Campo label="Dirección completa" valor={usuario.direccion} error={errores.direccion} mensaje="Por favor, ingresa tu dirección en tu perfil." /></div><div className="grupo-inputs"><Campo label="Ciudad" valor={usuario.ciudad} error={errores.ciudad} mensaje="Por favor, actualiza tu ciudad en tu perfil." /><Campo label="Teléfono de contacto" valor={usuario.celular} error={errores.telefono} mensaje="Por favor, ingresa un teléfono en tu perfil." /></div></div>
        <div className="paso-checkout"><h3><i className="fa-solid fa-credit-card" /> 2. Método de Pago</h3><div className="metodos-pago"><MetodoPago valor="banco" seleccionado={metodoPago} cambiar={setMetodoPago} titulo="Transferencia Bancaria" detalle="Bancolombia, Davivienda, etc." icono="fa-building-columns" /><MetodoPago valor="nequi" seleccionado={metodoPago} cambiar={setMetodoPago} titulo="Nequi" detalle="Transfiere desde tu celular" icono="fa-mobile-screen-button" /><MetodoPago valor="contraentrega" seleccionado={metodoPago} cambiar={setMetodoPago} titulo="Pago Contra Entrega" detalle="Paga en efectivo al recibir tu pedido" icono="fa-money-bill-1-wave" /></div>{metodoPago !== "contraentrega" && <div className="contenedor-comprobante"><h4>Sube tu comprobante de pago</h4><p className="instrucciones-pago">{textoPago}</p><div className="campo-checkout mt-3"><label htmlFor="archivo-comprobante">Imagen del comprobante (Requerido)</label><input className={errores.comprobante ? "error" : ""} type="file" id="archivo-comprobante" accept="image/*" onChange={(evento) => setComprobante(evento.target.files[0])} />{errores.comprobante && <span className="mensaje-error" style={{ display: "block" }}>Por favor, sube la imagen de tu comprobante de pago.</span>}</div></div>}</div>
      </form>
    </section>
    <aside className="seccion-resumen-orden"><h3 className="titulo-resumen">Resumen de la orden <span className="badge-items">{totalItems} {totalItems === 1 ? "item" : "items"}</span></h3><div className="lista-productos-checkout">{items.map((item, indice) => { const cantidad = parseInt(item.cantidad, 10) || 1; return <div className="producto-checkout" key={`${item.nombre}-${indice}`}><div className="img-producto-checkout"><img src={item.img} alt={item.nombre} /><div className="cantidad-badge">{cantidad}</div></div><div className="info-producto-checkout"><h4>{item.nombre}</h4><p>{item.marca || "SENABELLA"} - Color: {item.color || "Estándar"}</p><div className="precio-producto-checkout">{item.precioText}</div></div></div>; })}</div><div className="desglose-precios"><div className="fila-desglose"><span>Subtotal</span><span>{formatoMoneda(totalPrecio)}</span></div><div className="fila-desglose"><span>Costo de envío</span><span>Gratis</span></div><div className="fila-desglose total"><span>Total a Pagar</span><span>{formatoMoneda(totalPrecio)}</span></div></div><button type="submit" form="form-checkout" className="btn-finalizar-compra" disabled={procesando}>{procesando ? <><i className="fa-solid fa-spinner fa-spin" /> Procesando tu orden...</> : <>Confirmar y Pagar <i className="fa-solid fa-lock" /></>}</button></aside>
  </main>;
}

function Campo({ label, valor, error, mensaje }) { return <div className="campo-checkout"><label>{label} <small>(Extraída de tu perfil)</small></label><input value={valor || ""} readOnly required className={error ? "error" : ""} title="Edita esta información en tu perfil" />{error && <span className="mensaje-error" style={{ display: "block" }}>{mensaje}</span>}</div>; }
function MetodoPago({ valor, seleccionado, cambiar, titulo, detalle, icono }) { return <div className="opcion-pago"><input type="radio" name="metodo_pago" id={`pago-${valor}`} value={valor} checked={seleccionado === valor} onChange={() => cambiar(valor)} /><label htmlFor={`pago-${valor}`}><div className="radio-custom" /><div className="info-pago"><span>{titulo}</span><small>{detalle}</small></div><i className={`fa-solid ${icono}`} /></label></div>; }
export default Checkout;