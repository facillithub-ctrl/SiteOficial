document.addEventListener('DOMContentLoaded', () => {

    // =========================================================================
    // 1. SELEÇÃO DE ELEMENTOS GLOBAIS
    // =========================================================================
    const container = document.querySelector('.fullpage-container');
    const sections = document.querySelectorAll('.fullpage-section');
    const menuLinks = document.querySelectorAll('.menu a');
    const heroCtaButton = document.querySelector('.hero-cta-button');
    const moduleCards = document.querySelectorAll('.module-card-list .card');
    const detailPanels = document.querySelectorAll('.module-detail-view .detail-panel');
    const defaultPanel = document.querySelector('.default-panel');
    const modulesContainer = document.querySelector('.modules-layout');
    const sparkleButtons = document.querySelectorAll('.sparkle-button');
    const hamburger = document.querySelector('.hamburger');
    const menu = document.querySelector('.menu');
    const spotlightCards = document.querySelectorAll('.spotlight-card');

    let currentSection = 0;
    let isScrolling = false;

    // =========================================================================
    // 2. DEFINIÇÃO DAS FUNÇÕES PRINCIPAIS
    // =========================================================================

    // --- Função para o Scroll de Tela Cheia ---
    function scrollToSection(index) {
        if (index >= 0 && index < sections.length) {
            currentSection = index;
            container.style.transform = `translateY(-${currentSection * 100}vh)`;
            menuLinks.forEach(link => link.classList.remove('active'));
            const activeLink = document.querySelector(`.menu a[data-index="${currentSection}"]`);
            if (activeLink) activeLink.classList.add('active');
        }
    }

    // --- Função para Lidar com o Evento de Roda do Mouse ---
    function handleScroll(event) {
        if (isScrolling) return;
        isScrolling = true;
        const direction = event.deltaY > 0 ? 1 : -1;
        scrollToSection(currentSection + direction);
        setTimeout(() => { isScrolling = false; }, 1200);
    }

    // --- Função para Ativar Módulos no Hover ---
    function activateModule(moduleName) {
        detailPanels.forEach(p => p.classList.remove('active'));
        moduleCards.forEach(c => c.classList.remove('active'));
        if (moduleName) {
            const activeCard = document.querySelector(`.card[data-module="${moduleName}"]`);
            const activePanel = document.getElementById(`detail-${moduleName}`);
            if(activeCard) activeCard.classList.add('active');
            if(activePanel) activePanel.classList.add('active');
        } else {
            if(defaultPanel) defaultPanel.classList.add('active');
        }
    }

    // =========================================================================
    // 3. ADIÇÃO DOS EVENT LISTENERS (OUVINTES DE EVENTOS)
    // =========================================================================

    // --- Evento de Roda do Mouse para o Scroll ---
    document.addEventListener('wheel', handleScroll, { passive: false });

    // --- Evento de Clique para os Links do Menu ---
    menuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const index = parseInt(link.dataset.index, 10);
            scrollToSection(index);
        });
    });

    // --- Evento de Clique para o Botão "Explore o Ecossistema" ---
    if (heroCtaButton) {
        heroCtaButton.addEventListener('click', (e) => {
            e.preventDefault();
            scrollToSection(2); // Vai para a seção de Módulos (índice 2)
        });
    }

    // --- Eventos de Hover para os Módulos ---
    moduleCards.forEach(card => {
        card.addEventListener('mouseover', () => {
            const moduleName = card.dataset.module;
            activateModule(moduleName);
        });
    });
    if (modulesContainer) {
        modulesContainer.addEventListener('mouseleave', () => {
            activateModule(null);
        });
    }

    // --- Evento de Clique para os Botões Sparkle ---
    sparkleButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const parentPanel = e.currentTarget.closest('.detail-panel');
            if (parentPanel) {
                const panelId = parentPanel.id;
                const moduleName = panelId.replace('detail-', '');
                console.log(`Botão do módulo "${moduleName}" foi clicado!`);
                alert(`Ação para o módulo ${moduleName.toUpperCase()}!`);
            }
        });
    });

    // --- Evento de Clique para o Menu Hambúrguer ---
    if (hamburger && menu) {
        hamburger.addEventListener('click', () => {
            menu.classList.toggle('active');
        });
    }

    // --- Evento de Movimento do Mouse para o Efeito Spotlight ---
    spotlightCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // =========================================================================
    // 4. INICIALIZAÇÃO DE BIBLIOTECAS EXTERNAS
    // =========================================================================
    
    // --- CONFIGURAÇÃO DA ANIMAÇÃO DE PARTÍCULAS ---
if (document.getElementById('particles-js')) {
    particlesJS('particles-js', {
      "particles": {
        "number": { "value": 80, "density": { "enable": true, "value_area": 800 } },
        "color": { "value": "#ffffff" },
        "shape": { "type": "circle" },
        "opacity": { "value": 0.5, "random": false },
        "size": { "value": 3, "random": true },
        "line_linked": { "enable": true, "distance": 150, "color": "#ffffff", "opacity": 0.4, "width": 1 },
        "move": { "enable": true, "speed": 2, "direction": "none", "out_mode": "out" }
      },
      "interactivity": {
        "detect_on": "canvas",
        "events": {
          "onhover": { "enable": true, "mode": "repulse" },
          "onclick": { "enable": true, "mode": "push" },
          "resize": true
        },
        "modes": {
          "repulse": { "distance": 200, "duration": 0.4 },
          "push": { "particles_nb": 4 }
        }
      },
      "retina_detect": true
    });
}
});