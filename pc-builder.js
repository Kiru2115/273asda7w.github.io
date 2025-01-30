function updateCompatibility() {
    const motherboard = document.getElementById('motherboard');
    const cpu = document.getElementById('cpu');
    const ram = document.getElementById('ram');
    const gpu = document.getElementById('gpu');
    const storage = document.getElementById('storage');
    const psu = document.getElementById('psu');
    const pcCase = document.getElementById('case');
    
    // Debugging
    console.log('Selected motherboard:', motherboard.value);
    const selectedMotherboard = motherboard.options[motherboard.selectedIndex];
    console.log('Motherboard socket:', selectedMotherboard.getAttribute('data-socket'));

    // Zablokuj wszystkie komponenty na początku
    ram.disabled = true;
    gpu.disabled = true;
    storage.disabled = true;
    psu.disabled = true;
    pcCase.disabled = true;

    // Jeśli płyta główna nie jest wybrana, zablokuj CPU
    if (!motherboard.value) {
        cpu.disabled = true;
        cpu.value = '';
        updateBuildSummary();
        return;
    }

    // Odblokuj CPU
    cpu.disabled = false;
    const socket = selectedMotherboard.getAttribute('data-socket');
    console.log('Looking for CPU socket:', socket);

    // Pokaż pierwszą opcję (Select CPU...)
    cpu.options[0].style.display = '';

    // Filtrowanie CPU
    Array.from(cpu.getElementsByTagName('optgroup')).forEach(group => {
        const groupSocket = group.getAttribute('data-socket');
        console.log('CPU group socket:', groupSocket);
        const isCompatible = groupSocket === socket;
        console.log('Is compatible:', isCompatible);
        
        group.style.display = isCompatible ? '' : 'none';
        
        Array.from(group.getElementsByTagName('option')).forEach(option => {
            option.style.display = isCompatible ? '' : 'none';
            option.disabled = !isCompatible;
        });
    });

    // Sprawdź czy wybrany CPU jest nadal kompatybilny
    if (cpu.value) {
        const selectedCPU = cpu.options[cpu.selectedIndex];
        if (selectedCPU.style.display === 'none') {
            cpu.value = '';
        }
    }

    // Jeśli CPU nie jest wybrany, zatrzymaj się tutaj
    if (!cpu.value) {
        updateBuildSummary();
        return;
    }

    // Odblokuj RAM i filtruj według typu
    ram.disabled = false;
    
    // Filtrowanie RAM
    Array.from(ram.getElementsByTagName('optgroup')).forEach(group => {
        const groupType = group.getAttribute('data-type');
        const isCompatible = groupType === selectedMotherboard.getAttribute('data-ram');
        group.style.display = isCompatible ? '' : 'none';
        
        Array.from(group.getElementsByTagName('option')).forEach(option => {
            option.style.display = isCompatible ? '' : 'none';
            option.disabled = !isCompatible;
        });
    });

    // Jeśli aktualnie wybrany RAM nie jest kompatybilny, wyczyść wybór
    if (ram.selectedIndex > 0) {
        const selectedOption = ram.options[ram.selectedIndex];
        const selectedGroup = selectedOption.parentElement;
        if (selectedGroup.style.display === 'none') {
            ram.value = '';
        }
    }

    // Jeśli RAM nie jest wybrany, zatrzymaj się tutaj
    if (!ram.value) {
        updateBuildSummary();
        return;
    }

    // Odblokuj GPU
    gpu.disabled = false;

    // Jeśli GPU nie jest wybrana, zatrzymaj się tutaj
    if (!gpu.value) {
        updateBuildSummary();
        return;
    }

    // Odblokuj Storage
    storage.disabled = false;

    // Jeśli Storage nie jest wybrany, zatrzymaj się tutaj
    if (!storage.value) {
        updateBuildSummary();
        return;
    }

    // Odblokuj PSU
    psu.disabled = false;

    // Jeśli PSU nie jest wybrany, zatrzymaj się tutaj
    if (!psu.value) {
        updateBuildSummary();
        return;
    }

    // Odblokuj Case
    pcCase.disabled = false;
    updateBuildSummary();
}

function updateBuildSummary() {
    const components = {
        'motherboard': 'Motherboard',
        'cpu': 'CPU',
        'ram': 'RAM',
        'gpu': 'Graphics Card',
        'storage': 'Storage',
        'psu': 'Power Supply',
        'case': 'Case'
    };

    let summaryHTML = '<h3>Build Summary</h3>';
    let totalPrice = 0;

    for (const [id, label] of Object.entries(components)) {
        const select = document.getElementById(id);
        if (select.value) {
            const selectedOption = select.options[select.selectedIndex];
            const price = parseInt(select.value);
            summaryHTML += `<div class="summary-item">
                <span class="component-name">${label}:</span>
                <span class="component-value">${selectedOption.text}</span>
            </div>`;
            totalPrice += price;
        }
    }

    if (totalPrice > 0) {
        summaryHTML += `<div class="summary-total">
            <strong>Total Price: $${totalPrice}</strong>
        </div>`;
    }

    document.querySelector('.build-summary').innerHTML = summaryHTML;
}

