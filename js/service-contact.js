function submitServiceRequest() {
    // Sprawdź czy formularz jest wypełniony
    const serviceType = document.getElementById('serviceType').value;
    const description = document.getElementById('description').value;
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;

    // Walidacja pól
    if (!serviceType || !description || !name || !email || !phone) {
        alert('Please fill in all required fields!');
        return;
    }

    // Walidacja emaila
    if (!isValidEmail(email)) {
        alert('Please enter a valid email address!');
        return;
    }

    // Walidacja numeru telefonu
    if (!isValidPhone(phone)) {
        alert('Please enter a valid phone number!');
        return;
    }

    // Pokaż powiadomienie o sukcesie
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">Service request submitted successfully!</span>
            <span class="notification-close">&times;</span>
        </div>
    `;
    document.body.appendChild(notification);

    // Automatycznie ukryj powiadomienie po 3 sekundach
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);

    // Wyczyść formularz
    document.getElementById('serviceForm').reset();

    // Zamień formularz na komunikat potwierdzający
    const formContainer = document.querySelector('.service-form');
    formContainer.innerHTML = `
        <div class="submission-message">
            <p>Thank you for your service request!</p>
            <p>Our technical team will contact you within 24 hours.</p>
        </div>
    `;
}

// Pomocnicze funkcje walidacji
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
    return /^[\d\s+()-]{10,}$/.test(phone);
}

// Dodaj nasłuchiwanie na przycisk submit
document.addEventListener('DOMContentLoaded', () => {
    const submitButton = document.querySelector('.submit-button');
    if (submitButton) {
        submitButton.addEventListener('click', submitServiceRequest);
    }
}); 