document.addEventListener('DOMContentLoaded', () => {
    // A variável 'supabase' vem do arquivo config.js

    // --- LÓGICA PARA A PÁGINA DE REGISTRO ---
    const registerForm = document.getElementById('facilit-hub-form');
    if (registerForm) {
        handleRegisterForm(registerForm);
    }

    // --- LÓGICA PARA A PÁGINA DE LOGIN ---
    const loginForm = document.getElementById('facilit-hub-login-form');
    if (loginForm) {
        handleLoginForm(loginForm);
    }
});


// =================================================================================
// FUNÇÕES DE LÓGICA PARA O FORMULÁRIO DE REGISTRO
// =================================================================================
function handleRegisterForm(form) {
    const progressBar = form.querySelector('.progress-bar');
    const finalMessageEl = form.querySelector('#final-message');

    const state = {
        currentStepId: 'welcome',
        userProfile: null,
        history: ['welcome'],
        formData: {},
        currentQuestionIndex: 0,
        questions: {
            student: [
                { id: 'fullName', label: 'Nome completo', type: 'text', title: 'Primeiro, qual seu nome completo?' },
                { id: 'dob', label: 'Data de nascimento', type: 'date', title: 'Certo, [NAME]. E sua data de nascimento?' },
                { id: 'schooling', label: 'Escolaridade', type: 'select', options: ['Selecione...', 'Ensino Básico', 'Ensino Fundamental', 'Ensino Médio'], title: 'Perfeito. Qual sua escolaridade?' },
                { id: 'cep', label: 'CEP', type: 'tel', title: 'Onde você mora? Comece pelo CEP.' },
                { id: 'address', type: 'address', title: 'Confirme seu endereço' },
                { id: 'email', label: 'Seu melhor e-mail', type: 'email', title: 'Para criar sua conta, qual seu e-mail?' },
                { id: 'password', label: 'Crie uma senha', type: 'password', title: 'Ótimo! Agora, crie uma senha segura.' },
                { id: 'confirmPassword', label: 'Confirme sua senha', type: 'password', title: 'Excelente! Para garantir, confirme sua senha.' }
            ],
            teacher: [
                { id: 'fullName', label: 'Nome completo', type: 'text', title: 'Primeiro, qual é o seu nome completo?' },
                { id: 'dob', label: 'Data de nascimento', type: 'date', title: 'Certo, [NAME]. E sua data de nascimento?' },
                { id: 'schooling', label: 'Formação acadêmica', type: 'select', options: ['Selecione...', 'Licenciatura', 'Bacharelado', 'Pós-graduação', 'Mestrado', 'Doutorado'], title: 'Qual é a sua formação acadêmica?' },
                { id: 'subject', label: 'Disciplina principal', type: 'select', options: ['Selecione...', 'Matemática', 'Português', 'História', 'Geografia', 'Ciências', 'Artes', 'Educação Física', 'Outra'], title: 'Qual disciplina você leciona?' },
                { id: 'experience', label: 'Tempo de experiência', type: 'select', options: ['Selecione...', 'Menos de 1 ano', '1-3 anos', '4-6 anos', '7-10 anos', 'Mais de 10 anos'], title: 'Há quanto tempo você atua como professor?' },
                { id: 'cep', label: 'CEP', type: 'tel', title: 'Onde você trabalha ou mora? Comece pelo CEP.' },
                { id: 'address', type: 'address', title: 'Confirme seu endereço' },
                { id: 'email', label: 'Seu e-mail profissional', type: 'email', title: 'Para criar sua conta, qual seu e-mail?' },
                { id: 'password', label: 'Crie uma senha', type: 'password', title: 'Crie uma senha para sua conta.' },
                { id: 'confirmPassword', label: 'Confirme sua senha', type: 'password', title: 'Excelente! Para garantir, confirme sua senha.' }
            ],
            manager: [
                { id: 'fullName', label: 'Nome completo', type: 'text', title: 'Primeiro, qual é o seu nome completo?' },
                { id: 'dob', label: 'Data de nascimento', type: 'date', title: 'Certo, [NAME]. E sua data de nascimento?' },
                { id: 'education', label: 'Formação acadêmica', type: 'select', options: ['Selecione...', 'Licenciatura', 'Pedagogia', 'Administração Escolar', 'Pós-graduação', 'Mestrado', 'Doutorado'], title: 'Qual é a sua formação acadêmica?' },
                { id: 'schoolType', label: 'Tipo de instituição', type: 'select', options: ['Selecione...', 'Escola pública', 'Escola privada', 'Instituto técnico', 'Faculdade/Universidade', 'Outro'], title: 'Que tipo de instituição você administra?' },
                { id: 'experience', label: 'Tempo de experiência em gestão escolar', type: 'select', options: ['Selecione...', 'Menos de 1 ano', '1-3 anos', '4-6 anos', '7-10 anos', 'Mais de 10 anos'], title: 'Hà quanto tempo você atua como gestor escolar?' },
                { id: 'cep', label: 'CEP', type: 'tel', title: 'Qual o CEP da instituição?' },
                { id: 'address', type: 'address', title: 'Confirme o endereço da instituição' },
                { id: 'email', label: 'Seu e-mail de gestor', type: 'email', title: 'Para criar sua conta, qual seu e-mail?' },
                { id: 'password', label: 'Crie uma senha', type: 'password', title: 'Crie uma senha para sua conta.' },
                { id: 'confirmPassword', label: 'Confirme sua senha', type: 'password', title: 'Excelente! Para garantir, confirme sua senha.' }
            ]
        }
    };
    
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
            state.currentStepId = stepId;
            updateProgressBar();
            setTimeout(adjustFormHeight, 50);
        }
    }
    
    // ... (incluir todas as funções auxiliares do register.js original aqui)
    // goBack, updateProgressBar, displayCurrentQuestion, buildFieldHtml,
    // setupFieldListeners, validateCurrentQuestion, handleCepInput,
    // enableManualAddress, handleSchoolingChange, handleQuestionNext, finishAndSave

    // Event listener principal para o formulário de registro
    form.addEventListener('click', (e) => {
        const target = e.target.closest('button');
        if (!target) return;
        
        const navAction = target.dataset.navAction;
        
        if (target.id === 'finish-and-save-btn') {
            finishAndSave(target); // Certifique-se de que esta função está definida
            return;
        }
        
        const profile = target.dataset.profile;
        if (profile) {
            state.userProfile = profile;
            state.history.push('profile-select');
            state.currentQuestionIndex = 0;
            displayCurrentQuestion(); // Certifique-se de que esta função está definida
            return;
        }
        
        if (navAction === 'go') {
            const targetStep = target.dataset.targetStep;
            state.history.push(targetStep);
            goToStep(targetStep);
        } else if (navAction === 'back') {
            goBack(); // Certifique-se de que esta função está definida
        } else if (navAction === 'question-next') {
            handleQuestionNext(); // Certifique-se de que esta função está definida
        }
    });

    goToStep(state.currentStepId);
}


