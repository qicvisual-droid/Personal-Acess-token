// Pede a permissao de microfone numa ABA.
//
// O painel lateral do Chrome nao consegue mostrar o pedido de permissao: a
// chamada morre em `not-allowed` sem que nada apareca para o cliente. Numa aba
// normal o pedido aparece, e a autorizacao passa a valer para a extensao
// inteira — inclusive no painel.
const botao = document.getElementById('permitir');
const estado = document.getElementById('estado');

function dizer(texto, classe) {
    estado.textContent = texto;
    estado.className = classe || '';
}

botao.addEventListener('click', async () => {
    botao.disabled = true;
    dizer('Pedindo permissão...');
    try {
        const fluxo = await navigator.mediaDevices.getUserMedia({ audio: true });
        // Solta o microfone na hora: so queriamos a autorizacao, nao gravar.
        // Sem isto o indicador de "em uso" ficaria aceso sem motivo.
        fluxo.getTracks().forEach((t) => t.stop());
        dizer('Pronto! Microfone liberado. Pode fechar esta aba e voltar para o painel.', 'ok');
        botao.textContent = 'Liberado';
    } catch (e) {
        botao.disabled = false;
        const nome = (e && e.name) || 'Erro';
        if (nome === 'NotAllowedError') {
            dizer('Você recusou o pedido. Clique de novo e escolha Permitir — ou libere o microfone no cadeado da barra de endereço.', 'ruim');
        } else if (nome === 'NotFoundError') {
            dizer('Nenhum microfone encontrado neste computador.', 'ruim');
        } else {
            // O nome do erro vai junto: sem ele, "nao deu" nao ajuda ninguem a
            // descobrir o que aconteceu.
            dizer('Não consegui liberar (' + nome + ').', 'ruim');
        }
    }
});
