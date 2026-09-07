/* =========================================================
   SABOR A PUEBLO — APP.JS
   JavaScript principal del sitio
   ========================================================= */


/* =========================================================
   0. CONFIGURACIÓN GLOBAL
   ========================================================= */

const CONFIG_SABOR_PUEBLO = {
    whatsapp: "573218433983",
    minimoDomicilioGratis: 15000,
    costoDomicilio: 2000,
    horarioEntrega: "Miércoles a Domingo de 11am a 10pm"
};


/* =========================================================
   0.1 ESTADO GLOBAL
   ========================================================= */

let carrito = [];


/* =========================================================
   0.2 UTILIDADES
   ========================================================= */

/**
 * Formatea valores monetarios colombianos.
 */
function formatearPrecio(valor) {
    return `$${Number(valor).toLocaleString("es-CO")}`;
}

/**
 * Busca un producto del catálogo.
 */
function obtenerProductoCatalogo(id) {
    return platosSaborAPueblo.find(
        producto => Number(producto.id) === Number(id)
    );
}

/**
 * Calcula el subtotal del carrito.
 */
function calcularSubtotalCarrito() {
    return carrito.reduce(
        (total, item) =>
            total + (Number(item.precio) * Number(item.cantidad)),
        0
    );
}

/**
 * Calcula el domicilio.
 */
function calcularDomicilio(subtotal) {
    if (subtotal >= CONFIG_SABOR_PUEBLO.minimoDomicilioGratis) {
        return 0;
    }
    return CONFIG_SABOR_PUEBLO.costoDomicilio;
}

/**
 * Calcula el total final.
 */
function calcularTotalCarrito() {
    const subtotal = calcularSubtotalCarrito();
    const domicilio = calcularDomicilio(subtotal);
    return subtotal + domicilio;
}

/**
 * Actualiza dinámicamente el precio mostrado en la tarjeta al cambiar la opción.
 */
function actualizarPrecioPlato(id) {
    const plato = obtenerProductoCatalogo(id);
    const select = document.getElementById(`select-opcion-${id}`);
    const display = document.getElementById(`precio-display-${id}`);

    /* Si falta cualquier pieza (plato, select, display) o no hay opciones
       reales que mostrar, no hacemos nada y evitamos el error de lectura. */
    if (!plato || !select || !display) return;
    if (!Array.isArray(plato.opciones) || plato.opciones.length === 0) return;

    const indice = Number(select.value);
    const opcion = Number.isInteger(indice) ? plato.opciones[indice] : undefined;
    if (!opcion) return;

    display.innerText = formatearPrecio(opcion.precio);
}


/* =========================================================
   0.3 TOAST DE CONFIRMACIÓN (#alerta-pueblo)
   ========================================================= */

let timeoutToastPueblo = null;

/**
 * Muestra el aviso flotante inferior confirmando que un plato
 * se agregó al carrito. Reutiliza el bloque #alerta-pueblo
 * que ya existía en el HTML.
 */
function mostrarAnimacionToast(nombrePlato) {
    mostrarMensajeAlerta(`✨ ${nombrePlato} agregado a tu pedido`);
}

/**
 * Muestra cualquier mensaje corto en el aviso flotante #alerta-pueblo.
 * Función genérica detrás de mostrarAnimacionToast(), reutilizable
 * para otros avisos contextuales (ej: carrito vacío).
 */
function mostrarMensajeAlerta(mensaje, duracionMs = 2200) {
    const alerta = document.getElementById("alerta-pueblo");
    const texto = document.getElementById("texto-alerta");
    if (!alerta) return;

    if (texto) {
        texto.innerText = mensaje;
    }

    alerta.classList.add("mostrar");

    /* Si se dispara otro aviso seguido, reinicia el temporizador */
    clearTimeout(timeoutToastPueblo);
    timeoutToastPueblo = setTimeout(() => {
        alerta.classList.remove("mostrar");
    }, duracionMs);
}


/* =========================================================
   1. RENDERIZAR MENÚ DINÁMICO
   ========================================================= */

