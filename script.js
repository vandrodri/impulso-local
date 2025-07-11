// =================================================================
// PARTE 1: CONFIGURAÇÃO E CONEXÃO COM O FIREBASE
// =================================================================

// COLE SEU OBJETO firebaseConfig COMPLETO E CORRETO AQUI
const firebaseConfig = {
  apiKey: "AIzaSyBi0MLw52Dk5mTDWDp_Zh_3M9LNVxCkUfA",
  authDomain: "impulso-local-app.firebaseapp.com",
  projectId: "impulso-local-app",
  storageBucket: "impulso-local-app.firebasestorage.app",
  messagingSenderId: "29137714970",
  appId: "1:29137714970:web:68b1f15b779b1e87b5f6a3",
  measurementId: "G-XWFZ18HB97"
};

// Inicializa o Firebase e cria referências para os serviços
try {
    const app = firebase.initializeApp(firebaseConfig);
    var auth = firebase.auth();
    var db = firebase.firestore();
    console.log("Firebase conectado com sucesso!");
} catch (e) {
    console.error("Erro ao inicializar o Firebase. Verifique seu objeto firebaseConfig.", e);
}


// =================================================================
// PARTE 2: LÓGICA DO APLICATIVO IMPULSO LOCAL
// =================================================================

document.addEventListener('DOMContentLoaded', () => {
    // COLE SUA CHAVE DO UNSPLASH AQUI
    const unsplashAccessKey = "e0Bb2UHLInYKGGOXmbp8vt_nIXoom5sXhu5341TwwwA
";

    // --- Seletores de Elementos (DOM) ---
    // App principal
    const postTypeSelect = document.getElementById('post-type');
    const postTemplateTextarea = document.getElementById('post-template');
    const copyButton = document.getElementById('copy-button');
    const ideiaTexto = document.getElementById('ideia-texto');
    const novaIdeiaButton = document.getElementById('nova-ideia-button');
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const imageResults = document.getElementById('image-results');
    const loadingMessage = document.getElementById('loading-message');
    const checklistItems = document.querySelectorAll('.checklist-item input[type="checkbox"]');

    // Autenticação
    const authModal = document.getElementById('auth-modal');
    const closeModalButton = document.getElementById('close-modal-button');
    const loginView = document.getElementById('login-view');
    const registerView = document.getElementById('register-view');
    const showRegisterLink = document.getElementById('show-register');
    const showLoginLink = document.getElementById('show-login');
    const loginButton = document.getElementById('login-button');
    const registerButton = document.getElementById('register-button');
    const loginEmailInput = document.getElementById('login-email');
    const loginPasswordInput = document.getElementById('login-password');
    const registerEmailInput = document.getElementById('register-email');
    const registerPasswordInput = document.getElementById('register-password');
    const authError = document.getElementById('auth-error');
    const userArea = document.getElementById('user-area');


    // --- LÓGICA DE AUTENTICAÇÃO ---

    function setupAuthListeners() {
        const openLoginBtn = document.getElementById('open-login-modal-button');
        if(openLoginBtn) openLoginBtn.addEventListener('click', () => authModal.style.display = 'flex');
        
        const logoutBtn = document.getElementById('logout-button');
        if(logoutBtn) logoutBtn.addEventListener('click', logout);
    }

    closeModalButton.addEventListener('click', () => authModal.style.display = 'none');
    window.addEventListener('click', (e) => {
        if (e.target === authModal) {
            authModal.style.display = 'none';
        }
    });

    showRegisterLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginView.style.display = 'none';
        registerView.style.display = 'block';
        authError.textContent = '';
    });

    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        registerView.style.display = 'none';
        loginView.style.display = 'block';
        authError.textContent = '';
    });

    registerButton.addEventListener('click', () => {
        const email = registerEmailInput.value;
        const password = registerPasswordInput.value;
        if (!email || !password) {
            authError.textContent = "Por favor, preencha todos os campos.";
            return;
        }
        auth.createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                authModal.style.display = 'none';
            })
            .catch((error) => {
                authError.textContent = traduzirErroFirebase(error.code);
            });
    });

    loginButton.addEventListener('click', () => {
        const email = loginEmailInput.value;
        const password = loginPasswordInput.value;
        if (!email || !password) {
            authError.textContent = "Por favor, preencha todos os campos.";
            return;
        }
        auth.signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                authModal.style.display = 'none';
            })
            .catch((error) => {
                authError.textContent = traduzirErroFirebase(error.code);
            });
    });

    function logout() {
        auth.signOut();
    }

    auth.onAuthStateChanged(user => {
        if (user) {
            userArea.innerHTML = `<button id="logout-button">Sair (${user.email.split('@')[0]})</button>`;
        } else {
            userArea.innerHTML = `<button id="open-login-modal-button">Login</button>`;
        }
        setupAuthListeners();
    });

    function traduzirErroFirebase(code) {
        switch (code) {
            case "auth/invalid-email": return "O formato do e-mail é inválido.";
            case "auth/weak-password": return "A senha precisa ter pelo menos 6 caracteres.";
            case "auth/email-already-in-use": return "Este e-mail já está cadastrado.";
            case "auth/user-not-found": case "auth/wrong-password": return "E-mail ou senha incorretos.";
            default: return "Ocorreu um erro. Tente novamente.";
        }
    }


    // --- LÓGICA DO APP (código antigo) ---
    const templates = {
        novidade: `📢 NOVIDADE NA ÁREA! 📢\n\nAcabamos de receber [Nome do Produto ou Serviço]! Perfeito para [Benefício Principal].\n\nVenha conferir de perto e seja um dos primeiros a experimentar.\n\n#SeuNegócio #Novidade #[SuaCidade]`,
        oferta: `💰 OFERTA IMPERDÍVEL! 💰\n\nSó nesta semana, garanta seu/sua [Nome do Produto] com [Desconto %] de desconto! De R$ [Preço Antigo] por apenas R$ [Preço Novo].\n\nNão perca essa chance! A oferta é válida até [Data Final da Oferta].\n\n#Promoção #Desconto #SeuNegócio`,
        evento: `📅 VOCÊ É NOSSO CONVIDADO ESPECIAL! 📅\n\nParticipe do nosso [Nome do Evento] no dia [Data do Evento], às [Horário]. Será um momento incrível com [Breve Descrição do que vai acontecer].\n\nMarque na sua agenda e venha celebrar conosco!\n\nEndereço: [Seu Endereço]\n\n#Evento #SeuNegócio #[SuaCidade]`,
        dica: `💡 DICA RÁPIDA DA SEMANA 💡\n\nVocê sabia que [Fato ou Dica Interessante sobre seu nicho]?\n\nIsso pode te ajudar a [Benefício da dica]. Quer saber mais? Deixe sua pergunta nos comentários!\n\n#DicaDaSemana #Curiosidade #SeuNegócio`
    };
    const ideias = ["Apresente um funcionário e conte uma curiosidade sobre ele.", "Mostre os bastidores da sua loja ou escritório.", "Qual foi o pedido mais inusitado que já recebeu?", "Crie um post de 'Verdade ou Mentira' sobre seu produto/serviço.", "Compartilhe um depoimento de um cliente satisfeito.", "Faça uma enquete: 'Qual desses dois produtos vocês preferem?'.", "Dê uma dica rápida que não seja sobre vender, mas que ajude seu cliente.", "Poste uma foto de um detalhe interessante do seu espaço de trabalho.", "Conte a história de como o seu negócio começou.", "Pergunte aos seus seguidores o que eles gostariam de ver em oferta."];
    function updateTemplate() { if(postTemplateTextarea) postTemplateTextarea.value = templates[postTypeSelect.value]; }
    function copyToClipboard() { postTemplateTextarea.select(); document.execCommand('copy'); copyButton.textContent = 'Copiado!'; setTimeout(() => { copyButton.textContent = 'Copiar Texto do Post'; }, 2000); }
    function gerarNovaIdeia() { if(ideiaTexto) ideiaTexto.textContent = ideias[Math.floor(Math.random() * ideias.length)]; }
    async function buscarImagens() {
        const query = searchInput.value;
        if (!query || !unsplashAccessKey || unsplashAccessKey === "SUA_CHAVE_UNSPLASH_AQUI") return;
        loadingMessage.style.display = 'block';
        imageResults.innerHTML = '';
        try {
            const response = await fetch(`https://api.unsplash.com/search/photos?query=${query}&per_page=12&client_id=${unsplashAccessKey}&lang=pt`);
            const data = await response.json();
            if (data.results.length === 0) { imageResults.innerHTML = "<p>Nenhuma imagem encontrada.</p>"; }
            else { data.results.forEach(photo => { const img = document.createElement('img'); img.src = photo.urls.small; img.alt = photo.alt_description; img.onclick = () => window.open(photo.links.html, '_blank'); imageResults.appendChild(img); }); }
        } catch (error) { imageResults.innerHTML = "<p>Ocorreu um erro ao buscar imagens.</p>"; }
        finally { loadingMessage.style.display = 'none'; }
    }
    function salvarProgressoChecklist() { if(!auth.currentUser) return; const progresso = {}; checklistItems.forEach(item => { progresso[item.id] = item.checked; }); localStorage.setItem(`progresso_${auth.currentUser.uid}`, JSON.stringify(progresso)); }
    function carregarProgressoChecklist() { if(!auth.currentUser) return; const progresso = JSON.parse(localStorage.getItem(`progresso_${auth.currentUser.uid}`)); if (progresso) { checklistItems.forEach(item => { item.checked = progresso[item.id] || false; }); } }
    
    // --- Event Listeners do App ---
    if(postTypeSelect) postTypeSelect.addEventListener('change', updateTemplate);
    if(copyButton) copyButton.addEventListener('click', copyToClipboard);
    if(novaIdeiaButton) novaIdeiaButton.addEventListener('click', gerarNovaIdeia);
    if(searchButton) searchButton.addEventListener('click', buscarImagens);
    if(searchInput) searchInput.addEventListener('keypress', e => e.key === 'Enter' && buscarImagens());
    if(checklistItems) checklistItems.forEach(item => item.addEventListener('change', salvarProgressoChecklist));

    // --- Ações Iniciais do App ---
    updateTemplate();
    gerarNovaIdeia();
});