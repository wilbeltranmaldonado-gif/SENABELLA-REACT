// ==========================================
// CATEGORÍAS, BANNERS Y FILTROS - SENABELLA
// ==========================================

import imgPortatiles from "../assets/public (1).webp";
import imgAccesorios from "../assets/teclado.webp";
import imgTablets from "../assets/public (1) (1).webp";
import imgImpresoras from "../assets/public (2) (1).webp";
import imgDesktops from "../assets/public (3) (1).webp";
import imgTodoEnUno from "../assets/public (4).webp";
import imgSoftware from "../assets/public (5).webp";
import imgMonitores from "../assets/public (6).webp";
import imgAlmacenamiento from "../assets/public (7).webp";

// 1. Categorías destacadas para la página de Inicio
export const categoriasInicio = [
  {
    nombre: "OFERTAS",
    categoria: "ofertas",
    imagen:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSr5trp8CEafbpi6qOXT-FjQ11HqgD7petZxuYnIIeCfA&s=10",
    ruta: "/catalogo?categoria=ofertas",
  },
  {
    nombre: "TECNO",
    categoria: "tecno",
    imagen:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlsVX5r-2gPMvY9Y6HJo19zqBHxYIn9izOfNFlfNPc7w&s=10",
    ruta: "/catalogo?categoria=tecno",
  },
  {
    nombre: "MUJER",
    categoria: "mujer",
    imagen:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4j0PMoypc__UeVq6nD4bIh6qFQ4FaGSnEI4GclFl7iw&s=10",
    ruta: "/catalogo-ropa-accesorios?categoria=mujer",
  },
  {
    nombre: "HOMBRE",
    categoria: "hombre",
    imagen:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWwkq93t5FnksulxA2YfZpSKAUiaqGZ7sNWSgR0wOtoQ&s=10",
    ruta: "/catalogo-ropa-accesorios?categoria=hombre",
  },
  {
    nombre: "CALZADO",
    categoria: "calzado",
    imagen:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREmL4kn7HnCXVri8EmYY9FT-MtzgKWj5fhj7F1MvHkRQ&s=10",
    ruta: "/catalogo-ropa-accesorios?categoria=calzado",
  },
];

export const categorias = categoriasInicio;

// 2. Banners promocionales del Inicio
export const promocionesInicio = [
  {
    imagen:
      "https://images.falabella.com/v3/assets/blt088e6fffbba20f16/bltb64adf7df7412925/6a59c7ae3d25ec046fccbe95/powercard16_home_suplementos_desk.jpg?auto=webp&disable=upscale&quality=70&width=1280",
    ruta: "/catalogo?busqueda=suplementos",
  },
  {
    imagen:
      "https://images.falabella.com/v3/assets/blt088e6fffbba20f16/bltf413d366cc29e9bf/6a5a7cfd5c7ce2611d2d8c44/powercard10_home_belleza_desk.jpg?auto=webp&disable=upscale&quality=70&width=1280",
    ruta: "/catalogo?busqueda=belleza",
  },
  {
    imagen:
      "https://images.falabella.com/v3/assets/blt088e6fffbba20f16/blt5da4c0580b8c656d/6a59c7bf15befe0a433a8a5a/powercard7_home_relojes_desk.jpg?auto=webp&disable=upscale&quality=70&width=1280",
    ruta: "/catalogo?busqueda=reloj",
  },
  {
    imagen:
      "https://images.falabella.com/v3/assets/blt088e6fffbba20f16/bltd4a47313d2285f26/6a63ec4398a7f19022344b73/powercard9_home_moda_mujer_desk.jpg?auto=webp&disable=upscale&quality=70&width=1280",
    ruta: "/catalogo-ropa-accesorios?categoria=mujer",
  },
  {
    imagen:
      "https://images.falabella.com/v3/assets/blt088e6fffbba20f16/bltc8501095a0ace138/6a59c7ae1d6cdc171efb0209/powercard14_home_ropa_cama_desk.jpg?auto=webp&disable=upscale&quality=70&width=1280",
    ruta: "/catalogo?busqueda=cama",
  },
  {
    imagen:
      "https://images.falabella.com/v3/assets/blt088e6fffbba20f16/blt1626d2cca9a6757c/6a59c7ae1d6cdc852ffb020d/powercard13_home_tablets_desk.jpg?auto=webp&disable=upscale&quality=70&width=1280",
    ruta: "/catalogo?categoria=tablets",
  },
  {
    imagen:
      "https://images.falabella.com/v3/assets/blt088e6fffbba20f16/blt51f7cce65f3e83cd/6a677af55f2918326a139dd0/Imperdible3_home_computador_lenovo_ideapad_cyber_desk.jpg?auto=webp&disable=upscale&quality=70&width=1280",
    ruta: "/catalogo?busqueda=lenovo",
  },
  {
    imagen:
      "https://images.falabella.com/v3/assets/blt088e6fffbba20f16/blt008e3e85bf2c1c75/6a675c0cb08d720383bb7b25/Imperdible2_home_electro_tv_samsung_40pul_cyber_desk.jpg?auto=webp&disable=upscale&quality=70&width=1280",
    ruta: "/catalogo?busqueda=samsung",
  },
];