function renderizarMenu() {
    const contenedor = document.getElementById("contenedor-menu");
    if (!contenedor) return;

    contenedor.innerHTML = "";
    const productosDisponibles = obtenerProductosDisponibles();

    productosDisponibles.forEach(plato => {
        let selectorOpcionesHTML = "";
        let funcionBoton = `agregarAlCarrito(${plato.id})`;

        /* Producto con variantes */
        if (plato.opciones && plato.opciones.length > 0) {
            selectorOpcionesHTML = `
                <div class="mt-3">
                    <label
                        for="select-opcion-${plato.id}"
                        class="block text-xs font-bold text-puebloBlue mb-1"
                    >
                        Elige tu presentación:
                    </label>

                    <select
                        id="select-opcion-${plato.id}"
                        onchange="actualizarPrecioPlato(${plato.id})"
                        class="w-full bg-blue-50 border border-blue-200 text-puebloDark text-xs rounded-lg p-2 font-semibold focus:ring-2 focus:ring-puebloBlue"
                    >
                        ${plato.opciones.map((opcion, index) => `
                            <option value="${index}">
                                ${opcion.nombre} - ${formatearPrecio(opcion.precio)} (${opcion.detalle})
                            </option>
                        `).join("")}
                    </select>
                </div>
            `;
            funcionBoton = `agregarOpcionAlCarrito(${plato.id})`;
        }

        /* Etiquetas */
        let etiquetasHTML = "";
        if (plato.recomendado) {
            etiquetasHTML += `
                <span class="bg-puebloYellow text-puebloDark text-[10px] font-black px-2 py-1 rounded-full">
                    ⭐ Recomendado
                </span>
            `;
        }
        if (plato.destacado) {
            etiquetasHTML += `
                <span class="bg-puebloBlue text-white text-[10px] font-black px-2 py-1 rounded-full">
                    Destacado
                </span>
            `;
        }
        if (plato.nuevo) {
            etiquetasHTML += `
                <span class="bg-green-500 text-white text-[10px] font-black px-2 py-1 rounded-full">
                    ✨ Nuevo
                </span>
            `;
        }

        /* Tarjeta del producto */
        contenedor.innerHTML += `
            <article class="bg-white rounded-2xl shadow-md border border-blue-100 flex flex-col justify-between overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div class="h-48 w-full overflow-hidden bg-blue-50 relative">
                    <img
                        src="${plato.imagen}"
                        alt="${plato.nombre}"
                        loading="lazy"
                        class="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                        onerror="this.src='assets/img/logo/STIKERS_SABOR_A_PUEBLO.webp'"
                    >
                    <div class="absolute top-3 left-3 flex flex-wrap gap-1">
                        ${etiquetasHTML}
                    </div>
                    <span class="absolute top-3 right-3 bg-puebloYellow text-puebloDark text-xs font-extrabold px-3 py-1 rounded-full shadow">
                        ${plato.categoria}
                    </span>
                </div>

                <div class="p-5 flex-grow flex flex-col justify-between">
                    <div>
                        <h3 class="font-bold text-xl text-puebloBlue">
                            ${plato.nombre}
                        </h3>
                        <p class="text-gray-600 text-sm mt-2 leading-relaxed">
                            ${plato.descripcion}
                        </p>
                        ${selectorOpcionesHTML}
                    </div>

                    <div class="flex justify-between items-center mt-5 pt-4 border-t border-blue-50">
                        <span id="precio-display-${plato.id}" class="font-extrabold text-2xl text-puebloDark">
                            ${plato.opciones && plato.opciones.length > 0
                                ? formatearPrecio(plato.opciones[0].precio)
                                : formatearPrecio(plato.precio)}
                        </span>

                        <button
                            type="button"
                            onclick="${funcionBoton}"
                            class="bg-puebloBlue hover:bg-puebloYellow hover:text-puebloDark text-white font-bold py-2 px-5 rounded-xl text-sm transition-all duration-300 shadow"
                        >
                            + Agregar
                        </button>
                    </div>
                </div>
            </article>
        `;
    });

    /* Tarjeta — Antojo personalizado */
    contenedor.innerHTML += `
        <article class="bg-puebloDark p-6 rounded-2xl shadow-lg text-white flex flex-col justify-between border-4 border-puebloYellow min-h-[350px]">
            <div>
                <span class="text-4xl">👨‍🍳✨</span>
                <h3 class="font-bold text-2xl mt-4 text-puebloYellow">
                    ¿Buscas algo diferente?
                </h3>
                <p class="text-blue-100 text-sm mt-3 leading-relaxed">
                    ¿Tienes un antojo especial o buscas un plato diferente? ¡Cuéntanos! En Sabor a Pueblo nos encanta hacer realidad tus antojos. Escríbenos con anterioridad y personalizamos tu menú.
                </p>
            </div>

            <button
                type="button"
                onclick="enviarAntojoEspecial()"
                class="mt-6 w-full bg-puebloYellow hover:bg-white text-puebloDark font-bold py-3 px-4 rounded-xl text-sm transition-all shadow-md text-center"
            >
                💬 Pedir mi antojo personalizado
            </button>
        </article>
    `;
}