function updatePrice() {
    const components = {
        'motherboard': 'Motherboard',
        'cpu': 'Cpu',
        'gpu': 'Gpu',
        'ram': 'Ram',
        'storage': 'Storage',
        'psu': 'Psu',
        'case': 'Case'
    };
    
    let totalPrice = 0;
    let summaryHTML = '';
    
    // Generuj podsumowanie dla każdego komponentu
    for (let [id, label] of Object.entries(components)) {
        const select = document.getElementById(id);
        if (select && select.value) {
            const selectedOption = select.options[select.selectedIndex];
            const price = parseInt(select.value);
            totalPrice += price;
            // Usuń specyfikacje ze stringa przed dodaniem do podsumowania
            const cleanText = selectedOption.textContent.split('Socket:')[0].trim();
            summaryHTML += `<p><span>${label}:</span> <strong>${cleanText}</strong></p>`;
        }
    }
    
    // Aktualizuj HTML podsumowania
    const summaryElement = document.getElementById('buildSummary');
    
    // Jeśli jest jakiś wybrany komponent, pokaż total
    if (totalPrice > 0) {
        summaryHTML += `
            <div class="total-price">
                <span>Total:</span>
                <strong>$${totalPrice}</strong>
            </div>`;
    }
    
    // Aktualizuj HTML
    summaryElement.innerHTML = summaryHTML;
}

function disableComponent(select) {
    if (!select) return;
    select.disabled = true;
    select.value = '';
}

function enableComponent(select) {
    if (!select) return;
    select.disabled = false;
}

// Dodaj nasłuchiwanie zmiany dla wszystkich komponentów
const components = ['motherboard', 'cpu', 'ram', 'gpu', 'storage', 'psu', 'case'];
components.forEach(component => {
    document.getElementById(component).addEventListener('change', updateCompatibility);
});

// Wywołaj funkcję na starcie
document.addEventListener('DOMContentLoaded', () => {
    updateCompatibility();
});

function submitBuild() {
    const components = ['cpu', 'motherboard', 'gpu', 'ram', 'storage', 'psu', 'case'];
    let missingComponents = [];
    
    components.forEach(component => {
        const select = document.getElementById(component);
        if (!select.value) {
            missingComponents.push(component.toUpperCase());
        }
    });
    
    if (missingComponents.length > 0) {
        alert(`Please select the following components:\n${missingComponents.join('\n')}`);
        return;
    }
    
    // Pokazujemy powiadomienie
    const notification = document.getElementById('notification');
    notification.classList.remove('hidden');
    
    // Przewijamy stronę na górę
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    
    // Ukrywamy powiadomienie po 5 sekundach
    setTimeout(() => {
        notification.classList.add('hidden');
    }, 5000);
    
    // Resetujemy formularz
    components.forEach(component => {
        document.getElementById(component).value = '';
    });
    updatePrice();
    updateCompatibility();
}

function openPreview(componentId) {
    const select = document.getElementById(componentId);
    if (!select.value) {
        alert('Please select a component first');
        return;
    }
    
    const selectedOption = select.options[select.selectedIndex];
    const link = selectedOption.dataset.link;
    
    if (link) {
        window.open(link, '_blank');
    } else {
        alert('Preview link not available for this component');
    }
}

// Aktualizacja stanu przycisków podglądu
function updatePreviewButtons() {
    const components = ['cpu', 'motherboard', 'gpu', 'ram', 'storage', 'psu', 'case'];
    
    components.forEach(componentId => {
        const select = document.getElementById(componentId);
        const previewButton = select.parentElement.querySelector('.preview-button');
        const selectedOption = select.options[select.selectedIndex];
        
        if (selectedOption && selectedOption.dataset.preview) {
            previewButton.disabled = false;
            previewButton.title = "View on x-kom";
        } else {
            previewButton.disabled = true;
            previewButton.title = "Select a component first";
        }
    });
}

// Dodajemy nasłuchiwanie zmian w selectach
document.addEventListener('DOMContentLoaded', function() {
    const components = ['cpu', 'motherboard', 'gpu', 'ram', 'storage', 'psu', 'case'];
    
    components.forEach(componentId => {
        const select = document.getElementById(componentId);
        select.addEventListener('change', updatePreviewButtons);
    });
    
    updatePreviewButtons();
});

function calculateTotalPowerDraw() {
    let totalPower = 100; // Bazowe 100W na płytę główną i podstawowe komponenty
    
    const components = ['cpu', 'gpu'];
    components.forEach(componentId => {
        const select = document.getElementById(componentId);
        if (select.value) {
            const option = select.options[select.selectedIndex];
            totalPower += parseInt(option.dataset.power || 0);
        }
    });
    
    // Dodaj margines bezpieczeństwa 20%
    return Math.ceil(totalPower * 1.2);
}

