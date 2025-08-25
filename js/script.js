document.addEventListener('DOMContentLoaded', function () {

    const header = document.querySelector('.site-header');
    const hamburger = document.querySelector('.hamburger');
    const menuContainer = document.querySelector('.menu-container');

    // --- 1. LÓGICA DO MENU HAMBURGER E DROPDOWNS ---
    
    hamburger.addEventListener('click', function() {
        const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
        hamburger.setAttribute('aria-expanded', !isExpanded);
        menuContainer.classList.toggle('active');

        // ADIÇÃO: Trava e destrava o scroll da página principal
        document.body.classList.toggle('noscroll');

        // Fecha submenus ao fechar o menu principal
        if (!menuContainer.classList.contains('active')) {
            document.querySelectorAll('.has-megadropdown.active').forEach(item => {
                item.classList.remove('active');
            });
        }
    });

    // Lógica para o acordeão no mobile
    const dropdownToggles = document.querySelectorAll('.has-megadropdown > a');
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            if (window.innerWidth <= 1200) {
                e.preventDefault(); 
                const parentLi = toggle.parentElement;
                
                // Fecha outros acordeões abertos
                document.querySelectorAll('.has-megadropdown').forEach(otherLi => {
                    if (otherLi !== parentLi) {
                        otherLi.classList.remove('active');
                    }
                });
                parentLi.classList.toggle('active');
            }
        });
    });

    // --- 2. HEADER DINÂMICO (MUDA DE COR AO ROLAR) ---
    function handleHeaderScroll() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    window.addEventListener('scroll', handleHeaderScroll);
    handleHeaderScroll();

    // --- 3. MÓDULOS CLICÁVEIS (FLIP CARD) ---
    const moduleCards = document.querySelectorAll('.module-card');
    moduleCards.forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.closest('.module-cta')) return;
            moduleCards.forEach(otherCard => {
                if(otherCard !== card) otherCard.classList.remove('is-flipped');
            });
            card.classList.toggle('is-flipped');
        });
    });

    // --- 4. CARROSSEL DE DEPOIMENTOS EM LOOP ---
    const carousel = document.querySelector('.testimonial-carousel');
    if(carousel){
        const cards = carousel.querySelectorAll('.testimonial-card');
        cards.forEach(card => {
            const clone = card.cloneNode(true);
            carousel.appendChild(clone);
        });
    }

    // --- 5. LÓGICA DO FAQ (ACORDEÃO) ---
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        question.addEventListener('click', () => {
            const isExpanded = question.getAttribute('aria-expanded') === 'true';
            faqItems.forEach(otherItem => {
                if(otherItem !== item){
                    otherItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                    otherItem.querySelector('.faq-answer').style.maxHeight = null;
                }
            });
            if (isExpanded) {
                question.setAttribute('aria-expanded', 'false');
                answer.style.maxHeight = null;
            } else {
                question.setAttribute('aria-expanded', 'true');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });

    // --- 6. ANIMAÇÃO DE PARTÍCULAS ---
    if (document.getElementById('particles-js')) {
        particlesJS('particles-js', {
            "particles": { "number": { "value": 110, "density": { "enable": true, "value_area": 900 } }, "color": { "value": "#ffffff" }, "shape": { "type": "circle", }, "opacity": { "value": 0.5, "random": false, }, "size": { "value": 3, "random": true, }, "line_linked": { "enable": true, "distance": 150, "color": "#ffffff", "opacity": 0.4, "width": 1 }, "move": { "enable": true, "speed": 3, "direction": "none", "random": false, "straight": false, "out_mode": "out", "bounce": false, } }, "interactivity": { "detect_on": "canvas", "events": { "onhover": { "enable": true, "mode": "repulse" }, "onclick": { "enable": true, "mode": "push" }, "resize": true }, "modes": { "repulse": { "distance": 90, "duration": 0.4 }, "push": { "particles_nb": 4 } } }, "retina_detect": true
        });
    }

});