/* =========================================================
   2. CARRITO
   ========================================================= */

function agregarAlCarrito(id) {
    const producto = obtenerProductoCatalogo(id);
    if (!producto) return;

    const itemExistente = carrito.find(item => item.id === Number(producto.id));

    if (itemExistente) {
        itemExistente.cantidad += 1;
    } else {
        carrito.push({
            id: Number(producto.id),
            nombre: producto.nombre,
            precio: Number(producto.precio),
            imagen: producto.imagen,
            categoria: producto.categoria,
            cantidad: 1
        });
    }

    actualizarInterfazCarrito();
    mostrarAnimacionToast(producto.nombre);
}

function agregarOpcionAlCarrito(id) {
    const plato = obtenerProductoCatalogo(id);
    const select = document.getElementById(`select-opcion-${id}`);

    if (!plato || !select || !plato.opciones) return;

    const indice = Number(select.value);
    const opcion = plato.opciones[indice];
    if (!opcion) return;

    const idVariante = `${plato.id}-${indice}`;
    const itemExistente = carrito.find(item => item.id === idVariante);

    if (itemExistente) {
        itemExistente.cantidad += 1;
    } else {
        carrito.push({
            id: idVariante,
            productoId: Number(plato.id),
            nombre: `${plato.nombre} (${opcion.nombre})`,
            precio: Number(opcion.precio),
            detalle: opcion.detalle,
            imagen: plato.imagen,
            categoria: plato.categoria,
            cantidad: 1
        });
    }

    actualizarInterfazCarrito();
    mostrarAnimacionToast(`${plato.nombre} (${opcion.nombre})`);
}

function aumentarCantidadCarrito(id) {
    const item = carrito.find(producto => String(producto.id) === String(id));
    if (!item) return;

    item.cantidad += 1;
    actualizarInterfazCarrito();
}

function restarDelCarrito(id) {
    const item = carrito.find(producto => String(producto.id) === String(id));
    if (!item) return;

    item.cantidad -= 1;
    if (item.cantidad <= 0) {
        eliminarDelCarrito(id);
        return;
    }

    actualizarInterfazCarrito();
}

function eliminarDelCarrito(id) {
    carrito = carrito.filter(item => String(item.id) !== String(id));
    actualizarInterfazCarrito();
}

function vaciarCarrito() {
    carrito = [];
    actualizarInterfazCarrito();
    cerrarModalCarrito();
}


/* =========================================================
   3. ACTUALIZAR INTERFAZ DEL CARRITO
   ========================================================= */

