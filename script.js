// Objeto principal de la aplicación
const app = {
    state: {
        // Estado inicial con todos los campos del PDF
        nombre: "", apodos: "", edad: "", ocupacion: "", rol: "", arquetipo: "", concepto: "", contradiccion: "",
        herida: "", mentira: "", deseo: "", necesidad: "", lineaRoja: "",
        rasgoFisico: "", delatador: "", movimiento: "", objetos: "", sensorial: "",
        tono: "", muletilla: "", autoridad: "", humor: "", frase1: "", frase2: "",
        familia: "", circuloIntimo: "", circuloFuncional: "", circuloInteres: "", circuloExtrano: "",
        imagenPublica: "", autoimagen: "", influencia: 5, insiderOutsider: "",
        relaciones: [],
        anclaje: "", ayudaPractica: "", ayudaEmocional: "", protegido: "", tension: "", obstaculo: "", envidia: "", espejo: "",
        pezDentro: "", pezFuera: "",
        puntoA: "", detonante: "", sacrificio: "", puntoB: ""
    },

    // Inicialización
    init() {
        this.loadData();
        this.setupListeners();
        this.renderSociogram();
        this.updateProgress();
        
        // Inicializar iconos de Lucide si la librería está cargada
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
        // Abrir la primera sección por defecto para mejor UX
        const firstContent = document.querySelector('.section-content');
        const firstIcon = document.querySelector('.section-icon');
        if (firstContent && firstIcon) {
            firstContent.classList.remove('hidden');
            firstIcon.style.transform = 'rotate(180deg)';
        }
    },

    // Cargar datos del LocalStorage
    loadData() {
        const saved = localStorage.getItem('charArchJS');
        if (saved) {
            try {
                this.state = { ...this.state, ...JSON.parse(saved) };
                // Rellenar Inputs
                Object.keys(this.state).forEach(key => {
                    if (key === 'relaciones') return;
                    const el = document.getElementById(key);
                    if (el) {
                        el.value = this.state[key];
                    }
                });
                // Actualizar texto del slider específicamente
                const sliderVal = document.getElementById('influencia-val');
                if (sliderVal) {
                    sliderVal.innerText = `${this.state.influencia}/10`;
                }
            } catch (e) { console.error("Error cargando datos", e); }
        }
    },

    // Guardar datos en LocalStorage
    saveData() {
        localStorage.setItem('charArchJS', JSON.stringify(this.state));
        this.updateProgress();
    },

    // Configurar escuchadores de eventos
    setupListeners() {
        // Inputs de texto y slider
        document.querySelectorAll('.data-input, .slider-thumb').forEach(input => {
            input.addEventListener('input', (e) => {
                this.state[e.target.id] = e.target.value;
                if (e.target.id === 'influencia') {
                    document.getElementById('influencia-val').innerText = `${e.target.value}/10`;
                }
                this.saveData();
            });
        });

        // Acordeón (Collapsibles) - Abrir/Cerrar secciones
        document.querySelectorAll('.section-toggle').forEach(btn => {
            btn.addEventListener('click', () => {
                const content = btn.nextElementSibling;
                const icon = btn.querySelector('.section-icon');
                content.classList.toggle('hidden');
                
                // Rotar icono
                icon.style.transform = content.classList.contains('hidden') ? 'rotate(0deg)' : 'rotate(180deg)';
                
                // Animación suave
                if (!content.classList.contains('hidden')) {
                    content.classList.add('fade-in');
                }
            });
        });
    },

    // Añadir una nueva relación al sociograma
    addRelation() {
        const nameEl = document.getElementById('rel-name');
        const typeEl = document.getElementById('rel-type');
        
        if (!nameEl.value) return;

        this.state.relaciones.push({
            id: Date.now(),
            name: nameEl.value,
            type: typeEl.value
        });

        nameEl.value = "";
        this.saveData();
        this.renderSociogram();
    },

    // Eliminar relación
    removeRelation(id) {
        this.state.relaciones = this.state.relaciones.filter(r => r.id !== id);
        this.saveData();
        this.renderSociogram();
    },

    // Renderizar visualmente el sociograma
    renderSociogram() {
        const container = document.getElementById('sociogram-container');
        if (!container) return;

        const mainName = this.state.nombre || "TU PERSONAJE";
        
        // Estado vacío
        if (this.state.relaciones.length === 0) {
            container.innerHTML = `
                <div class="relative z-10 w-32 h-32 bg-indigo-600 rounded-full flex items-center justify-center text-center p-2 shadow-lg ring-4 ring-indigo-100">
                    <span class="font-bold text-white text-sm line-clamp-3">${mainName}</span>
                </div>
                <div class="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
                    <p class="text-slate-400 font-medium">Añade vínculos para verlos aquí</p>
                </div>
            `;
            return;
        }

        // Nodo central
        let html = `
            <div class="relative z-10 w-32 h-32 bg-indigo-600 rounded-full flex items-center justify-center text-center p-2 shadow-lg ring-4 ring-indigo-100">
                <span class="font-bold text-white text-sm line-clamp-3">${mainName}</span>
            </div>
        `;

        // Renderizar nodos conectados
        this.state.relaciones.forEach(rel => {
            let lineClass = "";
            let ringClass = "";
            let label = "";
            let labelColor = "";

            if (rel.type === "stable") {
                lineClass = "border-solid border-slate-400";
                ringClass = "border-slate-400";
                label = "Estable";
                labelColor = "text-slate-400";
            } else if (rel.type === "distant") {
                lineClass = "border-dashed border-slate-400";
                ringClass = "border-slate-400";
                label = "Distante";
                labelColor = "text-slate-400";
            } else {
                lineClass = "border-dotted border-red-400";
                ringClass = "border-red-400";
                label = "Conflicto";
                labelColor = "text-red-500";
            }

            html += `
                <div class="relative group flex flex-col items-center gap-2 fade-in">
                    <!-- Línea conectora -->
                    <div class="h-8 w-0 border-l-2 ${lineClass} absolute -top-8 left-1/2 -translate-x-1/2"></div>
                    
                    <!-- Círculo del personaje secundario -->
                    <div class="w-24 h-24 bg-white rounded-full border-2 ${ringClass} flex items-center justify-center text-center p-2 shadow-sm relative">
                        <span class="text-xs font-semibold text-slate-700 leading-tight">${rel.name}</span>
                        <!-- Botón de eliminar (oculto hasta hover) -->
                        <button onclick="app.removeRelation(${rel.id})" class="absolute -top-1 -right-1 bg-red-100 text-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity no-print">
                            <i data-lucide="minus" class="w-3 h-3"></i>
                        </button>
                    </div>
                    <span class="text-[10px] uppercase font-bold tracking-wider ${labelColor}">${label}</span>
                </div>
            `;
        });

        container.innerHTML = html;
        
        // Refrescar iconos para los nuevos elementos añadidos al DOM
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    },

    // Actualizar barra de progreso
    updateProgress() {
        const totalKeys = Object.keys(this.state).length;
        // Contar campos que no están vacíos (ignorando arrays vacíos o valores por defecto del slider)
        const filledKeys = Object.values(this.state).filter(v => {
            if (Array.isArray(v)) return v.length > 0;
            return v !== "" && v !== 5;
        }).length;
        
        const percent = (filledKeys / totalKeys) * 100;
        const progressBar = document.getElementById('progress-bar');
        if (progressBar) {
            progressBar.style.width = `${percent}%`;
        }
    },

    // Borrar todos los datos
    clearData() {
        if (confirm("¿Estás seguro de borrar todo?")) {
            // Reiniciar estado
            this.state = { 
                nombre: "", apodos: "", edad: "", ocupacion: "", rol: "", arquetipo: "", concepto: "", contradiccion: "",
                herida: "", mentira: "", deseo: "", necesidad: "", lineaRoja: "",
                rasgoFisico: "", delatador: "", movimiento: "", objetos: "", sensorial: "",
                tono: "", muletilla: "", autoridad: "", humor: "", frase1: "", frase2: "",
                familia: "", circuloIntimo: "", circuloFuncional: "", circuloInteres: "", circuloExtrano: "",
                imagenPublica: "", autoimagen: "", influencia: 5, insiderOutsider: "",
                relaciones: [],
                anclaje: "", ayudaPractica: "", ayudaEmocional: "", protegido: "", tension: "", obstaculo: "", envidia: "", espejo: "",
                pezDentro: "", pezFuera: "",
                puntoA: "", detonante: "", sacrificio: "", puntoB: ""
            };
            this.saveData();
            location.reload(); // Recargar para limpiar inputs visualmente
        }
    }
};

// Iniciar aplicación cuando el DOM esté listo
window.addEventListener('DOMContentLoaded', () => app.init());
