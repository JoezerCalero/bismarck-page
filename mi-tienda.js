document.addEventListener('DOMContentLoaded', () => {
    // --- Store Data ---
    let myStore = {};
    let products = [];
    let orders = [];

    // --- DOM Elements ---
    const storeHeaderContainer = document.getElementById('store-header-container');
    const storeInfoContainer = document.getElementById('store-info-container');
    const productsGrid = document.getElementById('products-grid');
    const ordersListContainer = document.getElementById('orders-list-container');
    
    // Forms & Inputs
    const addProductForm = document.getElementById('add-product-form');
    const productImageInput = document.getElementById('product-image');
    const imagePreview = document.getElementById('image-preview');
    const formTitle = document.getElementById('form-title');
    const formSubmitBtn = document.getElementById('form-submit-btn');
    const formCancelBtn = document.getElementById('form-cancel-btn');
    const productIdInput = document.getElementById('product-id');
    
    // Stats
    const statsProfit = document.getElementById('stats-profit');
    const statsInventoryValue = document.getElementById('stats-inventory-value');
    const statsProductsCount = document.getElementById('stats-products-count');
    const statsSalesCount = document.getElementById('stats-sales-count');
    
    // Tabs
    const tabs = document.querySelectorAll('.dashboard-nav-btn');
    const tabContents = document.querySelectorAll('.dashboard-tab-content');
    
    // Buttons
    const logoutBtn = document.getElementById('logout-btn');

    // --- DATA MANAGEMENT ---
    function loadData() {
        const storeDataString = localStorage.getItem('my-store');
        if (!storeDataString) {
            window.location.href = '/crear-tienda.html';
            return;
        }
        myStore = JSON.parse(storeDataString);

        const productsDataString = localStorage.getItem('my-products');
        products = productsDataString ? JSON.parse(productsDataString) : [];

        const ordersDataString = localStorage.getItem('my-orders');
        orders = ordersDataString ? JSON.parse(ordersDataString) : [];

        // Initial Render
        renderAll();
    }
    
    function saveData() {
        localStorage.setItem('my-products', JSON.stringify(products));
        localStorage.setItem('my-orders', JSON.stringify(orders));
    }

    // --- RENDER FUNCTIONS ---
    function renderAll() {
        renderStoreHeader();
        renderStoreSettings();
        renderProducts();
        renderDashboardStats();
        renderOrders();
    }

    function renderStoreHeader() {
        if (!myStore || !storeHeaderContainer) return;
        storeHeaderContainer.innerHTML = `
            <div class="store-info-header">
                 ${myStore.logo ? `<img src="${myStore.logo}" alt="Logo de ${myStore.name}" class="store-logo-display">` : ''}
                <div>
                    <h2>${myStore.name}</h2>
                    <p class="subtitle">¡Bienvenido a tu panel de control!</p>
                </div>
            </div>
        `;
    }

    function renderStoreSettings() {
        if (!myStore || !storeInfoContainer) return;
        storeInfoContainer.innerHTML = `
            <div class="settings-info">
                <p><strong>Nombre:</strong> ${myStore.name}</p>
                <p><strong>Descripción:</strong> ${myStore.description}</p>
                <p><strong>Universidad:</strong> ${myStore.university || 'No especificada'}</p>
                <p><strong>Teléfono:</strong> ${myStore.phone || 'No especificado'}</p>
                <p><strong>Instagram:</strong> ${myStore.instagram ? `<a href="https://instagram.com/${myStore.instagram.replace('@', '')}" target="_blank">${myStore.instagram}</a>` : 'No especificado'}</p>
                <p><strong>Cuenta Vinculada:</strong> ${myStore.ownerEmail || 'No especificada'}</p>
            </div>
        `;
    }

    function renderProducts() {
        if (!productsGrid) return;
        productsGrid.innerHTML = '';
        if (products.length === 0) {
            productsGrid.innerHTML = '<p class="empty-state">Aún no has añadido ningún producto. ¡Usa el formulario de arriba para empezar!</p>';
            return;
        }
        
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card-manage';
            productCard.dataset.productId = product.id;
            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <div class="product-card-info">
                    <h4>${product.name}</h4>
                    <p class="price"><b>Venta:</b> C$ ${product.price} / <b>Costo:</b> C$ ${product.cost}</p>
                    <p class="stock ${product.stock < 5 ? 'low-stock' : ''}">Inventario: ${product.stock}</p>
                </div>
                <div class="product-card-actions">
                    <button class="btn-action btn-sale">Simular Venta</button>
                    <button class="btn-action btn-edit">Editar</button>
                    <button class="btn-action btn-delete">Eliminar</button>
                </div>
            `;
            productsGrid.appendChild(productCard);
        });
    }

    function renderDashboardStats() {
        let potentialProfit = 0;
        let inventoryValue = 0;
        products.forEach(p => {
            const profitPerItem = (parseFloat(p.price) || 0) - (parseFloat(p.cost) || 0);
            potentialProfit += profitPerItem * (parseInt(p.stock) || 0);
            inventoryValue += (parseFloat(p.cost) || 0) * (parseInt(p.stock) || 0);
        });
        
        statsProfit.textContent = `C$ ${potentialProfit.toFixed(2)}`;
        statsInventoryValue.textContent = `C$ ${inventoryValue.toFixed(2)}`;
        statsProductsCount.textContent = products.length;
        statsSalesCount.textContent = orders.length;
    }
    
    function renderOrders() {
        if (!ordersListContainer) return;
        ordersListContainer.innerHTML = '';
         if (orders.length === 0) {
            ordersListContainer.innerHTML = '<p class="empty-state">No se han registrado ventas simuladas.</p>';
            return;
        }

        const list = document.createElement('ul');
        list.className = 'orders-list';
        // Show latest orders first
        [...orders].reverse().forEach(order => {
            const item = document.createElement('li');
            item.innerHTML = `Venta de <strong>${order.productName}</strong> por C$${order.price} el ${new Date(order.date).toLocaleString('es-NI')}`;
            list.appendChild(item);
        });
        ordersListContainer.appendChild(list);
    }
    
    // --- EVENT LISTENERS & HANDLERS ---
    
    // Tab switching
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const targetTab = tab.dataset.tab;
            tabContents.forEach(content => {
                if (content.id === `${targetTab}-tab`) {
                    content.classList.add('active');
                } else {
                    content.classList.remove('active');
                }
            });
        });
    });

    // Image Preview
    productImageInput.addEventListener('change', () => {
        const file = productImageInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                imagePreview.src = e.target.result;
                imagePreview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });

    // Form Submission (Add/Edit Product)
    addProductForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const productId = productIdInput.value;
        const productData = {
            name: document.getElementById('product-name').value,
            description: document.getElementById('product-description').value,
            price: document.getElementById('product-price').value,
            cost: document.getElementById('product-cost').value,
            stock: document.getElementById('product-stock').value,
            image: imagePreview.src.startsWith('data:image') ? imagePreview.src : null,
        };

        if (productId) { // Editing existing product
            const index = products.findIndex(p => p.id == productId);
            if(index !== -1) {
                // Keep old image if a new one isn't provided
                if (!productData.image) {
                    productData.image = products[index].image;
                }
                products[index] = { ...products[index], ...productData };
            }
        } else { // Adding new product
            if (!productData.image) {
                alert('Por favor, selecciona una imagen para el producto.');
                return;
            }
            productData.id = Date.now(); // Simple unique ID
            products.push(productData);
        }
        
        saveData();
        renderAll();
        resetForm();
    });
    
    // Cancel Edit Button
    formCancelBtn.addEventListener('click', resetForm);

    function resetForm() {
        addProductForm.reset();
        imagePreview.style.display = 'none';
        imagePreview.src = '#';
        productIdInput.value = '';
        formTitle.textContent = 'Añadir Nuevo Producto';
        formSubmitBtn.textContent = 'Guardar Producto';
        formCancelBtn.style.display = 'none';
        // Reset file input by clearing its value
        productImageInput.value = '';
    }

    // Product Actions (Edit, Delete, Sell) - Event Delegation
    productsGrid.addEventListener('click', (e) => {
        const target = e.target;
        const card = target.closest('.product-card-manage');
        if (!card) return;
        
        const productId = card.dataset.productId;
        
        if (target.classList.contains('btn-edit')) {
            handleEdit(productId);
        } else if (target.classList.contains('btn-delete')) {
            handleDelete(productId);
        } else if (target.classList.contains('btn-sale')) {
            handleSale(productId);
        }
    });
    
    function handleEdit(id) {
        const product = products.find(p => p.id == id);
        if (!product) return;
        
        // Populate form
        productIdInput.value = product.id;
        document.getElementById('product-name').value = product.name;
        document.getElementById('product-description').value = product.description;
        document.getElementById('product-price').value = product.price;
        document.getElementById('product-cost').value = product.cost;
        document.getElementById('product-stock').value = product.stock;
        imagePreview.src = product.image;
        imagePreview.style.display = 'block';

        // Update form state
        formTitle.textContent = 'Editar Producto';
        formSubmitBtn.textContent = 'Actualizar Producto';
        formCancelBtn.style.display = 'inline-block';
        
        // Scroll to form for better UX
        addProductForm.scrollIntoView({ behavior: 'smooth' });
    }

    function handleDelete(id) {
        if (confirm('¿Estás seguro de que quieres eliminar este producto? Esta acción no se puede deshacer.')) {
            products = products.filter(p => p.id != id);
            saveData();
            renderAll();
        }
    }
    
    function handleSale(id) {
        const index = products.findIndex(p => p.id == id);
        if(index === -1) return;

        if (products[index].stock > 0) {
            products[index].stock--;
            const newOrder = {
                productId: id,
                productName: products[index].name,
                price: products[index].price,
                date: new Date().toISOString()
            };
            orders.push(newOrder);
            saveData();
            renderAll();
        } else {
            alert('No hay más stock de este producto.');
        }
    }

    // Logout Button
    if(logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (confirm('¿Estás seguro? Esto eliminará todos los datos de tu tienda de este navegador y te redirigirá al inicio.')) {
                localStorage.removeItem('my-store');
                localStorage.removeItem('my-products');
                localStorage.removeItem('my-orders');
                window.location.href = '/';
            }
        });
    }

    // --- Initial Load ---
    loadData();
});