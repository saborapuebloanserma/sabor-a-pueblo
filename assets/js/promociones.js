// ============================================================
// SABOR A PUEBLO - MÓDULO DE PROMOCIONES Y EVENTOS
// Archivo: assets/js/promociones.js
// ============================================================

const promocionesSaborAPueblo = [
    {
        id: "tamales-28-ago",
        titulo: "¡ESTE 28 DE AGOSTO TENEMOS TAMALES!",
        subtitulo: "Disfruta de la mejor sazón tradicional",
        descripcion: "Preparamos deliciosos tamales caseros de cerdo por encargo. ¡Haz tu pedido con anticipación antes de que se agoten!",
        imagen: "assets/img/promociones/tamales-28-agosto.webp",
        fechaInicio: "2026-08-20",
        fechaFin: "2026-08-30",
        activo: true,
        tipo: "modal_flyer",
        ctaTexto: "Pedir Tamales por WhatsApp",
        ctaMensajeWA: "¡Hola, Sabor a Pueblo! Quisiera reservar mi pedido de Tamales de Cerdo para el 28 de agosto."
    }
];

/**
 * Obtiene las promociones vigentes según la fecha actual del sistema.
 */
function obtenerPromocionesActivas() {
    const hoy = new Date().toISOString().split('T')[0];
    return promocionesSaborAPueblo.filter(promo => {
        return promo.activo && hoy >= promo.fechaInicio && hoy <= promo.fechaFin;
    });
}

/**
 * Controla la visualización del Modal Pop-up de Promociones en dos columnas.
 */
function inicializarModalPromociones() {
    const promosActivas = obtenerPromocionesActivas();
    if (promosActivas.length === 0) return;

    const promo = promosActivas[0];

    if (sessionStorage.getItem(`promo_cerrada_${promo.id}`)) return;

    let modal = document.getElementById('modal-promocion');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modal-promocion';
        modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-opacity duration-300 opacity-0 pointer-events-none';
        
        modal.innerHTML = `
            <div class="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden transform scale-95 transition-transform duration-300 border border-white/20">
                <!-- Botón de Cierre Flotante Limpio -->
                <button id="cerrar-modal-promo" aria-label="Cerrar ventana emergente" class="absolute top-3 right-3 z-30 bg-black/60 hover:bg-black text-white w-9 h-9 rounded-full flex items-center justify-center font-bold text-xl transition-all shadow-md focus:outline-none">
                    &times;
                </button>
                
                <!-- Layout Horizontal: Estructura en 2 Columnas -->
                <div class="grid grid-cols-1 md:grid-cols-2 items-center">
                    
                    <!-- Columna Izquierda: Imagen Completa sin recortes -->
                    <div class="bg-[#5C3D11] p-2 flex items-center justify-center">
                        <img src="${promo.imagen}" alt="${promo.titulo}" class="w-full h-auto max-h-[50vh] md:max-h-[70vh] object-contain rounded-2xl">
                    </div>

                    <!-- Columna Derecha: Contenido y CTA de Conversión -->
                    <div class="p-6 md:p-8 text-center md:text-left flex flex-col justify-center bg-white">
                        <span class="inline-block px-3 py-1 bg-[#FBB03B]/20 text-[#0D2C4A] font-bold text-xs rounded-full self-center md:self-start mb-2 uppercase tracking-wide">
                            Edición Especial
                        </span>
                        <h3 class="text-xl md:text-2xl font-black text-[#0D2C4A] mb-3 leading-tight">
                            ${promo.titulo}
                        </h3>
                        <p class="text-sm md:text-base text-slate-600 mb-6 leading-relaxed">
                            ${promo.descripcion}
                        </p>
                        <a href="https://wa.me/573218433983?text=${encodeURIComponent(promo.ctaMensajeWA)}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center w-full py-3.5 px-5 bg-[#FBB03B] hover:bg-[#e09b2e] text-[#0D2C4A] font-extrabold text-sm md:text-base rounded-2xl shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]">
                            ${promo.ctaTexto}
                        </a>
                    </div>

                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    setTimeout(() => {
        modal.classList.remove('opacity-0', 'pointer-events-none');
        modal.querySelector('div').classList.remove('scale-95');
        modal.querySelector('div').classList.add('scale-100');
        document.body.style.overflow = 'hidden';
    }, 300);

    document.getElementById('cerrar-modal-promo').addEventListener('click', () => {
        cerrarModalPromocion(promo.id);
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            cerrarModalPromocion(promo.id);
        }
    });
}

/**
 * Cierra la ventana emergente y guarda la preferencia temporalmente.
 */
function cerrarModalPromocion(id) {
    const modal = document.getElementById('modal-promocion');
    if (modal) {
        modal.classList.add('opacity-0', 'pointer-events-none');
        document.body.style.overflow = '';
        sessionStorage.setItem(`promo_cerrada_${id}`, 'true');
    }
}

// Ejecutar revisión al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
    inicializarModalPromociones();
});