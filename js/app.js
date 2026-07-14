// js/app.js

let carrito = [];

// ==========================================
// 1. RENDERIZAR EL MENÚ DINÁMICO
// ==========================================
function renderizarMenu() {
    const contenedor = document.getElementById("contenedor-menu");
    if (!contenedor) return;
    
    contenedor.innerHTML = ""; // Limpiar el contenedor

    // Pintar cada plato con su foto real
    platosSaborAPueblo.forEach(plato => {
        contenedor.innerHTML += `
            <div class="bg-white rounded-2xl shadow-md border border-blue-100 flex flex-col justify-between overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1">
                <div class="h-48 w-full overflow-hidden bg-blue-50 relative">
                    <img src="${plato.imagen}" alt="${plato.nombre}" class="w-full h-full object-cover transition-transform duration-500 hover:scale-110" onerror="this.src='img/STIKERS_SABOR_A_PUEBLO.webp'">
                    <span class="absolute top-3 right-3 bg-puebloYellow text-puebloDark text-xs font-extrabold px-3 py-1 rounded-full shadow">
                        ${plato.categoria}
                    </span>
                </div>
                <div class="p-5 flex-grow flex flex-col justify-between">
                    <div>
                        <h3 class="font-bold text-xl text-puebloBlue">${plato.nombre}</h3>
                        <p class="text-gray-600 text-sm mt-2 leading-relaxed">${plato.descripcion}</p>
                    </div>
                    <div class="flex justify-between items-center mt-5 pt-4 border-t border-blue-50">
                        <span class="font-extrabold text-2xl text-puebloDark">$${plato.precio.toLocaleString()}</span>
                        <button onclick="agregarAlCarrito(${plato.id})" 
                            class="bg-puebloBlue hover:bg-puebloYellow hover:text-puebloDark text-white font-bold py-2 px-5 rounded-xl text-sm transition-all duration-300 shadow">
                            + Agregar
                        </button>
                    </div>
                </div>
            </div>
        `;
    });

    // Tarjeta de Antojo Directo en el Menú
    contenedor.innerHTML += `
        <div class="bg-puebloDark p-6 rounded-2xl shadow-lg text-white flex flex-col justify-between border-4 border-puebloYellow min-h-[350px]">
            <div>
                <span class="text-4xl">👨‍🍳✨</span>
                <h3 class="font-bold text-2xl mt-4 text-puebloYellow">¿Buscas algo diferente?</h3>
                <p class="text-blue-100 text-sm mt-3 leading-relaxed">
                    ¿Tienes un antojo especial o buscas un plato diferente? ¡Cuéntanos! En Sabor a Pueblo nos encanta hacer realidad tus antojos. Escríbenos con anterioridad y personalizamos tu menú.
                </p>
            </div>
            <button onclick="enviarAntojoEspecial()" class="mt-6 w-full bg-puebloYellow hover:bg-white text-puebloDark font-bold py-3 px-4 rounded-xl text-sm transition-all shadow-md text-center">
                💬 Pedir mi antojo personalizado
            </button>
        </div>
    `;
}

// ==========================================
// 2. SISTEMA AVANZADO DE CARRITO DE COMPRAS
// ==========================================

function agregarAlCarrito(id) {
    const producto = platosSaborAPueblo.find(p => p.id === id);
    if (!producto) return;

    const itemExistente = carrito.find(item => item.id === id);

    if (itemExistente) {
        itemExistente.cantidad += 1;
    } else {
        carrito.push({
            ...producto,
            cantidad: 1
        });
    }

    actualizarInterfazCarrito();
    mostrarAnimacionToast(producto.nombre);
}

function restarDelCarrito(id) {
    const itemExistente = carrito.find(item => item.id === id);
    if (!itemExistente) return;

    itemExistente.cantidad -= 1;

    if (itemExistente.cantidad <= 0) {
        eliminarDelCarrito(id);
        return;
    }

    actualizarInterfazCarrito();
}

function eliminarDelCarrito(id) {
    carrito = carrito.filter(item => item.id !== id);
    actualizarInterfazCarrito();
}

function vaciarCarrito() {
    carrito = [];
    actualizarInterfazCarrito();
    cerrarModalCarrito();
}