export const promociones = promocionesInicio;

// 3. Banners del carrusel principal
export const bannersInicio = [
  "https://images.falabella.com/v3/assets/blt088e6fffbba20f16/bltbe35baee88cd51d6/6a57c00691d0075f65be69d8/Banner-doble02-landing-mujer-colombia-disena-dto-cyber_desk.png?auto=webp&disable=upscale&quality=70&width=1280",
  "https://images.falabella.com/v3/assets/blt088e6fffbba20f16/bltc5b14ee48b0288b5/6a57defcade6f5a0546e68e4/Banner-doble02-landing-mujer-imperdibles-accesorios-relojes-MK-price-cyber_desk.png?auto=webp&disable=upscale&quality=70&width=1280",
  "https://images.falabella.com/v3/assets/blt088e6fffbba20f16/blt0d2994fac24f0fb9/6a29da3fec6a5e4bb177ac7e/bannerdoble07_landing_tecnologia_computadores_mejorestablets_30dcto_desk.jpg?auto=webp&disable=upscale&quality=70&width=1280",
];

export const banners = bannersInicio;

// 4. Categorías circulares del Catálogo
export const categoriasCirculares = [
  {
    titulo: "Computadores Portátiles",
    imagen: imgPortatiles,
    categoria: "portátil",
  },
  {
    titulo: "Accesorios de computación",
    imagen: imgAccesorios,
    categoria: "accesorio",
  },
  {
    titulo: "Tablets",
    imagen: imgTablets,
    categoria: "tablet",
  },
  {
    titulo: "Impresoras y Tintas",
    imagen: imgImpresoras,
    categoria: "impresora",
  },
  {
    titulo: "Desktops",
    imagen: imgDesktops,
    categoria: "desktop",
  },
  {
    titulo: "Computadora Todo en uno",
    imagen: imgTodoEnUno,
    categoria: "desktop",
  },
  {
    titulo: "Software",
    imagen: imgSoftware,
    categoria: "software",
  },
  {
    titulo: "Monitores para pc",
    imagen: imgMonitores,
    categoria: "monitor",
  },
  {
    titulo: "Almacenamiento",
    imagen: imgAlmacenamiento,
    categoria: "disco",
  },
];

// 5. Marcas disponibles para filtrado en Catálogo
export const marcasCatalogo = [
  "LENOVO",
  "HP",
  "DELL",
  "ASUS",
  "STARLINK",
  "EPSON",
  "ACER",
  "LOGITECH",
  "MICROSOFT",
  "AMD",
  "GENERICO",
  "JALTECH",
];

export const marcasBotones = marcasCatalogo;

// 6. Lista lateral de categorías en Catálogo
export const categoriasListaLateral = [
  "Computadores portátiles",
  "Accesorios de computación",
  "Tablets",
  "Impresoras y tintas",
  "Desktops",
  "Computadora todo en uno",
  "Software",
  "Monitores para pc",
];