function actualizarInterfazCarrito() {
    guardarCarritoEnStorage();

    const barra = document.getElementById("barra-carrito");
    const cantidadText = document.getElementById("carrito-cantidad");
    const totalText = document.getElementById("carrito-total");
    const badge = document.getElementById("navbar-carrito-badge");
    const modalSubtotal = document.getElementById("modal-subtotal");
    const modalDomicilioValor = document.getElementById("modal-domicilio-valor");
    const modalTotal = document.getElementById("modal-total");
    const listaDetalles = document.getElementById("lista-carrito-detalles");

    if (carrito.length === 0) {
        if (barra) barra.classList.add("hidden");
        if (badge) {
            badge.classList.add("hidden");
            badge.innerText = "0";
        }
        if (listaDetalles) listaDetalles.innerHTML = "";
        if (modalSubtotal) modalSubtotal.innerText = "$0";
        if (modalDomicilioValor) modalDomicilioValor.innerText = "$0";
        if (modalTotal) modalTotal.innerText = "$0";
        return;
    }

    if (barra) barra.classList.remove("hidden");

    const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    const subtotalComida = calcularSubtotalCarrito();
    const costoDomicilio = calcularDomicilio(subtotalComida);
    const granTotal = subtotalComida + costoDomicilio;

    if (cantidadText) {
        cantidadText.innerText = `${totalItems} ${totalItems === 1 ? "plato" : "platos"}`;
    }

    if (badge) {
        badge.innerText = totalItems;
        badge.classList.remove("hidden");
        badge.classList.add("flex");
    }

    if (totalText) totalText.innerText = formatearPrecio(granTotal);
    if (modalSubtotal) modalSubtotal.innerText = formatearPrecio(subtotalComida);

    if (modalDomicilioValor) {
        if (costoDomicilio === 0) {
            modalDomicilioValor.innerHTML = `
                <span class="text-green-600 font-extrabold animate-pulse">
                    ¡GRATIS! 🎉
                </span>
            `;
        } else {
            modalDomicilioValor.innerText = formatearPrecio(costoDomicilio);
        }
    }

    if (modalTotal) modalTotal.innerText = formatearPrecio(granTotal);

    /* Renderizado de la lista interna del modal */
    if (listaDetalles) {
        listaDetalles.innerHTML = "";

        carrito.forEach(item => {
            const subtotalItem = Number(item.precio) * Number(item.cantidad);

            listaDetalles.innerHTML += `
                <div class="flex items-center justify-between gap-2 bg-blue-50/50 p-3 rounded-xl border border-blue-100">
                    <div class="flex-1 min-w-0 pr-1">
                        <h4 class="font-bold text-sm text-puebloDark">
                            ${item.nombre}
                        </h4>
                        ${item.detalle ? `
                            <p class="text-[11px] text-gray-500 mt-0.5">
                                ${item.detalle}
                            </p>
                        ` : ""}
                        <p class="text-xs text-puebloBlue font-bold mt-1">
                            ${formatearPrecio(subtotalItem)}
                        </p>
                    </div>

                    <div class="flex items-center bg-white rounded-lg border border-blue-200 p-1 shadow-sm shrink-0">
                        <button
                            type="button"
                            onclick="restarDelCarrito('${item.id}')"
                            class="text-puebloBlue hover:text-red-500 font-bold px-2.5 py-0.5 transition-colors"
                            aria-label="Restar producto"
                        >
                            −
                        </button>
                        <span class="font-extrabold text-sm text-puebloDark px-2 min-w-[20px] text-center">
                            ${item.cantidad}
                        </span>
                        <button
                            type="button"
                            onclick="aumentarCantidadCarrito('${item.id}')"
                            class="text-puebloBlue hover:text-puebloYellow font-bold px-2.5 py-0.5 transition-colors"
                            aria-label="Agregar producto"
                        >
                            +
                        </button>
                    </div>

                    <button
                        type="button"
                        onclick="eliminarDelCarrito('${item.id}')"
                        class="text-gray-400 hover:text-red-500 p-1 transition-colors shrink-0"
                        aria-label="Eliminar item"
                    >
                        🗑️
                    </button>
                </div>
            `;
        });
    }
}


/* =========================================================
   3.1 PERSISTENCIA DEL CARRITO (localStorage)
   ========================================================= */

