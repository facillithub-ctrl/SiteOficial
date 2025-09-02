document.addEventListener('DOMContentLoaded', () => {
    // Garante que o elemento 'particles-js' existe na página antes de tentar iniciar a animação
    if (document.getElementById('particles-js')) {
        particlesJS('particles-js', {
          "particles": {
            "number": {
              "value": 80, // Número de partículas
              "density": {
                "enable": true,
                "value_area": 800
              }
            },
            "color": {
              "value": "#ffffff" // Cor das partículas e linhas para contrastar com o fundo azul
            },
            "shape": {
              "type": "circle"
            },
            "opacity": {
              "value": 0.5,
              "random": false
            },
            "size": {
              "value": 3,
              "random": true
            },
            "line_linked": {
              "enable": true,
              "distance": 150,
              "color": "#ffffff", // Cor das linhas
              "opacity": 0.4,
              "width": 1
            },
            "move": {
              "enable": true,
              "speed": 2,
              "direction": "none",
              "out_mode": "out"
            }
          },
          "interactivity": {
            "detect_on": "canvas",
            "events": {
              "onhover": {
                "enable": true,
                "mode": "repulse"
              },
              "onclick": {
                "enable": true,
                "mode": "push"
              },
              "resize": true
            },
            "modes": {
              "repulse": {
                "distance": 100,
                "duration": 0.4
              },
              "push": {
                "particles_nb": 4
              }
            }
          },
          "retina_detect": true
        });
    }
});