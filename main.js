import 'swiper/element/bundle';

document.addEventListener('DOMContentLoaded', () => {

    // --- My Store Link Logic ---
    const myStoreLink = document.getElementById('my-store-link');
    if (myStoreLink) {
        const myStore = localStorage.getItem('my-store');
        if (!myStore) {
            // If no store is created, the "Mi Tienda" link goes to the creation page
            myStoreLink.href = '/crear-tienda.html';
        }
    }

    // --- Store Filter Logic ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const storeCards = document.querySelectorAll('.store-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filter = button.dataset.filter;

            // Filter cards
            storeCards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.style.display = 'block';
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.9)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300); // match transition time
                }
            });
        });
    });

    // --- Personalized Suggestions Logic ---
    const suggestionsContainer = document.querySelector('.suggestions-container');
    const weatherConditions = {
        rainy: {
            text: "Está lloviendo, ¿un café?",
            suggestions: [
                { name: "Café Caliente", img: "suggestion-cafe.png" },
                { name: "Paraguas", img: "suggestion-paraguas.png" },
                { name: "Repostería", img: "suggestion-reposteria.png" },
                { name: "Libros", img: "suggestion-libros.png" },
            ]
        },
        sunny: {
            text: "Día soleado, ¡a disfrutar!",
            suggestions: [
                { name: "Gafas de Sol", img: "suggestion-gafas.png" },
                { name: "Bebidas Frías", img: "suggestion-bebidas.png" },
                { name: "Ropa de Verano", img: "suggestion-ropa-verano.png" },
                { name: "Gorras", img: "suggestion-gorras.png" },
            ]
        }
    };
    
    // Simulate getting a weather condition
    const currentCondition = Math.random() > 0.5 ? 'rainy' : 'sunny';
    const suggestionData = weatherConditions[currentCondition];
    
    const suggestionsTitle = document.querySelector('.suggestions-section h2');
    suggestionsTitle.textContent = suggestionData.text;

    suggestionsContainer.innerHTML = suggestionData.suggestions.map(item => `
        <div class="suggestion-card">
            <img src="${item.img}" alt="${item.name}">
            <p>${item.name}</p>
        </div>
    `).join('');

    // --- Service Worker Registration ---
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('ServiceWorker registration successful with scope: ', registration.scope);
                })
                .catch(err => {
                    console.log('ServiceWorker registration failed: ', err);
                });
        });
    }
});