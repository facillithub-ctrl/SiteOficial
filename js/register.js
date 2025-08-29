// js regi.js - VERSÃO FINAL E COMPLETA
document.addEventListener('DOMContentLoaded', () => {
    // 1. CONFIGURAÇÃO DO SUPABASE
    const SUPABASE_URL = 'https://fkyxxcdpgadztqgfxewz.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZreXh4Y2RwZ2FkenRxZ2Z4ZXd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2ODU5MTksImV4cCI6MjA3MDI2MTkxOX0.-jEi7L_nOxC5PvEztkVMb_T4ksjpDC_rKKAp76-7AC0';
    const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

    // 2. SELEÇÃO DE ELEMENTOS E ESTADO INICIAL
    const form = document.getElementById('facilit-hub-form');
    const progressBar = document.querySelector('.progress-bar');
    const finalMessageEl = document.getElementById('final-message');

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

    // 3. FUNÇÕES DE NAVEGAÇÃO E LÓGICA
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

    function goBack() {
        if (state.history.length > 1) {
            state.history.pop();
            const previousStepId = state.history[state.history.length - 1];
            
            if (previousStepId.startsWith('question-')) {
                const questionIndex = parseInt(previousStepId.split('-')[1], 10);
                if (questionIndex < state.questions[state.userProfile].length) {
                    state.currentQuestionIndex = questionIndex;
                    displayCurrentQuestion(true);
                }
            } else {
                 goToStep(previousStepId);
            }
        }
    }

    function updateProgressBar() {
        const stepOrder = ['welcome', 'profile-select', 'dynamic-question-container', 'configure-profile', 'final'];
        let currentFlowIndex = stepOrder.indexOf(state.currentStepId);
        if (state.currentStepId.startsWith('question-')) {
            currentFlowIndex = stepOrder.indexOf('dynamic-question-container');
        }
        const progress = currentFlowIndex >= 0 ? ((currentFlowIndex) / (stepOrder.length - 2)) * 100 : 0;
        if(progressBar) progressBar.style.width = `${progress}%`;
    }

    function displayCurrentQuestion(isGoingBack = false) {
        const container = form.querySelector('[data-step="dynamic-question-container"]');
        const profileQuestions = state.questions[state.userProfile];
        if (state.currentQuestionIndex >= profileQuestions.length) {
            goToStep('configure-profile');
            if (!isGoingBack) state.history.push('configure-profile');
            return;
        }
        const question = profileQuestions[state.currentQuestionIndex];
        const userFirstName = state.formData.fullName ? state.formData.fullName.split(' ')[0] : '';
        const titleHtml = `<h2 class="step-title">${question.title.replace('[NAME]', userFirstName)}</h2>`;
        const fieldHtml = buildFieldHtml(question);
        container.innerHTML = `
            ${titleHtml}
            ${fieldHtml}
            <div class="loading-spinner" style="display: none;"></div>
            <div class="step-navigation">
                <button type="button" class="btn btn-secondary" data-nav-action="back">Voltar</button>
                <button type="button" class="btn btn-primary" data-nav-action="question-next" disabled>Avançar</button>
            </div>`;
        setupFieldListeners(question);
        goToStep('dynamic-question-container');
        const stepHistoryId = `question-${state.currentQuestionIndex}`;
        if (!isGoingBack && state.history[state.history.length - 1] !== stepHistoryId) {
            state.history.push(stepHistoryId);
        }
    }

    function buildFieldHtml(question) {
        switch (question.type) {
            case 'select':
                const optionsHtml = question.options.map(opt => `<option value="${opt}" ${opt === 'Selecione...' ? 'disabled selected' : ''}>${opt}</option>`).join('');
                return `<div class="custom-select-wrapper"><select id="${question.id}" name="${question.id}">${optionsHtml}</select></div>`;
            case 'address':
                const rua = state.formData.rua || '';
                const bairro = state.formData.bairro || '';
                return `
                    <div class="floating-label-group"><input type="text" id="rua" name="rua" placeholder=" " value="${rua}" readonly><label for="rua">Rua</label></div>
                    <div class="floating-label-group"><input type="text" id="numero" name="numero" placeholder=" "><label for="numero">Número</label></div>
                    <div class="floating-label-group"><input type="text" id="bairro" name="bairro" placeholder=" " value="${bairro}" readonly><label for="bairro">Bairro</label></div>
                    <div class="text-center"><button type="button" class="btn-link" id="manual-address-btn">Não sei o CEP / Preencher manualmente</button></div>`;
            default:
                return `<div class="floating-label-group"><input type="${question.type}" id="${question.id}" name="${question.id}" placeholder=" "><label for="${question.id}">${question.label}</label></div>`;
        }
    }

    function setupFieldListeners(question) {
        if (question.type === 'address') {
            document.getElementById('manual-address-btn').addEventListener('click', enableManualAddress);
            ['rua', 'numero', 'bairro'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.addEventListener('input', () => validateCurrentQuestion(question));
            });
            return;
        }
        const inputElement = document.getElementById(question.id);
        if (inputElement) {
            const eventType = (question.type === 'select' || question.id === 'schooling') ? 'change' : 'input';
            inputElement.addEventListener(eventType, () => validateCurrentQuestion(question));
            if (question.id === 'cep') {
                inputElement.addEventListener('input', handleCepInput);
            }
            if (question.id === 'schooling') {
                inputElement.addEventListener('change', handleSchoolingChange);
            }
        }
    }

    function validateCurrentQuestion(question) {
        const nextButton = form.querySelector('[data-nav-action="question-next"]');
        if (!nextButton) return;
        let isValid = false;
        if (question.type === 'address') {
            const rua = document.getElementById('rua').value;
            const numero = document.getElementById('numero').value;
            isValid = rua.trim() !== '' && numero.trim() !== '';
        } else {
            const input = document.getElementById(question.id);
            isValid = input && input.value && input.value.trim() !== '' && input.value !== 'Selecione...';
        }
        nextButton.disabled = !isValid;
    }
    
    async function handleCepInput(e) {
        const cep = e.target.value.replace(/\D/g, '');
        if (cep.length === 8) {
            const spinner = form.querySelector('.loading-spinner');
            if (spinner) spinner.style.display = 'block';
            try {
                const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                if (!response.ok) throw new Error('CEP não encontrado');
                const data = await response.json();
                if (data.erro) {
                    alert("CEP não encontrado. Por favor, tente novamente ou preencha manualmente.");
                    enableManualAddress();
                    return;
                }
                state.formData.rua = data.logradouro;
                state.formData.bairro = data.bairro;
                const currentQuestion = state.questions[state.userProfile][state.currentQuestionIndex];
                validateCurrentQuestion(currentQuestion);
                const nextButton = form.querySelector('[data-nav-action="question-next"]');
                if (nextButton && !nextButton.disabled) {
                    nextButton.click();
                }
            } catch (error) {
                console.error("Erro ao buscar CEP:", error);
                alert("Não foi possível buscar o CEP. Por favor, preencha manualmente.");
                enableManualAddress();
            } finally {
                if (spinner) spinner.style.display = 'none';
            }
        }
    }

    function enableManualAddress() {
        ['rua', 'bairro'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.readOnly = false;
        });
        document.getElementById('rua')?.focus();
    }

    function handleSchoolingChange(e) {
        const value = e.target.value;
        let questionsList = state.questions[state.userProfile];
        questionsList = questionsList.filter(q => q.id !== 'schoolYear');
        if (['Ensino Fundamental', 'Ensino Médio'].includes(value)) {
            const seriesQuestion = { id: 'schoolYear', label: 'Ano/Série', type: 'text', title: `Qual ano/série do ${value} você está cursando?` };
            questionsList.splice(state.currentQuestionIndex + 1, 0, seriesQuestion);
        }
        state.questions[state.userProfile] = questionsList;
        validateCurrentQuestion(state.questions[state.userProfile][state.currentQuestionIndex]);
    }

    function handleQuestionNext() {
        const question = state.questions[state.userProfile][state.currentQuestionIndex];
        const input = document.getElementById(question.id);
        if (input) {
            state.formData[question.id] = input.value;
        }
        state.currentQuestionIndex++;
        displayCurrentQuestion();
    }

    // 4. FUNÇÃO DE FINALIZAÇÃO (FINAL E CORRIGIDA)
    async function finishAndSave(button) {
        button.disabled = true;
        button.textContent = 'Criando conta e salvando...';

        const { email, password, confirmPassword, fullName, ...restOfData } = state.formData;

        if (password !== confirmPassword) {
            alert('As senhas não coincidem. Por favor, tente novamente.');
            button.disabled = false;
            button.textContent = 'Finalizar cadastro';
            return;
        }
        if (!email || !password) {
            alert('Email ou senha não foram preenchidos. Volte e preencha os dados da sua conta.');
            button.disabled = false;
            button.textContent = 'Finalizar cadastro';
            return;
        }

        const { data: authData, error: authError } = await supabaseClient.auth.signUp({
            email: email,
            password: password,
        });

        if (authError) {
            alert('Erro no cadastro: ' + authError.message);
            console.error('Erro de autenticação:', authError);
            button.disabled = false;
            button.textContent = 'Finalizar cadastro';
            return;
        }

        if (!authData.user) {
            alert('Ocorreu um problema inesperado no cadastro. Tente novamente.');
            button.disabled = false;
            button.textContent = 'Finalizar cadastro';
            return;
        }

        try {
            const profileData = {
                ...restOfData,
                full_name: fullName,
                role: state.userProfile,
            };

            const { error: profileError } = await supabaseClient
                .from('profiles')
                .update(profileData)
                .eq('id', authData.user.id);

            if (profileError) throw profileError;

            const userFirstName = fullName ? fullName.split(' ')[0] : 'Visitante';
            finalMessageEl.textContent = `Seja bem-vindo(a), ${userFirstName}! Por favor, verifique seu e-mail para confirmar a conta.`;
            goToStep('final');
            state.history.push('final');

        } catch (error) {
            console.error('Erro ao ATUALIZAR o perfil:', error);
            alert('Sua conta foi criada, mas ocorreu um erro ao salvar os detalhes do seu perfil: ' + error.message);
            button.disabled = false;
            button.textContent = 'Finalizar cadastro';
        }
    }

    // 5. EVENT LISTENER PRINCIPAL E INICIALIZAÇÃO
    form.addEventListener('click', (e) => {
        const target = e.target.closest('button');
        if (!target) return;
        
        const navAction = target.dataset.navAction;
        
        if (target.id === 'finish-and-save-btn') {
            finishAndSave(target);
            return;
        }
        
        const profile = target.dataset.profile;
        if (profile) {
            state.userProfile = profile;
            state.history.push('profile-select');
            state.currentQuestionIndex = 0;
            displayCurrentQuestion();
            return;
        }
        
        if (navAction === 'go') {
            const targetStep = target.dataset.targetStep;
            state.history.push(targetStep);
            goToStep(targetStep);
        } else if (navAction === 'back') {
            goBack();
        } else if (navAction === 'question-next') {
            handleQuestionNext();
        }
    });

    goToStep(state.currentStepId);
});
