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
    const postTypeSelect = document.getElementById('post-type');
    const postTemplateTextarea = document.getElementById('post-template');
    const copyButton = document.getElementById('copy-button');
    const savePostButton = document.getElementById('save-post-button'); // Botão de Salvar
    const ideiaTexto = document.getElementById('ideia-texto');
    const novaIdeiaButton = document.getElementById('nova-ideia-button');
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const imageResults = document.getElementById('image-results');
    const loadingMessage = document.getElementById('loading-message');
    const checklistItems = document.querySelectorAll('.checklist-item input[type="checkbox"]');
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
        if (openLoginBtn) openLoginBtn.addEventListener('click', () => authModal.style.display = 'flex');
        const logoutBtn = document.getElementById('logout-button');
        if (logoutBtn) logoutBtn.addEventListener('click', logout);
    }

    closeModalButton.addEventListener('click', () => authModal.style.display = 'none');
    window.addEventListener('click', (e) => e.target === authModal && (authModal.style.display = 'none'));
    showRegisterLink.addEventListener('click', (e) => { e.preventDefault(); loginView.style.display = 'none'; registerView.style.display = 'block'; authError.textContent = ''; });
    showLoginLink.addEventListener('click', (e) => { e.preventDefault(); registerView.style.display = 'none'; loginView.style.display = 'block'; authError.textContent = ''; });

    registerButton.addEventListener('click', () => {
        const [email, password] = [registerEmailInput.value, registerPasswordInput.value];
        if (!email || !password) { authError.textContent = "Por favor, preencha todos os campos."; return; }
        auth.createUserWithEmailAndPassword(email, password).then(() => authModal.style.display = 'none').catch(err => authError.textContent = traduzirErroFirebase(err.code));
    });

    loginButton.addEventListener('click', () => {
        const [email, password] = [loginEmailInput.value, loginPasswordInput.value];
        if (!email || !password) { authError.textContent = "Por favor, preencha todos os campos."; return; }
        auth.signInWithEmailAndPassword(email, password).then(() => authModal.style.display = 'none').catch(err => authError.textContent = traduzirErroFirebase(err.code));
    });

    function logout() { auth.signOut(); }

    auth.onAuthStateChanged(user => {
        if (user) {
            userArea.innerHTML = `<button id="logout-button">Sair (${user.email.split('@')[0]})</button>`;
            savePostButton.style.display = 'inline-block';
            carregarProgressoChecklist(user.uid);
        } else {
            userArea.innerHTML = `<button id="open-login-modal-button">Login</button>`;
            savePostButton.style.display = 'none';
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

    // --- LÓGICA PRINCIPAL DO APP ---
    const templates = { /* ... (dados dos templates) ... */ };
    const ideias = [ /* ... (dados das ideias) ... */ ];
    function updateTemplate() { if (postTemplateTextarea) postTemplateTextarea.value = templates[postTypeSelect.value]; }
    function copyToClipboard() { /* ... (código para copiar) ... */ }
    function gerarNovaIdeia() { /* ... (código para gerar ideia) ... */ }
    async function buscarImagens() { /* ... (código da busca de imagens) ... */ }

    function salvarPost() {
        const postContent = postTemplateTextarea.value;
        if (!postContent.trim()) { alert("Não há nada para salvar!"); return; }
        const user = auth.currentUser;
        if (user) {
            db.collection('users').doc(user.uid).collection('savedPosts').add({
                content: postContent,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            }).then(() => {
                savePostButton.textContent = 'Salvo!';
                setTimeout(() => { savePostButton.textContent = 'Salvar Post'; }, 2000);
            }).catch(error => console.error("Erro ao salvar post: ", error));
        }
    }

    function salvarProgressoChecklist(userId) {
        if (!userId) return;
        const progresso = {};
        checklistItems.forEach(item => { progresso[item.id] = item.checked; });
        localStorage.setItem(`progresso_${userId}`, JSON.stringify(progresso));
    }

    function carregarProgressoChecklist(userId) {
        if (!userId) return;
        const progresso = JSON.parse(localStorage.getItem(`progresso_${userId}`));
        if (progresso) { checklistItems.forEach(item => { item.checked = progresso[item.id] || false; }); }
    }

    // --- Event Listeners ---
    if (postTypeSelect) postTypeSelect.addEventListener('change', updateTemplate);
    if (copyButton) copyButton.addEventListener('click', copyToClipboard);
    if (savePostButton) savePostButton.addEventListener('click', salvarPost);
    if (novaIdeiaButton) novaIdeiaButton.addEventListener('click', gerarNovaIdeia);
    if (searchButton) searchButton.addEventListener('click', buscarImagens);
    if (searchInput) searchInput.addEventListener('keypress', e => e.key === 'Enter' && buscarImagens());
    checklistItems.forEach(item => item.addEventListener('change', () => auth.currentUser && salvarProgressoChecklist(auth.currentUser.uid)));

    // --- Ações Iniciais ---
    updateTemplate();
    gerarNovaIdeia();
});