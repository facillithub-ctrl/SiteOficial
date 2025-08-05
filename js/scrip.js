document.addEventListener('DOMContentLoaded', () => {

    // --- 1. EFEITO DO CABEÇALHO E BARRA DE PROGRESSO ---
    const header = document.querySelector('.main-header');
    const progressBar = document.querySelector('.scroll-progress-bar');

    window.addEventListener('scroll', () => {
        // Efeito do cabeçalho
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Lógica da barra de progresso
        const scrollTop = document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollProgress = (scrollTop / scrollHeight) * 100;
        progressBar.style.width = `${scrollProgress}%`;
    });

    // --- 2. EFEITO PARALLAX NO HERO COM O MOUSE ---
    const heroSection = document.querySelector('.hero-section');
    const parallaxItems = document.querySelectorAll('.parallax-item');

    heroSection.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const x = (clientX - window.innerWidth / 2) / 50;
        const y = (clientY - window.innerHeight / 2) / 50;

        parallaxItems.forEach(item => {
            const speed = item.dataset.speed;
            item.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
        });
    });
    
    // --- 3. LÓGICA DO SISTEMA DE ABAS (TABS) ---
    const tabContainer = document.querySelector('.tabs-container');
    if (tabContainer) {
        // ... (a lógica das abas permanece a mesma da resposta anterior)
    }

    // --- 4. ANIMAÇÕES DE REVELAÇÃO (COM CONTADOR DE NÚMEROS) ---
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // Lógica para o contador de números
                const counters = entry.target.querySelectorAll('.counter');
                counters.forEach(counter => {
                    const target = +counter.getAttribute('data-target');
                    let current = 0;
                    const increment = target / 100; // Define a velocidade da contagem

                    const updateCounter = () => {
                        current += increment;
                        if (current < target) {
                            counter.innerText = Math.ceil(current).toLocaleString('pt-BR');
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.innerText = target.toLocaleString('pt-BR');
                        }
                    };
                    updateCounter();
                });

                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));
    
    // --- 5. ANIMAÇÃO DE ENTRADA DO TEXTO DO HERO ---
    const revealTextElements = document.querySelectorAll('.reveal-text');
    revealTextElements.forEach(el => {
        const delay = el.dataset.delay || '0';
        el.style.setProperty('--delay', `${delay}s`);
    });
});