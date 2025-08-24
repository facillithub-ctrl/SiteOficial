document.addEventListener('DOMContentLoaded', () => {

    // --- 1. CONFIGURAÇÃO DO SUPABASE (CORRIGIDA) ---
    const SUPABASE_URL = 'https://fkyxxdcpgadztqgfxewz.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZreXh4Y2RwZ2FkenRxZ2Z4ZXd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2ODU5MTksImV4cCI6MjA3MDI2MTkxOX0.-jEi7L_nOxC5PvEztkVMb_T4ksjpDC_rKKAp76-7AC0';
    const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);


    // --- 2. LÓGICA DO FORMULÁRIO DE LOGIN ---
    const loginForm = document.getElementById('login-form');

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        // CORREÇÃO: Usando os IDs corretos do seu HTML ('login-email', 'login-password')
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        const submitButton = loginForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;
        submitButton.disabled = true;
        submitButton.innerHTML = '<span class="loading-spinner"></span> Entrando...';

        // --- ETAPA 1: Autenticar o usuário ---
        const { data: authData, error: authError } = await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (authError) {
            alert('E-mail ou senha inválidos. Tente novamente.');
            console.error('Erro no login:', authError.message);
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;
            return; // Interrompe a execução aqui
        }

        // --- ETAPA 2: Buscar o perfil e redirecionar ---
        if (authData.user) {
            const userId = authData.user.id;

            // Busca o 'role' na tabela 'profiles' usando o ID do usuário logado
            const { data: profileData, error: profileError } = await supabaseClient
                .from('profiles')
                .select('role')
                .eq('id', userId)
                .single(); // .single() para pegar apenas um resultado

            if (profileError) {
                alert('Login bem-sucedido, mas não foi possível carregar seu perfil. Contate o suporte.');
                console.error('Erro ao buscar perfil:', profileError.message);
                submitButton.disabled = false;
                submitButton.innerHTML = originalButtonText;
                return;
            }

            // Redirecionamento com base no 'role' encontrado
            const userRole = profileData.role;
            switch (userRole) {
                case 'student':
                    window.location.href = '/pages/dashaluno.html';
                    break;
                case 'teacher':
                    // Supondo que você terá um dashprofessor.html
                    window.location.href = 'dashprofessor.html';
                    break;
                case 'manager':
                    // Supondo que você terá um dashgestor.html
                    window.location.href = 'dashgestor.html';
                    break;
                default:
                    // Um fallback caso o 'role' não seja encontrado
                    alert('Seu perfil não tem um tipo definido. Contate o suporte.');
                    submitButton.disabled = false;
                    submitButton.innerHTML = originalButtonText;
            }
        }
    });
});