// Lógica do Gerador de Posts - por Gemini
document.addEventListener('DOMContentLoaded', () => {
    const postTypeSelect = document.getElementById('post-type');
    const postTemplateTextarea = document.getElementById('post-template');
    const copyButton = document.getElementById('copy-button');

    const templates = {
        novidade: `📢 NOVIDADE NA ÁREA! 📢\n\nAcabamos de receber [Nome do Produto ou Serviço]! Perfeito para [Benefício Principal].\n\nVenha conferir de perto e seja um dos primeiros a experimentar.\n\n#SeuNegócio #Novidade #[SuaCidade]`,
        oferta: `💰 OFERTA IMPERDÍVEL! 💰\n\nSó nesta semana, garanta seu/sua [Nome do Produto] com [Desconto %] de desconto! De R$ [Preço Antigo] por apenas R$ [Preço Novo].\n\nNão perca essa chance! A oferta é válida até [Data Final da Oferta].\n\n#Promoção #Desconto #SeuNegócio`,
        evento: `📅 VOCÊ É NOSSO CONVIDADO ESPECIAL! 📅\n\nParticipe do nosso [Nome do Evento] no dia [Data do Evento], às [Horário]. Será um momento incrível com [Breve Descrição do que vai acontecer].\n\nMarque na sua agenda e venha celebrar conosco!\n\nEndereço: [Seu Endereço]\n\n#Evento #SeuNegócio #[SuaCidade]`,
        dica: `💡 DICA RÁPIDA DA SEMANA 💡\n\nVocê sabia que [Fato ou Dica Interessante sobre seu nicho]?\n\nIsso pode te ajudar a [Benefício da dica]. Quer saber mais? Deixe sua pergunta nos comentários!\n\n#DicaDaSemana #Curiosidade #SeuNegócio`
    };

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

    postTypeSelect.addEventListener('change', updateTemplate);
    copyButton.addEventListener('click', copyToClipboard);

    updateTemplate();
});
```3.  Cole no Bloco de Notas.