// Utility to get the maximum available stock for a product, matching the dashboard/admin products
export function obtenerStockDeProducto(nombre) {
  if (!nombre) return 10;

  try {
    const PRODUCTOS_ADMIN_KEY = "senabella_admin_products";
    const productosGuardados = JSON.parse(localStorage.getItem(PRODUCTOS_ADMIN_KEY));
    if (Array.isArray(productosGuardados)) {
      const match = productosGuardados.find(
        (p) => p.nombre.trim().toLowerCase() === nombre.trim().toLowerCase()
      );
      if (match && typeof match.stock !== "undefined") {
        return Number(match.stock);
      }
    }
  } catch (e) {
    console.error("Error reading stock from admin products:", e);
  }

  // Fallbacks if not found in localStorage (e.g. before visiting the admin dashboard)
  const nombreLimpio = nombre.trim().toLowerCase();
  
  // Default admin products
  const predeterminados = [
    { nombre: "Auriculares Bluetooth", stock: 45 },
    { nombre: "Smartwatch Pro", stock: 23 },
    { nombre: "Cargador USB-C", stock: 120 },
    { nombre: "Batería Portátil", stock: 8 },
    { nombre: "Teclado Mecánico", stock: 0 }
  ];
  
  const matchPredet = predeterminados.find(
    (p) => p.nombre.toLowerCase() === nombreLimpio
  );
  if (matchPredet) return matchPredet.stock;

  // Default stock for any catalog product is 10 as defined in dashboard/vistas/productos.jsx
  return 10;
}