// Actualiza barra, desglose de domicilio y totales
function actualizarInterfazCarrito() {
    const barra = document.getElementById("barra-carrito");
    const cantidadText = document.getElementById("carrito-cantidad");
    const totalText = document.getElementById("carrito-total");
    
    const modalSubtotal = document.getElementById("modal-subtotal");
    const modalDomicilioValor = document.getElementById("modal-domicilio-valor");
    const modalTotal = document.getElementById("modal-total");
    
    const listaDetalles = document.getElementById("lista-carrito-detalles");

    if (carrito.length === 0) {
        if (barra) barra.classList.add("hidden");
        cerrarModalCarrito();
        return;
    }

    if (barra) barra.classList.remove("hidden");

    const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    const subtotalComida = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);

    // Regla de Domicilio gratis a partir de $15.000 (Domicilio base de $2.000)
    let costoDomicilio = 0;
    if (subtotalComida < 15000) {
        costoDomicilio = 2000; 
    }

    const granTotal = subtotalComida + costoDomicilio;

    if (cantidadText) cantidadText.innerText = `${totalItems} ${totalItems === 1 ? 'plato' : 'platos'}`;
    if (totalText) totalText.innerText = `$${granTotal.toLocaleString()}`;

    if (modalSubtotal) modalSubtotal.innerText = `$${subtotalComida.toLocaleString()}`;
    
    if (modalDomicilioValor) {
        if (costoDomicilio === 0) {
            modalDomicilioValor.innerHTML = `<span class="text-green-600 font-extrabold animate-pulse">¡GRATIS! 🎉</span>`;
        } else {
            modalDomicilioValor.innerText = `$${costoDomicilio.toLocaleString()}`;
        }
    }
    
    if (modalTotal) modalTotal.innerText = `$${granTotal.toLocaleString()}`;

    if (listaDetalles) {
        listaDetalles.innerHTML = "";
        carrito.forEach(item => {
            listaDetalles.innerHTML += `
                <div class="flex items-center justify-between bg-blue-50/50 p-3 rounded-xl border border-blue-100">
                    <div class="flex-1 pr-2">
                        <h4 class="font-bold text-sm text-puebloDark">${item.nombre}</h4>
                        <p class="text-xs text-puebloBlue font-bold">$${(item.precio * item.cantidad).toLocaleString()}</p>
                    </div>
                    
                    <div class="flex items-center bg-white rounded-lg border border-blue-200 p-1 shadow-sm">
                        <button onclick="restarDelCarrito(${item.id})" class="text-puebloBlue hover:text-red-500 font-bold px-2.5 py-0.5 transition-colors">
                            -
                        </button>
                        <span class="font-extrabold text-sm text-puebloDark px-2 min-w-[20px] text-center">
                            ${item.cantidad}
                        </span>
                        <button onclick="agregarAlCarrito(${item.id})" class="text-puebloBlue hover:text-puebloYellow font-bold px-2.5 py-0.5 transition-colors">
                            +
                        </button>
                    </div>
                    
                    <button onclick="eliminarDelCarrito(${item.id})" class="ml-3 text-gray-400 hover:text-red-500 transition-colors text-sm p-1">
                        🗑️
                    </button>
                </div>
            `;
        });
    }
}

function mostrarAnimacionToast(nombre) {
    const toast = document.createElement("div");
    toast.className = "fixed top-5 right-5 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-[9999] animate-bounce text-sm font-bold";
    toast.innerHTML = `✅ ¡Agregado!: ${nombre}`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
}

// ==========================================
// 3. CONTROL DEL MODAL (VER DETALLE)
// ==========================================
function abrirModalCarrito() {
    const modal = document.getElementById("modal-carrito");
    if (!modal) return;
    
    modal.classList.remove("pointer-events-none");
    modal.classList.add("opacity-100");
    
    const modalContent = modal.firstElementChild;
    if (modalContent) {
        modalContent.classList.remove("translate-y-full", "md:scale-95");
        modalContent.classList.add("translate-y-0", "md:scale-100");
    }
}

function cerrarModalCarrito() {
    const modal = document.getElementById("modal-carrito");
    if (!modal) return;
    
    const modalContent = modal.firstElementChild;
    if (modalContent) {
        modalContent.classList.remove("translate-y-0", "md:scale-100");
        modalContent.classList.add("translate-y-full", "md:scale-95");
    }
    
    setTimeout(() => {
        modal.classList.add("pointer-events-none");
        modal.classList.remove("opacity-100");
    }, 200);
}

