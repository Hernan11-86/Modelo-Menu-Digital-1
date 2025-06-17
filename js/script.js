document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menu-toggle');
    const closeSidebarBtn = document.getElementById('close-sidebar');
    const sidebar = document.getElementById('sidebar');
    const contentWrapper = document.getElementById('content-wrapper');
    const searchInput = document.getElementById('search-input');
    const menuItems = document.querySelectorAll('.menu-item'); // Todos los ítems del menú

    // --- Funciones de control del Sidebar ---
    function openSidebar() {
        sidebar.classList.add('open');
        contentWrapper.classList.add('shifted');
        document.body.style.overflow = 'hidden';
    }

    function closeSidebar() {
        sidebar.classList.remove('open');
        contentWrapper.classList.remove('shifted');
        document.body.style.overflow = '';
    }

    // --- Event Listeners del Sidebar ---
    menuToggle.addEventListener('click', function() {
        if (sidebar.classList.contains('open')) {
            closeSidebar();
        } else {
            openSidebar();
        }
    });

    closeSidebarBtn.addEventListener('click', closeSidebar);

    document.addEventListener('click', function(event) {
        if (sidebar.classList.contains('open') && !sidebar.contains(event.target) && !menuToggle.contains(event.target)) {
            closeSidebar();
        }
    });

    sidebar.addEventListener('click', function(event) {
        event.stopPropagation();
    });

    const sidebarLinks = document.querySelectorAll('.sidebar-menu-list a');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            if (sidebar.classList.contains('open')) {
                setTimeout(() => {
                    const targetId = link.getAttribute('href');
                    if (targetId && targetId.startsWith('#')) {
                        const targetElement = document.querySelector(targetId);
                        if (targetElement) {
                            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                    }
                }, 400);
                closeSidebar();
            } else {
                 const targetId = link.getAttribute('href');
                 if (targetId && targetId.startsWith('#')) {
                     const targetElement = document.querySelector(targetId);
                     if (targetElement) {
                         targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                     }
                 }
            }
        });
    });

    // --- Funcionalidad de Búsqueda ---
    let lastSearchTerm = ''; // Para evitar scroll si el término no cambia

    function performSearchAndScroll() {
        const searchTerm = searchInput.value.toLowerCase().trim();

        // Ocultar/mostrar ítems del menú
        let firstVisibleItem = null;
        menuItems.forEach(item => {
            const itemName = item.querySelector('.item-name').textContent.toLowerCase();
            const itemDescription = item.querySelector('.item-description') ? item.querySelector('.item-description').textContent.toLowerCase() : '';
            // No incluimos categoría/subcategoría en la búsqueda del ítem para que solo filtre por el nombre/desc.
            // Si quieres incluirlo, descomenta o añade la lógica aquí.

            if (itemName.includes(searchTerm) || itemDescription.includes(searchTerm)) {
                item.style.display = 'flex';
                if (!firstVisibleItem) { // Captura el primer ítem visible
                    firstVisibleItem = item;
                }
            } else {
                item.style.display = 'none';
            }
        });

        // Ocultar/mostrar categorías y subcategorías si todos sus ítems están ocultos
        document.querySelectorAll('.menu-category').forEach(category => {
            const visibleItemsInCategory = category.querySelectorAll('.menu-item:not([style*="display: none"])');
            if (visibleItemsInCategory.length === 0 && searchTerm !== '') {
                category.style.display = 'none';
            } else {
                category.style.display = '';
            }
        });

        document.querySelectorAll('.subcategory-title').forEach(subcategory => {
            const parentCategory = subcategory.closest('.menu-category');
            const itemsInSubcategory = Array.from(parentCategory.querySelectorAll('.menu-item')).filter(item => {
                // Comprobamos si el ítem está visible y si su nombre/descripción coincide con la búsqueda
                const itemName = item.querySelector('.item-name').textContent.toLowerCase();
                const itemDescription = item.querySelector('.item-description') ? item.querySelector('.item-description').textContent.toLowerCase() : '';
                return item.style.display !== 'none' && (itemName.includes(searchTerm) || itemDescription.includes(searchTerm));
            });

            // Si no hay ítems visibles en la subcategoría, y la búsqueda no está vacía, ocultar la subcategoría
            if (itemsInSubcategory.length === 0 && searchTerm !== '') {
                subcategory.style.display = 'none';
            } else {
                subcategory.style.display = '';
            }
        });

        // Solo hacer scroll si se ha encontrado al menos un ítem y el término de búsqueda ha cambiado
        if (firstVisibleItem && searchTerm !== lastSearchTerm) {
            firstVisibleItem.scrollIntoView({ behavior: 'smooth', block: 'center' }); // block: 'center' es a menudo mejor para ítems de menú
            lastSearchTerm = searchTerm; // Actualiza el último término buscado
        } else if (!firstVisibleItem && searchTerm !== lastSearchTerm) {
            // Si no se encontró nada y el término cambió, reiniciar el lastSearchTerm
            lastSearchTerm = searchTerm;
        }
    }

    // Evento de teclado para la barra de búsqueda
    searchInput.addEventListener('keyup', function(event) {
        performSearchAndScroll(); // Realiza el filtrado en cada pulsación

        // Scroll solo cuando se presiona Enter
        if (event.key === 'Enter') {
            const firstVisibleItem = document.querySelector('.menu-item:not([style*="display: none"])');
            if (firstVisibleItem) {
                firstVisibleItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            // Esto también puede ser útil para asegurar que el teclado se cierre en móviles
            searchInput.blur();
        }
    });

    // --- Actualizar altura del Header en Variable CSS ---
    const mainHeader = document.querySelector('.main-header');
    function updateHeaderHeightVariable() {
        document.documentElement.style.setProperty('--header-height-desktop', `${mainHeader.offsetHeight}px`);
        document.documentElement.style.setProperty('--header-height-mobile', `${mainHeader.offsetHeight}px`);
    }

    updateHeaderHeightVariable();
    window.addEventListener('resize', updateHeaderHeightVariable);

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            if (!this.closest('.sidebar-menu-list')) {
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});
