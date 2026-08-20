import { useState, useEffect } from "react";
import "./carrito.css";
import { Link, useNavigate } from "react-router-dom";
import { sugerenciasCarrito } from "../../datos";
import { obtenerStockDeProducto } from "../../utils/stock";

function Carrito() {
  const navigate = useNavigate();
  const parsearPrecio = (texto) => {
    if (!texto) return 0;
    return parseFloat(texto.toString().replace(/[^\d]/g, "")) || 0;
  };

  const formatoMoneda = (valor) => {
    return "$ " + Math.round(valor).toLocaleString("es-CO");
  };

  // Inicializar estado desde la base de datos local
  const [itemsCarrito, setItemsCarrito] = useState(() => {
    if (window.SenabellaCart) {
      const itemsGuardados = window.SenabellaCart.obtenerItems();
      return itemsGuardados.map(item => ({
        id: item.nombre,
        nombre: item.nombre,
        marca: item.marca,
        precio: parsearPrecio(item.precioText),
        imagen: item.img,
        cantidad: item.cantidad,
        seleccionado: item.checked
      }));
    }
    return [];
  });

  // Sincronizar cambios en el estado hacia la base de datos local
  useEffect(() => {
    if (window.SenabellaCart) {
      const itemsParaGuardar = itemsCarrito.map(item => ({
        nombre: item.nombre,
        marca: item.marca,
        color: "Estándar",
        precioText: formatoMoneda(item.precio),
        img: item.imagen,
        cantidad: item.cantidad,
        checked: item.seleccionado
      }));
      window.SenabellaCart.guardarItems(itemsParaGuardar);
    }
  }, [itemsCarrito]);
  
  // Estado para las sugerencias (Y si le sumas lo último)
  const [sugerencias, setSugerencias] = useState(sugerenciasCarrito);

  const mostrarToast = (mensaje) => {
    // Usar el sistema global de toast del encabezado (position:fixed en body)
    if (window.SenabellaToast) {
      window.SenabellaToast(mensaje, "fa-circle-check", "exito");
    }
  };

  const agregarAlCarrito = (producto) => {
    // Verificar si ya existe en el carrito
    const existente = itemsCarrito.find(item => item.id === producto.id);
    if (existente) {
      setItemsCarrito(itemsCarrito.map(item => 
        item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
      ));
    } else {
      setItemsCarrito([...itemsCarrito, { ...producto, cantidad: 1, seleccionado: true }]);
    }
    mostrarToast(`Se agregó ${producto.nombre} al carrito`);
  };

  const eliminarDelCarrito = (id) => {
    setItemsCarrito(itemsCarrito.filter(item => item.id !== id));
  };

  const cambiarCantidad = (id, delta) => {
    setItemsCarrito(itemsCarrito.map(item => {
      if (item.id === id) {
        const stockMaximo = obtenerStockDeProducto(item.nombre);
        const nuevaCantidad = item.cantidad + delta;
        return { ...item, cantidad: Math.max(1, Math.min(stockMaximo, nuevaCantidad)) };
      }
      return item;
    }));
  };

  const toggleSeleccion = (id) => {
    setItemsCarrito(itemsCarrito.map(item => 
      item.id === id ? { ...item, seleccionado: !item.seleccionado } : item
    ));
  };

  const toggleSeleccionTodos = (e) => {
    const checked = e.target.checked;
    setItemsCarrito(itemsCarrito.map(item => ({ ...item, seleccionado: checked })));
  };

  // Cálculos derivados del estado
  const todosSeleccionados = itemsCarrito.length > 0 && itemsCarrito.every(item => item.seleccionado);
  const totalItems = itemsCarrito.reduce((acc, item) => acc + item.cantidad, 0);
  const itemsSeleccionadosParaCompra = itemsCarrito.filter(item => item.seleccionado);
  const totalSeleccionados = itemsSeleccionadosParaCompra.reduce((acc, item) => acc + item.cantidad, 0);
  
  const totalPrecio = itemsSeleccionadosParaCompra.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
  
  
  return (
    <>
      <main className="contenedor-carrito">
        <section className="seccion-carrito">
          <h2 className="titulo-seccion">
            Carro <span className="cantidad-carrito">({totalItems} productos)</span>
          </h2>

          {itemsCarrito.length === 0 ? (
            <div id="vista-carrito-vacio" className="tarjeta-carrito text-center py-5">
              <i className="fa-solid fa-basket-shopping fa-3x mb-3" style={{ color: "#aad100" }}></i>
              <h3 className="h5 font-weight-bold mb-2">Tu carrito está vacío</h3>
              <p className="text-muted mb-4" style={{ fontSize: "14px" }}>Explora nuestros productos y añade lo que más te guste.</p>
              <Link to="/catalogo" className="boton-vacios" style={{ display: "inline-block", width: "auto", padding: "10px 30px", textDecoration: "none", backgroundColor: "#333d45", color: "#fff", borderRadius: "25px", fontWeight: "bold" }}>
                Ver catálogo de productos
              </Link>
            </div>
          ) : (
            <div id="contenedor-items-carrito">
              <div className="tarjeta-carrito">
                <div className="cabecera-vendedor">
                  <label className="contenedor-casilla">
                    <input type="checkbox" checked={todosSeleccionados} onChange={toggleSeleccionTodos} />
                    <span className="marca-casilla"></span>
                    <p className="texto-vendedor">
                      Vendido por <strong className="nombre-vendedor">Senabella</strong>
                    </p>
                  </label>
                  <i className="fa-solid fa-chevron-up"></i>
                </div>

                <div className="divisor-tarjeta"></div>

                {itemsCarrito.map(item => (
                  <div key={item.id}>
                    <div className="fila-producto">
                      <label className="contenedor-casilla">
                        <input type="checkbox" checked={item.seleccionado} onChange={() => toggleSeleccion(item.id)} />
                        <span className="marca-casilla"></span>
                      </label>
                      <img src={item.imagen} alt={item.nombre} className="imagen-producto" />
                      <div className="detalles-producto">
                        <h3 className="nombre-producto">{item.nombre}</h3>
                        <p className="marca-producto">{item.marca}</p>
                        <p className="color-producto">Color: <strong>Estándar</strong></p>
                      </div>
                      <div className="caja-precio-producto">
                        <div className="fila-precio">
                          <p className="precio-actual">{formatoMoneda(item.precio)}</p>
                        </div>
                      </div>
                      <div className="caja-acciones-producto">
                        <i className="fa-solid fa-trash-can icono-opciones" title="Eliminar producto" onClick={() => eliminarDelCarrito(item.id)} style={{cursor: "pointer"}}></i>
                        <div className="selector-cantidad">
                          <button onClick={() => cambiarCantidad(item.id, -1)}><i className="fa-solid fa-minus"></i></button>
                          <p>{item.cantidad}</p>
                          <button onClick={() => cambiarCantidad(item.id, 1)}><i className="fa-solid fa-plus"></i></button>
                        </div>
                      </div>
                    </div>
                    <div className="divisor-tarjeta"></div>
                  </div>
                ))}

                <div className="caja-garantia">
                  <i className="fa-solid fa-chevron-down"></i>
                </div>
              </div>
            </div>
          )}
        </section>

        <aside className="seccion-resumen">
          <h2 className="titulo-seccion">Resumen de la orden</h2>
          <div className="tarjeta-resumen">
            <div className="fila-resumen">
              <p>Productos ({totalSeleccionados})</p>
              <p className="precio-resumen">{formatoMoneda(totalPrecio)}</p>
            </div>

            <div className="divisor-tarjeta"></div>

            <div className="fila-resumen fila-total">
              <p>Total:</p>
              <p className="precio-total">{formatoMoneda(totalPrecio)}</p>
            </div>

            <button className="boton-pagar" disabled={itemsCarrito.length === 0 || totalSeleccionados === 0} onClick={() => navigate("/checkout")}>
              Continuar compra
            </button>
          </div>
        </aside>
      </main>

      <section className="seccion-sugerencias">
        <h2 className="titulo-sugerencias">¿Y si le sumas lo último?</h2>
        <div className="cuadricula-sugerencias">
          {sugerencias.map((prod) => (
            <div className="tarjeta-sugerencia" key={prod.id}>
              <img src={prod.imagen} alt={prod.nombre} className="imagen-sugerencia" />
              <p className="marca-sugerencia">{prod.marca}</p>
              <h4 className="nombre-sugerencia">{prod.nombre}</h4>
              <div className="contenedor-precio">
                <p className="precio-sugerencia">{prod.precioTexto}</p>
              </div>
              <p className="precio-antiguo-pequeno">{prod.precioAntiguo}</p>
              <button className="boton-ver-producto" onClick={() => agregarAlCarrito(prod)}>Agregar Producto</button>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default Carrito;