const CLAVE_STORAGE_CARRITO = "sabor_a_pueblo_carrito";

/**
 * Guarda el estado actual del carrito en localStorage.
 * Falla en silencio (ej: modo incógnito con storage bloqueado)
 * para no romper la experiencia si el navegador lo rechaza.
 */
function guardarCarritoEnStorage() {
    try {
        localStorage.setItem(CLAVE_STORAGE_CARRITO, JSON.stringify(carrito));
    } catch (error) {
        console.warn("No se pudo guardar el carrito en localStorage:", error);
    }
}

/**
 * Restaura el carrito guardado (si existe y es válido) al cargar la página.
 */
function restaurarCarritoDesdeStorage() {
    try {
        const guardado = localStorage.getItem(CLAVE_STORAGE_CARRITO);
        if (!guardado) return;

        const datos = JSON.parse(guardado);
        if (Array.isArray(datos)) {
            carrito = datos;
        }
    } catch (error) {
        console.warn("No se pudo restaurar el carrito guardado:", error);
        carrito = [];
    }
}


/* =========================================================
   4. MODAL Y NOTIFICACIONES
   ========================================================= */

function abrirModalCarrito() {
    const modal = document.getElementById("modal-carrito");
    if (modal) {
        // Remover 'hidden' y asegurar visualización flex
        modal.classList.remove("hidden");
        modal.classList.add("flex");
        
        // Soporte por si tu HTML usa opacidad/pointer-events para transiciones
        modal.classList.remove("opacity-0", "pointer-events-none");
        modal.classList.add("opacity-100", "pointer-events-auto");

        document.body.style.overflow = "hidden";
    }
}

function cerrarModalCarrito() {
    const modal = document.getElementById("modal-carrito");
    if (modal) {
        modal.classList.add("hidden");
        modal.classList.remove("flex", "opacity-100", "pointer-events-auto");
        modal.classList.add("opacity-0", "pointer-events-none");

        document.body.style.overflow = "auto";
    }
}

/* =========================================================
   5. ENVÍO A WHATSAPP
   ========================================================= */

function enviarPedidoWhatsApp() {
    if (carrito.length === 0) {
        mostrarMensajeAlerta("🛒 Tu carrito está vacío. ¡Agrega algún plato primero!", 2800);
        return;
    }

    const nombre = document.getElementById("cliente-nombre")?.value.trim() || "No especificado";
    const direccion = document.getElementById("cliente-direccion")?.value.trim() || "No especificada";
    const notas = document.getElementById("cliente-notas")?.value.trim() || "Sin observaciones";

    const subtotal = calcularSubtotalCarrito();
    const domicilio = calcularDomicilio(subtotal);
    const total = calcularTotalCarrito();

    let mensaje = `🍔 *¡NUEVO PEDIDO - SABOR A PUEBLO!* 🍔\n\n`;
    mensaje += `👤 *Cliente:* ${nombre}\n`;
    mensaje += `📍 *Dirección:* ${direccion}\n`;
    mensaje += `📝 *Notas:* ${notas}\n\n`;
    mensaje += `🛒 *DETALLE DEL PEDIDO:*\n`;

    carrito.forEach(item => {
        const subtotalItem = Number(item.precio) * Number(item.cantidad);
        mensaje += `• ${item.cantidad}x ${item.nombre} -> ${formatearPrecio(subtotalItem)}\n`;
    });

    mensaje += `\n💵 *Subtotal:* ${formatearPrecio(subtotal)}\n`;
    mensaje += `🛵 *Domicilio:* ${domicilio === 0 ? "¡GRATIS!" : formatearPrecio(domicilio)}\n`;
    mensaje += `💰 *TOTAL A PAGAR:* ${formatearPrecio(total)}\n\n`;
    mensaje += `⏰ *Horario de entrega:* ${CONFIG_SABOR_PUEBLO.horarioEntrega}`;

    const url = `https://wa.me/${CONFIG_SABOR_PUEBLO.whatsapp}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank");
}

function enviarAntojoEspecial() {
    const mensaje = `👋 ¡Hola Sabor a Pueblo! Tengo un antojo especial o me gustaría consultar un menú personalizado. ¿Me podrían ayudar?`;
    const url = `https://wa.me/${CONFIG_SABOR_PUEBLO.whatsapp}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank");
}

