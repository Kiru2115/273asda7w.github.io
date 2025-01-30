function toggleMenu() {
    const menu = document.getElementById('menu');
    menu.classList.toggle('visible');
    menu.classList.toggle('hidden');
}

// Zamykanie menu po kliknięciu w link
document.addEventListener('DOMContentLoaded', function() {
    // Obsługa płynnego przewijania
    document.querySelectorAll('.smooth-scroll').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            // Specjalna obsługa dla #top
            let targetPosition;
            if (targetId === '#top') {
                targetPosition = 0;
            } else {
                const targetElement = document.querySelector(targetId);
                if (!targetElement) return;
                targetPosition = targetElement.offsetTop - 60; // Odjęcie wysokości headera
            }

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });

            // Zamknij menu po kliknięciu w link
            toggleMenu();
        });
    });

    // Zamykanie menu po kliknięciu poza nim
    document.addEventListener('click', function(event) {
        const menu = document.getElementById('menu');
        const menuIcon = document.querySelector('.menu-icon');
        
        if (!menu.contains(event.target) && event.target !== menuIcon) {
            menu.classList.remove('visible');
            menu.classList.add('hidden');
        }
    });

    // Dodajemy nową obsługę kliknięcia dla menu
    const menuIcon = document.querySelector('.menu-icon');
    const menuImage = menuIcon.querySelector('img');
    
    menuIcon.addEventListener('click', toggleMenu);
    menuImage.addEventListener('click', function(e) {
        e.stopPropagation(); // Zatrzymujemy propagację
        toggleMenu();
    });
});
