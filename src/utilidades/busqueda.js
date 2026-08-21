// utilidades de búsqueda inteligente sin tildes y con palabras clave/sinónimos

export const eliminarTildes = (texto) => {
  if (!texto) return "";
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
};

export const esBusquedaDeRopa = (busqueda) => {
  if (!busqueda) return false;
  const queryNorm = eliminarTildes(busqueda.trim());
  const palabrasClaveRopa = [
    "ropa", "mujer", "hombre", "calzado", "tenis", "zapato", "camisa", "vestido", 
    "falda", "blusa", "chaqueta", "jean", "mochila", "reloj", "bufanda", "belleza", 
    "pareja", "moda", "accesorio", "correa", "bolso", "medias", "camiseta", "boxer", 
    "short", "bermuda", "pantalon", "saco", "buzo", "sueter", "talla", "abrigo",
    "femenin", "masculin", "dama", "caballer", "muj", "hom", "zap", "calz", "ten", "rel"
  ];
  return palabrasClaveRopa.some(keyword => queryNorm.includes(keyword) || keyword.includes(queryNorm));
};

export const cumpleBusquedaInteligente = (producto, busqueda) => {
  if (!busqueda) return true;
  
  const queryNorm = eliminarTildes(busqueda.trim());
  if (!queryNorm) return true;

  // Campos del producto normalizados
  const prodNombre = eliminarTildes(producto.nombre || "");
  const prodMarca = eliminarTildes(producto.marca || "");
  const prodCat = eliminarTildes(producto.categoria || "");
  const prodRef = eliminarTildes(producto.referencia || "");
  const prodEtiq = eliminarTildes(producto.etiqueta || "");

  const textoCompleto = `${prodNombre} ${prodMarca} ${prodCat} ${prodRef} ${prodEtiq}`;

  // 1. Direct match (sin tildes)
  if (textoCompleto.includes(queryNorm)) {
    return true;
  }

  // 2. Mapeo de sinónimos y prefijos
  // com / comp -> computador, computadora, pc, portatil, desktop, todo en uno, lenovo, hp, dell, asus, acer
  if (
    queryNorm === "com" || 
    queryNorm === "comp" || 
    queryNorm.startsWith("computad") || 
    queryNorm === "pc" || 
    queryNorm === "laptop" ||
    queryNorm === "ordenador"
  ) {
    const esComputador = 
      prodCat.includes("portatil") || 
      prodCat.includes("desktop") || 
      prodCat.includes("todo-en-uno") || 
      prodNombre.includes("portatil") || 
      prodNombre.includes("laptop") || 
      prodNombre.includes("ideapad") ||
      prodNombre.includes("computador") ||
      ["lenovo", "hp", "dell", "asus", "acer", "pc"].some(m => prodMarca.includes(m) || prodNombre.includes(m));
    if (esComputador) return true;
  }

  // imp / impr -> impresora, tintas
  if (queryNorm === "imp" || queryNorm.startsWith("impres")) {
    if (
      prodCat.includes("impresora") || 
      prodNombre.includes("impresora") || 
      prodNombre.includes("smart tank") || 
      prodNombre.includes("tinta") ||
      prodNombre.includes("epson") ||
      prodMarca.includes("epson")
    ) {
      return true;
    }
  }

  // cam -> camara
  if (queryNorm === "cam" || queryNorm === "cama" || queryNorm.startsWith("camar")) {
    // Para evitar falsos positivos con camisas
    if (
      prodCat.includes("camara") || 
      prodNombre.includes("camara") || 
      prodNombre.includes("digital") || 
      prodNombre.includes("foto")
    ) {
      return true;
    }
  }

  // tab -> tablet, tableta, kindle
  if (queryNorm === "tab" || queryNorm.startsWith("tablet") || queryNorm === "ipad") {
    if (
      prodCat.includes("tablet") || 
      prodCat.includes("tableta") || 
      prodNombre.includes("tablet") || 
      prodNombre.includes("tableta") || 
      prodNombre.includes("kindle")
    ) {
      return true;
    }
  }

  // play / ps4 / cons / jueg -> playstation, consola, juego
  if (
    queryNorm === "play" || 
    queryNorm === "ps4" || 
    queryNorm.startsWith("cons") || 
    queryNorm.startsWith("jueg")
  ) {
    if (
      prodNombre.includes("playstation") || 
      prodNombre.includes("consola") || 
      prodNombre.includes("control") || 
      prodCat.includes("tecno")
    ) {
      if (prodNombre.includes("playstation") || prodNombre.includes("consola")) return true;
    }
  }

  // aud / audi -> audifonos, auriculares, buds
  if (
    queryNorm === "aud" || 
    queryNorm.startsWith("audi") || 
    queryNorm === "aur" || 
    queryNorm.startsWith("auric")
  ) {
    if (
      prodNombre.includes("audifonos") || 
      prodNombre.includes("auriculares") || 
      prodNombre.includes("buds") || 
      prodNombre.includes("redmi buds")
    ) {
      return true;
    }
  }

  // tec -> tecnologia
  if (queryNorm === "tec" || queryNorm.startsWith("tecnol")) {
    if (prodCat.includes("tecno") || prodCat.includes("tecnologia")) {
      return true;
    }
  }

  // Ropa / accesorios:
  // zap / calz / ten -> zapatos, calzado, tenis, running
  if (
    queryNorm === "zap" || 
    queryNorm === "calz" || 
    queryNorm === "ten" || 
    queryNorm.startsWith("tenis") || 
    queryNorm.startsWith("zapat")
  ) {
    if (
      prodCat.includes("calzado") || 
      prodNombre.includes("tenis") || 
      prodNombre.includes("calzado") || 
      prodNombre.includes("zapatos") || 
      prodNombre.includes("running")
    ) {
      return true;
    }
  }

  // rel -> relojes, reloj, smartwatch
  if (queryNorm === "rel" || queryNorm.startsWith("reloj")) {
    if (
      prodCat.includes("relojes") || 
      prodCat.includes("reloj") || 
      prodNombre.includes("reloj") || 
      prodNombre.includes("smartwatch")
    ) {
      return true;
    }
  }

  // hom -> hombre, masculino
  if (queryNorm === "hom" || queryNorm.startsWith("homb")) {
    if (
      prodCat.includes("hombre") || 
      prodNombre.includes("hombre") || 
      prodNombre.includes("masculina") || 
      prodNombre.includes("camisa") || 
      prodNombre.includes("jean") || 
      prodNombre.includes("chaqueta")
    ) {
      return true;
    }
  }

  // muj -> mujer, femenina, blusa, vestido, falda
  if (queryNorm === "muj" || queryNorm.startsWith("muje")) {
    if (
      prodCat.includes("mujer") || 
      prodNombre.includes("mujer") || 
      prodNombre.includes("femenina") || 
      prodNombre.includes("vestido") || 
      prodNombre.includes("falda") || 
      prodNombre.includes("blusa")
    ) {
      return true;
    }
  }

  // rop -> ropa, moda
  if (
    queryNorm === "rop" || 
    queryNorm.startsWith("ropa") || 
    queryNorm === "mod" || 
    queryNorm.startsWith("moda")
  ) {
    if (
      prodCat.includes("mujer") || 
      prodCat.includes("hombre") || 
      prodCat.includes("calzado") || 
      prodCat.includes("accesorios")
    ) {
      return true;
    }
  }

  return false;
};
