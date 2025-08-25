document.addEventListener('DOMContentLoaded', function () {

    // 1. SUA Configuração do Particles.js para a seção Hero (MANTIDA)
    if (document.getElementById('particles-js')) {
        particlesJS('particles-js', {
            "particles": { "number": { "value": 110, "density": { "enable": true, "value_area": 900 } }, "color": { "value": "#ffffff" }, "shape": { "type": "circle", }, "opacity": { "value": 0.5, "random": false, }, "size": { "value": 3, "random": true, }, "line_linked": { "enable": true, "distance": 150, "color": "#ffffff", "opacity": 0.4, "width": 1 }, "move": { "enable": true, "speed": 3, "direction": "none", "random": false, "straight": false, "out_mode": "out", "bounce": false, } }, "interactivity": { "detect_on": "canvas", "events": { "onhover": { "enable": true, "mode": "repulse" }, "onclick": { "enable": true, "mode": "push" }, "resize": true }, "modes": { "repulse": { "distance": 90, "duration": 0.4 }, "push": { "particles_nb": 4 } } }, "retina_detect": true
        });
    }

    // 2. SEU Efeito Spotlight para a Seção de Público-Alvo (MANTIDO)
    const spotlightCards = document.querySelectorAll('.spotlight-card');
    spotlightCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
    
    // 3. Funcionalidade para o menu Hamburger (MELHORADA)
    // Combina sua lógica com atributos de acessibilidade (aria-expanded)
    const hamburger = document.querySelector('.hamburger');
    const menuContainer = document.querySelector('.menu-container');

    hamburger.addEventListener('click', function() {
        const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
        hamburger.setAttribute('aria-expanded', !isExpanded);
        menuContainer.classList.toggle('active');
    });

    // 4. NOVA Lógica para o dropdown "acordeão" no mobile
    const dropdownToggles = document.querySelectorAll('.has-megadropdown > a');
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            // Ativa o modo acordeão apenas em telas mobile (onde o menu-container está ativo)
            if (window.innerWidth <= 1200 && menuContainer.classList.contains('active')) {
                e.preventDefault(); // Impede a navegação do link para abrir/fechar o submenu
                
                // Fecha outros submenus abertos para funcionar como um acordeão
                dropdownToggles.forEach(otherToggle => {
                    if (otherToggle !== toggle) {
                        otherToggle.classList.remove('active');
                    }
                });
                
                toggle.classList.toggle('active');
            }
        });
    });

    // 5. NOVA Lógica para o FAQ
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        question.addEventListener('click', () => {
            const isExpanded = question.getAttribute('aria-expanded') === 'true';
            
            // Fecha todos os outros para manter apenas um aberto
            faqItems.forEach(otherItem => {
                if(otherItem !== item){
                    otherItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                    otherItem.querySelector('.faq-answer').style.maxHeight = null;
                }
            });

            // Abre ou fecha o item que foi clicado
            if (isExpanded) {
                question.setAttribute('aria-expanded', 'false');
                answer.style.maxHeight = null;
            } else {
                question.setAttribute('aria-expanded', 'true');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });
});