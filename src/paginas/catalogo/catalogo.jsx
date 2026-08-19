import { useState } from "react";
import "./catalogo.css";
import { Link } from "react-router-dom";

import imgPortatiles from "../../assets/public (1).webp";
import imgAccesorios from "../../assets/teclado.webp";
import imgTablets from "../../assets/public (1) (1).webp";
import imgImpresoras from "../../assets/public (2) (1).webp";
import imgDesktops from "../../assets/public (3) (1).webp";
import imgTodoEnUno from "../../assets/public (4).webp";
import imgSoftware from "../../assets/public (5).webp";
import imgMonitores from "../../assets/public (6).webp";
import imgAlmacenamiento from "../../assets/public (7).webp";

function Catalogo() {
  const [paginaActual, setPaginaActual] = useState(1);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  const [marcaSeleccionada, setMarcaSeleccionada] = useState("");
  
  // ==========================================
  // DATOS
  // ==========================================
  
  const categoriasCirculares = [
    { titulo: "Computadores Portátiles", imagen: imgPortatiles, categoria: "portátil" },
    { titulo: "Accesorios de computación", imagen: imgAccesorios, categoria: "accesorio" },
    { titulo: "Tablets", imagen: imgTablets, categoria: "tablet" },
    { titulo: "Impresoras y Tintas", imagen: imgImpresoras, categoria: "impresora" },
    { titulo: "Desktops", imagen: imgDesktops, categoria: "desktop" },
    { titulo: "Computadora Todo en uno", imagen: imgTodoEnUno, categoria: "desktop" },
    { titulo: "Software", imagen: imgSoftware, categoria: "software" },
    { titulo: "Monitores para pc", imagen: imgMonitores, categoria: "monitor" },
    { titulo: "Almacenamiento", imagen: imgAlmacenamiento, categoria: "disco" }
  ];

  const productosIniciales = [
    { id: 1, marca: "LENOVO", nombre: "Kindle paperwhite 2024 32gb 7\" Signature Edition Negra", referencia: "por pctel computo", precio: "$ 979.900", precioSecundario: "$ 1.019.000", precioSecundario1: "$ 1.399.000", descuento: "-30%", imagen: "https://media.falabella.com/falabellaCO/142972175_01/w=1200,h=1200,fit=pad", etiqueta: "CYBER" },
    { id: 2, marca: "HP", nombre: "Impresora Multifuncional Smart Tank 585 Wifi + resma", referencia: "Por TS ONLINE", precio: "$ 679.900", precioSecundario: "$ 709.900", precioSecundario1: "$ 1.199.000", descuento: "-43%", imagen: "https://media.falabella.com.co/falabellaCO/137155110_01/width=480,height=480,quality=70,format=webp,fit=pad", etiqueta: "CYBER" },
    { id: 3, marca: "HP", nombre: "Portátil 15.6\" Full HD AMD Ryzen 7 7730U 16GB RAM 512GB SSD Plata", referencia: "Por Compumarket Bga", precio: "$ 1.979.900", precioSecundario: "$ 2.099.900", precioSecundario1: "$ 3.699.780", descuento: "-46%", imagen: "https://media.falabella.com.co/falabellaCO/127619968_01/width=480,height=480,quality=70,format=webp,fit=pad", etiqueta: "CYBER", envioGratis: true, promocion: "NUEVO - REPOTENCIADO" },
    { id: 4, marca: "STARLINK", nombre: "Kit de internet satelital estándar V4", referencia: "Por SENABELLA", precio: "$ 1.599.000", precioSecundario: "$ 2.790.000", precioSecundario1: "$ 3.599.900", descuento: "-44%", imagen: "https://media.falabella.com.co/falabellaCO/73053329_1/width=340,height=340,quality=70,format=webp,fit=pad", etiqueta: "CYBER", verificado: true },
    { id: 5, marca: "HP", nombre: "Portátil HP 15-Fc0276La Amd Ryzen7 7730U 8Cores/16Gb/ 1Tb Ssd/Fhd 15.6/ Plateado Natural Win11 1.59Kg", referencia: "Por SENABELLA", precio: "$ 279.900", precioSecundario: "$ 299.900", precioSecundario1: "$ 599.900", descuento: "-53%", imagen: "https://media.falabella.com.co/falabellaCO/73354813_01/width=340,height=340,quality=70,format=webp,fit=pad", etiqueta: "CYBER" },
    { id: 6, marca: "LENOVO", nombre: "Tablet Lenovo Tab Plus 8GB RAM 128GB / 8 Speakers / Funda + auriculares Moto Buds - Gris", referencia: "Lenovo asia pacific limited sucursal colombia", precio: "$ 809.900", precioSecundario: "$ 849.900", precioSecundario1: "$ 1.999.900", descuento: "-60%", imagen: "https://media.falabella.com.co/falabellaCO/139001771_01/width=480,height=480,quality=70,format=webp,fit=pad", etiqueta: "CYBER" },
    { id: 7, marca: "HP", nombre: "Impresora Multifuncional HP Smart Tank 585 Wifi + resma", referencia: "por ts online", precio: "$ 679.900", precioSecundario: "$ 709.900", precioSecundario1: "$ 1.199.000", descuento: "-43%", imagen: "https://media.falabella.com.co/falabellaCO/134370606_01/width=480,height=480,quality=70,format=webp,fit=pad", etiqueta: "CYBER" },
    { id: 8, marca: "TOSHIBA", nombre: "Disco duro externo 2tb toshiba usb 3.0 + estuche", referencia: "por lapto partes", precio: "$ 429.210", precioSecundario: "$ 476.900", precioSecundario1: "$ 550.000", descuento: "-22%", imagen: "https://media.falabella.com/falabellaCO/124164429_01/w=1200,h=1200,fit=pad", etiqueta: "CYBER", verificado: true },
    { id: 9, marca: "DELL", nombre: "Portátil Dell Inspiron 15 3520 Intel Core i5 16GB RAM 512GB SSD 15.6\"", referencia: "Por SENABELLA", precio: "$ 2.199.900", precioSecundario: "$ 2.399.900", precioSecundario1: "$ 3.299.900", descuento: "-35%", imagen: "https://media.falabella.com.co/falabellaCO/127619968_01/width=480,height=480,quality=70,format=webp,fit=pad", etiqueta: "CYBER" },
    { id: 10, marca: "ASUS", nombre: "Portátil Gamer ASUS TUF Gaming F15 Intel Core i7 16GB RAM RTX 3050", referencia: "Por SENABELLA", precio: "$ 3.899.900", precioSecundario: "$ 4.199.900", precioSecundario1: "$ 5.399.900", descuento: "-28%", imagen: "https://media.falabella.com.co/falabellaCO/73354813_01/width=340,height=340,quality=70,format=webp,fit=pad", etiqueta: "CYBER" },
    { id: 11, marca: "EPSON", nombre: "Impresora Multifuncional Epson EcoTank L3250 Wi-Fi Tinta Continua", referencia: "Por TS ONLINE", precio: "$ 799.900", precioSecundario: "$ 849.900", precioSecundario1: "$ 1.099.900", descuento: "-25%", imagen: "https://media.falabella.com.co/falabellaCO/137155110_01/width=480,height=480,quality=70,format=webp,fit=pad", etiqueta: "CYBER" },
    { id: 12, marca: "ACER", nombre: "Portátil Acer Aspire 5 Intel Core i5 8GB RAM 512GB SSD 15.6\" Full HD", referencia: "Por SENABELLA", precio: "$ 1.849.900", precioSecundario: "$ 1.999.900", precioSecundario1: "$ 2.599.900", descuento: "-30%", imagen: "https://media.falabella.com.co/falabellaCO/127619968_01/width=480,height=480,quality=70,format=webp,fit=pad", etiqueta: "CYBER" },
    { id: 13, marca: "LOGITECH", nombre: "Kit Teclado y Mouse Inalámbrico Logitech MK270 Conexión USB 2.4GHz", referencia: "Por SENABELLA", precio: "$ 119.900", precioSecundario: "$ 139.900", precioSecundario1: "$ 159.900", descuento: "-20%", imagen: "https://media.falabella.com.co/falabellaCO/124164429_01/w=1200,h=1200,fit=pad", etiqueta: "CYBER" },
    { id: 14, marca: "MICROSOFT", nombre: "Licencia Microsoft 365 Personal 1 Año Suscripción Digital 1 Usuario", referencia: "Por SENABELLA", precio: "$ 249.900", precioSecundario: "$ 269.900", precioSecundario1: "$ 299.900", descuento: "-15%", imagen: "https://media.falabella.com/falabellaCO/73424390_1/w=1200,h=1200,fit=pad", etiqueta: "CYBER" },
    { id: 15, marca: "AMD", nombre: "Procesador AMD Ryzen 7 5700G 8 Núcleos 3.8GHz Gráficos Radeon Vega", referencia: "Por SENABELLA", precio: "$ 899.900", precioSecundario: "$ 949.900", precioSecundario1: "$ 1.199.900", descuento: "-25%", imagen: "https://media.falabella.com.co/falabellaCO/73354813_01/width=340,height=340,quality=70,format=webp,fit=pad", etiqueta: "CYBER" },
    { id: 16, marca: "GENERICO", nombre: "Soporte de Aluminio Plegable y Ajustable para Portátil y Tablet", referencia: "Por SENABELLA", precio: "$ 49.900", precioSecundario: "$ 59.900", precioSecundario1: "$ 89.900", descuento: "-40%", imagen: "https://media.falabella.com/falabellaCO/140922701_01/w=1200,h=1200,fit=pad", etiqueta: "CYBER" },
    { id: 17, marca: "JALTECH", nombre: "Adaptador Hub USB Type-C 7 en 1 HDMI 4K USB 3.0 Lector de Tarjetas SD", referencia: "Por SENABELLA", precio: "$ 89.900", precioSecundario: "$ 99.900", precioSecundario1: "$ 139.900", descuento: "-35%", imagen: "https://media.falabella.com/falabellaCO/155656024_01/w=1200,h=1200,fit=pad", etiqueta: "CYBER" }
  ];

  const marcasBotones = ["LENOVO", "HP", "DELL", "ASUS", "STARLINK", "EPSON", "ACER", "LOGITECH", "MICROSOFT", "AMD", "GENERICO", "JALTECH"];
  const categoriasListaLateral = ["Computadores portátiles", "Accesorios de computación", "Tablets", "Impresoras y tintas", "Desktops", "Computadora todo en uno", "Software", "Monitores para pc"];

  // ==========================================
  // LÓGICA DE FILTRADO
  // ==========================================
  
  const productosFiltrados = productosIniciales.filter(prod => {
    let cumpleMarca = marcaSeleccionada === "" || prod.marca === marcaSeleccionada;
    let cumpleCategoria = true;
    
    if (categoriaSeleccionada !== "") {
       cumpleCategoria = prod.nombre.toLowerCase().includes(categoriaSeleccionada) || 
                         prod.marca.toLowerCase().includes(categoriaSeleccionada);
    }
    
    return cumpleMarca && cumpleCategoria;
  });

  // Paginación (12 items por página aprox, pero aquí son 17 en total)
  const itemsPorPagina = 12;
  const paginasTotales = Math.ceil(productosFiltrados.length / itemsPorPagina);
  const inicioIndice = (paginaActual - 1) * itemsPorPagina;
  const productosPaginados = productosFiltrados.slice(inicioIndice, inicioIndice + itemsPorPagina);

  // ==========================================
  // MANEJADORES
  // ==========================================
  
  const toggleCategoria = (cat) => {
    setCategoriaSeleccionada(prev => prev === cat ? "" : cat);
    setPaginaActual(1);
  };
  
  const toggleMarca = (marca) => {
    setMarcaSeleccionada(prev => prev === marca ? "" : marca);
    setPaginaActual(1);
  };

  const agregarFavorito = (e) => {
    e.preventDefault();
    e.target.classList.toggle("fa-solid");
    e.target.classList.toggle("fa-regular");
    e.target.style.color = e.target.classList.contains("fa-solid") ? "#e63946" : "";
  };

  return (
    <>
      <section className="categorias-circulares">
        {categoriasCirculares.map((cat, idx) => (
          <div 
            className={`categoria ${categoriaSeleccionada === cat.categoria ? 'circulo-activo' : ''}`} 
            key={idx}
            onClick={() => toggleCategoria(cat.categoria)}
            style={{ cursor: 'pointer', transform: categoriaSeleccionada === cat.categoria ? 'scale(1.08)' : '' }}
          >
            <div className="imagen-cat" style={{ border: categoriaSeleccionada === cat.categoria ? '2px solid #84b814' : '' }}>
              <img src={cat.imagen} alt={cat.titulo} />
            </div>
            <div className="titulo-cat">{cat.titulo}</div>
          </div>
        ))}
      </section>

      <main className="main">
        {/* Menu lateral */}
        <aside className="menu_lateral">
          <div className="contenido-menu">
            <div className="menu-texto">
              <h3>Tecnología</h3>
              <h2>Computadores</h2>
              <div className="resultados">Resultados ({productosFiltrados.length})</div>
            </div>

            <div className="filtro">
              <div className="filtro1">
                Tipo de Entrega
                <i className="fa-solid fa-chevron-up"></i>
              </div>
              <div className="opcion-domicilio">
                <div>
                  <i className="fa-solid fa-truck"></i>
                  Envío a domicilio
                </div>
                <input type="checkbox" />
              </div>
              <div className="info-entrega">
                <span className="texto-gratis">Gratis</span>
                <span className="texto-2">Llega mañana</span>
              </div>
            </div>

            <div className="filtro">
              <div className="filtro1">
                Categoría
                <i className="fa-solid fa-chevron-up"></i>
              </div>
              <div className="categorias-lista">
                {categoriasListaLateral.map((cat, i) => (
                  <span 
                    key={i} 
                    className="categoria-lis" 
                    style={{ cursor: 'pointer' }}
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>

            {/* Agregamos solo algunos filtros de ejemplo de los muchos que había */}
            <div className="filtro">
              <div className="filtro1">
                Marca
                <i className="fa-solid fa-chevron-down"></i>
              </div>
            </div>
            
            <div className="filtro">
              <div className="filtro1">
                Precio
                <i className="fa-solid fa-chevron-down"></i>
              </div>
            </div>
          </div>
        </aside>

        {/* Productos */}
        <section className="marca">
          <div className="filtro-marca">
            <span className="titulo-marca">Filtrar por <strong>Marca</strong></span>
            <div className="botones" style={{ scrollBehavior: "smooth" }}>
              {marcasBotones.map(marca => (
                <button 
                  key={marca}
                  className={marcaSeleccionada === marca ? 'sn-activo' : ''}
                  style={marcaSeleccionada === marca ? { background: '#84b814', color: '#fff' } : {}}
                  onClick={() => toggleMarca(marca)}
                >
                  {marca}
                </button>
              ))}
            </div>
            <button className="boton-flecha" onClick={(e) => {
              const contenedor = e.currentTarget.previousElementSibling;
              if (contenedor) contenedor.scrollLeft += 220;
            }}>
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          </div>

          <div className="recomendacion">
            <div className="recomendacion1">
              <span>Ordenar por:</span>
              <select className="opciones-recomendacion">
                <option>Recomendados</option>
                <option>Menor precio</option>
                <option>Mayor precio</option>
              </select>
            </div>
            <div className="num-pagina">
              <i 
                className="fa-solid fa-chevron-left" 
                style={{ cursor: 'pointer' }}
                onClick={() => setPaginaActual(prev => Math.max(1, prev - 1))}
              ></i>
              
              {Array.from({ length: paginasTotales }).map((_, i) => (
                <span 
                  key={i} 
                  className={`pag-2 ${paginaActual === i + 1 ? 'active' : ''}`}
                  style={{ 
                    cursor: 'pointer', 
                    fontWeight: paginaActual === i + 1 ? 'bold' : 'normal',
                    color: paginaActual === i + 1 ? '#84b814' : ''
                  }}
                  onClick={() => setPaginaActual(i + 1)}
                >
                  {i + 1}
                </span>
              ))}
              
              <i 
                className="fa-solid fa-chevron-right"
                style={{ cursor: 'pointer' }}
                onClick={() => setPaginaActual(prev => Math.min(paginasTotales, prev + 1))}
              ></i>
            </div>
          </div>

          <div className="tarjeta-producto">
            {productosPaginados.map(prod => (
              <div className="tar-producto" key={prod.id}>
                {prod.promocion && <span className="promocion">{prod.promocion}</span>}
                <a href="#">
                  <img src={prod.imagen} alt={prod.marca} />
                </a>
                <div className="etiqueta">
                  <span>{prod.etiqueta}</span>
                  {prod.envioGratis && <span className="etiqueta-envio">Envío gratis</span>}
                </div>
                <div className="nom-producto">{prod.marca}</div>
                <div className="descripcion">{prod.nombre}</div>
                <div className="referencia">
                  {prod.referencia} {prod.verificado && <i className="fa-solid fa-check-circle"></i>}
                </div>
                
                <i className="fa-regular fa-heart favorite-btn" onClick={agregarFavorito} style={{ cursor: 'pointer' }}></i>
                
                <div>
                  <div className="metodo">
                    <span className="unica">ÚNICA</span>
                    <span className="cmr">CMR</span>
                    <span className="debito">Débito</span>
                  </div>
                  <div className="precio">
                    {prod.precio}
                    {prod.descuento && <span className="descuento">{prod.descuento}</span>}
                  </div>
                  {prod.precioSecundario && <div className="precio-secundario">{prod.precioSecundario}</div>}
                  {prod.precioSecundario1 && <div className="precio-secundario1">{prod.precioSecundario1}</div>}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}

export default Catalogo;
