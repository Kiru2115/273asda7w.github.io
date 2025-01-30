function updatePrice() {
    let total = 0;
    const services = ['hardware', 'software', 'maintenance', 'additional', 'priority'];
    
    services.forEach(service => {
        const select = document.getElementById(service);
        const value = parseInt(select.value) || 0;
        total += value;
    });
    
    document.getElementById('totalPrice').textContent = `$${total}`;
    updateServiceSummary();
}

function updateServiceSummary() {
    const summary = document.getElementById('serviceSummary');
    let html = '';
    
    const services = {
        'hardware': 'Hardware Issue',
        'software': 'Software Issue',
        'maintenance': 'Maintenance',
        'additional': 'Additional Service',
        'priority': 'Service Priority'
    };
    
    for (const [id, name] of Object.entries(services)) {
        const select = document.getElementById(id);
        const selectedOption = select.options[select.selectedIndex];
        if (selectedOption.value) {
            html += `<p><strong>${name}:</strong> ${selectedOption.text}</p>`;
        }
    }
    
    if (!html) {
        html = '<p>No services selected yet</p>';
    }
    
    summary.innerHTML = html;
}

function submitService() {
    const services = ['hardware', 'software', 'maintenance', 'additional'];
    let selectedServices = services.filter(service => 
        document.getElementById(service).value !== ''
    );
    
    if (selectedServices.length === 0) {
        alert('Please select at least one service');
        return;
    }
    
    alert('Thank you for choosing our service! We will contact you soon to confirm your repair appointment.');
}

// Initialize service summary on page load
document.addEventListener('DOMContentLoaded', updateServiceSummary); 