/**
 * Muestra la tarjeta de "¿Tienes un antojo especial?" (#alerta-antojo).
 * Se dispara una sola vez por sesión, después de un rato navegando,
 * para no interrumpir apenas entra el usuario.
 */
function mostrarAlertaAntojo() {
    if (sessionStorage.getItem("antojo_mostrado")) return;

    const alerta = document.getElementById("alerta-antojo");
    if (!alerta) return;

    alerta.classList.remove("hidden");
    /* pequeño delay para que la transición CSS (translate/opacity) se note */
    requestAnimationFrame(() => {
        alerta.classList.add("mostrar-antojo");
    });

    sessionStorage.setItem("antojo_mostrado", "true");
}

/**
 * Cierra la tarjeta de antojo especial.
 */
function cerrarAlertaAntojo() {
    const alerta = document.getElementById("alerta-antojo");
    if (!alerta) return;

    alerta.classList.remove("mostrar-antojo");
    /* espera a que termine la transición antes de ocultarla del todo */
    setTimeout(() => {
        alerta.classList.add("hidden");
    }, 700);
}


/* =========================================================
   6. INICIALIZACIÓN DE EVENTOS
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    /* Restaurar carrito guardado (si el cliente recargó la página) */
    restaurarCarritoDesdeStorage();
    actualizarInterfazCarrito();

    /* Renderizar catálogo */
    renderizarMenu();

    /* Evento para cerrar modal con clic fuera */
    const modal = document.getElementById("modal-carrito");
    if (modal) {
        modal.addEventListener("click", (e) => {
            if (e.target === modal) cerrarModalCarrito();
        });
    }

    /* Mostrar la tarjeta de antojo especial después de 20s navegando */
    setTimeout(mostrarAlertaAntojo, 20000);
});

// final de app.js solo si usas type="module" en tu HTML
window.abrirModalCarrito = abrirModalCarrito;
window.cerrarModalCarrito = cerrarModalCarrito;
window.agregarAlCarrito = agregarAlCarrito;
window.agregarOpcionAlCarrito = agregarOpcionAlCarrito;
window.restarDelCarrito = restarDelCarrito;
window.aumentarCantidadCarrito = aumentarCantidadCarrito;
window.eliminarDelCarrito = eliminarDelCarrito;
window.enviarPedidoWhatsApp = enviarPedidoWhatsApp;
window.enviarAntojoEspecial = enviarAntojoEspecial;
window.cerrarAlertaAntojo = cerrarAlertaAntojo;

/* =========================================================
   CONTROL DEL MENÚ MÓVIL
   ========================================================= */

function toggleMenuMovil() {
    const menu = document.getElementById("menu-mobile");
    const icono = document.getElementById("menu-icon");
    const boton = document.getElementById("menu-mobile-button");
    if (!menu) return;

    const estaOculto = menu.classList.contains("hidden");

    if (estaOculto) {
        menu.classList.remove("hidden");
        if (icono) icono.innerText = "✕";
        if (boton) boton.setAttribute("aria-expanded", "true");
    } else {
        menu.classList.add("hidden");
        if (icono) icono.innerText = "☰";
        if (boton) boton.setAttribute("aria-expanded", "false");
    }
}

function cerrarMenuMovil() {
    const menu = document.getElementById("menu-mobile");
    const icono = document.getElementById("menu-icon");
    const boton = document.getElementById("menu-mobile-button");

    if (menu) menu.classList.add("hidden");
    if (icono) icono.innerText = "☰";
    if (boton) boton.setAttribute("aria-expanded", "false");
}

// Exposición global para soportar eventos onclick inline
window.toggleMenuMovil = toggleMenuMovil;
window.cerrarMenuMovil = cerrarMenuMovil;