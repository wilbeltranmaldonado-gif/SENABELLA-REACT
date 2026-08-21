// Este archivo centraliza el cálculo y la gestión del inventario disponible.

import { productosIniciales, productosRopaAccesorios } from "../datos";

const PRODUCTOS_ADMIN_KEY = "senabella_admin_products";

const productosPredeterminados = [
  { id: 1, nombre: "Auriculares Bluetooth", marca: "JBL", categoria: "Audio", precio: "$ 89.900", precioNumero: 89900, stock: 45, estado: "activo", imagen: "https://media.falabella.com/falabellaCO/155500313_01/w=1200,h=1200,fit=pad" },
  { id: 2, nombre: "Smartwatch Pro", marca: "XIAOMI", categoria: "Relojes", precio: "$ 199.900", precioNumero: 199900, stock: 23, estado: "activo", imagen: "https://media.falabella.com/falabellaCO/139001771_01/w=480,h=480,fit=pad" },
  { id: 3, nombre: "Cargador USB-C", marca: "BELKIN", categoria: "Cargadores", precio: "$ 29.900", precioNumero: 29900, stock: 120, estado: "activo", imagen: "https://media.falabella.com/falabellaCO/140922701_01/w=1200,h=1200,fit=pad" },
  { id: 4, nombre: "Batería Portátil", marca: "ANKER", categoria: "Accesorios", precio: "$ 49.900", precioNumero: 49900, stock: 8, estado: "bajo", imagen: "https://media.falabella.com/falabellaCO/124164429_01/w=1200,h=1200,fit=pad" },
  { id: 5, nombre: "Teclado Mecánico", marca: "LOGITECH", categoria: "Computación", precio: "$ 79.900", precioNumero: 79900, stock: 0, estado: "agotado", imagen: "https://media.falabella.com/falabellaCO/124164429_01/w=1200,h=1200,fit=pad" },
];

export function asegurarInicializacionProductosAdmin() {
  try {
    const guardados = JSON.parse(localStorage.getItem(PRODUCTOS_ADMIN_KEY) || "null");
    if (!Array.isArray(guardados) || guardados.length === 0) {
      const productosDelCatalogo = [...productosIniciales, ...productosRopaAccesorios].map((producto) => ({
        id: `catalogo-${producto.id}`,
        nombre: producto.nombre,
        categoria: producto.categoria || producto.etiqueta || "General",
        precio: producto.precio,
        stock: typeof producto.stock === "number" ? producto.stock : 10,
        estado: "activo",
        imagen: producto.imagen,
        marca: producto.marca || "SENABELLA",
        referencia: producto.referencia || "Catálogo Senabella",
        proveedor: "Proveedor Senabella",
        origenCatalogo: true
      }));

      const combinados = [...productosPredeterminados, ...productosDelCatalogo];
      localStorage.setItem(PRODUCTOS_ADMIN_KEY, JSON.stringify(combinados));
      return combinados;
    }
    return guardados;
  } catch {
    return productosPredeterminados;
  }
}

// Utility to get the maximum available stock for a product, matching the dashboard/admin products
export function obtenerStockDeProducto(nombre, id = null) {
  if (!nombre && !id) return 0;

  try {
    let productosGuardados = JSON.parse(localStorage.getItem(PRODUCTOS_ADMIN_KEY) || "null");
    if (!Array.isArray(productosGuardados)) {
      productosGuardados = asegurarInicializacionProductosAdmin();
    }

    if (Array.isArray(productosGuardados)) {
      // Buscar primero por ID si está disponible
      if (id !== null && id !== undefined) {
        const matchId = productosGuardados.find((p) => String(p.id) === String(id) || String(p.id) === `catalogo-${id}`);
        if (matchId && typeof matchId.stock !== "undefined") {
          return Math.max(0, parseInt(matchId.stock, 10) || 0);
        }
      }

      // Buscar por nombre normalizado
      if (nombre) {
        const nombreLimpio = nombre.trim().toLowerCase();
        const match = productosGuardados.find(
          (p) => (p.nombre || "").trim().toLowerCase() === nombreLimpio
        );
        if (match && typeof match.stock !== "undefined") {
          return Math.max(0, parseInt(match.stock, 10) || 0);
        }
      }
    }
  } catch (e) {
    console.error("Error al consultar stock del producto en el panel admin:", e);
  }

  return 10;
}
