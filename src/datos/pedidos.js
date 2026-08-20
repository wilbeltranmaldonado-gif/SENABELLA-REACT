// ==========================================
// BASE DE DATOS DE PEDIDOS - SENABELLA
// ==========================================

import imgZapatos from "../assets/zapatos.jpg";
import imgPareja from "../assets/pareja.jpeg";

export const pedidosDemo = [
  {
    id: "#SN-20491",
    numero: "#SN-20491",
    cliente: {
      nombre: "Valentina Morales Castro",
      email: "valentina.morales@gmail.com",
      telefono: "315 892 3410",
      direccion: "Calle 127 # 19-45, Apto 502, Usaquén",
      ciudad: "Bogotá D.C."
    },
    email: "valentina.morales@gmail.com",
    telefono: "315 892 3410",
    direccion: "Calle 127 # 19-45, Apto 502, Usaquén",
    ciudad: "Bogotá D.C.",
    total: "$ 1.195.400",
    metodoPago: "Nequi #315-892-3410",
    estado: "pendiente",
    fecha: "2026-08-19 15:40",
    items: 3,
    comprobante: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9k0AXSE_NtuFs28dU7tQaQvSArCackXXm_pWkQZTDYA&s",
    productos: [
      {
        nombre: "Kindle paperwhite 2024 32gb 7\" Signature Edition Negra",
        cantidad: 1,
        precioText: "$ 979.900",
        img: "https://media.falabella.com/falabellaCO/142972175_01/w=1200,h=1200,fit=pad",
        categoria: "Tecnología",
        marca: "LENOVO"
      },
      {
        nombre: "Audifonos Xiaomi Redmi Buds 8 Lite",
        cantidad: 2,
        precioText: "$ 107.750",
        img: "https://media.falabella.com/falabellaCO/155500313_01/w=1200,h=1200,fit=pad",
        categoria: "Tecnología",
        marca: "XIAOMI"
      }
    ]
  },
  {
    id: "#SN-20490",
    numero: "#SN-20490",
    cliente: {
      nombre: "Andrés Felipe Ospina",
      email: "andres.ospina@outlook.com",
      telefono: "301 445 6721",
      direccion: "Carrera 43A # 1Sur-180, El Poblado",
      ciudad: "Medellín"
    },
    email: "andres.ospina@outlook.com",
    telefono: "301 445 6721",
    direccion: "Carrera 43A # 1Sur-180, El Poblado",
    ciudad: "Medellín",
    total: "$ 4.139.700",
    metodoPago: "Bancolombia Ahorros",
    estado: "procesando",
    fecha: "2026-08-19 11:15",
    items: 3,
    comprobante: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXyOoSx2cgbgcBw6qOwljz_Kyk40t6Tq3uNMrDKvfwdg&s=10",
    productos: [
      {
        nombre: "Portátil Gamer ASUS TUF Gaming F15 Intel Core i7 16GB RAM RTX 3050",
        cantidad: 1,
        precioText: "$ 3.899.900",
        img: "https://media.falabella.com.co/falabellaCO/73354813_01/width=340,height=340,quality=70,format=webp,fit=pad",
        categoria: "Tecnología",
        marca: "ASUS"
      },
      {
        nombre: "Kit Teclado y Mouse Inalámbrico Logitech MK270 Conexión USB 2.4GHz",
        cantidad: 1,
        precioText: "$ 119.900",
        img: "https://media.falabella.com.co/falabellaCO/124164429_01/w=1200,h=1200,fit=pad",
        categoria: "Tecnología",
        marca: "LOGITECH"
      },
      {
        nombre: "Mochila Antirrobo USB Impermeable Laptop 15.6\" Viaje Urbano Negra",
        cantidad: 1,
        precioText: "$ 119.900",
        img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXyOoSx2cgbgcBw6qOwljz_Kyk40t6Tq3uNMrDKvfwdg&s=10",
        categoria: "Accesorios",
        marca: "SENABELLA"
      }
    ]
  },
  {
    id: "#SN-20489",
    numero: "#SN-20489",
    cliente: {
      nombre: "Camila Restrepo Gómez",
      email: "camila.restrepo@hotmail.com",
      telefono: "318 630 1982",
      direccion: "Avenida 4N # 26N-32, San Vicente",
      ciudad: "Cali"
    },
    email: "camila.restrepo@hotmail.com",
    telefono: "318 630 1982",
    direccion: "Avenida 4N # 26N-32, San Vicente",
    ciudad: "Cali",
    total: "$ 959.800",
    metodoPago: "Daviplata",
    estado: "enviado",
    fecha: "2026-08-18 18:22",
    items: 2,
    comprobante: null,
    productos: [
      {
        nombre: "Look de pareja: Propuesta elegante y romántica para celebraciones",
        cantidad: 1,
        precioText: "$ 359.900",
        img: imgPareja,
        categoria: "Parejas",
        marca: "SENABELLA"
      },
      {
        nombre: "Reloj Mujer Michael Kors MK5774 Dorado Acero Inoxidable Elegante",
        cantidad: 1,
        precioText: "$ 599.900",
        img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9k0AXSE_NtuFs28dU7tQaQvSArCackXXm_pWkQZTDYA&s",
        categoria: "Accesorios",
        marca: "MICHAEL KORS"
      }
    ]
  },
  {
    id: "#SN-20488",
    numero: "#SN-20488",
    cliente: {
      nombre: "Santiago Bermúdez Rivas",
      email: "santiago.bermudez@gmail.com",
      telefono: "320 781 9043",
      direccion: "Carrera 53 # 79-112, Alto Prado",
      ciudad: "Barranquilla"
    },
    email: "santiago.bermudez@gmail.com",
    telefono: "320 781 9043",
    direccion: "Carrera 53 # 79-112, Alto Prado",
    ciudad: "Barranquilla",
    total: "$ 1.788.220",
    metodoPago: "Bancolombia Transferencia",
    estado: "completado",
    fecha: "2026-08-18 09:30",
    items: 4,
    comprobante: "https://media.falabella.com.co/falabellaCO/137155110_01/width=480,height=480,quality=70,format=webp,fit=pad",
    productos: [
      {
        nombre: "Impresora Multifuncional Smart Tank 585 Wifi + resma",
        cantidad: 1,
        precioText: "$ 679.900",
        img: "https://media.falabella.com.co/falabellaCO/137155110_01/width=480,height=480,quality=70,format=webp,fit=pad",
        categoria: "Tecnología",
        marca: "HP"
      },
      {
        nombre: "Disco duro externo 2tb toshiba usb 3.0 + estuche",
        cantidad: 2,
        precioText: "$ 429.210",
        img: "https://media.falabella.com/falabellaCO/124164429_01/w=1200,h=1200,fit=pad",
        categoria: "Tecnología",
        marca: "TOSHIBA"
      },
      {
        nombre: "Licencia Microsoft 365 Personal 1 Año Suscripción Digital 1 Usuario",
        cantidad: 1,
        precioText: "$ 249.900",
        img: "https://media.falabella.com.co/falabellaCO/73424390_1/w=1200,h=1200,fit=pad",
        categoria: "Tecnología",
        marca: "MICROSOFT"
      }
    ]
  },
  {
    id: "#SN-20487",
    numero: "#SN-20487",
    cliente: {
      nombre: "Daniela Cárdenas Silva",
      email: "daniela.cardenas@yahoo.es",
      telefono: "311 509 2314",
      direccion: "Calle 36 # 28-15, Cabecera del Llano",
      ciudad: "Bucaramanga"
    },
    email: "daniela.cardenas@yahoo.es",
    telefono: "311 509 2314",
    direccion: "Calle 36 # 28-15, Cabecera del Llano",
    ciudad: "Bucaramanga",
    total: "$ 509.700",
    metodoPago: "Pago Contra Entrega",
    estado: "pendiente",
    fecha: "2026-08-17 20:10",
    items: 3,
    comprobante: null,
    productos: [
      {
        nombre: "Tenis Running Mujer Nike Revolution 6 Rosados Ligeros Amortiguación",
        cantidad: 1,
        precioText: "$ 299.900",
        img: imgZapatos,
        categoria: "Calzado",
        marca: "NIKE"
      },
      {
        nombre: "Falda Plisada Midi Mujer Elegante Cintura Alta Color Rosa Blush",
        cantidad: 1,
        precioText: "$ 99.900",
        img: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=500&auto=format&fit=crop",
        categoria: "Mujer",
        marca: "SENABELLA"
      },
      {
        nombre: "Vestido Casual Mujer Verano Algodón Fresco Estampado Tropical",
        cantidad: 1,
        precioText: "$ 109.900",
        img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjKdXGl7rnBy90A7PrDWzd2WUlkjIrgmFp2nCPsEW8TA&s=10",
        categoria: "Mujer",
        marca: "ZARA"
      }
    ]
  },
  {
    id: "#SN-20486",
    numero: "#SN-20486",
    cliente: {
      nombre: "Mateo Quintana Vega",
      email: "mateo.quintana@gmail.com",
      telefono: "317 392 8415",
      direccion: "Calle 5B # 11-40, Bocagrande",
      ciudad: "Cartagena"
    },
    email: "mateo.quintana@gmail.com",
    telefono: "317 392 8415",
    direccion: "Calle 5B # 11-40, Bocagrande",
    ciudad: "Cartagena",
    total: "$ 6.657.800",
    metodoPago: "Nequi #317-392-8415",
    estado: "completado",
    fecha: "2026-08-17 14:05",
    items: 2,
    comprobante: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSn8UWZ26nTqWpCzbzjgGJU_NAVvXz8R8f0GvMHIz4FdA&s=10",
    productos: [
      {
        nombre: "PlayStation 4",
        cantidad: 1,
        precioText: "$ 3.999.900",
        img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSn8UWZ26nTqWpCzbzjgGJU_NAVvXz8R8f0GvMHIz4FdA&s=10",
        categoria: "Tecnología",
        marca: "SONY"
      },
      {
        nombre: "Tableta gráfica digital",
        cantidad: 1,
        precioText: "$ 2.657.900",
        img: "https://media.falabella.com/falabellaCO/119583403_01/w=276,h=276,fit=pad",
        categoria: "Tecnología",
        marca: "WACOM"
      }
    ]
  },
  {
    id: "#SN-20485",
    numero: "#SN-20485",
    cliente: {
      nombre: "Lucía Salazar Montoya",
      email: "lucia.salazar@outlook.com",
      telefono: "316 482 1190",
      direccion: "Avenida Circunvalar # 14-88, Pinares",
      ciudad: "Pereira"
    },
    email: "lucia.salazar@outlook.com",
    telefono: "316 482 1190",
    direccion: "Avenida Circunvalar # 14-88, Pinares",
    ciudad: "Pereira",
    total: "$ 329.700",
    metodoPago: "Bancolombia Transferencia",
    estado: "enviado",
    fecha: "2026-08-16 16:45",
    items: 3,
    comprobante: null,
    productos: [
      {
        nombre: "Camisa Formal Hombre Manga Larga Algodón Slim Fit Azul Cielo",
        cantidad: 2,
        precioText: "$ 79.900",
        img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnDqQqSP84fNnqRcMz9-8BWPGqB54NA0x0oLuH6AzZWQ&s",
        categoria: "Hombre",
        marca: "SENABELLA"
      },
      {
        nombre: "Sudadera con Capucha Hombre Adidas Essentials 3 Franjas Algodón Gris",
        cantidad: 1,
        precioText: "$ 169.900",
        img: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500&auto=format&fit=crop",
        categoria: "Hombre",
        marca: "ADIDAS"
      }
    ]
  },
  {
    id: "#SN-20484",
    numero: "#SN-20484",
    cliente: {
      nombre: "Sebastián Pardo Herrera",
      email: "sebastian.pardo@gmail.com",
      telefono: "300 923 7105",
      direccion: "Carrera 15 # 85-30, Antiguo Country",
      ciudad: "Bogotá D.C."
    },
    email: "sebastian.pardo@gmail.com",
    telefono: "300 923 7105",
    direccion: "Carrera 15 # 85-30, Antiguo Country",
    ciudad: "Bogotá D.C.",
    total: "$ 1.599.000",
    metodoPago: "Transferencia Bancaria",
    estado: "cancelado",
    fecha: "2026-08-16 10:20",
    items: 1,
    comprobante: null,
    productos: [
      {
        nombre: "Kit de internet satelital estándar V4",
        cantidad: 1,
        precioText: "$ 1.599.000",
        img: "https://media.falabella.com.co/falabellaCO/73053329_1/width=340,height=340,quality=70,format=webp,fit=pad",
        categoria: "Tecnología",
        marca: "STARLINK"
      }
    ]
  }
];

export function obtenerPedidosAdmin() {
  try {
    const ordenes = JSON.parse(localStorage.getItem("senabella_admin_orders") || "[]");
    if (Array.isArray(ordenes) && ordenes.length > 0) {
      // Reemplaza automáticamente las órdenes antiguas de muestra si existen
      const tieneFormatoAntiguo = ordenes.some((o) =>
        String(o.id || o.numero || "").startsWith("#SN-1048")
      );
      if (tieneFormatoAntiguo) {
        localStorage.setItem("senabella_admin_orders", JSON.stringify(pedidosDemo));
        return pedidosDemo;
      }
      return ordenes;
    }
    localStorage.setItem("senabella_admin_orders", JSON.stringify(pedidosDemo));
    return pedidosDemo;
  } catch {
    return pedidosDemo;
  }
}
