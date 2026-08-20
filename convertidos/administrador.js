/* =========================================================================
   SENABELLA · admin.js
   - Datos simulados del dashboard (reemplazar por datos reales del backend)
   - Genera las tarjetas KPI, tablas y listas de cada vista
   - Inicializa las gráficas con Chart.js
   - Sistema de modales y notificaciones (toasts) reutilizable
   - Da funcionalidad real a cada botón: crear/editar/eliminar registros,
     exportar reportes, buscar, reabastecer stock, guardar configuración
   - Maneja sidebar móvil, dropdowns y modo oscuro (comparte localStorage
     con el resto del sitio, para que el tema se mantenga consistente)
   ========================================================================= */

(function () {
  "use strict";
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  const formatoCOP = (valor) =>
    "$" + Math.round(valor).toLocaleString("es-CO");

  /* =====================================================================
     DATOS SIMULADOS
     ===================================================================== */
  const KPIS = [
    {
      etiqueta: "Ventas de hoy",
      valor: "$12.480.000",
      tendencia: "+8.2% vs. ayer",
      positiva: true,
      icono: "fa-solid fa-sack-dollar",
      color: "#2fa84f",
      colorBg: "#e8f7ec",
      chispa: [8, 10, 9, 12, 11, 14, 16],
    },
    {
      etiqueta: "Pedidos nuevos",
      valor: "34",
      tendencia: "+5 vs. ayer",
      positiva: true,
      icono: "fa-solid fa-cart-shopping",
      color: "#3e8ed0",
      colorBg: "#e8f2fb",
      chispa: [20, 22, 18, 25, 24, 30, 34],
    },
    {
      etiqueta: "Productos activos",
      valor: "512",
      tendencia: "-3 esta semana",
      positiva: false,
      icono: "fa-solid fa-box",
      color: "#dc9a1f",
      colorBg: "#fdf3e0",
      chispa: [520, 518, 515, 517, 514, 513, 512],
    },
    {
      etiqueta: "Clientes registrados",
      valor: "8.940",
      tendencia: "+112 este mes",
      positiva: true,
      icono: "fa-solid fa-users",
      color: "#aad100",
      colorBg: "#f4fae0",
      chispa: [8700, 8760, 8790, 8830, 8860, 8905, 8940],
    },
  ];

  const VENTAS_SEMANA = {
    etiquetas: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
    valores: [4200000, 5100000, 4800000, 6200000, 7100000, 9800000, 8300000],
  };

  const PEDIDOS_ESTADO = {
    etiquetas: ["Entregado", "En camino", "Pendiente", "Cancelado"],
    valores: [148, 42, 19, 7],
    colores: ["#2fa84f", "#3e8ed0", "#dc9a1f", "#e0503f"],
  };

  const ESTADOS_INFO = {
    "entregado": { texto: "Entregado", clase: "admin-badge-success" },
    "en-camino": { texto: "En camino", clase: "admin-badge-info" },
    "pendiente": { texto: "Pendiente", clase: "admin-badge-warning" },
    "pendiente-verificacion": { texto: "Verificar Pago", clase: "admin-badge-warning" },
    "cancelado": { texto: "Cancelado", clase: "admin-badge-danger" },
  };

  let contadorPedido = 10482;
  const PEDIDOS_RECIENTES = [
    { id: "SN-10482", cliente: "Pedro Quijano", correo: "pequijano30@gmail.com", producto: "Zapatillas Runner Pro", estado: "pendiente", total: 389900 },
    { id: "SN-10481", cliente: "Laura Gómez", correo: "laura.gomez@mail.com", producto: "Licuadora Oster 600W", estado: "en-camino", total: 219900 },
    { id: "SN-10480", cliente: "Andrés Torres", correo: "atorres@mail.com", producto: 'Smart TV 55" 4K', estado: "entregado", total: 1899900 },
    { id: "SN-10479", cliente: "Camila Ruiz", correo: "camila.ruiz@mail.com", producto: "Set de sábanas Queen", estado: "entregado", total: 149900 },
    { id: "SN-10478", cliente: "Julián Rojas", correo: "jrojas@mail.com", producto: "Audífonos inalámbricos", estado: "cancelado", total: 99900 },
    { id: "SN-10477", cliente: "Valentina Díaz", correo: "vdiaz@mail.com", producto: "Cafetera espresso", estado: "en-camino", total: 459900 },
  ];

  const PRODUCTOS_SEMILLA = [
  {
    "id": 1,
    "nombre": "Kindle paperwhite 2024 32gb 7\" Signature Edition Negra",
    "categoria": "Tecnología",
    "marca": "LENOVO",
    "precio": 979900,
    "precioAntiguo": 1399000,
    "descuento": 30,
    "stock": 24,
    "minimo": 5,
    "imagen": "https://media.falabella.com/falabellaCO/142972175_01/w=1200,h=1200,fit=pad",
    "descripcion": "",
    "referencia": "por pctel computo"
  },
  {
    "id": 2,
    "nombre": "Impresora Multifuncional Smart Tank 585 Wifi + resma",
    "categoria": "Tecnología",
    "marca": "HP",
    "precio": 679900,
    "precioAntiguo": 1199000,
    "descuento": 43,
    "stock": 22,
    "minimo": 5,
    "imagen": "https://media.falabella.com.co/falabellaCO/137155110_01/width=480,height=480,quality=70,format=webp,fit=pad",
    "descripcion": "",
    "referencia": "Por TS ONLINE"
  },
  {
    "id": 3,
    "nombre": "Portátil 15.6\" Full HD AMD Ryzen 7 7730U 16GB RAM 512GB SSD Plata",
    "categoria": "Tecnología",
    "marca": "HP",
    "precio": 1979900,
    "precioAntiguo": 3699780,
    "descuento": 46,
    "stock": 16,
    "minimo": 5,
    "imagen": "https://media.falabella.com.co/falabellaCO/127619968_01/width=480,height=480,quality=70,format=webp,fit=pad",
    "descripcion": "",
    "referencia": "Por Compumarket Bga"
  },
  {
    "id": 4,
    "nombre": "Kit de internet satelital estándar V4",
    "categoria": "Tecnología",
    "marca": "STARLINK",
    "precio": 1599000,
    "precioAntiguo": 3599900,
    "descuento": 44,
    "stock": 13,
    "minimo": 5,
    "imagen": "https://media.falabella.com.co/falabellaCO/73053329_1/width=340,height=340,quality=70,format=webp,fit=pad",
    "descripcion": "",
    "referencia": ""
  },
  {
    "id": 5,
    "nombre": "Portátil HP 15-Fc0276La Amd Ryzen7 7730U 8Cores/16Gb/ 1Tb Ssd/Fhd\r\n              15.6/ Plateado Natural Win11 1.59Kg",
    "categoria": "Tecnología",
    "marca": "HP",
    "precio": 279900,
    "precioAntiguo": 599900,
    "descuento": 53,
    "stock": 18,
    "minimo": 5,
    "imagen": "https://media.falabella.com.co/falabellaCO/73354813_01/width=340,height=340,quality=70,format=webp,fit=pad",
    "descripcion": "",
    "referencia": "Por SENABELLA"
  },
  {
    "id": 6,
    "nombre": "Tablet Lenovo Tab Plus 8GB RAM 128GB / 8 Speakers / Funda +\r\n              auriculares Moto Buds",
    "categoria": "Tecnología",
    "marca": "LENOVO",
    "precio": 809900,
    "precioAntiguo": 1999900,
    "descuento": 60,
    "stock": 6,
    "minimo": 5,
    "imagen": "https://media.falabella.com.co/falabellaCO/139001771_01/width=480,height=480,quality=70,format=webp,fit=pad",
    "descripcion": "Gris",
    "referencia": "Lenovo asia pacific limited sucursal colombia"
  },
  {
    "id": 7,
    "nombre": "Impresora Multifuncional HP Smart Tank 585 Wifi + resma",
    "categoria": "Tecnología",
    "marca": "HP",
    "precio": 679900,
    "precioAntiguo": 1199000,
    "descuento": 43,
    "stock": 8,
    "minimo": 5,
    "imagen": "https://media.falabella.com.co/falabellaCO/134370606_01/width=480,height=480,quality=70,format=webp,fit=pad",
    "descripcion": "",
    "referencia": "por ts online"
  },
  {
    "id": 8,
    "nombre": "Disco duro externo 2tb toshiba usb 3.0 + estuche",
    "categoria": "Tecnología",
    "marca": "TOSHIBA",
    "precio": 429210,
    "precioAntiguo": 550000,
    "descuento": 22,
    "stock": 16,
    "minimo": 5,
    "imagen": "https://media.falabella.com/falabellaCO/124164429_01/w=1200,h=1200,fit=pad",
    "descripcion": "",
    "referencia": ""
  },
  {
    "id": 9,
    "nombre": "Portátil Dell Inspiron 15 3520 Intel Core i5 16GB RAM 512GB SSD 15.6\"",
    "categoria": "Tecnología",
    "marca": "DELL",
    "precio": 2199900,
    "precioAntiguo": 3299900,
    "descuento": 35,
    "stock": 10,
    "minimo": 5,
    "imagen": "https://media.falabella.com.co/falabellaCO/127619968_01/width=480,height=480,quality=70,format=webp,fit=pad",
    "descripcion": "",
    "referencia": "Por SENABELLA"
  },
  {
    "id": 10,
    "nombre": "Portátil Gamer ASUS TUF Gaming F15 Intel Core i7 16GB RAM RTX 3050",
    "categoria": "Tecnología",
    "marca": "ASUS",
    "precio": 3899900,
    "precioAntiguo": 5399900,
    "descuento": 28,
    "stock": 23,
    "minimo": 5,
    "imagen": "https://media.falabella.com.co/falabellaCO/73354813_01/width=340,height=340,quality=70,format=webp,fit=pad",
    "descripcion": "",
    "referencia": "Por SENABELLA"
  },
  {
    "id": 11,
    "nombre": "Impresora Multifuncional Epson EcoTank L3250 Wi-Fi Tinta Continua",
    "categoria": "Tecnología",
    "marca": "EPSON",
    "precio": 799900,
    "precioAntiguo": 1099900,
    "descuento": 25,
    "stock": 8,
    "minimo": 5,
    "imagen": "https://media.falabella.com.co/falabellaCO/137155110_01/width=480,height=480,quality=70,format=webp,fit=pad",
    "descripcion": "",
    "referencia": "Por TS ONLINE"
  },
  {
    "id": 12,
    "nombre": "Portátil Acer Aspire 5 Intel Core i5 8GB RAM 512GB SSD 15.6\" Full HD",
    "categoria": "Tecnología",
    "marca": "ACER",
    "precio": 1849900,
    "precioAntiguo": 2599900,
    "descuento": 30,
    "stock": 8,
    "minimo": 5,
    "imagen": "https://media.falabella.com.co/falabellaCO/127619968_01/width=480,height=480,quality=70,format=webp,fit=pad",
    "descripcion": "",
    "referencia": "Por SENABELLA"
  },
  {
    "id": 13,
    "nombre": "Kit Teclado y Mouse Inalámbrico Logitech MK270 Conexión USB 2.4GHz",
    "categoria": "Tecnología",
    "marca": "LOGITECH",
    "precio": 119900,
    "precioAntiguo": 159900,
    "descuento": 20,
    "stock": 19,
    "minimo": 5,
    "imagen": "https://media.falabella.com.co/falabellaCO/124164429_01/w=1200,h=1200,fit=pad",
    "descripcion": "",
    "referencia": "Por SENABELLA"
  },
  {
    "id": 14,
    "nombre": "Licencia Microsoft 365 Personal 1 Año Suscripción Digital 1 Usuario",
    "categoria": "Tecnología",
    "marca": "MICROSOFT",
    "precio": 249900,
    "precioAntiguo": 299900,
    "descuento": 15,
    "stock": 23,
    "minimo": 5,
    "imagen": "https://media.falabella.com/falabellaCO/73424390_1/w=1200,h=1200,fit=pad",
    "descripcion": "",
    "referencia": "Por SENABELLA"
  },
  {
    "id": 15,
    "nombre": "Procesador AMD Ryzen 7 5700G 8 Núcleos 3.8GHz Gráficos Radeon Vega",
    "categoria": "Tecnología",
    "marca": "AMD",
    "precio": 899900,
    "precioAntiguo": 1199900,
    "descuento": 25,
    "stock": 19,
    "minimo": 5,
    "imagen": "https://media.falabella.com.co/falabellaCO/73354813_01/width=340,height=340,quality=70,format=webp,fit=pad",
    "descripcion": "",
    "referencia": "Por SENABELLA"
  },
  {
    "id": 16,
    "nombre": "Soporte de Aluminio Plegable y Ajustable para Portátil y Tablet",
    "categoria": "Tecnología",
    "marca": "GENERICO",
    "precio": 49900,
    "precioAntiguo": 89900,
    "descuento": 40,
    "stock": 13,
    "minimo": 5,
    "imagen": "https://media.falabella.com/falabellaCO/140922701_01/w=1200,h=1200,fit=pad",
    "descripcion": "",
    "referencia": "Por SENABELLA"
  },
  {
    "id": 17,
    "nombre": "Adaptador Hub USB Type-C 7 en 1 HDMI 4K USB 3.0 Lector de Tarjetas SD",
    "categoria": "Tecnología",
    "marca": "JALTECH",
    "precio": 89900,
    "precioAntiguo": 139900,
    "descuento": 35,
    "stock": 9,
    "minimo": 5,
    "imagen": "https://media.falabella.com/falabellaCO/155656024_01/w=1200,h=1200,fit=pad",
    "descripcion": "",
    "referencia": "Por SENABELLA"
  },
  {
    "id": 18,
    "nombre": "Vestido Elegante Mujer Fiesta Estampado Floral Moda Femenina Tallas S-XL",
    "categoria": "Ropa",
    "marca": "SENABELLA",
    "precio": 129900,
    "precioAntiguo": 199900,
    "descuento": 35,
    "stock": 18,
    "minimo": 5,
    "imagen": "data:image/jpeg;base64,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",
    "descripcion": "",
    "referencia": "Por SENABELLA MODA"
  },
  {
    "id": 19,
    "nombre": "Chaqueta de Cuero Sintético Hombre Slim Fit Moda Masculina Color Negro",
    "categoria": "Ropa",
    "marca": "SENABELLA",
    "precio": 189900,
    "precioAntiguo": 269900,
    "descuento": 30,
    "stock": 7,
    "minimo": 5,
    "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWgTjtC6eMdbcKiul2_AZgw2fVD3N_Wr1WEJhL0EglBg&s=10",
    "descripcion": "",
    "referencia": "Por SENABELLA MODA"
  },
  {
    "id": 20,
    "nombre": "Tenis Deportivos Hombre Nike Air Max Excee Blancos Calzado Urbano",
    "categoria": "Ropa",
    "marca": "NIKE",
    "precio": 349900,
    "precioAntiguo": 469900,
    "descuento": 25,
    "stock": 6,
    "minimo": 5,
    "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsjsSfp0bET8LXZyvw-l8lAViovXcbHb315pM1ty93D3iZ8bc7T8raqqD6&s=10",
    "descripcion": "",
    "referencia": "Por SENABELLA SPORT"
  },
  {
    "id": 21,
    "nombre": "Tenis Urbano Mujer Adidas Grand Court 2.0 Negros Calzado Deportivo",
    "categoria": "Ropa",
    "marca": "ADIDAS",
    "precio": 279900,
    "precioAntiguo": 349900,
    "descuento": 20,
    "stock": 22,
    "minimo": 5,
    "imagen": "https://i.pinimg.com/736x/e2/b2/1a/e2b21ac3e2e06a39ad45f77ce6e17613.jpg",
    "descripcion": "",
    "referencia": "Por SENABELLA SPORT"
  },
  {
    "id": 22,
    "nombre": "Blusa Casual Mujer Manga Larga Estampado Moderno Talla S-L",
    "categoria": "Ropa",
    "marca": "ZARA",
    "precio": 89900,
    "precioAntiguo": 149900,
    "descuento": 40,
    "stock": 12,
    "minimo": 5,
    "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEqA0Sdhk-P-LU_dcaY7GaK9x8e08b7k41_mmTnnnI-w&s=10",
    "descripcion": "",
    "referencia": "Por SENABELLA MODA"
  },
  {
    "id": 23,
    "nombre": "Jean Slim Fit Hombre Levi's 511 Azul Oscuro Algodón Premium",
    "categoria": "Ropa",
    "marca": "LEVI'S",
    "precio": 159900,
    "precioAntiguo": 219900,
    "descuento": 25,
    "stock": 22,
    "minimo": 5,
    "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnw1azFfbDwAhHN3GN5N2ElPJHLM_jyYOJTlzyBezRUA&s=10",
    "descripcion": "",
    "referencia": "Por SENABELLA MODA"
  },
  {
    "id": 24,
    "nombre": "Tenis Mujer Puma Carina 2.0 Rosados Plataforma Calzado Urbano",
    "categoria": "Ropa",
    "marca": "PUMA",
    "precio": 249900,
    "precioAntiguo": 359900,
    "descuento": 30,
    "stock": 10,
    "minimo": 5,
    "imagen": "https://pbs.twimg.com/media/HFp-9iYXgAAJ1-w.jpg",
    "descripcion": "",
    "referencia": "Por SENABELLA SPORT"
  },
  {
    "id": 25,
    "nombre": "Tenis Converse Chuck Taylor All Star Classic Unisex Canvas Blanco",
    "categoria": "Ropa",
    "marca": "CONVERSE",
    "precio": 219900,
    "precioAntiguo": 279900,
    "descuento": 20,
    "stock": 17,
    "minimo": 5,
    "imagen": "https://preview.redd.it/my-sister-has-been-wearing-these-converse-for-20-years-v0-3o7kf6t46mwd1.jpg?width=640&crop=smart&auto=webp&s=2b7f878b9b24a12f8bedd1f86f4968c07d0f7b2c",
    "descripcion": "",
    "referencia": "Por SENABELLA SPORT"
  },
  {
    "id": 26,
    "nombre": "Falda Plisada Midi Mujer Elegante Cintura Alta Color Rosa Blush",
    "categoria": "Ropa",
    "marca": "SENABELLA",
    "precio": 99900,
    "precioAntiguo": 139900,
    "descuento": 30,
    "stock": 24,
    "minimo": 5,
    "imagen": "data:image/jpeg;base64,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",
    "descripcion": "",
    "referencia": "Por SENABELLA MODA"
  },
  {
    "id": 27,
    "nombre": "Camisa Formal Hombre Manga Larga Algodón Slim Fit Azul Cielo",
    "categoria": "Ropa",
    "marca": "SENABELLA",
    "precio": 79900,
    "precioAntiguo": 109900,
    "descuento": 25,
    "stock": 9,
    "minimo": 5,
    "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnDqQqSP84fNnqRcMz9-8BWPGqB54NA0x0oLuH6AzZWQ&s",
    "descripcion": "",
    "referencia": "Por SENABELLA MODA"
  },
  {
    "id": 28,
    "nombre": "Reloj Mujer Michael Kors MK5774 Dorado Acero Inoxidable Elegante",
    "categoria": "Ropa",
    "marca": "MICHAEL KORS",
    "precio": 599900,
    "precioAntiguo": 929900,
    "descuento": 35,
    "stock": 16,
    "minimo": 5,
    "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9k0AXSE_NtuFs28dU7tQaQvSArCackXXm_pWkQZTDYA&s",
    "descripcion": "",
    "referencia": "Por SENABELLA MODA"
  },
  {
    "id": 29,
    "nombre": "Mochila Antirrobo USB Impermeable Laptop 15.6\" Viaje Urbano Negra",
    "categoria": "Ropa",
    "marca": "SENABELLA",
    "precio": 119900,
    "precioAntiguo": 199900,
    "descuento": 40,
    "stock": 21,
    "minimo": 5,
    "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXyOoSx2cgbgcBw6qOwljz_Kyk40t6Tq3uNMrDKvfwdg&s=10",
    "descripcion": "",
    "referencia": "Por SENABELLA"
  },
  {
    "id": 30,
    "nombre": "Sudadera con Capucha Hombre Adidas Essentials 3 Franjas Algodón Gris",
    "categoria": "Ropa",
    "marca": "ADIDAS",
    "precio": 169900,
    "precioAntiguo": 239900,
    "descuento": 30,
    "stock": 17,
    "minimo": 5,
    "imagen": "data:image/jpeg;base64,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",
    "descripcion": "",
    "referencia": "Por SENABELLA SPORT"
  },
  {
    "id": 31,
    "nombre": "Vestido Casual Mujer Verano Algodón Fresco Estampado Tropical",
    "categoria": "Ropa",
    "marca": "ZARA",
    "precio": 109900,
    "precioAntiguo": 149900,
    "descuento": 25,
    "stock": 17,
    "minimo": 5,
    "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjKdXGl7rnBy90A7PrDWzd2WUlkjIrgmFp2nCPsEW8TA&s=10",
    "descripcion": "",
    "referencia": "Por SENABELLA MODA"
  },
  {
    "id": 32,
    "nombre": "Tenis Running Mujer Nike Revolution 6 Rosados Ligeros Amortiguación",
    "categoria": "Ropa",
    "marca": "NIKE",
    "precio": 299900,
    "precioAntiguo": 379900,
    "descuento": 20,
    "stock": 10,
    "minimo": 5,
    "imagen": "../recursos/zapatos.jpg",
    "descripcion": "",
    "referencia": "Por SENABELLA SPORT"
  },
  {
    "id": 33,
    "nombre": "Look de pareja: Propuesta elegante y romántica para celebraciones",
    "categoria": "Ropa",
    "marca": "SENABELLA",
    "precio": 359900,
    "precioAntiguo": 459900,
    "descuento": 10,
    "stock": 11,
    "minimo": 5,
    "imagen": "../recursos/pareja.jpeg",
    "descripcion": "",
    "referencia": "Por SENABELLA MODA"
  },
  {
    "id": 34,
    "nombre": "Conjunto coordinado moderno con tonos neutros y detalles sofisticados",
    "categoria": "Ropa",
    "marca": "SENABELLA",
    "precio": 289900,
    "precioAntiguo": 389900,
    "descuento": 20,
    "stock": 13,
    "minimo": 5,
    "imagen": "../recursos/camisa_1.jpg",
    "descripcion": "",
    "referencia": "Por SENABELLA MODA"
  },
  {
    "id": 35,
    "nombre": "Detalle romántico: Texturas suaves y cortes delicados boutique",
    "categoria": "Ropa",
    "marca": "SENABELLA",
    "precio": 199900,
    "precioAntiguo": 279900,
    "descuento": 15,
    "stock": 23,
    "minimo": 5,
    "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfCB8hqTQ1Wn98tvM0-H9CBVeWy4dtQ5LsZ92XNsKNbw&s=10",
    "descripcion": "",
    "referencia": "Por SENABELLA MODA"
  },
  {
    "id": 36,
    "nombre": "Chaqueta coordinada para Él",
    "categoria": "Ropa",
    "marca": "SENABELLA",
    "precio": 189900,
    "precioAntiguo": 249900,
    "descuento": 20,
    "stock": 6,
    "minimo": 5,
    "imagen": "../recursos/camisa_2.jpg",
    "descripcion": "Diseño moderno y cómodo",
    "referencia": "Por SENABELLA MODA"
  },
  {
    "id": 37,
    "nombre": "Chaqueta coordinada para Ella",
    "categoria": "Ropa",
    "marca": "SENABELLA",
    "precio": 179900,
    "precioAntiguo": 239900,
    "descuento": 20,
    "stock": 18,
    "minimo": 5,
    "imagen": "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=400&q=80",
    "descripcion": "Diseño romántico y ligero",
    "referencia": "Por SENABELLA MODA"
  },
  {
    "id": 38,
    "nombre": "Set de camisetas coordinadas para pareja diseño casual",
    "categoria": "Ropa",
    "marca": "SENABELLA",
    "precio": 129900,
    "precioAntiguo": 189900,
    "descuento": 15,
    "stock": 17,
    "minimo": 5,
    "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhFMe-b-ektSfJSGPI-LNVY_ZHq0vd3XEW-l_NKESf1HotP4M3nAECmNA&s=10",
    "descripcion": "",
    "referencia": "Por SENABELLA MODA"
  },
  {
    "id": 39,
    "nombre": "Bufandas coordinadas para pareja ideales para el frío",
    "categoria": "Ropa",
    "marca": "SENABELLA",
    "precio": 89900,
    "precioAntiguo": 129900,
    "descuento": 25,
    "stock": 19,
    "minimo": 5,
    "imagen": "https://i.pinimg.com/736x/b5/d5/29/b5d529b50a755b34677a4ea43d781c9d.jpg",
    "descripcion": "",
    "referencia": "Por SENABELLA MODA"
  }
];

  function cargarProductosLS() {
    try {
      const guardados = localStorage.getItem("senabella_productos");
      if (guardados) {
        const parsed = JSON.parse(guardados);
        if (parsed.length < 15) { 
          localStorage.removeItem("senabella_productos"); 
          return [...PRODUCTOS_SEMILLA]; 
        }
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error("Error al leer senabella_productos de localStorage", e);
    }
    try {
      localStorage.setItem("senabella_productos", JSON.stringify(PRODUCTOS_SEMILLA));
    } catch (e) {}
    return [...PRODUCTOS_SEMILLA];
  }

  const PRODUCTOS = cargarProductosLS();
  let contadorProducto = PRODUCTOS.reduce((max, p) => Math.max(max, Number(p.id) || 0), 0) + 1;

  function guardarProductosLS() {
    try {
      localStorage.setItem("senabella_productos", JSON.stringify(PRODUCTOS));
    } catch (e) {
      console.error("Error al guardar senabella_productos en localStorage", e);
    }
  }

  let contadorCliente = 1;
  const CLIENTES = [
    { id: contadorCliente++, nombre: "Pedro Quijano", correo: "pequijano30@gmail.com", pedidos: 5, gastado: 1240000, registro: "12 ene 2025" },
    { id: contadorCliente++, nombre: "Laura Gómez", correo: "laura.gomez@mail.com", pedidos: 3, gastado: 680000, registro: "03 feb 2025" },
    { id: contadorCliente++, nombre: "Andrés Torres", correo: "atorres@mail.com", pedidos: 8, gastado: 3120000, registro: "22 nov 2024" },
    { id: contadorCliente++, nombre: "Camila Ruiz", correo: "camila.ruiz@mail.com", pedidos: 2, gastado: 299800, registro: "15 mar 2025" },
    { id: contadorCliente++, nombre: "Julián Rojas", correo: "jrojas@mail.com", pedidos: 1, gastado: 99900, registro: "30 mar 2025" },
    { id: contadorCliente++, nombre: "Valentina Díaz", correo: "vdiaz@mail.com", pedidos: 6, gastado: 1580000, registro: "09 dic 2024" },
  ];

  let contadorCategoria = 1;
  const CATEGORIAS = [
    { id: contadorCategoria++, nombre: "Ropa", icono: "fa-shirt", productos: 118 },
    { id: contadorCategoria++, nombre: "Calzado", icono: "fa-shoe-prints", productos: 64 },
    { id: contadorCategoria++, nombre: "Tecnología", icono: "fa-laptop", productos: 92 },
    { id: contadorCategoria++, nombre: "Hogar", icono: "fa-couch", productos: 145 },
    { id: contadorCategoria++, nombre: "Accesorios", icono: "fa-bag-shopping", productos: 93 },
  ];

  let contadorProveedor = 1;
  const PROVEEDORES = [
    { id: contadorProveedor++, nombre: "Textiles del Valle S.A.S.", contacto: "María Fernanda León", correo: "ventas@textilesdelvalle.com", telefono: "+57 310 555 1122", categoria: "Ropa", estado: "activo" },
    { id: contadorProveedor++, nombre: "Calzado Andino Ltda.", contacto: "Jorge Iván Salazar", correo: "contacto@calzadoandino.com", telefono: "+57 315 442 8890", categoria: "Calzado", estado: "activo" },
    { id: contadorProveedor++, nombre: "TecnoImport Colombia", contacto: "Sandra Milena Ortiz", correo: "compras@tecnoimport.co", telefono: "+57 300 987 4321", categoria: "Tecnología", estado: "pendiente" },
    { id: contadorProveedor++, nombre: "Hogar & Estilo SAS", contacto: "Camilo Herrera", correo: "pedidos@hogarestilo.com", telefono: "+57 320 118 7765", categoria: "Hogar", estado: "activo" },
    { id: contadorProveedor++, nombre: "Accesorios Bogotá E.U.", contacto: "Diana Marcela Ríos", correo: "info@accesoriosbogota.com", telefono: "+57 301 776 5544", categoria: "Accesorios", estado: "inactivo" },
  ];

  let contadorCupon = 1;
  const CUPONES = [
    { id: contadorCupon++, codigo: "BIENVENIDA10", tipo: "porcentaje", valor: 10, vigencia: "31 dic 2026", activo: true },
    { id: contadorCupon++, codigo: "ENVIOGRATIS", tipo: "valor", valor: 15000, vigencia: "30 sep 2026", activo: true },
    { id: contadorCupon++, codigo: "BLACKFRIDAY", tipo: "porcentaje", valor: 25, vigencia: "29 nov 2026", activo: false },
  ];

  /* =====================================================================
     TOASTS
     ===================================================================== */
  function mostrarToast(mensaje, tipo = "exito") {
    const contenedor = $("#adminToasts");
    if (!contenedor) return;

    const iconos = {
      exito: "fa-solid fa-circle-check",
      error: "fa-solid fa-circle-exclamation",
      info: "fa-solid fa-circle-info",
    };

    const toast = document.createElement("div");
    toast.className = `admin-toast ${tipo}`;
    toast.innerHTML = `<i class="${iconos[tipo] || iconos.info}"></i><span>${mensaje}</span>`;
    contenedor.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("saliendo");
      setTimeout(() => toast.remove(), 200);
    }, 3200);
  }

  /* =====================================================================
     MODALES
     ===================================================================== */
  function cerrarModal() {
    const raiz = $("#adminModalRaiz");
    if (raiz) raiz.innerHTML = "";
    document.removeEventListener("keydown", cerrarModalConEsc);
  }

  function cerrarModalConEsc(e) {
    if (e.key === "Escape") cerrarModal();
  }

  function abrirModal({ titulo, cuerpoHTML, textoConfirmar = "Guardar", claseConfirmar = "admin-boton-primario", alConfirmar, ocultarFooter = false }) {
    const raiz = $("#adminModalRaiz");
    if (!raiz) return;

    raiz.innerHTML = `
      <div class="admin-modal-overlay" id="adminModalOverlay">
        <div class="admin-modal" role="dialog" aria-modal="true">
          <div class="admin-modal-header">
            <h3>${titulo}</h3>
            <button type="button" class="admin-modal-cerrar" id="adminModalCerrar" aria-label="Cerrar">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div class="admin-modal-body">
            <form id="adminModalForm">${cuerpoHTML}</form>
          </div>
          ${
            ocultarFooter
              ? ""
              : `<div class="admin-modal-footer">
                  <button type="button" class="admin-boton admin-boton-secundario" id="adminModalCancelar">Cancelar</button>
                  <button type="submit" form="adminModalForm" class="admin-boton ${claseConfirmar}">${textoConfirmar}</button>
                </div>`
          }
        </div>
      </div>
    `;

    const overlay = $("#adminModalOverlay");
    const form = $("#adminModalForm");

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) cerrarModal();
    });
    $("#adminModalCerrar").addEventListener("click", cerrarModal);
    $("#adminModalCancelar")?.addEventListener("click", cerrarModal);

    if (alConfirmar) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const datos = new FormData(form);
        alConfirmar(datos, form);
      });
    }

    document.addEventListener("keydown", cerrarModalConEsc);

    setTimeout(() => $("input, select, textarea", form)?.focus(), 30);
  }

  function abrirModalConfirmacion({ titulo, mensaje, textoConfirmar = "Eliminar", alConfirmar }) {
    abrirModal({
      titulo,
      cuerpoHTML: `<p style="margin:0;color:var(--text-muted);font-size:14px;">${mensaje}</p>`,
      textoConfirmar,
      claseConfirmar: "admin-boton-peligro",
      alConfirmar: () => {
        alConfirmar();
        cerrarModal();
      },
    });
  }

  /* =====================================================================
     RENDER: Tarjetas KPI (con mini gráfico de tendencia en SVG)
     ===================================================================== */
  function crearSparkline(valores, color) {
    const ancho = 100;
    const alto = 30;
    const max = Math.max(...valores);
    const min = Math.min(...valores);
    const rango = max - min || 1;

    const puntos = valores.map((v, i) => {
      const x = (i / (valores.length - 1)) * ancho;
      const y = alto - ((v - min) / rango) * alto;
      return `${x},${y}`;
    });

    return `
      <svg class="admin-kpi-sparkline" viewBox="0 0 ${ancho} ${alto}" preserveAspectRatio="none">
        <path d="M ${puntos.join(" L ")}" style="stroke:${color}"></path>
      </svg>
    `;
  }

  function renderKpis() {
    const contenedor = $("#adminGridKpi");
    if (!contenedor) return;

    contenedor.innerHTML = KPIS.map((kpi) => `
      <div class="admin-kpi" style="--kpi-color:${kpi.color}; --kpi-color-bg:${kpi.colorBg};">
        <div class="admin-kpi-top">
          <span class="admin-kpi-icono"><i class="${kpi.icono}"></i></span>
          <span class="admin-kpi-tendencia ${kpi.positiva ? "positiva" : "negativa"}">
            <i class="fa-solid ${kpi.positiva ? "fa-arrow-trend-up" : "fa-arrow-trend-down"}"></i>
            ${kpi.tendencia}
          </span>
        </div>
        <div>
          <div class="admin-kpi-etiqueta">${kpi.etiqueta}</div>
          <div class="admin-kpi-valor">${kpi.valor}</div>
        </div>
        ${crearSparkline(kpi.chispa, kpi.color)}
      </div>
    `).join("");
  }

  /* =====================================================================
     RENDER: Tabla de pedidos (dashboard y vista de pedidos)
     Lee pedidos reales desde localStorage (senabella_admin_orders)
     y los combina con los datos de demostración.
     ===================================================================== */
  function obtenerPedidosCombinados() {
    // Pedidos reales del checkout guardados en localStorage
    let pedidosReales = [];
    try {
      pedidosReales = JSON.parse(localStorage.getItem("senabella_admin_orders")) || [];
    } catch (e) { pedidosReales = []; }

    // Convertir pedidos reales al formato de la tabla
    const realesNormalizados = pedidosReales.map((o) => ({
      id: o.numero,
      cliente: o.cliente?.telefono ? `Cliente - ${o.cliente.ciudad}` : "Cliente Online",
      correo: `${o.metodoPago}`,
      producto: o.productos && o.productos.length > 0
        ? o.productos.map(p => p.nombre).join(", ")
        : "Producto(s) de la tienda",
      estado: o.estado || "pendiente",
      total: parseFloat((o.total || "0").replace(/[^\d]/g, "")) || 0,
      _esReal: true,
      _datosCompletos: o // referencia completa incluyendo comprobante
    }));

    // Pedidos reales primero, luego los de demostración
    return [...realesNormalizados, ...PEDIDOS_RECIENTES.map(p => ({ ...p, _esReal: false }))];
  }

  function renderPedidos(filtro = "") {
    const tbody = $("#adminTablaPedidos");
    if (!tbody) return;

    const texto = filtro.trim().toLowerCase();
    const todosPedidos = obtenerPedidosCombinados();
    const lista = todosPedidos.filter((p) =>
      !texto ||
      p.id.toLowerCase().includes(texto) ||
      p.cliente.toLowerCase().includes(texto) ||
      p.producto.toLowerCase().includes(texto)
    );

    if (!lista.length) {
      tbody.innerHTML = `
        <tr><td colspan="6">
          <div class="admin-estado-vacio">
            <i class="fa-solid fa-magnifying-glass"></i>
            <p>No encontramos pedidos que coincidan con "${filtro}".</p>
          </div>
        </td></tr>`;
      return;
    }

    tbody.innerHTML = lista.map((pedido) => {
      const estadoInfo = ESTADOS_INFO[pedido.estado] || ESTADOS_INFO["pendiente"];
      const tieneComprobante = pedido._datosCompletos?.comprobante ? ' title="Tiene comprobante adjunto" style="position:relative"' : '';
      const iconoComprobante = pedido._datosCompletos?.comprobante
        ? `<i class="fa-solid fa-file-image" style="color:#7ca82b;font-size:11px;margin-left:4px;" title="Comprobante adjunto"></i>`
        : '';
      return `
        <tr>
          <td><strong>${pedido.id}</strong>${pedido._esReal ? ' <span class="admin-badge admin-badge-info" style="font-size:10px;padding:2px 6px;">Real</span>' : ''}</td>
          <td>
            <div class="admin-celda-cliente">
              ${pedido.cliente}
              <small>${pedido.correo}${iconoComprobante}</small>
            </div>
          </td>
          <td>${pedido.producto.length > 50 ? pedido.producto.substring(0, 50) + '...' : pedido.producto}</td>
          <td><span class="admin-badge ${estadoInfo.clase}">${estadoInfo.texto}</span></td>
          <td>${pedido.total > 0 ? formatoCOP(pedido.total) : pedido._datosCompletos?.total || '-'}</td>
          <td>
            <button class="admin-tabla-boton" title="Ver detalle del pedido" data-accion="ver-pedido" data-id="${pedido.id}">
              <i class="fa-regular fa-eye"></i>
            </button>
          </td>
        </tr>
      `;
    }).join("");
  }

  /* =====================================================================
     RENDER: Lista de productos con stock bajo (dashboard)
     ===================================================================== */
  function renderStockBajo() {
    const lista = $("#adminListaStock");
    if (!lista) return;

    const bajos = PRODUCTOS.filter((p) => p.stock <= p.minimo);

    if (!bajos.length) {
      lista.innerHTML = `
        <div class="admin-stock-vacio">
          <i class="fa-solid fa-circle-check"></i>
          Todo el inventario está en niveles saludables.
        </div>`;
      return;
    }

    lista.innerHTML = bajos.map((producto) => {
      const porcentaje = Math.round((producto.stock / producto.minimo) * 100);
      return `
        <li class="admin-item-stock">
          <div class="admin-stock-info">
            <p>${producto.nombre}</p>
            <span>${producto.stock} unidades (mínimo recomendado: ${producto.minimo})</span>
            <div class="admin-stock-barra">
              <div class="admin-stock-barra-relleno" style="width:${Math.min(porcentaje, 100)}%"></div>
            </div>
          </div>
          <button class="admin-stock-boton" data-accion="reabastecer" data-id="${producto.id}">Reabastecer</button>
        </li>
      `;
    }).join("");
  }

  /* =====================================================================
     RENDER: Productos
     ===================================================================== */
  function renderProductos(filtro = "") {
    const tbody = $("#adminTablaProductos");
    if (!tbody) return;

    const texto = filtro.trim().toLowerCase();
    const selectCat = $("#adminFiltroCategoria");
    const categoriaFiltro = selectCat ? selectCat.value.toLowerCase() : "";

    const lista = PRODUCTOS.filter((p) => {
      const matchTexto = !texto ||
        p.nombre.toLowerCase().includes(texto) ||
        (p.categoria && p.categoria.toLowerCase().includes(texto)) ||
        (p.marca && p.marca.toLowerCase().includes(texto));
      
      const matchCat = !categoriaFiltro || (p.categoria && p.categoria.toLowerCase() === categoriaFiltro);
      
      return matchTexto && matchCat;
    });

    if ($("#adminConteoProductos")) $("#adminConteoProductos").textContent = PRODUCTOS.length;
    if ($("#adminConteoStockBajo")) $("#adminConteoStockBajo").textContent = PRODUCTOS.filter((p) => p.stock <= p.minimo).length;

    if (!lista.length) {
      tbody.innerHTML = `
        <tr><td colspan="6">
          <div class="admin-estado-vacio">
            <i class="fa-solid fa-box-open"></i>
            <p>No hay productos que coincidan con tu búsqueda.</p>
          </div>
        </td></tr>`;
      return;
    }

    tbody.innerHTML = lista.map((p) => {
      const bajo = p.stock <= p.minimo;
      const imgUrl = p.imagen || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop";
      return `
        <tr>
          <td>
            <div style="display:flex;align-items:center;gap:12px;">
              <img src="${imgUrl}" alt="${p.nombre}" style="width:42px;height:42px;object-fit:cover;border-radius:8px;border:1px solid #e5e7eb;background:#f9fafb;flex-shrink:0;">
              <div>
                <strong style="color:var(--text-main);display:block;line-height:1.2;">${p.nombre}</strong>
                <small style="color:var(--text-muted);font-size:11px;">Marca: ${p.marca || "SENABELLA"}</small>
              </div>
            </div>
          </td>
          <td><span class="admin-badge admin-badge-info" style="font-size:11px;font-weight:600;">${p.categoria || 'General'}</span></td>
          <td><strong>${formatoCOP(p.precio)}</strong>${p.precioAntiguo ? `<br><small style="text-decoration:line-through;color:#9ca3af;">${formatoCOP(p.precioAntiguo)}</small>` : ''}</td>
          <td><strong>${p.stock}</strong> u.</td>
          <td>
            <span class="admin-badge ${bajo ? "admin-badge-warning" : "admin-badge-success"}">
              ${bajo ? "Stock bajo" : "Disponible"}
            </span>
          </td>
          <td>
            <div class="admin-tabla-acciones">
              <button class="admin-tabla-boton" title="Editar producto" data-accion="editar-producto" data-id="${p.id}">
                <i class="fa-regular fa-pen-to-square"></i>
              </button>
              <button class="admin-tabla-boton peligro" title="Eliminar producto" data-accion="eliminar-producto" data-id="${p.id}">
                <i class="fa-regular fa-trash-can"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join("");
  }

  /* =====================================================================
     RENDER: Clientes
     ===================================================================== */
  function renderClientes(filtro = "") {
    const tbody = $("#adminTablaClientes");
    if (!tbody) return;

    const texto = filtro.trim().toLowerCase();
    const lista = CLIENTES.filter((c) =>
      !texto || c.nombre.toLowerCase().includes(texto) || c.correo.toLowerCase().includes(texto)
    );

    if ($("#adminConteoClientes")) $("#adminConteoClientes").textContent = CLIENTES.length.toLocaleString("es-CO");

    if (!lista.length) {
      tbody.innerHTML = `
        <tr><td colspan="5">
          <div class="admin-estado-vacio">
            <i class="fa-solid fa-user-slash"></i>
            <p>No hay clientes que coincidan con tu búsqueda.</p>
          </div>
        </td></tr>`;
      return;
    }

    tbody.innerHTML = lista.map((c) => {
      const iniciales = c.nombre.split(" ").slice(0, 2).map((p) => p[0]).join("").toUpperCase();
      return `
        <tr>
          <td>
            <div class="admin-celda-persona">
              <span class="admin-mini-avatar">${iniciales}</span>
              <div class="admin-celda-cliente">
                ${c.nombre}
                <small>${c.correo}</small>
              </div>
            </div>
          </td>
          <td>${c.pedidos}</td>
          <td>${formatoCOP(c.gastado)}</td>
          <td>${c.registro}</td>
          <td>
            <div class="admin-tabla-acciones">
              <button class="admin-tabla-boton" title="Ver cliente" data-accion="ver-cliente" data-id="${c.id}">
                <i class="fa-regular fa-eye"></i>
              </button>
              <button class="admin-tabla-boton peligro" title="Eliminar cliente" data-accion="eliminar-cliente" data-id="${c.id}">
                <i class="fa-regular fa-trash-can"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join("");
  }

  /* =====================================================================
     RENDER: Proveedores
     ===================================================================== */
  const ESTADOS_PROVEEDOR = {
    activo: { texto: "Activo", clase: "admin-badge-success" },
    pendiente: { texto: "Pendiente", clase: "admin-badge-warning" },
    inactivo: { texto: "Inactivo", clase: "admin-badge-danger" },
  };

  function renderProveedores(filtro = "") {
    const tbody = $("#adminTablaProveedores");
    if (!tbody) return;

    const texto = filtro.trim().toLowerCase();
    const lista = PROVEEDORES.filter((p) =>
      !texto ||
      p.nombre.toLowerCase().includes(texto) ||
      p.contacto.toLowerCase().includes(texto) ||
      p.categoria.toLowerCase().includes(texto)
    );

    if ($("#adminConteoProveedores")) $("#adminConteoProveedores").textContent = PROVEEDORES.length.toLocaleString("es-CO");

    if (!lista.length) {
      tbody.innerHTML = `
        <tr><td colspan="6">
          <div class="admin-estado-vacio">
            <i class="fa-solid fa-truck-field"></i>
            <p>No hay proveedores que coincidan con tu búsqueda.</p>
          </div>
        </td></tr>`;
      return;
    }

    tbody.innerHTML = lista.map((p) => {
      const estado = ESTADOS_PROVEEDOR[p.estado] || ESTADOS_PROVEEDOR.pendiente;
      return `
        <tr>
          <td>
            <div class="admin-celda-cliente">
              ${p.nombre}
              <small>${p.contacto}</small>
            </div>
          </td>
          <td>${p.categoria}</td>
          <td>${p.correo}</td>
          <td>${p.telefono}</td>
          <td><span class="admin-badge ${estado.clase}">${estado.texto}</span></td>
          <td>
            <div class="admin-tabla-acciones">
              <button class="admin-tabla-boton" title="Editar proveedor" data-accion="editar-proveedor" data-id="${p.id}">
                <i class="fa-regular fa-pen-to-square"></i>
              </button>
              <button class="admin-tabla-boton peligro" title="Eliminar proveedor" data-accion="eliminar-proveedor" data-id="${p.id}">
                <i class="fa-regular fa-trash-can"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join("");
  }

  /* =====================================================================
     RENDER: Categorías
     ===================================================================== */
  function renderCategorias() {
    const contenedor = $("#adminGridCategorias");
    if (!contenedor) return;

    const conteos = {};
    PRODUCTOS.forEach((p) => {
      const cat = p.categoria || "Otros";
      conteos[cat] = (conteos[cat] || 0) + 1;
    });

    const categoriasBase = [
      { id: 1, nombre: "Ropa", icono: "fa-shirt" },
      { id: 2, nombre: "Calzado", icono: "fa-shoe-prints" },
      { id: 3, nombre: "Tecnología", icono: "fa-laptop" },
      { id: 4, nombre: "Hogar", icono: "fa-couch" },
      { id: 5, nombre: "Accesorios", icono: "fa-bag-shopping" },
      { id: 6, nombre: "Belleza", icono: "fa-wand-magic-sparkles" },
      { id: 7, nombre: "Relojes", icono: "fa-clock" }
    ];

    contenedor.innerHTML = categoriasBase.map((cat) => `
      <div class="admin-categoria-tarjeta">
        <span class="admin-categoria-icono"><i class="fa-solid ${cat.icono}"></i></span>
        <div class="admin-categoria-info">
          <strong>${cat.nombre}</strong>
          <span>${conteos[cat.nombre] || 0} productos activos</span>
        </div>
      </div>
    `).join("");
  }

  /* =====================================================================
     RENDER: Usuarios
     ===================================================================== */
  const ROLES_USUARIO = {
    administrador: { texto: "Admin",   clase: "admin-badge-info" },
    cliente:       { texto: "Cliente", clase: "admin-badge-success" },
  };
  const ESTADOS_USUARIO = {
    activo:   { texto: "Activo",    clase: "admin-badge-success" },
    bloqueado:{ texto: "Bloqueado", clase: "admin-badge-danger" },
  };

  function actualizarBadgeUsuarios() {
    const badge = document.getElementById("adminBadgeUsuarios");
    if (badge && window.SenabellaUsuarios) {
      badge.textContent = window.SenabellaUsuarios.obtener().length;
    }
  }

  function renderUsuarios(filtro = "") {
    const tbody = $("#adminTablaUsuarios");
    if (!tbody || !window.SenabellaUsuarios) return;

    const texto = filtro.trim().toLowerCase();
    const lista = window.SenabellaUsuarios.obtener().filter((u) =>
      !texto ||
      u.nombre.toLowerCase().includes(texto) ||
      u.correo.toLowerCase().includes(texto) ||
      u.rol.toLowerCase().includes(texto)
    );

    const total = $("#adminConteoUsuarios");
    if (total) total.textContent = window.SenabellaUsuarios.obtener().length;
    actualizarBadgeUsuarios();

    if (!lista.length) {
      tbody.innerHTML = `
        <tr><td colspan="6">
          <div class="admin-estado-vacio">
            <i class="fa-solid fa-user-slash"></i>
            <p>No hay usuarios que coincidan con la búsqueda.</p>
          </div>
        </td></tr>`;
      return;
    }

    tbody.innerHTML = lista.map((u) => {
      const rol    = ROLES_USUARIO[u.rol]    || ROLES_USUARIO.cliente;
      const estado = ESTADOS_USUARIO[u.estado] || ESTADOS_USUARIO.activo;
      const esAdmin = u.correo === "admin@senabella.com";
      return `
        <tr>
          <td>
            <div class="admin-celda-cliente">
              ${u.nombre}
              <small>${u.correo}</small>
            </div>
          </td>
          <td><span class="admin-badge ${rol.clase}">${rol.texto}</span></td>
          <td><span class="admin-badge ${estado.clase}">${estado.texto}</span></td>
          <td>${u.fechaRegistro || "—"}</td>
          <td>
            <div class="admin-tabla-acciones">
              <button class="admin-tabla-boton" title="${u.estado === 'activo' ? 'Bloquear' : 'Desbloquear'} acceso"
                data-accion="alternar-usuario" data-id="${u.id}" ${esAdmin ? 'disabled style="opacity:.4;cursor:not-allowed"' : ''}>
                <i class="fa-solid ${u.estado === 'activo' ? 'fa-lock' : 'fa-lock-open'}"></i>
              </button>
              <button class="admin-tabla-boton" title="Restablecer contraseña"
                data-accion="reset-pass-usuario" data-id="${u.id}" ${esAdmin ? 'disabled style="opacity:.4;cursor:not-allowed"' : ''}>
                <i class="fa-solid fa-key"></i>
              </button>
              <button class="admin-tabla-boton peligro" title="Eliminar usuario"
                data-accion="eliminar-usuario" data-id="${u.id}" ${esAdmin ? 'disabled style="opacity:.4;cursor:not-allowed"' : ''}>
                <i class="fa-regular fa-trash-can"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join("");
  }

  /* =====================================================================
     ACCIONES: Usuarios
     ===================================================================== */
  function nuevoUsuario() {
    abrirModal({
      titulo: "Nuevo usuario",
      textoConfirmar: "Crear usuario",
      cuerpoHTML: `
        <div class="admin-form-grupo">
          <label for="campoNombreUsr">Nombre completo</label>
          <input type="text" id="campoNombreUsr" name="nombre" placeholder="Ej. Ana García" required>
        </div>
        <div class="admin-form-grupo">
          <label for="campoCorreoUsr">Correo electrónico</label>
          <input type="email" id="campoCorreoUsr" name="correo" placeholder="correo@ejemplo.com" required>
        </div>
        <div class="admin-form-grupo">
          <label for="campoPassUsr">Contraseña</label>
          <input type="password" id="campoPassUsr" name="password" placeholder="Mínimo 6 caracteres" required minlength="6">
        </div>
        <div class="admin-form-grupo">
          <label for="campoRolUsr">Rol</label>
          <select id="campoRolUsr" name="rol">
            <option value="cliente">Cliente</option>
            <option value="administrador">Administrador</option>
          </select>
        </div>
      `,
      alConfirmar: (datos) => {
        if (!window.SenabellaUsuarios) return;
        const res = window.SenabellaUsuarios.crear({
          nombre:   datos.get("nombre").trim(),
          correo:   datos.get("correo").trim(),
          password: datos.get("password"),
          rol:      datos.get("rol"),
        });
        if (!res.ok) { mostrarToast(res.mensaje, "error"); return; }
        renderUsuarios();
        cerrarModal();
        mostrarToast("Usuario creado correctamente.");
      },
    });
  }

  function alternarUsuario(id) {
    if (!window.SenabellaUsuarios) return;
    const res = window.SenabellaUsuarios.alternarEstado(id);
    if (!res.ok) { mostrarToast(res.mensaje, "error"); return; }
    renderUsuarios();
    mostrarToast(
      res.estado === "bloqueado"
        ? "Acceso bloqueado al usuario."
        : "Acceso restaurado al usuario.",
      res.estado === "bloqueado" ? "info" : "exito"
    );
  }

  function resetPassUsuario(id) {
    if (!window.SenabellaUsuarios) return;
    const u = window.SenabellaUsuarios.obtener().find((x) => x.id === id);
    if (!u) return;
    abrirModal({
      titulo: `Restablecer contraseña — ${u.nombre}`,
      textoConfirmar: "Guardar contraseña",
      cuerpoHTML: `
        <div class="admin-form-grupo">
          <label for="campoNuevaPass">Nueva contraseña</label>
          <input type="password" id="campoNuevaPass" name="password"
            placeholder="Mínimo 6 caracteres" required minlength="6">
        </div>
      `,
      alConfirmar: (datos) => {
        const nueva = datos.get("password");
        if (nueva.length < 6) { mostrarToast("Contraseña demasiado corta.", "error"); return; }
        const res = window.SenabellaUsuarios.actualizar(id, { password: nueva });
        if (!res.ok) { mostrarToast(res.mensaje, "error"); return; }
        cerrarModal();
        mostrarToast("Contraseña actualizada correctamente.");
      },
    });
  }

  function eliminarUsuario(id) {
    if (!window.SenabellaUsuarios) return;
    const u = window.SenabellaUsuarios.obtener().find((x) => x.id === id);
    if (!u) return;
    abrirModalConfirmacion({
      titulo: "Eliminar usuario",
      mensaje: `¿Seguro que quieres eliminar a "${u.nombre}" (${u.correo})?`,
      alConfirmar: () => {
        const res = window.SenabellaUsuarios.eliminar(id);
        if (!res.ok) { mostrarToast(res.mensaje, "error"); return; }
        renderUsuarios();
        mostrarToast("Usuario eliminado.", "info");
      },
    });
  }

  /* =====================================================================
     RENDER: Cupones
     ===================================================================== */
  function renderCupones() {
    const tbody = $("#adminTablaCupones");
    if (!tbody) return;

    if (!CUPONES.length) {
      tbody.innerHTML = `
        <tr><td colspan="5">
          <div class="admin-estado-vacio">
            <i class="fa-solid fa-ticket"></i>
            <p>Todavía no has creado cupones.</p>
          </div>
        </td></tr>`;
      return;
    }

    tbody.innerHTML = CUPONES.map((c) => `
      <tr>
        <td><strong>${c.codigo}</strong></td>
        <td>${c.tipo === "porcentaje" ? c.valor + "%" : formatoCOP(c.valor)}</td>
        <td>${c.vigencia}</td>
        <td>
          <label class="admin-switch" title="${c.activo ? "Desactivar" : "Activar"} cupón">
            <input type="checkbox" data-accion="alternar-cupon" data-id="${c.id}" ${c.activo ? "checked" : ""}>
            <span class="admin-switch-riel"></span>
          </label>
        </td>
        <td>
          <button class="admin-tabla-boton peligro" title="Eliminar cupón" data-accion="eliminar-cupon" data-id="${c.id}">
            <i class="fa-regular fa-trash-can"></i>
          </button>
        </td>
      </tr>
    `).join("");
  }

  /* =====================================================================
     GRÁFICAS (Chart.js)
     ===================================================================== */
  let chartVentasInstancia = null;
  let chartEstadosInstancia = null;

  function initGraficas() {
    if (typeof Chart === "undefined") return;

    const ctxVentas = $("#chartVentas");
    if (ctxVentas) {
      if (chartVentasInstancia) chartVentasInstancia.destroy();
      chartVentasInstancia = new Chart(ctxVentas, {
        type: "bar",
        data: {
          labels: VENTAS_SEMANA.etiquetas,
          datasets: [{
            label: "Ventas",
            data: VENTAS_SEMANA.valores,
            backgroundColor: "#aad100",
            borderRadius: 6,
            maxBarThickness: 38,
          }],
        },
        options: {
          responsive: true,
          plugins: { legend: { display: false } },
          scales: {
            y: {
              ticks: {
                callback: (valor) => "$" + (valor / 1000000).toFixed(1) + "M",
              },
              grid: { color: "#eef0f3" },
            },
            x: { grid: { display: false } },
          },
        },
      });
    }

    const ctxEstados = $("#chartEstados");
    if (ctxEstados) {
      if (chartEstadosInstancia) chartEstadosInstancia.destroy();
      chartEstadosInstancia = new Chart(ctxEstados, {
        type: "doughnut",
        data: {
          labels: PEDIDOS_ESTADO.etiquetas,
          datasets: [{
            data: PEDIDOS_ESTADO.valores,
            backgroundColor: PEDIDOS_ESTADO.colores,
            borderWidth: 0,
          }],
        },
        options: {
          responsive: true,
          cutout: "68%",
          plugins: { legend: { display: false } },
        },
      });
    }

    /* Leyenda propia para el donut, con el mismo estilo del resto del panel */
    const leyenda = $("#adminLeyendaEstados");
    if (leyenda) {
      leyenda.innerHTML = PEDIDOS_ESTADO.etiquetas.map((etiqueta, i) => `
        <li>
          <span class="punto" style="background:${PEDIDOS_ESTADO.colores[i]}"></span>
          ${etiqueta} (${PEDIDOS_ESTADO.valores[i]})
        </li>
      `).join("");
    }
  }

  /* =====================================================================
     EXPORTAR CSV
     ===================================================================== */
  function descargarCSV(nombreArchivo, filas) {
    const contenido = filas.map((fila) =>
      fila.map((celda) => `"${String(celda).replace(/"/g, '""')}"`).join(",")
    ).join("\n");

    const blob = new Blob(["\uFEFF" + contenido], { type: "text/csv;charset=utf-8;" });
    const enlace = document.createElement("a");
    enlace.href = URL.createObjectURL(blob);
    enlace.download = nombreArchivo;
    document.body.appendChild(enlace);
    enlace.click();
    enlace.remove();
    URL.revokeObjectURL(enlace.href);
  }

  function exportarPedidos() {
    const filas = [["Pedido", "Cliente", "Correo", "Producto", "Estado", "Total"]];
    PEDIDOS_RECIENTES.forEach((p) =>
      filas.push([p.id, p.cliente, p.correo, p.producto, ESTADOS_INFO[p.estado].texto, p.total])
    );
    descargarCSV("senabella-pedidos.csv", filas);
    mostrarToast("Reporte de pedidos exportado.");
  }

  function exportarProductos() {
    const filas = [["Producto", "Categoría", "Precio", "Stock", "Mínimo recomendado"]];
    PRODUCTOS.forEach((p) => filas.push([p.nombre, p.categoria, p.precio, p.stock, p.minimo]));
    descargarCSV("senabella-productos.csv", filas);
    mostrarToast("Reporte de productos exportado.");
  }

  function exportarClientes() {
    const filas = [["Cliente", "Correo", "Pedidos", "Total gastado", "Registro"]];
    CLIENTES.forEach((c) => filas.push([c.nombre, c.correo, c.pedidos, c.gastado, c.registro]));
    descargarCSV("senabella-clientes.csv", filas);
    mostrarToast("Reporte de clientes exportado.");
  }

  /* =====================================================================
     ACCIONES: Pedidos
     ===================================================================== */
  function verDetallePedido(id) {
    // Buscar primero en pedidos reales del localStorage
    let pedidoReal = null;
    let pedidoSimulado = null;
    let indiceReal = -1;

    try {
      const ordenesAdmin = JSON.parse(localStorage.getItem("senabella_admin_orders")) || [];
      indiceReal = ordenesAdmin.findIndex((o) => o.numero === id);
      if (indiceReal > -1) {
        pedidoReal = ordenesAdmin[indiceReal];
      }
    } catch (e) {}

    if (!pedidoReal) {
      pedidoSimulado = PEDIDOS_RECIENTES.find((p) => p.id === id);
      if (!pedidoSimulado) return;
    }

    const esReal = !!pedidoReal;
    const estadoActual = esReal ? pedidoReal.estado : pedidoSimulado.estado;

    // Construir HTML del comprobante
    let htmlComprobante = "";
    if (esReal && pedidoReal.comprobante) {
      htmlComprobante = `
        <div style="margin-top:16px;">
          <p style="font-size:13px;font-weight:600;color:var(--text-muted);margin-bottom:8px;">Comprobante de Pago</p>
          <div style="border:2px solid #e5e7eb;border-radius:10px;overflow:hidden;text-align:center;background:#f9fafb;">
            <img src="${pedidoReal.comprobante}" alt="Comprobante de pago"
              style="max-width:100%;max-height:320px;object-fit:contain;cursor:pointer;"
              onclick="window.open(this.src,'_blank')" title="Clic para ver en tamaño completo"
            />
          </div>
          <p style="font-size:11px;color:#9ca3af;margin-top:6px;text-align:center;">Clic en la imagen para verla en tamaño completo</p>
        </div>
      `;
    } else if (esReal) {
      htmlComprobante = `
        <div style="margin-top:16px;padding:14px;background:#fef9ec;border:1px solid #f0ad4e;border-radius:8px;">
          <p style="margin:0;font-size:13px;color:#92400e;">
            <i class="fa-solid fa-triangle-exclamation" style="margin-right:6px;"></i>
            Este pedido no tiene comprobante adjunto (puede ser contra entrega).
          </p>
        </div>
      `;
    }

    // Info del cliente
    let htmlCliente = "";
    if (esReal) {
      htmlCliente = `
        <div class="admin-modal-detalle-fila"><span>Dirección</span><span>${pedidoReal.cliente?.direccion || '-'}</span></div>
        <div class="admin-modal-detalle-fila"><span>Ciudad</span><span>${pedidoReal.cliente?.ciudad || '-'}</span></div>
        <div class="admin-modal-detalle-fila"><span>Teléfono</span><span>${pedidoReal.cliente?.telefono || '-'}</span></div>
        <div class="admin-modal-detalle-fila"><span>Método de pago</span><span>${pedidoReal.metodoPago || '-'}</span></div>
        <div class="admin-modal-detalle-fila"><span>Fecha</span><span>${pedidoReal.fecha || '-'}</span></div>
      `;
    } else {
      htmlCliente = `
        <div class="admin-modal-detalle-fila"><span>Cliente</span><span>${pedidoSimulado.cliente}</span></div>
        <div class="admin-modal-detalle-fila"><span>Correo</span><span>${pedidoSimulado.correo}</span></div>
        <div class="admin-modal-detalle-fila"><span>Producto</span><span>${pedidoSimulado.producto}</span></div>
      `;
    }

    const totalTexto = esReal ? (pedidoReal.total || '-') : formatoCOP(pedidoSimulado.total);

    abrirModal({
      titulo: `Pedido ${id}`,
      textoConfirmar: "Guardar estado",
      cuerpoHTML: `
        ${htmlCliente}
        <div class="admin-modal-detalle-fila"><span>Total</span><span><strong>${totalTexto}</strong></span></div>
        ${htmlComprobante}
        <div class="admin-form-grupo" style="margin-top:16px;">
          <label for="campoEstadoPedido">Estado del pedido</label>
          <select id="campoEstadoPedido" name="estado">
            ${Object.entries(ESTADOS_INFO).map(([clave, info]) =>
              `<option value="${clave}" ${clave === estadoActual ? "selected" : ""}>${info.texto}</option>`
            ).join("")}
          </select>
        </div>
      `,
      alConfirmar: (datos) => {
        const nuevoEstado = datos.get("estado");

        if (esReal) {
          // Guardar cambio de estado en localStorage
          try {
            const ordenesAdmin = JSON.parse(localStorage.getItem("senabella_admin_orders")) || [];
            const idx = ordenesAdmin.findIndex((o) => o.numero === id);
            if (idx > -1) {
              ordenesAdmin[idx].estado = nuevoEstado;
              localStorage.setItem("senabella_admin_orders", JSON.stringify(ordenesAdmin));
            }
          } catch (e) {}
        } else {
          pedidoSimulado.estado = nuevoEstado;
        }

        const buscadorInput = $("#adminBuscadorInput");
        renderPedidos(buscadorInput ? buscadorInput.value : "");
        cerrarModal();
        mostrarToast(`Estado del pedido ${id} actualizado a "${ESTADOS_INFO[nuevoEstado]?.texto || nuevoEstado}".`);
      },
    });
  }

  function nuevoPedido() {
    abrirModal({
      titulo: "Nuevo pedido",
      textoConfirmar: "Crear pedido",
      cuerpoHTML: `
        <div class="admin-form-grupo">
          <label for="campoClientePedido">Cliente</label>
          <input type="text" id="campoClientePedido" name="cliente" placeholder="Nombre del cliente" required>
        </div>
        <div class="admin-form-grupo">
          <label for="campoProductoPedido">Producto</label>
          <input type="text" id="campoProductoPedido" name="producto" placeholder="Producto solicitado" required>
        </div>
        <div class="admin-form-fila">
          <div class="admin-form-grupo">
            <label for="campoTotalPedido">Total</label>
            <input type="number" id="campoTotalPedido" name="total" min="0" step="100" placeholder="0" required>
          </div>
          <div class="admin-form-grupo">
            <label for="campoEstadoNuevoPedido">Estado</label>
            <select id="campoEstadoNuevoPedido" name="estado">
              ${Object.entries(ESTADOS_INFO).map(([clave, info]) => `<option value="${clave}">${info.texto}</option>`).join("")}
            </select>
          </div>
        </div>
      `,
      alConfirmar: (datos) => {
        contadorPedido += 1;
        PEDIDOS_RECIENTES.unshift({
          id: `SN-${contadorPedido}`,
          cliente: datos.get("cliente").trim(),
          correo: "sin-correo@senabella.com",
          producto: datos.get("producto").trim(),
          estado: datos.get("estado"),
          total: Number(datos.get("total")) || 0,
        });
        renderPedidos();
        cerrarModal();
        mostrarToast("Pedido creado correctamente.");
      },
    });
  }

  /* =====================================================================
     ACCIONES: Productos
     ===================================================================== */
  function formularioProducto(producto) {
    const categoriasDisponibles = ["Tecnología", "Ropa", "Calzado", "Hogar", "Accesorios", "Belleza", "Relojes"];
    const catActual = producto ? producto.categoria : "Tecnología";

    return `
      <div class="admin-form-grupo">
        <label for="campoNombreProducto">Nombre del producto *</label>
        <input type="text" id="campoNombreProducto" name="nombre" value="${producto ? producto.nombre : ""}" placeholder="Ej. Laptop Gamer ASUS ROG" required>
      </div>
      <div class="admin-form-fila">
        <div class="admin-form-grupo">
          <label for="campoCategoriaProducto">Categoría *</label>
          <select id="campoCategoriaProducto" name="categoria">
            ${categoriasDisponibles.map((c) => `<option value="${c}" ${catActual === c ? "selected" : ""}>${c}</option>`).join("")}
          </select>
        </div>
        <div class="admin-form-grupo">
          <label for="campoMarcaProducto">Marca *</label>
          <input type="text" id="campoMarcaProducto" name="marca" value="${producto ? (producto.marca || "") : ""}" placeholder="Ej. LENOVO, HP, NIKE, SENABELLA" required>
        </div>
      </div>
      <div class="admin-form-fila">
        <div class="admin-form-grupo">
          <label for="campoPrecioProducto">Precio Actual ($) *</label>
          <input type="number" id="campoPrecioProducto" name="precio" min="0" step="100" value="${producto ? producto.precio : ""}" placeholder="Ej. 389900" required>
        </div>
        <div class="admin-form-grupo">
          <label for="campoPrecioAntiguoProducto">Precio Anterior / Antes ($)</label>
          <input type="number" id="campoPrecioAntiguoProducto" name="precioAntiguo" min="0" step="100" value="${producto ? (producto.precioAntiguo || "") : ""}" placeholder="Ej. 450000 (Opcional)">
        </div>
      </div>
      <div class="admin-form-fila">
        <div class="admin-form-grupo">
          <label for="campoStockProducto">Stock actual *</label>
          <input type="number" id="campoStockProducto" name="stock" min="0" value="${producto ? producto.stock : 10}" required>
        </div>
        <div class="admin-form-grupo">
          <label for="campoMinimoProducto">Stock mínimo *</label>
          <input type="number" id="campoMinimoProducto" name="minimo" min="0" value="${producto ? producto.minimo : 5}" required>
        </div>
      </div>
      <div class="admin-form-grupo">
        <label for="campoImagenUrlProducto">URL de la Imagen del Producto</label>
        <input type="url" id="campoImagenUrlProducto" name="imagenUrl" value="${producto && producto.imagen && !producto.imagen.startsWith('data:') ? producto.imagen : ""}" placeholder="https://ejemplo.com/imagen.jpg">
      </div>
      <div class="admin-form-grupo">
        <label for="campoImagenArchivoProducto">O Subir Imagen desde el equipo</label>
        <input type="file" id="campoImagenArchivoProducto" accept="image/*">
        <div id="previsualizacionImagen" style="margin-top: 10px; text-align: center;">
          ${producto && producto.imagen ? `<img src="${producto.imagen}" style="max-height: 110px; border-radius: 8px; border: 1px solid #e5e7eb; padding: 2px;">` : ""}
        </div>
      </div>
      <div class="admin-form-grupo">
        <label for="campoDescripcionProducto">Descripción y Detalles del Producto</label>
        <textarea id="campoDescripcionProducto" name="descripcion" rows="3" placeholder="Detalles, características principales o especificaciones del producto...">${producto ? (producto.descripcion || "") : ""}</textarea>
      </div>
    `;
  }

  function obtenerImagenYProcesar(form, imagenUrlDefecto, callback) {
    const fileInput = form ? form.querySelector('#campoImagenArchivoProducto') : null;
    const urlInput = form ? form.querySelector('#campoImagenUrlProducto') : null;
    const urlTexto = urlInput ? urlInput.value.trim() : "";

    if (fileInput && fileInput.files && fileInput.files[0]) {
      const reader = new FileReader();
      reader.onload = function (e) {
        callback(e.target.result);
      };
      reader.readAsDataURL(fileInput.files[0]);
    } else if (urlTexto) {
      callback(urlTexto);
    } else if (imagenUrlDefecto) {
      callback(imagenUrlDefecto);
    } else {
      callback("https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop");
    }
  }

  function enlazarPrevisualizacionImagen() {
    setTimeout(() => {
      const fileInput = $("#campoImagenArchivoProducto");
      if (fileInput) {
        fileInput.addEventListener("change", (e) => {
          if (e.target.files && e.target.files[0]) {
            const r = new FileReader();
            r.onload = (evt) => {
              const prev = $("#previsualizacionImagen");
              if (prev) {
                prev.innerHTML = `<img src="${evt.target.result}" style="max-height:110px;border-radius:8px;border:1px solid #e5e7eb;padding:2px;">`;
              }
            };
            r.readAsDataURL(e.target.files[0]);
          }
        });
      }
    }, 50);
  }

  function nuevoProducto() {
    abrirModal({
      titulo: "Nuevo producto",
      textoConfirmar: "Crear producto",
      cuerpoHTML: formularioProducto(),
      alConfirmar: (datos, form) => {
        obtenerImagenYProcesar(form, "", (imagenFinal) => {
          const precio = Number(datos.get("precio")) || 0;
          const precioAntiguo = Number(datos.get("precioAntiguo")) || 0;
          let descuento = 0;
          if (precioAntiguo > precio && precio > 0) {
            descuento = Math.round(((precioAntiguo - precio) / precioAntiguo) * 100);
          }

          const marcaNombre = (datos.get("marca") || "SENABELLA").trim().toUpperCase();

          const nuevoProd = {
            id: contadorProducto++,
            nombre: datos.get("nombre").trim(),
            categoria: datos.get("categoria"),
            marca: marcaNombre,
            precio: precio,
            precioAntiguo: precioAntiguo || null,
            descuento: descuento,
            stock: Number(datos.get("stock")) || 0,
            minimo: Number(datos.get("minimo")) || 0,
            imagen: imagenFinal,
            descripcion: (datos.get("descripcion") || "").trim(),
            referencia: `Por ${marcaNombre}`
          };

          PRODUCTOS.unshift(nuevoProd);
          guardarProductosLS();
          renderProductos();
          renderStockBajo();
          renderKpis();
          renderCategorias();
          cerrarModal();
          mostrarToast("Producto creado correctamente.");
        });
      },
    });
    enlazarPrevisualizacionImagen();
  }

  function editarProducto(id) {
    const producto = PRODUCTOS.find((p) => String(p.id) === String(id));
    if (!producto) return;

    abrirModal({
      titulo: "Editar producto",
      textoConfirmar: "Guardar cambios",
      cuerpoHTML: formularioProducto(producto),
      alConfirmar: (datos, form) => {
        obtenerImagenYProcesar(form, producto.imagen, (imagenFinal) => {
          const precio = Number(datos.get("precio")) || 0;
          const precioAntiguo = Number(datos.get("precioAntiguo")) || 0;
          let descuento = 0;
          if (precioAntiguo > precio && precio > 0) {
            descuento = Math.round(((precioAntiguo - precio) / precioAntiguo) * 100);
          }

          const marcaNombre = (datos.get("marca") || "SENABELLA").trim().toUpperCase();

          producto.nombre = datos.get("nombre").trim();
          producto.categoria = datos.get("categoria");
          producto.marca = marcaNombre;
          producto.precio = precio;
          producto.precioAntiguo = precioAntiguo || null;
          producto.descuento = descuento;
          producto.stock = Number(datos.get("stock")) || 0;
          producto.minimo = Number(datos.get("minimo")) || 0;
          producto.imagen = imagenFinal;
          producto.descripcion = (datos.get("descripcion") || "").trim();
          producto.referencia = `Por ${marcaNombre}`;

          guardarProductosLS();
          const buscadorInput = $("#adminBuscadorInput");
          renderProductos(buscadorInput ? buscadorInput.value : "");
          renderStockBajo();
          renderCategorias();
          cerrarModal();
          mostrarToast("Producto actualizado.");
        });
      },
    });
    enlazarPrevisualizacionImagen();
  }

  function eliminarProducto(id) {
    const producto = PRODUCTOS.find((p) => String(p.id) === String(id));
    if (!producto) return;

    abrirModalConfirmacion({
      titulo: "Eliminar producto",
      mensaje: `¿Seguro que quieres eliminar "${producto.nombre}"? Esta acción no se puede deshacer.`,
      alConfirmar: () => {
        const indice = PRODUCTOS.findIndex((p) => String(p.id) === String(id));
        if (indice > -1) PRODUCTOS.splice(indice, 1);
        guardarProductosLS();
        renderProductos();
        renderStockBajo();
        renderKpis();
        renderCategorias();
        mostrarToast("Producto eliminado.", "info");
      },
    });
  }

  function reabastecerProducto(id) {
    const producto = PRODUCTOS.find((p) => String(p.id) === String(id));
    if (!producto) return;

    abrirModal({
      titulo: `Reabastecer "${producto.nombre}"`,
      textoConfirmar: "Agregar al inventario",
      cuerpoHTML: `
        <div class="admin-form-grupo">
          <label for="campoCantidadReabastecer">Unidades a agregar <span class="admin-ayuda">(stock actual: ${producto.stock})</span></label>
          <input type="number" id="campoCantidadReabastecer" name="cantidad" min="1" value="${Math.max(producto.minimo - producto.stock, 5)}" required>
        </div>
      `,
      alConfirmar: (datos) => {
        const cantidad = Number(datos.get("cantidad")) || 0;
        producto.stock += cantidad;
        guardarProductosLS();
        renderStockBajo();
        const buscadorInput = $("#adminBuscadorInput");
        renderProductos(buscadorInput ? buscadorInput.value : "");
        cerrarModal();
        mostrarToast(`Se agregaron ${cantidad} unidades a "${producto.nombre}".`);
      },
    });
  }

  /* =====================================================================
     ACCIONES: Clientes
     ===================================================================== */
  function nuevoCliente() {
    abrirModal({
      titulo: "Nuevo cliente",
      textoConfirmar: "Crear cliente",
      cuerpoHTML: `
        <div class="admin-form-grupo">
          <label for="campoNombreCliente">Nombre completo</label>
          <input type="text" id="campoNombreCliente" name="nombre" placeholder="Ej. Camila Ruiz" required>
        </div>
        <div class="admin-form-grupo">
          <label for="campoCorreoCliente">Correo</label>
          <input type="email" id="campoCorreoCliente" name="correo" placeholder="correo@ejemplo.com" required>
        </div>
      `,
      alConfirmar: (datos) => {
        CLIENTES.unshift({
          id: contadorCliente++,
          nombre: datos.get("nombre").trim(),
          correo: datos.get("correo").trim(),
          pedidos: 0,
          gastado: 0,
          registro: new Date().toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" }),
        });
        renderClientes();
        cerrarModal();
        mostrarToast("Cliente creado correctamente.");
      },
    });
  }

  function verCliente(id) {
    const cliente = CLIENTES.find((c) => c.id === id);
    if (!cliente) return;

    abrirModal({
      titulo: cliente.nombre,
      ocultarFooter: true,
      cuerpoHTML: `
        <div class="admin-modal-detalle-fila"><span>Correo</span><span>${cliente.correo}</span></div>
        <div class="admin-modal-detalle-fila"><span>Pedidos realizados</span><span>${cliente.pedidos}</span></div>
        <div class="admin-modal-detalle-fila"><span>Total gastado</span><span>${formatoCOP(cliente.gastado)}</span></div>
        <div class="admin-modal-detalle-fila"><span>Cliente desde</span><span>${cliente.registro}</span></div>
      `,
    });
  }

  function eliminarCliente(id) {
    const cliente = CLIENTES.find((c) => c.id === id);
    if (!cliente) return;

    abrirModalConfirmacion({
      titulo: "Eliminar cliente",
      mensaje: `¿Seguro que quieres eliminar a "${cliente.nombre}" de tu base de clientes?`,
      alConfirmar: () => {
        const indice = CLIENTES.findIndex((c) => c.id === id);
        if (indice > -1) CLIENTES.splice(indice, 1);
        renderClientes();
        mostrarToast("Cliente eliminado.", "info");
      },
    });
  }

  /* =====================================================================
     ACCIONES: Proveedores
     ===================================================================== */
  function nuevoProveedor() {
    abrirModal({
      titulo: "Nuevo proveedor",
      textoConfirmar: "Crear proveedor",
      cuerpoHTML: `
        <div class="admin-form-grupo">
          <label for="campoNombreProveedor">Nombre de la empresa</label>
          <input type="text" id="campoNombreProveedor" name="nombre" placeholder="Ej. Textiles del Valle S.A.S." required>
        </div>
        <div class="admin-form-grupo">
          <label for="campoContactoProveedor">Persona de contacto</label>
          <input type="text" id="campoContactoProveedor" name="contacto" placeholder="Ej. María Fernanda León" required>
        </div>
        <div class="admin-form-grupo">
          <label for="campoCorreoProveedor">Correo</label>
          <input type="email" id="campoCorreoProveedor" name="correo" placeholder="correo@proveedor.com" required>
        </div>
        <div class="admin-form-grupo">
          <label for="campoTelefonoProveedor">Teléfono</label>
          <input type="text" id="campoTelefonoProveedor" name="telefono" placeholder="+57 300 000 0000" required>
        </div>
        <div class="admin-form-grupo">
          <label for="campoCategoriaProveedor">Categoría que abastece</label>
          <input type="text" id="campoCategoriaProveedor" name="categoria" placeholder="Ej. Tecnología" required>
        </div>
        <div class="admin-form-grupo">
          <label for="campoEstadoProveedor">Estado</label>
          <select id="campoEstadoProveedor" name="estado">
            <option value="activo">Activo</option>
            <option value="pendiente">Pendiente</option>
            <option value="inactivo">Inactivo</option>
          </select>
        </div>
      `,
      alConfirmar: (datos) => {
        PROVEEDORES.unshift({
          id: contadorProveedor++,
          nombre: datos.get("nombre").trim(),
          contacto: datos.get("contacto").trim(),
          correo: datos.get("correo").trim(),
          telefono: datos.get("telefono").trim(),
          categoria: datos.get("categoria").trim(),
          estado: datos.get("estado"),
        });
        renderProveedores();
        cerrarModal();
        mostrarToast("Proveedor creado correctamente.");
      },
    });
  }

  function editarProveedor(id) {
    const proveedor = PROVEEDORES.find((p) => p.id === id);
    if (!proveedor) return;

    abrirModal({
      titulo: "Editar proveedor",
      textoConfirmar: "Guardar cambios",
      cuerpoHTML: `
        <div class="admin-form-grupo">
          <label for="campoNombreProveedor">Nombre de la empresa</label>
          <input type="text" id="campoNombreProveedor" name="nombre" value="${proveedor.nombre}" required>
        </div>
        <div class="admin-form-grupo">
          <label for="campoContactoProveedor">Persona de contacto</label>
          <input type="text" id="campoContactoProveedor" name="contacto" value="${proveedor.contacto}" required>
        </div>
        <div class="admin-form-grupo">
          <label for="campoCorreoProveedor">Correo</label>
          <input type="email" id="campoCorreoProveedor" name="correo" value="${proveedor.correo}" required>
        </div>
        <div class="admin-form-grupo">
          <label for="campoTelefonoProveedor">Teléfono</label>
          <input type="text" id="campoTelefonoProveedor" name="telefono" value="${proveedor.telefono}" required>
        </div>
        <div class="admin-form-grupo">
          <label for="campoCategoriaProveedor">Categoría que abastece</label>
          <input type="text" id="campoCategoriaProveedor" name="categoria" value="${proveedor.categoria}" required>
        </div>
        <div class="admin-form-grupo">
          <label for="campoEstadoProveedor">Estado</label>
          <select id="campoEstadoProveedor" name="estado">
            <option value="activo" ${proveedor.estado === "activo" ? "selected" : ""}>Activo</option>
            <option value="pendiente" ${proveedor.estado === "pendiente" ? "selected" : ""}>Pendiente</option>
            <option value="inactivo" ${proveedor.estado === "inactivo" ? "selected" : ""}>Inactivo</option>
          </select>
        </div>
      `,
      alConfirmar: (datos) => {
        proveedor.nombre = datos.get("nombre").trim();
        proveedor.contacto = datos.get("contacto").trim();
        proveedor.correo = datos.get("correo").trim();
        proveedor.telefono = datos.get("telefono").trim();
        proveedor.categoria = datos.get("categoria").trim();
        proveedor.estado = datos.get("estado");
        renderProveedores();
        cerrarModal();
        mostrarToast("Proveedor actualizado correctamente.");
      },
    });
  }

  function eliminarProveedor(id) {
    const proveedor = PROVEEDORES.find((p) => p.id === id);
    if (!proveedor) return;

    abrirModalConfirmacion({
      titulo: "Eliminar proveedor",
      mensaje: `¿Seguro que quieres eliminar a "${proveedor.nombre}" de tu lista de proveedores?`,
      alConfirmar: () => {
        const indice = PROVEEDORES.findIndex((p) => p.id === id);
        if (indice > -1) PROVEEDORES.splice(indice, 1);
        renderProveedores();
        mostrarToast("Proveedor eliminado.", "info");
      },
    });
  }

  /* =====================================================================
     ACCIONES: Categorías
     ===================================================================== */
  function nuevaCategoria() {
    abrirModal({
      titulo: "Nueva categoría",
      textoConfirmar: "Crear categoría",
      cuerpoHTML: `
        <div class="admin-form-grupo">
          <label for="campoNombreCategoria">Nombre de la categoría</label>
          <input type="text" id="campoNombreCategoria" name="nombre" placeholder="Ej. Deportes" required>
        </div>
      `,
      alConfirmar: (datos) => {
        CATEGORIAS.unshift({
          id: contadorCategoria++,
          nombre: datos.get("nombre").trim(),
          icono: "fa-tag",
          productos: 0,
        });
        renderCategorias();
        cerrarModal();
        mostrarToast("Categoría creada correctamente.");
      },
    });
  }

  function eliminarCategoria(id) {
    const categoria = CATEGORIAS.find((c) => c.id === id);
    if (!categoria) return;

    abrirModalConfirmacion({
      titulo: "Eliminar categoría",
      mensaje: `¿Seguro que quieres eliminar "${categoria.nombre}"? Los productos asociados no se eliminarán.`,
      alConfirmar: () => {
        const indice = CATEGORIAS.findIndex((c) => c.id === id);
        if (indice > -1) CATEGORIAS.splice(indice, 1);
        renderCategorias();
        mostrarToast("Categoría eliminada.", "info");
      },
    });
  }

  /* =====================================================================
     ACCIONES: Cupones
     ===================================================================== */
  function nuevoCupon() {
    abrirModal({
      titulo: "Nuevo cupón",
      textoConfirmar: "Crear cupón",
      cuerpoHTML: `
        <div class="admin-form-grupo">
          <label for="campoCodigoCupon">Código</label>
          <input type="text" id="campoCodigoCupon" name="codigo" placeholder="Ej. VERANO20" style="text-transform:uppercase" required>
        </div>
        <div class="admin-form-fila">
          <div class="admin-form-grupo">
            <label for="campoTipoCupon">Tipo de descuento</label>
            <select id="campoTipoCupon" name="tipo">
              <option value="porcentaje">Porcentaje (%)</option>
              <option value="valor">Valor fijo ($)</option>
            </select>
          </div>
          <div class="admin-form-grupo">
            <label for="campoValorCupon">Valor</label>
            <input type="number" id="campoValorCupon" name="valor" min="0" placeholder="10" required>
          </div>
        </div>
        <div class="admin-form-grupo">
          <label for="campoVigenciaCupon">Vigente hasta</label>
          <input type="date" id="campoVigenciaCupon" name="vigencia" required>
        </div>
      `,
      alConfirmar: (datos) => {
        const fecha = new Date(datos.get("vigencia") + "T00:00:00");
        CUPONES.unshift({
          id: contadorCupon++,
          codigo: datos.get("codigo").trim().toUpperCase(),
          tipo: datos.get("tipo"),
          valor: Number(datos.get("valor")) || 0,
          vigencia: isNaN(fecha) ? datos.get("vigencia") : fecha.toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" }),
          activo: true,
        });
        renderCupones();
        cerrarModal();
        mostrarToast("Cupón creado correctamente.");
      },
    });
  }

  function alternarCupon(id, activo) {
    const cupon = CUPONES.find((c) => c.id === id);
    if (!cupon) return;
    cupon.activo = activo;
    mostrarToast(`Cupón "${cupon.codigo}" ${activo ? "activado" : "desactivado"}.`, "info");
  }

  function eliminarCupon(id) {
    const cupon = CUPONES.find((c) => c.id === id);
    if (!cupon) return;

    abrirModalConfirmacion({
      titulo: "Eliminar cupón",
      mensaje: `¿Seguro que quieres eliminar el cupón "${cupon.codigo}"?`,
      alConfirmar: () => {
        const indice = CUPONES.findIndex((c) => c.id === id);
        if (indice > -1) CUPONES.splice(indice, 1);
        renderCupones();
        mostrarToast("Cupón eliminado.", "info");
      },
    });
  }

  /* =====================================================================
     PLANTILLAS DE VISTA
     ===================================================================== */
  function plantillaVistas() {
    return {
      resumen: `
        <div class="admin-bienvenida">
          <div>
            <h2>Hola, Admin</h2>
            <p id="adminFecha">Este es el resumen de la tienda</p>
          </div>

          <div class="admin-acciones-rapidas">
            <button class="admin-boton admin-boton-primario" data-accion="nuevo-producto">
              <i class="fa-solid fa-plus"></i>
              Nuevo producto
            </button>

            <button class="admin-boton admin-boton-secundario" data-accion="exportar-pedidos">
              <i class="fa-solid fa-file-arrow-down"></i>
              Exportar reporte
            </button>
          </div>
        </div>

        <section class="admin-grid-kpi" id="adminGridKpi"></section>

        <section class="admin-grid-charts">
          <div class="admin-tarjeta admin-tarjeta-chart">
            <div class="admin-tarjeta-header">
              <h3>Ventas de la semana</h3>
            </div>
            <canvas id="chartVentas" height="230"></canvas>
          </div>

          <div class="admin-tarjeta admin-tarjeta-chart">
            <div class="admin-tarjeta-header">
              <h3>Pedidos por estado</h3>
            </div>
            <canvas id="chartEstados" height="230"></canvas>
            <ul class="admin-leyenda" id="adminLeyendaEstados"></ul>
          </div>
        </section>

        <section class="admin-grid-tablas">
          <div class="admin-tarjeta admin-tarjeta-tabla">
            <div class="admin-tarjeta-header">
              <h3>Últimos pedidos</h3>
              <button class="admin-ver-todo" data-vista-ir="pedidos">Ver todo <i class="fa-solid fa-arrow-right"></i></button>
            </div>
            <div class="admin-tabla-scroll">
              <table class="admin-tabla">
                <thead>
                  <tr>
                    <th>Pedido</th><th>Cliente</th><th>Producto</th><th>Estado</th><th>Total</th><th></th>
                  </tr>
                </thead>
                <tbody id="adminTablaPedidos"></tbody>
              </table>
            </div>
          </div>

          <div class="admin-tarjeta admin-tarjeta-stock">
            <div class="admin-tarjeta-header">
              <h3>Stock bajo</h3>
            </div>
            <ul class="admin-lista-stock" id="adminListaStock"></ul>
          </div>
        </section>
      `,

      pedidos: `
        <div class="admin-bienvenida">
          <div>
            <h2>Pedidos</h2>
            <p>Administra los pedidos realizados en la tienda.</p>
          </div>
          <div class="admin-acciones-rapidas">
            <button class="admin-boton admin-boton-secundario" data-accion="exportar-pedidos">
              <i class="fa-solid fa-file-arrow-down"></i>
              Exportar
            </button>
            <button class="admin-boton admin-boton-primario" data-accion="nuevo-pedido">
              <i class="fa-solid fa-plus"></i>
              Nuevo pedido
            </button>
          </div>
        </div>

        <div class="admin-tarjeta">
          <div class="admin-tarjeta-header">
            <h3>Lista de pedidos</h3>
          </div>
          <div class="admin-tabla-scroll">
            <table class="admin-tabla">
              <thead>
                <tr><th>Pedido</th><th>Cliente</th><th>Producto</th><th>Estado</th><th>Total</th><th></th></tr>
              </thead>
              <tbody id="adminTablaPedidos"></tbody>
            </table>
          </div>
        </div>
      `,

      productos: `
        <div class="admin-bienvenida">
          <div>
            <h2>Productos</h2>
            <p>Gestiona los productos de la tienda.</p>
          </div>
          <button class="admin-boton admin-boton-primario" data-accion="nuevo-producto">
            <i class="fa-solid fa-plus"></i>
            Nuevo producto
          </button>
        </div>

        <div class="admin-grid-kpi" style="grid-template-columns:repeat(2,1fr);">
          <div class="admin-kpi admin-kpi-simple">
            <div class="admin-kpi-etiqueta">Productos activos</div>
            <div class="admin-kpi-valor" id="adminConteoProductos">${PRODUCTOS.length}</div>
          </div>
          <div class="admin-kpi admin-kpi-simple">
            <div class="admin-kpi-etiqueta">Stock bajo</div>
            <div class="admin-kpi-valor" id="adminConteoStockBajo">0</div>
          </div>
        </div>

        <div class="admin-tarjeta">
          <div class="admin-tarjeta-header" style="display:flex; justify-content:space-between; align-items:center;">
            <h3>Productos registrados</h3>
            <select id="adminFiltroCategoria" class="admin-input" style="width: auto; padding: 6px 12px; height: auto; border:1px solid var(--border-color); border-radius:6px; background:var(--bg-main); color:var(--text-main);">
              <option value="">Todas las categorías</option>
              <option value="tecnología">Tecnología</option>
              <option value="ropa">Ropa</option>
              <option value="calzado">Calzado</option>
              <option value="accesorios">Accesorios</option>
              <option value="hogar">Hogar</option>
            </select>
          </div>
          <div class="admin-tabla-scroll">
            <table class="admin-tabla">
              <thead>
                <tr><th>Nombre</th><th>Categoría</th><th>Precio</th><th>Stock</th><th>Estado</th><th></th></tr>
              </thead>
              <tbody id="adminTablaProductos"></tbody>
            </table>
          </div>
        </div>
      `,

      clientes: `
        <div class="admin-bienvenida">
          <div>
            <h2>Clientes</h2>
            <p>Consulta y administra los clientes registrados.</p>
          </div>
          <button class="admin-boton admin-boton-primario" data-accion="nuevo-cliente">
            <i class="fa-solid fa-user-plus"></i>
            Nuevo cliente
          </button>
        </div>

        <div class="admin-grid-kpi" style="grid-template-columns:repeat(2,1fr);">
          <div class="admin-kpi admin-kpi-simple">
            <div class="admin-kpi-etiqueta">Clientes registrados</div>
            <div class="admin-kpi-valor" id="adminConteoClientes">${CLIENTES.length}</div>
          </div>
          <div class="admin-kpi admin-kpi-simple">
            <div class="admin-kpi-etiqueta">Nuevos este mes</div>
            <div class="admin-kpi-valor">112</div>
          </div>
        </div>

        <div class="admin-tarjeta">
          <div class="admin-tarjeta-header">
            <h3>Clientes</h3>
          </div>
          <div class="admin-tabla-scroll">
            <table class="admin-tabla">
              <thead>
                <tr><th>Cliente</th><th>Pedidos</th><th>Total gastado</th><th>Registro</th><th></th></tr>
              </thead>
              <tbody id="adminTablaClientes"></tbody>
            </table>
          </div>
        </div>
      `,

      proveedores: `
        <div class="admin-bienvenida">
          <div>
            <h2>Proveedores</h2>
            <p>Gestiona las empresas que abastecen tu inventario.</p>
          </div>
          <button class="admin-boton admin-boton-primario" data-accion="nuevo-proveedor">
            <i class="fa-solid fa-truck-field"></i>
            Nuevo proveedor
          </button>
        </div>

        <div class="admin-grid-kpi" style="grid-template-columns:repeat(2,1fr);">
          <div class="admin-kpi admin-kpi-simple">
            <div class="admin-kpi-etiqueta">Proveedores registrados</div>
            <div class="admin-kpi-valor" id="adminConteoProveedores">${PROVEEDORES.length}</div>
          </div>
          <div class="admin-kpi admin-kpi-simple">
            <div class="admin-kpi-etiqueta">Activos</div>
            <div class="admin-kpi-valor">${PROVEEDORES.filter((p) => p.estado === "activo").length}</div>
          </div>
        </div>

        <div class="admin-tarjeta">
          <div class="admin-tarjeta-header">
            <h3>Proveedores</h3>
          </div>
          <div class="admin-tabla-scroll">
            <table class="admin-tabla">
              <thead>
                <tr><th>Proveedor</th><th>Categoría</th><th>Correo</th><th>Teléfono</th><th>Estado</th><th></th></tr>
              </thead>
              <tbody id="adminTablaProveedores"></tbody>
            </table>
          </div>
        </div>
      `,

      categorias: `
        <div class="admin-bienvenida">
          <div>
            <h2>Categorías</h2>
            <p>Organiza los productos de la tienda.</p>
          </div>
          <button class="admin-boton admin-boton-primario" data-accion="nueva-categoria">
            <i class="fa-solid fa-plus"></i>
            Nueva categoría
          </button>
        </div>

        <div class="admin-tarjeta">
          <div class="admin-tarjeta-header">
            <h3>Categorías registradas</h3>
          </div>
          <div class="admin-grid-categorias" id="adminGridCategorias"></div>
        </div>
      `,

      usuarios: `
        <div class="admin-bienvenida">
          <div>
            <h2>Usuarios</h2>
            <p>Gestiona las cuentas de acceso al sitio.</p>
          </div>
          <button class="admin-boton admin-boton-primario" data-accion="nuevo-usuario">
            <i class="fa-solid fa-user-plus"></i>
            Nuevo usuario
          </button>
        </div>

        <div class="admin-grid-kpi" style="grid-template-columns:repeat(2,1fr);">
          <div class="admin-kpi admin-kpi-simple">
            <div class="admin-kpi-etiqueta">Usuarios registrados</div>
            <div class="admin-kpi-valor" id="adminConteoUsuarios">0</div>
          </div>
          <div class="admin-kpi admin-kpi-simple">
            <div class="admin-kpi-etiqueta">Bloqueados</div>
            <div class="admin-kpi-valor" id="adminConteoUsuariosBloqueados">0</div>
          </div>
        </div>

        <div class="admin-tarjeta">
          <div class="admin-tarjeta-header">
            <h3>Cuentas registradas</h3>
          </div>
          <div class="admin-tabla-scroll">
            <table class="admin-tabla">
              <thead>
                <tr><th>Usuario</th><th>Rol</th><th>Estado</th><th>Registro</th><th></th></tr>
              </thead>
              <tbody id="adminTablaUsuarios"></tbody>
            </table>
          </div>
        </div>
      `,

      cupones: `
        <div class="admin-bienvenida">
          <div>
            <h2>Cupones</h2>
            <p>Administra los descuentos disponibles.</p>
          </div>
          <button class="admin-boton admin-boton-primario" data-accion="nuevo-cupon">
            <i class="fa-solid fa-plus"></i>
            Nuevo cupón
          </button>
        </div>

        <div class="admin-tarjeta">
          <div class="admin-tarjeta-header">
            <h3>Cupones registrados</h3>
          </div>
          <div class="admin-tabla-scroll">
            <table class="admin-tabla">
              <thead>
                <tr><th>Código</th><th>Descuento</th><th>Vigencia</th><th>Activo</th><th></th></tr>
              </thead>
              <tbody id="adminTablaCupones"></tbody>
            </table>
          </div>
        </div>
      `,

      reportes: `
        <div class="admin-bienvenida">
          <div>
            <h2>Reportes</h2>
            <p>Consulta y descarga los reportes de la tienda.</p>
          </div>
          <button class="admin-boton admin-boton-primario" data-accion="exportar-pedidos">
            <i class="fa-solid fa-file-pdf"></i>
            Generar reporte
          </button>
        </div>

        <div class="admin-grid-kpi" style="grid-template-columns:repeat(2,1fr);">
          <div class="admin-kpi admin-kpi-simple">
            <div class="admin-kpi-etiqueta">Ventas del mes</div>
            <div class="admin-kpi-valor">$48.250.000</div>
          </div>
          <div class="admin-kpi admin-kpi-simple">
            <div class="admin-kpi-etiqueta">Pedidos</div>
            <div class="admin-kpi-valor">342</div>
          </div>
        </div>

        <div class="admin-tarjeta">
          <div class="admin-tarjeta-header">
            <h3>Reportes disponibles</h3>
          </div>

          <div class="admin-item-stock">
            <div class="admin-stock-info">
              <p>Reporte de ventas y pedidos</p>
              <span>Incluye cliente, producto, estado y total por pedido.</span>
            </div>
            <button class="admin-boton admin-boton-secundario admin-boton-sm" data-accion="exportar-pedidos">
              <i class="fa-solid fa-file-arrow-down"></i> Descargar CSV
            </button>
          </div>

          <div class="admin-item-stock">
            <div class="admin-stock-info">
              <p>Reporte de productos</p>
              <span>Incluye categoría, precio y niveles de inventario.</span>
            </div>
            <button class="admin-boton admin-boton-secundario admin-boton-sm" data-accion="exportar-productos">
              <i class="fa-solid fa-file-arrow-down"></i> Descargar CSV
            </button>
          </div>

          <div class="admin-item-stock">
            <div class="admin-stock-info">
              <p>Reporte de clientes</p>
              <span>Incluye historial de compras y valor total gastado.</span>
            </div>
            <button class="admin-boton admin-boton-secundario admin-boton-sm" data-accion="exportar-clientes">
              <i class="fa-solid fa-file-arrow-down"></i> Descargar CSV
            </button>
          </div>
        </div>
      `,

      configuracion: `
        <div class="admin-bienvenida">
          <div>
            <h2>Configuración</h2>
            <p>Configura las opciones del panel administrativo.</p>
          </div>
        </div>

        <div class="admin-tarjeta">
          <div class="admin-tarjeta-header">
            <h3>Configuración general</h3>
          </div>

          <form id="adminFormConfiguracion">
            <div class="admin-form-grupo">
              <label for="campoNombreTienda">Nombre de la tienda</label>
              <input type="text" id="campoNombreTienda" name="nombreTienda" value="Senabella">
            </div>

            <div class="admin-form-grupo">
              <label for="campoCorreoAdmin">Correo de administración</label>
              <input type="email" id="campoCorreoAdmin" name="correoAdmin" value="admin@senabella.com">
            </div>

            <div class="admin-form-grupo" style="display:flex;align-items:center;justify-content:space-between;gap:12px;">
              <div>
                <label style="margin-bottom:2px;">Notificaciones por correo</label>
                <p class="admin-ayuda" style="margin:0;">Recibe un aviso cuando entre un pedido nuevo.</p>
              </div>
              <label class="admin-switch">
                <input type="checkbox" name="notificaciones" checked>
                <span class="admin-switch-riel"></span>
              </label>
            </div>

            <button type="submit" class="admin-boton admin-boton-primario">
              <i class="fa-solid fa-floppy-disk"></i>
              Guardar cambios
            </button>
          </form>
        </div>
      `,
    };
  }

  /* =====================================================================
     NAVEGACIÓN LATERAL Y CAMBIO DE VISTAS
     ===================================================================== */
  function irAVista(vista) {
    const item = $(`.admin-nav-item[data-vista="${vista}"]`);
    if (item) item.click();
  }

  function setupNavegacion() {
    const items = $$(".admin-nav-item");
    const tituloVista = $("#adminTituloVista");
    const contenido = $("#contenidoVista");
    const vistas = plantillaVistas();

    function cambiarA(vista, item) {
      items.forEach((i) => i.classList.remove("activo"));
      if (item) item.classList.add("activo");

      const nombre = item ? $("span", item)?.textContent.trim() : null;

      if (tituloVista) {
        tituloVista.textContent =
          vista === "resumen" ? "Resumen general" : nombre || vista;
      }

      if (contenido && vistas[vista]) {
        contenido.innerHTML = vistas[vista];
      }

      renderVista(vista);

      const buscador = $("#adminBuscadorInput");
      if (buscador) buscador.value = "";
      $("#adminBuscadorContenedor")?.classList.remove("tiene-texto");

      cerrarSidebarMovil();
    }

    items.forEach((item) => {
      item.addEventListener("click", (e) => {
        e.preventDefault();
        cambiarA(item.dataset.vista, item);
      });
    });

    /* Mostrar Resumen al cargar */
    cambiarA("resumen", $('.admin-nav-item[data-vista="resumen"]'));
  }

  function renderVista(vista) {
    if (vista === "resumen") {
      renderKpis();
      renderPedidos();
      renderStockBajo();
      setupFecha();
      setTimeout(initGraficas, 60);
    }
    if (vista === "pedidos") renderPedidos();
    if (vista === "productos") {
      renderProductos();
      const selectCat = $("#adminFiltroCategoria");
      if (selectCat) {
        selectCat.addEventListener("change", () => {
          const buscadorInput = $("#adminBuscadorInput");
          renderProductos(buscadorInput ? buscadorInput.value : "");
        });
      }
    }
    if (vista === "clientes") renderClientes();
    if (vista === "proveedores") renderProveedores();
    if (vista === "categorias") renderCategorias();
    if (vista === "cupones") renderCupones();
    if (vista === "usuarios") {
      renderUsuarios();
      // Actualizar KPI bloqueados
      setTimeout(() => {
        const bloq = $("#adminConteoUsuariosBloqueados");
        if (bloq && window.SenabellaUsuarios) {
          bloq.textContent = window.SenabellaUsuarios.obtener().filter((u) => u.estado === "bloqueado").length;
        }
      }, 0);
    }

    if (vista === "configuracion") {
      $("#adminFormConfiguracion")?.addEventListener("submit", (e) => {
        e.preventDefault();
        mostrarToast("Configuración guardada correctamente.");
      });
    }
  }

  /* =====================================================================
     DELEGACIÓN DE EVENTOS PARA BOTONES DINÁMICOS
     ===================================================================== */
  function setupDelegacionAcciones() {
    document.addEventListener("click", (e) => {
      const botonVista = e.target.closest("[data-vista-ir]");
      if (botonVista) {
        e.preventDefault();
        irAVista(botonVista.dataset.vistaIr);
        return;
      }

      const boton = e.target.closest("[data-accion]");
      if (!boton) return;

      const accion = boton.dataset.accion;
      const id = boton.dataset.id;

      switch (accion) {
        case "nuevo-producto": nuevoProducto(); break;
        case "editar-producto": editarProducto(Number(id)); break;
        case "eliminar-producto": eliminarProducto(Number(id)); break;
        case "reabastecer": reabastecerProducto(Number(id)); break;

        case "nuevo-pedido": nuevoPedido(); break;
        case "ver-pedido": verDetallePedido(id); break;

        case "nuevo-cliente": nuevoCliente(); break;
        case "ver-cliente": verCliente(Number(id)); break;
        case "eliminar-cliente": eliminarCliente(Number(id)); break;

        case "nueva-categoria": nuevaCategoria(); break;
        case "eliminar-categoria": eliminarCategoria(Number(id)); break;

        case "nuevo-proveedor": nuevoProveedor(); break;
        case "editar-proveedor": editarProveedor(Number(id)); break;
        case "eliminar-proveedor": eliminarProveedor(Number(id)); break;

        case "nuevo-usuario": nuevoUsuario(); break;
        case "alternar-usuario": alternarUsuario(Number(id)); break;
        case "reset-pass-usuario": resetPassUsuario(Number(id)); break;
        case "eliminar-usuario": eliminarUsuario(Number(id)); break;

        case "nuevo-cupon": nuevoCupon(); break;
        case "eliminar-cupon": eliminarCupon(Number(id)); break;

        case "exportar-pedidos": exportarPedidos(); break;
        case "exportar-productos": exportarProductos(); break;
        case "exportar-clientes": exportarClientes(); break;

        default: break;
      }
    });

    document.addEventListener("change", (e) => {
      if (e.target.dataset && e.target.dataset.accion === "alternar-cupon") {
        alternarCupon(Number(e.target.dataset.id), e.target.checked);
      }
    });
  }

  /* =====================================================================
     BUSCADOR DE LA TOPBAR
     ===================================================================== */
  function setupBuscador() {
    const input = $("#adminBuscadorInput");
    const contenedor = $("#adminBuscadorContenedor");
    const limpiar = $("#adminBuscadorLimpiar");
    if (!input) return;

    function filtrar() {
      const texto = input.value;
      contenedor.classList.toggle("tiene-texto", texto.length > 0);

      if ($("#adminTablaProductos")) renderProductos(texto);
      else if ($("#adminTablaClientes")) renderClientes(texto);
      else if ($("#adminTablaPedidos")) renderPedidos(texto);
      else if ($("#adminTablaProveedores")) renderProveedores(texto);
      else if ($("#adminTablaUsuarios")) renderUsuarios(texto);
    }

    input.addEventListener("input", filtrar);
    limpiar?.addEventListener("click", () => {
      input.value = "";
      filtrar();
      input.focus();
    });
  }

  /* =====================================================================
     NOTIFICACIONES DE LA CAMPANA
     ===================================================================== */
  function setupNotificaciones() {
    $$(".admin-dropdown-item[data-notif]").forEach((item) => {
      item.addEventListener("click", (e) => {
        e.preventDefault();
        item.style.opacity = "0.45";
        const badge = $("#adminBadgeNotificaciones");
        if (badge) {
          const restantes = Math.max(0, Number(badge.textContent) - 1);
          if (restantes === 0) {
            badge.remove();
          } else {
            badge.textContent = restantes;
          }
        }
        mostrarToast("Notificación marcada como leída.", "info");
      });
    });
  }

  /* =====================================================================
     SIDEBAR MÓVIL
     ===================================================================== */
  function cerrarSidebarMovil() {
    $("#adminSidebar")?.classList.remove("abierto");
    $("#adminOverlay")?.classList.remove("visible");
  }

  function setupSidebarMovil() {
    const boton = $("#adminBotonMenu");
    const overlay = $("#adminOverlay");

    boton?.addEventListener("click", () => {
      $("#adminSidebar")?.classList.add("abierto");
      overlay?.classList.add("visible");
    });

    overlay?.addEventListener("click", cerrarSidebarMovil);
  }

  /* =====================================================================
     DROPDOWNS (notificaciones y perfil)
     ===================================================================== */
  function setupDropdowns() {
    const pares = [
      ["#adminBotonNotificaciones", "#adminDropdownNotificaciones"],
      ["#adminBotonPerfil", "#adminDropdownPerfil"],
    ];

    pares.forEach(([selectorBoton, selectorDropdown]) => {
      const boton = $(selectorBoton);
      const dropdown = $(selectorDropdown);
      if (!boton || !dropdown) return;

      boton.addEventListener("click", (e) => {
        e.stopPropagation();
        const yaAbierto = dropdown.classList.contains("mostrar");
        $$(".admin-dropdown.mostrar").forEach((d) => d.classList.remove("mostrar"));
        if (!yaAbierto) dropdown.classList.add("mostrar");
      });
    });

    document.addEventListener("click", () => {
      $$(".admin-dropdown.mostrar").forEach((d) => d.classList.remove("mostrar"));
    });
  }

  /* =====================================================================
     MODO OSCURO
     Comparte la misma clave de localStorage ("modoOscuro") que el resto
     del sitio (ver js/header.js), así el tema se mantiene consistente
     entre el panel de admin y las páginas de cliente.
     ===================================================================== */
  function setupModoOscuro() {
    const boton = $("#adminThemeToggle");
    if (!boton) return;

    const modoGuardado = localStorage.getItem("modoOscuro");
    if (modoGuardado === "activado") {
      document.body.classList.add("modo-oscuro");
      boton.innerHTML = '<i class="fa-solid fa-sun"></i>';
    }

    boton.addEventListener("click", () => {
      document.body.classList.toggle("modo-oscuro");
      const activado = document.body.classList.contains("modo-oscuro");
      boton.innerHTML = activado
        ? '<i class="fa-solid fa-sun"></i>'
        : '<i class="fa-solid fa-moon"></i>';
      localStorage.setItem("modoOscuro", activado ? "activado" : "desactivado");
    });
  }

  /* =====================================================================
     CERRAR SESIÓN
     ===================================================================== */
  function setupCerrarSesion() {
    ["#adminCerrarSesion", "#adminCerrarSesion2"].forEach((selector) => {
      $(selector)?.addEventListener("click", (e) => {
        e.preventDefault();
        const confirmar = window.confirm("¿Seguro que quieres cerrar sesión?");
        if (confirmar) {
          localStorage.removeItem("senabella_sesion");
          localStorage.removeItem("senabella_rol");
          window.location.href = "inicio.html";
        }
      });
    });
  }

  /* =====================================================================
     VALIDACIÓN DE ACCESO (solo administradores)
     ===================================================================== */
  function verificarAccesoAdmin() {
    const sesionActiva = localStorage.getItem("senabella_sesion") === "activa";
    const rol = localStorage.getItem("senabella_rol");

    if (!sesionActiva || rol !== "administrador") {
      window.location.href = "login.html";
      return false;
    }
    return true;
  }

  /* =====================================================================
     FECHA DE BIENVENIDA
     ===================================================================== */
  function setupFecha() {
    const el = $("#adminFecha");
    if (!el) return;
    const hoy = new Date();
    const texto = hoy.toLocaleDateString("es-CO", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
    el.textContent = `Este es el resumen de la tienda hoy, ${texto}`;
  }

  /* =====================================================================
     INIT
     ===================================================================== */
  function init() {
    if (!verificarAccesoAdmin()) return;
    setupNavegacion();
    setupDelegacionAcciones();
    setupBuscador();
    setupNotificaciones();
    setupSidebarMovil();
    setupDropdowns();
    setupModoOscuro();
    setupCerrarSesion();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