// =================================================================================
// FUNÇÕES DE LÓGICA PARA O FORMULÁRIO DE LOGIN
// =================================================================================
function handleLoginForm(form) {
    const progressBar = form.querySelector('.progress-bar');
    const loginButton = form.querySelector('#login-button');
    let currentStepId = 'login-credentials';

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

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = form.querySelector('#login-email').value;
        const password = form.querySelector('#login-password').value;

        const originalButtonText = loginButton.innerHTML;
        loginButton.disabled = true;
        loginButton.innerHTML = 'Verificando...';

        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
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

        if (authData.user) {
            goToStep('final');

            const userId = authData.user.id;
            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', userId)
                .single();

            if (profileError) {
                alert('Login bem-sucedido, mas não foi possível carregar seu perfil. Contate o suporte.');
                console.error('Erro ao buscar perfil:', profileError.message);
                setTimeout(() => { window.location.href = '../'; }, 2000);
                return;
            }
            
            setTimeout(() => {
                const userRole = profileData.role;
                switch (userRole) {
                    case 'student':
                        window.location.href = 'dashaluno.html'; // Ajustar para o caminho correto
                        break;
                    case 'teacher':
                        window.location.href = 'dashprofessor.html'; // Ajustar para o caminho correto
                        break;
                    case 'manager':
                        window.location.href = 'dashgestor.html'; // Ajustar para o caminho correto
                        break;
                    default:
                        alert('Seu perfil não tem um tipo definido. Contate o suporte.');
                        window.location.href = '../'; // Fallback
                }
            }, 2000);
        }
    });

    goToStep(currentStepId);
}