document.addEventListener('DOMContentLoaded', () => {
    // --- 1. CONFIGURAÇÃO DO SUPABASE ---
    const SUPABASE_URL = 'https://fkyxxdcpgadztqgfxewz.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZreXh4Y2RwZ2FkenRxZ2Z4ZXd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2ODU5MTksImV4cCI6MjA3MDI2MTkxOX0.-jEi7L_nOxC5PvEztkVMb_T4ksjpDC_rKKAp76-7AC0';
    const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

    // --- 2. SELEÇÃO DE ELEMENTOS E ESTADO ---
    const form = document.getElementById('facilit-hub-login-form');
    const progressBar = document.querySelector('.progress-bar');
    const loginButton = document.getElementById('login-button');
    let currentStepId = 'login-credentials';

    // --- 3. FUNÇÕES DE NAVEGAÇÃO E LÓGICA ---
    function adjustFormHeight() {
        const activeStep = form.querySelector('.form-step.active');
        if (activeStep) {
            requestAnimationFrame(() => {
                form.style.height = `${activeStep.offsetHeight}px`;
            });
        }
    }

    function goToStep(stepId) {
        const currentStepElement = form.querySelector('.form-step.active');
        const nextStepElement = form.querySelector(`[data-step="${stepId}"]`);
        
        if (currentStepElement) currentStepElement.classList.remove('active');
        
        if (nextStepElement) {
            nextStepElement.classList.add('active');
            currentStepId = stepId;
            updateProgressBar();
            setTimeout(adjustFormHeight, 50);
        }
    }

    function updateProgressBar() {
        const stepOrder = ['login-credentials', 'final'];
        let currentFlowIndex = stepOrder.indexOf(currentStepId);
        const progress = currentFlowIndex >= 0 ? ((currentFlowIndex + 1) / stepOrder.length) * 100 : 0;
        if (progressBar) progressBar.style.width = `${progress}%`;
    }

    // --- 4. LÓGICA DO FORMULÁRIO DE LOGIN ---
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        const originalButtonText = loginButton.innerHTML;
        loginButton.disabled = true;
        loginButton.innerHTML = 'Verificando...';

        // ETAPA 1: Autenticar o usuário
        const { data: authData, error: authError } = await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (authError) {
            alert('E-mail ou senha inválidos. Tente novamente.');
            console.error('Erro no login:', authError.message);
            loginButton.disabled = false;
            loginButton.innerHTML = originalButtonText;
            return;
        }

        // ETAPA 2: Animação e busca do perfil para redirecionamento
        if (authData.user) {
            goToStep('final');

            const userId = authData.user.id;
            const { data: profileData, error: profileError } = await supabaseClient
                .from('profiles')
                .select('role')
                .eq('id', userId)
                .single();

            if (profileError) {
                alert('Login bem-sucedido, mas não foi possível carregar seu perfil. Contate o suporte.');
                console.error('Erro ao buscar perfil:', profileError.message);
                // Mesmo com erro, o usuário está logado, então pode ser melhor redirecionar para uma página padrão
                setTimeout(() => { window.location.href = '/'; }, 2000);
                return;
            }
            
            // Redirecionamento com base no 'role'
            setTimeout(() => {
                const userRole = profileData.role;
                switch (userRole) {
                    case 'student':
                        window.location.href = '/pages/dashaluno.html';
                        break;
                    case 'teacher':
                        window.location.href = '/pages/dashprofessor.html';
                        break;
                    case 'manager':
                        window.location.href = '/pages/dashgestor.html';
                        break;
                    default:
                        alert('Seu perfil não tem um tipo definido. Contate o suporte.');
                        window.location.href = '/'; // Fallback
                }
            }, 2000); // Atraso para mostrar a mensagem de sucesso
        }
    });

    // --- 5. INICIALIZAÇÃO ---
    // Garante que o progresso inicial e a altura do formulário estejam corretos
    goToStep(currentStepId);
});