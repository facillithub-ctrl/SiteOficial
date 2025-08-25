document.addEventListener('DOMContentLoaded', function () {

    const header = document.querySelector('.site-header');
    const hamburger = document.querySelector('.hamburger');
    const menuContainer = document.querySelector('.menu-container');

    // --- 1. LÓGICA DO MENU HAMBURGER E DROPDOWNS (ESTILO ACORDEÃO) ---
    
    // Abrir e fechar o menu principal no mobile
    hamburger.addEventListener('click', function() {
        const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
        hamburger.setAttribute('aria-expanded', !isExpanded);
        menuContainer.classList.toggle('active');

        // Fecha todos os submenus (acordeões) ao fechar o menu principal
        if (!menuContainer.classList.contains('active')) {
            document.querySelectorAll('.has-megadropdown.active').forEach(item => {
                item.classList.remove('active');
            });
        }
    });

    // Lógica para abrir/fechar os dropdowns (acordeão) no mobile
    const dropdownToggles = document.querySelectorAll('.has-megadropdown > a');
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            // Só executa esta lógica se o menu hamburger estiver visível
            if (window.innerWidth <= 1200) {
                e.preventDefault(); // Impede que o link navegue

                const parentLi = toggle.parentElement; // O <li> que contém o link e o dropdown

                // Fecha outros acordeões abertos para que apenas um fique aberto de cada vez
                document.querySelectorAll('.has-megadropdown').forEach(otherLi => {
                    if (otherLi !== parentLi) {
                        otherLi.classList.remove('active');
                    }
                });
                
                // Abre ou fecha o acordeão clicado
                parentLi.classList.toggle('active');
            }
        });
    });

    // --- 2. HEADER DINÂMICO (MUDA DE COR AO ROLAR) ---
    // Esta função agora funciona para todos os tamanhos de tela baseada no scroll normal
    function handleHeaderScroll() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    window.addEventListener('scroll', handleHeaderScroll);
    handleHeaderScroll(); // Executa uma vez no carregamento da página

    // --- 3. MÓDULOS CLICÁVEIS (FLIP CARD) ---
    const moduleCards = document.querySelectorAll('.module-card');
    moduleCards.forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.closest('.module-cta')) return; // Não vira o card se clicar no link "Saber mais"
            
            // Fecha outros cards abertos
            moduleCards.forEach(otherCard => {
                if(otherCard !== card) {
                    otherCard.classList.remove('is-flipped');
                }
            });
            // Vira o card clicado
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
            // Fecha todos os outros itens
            faqItems.forEach(otherItem => {
                if(otherItem !== item){
                    otherItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                    otherItem.querySelector('.faq-answer').style.maxHeight = null;
                }
            });
            // Abre ou fecha o item clicado
            if (isExpanded) {
                question.setAttribute('aria-expanded', 'false');
                answer.style.maxHeight = null;
            } else {
                question.setAttribute('aria-expanded', 'true');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });

    // --- 6. ANIMAÇÃO DE PARTÍCULAS (SE EXISTIR) ---
    if (document.getElementById('particles-js')) {
        particlesJS('particles-js', {
            "particles": { "number": { "value": 110, "density": { "enable": true, "value_area": 900 } }, "color": { "value": "#ffffff" }, "shape": { "type": "circle", }, "opacity": { "value": 0.5, "random": false, }, "size": { "value": 3, "random": true, }, "line_linked": { "enable": true, "distance": 150, "color": "#ffffff", "opacity": 0.4, "width": 1 }, "move": { "enable": true, "speed": 3, "direction": "none", "random": false, "straight": false, "out_mode": "out", "bounce": false, } }, "interactivity": { "detect_on": "canvas", "events": { "onhover": { "enable": true, "mode": "repulse" }, "onclick": { "enable": true, "mode": "push" }, "resize": true }, "modes": { "repulse": { "distance": 90, "duration": 0.4 }, "push": { "particles_nb": 4 } } }, "retina_detect": true
        });
    }

});