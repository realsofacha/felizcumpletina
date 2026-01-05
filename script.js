// Objeto principal de la aplicación
const app = {
    state: {
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

    init() {
        this.loadData();
        this.setupListeners();
        this.renderSociogram();
        this.updateProgress();
        
        // Auto-ajustar altura de textareas iniciales
        document.querySelectorAll('textarea').forEach(el => this.autoResize(el));
        
        if (typeof lucide !== 'undefined') lucide.createIcons();
        
        // Abrir primera sección por defecto
        const firstContent = document.querySelector('.section-content');
        const firstIcon = document.querySelector('.section-icon');
        if (firstContent && firstIcon) {
            firstContent.classList.remove('hidden');
            firstIcon.style.transform = 'rotate(180deg)';
        }
    },

    loadData() {
        const saved = localStorage.getItem('charArchJS');
        if (saved) {
            try {
                this.state = { ...this.state, ...JSON.parse(saved) };
                Object.keys(this.state).forEach(key => {
                    if (key === 'relaciones') return;
                    const el = document.getElementById(key);
                    if (el) {
                        el.value = this.state[key];
                        // Ajustar altura si es textarea
                        if(el.tagName === 'TEXTAREA') this.autoResize(el);
                    }
                });
                const sliderVal = document.getElementById('influencia-val');
                if (sliderVal) sliderVal.innerText = `${this.state.influencia}/10`;
            } catch (e) { console.error("Error cargando datos", e); }
        }
    },

    saveData() {
        localStorage.setItem('charArchJS', JSON.stringify(this.state));
        this.updateProgress();
    },

    // --- NUEVO: Función para expandir textareas automáticamente ---
    autoResize(el) {
        el.style.height = 'auto'; // Resetear para recalcular
        el.style.height = el.scrollHeight + 'px';
    },

    setupListeners() {
        document.querySelectorAll('.data-input, .slider-thumb').forEach(input => {
            input.addEventListener('input', (e) => {
                this.state[e.target.id] = e.target.value;
                if (e.target.id === 'influencia') {
                    document.getElementById('influencia-val').innerText = `${e.target.value}/10`;
                }
                
                // Si es textarea, ajustar altura al escribir
                if(e.target.tagName === 'TEXTAREA') this.autoResize(e.target);
                
                this.saveData();
            });
        });

        document.querySelectorAll('.section-toggle').forEach(btn => {
            btn.addEventListener('click', () => {
                const content = btn.nextElementSibling;
                const icon = btn.querySelector('.section-icon');
                content.classList.toggle('hidden');
                icon.style.transform = content.classList.contains('hidden') ? 'rotate(0deg)' : 'rotate(180deg)';
                if (!content.classList.contains('hidden')) content.classList.add('fade-in');
            });
        });
    },

    addRelation() {
        const nameEl = document.getElementById('rel-name');
        const typeEl = document.getElementById('rel-type');
        if (!nameEl.value) return;
        this.state.relaciones.push({ id: Date.now(), name: nameEl.value, type: typeEl.value });
        nameEl.value = "";
        this.saveData();
        this.renderSociogram();
    },

    removeRelation(id) {
        this.state.relaciones = this.state.relaciones.filter(r => r.id !== id);
        this.saveData();
        this.renderSociogram();
    },

    renderSociogram() {
        const container = document.getElementById('sociogram-container');
        if (!container) return;
        const mainName = this.state.nombre || "TU PERSONAJE";
        
        if (this.state.relaciones.length === 0) {
            container.innerHTML = `
                <div class="relative z-10 w-32 h-32 bg-indigo-600 rounded-full flex items-center justify-center text-center p-2 shadow-lg ring-4 ring-indigo-100 print:border-2 print:border-black print:bg-white print:text-black print:shadow-none">
                    <span class="font-bold text-white text-sm line-clamp-3 print:text-black">${mainName}</span>
                </div>
                <div class="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30 no-print">
                    <p class="text-slate-400 font-medium">Añade vínculos para verlos aquí</p>
                </div>
            `;
            return;
        }

        let html = `
            <div class="relative z-10 w-32 h-32 bg-indigo-600 rounded-full flex items-center justify-center text-center p-2 shadow-lg ring-4 ring-indigo-100 print:border-2 print:border-black print:bg-white print:text-black print:shadow-none">
                <span class="font-bold text-white text-sm line-clamp-3 print:text-black">${mainName}</span>
            </div>
        `;

        this.state.relaciones.forEach(rel => {
            let lineClass = "";
            let ringClass = "";
            let label = "";
            let labelColor = "";

            if (rel.type === "stable") {
                lineClass = "border-solid border-slate-400 print:border-black";
                ringClass = "border-slate-400 print:border-black";
                label = "Estable";
                labelColor = "text-slate-400 print:text-black";
            } else if (rel.type === "distant") {
                lineClass = "border-dashed border-slate-400 print:border-black";
                ringClass = "border-slate-400 print:border-black";
                label = "Distante";
                labelColor = "text-slate-400 print:text-black";
            } else {
                lineClass = "border-dotted border-red-400 print:border-black";
                ringClass = "border-red-400 print:border-black";
                label = "Conflicto";
                labelColor = "text-red-500 print:text-black";
            }

            html += `
                <div class="relative group flex flex-col items-center gap-2 fade-in print:break-inside-avoid">
                    <div class="h-8 w-0 border-l-2 ${lineClass} absolute -top-8 left-1/2 -translate-x-1/2"></div>
                    <div class="w-24 h-24 bg-white rounded-full border-2 ${ringClass} flex items-center justify-center text-center p-2 shadow-sm relative print:shadow-none print:border-black">
                        <span class="text-xs font-semibold text-slate-700 leading-tight print:text-black">${rel.name}</span>
                        <button onclick="app.removeRelation(${rel.id})" class="absolute -top-1 -right-1 bg-red-100 text-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity no-print">
                            <i data-lucide="minus" class="w-3 h-3"></i>
                        </button>
                    </div>
                    <span class="text-[10px] uppercase font-bold tracking-wider ${labelColor}">${label}</span>
                </div>
            `;
        });

        container.innerHTML = html;
        if (typeof lucide !== 'undefined') lucide.createIcons();
    },

    updateProgress() {
        const totalKeys = Object.keys(this.state).length;
        const filledKeys = Object.values(this.state).filter(v => {
            if (Array.isArray(v)) return v.length > 0;
            return v !== "" && v !== 5;
        }).length;
        const percent = (filledKeys / totalKeys) * 100;
        const progressBar = document.getElementById('progress-bar');
        if (progressBar) progressBar.style.width = `${percent}%`;
    },

    clearData() {
        if (confirm("¿Estás seguro de borrar todo?")) {
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
            location.reload(); 
        }
    }
};

window.addEventListener('DOMContentLoaded', () => app.init());