// ==========================================
// 4. ENVÍO DEL PEDIDO POR WHATSAPP
// ==========================================
function enviarPedidoWhatsApp() {
    if (carrito.length === 0) return;

    let mensaje = "¡Hola Sabor a Pueblo! 👋 Me gustaría hacer el siguiente pedido:\n\n";
    let subtotalPlatos = 0;

    carrito.forEach(item => {
        const subtotalItem = item.precio * item.cantidad;
        subtotalPlatos += subtotalItem;
        mensaje += `🔸 *${item.cantidad}x* ${item.nombre} - $${subtotalItem.toLocaleString()}\n`;
    });

    let costoDomicilio = 0;
    if (subtotalPlatos < 15000) {
        costoDomicilio = 2000; 
    }
    
    const totalPagar = subtotalPlatos + costoDomicilio;

    mensaje += `\n------------------------`;
    mensaje += `\n🍛 *Subtotal platos:* $${subtotalPlatos.toLocaleString()}`;
    
    if (costoDomicilio === 0) {
        mensaje += `\n🛵 *Domicilio:* ¡GRATIS! 🎉`;
    } else {
        mensaje += `\n🛵 *Domicilio:* $${costoDomicilio.toLocaleString()}`;
    }
    
    mensaje += `\n💵 *Total a pagar:* $${totalPagar.toLocaleString()}`;
    mensaje += `\n------------------------`;
    mensaje += `\n\n📍 *Dirección de entrega en Anserma:* [Escribe aquí tu dirección]`;
    mensaje += `\n💬 *Método de pago deseado:* [Efectivo / Nequi / Transfiya]`;

    const url = `https://api.whatsapp.com/send?phone=573052016360&text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
}

// ==========================================
// 5. ANUNCIOS FLOTANTES ROTATIVOS
// ==========================================
const mensajesEspontaneos = [
    "🔥 ¡Alguien en el Centro acaba de pedir un Sabor Casero!",
    "👨‍🍳 Consejo del chef: ¡Los fiambres hoy salieron espectaculares!",
    "🛵 ¡Domicilios activos en toda Anserma! Pide antes de que cierre la cocina.",
    "✨ Sabor que enamora, tradición que perdura.",
    "🍛 ¡Saliendo un pedido del espectacular Arriero para el barrio El Pensil!"
];

function gestionarAlertaFlotante() {
    const contenedorAlerta = document.getElementById("alerta-pueblo");
    const textoAlerta = document.getElementById("texto-alerta");
    if (!contenedorAlerta || !textoAlerta) return;

    const mensajeAleatorio = mensajesEspontaneos[Math.floor(Math.random() * mensajesEspontaneos.length)];
    
    textoAlerta.innerText = mensajeAleatorio;
    contenedorAlerta.classList.add("mostrar");

    setTimeout(() => {
        contenedorAlerta.classList.remove("mostrar");
    }, 6000);
}

// ==========================================
// 6. POPUPS DE ANTOJO ESPECIAL
// ==========================================
function mostrarAlertaAntojo() {
    const alerta = document.getElementById("alerta-antojo");
    if (!alerta) return;
    
    alerta.classList.remove("hidden");
    setTimeout(() => {
        alerta.classList.add("mostrar-antojo");
    }, 100);
}

function cerrarAlertaAntojo() {
    const alerta = document.getElementById("alerta-antojo");
    if (!alerta) return;
    
    alerta.classList.remove("mostrar-antojo");
    setTimeout(() => {
        alerta.classList.add("hidden");
    }, 700);
}

function enviarAntojoEspecial() {
    const mensaje = "¡Hola Sabor a Pueblo! 👋 Tengo un antojo de un plato especial y me gustaría saber si me lo podrían preparar de forma personalizada...";
    const url = `https://api.whatsapp.com/send?phone=573052016360&text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
}

// ==========================================
// 7. INICIALIZACIÓN SEGURA
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        renderizarMenu();
        
        // Iniciar alertas de pedidos rotantes
        setTimeout(gestionarAlertaFlotante, 3000);
        setInterval(gestionarAlertaFlotante, 35000);

        // Lanzar el popup interactivo de antojo a los 8 segundos
        setTimeout(mostrarAlertaAntojo, 8000);
    }, 100);
});