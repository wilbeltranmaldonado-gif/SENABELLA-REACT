// Este componente muestra el carrito de compras con productos, total y sugerencias.

import { useState, useEffect } from "react";
import "./carrito.css";
import { Link, useNavigate } from "react-router-dom";
import { productosIniciales, productosRopaAccesorios } from "../../datos";
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

  // Inicializar estado desde la base de datos local respetando el stock disponible del administrador
  const [itemsCarrito, setItemsCarrito] = useState(() => {
    if (window.SenabellaCart) {
      const itemsGuardados = window.SenabellaCart.obtenerItems();
      return itemsGuardados.map((item) => {
        const stockMaximo = obtenerStockDeProducto(item.nombre);
        const cant = parseInt(item.cantidad, 10) || 1;
        return {
          id: item.nombre,
          nombre: item.nombre,
          marca: item.marca,
          precio: parsearPrecio(item.precioText),
          imagen: item.img,
          cantidad: stockMaximo > 0 ? Math.min(stockMaximo, cant) : cant,
          seleccionado: item.checked,
        };
      });
    }
    return [];
  });

  // Sincronizar cambios en el estado hacia la base de datos local
  useEffect(() => {
    if (window.SenabellaCart) {
      const itemsParaGuardar = itemsCarrito.map((item) => ({
        nombre: item.nombre,
        marca: item.marca,
        color: "Estándar",
        precioText: formatoMoneda(item.precio),
        img: item.imagen,
        cantidad: item.cantidad,
        checked: item.seleccionado,
      }));
      window.SenabellaCart.guardarItems(itemsParaGuardar);
    }
  }, [itemsCarrito]);

  // Sincronizar items del carrito si el administrador cambia el stock en vivo
  useEffect(() => {
    const ajustarCantidadesAStockAdmin = () => {
      setItemsCarrito((prev) =>
        prev.map((item) => {
          const stock = obtenerStockDeProducto(item.nombre);
          if (stock > 0 && item.cantidad > stock) {
            return { ...item, cantidad: stock };
          }
          return item;
        }),
      );
    };

    window.addEventListener("storage", ajustarCantidadesAStockAdmin);
    window.addEventListener(
      "senabella_products_updated",
      ajustarCantidadesAStockAdmin,
    );
    return () => {
      window.removeEventListener("storage", ajustarCantidadesAStockAdmin);
      window.removeEventListener(
        "senabella_products_updated",
        ajustarCantidadesAStockAdmin,
      );
    };
    // La función se mantiene estable durante el ciclo de vida de esta vista.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sugerencias aleatorias basadas ÚNICAMENTE en productos del catálogo real con stock > 0
  const [sugerencias, setSugerencias] = useState([]);

  // Función para mezclar aleatoriamente los elementos (Fisher-Yates)
  const mezclarArray = (array) => {
    const copia = [...array];
    for (let i = copia.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
  };

  const cargarSugerenciasCatalogo = (aleatorio = false) => {
    try {
      // 1. Obtener productos administrados y catálogo base
      const guardadosAdmin = JSON.parse(
        localStorage.getItem("senabella_admin_products") || "[]",
      );
      const productosAdminValidos = Array.isArray(guardadosAdmin)
        ? guardadosAdmin
        : [];

      const todosCatalogo = [
        ...productosAdminValidos,
        ...productosIniciales,
        ...productosRopaAccesorios,
      ];

      // 2. Mapear cada producto con su stock asignado desde el panel de administración
      const listaCatalogo = todosCatalogo.map((prod) => {
        const stockActual = obtenerStockDeProducto(prod.nombre, prod.id);
        const precioNum =
          typeof prod.precioNumero === "number"
            ? prod.precioNumero
            : parsearPrecio(prod.precio);
        const precioTexto = prod.precio || formatoMoneda(precioNum);
        const precioAntiguo =
          prod.precioSecundario1 ||
          prod.precioSecundario ||
          prod.precioAntiguo ||
          formatoMoneda(Math.round(precioNum * 1.2));

        return {
          id: prod.id,
          nombre: prod.nombre,
          marca: prod.marca || "SENABELLA",
          categoria: prod.categoria || prod.etiqueta || "Catálogo",
          precio: precioNum,
          precioTexto,
          precioAntiguo,
          imagen: prod.imagen || prod.img,
          stock: stockActual,
        };
      });

      // 3. Filtrar ÚNICAMENTE los que tienen stock disponible (> 0) y que tengan imagen válida
      const disponibles = listaCatalogo.filter(
        (prod) => prod.stock > 0 && prod.imagen,
      );

      // Eliminar duplicados por nombre
      const mapaUnicos = new Map();
      disponibles.forEach((p) => {
        const clave = p.nombre.trim().toLowerCase();
        if (!mapaUnicos.has(clave)) {
          mapaUnicos.set(clave, p);
        }
      });

      const listaUnica = Array.from(mapaUnicos.values());
      // Si se requiere orden aleatorio (al entrar a la página), mezclar
      const seleccionados = aleatorio ? mezclarArray(listaUnica) : listaUnica;
      setSugerencias(seleccionados.slice(0, 10));
    } catch (e) {
      console.error("Error al cargar sugerencias del catálogo:", e);
    }
  };

  useEffect(() => {
    // Al entrar al carrito, cargar de forma aleatoria los productos disponibles
    cargarSugerenciasCatalogo(true);

    const actualizarStockSinRemezclar = () => cargarSugerenciasCatalogo(false);
    window.addEventListener("storage", actualizarStockSinRemezclar);
    window.addEventListener(
      "senabella_products_updated",
      actualizarStockSinRemezclar,
    );
    return () => {
      window.removeEventListener("storage", actualizarStockSinRemezclar);
      window.removeEventListener(
        "senabella_products_updated",
        actualizarStockSinRemezclar,
      );
    };
  }, []);

  const mostrarToast = (mensaje) => {
    // Usar el sistema global de toast del encabezado (position:fixed en body)
    if (window.SenabellaToast) {
      window.SenabellaToast(mensaje, "fa-circle-check", "exito");
    }
  };

  const verDetalleProducto = (producto) => {
    localStorage.setItem(
      "productoSeleccionado",
      JSON.stringify({
        ...producto,
        titulo: producto.nombre,
        precioActual: producto.precioTexto || formatoMoneda(producto.precio),
        precioAntiguo: producto.precioAntiguo,
        descripcion: `${producto.nombre}. Producto disponible en el catálogo de Senabella con garantía oficial y despacho inmediato.`,
        imagen: producto.imagen,
        origen: "/carrito",
      }),
    );
    navigate("/detalle_producto");
  };

  const agregarAlCarrito = (producto) => {
    const stockMaximo = obtenerStockDeProducto(producto.nombre, producto.id);
    if (stockMaximo <= 0) {
      if (window.SenabellaToast) {
        window.SenabellaToast(
          `"${producto.nombre}" está agotado en inventario.`,
          "fa-triangle-exclamation",
          "error",
        );
      }
      return;
    }

    const existente = itemsCarrito.find(
      (item) => item.id === producto.id || item.nombre === producto.nombre,
    );
    if (existente) {
      if (existente.cantidad >= stockMaximo) {
        if (window.SenabellaToast) {
          window.SenabellaToast(
            `No puedes agregar más unidades. Stock disponible: ${stockMaximo} uds.`,
            "fa-circle-info",
            "advertencia",
          );
        }
        return;
      }
      setItemsCarrito(
        itemsCarrito.map((item) =>
          item.id === producto.id || item.nombre === producto.nombre
            ? { ...item, cantidad: Math.min(stockMaximo, item.cantidad + 1) }
            : item,
        ),
      );
    } else {
      setItemsCarrito([
        ...itemsCarrito,
        { ...producto, cantidad: 1, seleccionado: true },
      ]);
    }
    mostrarToast(`Se agregó ${producto.nombre} al carrito`);
  };

  const eliminarDelCarrito = (id) => {
    setItemsCarrito(itemsCarrito.filter((item) => item.id !== id));
  };

  const cambiarCantidad = (id, delta) => {
    setItemsCarrito(
      itemsCarrito.map((item) => {
        if (item.id === id) {
          const stockMaximo = obtenerStockDeProducto(item.nombre);
          if (delta > 0 && item.cantidad >= stockMaximo) {
            if (window.SenabellaToast) {
              window.SenabellaToast(
                `Has alcanzado el límite de inventario disponible (${stockMaximo} uds).`,
                "fa-circle-info",
                "advertencia",
              );
            }
            return item;
          }
          const nuevaCantidad = item.cantidad + delta;
          return {
            ...item,
            cantidad: Math.max(1, Math.min(stockMaximo, nuevaCantidad)),
          };
        }
        return item;
      }),
    );
  };

  const toggleSeleccion = (id) => {
    setItemsCarrito(
      itemsCarrito.map((item) =>
        item.id === id ? { ...item, seleccionado: !item.seleccionado } : item,
      ),
    );
  };

  const toggleSeleccionTodos = (e) => {
    const checked = e.target.checked;
    setItemsCarrito(
      itemsCarrito.map((item) => ({ ...item, seleccionado: checked })),
    );
  };

  // Cálculos derivados del estado
  const todosSeleccionados =
    itemsCarrito.length > 0 && itemsCarrito.every((item) => item.seleccionado);
  const totalItems = itemsCarrito.reduce((acc, item) => acc + item.cantidad, 0);
  const itemsSeleccionadosParaCompra = itemsCarrito.filter(
    (item) => item.seleccionado,
  );
  const totalSeleccionados = itemsSeleccionadosParaCompra.reduce(
    (acc, item) => acc + item.cantidad,
    0,
  );

  const totalPrecio = itemsSeleccionadosParaCompra.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0,
  );

  return (
    <>
      <main className='contenedor-carrito'>
        <section className='seccion-carrito'>
          <h2 className='titulo-seccion'>
            Carro{" "}
            <span className='cantidad-carrito'>({totalItems} productos)</span>
          </h2>

          {itemsCarrito.length === 0 ? (
            <div
              id='vista-carrito-vacio'
              className='tarjeta-carrito text-center py-5'
            >
              <i
                className='fa-solid fa-basket-shopping fa-3x mb-3'
                style={{ color: "#aad100" }}
              ></i>
              <h3 className='h5 font-weight-bold mb-2'>
                Tu carrito está vacío
              </h3>
              <p className='text-muted mb-4' style={{ fontSize: "14px" }}>
                Explora nuestros productos y añade lo que más te guste.
              </p>
              <Link
                to='/catalogo'
                className='boton-vacios'
                style={{
                  display: "inline-block",
                  width: "auto",
                  padding: "10px 30px",
                  textDecoration: "none",
                  backgroundColor: "#333d45",
                  color: "#fff",
                  borderRadius: "25px",
                  fontWeight: "bold",
                }}
              >
                Ver catálogo de productos
              </Link>
            </div>
          ) : (
            <div id='contenedor-items-carrito'>
              <div className='tarjeta-carrito'>
                <div className='cabecera-vendedor'>
                  <label className='contenedor-casilla'>
                    <input
                      type='checkbox'
                      checked={todosSeleccionados}
                      onChange={toggleSeleccionTodos}
                    />
                    <span className='marca-casilla'></span>
                    <p className='texto-vendedor'>
                      Vendido por{" "}
                      <strong className='nombre-vendedor'>Senabella</strong>
                    </p>
                  </label>
                  <i className='fa-solid fa-chevron-up'></i>
                </div>

                <div className='divisor-tarjeta'></div>

                {itemsCarrito.map((item) => {
                  const stockMaximo = obtenerStockDeProducto(item.nombre);
                  return (
                    <div key={item.id}>
                      <div className='fila-producto'>
                        <label className='contenedor-casilla'>
                          <input
                            type='checkbox'
                            checked={item.seleccionado}
                            onChange={() => toggleSeleccion(item.id)}
                          />
                          <span className='marca-casilla'></span>
                        </label>
                        <img
                          src={item.imagen}
                          alt={item.nombre}
                          className='imagen-producto'
                        />
                        <div className='detalles-producto'>
                          <h3 className='nombre-producto'>{item.nombre}</h3>
                          <p className='marca-producto'>{item.marca}</p>
                          <p className='color-producto'>
                            Color: <strong>Estándar</strong>
                          </p>
                          <span
                            className='stock-disponible-etiqueta'
                            style={{
                              fontSize: "11px",
                              color: stockMaximo > 5 ? "#166534" : "#b45309",
                              fontWeight: 600,
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                              marginTop: "3px",
                            }}
                          >
                            <i className='fa-solid fa-boxes-stacked'></i>{" "}
                            {stockMaximo} disponibles en stock
                          </span>
                        </div>
                        <div className='caja-precio-producto'>
                          <div className='fila-precio'>
                            <p className='precio-actual'>
                              {formatoMoneda(item.precio)}
                            </p>
                          </div>
                        </div>
                        <div className='caja-acciones-producto'>
                          <i
                            className='fa-solid fa-trash-can icono-opciones'
                            title='Eliminar producto'
                            onClick={() => eliminarDelCarrito(item.id)}
                            style={{ cursor: "pointer" }}
                          ></i>
                          <div className='selector-cantidad'>
                            <button
                              type='button'
                              onClick={() => cambiarCantidad(item.id, -1)}
                              disabled={item.cantidad <= 1}
                              title={
                                item.cantidad <= 1
                                  ? "Mínimo 1 unidad"
                                  : "Disminuir cantidad"
                              }
                            >
                              <i className='fa-solid fa-minus'></i>
                            </button>
                            <p>{item.cantidad}</p>
                            <button
                              type='button'
                              onClick={() => cambiarCantidad(item.id, 1)}
                              disabled={item.cantidad >= stockMaximo}
                              title={
                                item.cantidad >= stockMaximo
                                  ? `Límite de stock alcanzado (${stockMaximo} uds)`
                                  : "Aumentar cantidad"
                              }
                              style={
                                item.cantidad >= stockMaximo
                                  ? { opacity: 0.4, cursor: "not-allowed" }
                                  : {}
                              }
                            >
                              <i className='fa-solid fa-plus'></i>
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className='divisor-tarjeta'></div>
                    </div>
                  );
                })}

                <div className='caja-garantia'>
                  <i className='fa-solid fa-chevron-down'></i>
                </div>
              </div>
            </div>
          )}
        </section>

        <aside className='seccion-resumen'>
          <h2 className='titulo-seccion'>Resumen de la orden</h2>
          <div className='tarjeta-resumen'>
            <div className='fila-resumen'>
              <p>Productos ({totalSeleccionados})</p>
              <p className='precio-resumen'>{formatoMoneda(totalPrecio)}</p>
            </div>

            <div className='divisor-tarjeta'></div>

            <div className='fila-resumen fila-total'>
              <p>Total:</p>
              <p className='precio-total'>{formatoMoneda(totalPrecio)}</p>
            </div>

            <button
              className='boton-pagar'
              disabled={itemsCarrito.length === 0 || totalSeleccionados === 0}
              onClick={() => navigate("/checkout")}
            >
              Continuar compra
            </button>
          </div>
        </aside>
      </main>

      <section className='seccion-sugerencias'>
        <h2 className='titulo-sugerencias'>¿Y si le sumas lo último?</h2>

        <div className='cuadricula-sugerencias'>
          {sugerencias.map((prod) => {
            const stockDisponible = obtenerStockDeProducto(prod.nombre);
            return (
              <div className='tarjeta-sugerencia' key={prod.id}>
                <div
                  className='contenedor-img-sugerencia'
                  onClick={() => verDetalleProducto(prod)}
                  title='Haz clic para ver el producto en detalle'
                  style={{ cursor: "pointer", position: "relative" }}
                >
                  <img
                    src={prod.imagen}
                    alt={prod.nombre}
                    className='imagen-sugerencia'
                  />
                  <span className='badge-stock-sugerencia'>
                    <i className='fa-solid fa-check'></i> Stock:{" "}
                    {stockDisponible} uds
                  </span>
                </div>
                <p className='marca-sugerencia'>{prod.marca}</p>
                <h4
                  className='nombre-sugerencia'
                  onClick={() => verDetalleProducto(prod)}
                  title={prod.nombre}
                  style={{ cursor: "pointer" }}
                >
                  {prod.nombre}
                </h4>
                <div className='contenedor-precio'>
                  <p className='precio-sugerencia'>{prod.precioTexto}</p>
                </div>
                <p className='precio-antiguo-pequeno'>{prod.precioAntiguo}</p>

                {/* BOTONES DE ACCIÓN */}
                <div className='acciones-tarjeta-sugerencia'>
                  <button
                    type='button'
                    className='boton-ver-sugerencia'
                    onClick={() => verDetalleProducto(prod)}
                    title='Ver página de detalle del producto'
                  >
                    <i className='fa-solid fa-eye'></i> Ver producto
                  </button>
                  <button
                    type='button'
                    className='boton-agregar-sugerencia'
                    onClick={() => agregarAlCarrito(prod)}
                    title='Agregar producto al carrito de compras'
                  >
                    <i className='fa-solid fa-cart-plus'></i> Agregar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}

export default Carrito;
