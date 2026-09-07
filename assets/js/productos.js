// ============================================================
// SABOR A PUEBLO - CATÁLOGO PRINCIPAL DE PRODUCTOS
// Archivo: assets/js/productos.js
// ============================================================

const platosSaborAPueblo = [

    // ========================================================
    // FIAMBRES
    // ========================================================
    {
        id: 2,
        nombre: "Fiambre Especial",
        descripcion: "La combinación perfecta de arepa, chorizo, carne molida y el toque tradicional de la casa. Incluye gaseosa personal.",
        precio: 20000,
        categoria: "Fiambres",
        imagen: "assets/img/platos/fiambre2.webp",
        disponible: true,
        recomendado: true,
        destacado: true,
        nuevo: false
    },

    // ========================================================
    // PLATOS FUERTES
    // ========================================================
    {
        id: 3,
        nombre: "El Arriero",
        descripcion: "Deliciosa carne asada o apanada, patacón crujiente, ensalada fresca, papas a la francesa y limón.",
        precio: 15000,
        categoria: "Platos Fuertes",
        imagen: "assets/img/platos/arriero.webp",
        disponible: true,
        recomendado: false,
        destacado: false,
        nuevo: false
    },
    {
        id: 6,
        nombre: "El Abastecedor",
        descripcion: "Una explosión de sabor con chicharrón carnudo, arepa frita, papas a la francesa y una fresca ensalada.",
        precio: 14000,
        categoria: "Platos Fuertes",
        imagen: "assets/img/platos/abastecedor.webp",
        disponible: true,
        recomendado: false,
        destacado: false,
        nuevo: false
    },

    // ========================================================
    // ESPECIALIDADES
    // ========================================================
    {
        id: 4,
        nombre: "Sabor Casero",
        descripcion: "Patacón crujiente acompañado de carnes mixtas, queso derretido, hogao, maíz y tres huevos, servido con platanito maduro.",
        precio: 15000,
        categoria: "Especialidades",
        imagen: "assets/img/platos/sabor-casero.webp",
        disponible: true,
        recomendado: true,
        destacado: true,
        nuevo: false
    },

    // ========================================================
    // PARA COMPARTIR
    // ========================================================
    {
        id: 5,
        nombre: "Pataconcitos Mix",
        descripcion: "Porción de 10 deliciosos pataconcitos acompañados de salchicha en salsa especial de la casa.",
        precio: 18000,
        categoria: "Para Compartir",
        imagen: "assets/img/platos/patacon-mix.webp",
        disponible: true,
        recomendado: false,
        destacado: false,
        nuevo: false
    },

    // ========================================================
    // ADICIONES
    // ========================================================
    {
        id: 7,
        nombre: "Adición Especial",
        descripcion: "Perfecta combinación de torta de carne bien sazonada y arepa caliente. Incluye gaseosa personal.",
        precio: 5000,
        categoria: "Adiciones",
        imagen: "assets/img/platos/adicion.webp",
        disponible: true,
        recomendado: false,
        destacado: false,
        nuevo: false
    },

    // ========================================================
    // ENTRADAS
    // ========================================================
    {
        id: 8,
        nombre: "Empanadas Crocantes",
        descripcion: "Deliciosas empanadas crocantes, rellenas de la mejor sazón de la casa.",
        precio: 2000,
        categoria: "Entradas",
        imagen: "assets/img/platos/empanadas.webp",
        disponible: true,
        recomendado: true,
        destacado: false,
        nuevo: false,
        opciones: [
            { nombre: "Unidad (1 emp.)", precio: 2000, detalle: "Sin bebida" },
            { nombre: "Canasta x7", precio: 12000, detalle: "Sin bebida" },
            { nombre: "Canasta x10", precio: 18000, detalle: "Sin bebida" },
            { nombre: "Canasta x15", precio: 30000, detalle: "🥤 ¡Incluye Gaseosa!" }
        ]
    },
    {
        id: 9,
        nombre: "El Antojito",
        descripcion: "Completo plato con dos patacones, arepa frita, chorizo de la casa y platanitos maduros.",
        precio: 12000,
        categoria: "Entradas",
        imagen: "assets/img/platos/antojito.webp",
        disponible: true,
        recomendado: false,
        destacado: false,
        nuevo: false
    }
];

// ============================================================
// FUNCIONES AUXILIARES Y CONSULTAS AL CATÁLOGO
// ============================================================

/**
 * Devuelve únicamente los productos marcados como disponibles.
 */
function obtenerProductosDisponibles() {
    return platosSaborAPueblo.filter(producto => producto.disponible !== false);
}

/**
 * Devuelve la lista de categorías únicas disponibles en el catálogo.
 */
function obtenerCategorias() {
    const productos = obtenerProductosDisponibles();
    const categorias = productos.map(p => p.categoria);
    return ["Todos", ...new Set(categorias)];
}

/**
 * Devuelve productos filtrados por categoría ("Todos" devuelve la lista completa disponible).
 */
function obtenerProductosPorCategoria(categoria) {
    const disponibles = obtenerProductosDisponibles();
    if (!categoria || categoria === "Todos") return disponibles;
    return disponibles.filter(producto => producto.categoria === categoria);
}

/**
 * Devuelve productos recomendados.
 */
function obtenerProductosRecomendados() {
    return platosSaborAPueblo.filter(
        producto => producto.disponible !== false && producto.recomendado === true
    );
}

/**
 * Devuelve productos destacados.
 */
function obtenerProductosDestacados() {
    return platosSaborAPueblo.filter(
        producto => producto.disponible !== false && producto.destacado === true
    );
}

/**
 * Devuelve productos marcados como nuevos.
 */
function obtenerProductosNuevos() {
    return platosSaborAPueblo.filter(
        producto => producto.disponible !== false && producto.nuevo === true
    );
}

/**
 * Busca un producto específico por su ID.
 */
function obtenerProductoPorId(id) {
    return platosSaborAPueblo.find(
        producto => Number(producto.id) === Number(id)
    );
}

/**
 * Formatea valores numéricos a formato de moneda colombiana (COP).
 * Ejemplo: 17000 -> "$ 17.000"
 */
function formatearPrecioCOP(valor) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(valor);
}