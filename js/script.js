document.addEventListener('DOMContentLoaded', function () {

    // --- 1. LÓGICA PARA SCROLL DE PÁGINA INTEIRA ---
    const container = document.getElementById('fullpage-container');
    const sections = document.querySelectorAll('.section');
    let currentSection = 0;
    let isScrolling = false;
    const scrollThreshold = 100; // ms de espera entre scrolls

    function scrollToSection(sectionIndex) {
        if (sectionIndex >= 0 && sectionIndex < sections.length) {
            container.style.transform = `translateY(-${sectionIndex * 100}vh)`;
            currentSection = sectionIndex;
        }
    }

    // Scroll com o mouse
    window.addEventListener('wheel', (e) => {
        if (window.innerWidth <= 1200) return;
        if (isScrolling) return;
        isScrolling = true;

        if (e.deltaY > 0) {
            scrollToSection(currentSection + 1);
        } else {
            scrollToSection(currentSection - 1);
        }

        setTimeout(() => { isScrolling = false; }, 1000 + scrollThreshold);
    });

    // Navegação via links âncora
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
             if (window.innerWidth > 1200 && href !== '#') {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetSection = document.getElementById(targetId);
                if(targetSection){
                    const targetIndex = Array.from(sections).indexOf(targetSection);
                    scrollToSection(targetIndex);
                }
            }
        });
    });

    // --- 2. HEADER DINÂMICO ---
    const header = document.querySelector('.site-header');
    
    const updateHeaderState = () => {
         if (currentSection > 0) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    
    container.addEventListener('transitionend', updateHeaderState);

    window.addEventListener('scroll', () => {
        if (window.innerWidth <= 1200) {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    });

    // --- 3. MÓDULOS CLICÁVEIS (FLIP CARD) ---
    const moduleCards = document.querySelectorAll('.module-card');
    moduleCards.forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.closest('.module-cta')) {
                return;
            }
            moduleCards.forEach(otherCard => {
                if(otherCard !== card) {
                    otherCard.classList.remove('is-flipped');
                }
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

    // --- 5. LÓGICA DO FAQ ---
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        question.addEventListener('click', () => {
            const isExpanded = question.getAttribute('aria-expanded') === 'true';
            
            // Fecha todos os outros itens para manter apenas um aberto
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

    // --- 6. FUNCIONALIDADES ANTERIORES ---
    if (document.getElementById('particles-js')) {
        particlesJS('particles-js', {
            "particles": { "number": { "value": 110, "density": { "enable": true, "value_area": 900 } }, "color": { "value": "#ffffff" }, "shape": { "type": "circle", }, "opacity": { "value": 0.5, "random": false, }, "size": { "value": 3, "random": true, }, "line_linked": { "enable": true, "distance": 150, "color": "#ffffff", "opacity": 0.4, "width": 1 }, "move": { "enable": true, "speed": 3, "direction": "none", "random": false, "straight": false, "out_mode": "out", "bounce": false, } }, "interactivity": { "detect_on": "canvas", "events": { "onhover": { "enable": true, "mode": "repulse" }, "onclick": { "enable": true, "mode": "push" }, "resize": true }, "modes": { "repulse": { "distance": 90, "duration": 0.4 }, "push": { "particles_nb": 4 } } }, "retina_detect": true
        });
    }

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

    const hamburger = document.querySelector('.hamburger');
    const menuContainer = document.querySelector('.menu-container');
    hamburger.addEventListener('click', function() {
        const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
        hamburger.setAttribute('aria-expanded', !isExpanded);
        menuContainer.classList.toggle('active');
    });

    const dropdownToggles = document.querySelectorAll('.has-megadropdown > a');
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            if (window.innerWidth <= 1200 && menuContainer.classList.contains('active')) {
                e.preventDefault();
                dropdownToggles.forEach(otherToggle => {
                    if (otherToggle !== toggle) {
                        otherToggle.classList.remove('active');
                    }
                });
                toggle.classList.toggle('active');
            }
        });
    });
});