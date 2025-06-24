import { jwtDecode } from 'jwt-decode';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('create-store-form');
    const logoInput = document.getElementById('store-logo');
    const imagePreview = document.getElementById('image-preview');

    window.handleGoogleSignIn = (response) => {
        try {
            const decodedToken = jwtDecode(response.credential);
            console.log("Signed in with Google: ", decodedToken);

            document.getElementById('google-email').value = decodedToken.email;

            document.getElementById('google-signin-section').style.display = 'none';
            const storeFormContainer = document.getElementById('store-form-container');
            storeFormContainer.style.display = 'block';

            const welcomeMessageContainer = document.getElementById('welcome-message');
            welcomeMessageContainer.innerHTML = `<p>¡Hola, <strong>${decodedToken.name}</strong>! Tu correo (${decodedToken.email}) ha sido vinculado. Ahora, completa los detalles de tu tienda.</p>`;
            welcomeMessageContainer.style.marginBottom = '1.5rem';
            welcomeMessageContainer.style.textAlign = 'center';
            welcomeMessageContainer.style.background = '#e9f5ff';
            welcomeMessageContainer.style.padding = '1rem';
            welcomeMessageContainer.style.borderRadius = '8px';

        } catch (error) {
            console.error("Error decoding token: ", error);
            alert("Hubo un problema al iniciar sesión con Google. Por favor, intenta de nuevo.");
        }
    };

    logoInput.addEventListener('change', () => {
        const file = logoInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                imagePreview.src = e.target.result;
                imagePreview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const storeName = document.getElementById('store-name').value;
        const storeDescription = document.getElementById('store-description').value;
        const storeUniversity = document.getElementById('store-university').value;
        const storePhone = document.getElementById('store-phone').value;
        const storeInstagram = document.getElementById('store-instagram').value;
        const storeLogo = imagePreview.src.startsWith('data:image') ? imagePreview.src : null;
        const googleEmail = document.getElementById('google-email').value;

        if (!googleEmail) {
            alert("Por favor, inicia sesión con Google primero.");
            // Optionally, show the Google sign-in section again
            document.getElementById('google-signin-section').style.display = 'block';
            document.getElementById('store-form-container').style.display = 'none';
            return;
        }

        const storeData = {
            name: storeName,
            description: storeDescription,
            university: storeUniversity,
            phone: storePhone,
            instagram: storeInstagram,
            logo: storeLogo,
            ownerEmail: googleEmail,
        };

        // Save to localStorage to simulate session
        localStorage.setItem('my-store', JSON.stringify(storeData));
        localStorage.setItem('my-products', JSON.stringify([])); // Initialize products
        localStorage.setItem('my-orders', JSON.stringify([])); // Initialize orders

        // Redirect to the new store dashboard
        window.location.href = '/mi-tienda.html';
    });
});