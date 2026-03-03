class GestorGaleria {
    constructor() {
        console.log('Inicializando gestor de galería...');
        this.fotos = [];
        this.categorias = [];
        this.init();
    }

    async init() {
        await this.cargarFotos();
        if (this.fotos.length > 0) {
            this.extraerCategorias();
            this.generarFiltros();
            this.crearRadioButtons();
            this.configurarFiltros();
            this.renderizarGaleria('todas');
        }
    }

    async cargarFotos() {
        try {
            console.log('Cargando fotos desde JSON...');
            const respuesta = await fetch('js/galeria.json');
            if (!respuesta.ok) {
                throw new Error(`Error HTTP: ${respuesta.status}`);
            }
            const datos = await respuesta.json();
            this.fotos = datos.fotos;
            console.log('Fotos cargadas:', this.fotos.length);
        } catch (error) {
            console.error('Error al cargar las fotos:', error);
            this.mostrarError('No se pudieron cargar las imágenes');
        }
    }

    extraerCategorias() {
        const categoriasSet = new Set();
        this.fotos.forEach(foto => {
            if (foto.categoria) {
                categoriasSet.add(foto.categoria);
            }
        });
        this.categorias = Array.from(categoriasSet);
        console.log('Categorías encontradas:', this.categorias);
    }

    generarFiltros() {
        const filtrosContainer = document.querySelector('.filtros');
        if (!filtrosContainer) return;

        filtrosContainer.innerHTML = '';

        const todasCategorias = ['todas', ...this.categorias];

        todasCategorias.forEach(categoria => {
            const label = document.createElement('label');
            label.htmlFor = categoria;
            
            if (categoria === 'todas') {
                label.textContent = 'Todas';
            } else {
                label.textContent = categoria.charAt(0).toUpperCase() + categoria.slice(1);
            }
            
            filtrosContainer.appendChild(label);
        });

        console.log('Filtros generados');
    }

    crearRadioButtons() {
        const galeria = document.querySelector('.galeria');
        const topContent = document.querySelector('.top-content');
        
        if (!galeria || !topContent) return;

        const radiosExistentes = document.querySelectorAll('input[name="fotos"]');
        radiosExistentes.forEach(radio => radio.remove());

        const radioTodas = document.createElement('input');
        radioTodas.type = 'radio';
        radioTodas.name = 'fotos';
        radioTodas.id = 'todas';
        radioTodas.checked = true;
        galeria.insertBefore(radioTodas, topContent);

        this.categorias.forEach(categoria => {
            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = 'fotos';
            radio.id = categoria;
            galeria.insertBefore(radio, topContent);
        });
        
        console.log('Radio buttons creados');
    }

    configurarFiltros() {
        const radios = document.querySelectorAll('input[name="fotos"]');
        radios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                console.log('Filtro seleccionado:', e.target.id);
                this.renderizarGaleria(e.target.id);
            });
        });
    }

    renderizarGaleria(categoria) {
        const galeria = document.querySelector('.photo-gallery');
        if (!galeria) return;

        console.log('Renderizando categoría:', categoria);

        let fotosFiltradas = this.fotos;
        if (categoria !== 'todas') {
            fotosFiltradas = this.fotos.filter(foto => foto.categoria === categoria);
        }

        if (fotosFiltradas.length === 0) {
            galeria.innerHTML = '<p style="grid-column: 1/-1; padding: 50px;">No hay fotos en esta categoría</p>';
            return;
        }

        galeria.innerHTML = fotosFiltradas.map(foto => {
            return `
                <div class="pic ${foto.categoria}">
                    <img src="${foto.ruta}" alt="${foto.nombre}" loading="lazy">
                </div>
            `;
        }).join('');

        console.log('Galería renderizada con', fotosFiltradas.length, 'fotos');
    }

    mostrarError(mensaje) {
        const galeria = document.querySelector('.photo-gallery');
        if (galeria) {
            galeria.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 50px;">
                    <p style="color: #dc3545;">Error: ${mensaje}</p>
                </div>
            `;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM cargado, iniciando gestor de galería...');
    window.gestorGaleria = new GestorGaleria();
});