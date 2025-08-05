document.addEventListener('DOMContentLoaded', () => {
    // --- 1. CONFIGURAÇÃO DO SUPABASE ---
    // Use as mesmas chaves da sua página de cadastro
    const SUPABASE_URL = 'https://ykpppgfczxixquxzhppy.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrcHBwZ2ZjenhpeHF1eHpocHB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MTU0NjksImV4cCI6MjA2OTk5MTQ2OX0.idijlrhmc-F01V5znb7BSwC-i3B-zOcNqDa6t8JN9mU';

    const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

    // --- 2. SELEÇÃO DOS ELEMENTOS DO FORMULÁRIO ---
    const loginForm = document.getElementById('login-form');
    const emailInput = document.getElementById('login-email');
    const passwordInput = document.getElementById('login-password');
    const loginButton = document.getElementById('login-button');
    const errorMessage = document.getElementById('login-error-message');

    // --- 3. LÓGICA DE LOGIN ---
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Impede o envio padrão do formulário

        // Mostra feedback visual e desabilita o botão
        loginButton.disabled = true;
        loginButton.textContent = 'Entrando...';
        errorMessage.textContent = '';
        errorMessage.style.display = 'none';

        const email = emailInput.value;
        const password = passwordInput.value;

        try {
            // Tenta fazer o login com o Supabase Auth
            const { data, error } = await _supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });

            if (error) {
                // Se o Supabase retornar um erro, nós o lançamos para o bloco catch
                throw error;
            }

            // Se o login for bem-sucedido, data.user conterá as informações do usuário
            console.log('Login bem-sucedido!', data.user);
            
            // Redireciona para a página principal/dashboard após o sucesso
            // Crie um arquivo chamado 'dashboard.html' para ser a página de destino
            window.location.href = 'dashboard.html';

        } catch (error) {
            console.error('Erro no login:', error.message);
            // Mostra uma mensagem de erro amigável para o usuário
            errorMessage.textContent = 'E-mail ou senha inválidos. Tente novamente.';
            errorMessage.style.display = 'block';
            
            // Reabilita o botão para uma nova tentativa
            loginButton.disabled = false;
            loginButton.textContent = 'Entrar';
        }
    });
});