document.addEventListener('DOMContentLoaded', function() {
    const mainContent = document.querySelector('.main-content');
    const indicator = document.querySelector('.scroll-indicator');
    const navBlur = document.querySelector('.vertical-nav-blur');
    const homeContent = document.getElementById('home-content');
    const myListContent = document.getElementById('my-list-content');
    const favoritesContent = document.getElementById('favorites-content');
    const savedList = document.getElementById('saved-list');
    const favoritesList = document.getElementById('favorites-list');
    const navLinks = document.querySelectorAll('.sidebar-nav a[data-target]');
    const saveButtons = document.querySelectorAll('.card-save');
    const favoriteButtons = document.querySelectorAll('.card-favorite');
    const saveMainButton = document.querySelector('.save-main');
    const favoriteMainButton = document.querySelector('.favorite-main');
    const notification = document.getElementById('save-notification');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    // Cargar lista guardada y favoritos del localStorage
    let savedItems = JSON.parse(localStorage.getItem('myList')) || [];
    let favoriteItems = JSON.parse(localStorage.getItem('favorites')) || [];
    
    // Controlador para el menú móvil
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('show');
        });
        
        // Cerrar el menú al hacer clic en un enlace
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('show');
            });
        });
        
        // Cerrar el menú al hacer clic fuera de él
        document.addEventListener('click', function(event) {
            if (!event.target.closest('.sidebar-nav') && !event.target.closest('.mobile-menu-toggle')) {
                navMenu.classList.remove('show');
            }
        });
    }
    
    // Función para mostrar notificación
    function showNotification(message) {
        notification.textContent = message;
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
        }, 2000);
    }
    
    // Función para actualizar los botones de guardar según lo que ya está guardado
    function updateSaveButtons() {
        const cardSaveButtons = document.querySelectorAll('.card-save');
        cardSaveButtons.forEach(button => {
            const card = button.closest('.card');
            const id = card.dataset.id;
            
            if (savedItems.some(item => item.id === id)) {
                button.classList.add('saved');
                button.textContent = '✓';
            } else {
                button.classList.remove('saved');
                button.textContent = '+';
            }
        });
        
        // Actualizar también el botón principal
        if (saveMainButton) {
            const id = saveMainButton.dataset.id;
            if (savedItems.some(item => item.id === id)) {
                saveMainButton.textContent = '✓ In My List';
            } else {
                saveMainButton.textContent = '+ My List';
            }
        }
    }
    
    // Función para actualizar los botones de favoritos
    function updateFavoriteButtons() {
        const cardFavoriteButtons = document.querySelectorAll('.card-favorite');
        cardFavoriteButtons.forEach(button => {
            const card = button.closest('.card');
            const id = card.dataset.id;
            
            if (favoriteItems.some(item => item.id === id)) {
                button.classList.add('favorited');
                button.innerHTML = '<i class="fa-solid fa-heart"></i>';
            } else {
                button.classList.remove('favorited');
                button.innerHTML = '<i class="fa-regular fa-heart"></i>';
            }
        });
        
        // Actualizar también el botón principal
        if (favoriteMainButton) {
            const id = favoriteMainButton.dataset.id;
            if (favoriteItems.some(item => item.id === id)) {
                favoriteMainButton.classList.add('favorited');
                favoriteMainButton.innerHTML = '<i class="fa-solid fa-heart"></i>';
            } else {
                favoriteMainButton.classList.remove('favorited');
                favoriteMainButton.innerHTML = '<i class="fa-regular fa-heart"></i>';
            }
        }
    }
    
    // Función para renderizar la lista guardada
    function renderSavedList() {
        if (savedItems.length === 0) {
            savedList.innerHTML = '<div class="no-items">No items saved to your list yet</div>';
            return;
        }
        
        savedList.innerHTML = '';
        savedItems.forEach(item => {
            const cardElement = document.createElement('div');
            cardElement.className = 'card';
            cardElement.dataset.id = item.id;
            cardElement.dataset.title = item.title;
            
            const removeButton = document.createElement('button');
            removeButton.className = 'card-save saved';
            removeButton.textContent = '✓';
            removeButton.addEventListener('click', function() {
                removeFromList(item.id);
            });
            
            const favoriteButton = document.createElement('button');
            favoriteButton.className = 'card-favorite';
            if (favoriteItems.some(fav => fav.id === item.id)) {
                favoriteButton.classList.add('favorited');
                favoriteButton.innerHTML = '<i class="fa-solid fa-heart"></i>';
            } else {
                favoriteButton.innerHTML = '<i class="fa-regular fa-heart"></i>';
            }
            favoriteButton.addEventListener('click', function() {
                toggleFavorite(item.id, item.title, item.image);
            });
            
            const img = document.createElement('img');
            img.src = item.image;
            
            const title = document.createElement('span');
            title.textContent = item.title;
            
            cardElement.appendChild(removeButton);
            cardElement.appendChild(favoriteButton);
            cardElement.appendChild(img);
            cardElement.appendChild(title);
            
            savedList.appendChild(cardElement);
        });
    }
    
    // Función para renderizar los favoritos
    function renderFavoritesList() {
        if (favoriteItems.length === 0) {
            favoritesList.innerHTML = '<div class="no-items">No favorites added yet</div>';
            return;
        }
        
        favoritesList.innerHTML = '';
        favoriteItems.forEach(item => {
            const cardElement = document.createElement('div');
            cardElement.className = 'card';
            cardElement.dataset.id = item.id;
            cardElement.dataset.title = item.title;
            
            const saveButton = document.createElement('button');
            saveButton.className = 'card-save';
            saveButton.textContent = '+';
            if (savedItems.some(saved => saved.id === item.id)) {
                saveButton.classList.add('saved');
                saveButton.textContent = '✓';
            }
            saveButton.addEventListener('click', function() {
                addToList(item.id, item.title, item.image);
            });
            
            const favoriteButton = document.createElement('button');
            favoriteButton.className = 'card-favorite favorited';
            favoriteButton.innerHTML = '<i class="fa-solid fa-heart"></i>';
            favoriteButton.addEventListener('click', function() {
                toggleFavorite(item.id, item.title, item.image);
            });
            
            const img = document.createElement('img');
            img.src = item.image;
            
            const title = document.createElement('span');
            title.textContent = item.title;
            
            cardElement.appendChild(saveButton);
            cardElement.appendChild(favoriteButton);
            cardElement.appendChild(img);
            cardElement.appendChild(title);
            
            favoritesList.appendChild(cardElement);
        });
    }
    
    // Función para agregar a la lista
    function addToList(id, title, image) {
        // Verificar si ya existe en la lista
        if (savedItems.some(item => item.id === id)) {
            removeFromList(id);
            return;
        }
        
        savedItems.push({
            id,
            title,
            image
        });
        
        localStorage.setItem('myList', JSON.stringify(savedItems));
        updateSaveButtons();
        renderSavedList();
        renderFavoritesList(); // Actualizar si también está en favoritos
        showNotification('Added to My List');
    }
    
    // Función para remover de la lista
    function removeFromList(id) {
        savedItems = savedItems.filter(item => item.id !== id);
        localStorage.setItem('myList', JSON.stringify(savedItems));
        updateSaveButtons();
        renderSavedList();
        renderFavoritesList(); // Por si también está en favoritos, para actualizar el botón
        showNotification('Removed from My List');
    }
    
    // Función para alternar favorito
    function toggleFavorite(id, title, image) {
        // Verificar si ya existe en favoritos
        if (favoriteItems.some(item => item.id === id)) {
            favoriteItems = favoriteItems.filter(item => item.id !== id);
            showNotification('Removed from Favorites');
        } else {
            favoriteItems.push({
                id,
                title,
                image
            });
            showNotification('Added to Favorites');
        }
        
        localStorage.setItem('favorites', JSON.stringify(favoriteItems));
        updateFavoriteButtons();
        renderFavoritesList();
        renderSavedList(); // Actualizar si también está en My List
    }
    
    // Event listeners para los botones de guardar en las tarjetas
    saveButtons.forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.card');
            const id = card.dataset.id;
            const title = card.dataset.title;
            const image = card.querySelector('img').src;
            
            addToList(id, title, image);
        });
    });
    
    // Event listeners para los botones de favoritos en las tarjetas
    favoriteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.card');
            const id = card.dataset.id;
            const title = card.dataset.title;
            const image = card.querySelector('img').src;
            
            toggleFavorite(id, title, image);
        });
    });
    
    // Event listener para el botón de guardar en el hero
    if (saveMainButton) {
        saveMainButton.addEventListener('click', function() {
            const id = this.dataset.id;
            const title = this.dataset.title;
            const image = this.dataset.img;
            
            addToList(id, title, image);
        });
    }
    
    // Event listener para el botón de favorito en el hero
    if (favoriteMainButton) {
        favoriteMainButton.addEventListener('click', function() {
            const id = this.dataset.id;
            const title = this.dataset.title;
            const image = this.dataset.img;
            
            toggleFavorite(id, title, image);
        });
    }
    
    // Event listeners para los links de navegación
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Desactivar todos los links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Activar este link
            this.classList.add('active');
            
            const target = this.dataset.target;
            const heroSection = document.querySelector('.hero');
            
            // Mostrar el contenido correspondiente
            if (target === 'home') {
                homeContent.style.display = 'block';
                myListContent.classList.remove('show');
                favoritesContent.classList.remove('show');
                heroSection.style.display = 'flex'; // Mostrar el hero en la vista de inicio
            } else if (target === 'my-list') {
                homeContent.style.display = 'none';
                myListContent.classList.add('show');
                favoritesContent.classList.remove('show');
                heroSection.style.display = 'none'; // Ocultar el hero en My List
                renderSavedList();
            } else if (target === 'favorites') {
                homeContent.style.display = 'none';
                myListContent.classList.remove('show');
                favoritesContent.classList.add('show');
                heroSection.style.display = 'none'; // Ocultar el hero en Favorites
                renderFavoritesList();
            }
        });
    });
    
    function updateScrollIndicator() {
      const scrollHeight = mainContent.scrollHeight;
      const clientHeight = mainContent.clientHeight;
      const scrollTop = mainContent.scrollTop;
  
      // Calcula la altura proporcional de la barra
      const indicatorHeight = Math.max((clientHeight / scrollHeight) * navBlur.offsetHeight, 40);
      indicator.style.height = indicatorHeight + 'px';
  
      // Calcula la posición proporcional
      const maxScroll = scrollHeight - clientHeight;
      const maxIndicatorMove = navBlur.offsetHeight - indicatorHeight;
      const top = (scrollTop / maxScroll) * maxIndicatorMove;
      indicator.style.top = (isNaN(top) ? 0 : top) + 'px';
    }
  
    mainContent.addEventListener('scroll', updateScrollIndicator);
    window.addEventListener('resize', updateScrollIndicator);
    updateScrollIndicator();
    
    // Inicializar botones y lista
    updateSaveButtons();
    updateFavoriteButtons();
    renderSavedList();
    renderFavoritesList();
    
    // Asegurar que el hero esté visible al inicio
    const heroSection = document.querySelector('.hero');
    heroSection.style.display = 'flex';
});