// --- INICIALIZAÇÃO DO FIREBASE ---
// COLE AQUI O CÓDIGO firebaseConfig QUE VOCÊ COPIOU DO SITE DO FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyBi0MLw52Dk5mTDWDp_Zh_3M9LNVxCkUfA",
  authDomain: "impulso-local-app.firebaseapp.com",
  projectId: "impulso-local-app",
  storageBucket: "impulso-local-app.firebasestorage.app",
  messagingSenderId: "29137714970",
  appId: "1:29137714970:web:68b1f15b779b1e87b5f6a3",
  measurementId: "G-XWFZ18HB97"
};

  // ... suas chaves secretas aqui ...
};

// Inicializa o Firebase e cria referências para os serviços
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth(); // Para autenticação
const db = firebase.firestore(); // Para o banco de dados Firestore
console.log("Firebase conectado!"); // Mensagem para sabermos que funcionou

// --- Lógica do App Impulso Local (código que já tínhamos) ---

document.addEventListener('DOMContentLoaded', () => {
    // --- SUA CHAVE DE ACESSO UNPLASH ---
    const unsplashAccessKey = "e0Bb2UHLInYKGGOXmbp8vt_nIXoom5sXhu5341TwwwA"; // MANTENHA SUA CHAVE AQUI

    // --- Elementos do DOM ---
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

    // ... (O resto do código que já tínhamos continua aqui) ...
    const templates = {
        novidade: `📢 NOVIDADE NA ÁREA! 📢\n\nAcabamos de receber [Nome do Produto ou Serviço]! Perfeito para [Benefício Principal].\n\nVenha conferir de perto e seja um dos primeiros a experimentar.\n\n#SeuNegócio #Novidade #[SuaCidade]`,
        oferta: `💰 OFERTA IMPERDÍVEL! 💰\n\nSó nesta semana, garanta seu/sua [Nome do Produto] com [Desconto %] de desconto! De R$ [Preço Antigo] por apenas R$ [Preço Novo].\n\nNão perca essa chance! A oferta é válida até [Data Final da Oferta].\n\n#Promoção #Desconto #SeuNegócio`,
        evento: `📅 VOCÊ É NOSSO CONVIDADO ESPECIAL! 📅\n\nParticipe do nosso [Nome do Evento] no dia [Data do Evento], às [Horário]. Será um momento incrível com [Breve Descrição do que vai acontecer].\n\nMarque na sua agenda e venha celebrar conosco!\n\nEndereço: [Seu Endereço]\n\n#Evento #SeuNegócio #[SuaCidade]`,
        dica: `💡 DICA RÁPIDA DA SEMANA 💡\n\nVocê sabia que [Fato ou Dica Interessante sobre seu nicho]?\n\nIsso pode te ajudar a [Benefício da dica]. Quer saber mais? Deixe sua pergunta nos comentários!\n\n#DicaDaSemana #Curiosidade #SeuNegócio`
    };
    const ideias = ["Apresente um funcionário e conte uma curiosidade sobre ele.", "Mostre os bastidores da sua loja ou escritório.", "Qual foi o pedido mais inusitado que já recebeu?", "Crie um post de 'Verdade ou Mentira' sobre seu produto/serviço.", "Compartilhe um depoimento de um cliente satisfeito.", "Faça uma enquete: 'Qual desses dois produtos vocês preferem?'.", "Dê uma dica rápida que não seja sobre vender, mas que ajude seu cliente.", "Poste uma foto de um detalhe interessante do seu espaço de trabalho.", "Conte a história de como o seu negócio começou.", "Pergunte aos seus seguidores o que eles gostariam de ver em oferta."];
    function updateTemplate() { postTemplateTextarea.value = templates[postTypeSelect.value]; }
    function copyToClipboard() {
        postTemplateTextarea.select();
        document.execCommand('copy');
        copyButton.textContent = 'Copiado!';
        setTimeout(() => { copyButton.textContent = 'Copiar Texto do Post'; }, 2000);
    }
    function gerarNovaIdeia() { ideiaTexto.textContent = ideias[Math.floor(Math.random() * ideias.length)]; }
    async function buscarImagens() {
        const query = searchInput.value;
        if (!query) return;
        if (unsplashAccessKey === "SUA_CHAVE_UNSPLASH_AQUI") { imageResults.innerHTML = "<p>Adicione sua chave da API Unsplash no script.js</p>"; return; }
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
    function salvarProgressoChecklist() { const progresso = {}; checklistItems.forEach(item => { progresso[item.id] = item.checked; }); localStorage.setItem('progressoChecklistImpulsoLocal', JSON.stringify(progresso)); }
    function carregarProgressoChecklist() {
        const progresso = JSON.parse(localStorage.getItem('progressoChecklistImpulsoLocal'));
        if (progresso) { checklistItems.forEach(item => { item.checked = progresso[item.id] || false; }); }
    }
    postTypeSelect.addEventListener('change', updateTemplate);
    copyButton.addEventListener('click', copyToClipboard);
    novaIdeiaButton.addEventListener('click', gerarNovaIdeia);
    searchButton.addEventListener('click', buscarImagens);
    searchInput.addEventListener('keypress', e => e.key === 'Enter' && buscarImagens());
    checklistItems.forEach(item => item.addEventListener('change', salvarProgressoChecklist));
    updateTemplate();
    gerarNovaIdeia();
    carregarProgressoChecklist();
});