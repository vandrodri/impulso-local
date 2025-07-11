// Lógica do Gerador de Posts e Banco de Ideias - por Gemini

document.addEventListener('DOMContentLoaded', () => {
    // --- Elementos do Gerador de Posts ---
    const postTypeSelect = document.getElementById('post-type');
    const postTemplateTextarea = document.getElementById('post-template');
    const copyButton = document.getElementById('copy-button');

    // --- Elementos do Banco de Ideias ---
    const ideiaTexto = document.getElementById('ideia-texto');
    const novaIdeiaButton = document.getElementById('nova-ideia-button');

    // --- Nossos Dados ---
    const templates = {
        novidade: `📢 NOVIDADE NA ÁREA! 📢\n\nAcabamos de receber [Nome do Produto ou Serviço]! Perfeito para [Benefício Principal].\n\nVenha conferir de perto e seja um dos primeiros a experimentar.\n\n#SeuNegócio #Novidade #[SuaCidade]`,
        oferta: `💰 OFERTA IMPERDÍVEL! 💰\n\nSó nesta semana, garanta seu/sua [Nome do Produto] com [Desconto %] de desconto! De R$ [Preço Antigo] por apenas R$ [Preço Novo].\n\nNão perca essa chance! A oferta é válida até [Data Final da Oferta].\n\n#Promoção #Desconto #SeuNegócio`,
        evento: `📅 VOCÊ É NOSSO CONVIDADO ESPECIAL! 📅\n\nParticipe do nosso [Nome do Evento] no dia [Data do Evento], às [Horário]. Será um momento incrível com [Breve Descrição do que vai acontecer].\n\nMarque na sua agenda e venha celebrar conosco!\n\nEndereço: [Seu Endereço]\n\n#Evento #SeuNegócio #[SuaCidade]`,
        dica: `💡 DICA RÁPIDA DA SEMANA 💡\n\nVocê sabia que [Fato ou Dica Interessante sobre seu nicho]?\n\nIsso pode te ajudar a [Benefício da dica]. Quer saber mais? Deixe sua pergunta nos comentários!\n\n#DicaDaSemana #Curiosidade #SeuNegócio`
    };

    const ideias = [
        "Apresente um funcionário e conte uma curiosidade sobre ele.",
        "Mostre os bastidores da sua loja ou escritório.",
        "Qual foi o pedido mais inusitado que já recebeu?",
        "Crie um post de 'Verdade ou Mentira' sobre seu produto/serviço.",
        "Compartilhe um depoimento de um cliente satisfeito.",
        "Faça uma enquete: 'Qual desses dois produtos vocês preferem?'.",
        "Dê uma dica rápida que não seja sobre vender, mas que ajude seu cliente.",
        "Poste uma foto de um detalhe interessante do seu espaço de trabalho.",
        "Conte a história de como o seu negócio começou.",
        "Pergunte aos seus seguidores o que eles gostariam de ver em oferta."
    ];

    // --- Funções ---

    function updateTemplate() {
        const selectedType = postTypeSelect.value;
        postTemplateTextarea.value = templates[selectedType];
    }

    function copyToClipboard() {
        postTemplateTextarea.select();
        document.execCommand('copy');
        
        copyButton.textContent = 'Copiado!';
        setTimeout(() => {
            copyButton.textContent = 'Copiar Texto do Post';
        }, 2000);
    }

    function gerarNovaIdeia() {
        const randomIndex = Math.floor(Math.random() * ideias.length);
        const ideiaSorteada = ideias[randomIndex];
        ideiaTexto.textContent = ideiaSorteada;
    }

    // --- Event Listeners (Onde a mágica acontece) ---

    postTypeSelect.addEventListener('change', updateTemplate);
    copyButton.addEventListener('click', copyToClipboard);
    novaIdeiaButton.addEventListener('click', gerarNovaIdeia);

    // --- Ações Iniciais ---
    updateTemplate(); // Carrega o primeiro template ao abrir a página
    gerarNovaIdeia(); // Já começa com uma ideia inspiradora
});