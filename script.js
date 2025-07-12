// =================================================================
// PARTE 1: CONFIGURAÇÃO DO FIREBASE
// =================================================================

/*--- COLE AQUI DENTRO O SEU OBJETO firebaseConfig COMPLETO ---*/
const firebaseConfig = {
apiKey: "AIzaSyBi0MLw52Dk5mTDWDp_Zh_3M9LNVxCkUfA",
  authDomain: "impulso-local-app.firebaseapp.com",
  projectId: "impulso-local-app",
  storageBucket: "impulso-local-app.firebasestorage.app",
  messagingSenderId: "29137714970",
  appId: "1:29137714970:web:68b1f15b779b1e87b5f6a3",
  measurementId: "G-XWFZ18HB97"
};


// =================================================================
// PARTE 2: CHAVE DA API DO UNSPLASH
// =================================================================

/*--- COLE AQUI DENTRO, ENTRE AS ASPAS, A SUA CHAVE DO UNSPLASH ---*/
const unsplashAccessKey = "e0Bb2UHLInYKGGOXmbp8vt_nIXoom5sXhu5341TwwwA";


// =================================================================
// CÓDIGO DO APP (NÃO MEXER DAQUI PARA BAIXO)
// =================================================================

try {
    const app = firebase.initializeApp(firebaseConfig);
    var auth = firebase.auth();
    var db = firebase.firestore();
    console.log("Firebase conectado com sucesso!");
} catch (e) {
    console.error("ERRO GRAVE: O objeto firebaseConfig está incorreto ou faltando.", e);
}

document.addEventListener('DOMContentLoaded', () => {

    // --- Seletores de Elementos (DOM) ---
    const postTypeSelect = document.getElementById('post-type');
    const postTemplateTextarea = document.getElementById('post-template');
    const copyButton = document.getElementById('copy-button');
    const savePostButton = document.getElementById('save-post-button');
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
    const savedPostsSection = document.getElementById('saved-posts-section');
    const savedPostsList = document.getElementById('saved-posts-list');


    // --- LÓGICA DE AUTENTICAÇÃO E DADOS ---
    let unsubscribeSavedPosts = null; // Para parar de ouvir os posts quando o usuário sair

    auth.onAuthStateChanged(user => {
        if (user) {
            // Usuário está logado
            userArea.innerHTML = `<button id="logout-button">Sair (${user.email.split('@')[0]})</button>`;
            if(savePostButton) savePostButton.style.display = 'inline-block';
            if(savedPostsSection) savedPostsSection.style.display = 'block'; // Mostra a seção de posts salvos
            
            carregarProgressoChecklist(user.uid);
            escutarPostsSalvos(user.uid); // Começa a ouvir os posts salvos
        } else {
            // Usuário está deslogado
            userArea.innerHTML = `<button id="open-login-modal-button">Login</button>`;
            if(savePostButton) savePostButton.style.display = 'none';
            if(savedPostsSection) savedPostsSection.style.display = 'none'; // Esconde a seção

            if (unsubscribeSavedPosts) {
                unsubscribeSavedPosts(); // Para de ouvir para economizar recursos
            }
            savedPostsList.innerHTML = ''; // Limpa a lista
        }
        setupAuthListeners();
    });

    function escutarPostsSalvos(userId) {
        unsubscribeSavedPosts = db.collection('users').doc(userId).collection('savedPosts')
            .orderBy('createdAt', 'desc') // Ordena pelos mais recentes
            .onSnapshot(snapshot => {
                savedPostsList.innerHTML = ''; // Limpa a lista para redesenhar
                if (snapshot.empty) {
                    savedPostsList.innerHTML = '<p>Você ainda não salvou nenhum post. Use o botão "Salvar Post" acima!</p>';
                    return;
                }
                snapshot.forEach(doc => {
                    const post = doc.data();
                    const postElement = document.createElement('div');
                    postElement.className = 'saved-post-item';
                    postElement.innerHTML = `
                        <div class="saved-post-content">${post.content.replace(/\n/g, '<br>')}</div>
                        <div class="saved-post-actions">
                            <button class="use-post-button" data-content="${escape(post.content)}">Usar</button>
                            <button class="delete-post-button" data-id="${doc.id}">Apagar</button>
                        </div>
                    `;
                    savedPostsList.appendChild(postElement);
                });
            });
    }
    
    savedPostsList.addEventListener('click', (e) => {
        const target = e.target;
        const user = auth.currentUser;
        if (!user) return;

        if (target.classList.contains('use-post-button')) {
            postTemplateTextarea.value = unescape(target.dataset.content);
            window.scrollTo(0, 0); // Rola para o topo da página
        }
        if (target.classList.contains('delete-post-button')) {
            if (confirm("Tem certeza que deseja apagar este post?")) {
                const postId = target.dataset.id;
                db.collection('users').doc(user.uid).collection('savedPosts').doc(postId).delete();
            }
        }
    });


    // --- Funções de Autenticação ---
    function setupAuthListeners() {
        const openLoginBtn = document.getElementById('open-login-modal-button');
        if (openLoginBtn) openLoginBtn.addEventListener('click', () => authModal.style.display = 'flex');
        const logoutBtn = document.getElementById('logout-button');
        if (logoutBtn) logoutBtn.addEventListener('click', logout);
    }
    if(closeModalButton) closeModalButton.addEventListener('click', () => authModal.style.display = 'none');
    if(window) window.addEventListener('click', (e) => e.target === authModal && (authModal.style.display = 'none'));
    if(showRegisterLink) showRegisterLink.addEventListener('click', (e) => { e.preventDefault(); loginView.style.display = 'none'; registerView.style.display = 'block'; authError.textContent = ''; });
    if(showLoginLink) showLoginLink.addEventListener('click', (e) => { e.preventDefault(); registerView.style.display = 'none'; loginView.style.display = 'block'; authError.textContent = ''; });
    if(registerButton) registerButton.addEventListener('click', () => { /* ...código de registro... */ });
    if(loginButton) loginButton.addEventListener('click', () => { /* ...código de login... */ });
    function logout() { auth.signOut(); }
    function traduzirErroFirebase(code) { /* ...código de tradução de erros... */ }


    // --- Funções Principais do App ---
    const templates = { /* ... (dados dos templates) ... */ };
    const ideias = [ /* ... (dados das ideias) ... */ ];
    function updateTemplate() { /* ... (código para atualizar template) ... */ }
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

    function salvarProgressoChecklist(userId) { /* ... (código para salvar checklist) ... */ }
    function carregarProgressoChecklist(userId) { /* ... (código para carregar checklist) ... */ }


    // --- Event Listeners do App ---
    if (postTypeSelect) postTypeSelect.addEventListener('change', updateTemplate);
    if (copyButton) copyButton.addEventListener('click', copyToClipboard);
    if (savePostButton) savePostButton.addEventListener('click', salvarPost);
    if (novaIdeiaButton) novaIdeiaButton.addEventListener('click', gerarNovaIdeia);
    if (searchButton) searchButton.addEventListener('click', buscarImagens);
    if (searchInput) searchInput.addEventListener('keypress', e => e.key === 'Enter' && buscarImagens());
    if(checklistItems) checklistItems.forEach(item => item.addEventListener('change', () => auth.currentUser && salvarProgressoChecklist(auth.currentUser.uid)));

    // --- Ações Iniciais ---
    updateTemplate();
    gerarNovaIdeia();
});