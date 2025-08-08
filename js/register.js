document.addEventListener('DOMContentLoaded', () => {

    // --- 1. CONFIGURAÇÃO DO SUPABASE ---
    const SUPABASE_URL = 'https://ykpppgfczxixquxzhppy.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrcHBwZ2ZjenhpeHF1eHpocHB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MTU0NjksImV4cCI6MjA2OTk5MTQ2OX0.idijlrhmc-F01V5znb7BSwC-i3B-zOcNqDa6t8JN9mU';

    // CORREÇÃO AQUI: Acessamos o objeto global 'supabase' e criamos nosso cliente
    // com um nome diferente (_supabase) para evitar conflito.
    const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);


    // --- 2. SELEÇÃO DE ELEMENTOS E ESTADO INICIAL ---
    const form = document.getElementById('facilit-hub-form');
    const progressBar = document.querySelector('.progress-bar');
    const finalMessageEl = document.getElementById('final-message');

    const state = {
        currentStepId: 'welcome',
        userProfile: null,
        history: ['welcome'],
        formData: {},
        questions: {
            student: [
                { id: 'fullName', label: 'Nome completo', type: 'text', title: 'Primeiro, qual seu nome completo?' },
                { id: 'dob', label: 'Data de nascimento', type: 'date', title: 'Certo, [NAME]. E sua data de nascimento?' },
                { id: 'schooling', label: 'Escolaridade', type: 'select', options: ['Selecione...', 'Ensino Básico', 'Ensino Fundamental', 'Ensino Médio'], title: 'Perfeito. Qual sua escolaridade?' },
                { id: 'cep', label: 'CEP', type: 'tel', title: 'Onde você mora? Comece pelo CEP.' },
                { id: 'address', type: 'address', title: 'Confirme seu endereço' }
            ],
            teacher: [
                { id: 'fullName', label: 'Nome completo', type: 'text', title: 'Primeiro, qual é o seu nome completo?' },
                { id: 'dob', label: 'Data de nascimento', type: 'date', title: 'Certo, [NAME]. E sua data de nascimento?' },
                { id: 'schooling', label: 'Formação acadêmica', type: 'select', options: ['Selecione...', 'Licenciatura', 'Bacharelado', 'Pós-graduação', 'Mestrado', 'Doutorado'], title: 'Qual é a sua formação acadêmica?' },
                { id: 'subject', label: 'Disciplina principal', type: 'select', options: ['Selecione...', 'Matemática', 'Português', 'História', 'Geografia', 'Ciências', 'Artes', 'Educação Física', 'Outra'], title: 'Qual disciplina você leciona?' },
                { id: 'experience', label: 'Tempo de experiência', type: 'select', options: ['Selecione...', 'Menos de 1 ano', '1-3 anos', '4-6 anos', '7-10 anos', 'Mais de 10 anos'], title: 'Há quanto tempo você atua como professor?' },
                { id: 'cep', label: 'CEP', type: 'tel', title: 'Onde você trabalha ou mora? Comece pelo CEP.' },
                { id: 'address', type: 'address', title: 'Confirme seu endereço' }
            ],

            manager: [
                { id: 'fullName', label: 'Nome completo', type: 'text', title: 'Primeiro, qual é o seu nome completo?' },
                { id: 'dob', label: 'Data de nascimento', type: 'date', title: 'Certo, [NAME]. E sua data de nascimento?' },
                { id: 'education', label: 'Formação acadêmica', type: 'select', options: ['Selecione...', 'Licenciatura', 'Pedagogia', 'Administração Escolar', 'Pós-graduação', 'Mestrado', 'Doutorado'], title: 'Qual é a sua formação acadêmica?' },
                { id: 'schoolType', label: 'Tipo de instituição', type: 'select', options: ['Selecione...', 'Escola pública', 'Escola privada', 'Instituto técnico', 'Faculdade/Universidade', 'Outro'], title: 'Que tipo de instituição você administra?' },
                { id: 'experience', label: 'Tempo de experiência em gestão escolar', type: 'select', options: ['Selecione...', 'Menos de 1 ano', '1-3 anos', '4-6 anos', '7-10 anos', 'Mais de 10 anos'], title: 'Há quanto tempo você atua como gestor escolar?' },
                { id: 'cep', label: 'CEP', type: 'tel', title: 'Qual o CEP da instituição?' },
                { id: 'address', type: 'address', title: 'Confirme o endereço da instituição' }
            ],

        },
        currentQuestionIndex: 0
    };

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
                 state.currentQuestionIndex = parseInt(previousStepId.split('-')[1], 10);
                 displayCurrentQuestion(true);
            } else {
                 goToStep(previousStepId);
            }
        }
    }
    
    function updateProgressBar() {
        const stepOrder = ['welcome', 'profile-select', 'dynamic-question-container', 'create-account', 'configure-profile', 'final'];
        let currentFlowIndex = stepOrder.indexOf(state.currentStepId);
        
        if (state.currentStepId.startsWith('question-')) {
            currentFlowIndex = stepOrder.indexOf('dynamic-question-container');
        }

        const progress = currentFlowIndex >= 0 ? ((currentFlowIndex) / (stepOrder.length - 2)) * 100 : 0;
        progressBar.style.width = `${progress}%`;
    }

    function displayCurrentQuestion(isGoingBack = false) {
        const container = form.querySelector('[data-step="dynamic-question-container"]');
        const profileQuestions = state.questions[state.userProfile];
        const stepHistoryId = `question-${state.currentQuestionIndex}`;

        if (state.currentQuestionIndex >= profileQuestions.length) {
            const userFirstName = state.formData.fullName ? state.formData.fullName.split(' ')[0] : '';
            document.getElementById('account-title').textContent = `Tudo certo, ${userFirstName}! Agora vamos criar sua conta.`;
            goToStep('create-account');
            if(!isGoingBack) state.history.push('create-account');
            return;
        }

        const question = profileQuestions[state.currentQuestionIndex];
        const userFirstName = state.formData.fullName ? state.formData.fullName.split(' ')[0] : '';
        const titleHtml = `<h2 class="step-title">${question.title.replace('[NAME]', userFirstName)}</h2>`;
        const fieldHtml = buildFieldHtml(question);
        
        container.innerHTML = titleHtml + fieldHtml + 
             `<div class="loading-spinner"></div>
              <div class="step-navigation">
                <button type="button" class="btn btn-secondary" data-nav-action="back">Voltar</button>
                <button type="button" class="btn btn-primary" data-nav-action="question-next" disabled>Avançar</button>
              </div>`;
        
        setupFieldListeners(question);
        goToStep('dynamic-question-container');
        if (!isGoingBack && state.history[state.history.length -1] !== stepHistoryId) {
            state.history.push(stepHistoryId);
        }
    }

    function buildFieldHtml(question) {
        switch(question.type) {
            case 'select':
                const optionsHtml = question.options.map(opt => `<option value="${opt}" ${opt === 'Selecione...' ? 'disabled selected' : ''}>${opt}</option>`).join('');
                return `<div class="custom-select-wrapper"><select id="${question.id}" name="${question.id}">${optionsHtml}</select></div>`;
            case 'address':
                return `
                    <div class="floating-label-group"><input type="text" id="rua" name="rua" placeholder=" " readonly><label for="rua">Rua</label></div>
                    <div class="floating-label-group"><input type="text" id="numero" name="numero" placeholder=" "><label for="numero">Número</label></div>
                    <div class="floating-label-group"><input type="text" id="bairro" name="bairro" placeholder=" " readonly><label for="bairro">Bairro</label></div>
                    <div class="text-center"><button type="button" class="btn-link" id="manual-address-btn">Não sei o CEP / Preencher manualmente</button></div>
                `;
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
        if(inputElement) {
            inputElement.addEventListener('input', () => validateCurrentQuestion(question));
            if(question.id === 'cep') inputElement.addEventListener('input', handleCepInput);
            if(question.id === 'schooling') inputElement.addEventListener('change', handleSchoolingChange);
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
            isValid = input && input.value.trim() !== '' && input.value !== 'Selecione...';
        }
        
        nextButton.disabled = !isValid;
    }

    async function handleCepInput(e) {
        const cep = e.target.value.replace(/\D/g, '');
        if (cep.length === 8) {
            const spinner = form.querySelector('.loading-spinner');
            spinner.style.display = 'block';
            try {
                const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                if (!response.ok) throw new Error('CEP não encontrado');
                const data = await response.json();
                if(data.erro) {
                    alert("CEP não encontrado. Por favor, tente novamente ou preencha manualmente.");
                    enableManualAddress();
                    return;
                }
                
                ['rua', 'bairro'].forEach(id => {
                    const el = document.getElementById(id);
                    if (el) {
                         el.value = data[id === 'rua' ? 'logradouro' : 'bairro'];
                    }
                });
                document.getElementById('numero').focus();
            } catch (error) {
                console.error("Erro ao buscar CEP:", error);
                alert("Não foi possível buscar o CEP. Por favor, preencha manualmente.");
                enableManualAddress();
            } finally {
                spinner.style.display = 'none';
                validateCurrentQuestion(state.questions.student[state.currentQuestionIndex]);
            }
        }
    }

    function enableManualAddress() {
        ['rua', 'bairro'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.readOnly = false;
        });
        document.getElementById('rua').focus();
    }
    
    function handleSchoolingChange(e) {
        const value = e.target.value;
        const questionsList = state.questions[state.userProfile];
        const hasConditionalQuestion = questionsList.some(q => q.id === 'schoolYear');

        if (['Ensino Fundamental', 'Ensino Médio'].includes(value) && !hasConditionalQuestion) {
            const seriesQuestion = { id: 'schoolYear', label: 'Ano/Série', type: 'text', title: `Qual ano/série do ${value} você está cursando?` };
            questionsList.splice(state.currentQuestionIndex + 1, 0, seriesQuestion);
        } else if (!['Ensino Fundamental', 'Ensino Médio'].includes(value) && hasConditionalQuestion) {
            state.questions[state.userProfile] = questionsList.filter(q => q.id !== 'schoolYear');
        }
        validateCurrentQuestion(questionsList[state.currentQuestionIndex]);
    }

    function handleQuestionNext() {
        const question = state.questions[state.userProfile][state.currentQuestionIndex];
        const input = document.getElementById(question.id);
        if(input) state.formData[question.id] = input.value;
        
        state.currentQuestionIndex++;
        displayCurrentQuestion();
    }

    async function finishAndSave(button) {
        button.disabled = true;
        button.textContent = 'Salvando...';

        state.formData.nickname = document.getElementById('nickname')?.value || null;
        state.formData.pronoun = document.getElementById('pronoun')?.value || null;
        state.formData.username = document.getElementById('main-username')?.value || null;

        state.formData.rua = document.getElementById('rua')?.value || state.formData.rua;
        state.formData.numero = document.getElementById('numero')?.value || state.formData.numero;
        state.formData.bairro = document.getElementById('bairro')?.value || state.formData.bairro;

        const dataToInsert = {
            fullName: state.formData.fullName,
            dob: state.formData.dob,
            profile_type: state.userProfile,
            schooling: state.formData.schooling,
            schoolYear: state.formData.schoolYear || null,
            cep: state.formData.cep,
            address_street: state.formData.rua,
            address_number: state.formData.numero,
            address_neighborhood: state.formData.bairro,
            username: state.formData.username,
            nickname: state.formData.nickname,
            pronoun: state.formData.pronoun
        };
        
        try {
            // CORREÇÃO AQUI: Usando a variável corrigida _supabase
            const { data, error } = await _supabase.from('profiles').insert([dataToInsert]).select();

            if (error) throw error;
            
            const userFirstName = state.formData.fullName ? state.formData.fullName.split(' ')[0] : 'Visitante';
            finalMessageEl.textContent = `Seja bem-vindo(a), ${userFirstName}!`;
            goToStep('final');
            state.history.push('final');

        } catch (error) {
            alert(`Ocorreu um erro ao salvar seu cadastro: ${error.message}`);
            console.error('Erro no Supabase:', error);
            button.disabled = false;
            button.textContent = 'Finalizar cadastro';
        }
    }

    // --- EVENT LISTENER PRINCIPAL ---
    form.addEventListener('click', (e) => {
        const target = e.target;
        
        if (target.id === 'finish-and-save-btn') {
            finishAndSave(target);
            return;
        }

        const navAction = target.dataset.navAction;
        const targetStep = target.dataset.targetStep;
        const profile = target.dataset.profile;

        if (profile) {
            state.userProfile = profile;
            state.history.push('profile-select');
            state.currentQuestionIndex = 0;
            displayCurrentQuestion();   
        } else if (navAction === 'go') {
            state.history.push(targetStep);
            goToStep(targetStep);
        } else if (navAction === 'back') {
            goBack();
        } else if (navAction === 'question-next') {
            handleQuestionNext();
        }
    });

    // --- INICIALIZAÇÃO ---
    goToStep(state.currentStepId);
});