function updatePowerRequirements() {
    const totalPower = calculateTotalPowerDraw();
    const psuSelect = document.getElementById('psu');
    
    const cpu = document.getElementById('cpu');
    const gpu = document.getElementById('gpu');
    
    if (cpu.value && gpu.value) {
        enableComponent(psuSelect);
        
        // Filtruj zasilacze na podstawie wymaganej mocy
        const options = psuSelect.getElementsByTagName('option');
        for (let option of options) {
            if (!option.value) continue; // Pomiń opcję "Select Power Supply..."
            
            const watts = parseInt(option.dataset.watts || 0);
            option.style.display = watts >= totalPower ? '' : 'none';
            
            if (option.selected && watts < totalPower) {
                psuSelect.value = ''; // Reset selection if current option is not sufficient
            }
        }
    } else {
        disableComponent(psuSelect);
    }
    
    updatePrice();
}

function filterOptions(select, filterFn) {
    const options = select.getElementsByTagName('option');
    for (let option of options) {
        if (option.value === '') continue; // Skip placeholder option
        
        const shouldShow = filterFn(option);
        option.style.display = shouldShow ? '' : 'none';
        if (!shouldShow && option.selected) {
            select.value = ''; // Reset selection if current option is hidden
        }
    }
}

function filterGPUByGen(generation) {
    const gpuSelect = document.getElementById('gpu');
    const options = gpuSelect.getElementsByTagName('option');
    
    for (let option of options) {
        if (option.value === "") continue; // Skip the placeholder option
        
        const gen = option.getAttribute('data-gen');
        if (generation === 'all' || gen === generation) {
            option.style.display = '';
        } else {
            option.style.display = 'none';
        }
    }
}

// Dodaj style CSS dla kontrolek filtrowania
document.head.insertAdjacentHTML('beforeend', `
    <style>
        .filter-controls {
            margin-top: 10px;
            padding: 10px;
            background: var(--card-background);
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        
        .filter-controls label {
            margin-right: 10px;
            color: var(--text-color);
        }
        
        .filter-controls select {
            padding: 5px;
            border-radius: 4px;
            border: 1px solid var(--border-color);
        }
    </style>
`);

function validateForm() {
    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    let isValid = true;

    // Resetuj poprzednie błędy
    document.querySelectorAll('.form-group input').forEach(input => {
        input.classList.remove('error');
        const errorMessage = input.parentElement.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    });

    // Walidacja imienia i nazwiska
    if (!fullName) {
        showError('fullName', 'Full name is required');
        isValid = false;
    }

    // Walidacja emaila
    if (!email) {
        showError('email', 'Email address is required');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showError('email', 'Please enter a valid email address');
        isValid = false;
    }

    // Walidacja telefonu
    if (!phone) {
        showError('phone', 'Phone number is required');
        isValid = false;
    } else if (!isValidPhone(phone)) {
        showError('phone', 'Please enter a valid phone number');
        isValid = false;
    }

    return isValid;
}

function showError(inputId, message) {
    const input = document.getElementById(inputId);
    input.classList.add('error');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    input.parentElement.appendChild(errorDiv);
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
    return /^[\d\s+()-]{10,}$/.test(phone);
}

function submitAndReset() {
    // Sprawdź czy wybrano płytę główną
    const motherboard = document.getElementById('motherboard').value;
    if (!motherboard) {
        alert('Please select at least a motherboard before submitting!');
        return;
    }

    // Sprawdź formularz kontaktowy
    if (!validateForm()) {
        return;
    }

    // Pokaż powiadomienie o sukcesie
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">Build submitted successfully!</span>
            <span class="notification-close">&times;</span>
        </div>
    `;

    document.body.appendChild(notification);

    // Resetuj wszystkie selecty
    const selects = ['motherboard', 'cpu', 'ram', 'gpu', 'storage', 'psu', 'case'];
    selects.forEach(selectId => {
        const select = document.getElementById(selectId);
        select.value = '';
        if (selectId !== 'motherboard') {
            select.disabled = true;
        }
    });

    // Resetuj Build Summary
    const buildSummary = document.querySelector('.build-summary');
    buildSummary.innerHTML = `
        <h3>Build Summary</h3>
        <div class="submission-message">
            <p>Thank you for your build submission!</p>
            <p>Our technical team has received your configuration and will contact you within 24 hours.</p>
        </div>
    `;

    // Resetuj formularz kontaktowy
    document.getElementById('fullName').value = '';
    document.getElementById('email').value = '';
    document.getElementById('phone').value = '';

    // Resetuj total price
    document.querySelector('.total-price').textContent = 'Total Price: $0';

    // Wywołaj updateCompatibility aby przywrócić początkowy stan
    updateCompatibility();
}