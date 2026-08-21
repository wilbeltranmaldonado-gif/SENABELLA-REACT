// Este componente gestiona la finalización de compra y la validación del pedido.

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./checkout.css";

const leerJSON = (clave, valorInicial) => {
  try {
    return JSON.parse(localStorage.getItem(clave)) || valorInicial;
  } catch {
    return valorInicial;
  }
};
const parsearPrecio = (texto) =>
  parseFloat(String(texto || "").replace(/[^\d]/g, "")) || 0;
const formatoMoneda = (valor) =>
  "$ " + Math.round(valor).toLocaleString("es-CO");

function Checkout() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState({});
  const [items, setItems] = useState([]);
  const [metodoPago, setMetodoPago] = useState("banco");
  const [comprobante, setComprobante] = useState(null);
  const [errores, setErrores] = useState({});
  const [procesando, setProcesando] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("senabella_sesion") !== "activa") {
      navigate("/login", { replace: true });
      return;
    }
    const usuarioGuardado = leerJSON("senabella_usuario", {});
    setUsuario(usuarioGuardado);

    const seleccionados = leerJSON("senabella_cart_db", []).filter(
      (item) => item.checked,
    );
    if (seleccionados.length === 0) {
      navigate("/carrito", { replace: true });
      return;
    }
    setItems(seleccionados);
  }, [navigate]);

  const totalItems = items.reduce(
    (total, item) => total + (parseInt(item.cantidad, 10) || 1),
    0,
  );
  const totalPrecio = items.reduce(
    (total, item) =>
      total +
      parsearPrecio(item.precioText) * (parseInt(item.cantidad, 10) || 1),
    0,
  );

  const mostrarAviso = (mensaje) =>
    window.SenabellaToast
      ? window.SenabellaToast(mensaje, "fa-triangle-exclamation", "advertencia")
      : window.alert(mensaje);

  const handleCambioCampo = (campo, valor) => {
    const usuarioActualizado = { ...usuario, [campo]: valor };
    setUsuario(usuarioActualizado);
    localStorage.setItem(
      "senabella_usuario",
      JSON.stringify(usuarioActualizado),
    );

    // Sincronizar también con la base de datos de usuarios
    try {
      const usuariosBD = JSON.parse(
        localStorage.getItem("senabella_usuarios") || "[]",
      );
      const emailActual = (usuario.email || usuario.correo || "").toLowerCase();
      const idx = usuariosBD.findIndex(
        (u) => (u.correo || u.email || "").toLowerCase() === emailActual,
      );
      if (idx !== -1) {
        usuariosBD[idx] = { ...usuariosBD[idx], [campo]: valor };
        localStorage.setItem("senabella_usuarios", JSON.stringify(usuariosBD));
      }
    } catch (e) {
      console.warn(e);
    }

    if (errores[campo]) {
      setErrores((prev) => ({ ...prev, [campo]: false }));
    }
  };

  const procesarOrden = (imagenBase64) => {
    const numero = "SENA-" + Math.floor(100000 + Math.random() * 900000);
    const fecha = new Date().toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    // Asegurar que los datos de envío y contacto queden guardados en el perfil del usuario
    const usuarioActualizado = {
      ...usuario,
      direccion: String(usuario.direccion || "").trim(),
      ciudad: String(usuario.ciudad || "").trim(),
      celular: String(usuario.celular || "").trim(),
    };

    localStorage.setItem(
      "senabella_usuario",
      JSON.stringify(usuarioActualizado),
    );

    // Actualizar en base de datos persistente de usuarios
    try {
      const usuariosBD = JSON.parse(
        localStorage.getItem("senabella_usuarios") || "[]",
      );
      const emailUsuario = (
        usuario.email ||
        usuario.correo ||
        ""
      ).toLowerCase();
      const idx = usuariosBD.findIndex(
        (u) => (u.correo || u.email || "").toLowerCase() === emailUsuario,
      );
      if (idx !== -1) {
        usuariosBD[idx] = {
          ...usuariosBD[idx],
          direccion: usuarioActualizado.direccion,
          ciudad: usuarioActualizado.ciudad,
          celular: usuarioActualizado.celular,
        };
        localStorage.setItem("senabella_usuarios", JSON.stringify(usuariosBD));
      }
    } catch (e) {
      console.warn("No se pudo actualizar senabella_usuarios:", e);
    }

    const detalleOrden = {
      numero,
      fecha,
      total: formatoMoneda(totalPrecio),
      metodoPago,
      direccion: usuarioActualizado.direccion,
      ciudad: usuarioActualizado.ciudad,
      productos: items,
    };
    const ordenAdmin = {
      ...detalleOrden,
      id: numero,
      cliente: {
        nombre: usuarioActualizado.nombre || "Cliente",
        email: usuarioActualizado.email || usuarioActualizado.correo || "-",
        direccion: usuarioActualizado.direccion,
        ciudad: usuarioActualizado.ciudad,
        telefono: usuarioActualizado.celular,
      },
      email: usuarioActualizado.email || usuarioActualizado.correo || "-",
      telefono: usuarioActualizado.celular,
      items: items.length,
      comprobante: imagenBase64,
      estado: "pendiente",
    };

    try {
      localStorage.setItem(
        "ultima_orden_senabella",
        JSON.stringify(detalleOrden),
      );
      localStorage.setItem(
        "senabella_user_orders",
        JSON.stringify([
          detalleOrden,
          ...leerJSON("senabella_user_orders", []),
        ]),
      );
      localStorage.setItem(
        "senabella_admin_orders",
        JSON.stringify([ordenAdmin, ...leerJSON("senabella_admin_orders", [])]),
      );
      localStorage.setItem(
        "senabella_cart_db",
        JSON.stringify(
          leerJSON("senabella_cart_db", []).filter((item) => !item.checked),
        ),
      );
    } catch (err) {
      console.warn(
        "Storage quota limit reached, saving without heavy payload",
        err,
      );
      ordenAdmin.comprobante = null;
      try {
        localStorage.setItem(
          "senabella_admin_orders",
          JSON.stringify([
            ordenAdmin,
            ...leerJSON("senabella_admin_orders", []),
          ]),
        );
        localStorage.setItem(
          "senabella_cart_db",
          JSON.stringify(
            leerJSON("senabella_cart_db", []).filter((item) => !item.checked),
          ),
        );
      } catch (e2) {
        console.error(e2);
      }
    }

    // Disparar sincronización con el panel de usuario y admin
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new Event("senabella_orders_updated"));

    navigate("/confirmacion");
  };

  const enviarFormulario = (evento) => {
    evento.preventDefault();
    const nuevosErrores = {};
    if (!usuario.direccion?.trim()) nuevosErrores.direccion = true;
    if (!usuario.ciudad?.trim()) nuevosErrores.ciudad = true;
    if (!usuario.celular?.trim()) nuevosErrores.celular = true;
    if ((metodoPago === "banco" || metodoPago === "nequi") && !comprobante)
      nuevosErrores.comprobante = true;

    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) {
      mostrarAviso(
        "Por favor completa los datos de envío y comprobante de pago.",
      );
      return;
    }

    setProcesando(true);
    if (comprobante) {
      const lector = new FileReader();
      lector.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const maxDim = 650;
          let width = img.width;
          let height = img.height;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL("image/jpeg", 0.65);
          setTimeout(() => procesarOrden(compressed), 400);
        };
        img.onerror = () =>
          setTimeout(() => procesarOrden(e.target?.result), 400);
        img.src = e.target?.result;
      };
      lector.readAsDataURL(comprobante);
    } else {
      setTimeout(() => procesarOrden(null), 400);
    }
  };

  const textoPago =
    metodoPago === "nequi" ? (
      <>
        Transfiere a nuestra cuenta <strong>Nequi #300-123-4567</strong> a
        nombre de Senabella SAS.
      </>
    ) : (
      <>
        Realiza la transferencia a la cuenta{" "}
        <strong>Bancolombia Ahorros #123-456789-00</strong> a nombre de
        Senabella SAS.
      </>
    );

  return (
    <main className='contenedor-checkout'>
      <section className='seccion-formulario'>
        <h2 className='titulo-seccion-checkout'>Finalizar Compra</h2>
        <form id='form-checkout' onSubmit={enviarFormulario}>
          {/* PASO 1: DATOS DE ENVÍO */}
          <div className='paso-checkout'>
            <h3>
              <i className='fa-solid fa-truck' /> 1. Datos de Envío
            </h3>
            <div className='grupo-inputs full'>
              <Campo
                label='Dirección de entrega completa'
                valor={usuario.direccion || ""}
                alCambiar={(e) =>
                  handleCambioCampo("direccion", e.target.value)
                }
                placeholder='Ej. Calle 123 # 45 - 67, Apto 501'
                error={errores.direccion}
                mensaje='Por favor, ingresa tu dirección de entrega.'
              />
            </div>
            <div className='grupo-inputs'>
              <Campo
                label='Ciudad / Municipio'
                valor={usuario.ciudad || ""}
                alCambiar={(e) => handleCambioCampo("ciudad", e.target.value)}
                placeholder='Ej. Bogotá, Medellín, Cali...'
                error={errores.ciudad}
                mensaje='Por favor, ingresa la ciudad de entrega.'
              />
              <Campo
                label='Teléfono / Celular de contacto'
                valor={usuario.celular || ""}
                alCambiar={(e) => handleCambioCampo("celular", e.target.value)}
                placeholder='Ej. 300 123 4567'
                error={errores.celular}
                mensaje='Por favor, ingresa un número de teléfono de contacto.'
              />
            </div>
          </div>

          {/* PASO 2: MÉTODO DE PAGO */}
          <div className='paso-checkout'>
            <h3>
              <i className='fa-solid fa-credit-card' /> 2. Método de Pago
            </h3>
            <div className='metodos-pago'>
              <MetodoPago
                valor='banco'
                seleccionado={metodoPago}
                cambiar={setMetodoPago}
                titulo='Transferencia Bancaria'
                detalle='Bancolombia, Davivienda, etc.'
                icono='fa-building-columns'
              />
              <MetodoPago
                valor='nequi'
                seleccionado={metodoPago}
                cambiar={setMetodoPago}
                titulo='Nequi'
                detalle='Transfiere desde tu celular'
                icono='fa-mobile-screen-button'
              />
              <MetodoPago
                valor='contraentrega'
                seleccionado={metodoPago}
                cambiar={setMetodoPago}
                titulo='Pago Contra Entrega'
                detalle='Paga en efectivo al recibir tu pedido'
                icono='fa-money-bill-1-wave'
              />
            </div>

            {metodoPago !== "contraentrega" && (
              <div className='contenedor-comprobante'>
                <h4>Sube tu comprobante de pago</h4>
                <p className='instrucciones-pago'>{textoPago}</p>
                <div className='campo-checkout mt-3'>
                  <label htmlFor='archivo-comprobante'>
                    Imagen del comprobante (Requerido)
                  </label>
                  <input
                    className={errores.comprobante ? "error" : ""}
                    type='file'
                    id='archivo-comprobante'
                    accept='image/*'
                    onChange={(evento) => {
                      setComprobante(evento.target.files?.[0] || null);
                      if (errores.comprobante)
                        setErrores((prev) => ({ ...prev, comprobante: false }));
                    }}
                  />
                  {errores.comprobante && (
                    <span
                      className='mensaje-error'
                      style={{ display: "block" }}
                    >
                      Por favor, sube la imagen de tu comprobante de pago.
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </form>
      </section>

      {/* COLUMNA DERECHA: RESUMEN DE LA ORDEN */}
      <aside className='seccion-resumen-orden'>
        <h3 className='titulo-resumen'>
          Resumen de la orden{" "}
          <span className='badge-items'>
            {totalItems} {totalItems === 1 ? "item" : "items"}
          </span>
        </h3>
        <div className='lista-productos-checkout'>
          {items.map((item, indice) => {
            const cantidad = parseInt(item.cantidad, 10) || 1;
            return (
              <div
                className='producto-checkout'
                key={`${item.nombre}-${indice}`}
              >
                <div className='img-producto-checkout'>
                  <img src={item.img} alt={item.nombre} />
                  <div className='cantidad-badge'>{cantidad}</div>
                </div>
                <div className='info-producto-checkout'>
                  <h4>{item.nombre}</h4>
                  <p>
                    {item.marca || "SENABELLA"} - Color:{" "}
                    {item.color || "Estándar"}
                  </p>
                  <div className='precio-producto-checkout'>
                    {item.precioText}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className='desglose-precios'>
          <div className='fila-desglose'>
            <span>Subtotal</span>
            <span>{formatoMoneda(totalPrecio)}</span>
          </div>
          <div className='fila-desglose'>
            <span>Costo de envío</span>
            <span>Gratis</span>
          </div>
          <div className='fila-desglose total'>
            <span>Total a Pagar</span>
            <span>{formatoMoneda(totalPrecio)}</span>
          </div>
        </div>
        <button
          type='submit'
          form='form-checkout'
          className='btn-finalizar-compra'
          disabled={procesando}
        >
          {procesando ? (
            <>
              <i className='fa-solid fa-spinner fa-spin' /> Procesando tu
              orden...
            </>
          ) : (
            <>
              Confirmar y Pagar <i className='fa-solid fa-lock' />
            </>
          )}
        </button>
      </aside>
    </main>
  );
}

function Campo({ label, valor, alCambiar, placeholder, error, mensaje }) {
  return (
    <div className='campo-checkout'>
      <label>{label}</label>
      <input
        type='text'
        value={valor || ""}
        onChange={alCambiar}
        placeholder={placeholder}
        required
        className={error ? "error" : ""}
      />
      {error && (
        <span className='mensaje-error' style={{ display: "block" }}>
          {mensaje}
        </span>
      )}
    </div>
  );
}

function MetodoPago({ valor, seleccionado, cambiar, titulo, detalle, icono }) {
  return (
    <div className='opcion-pago'>
      <input
        type='radio'
        name='metodo_pago'
        id={`pago-${valor}`}
        value={valor}
        checked={seleccionado === valor}
        onChange={() => cambiar(valor)}
      />
      <label htmlFor={`pago-${valor}`}>
        <div className='radio-custom' />
        <div className='info-pago'>
          <span>{titulo}</span>
          <small>{detalle}</small>
        </div>
        <i className={`fa-solid ${icono}`} />
      </label>
    </div>
  );
}

export default Checkout;
