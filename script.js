<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sistema de Pedidos</title>
    <link rel="stylesheet" href="style.css">
    <script src="https://unpkg.com/vanilla-masker@1.1.1/lib/vanilla-masker.js"></script>
</head>
<body>
    <h2>Pedido do Cliente</h2>
    <div id="numeroPedido" style="text-align: center; font-size: 1.2em; margin-bottom: 15px;"></div>
    
    <form id="pedidoForm">
        <div class="form-group">
            <label for="nome">Nome do Cliente:</label>
            <input type="text" id="nome" required>
        </div>

        <div class="form-group">
            <label for="telefone">Telefone:</label>
            <input type="tel" id="telefone" required>
        </div>

        <div class="form-group">
            <label for="produtos">Produtos:</label>
            <textarea id="produtos" rows="4" style="width: 100%" required></textarea>
        </div>

        <div class="form-group">
            <label for="observacoes">Observações:</label>
            <textarea id="observacoes" rows="2" style="width: 100%"></textarea>
        </div>

        <div class="form-group">
            <label for="pagamento">Forma de Pagamento:</label>
            <select id="pagamento" required>
                <option value="">Selecione</option>
                <option value="dinheiro">Dinheiro</option>
                <option value="pix">PIX</option>
                <option value="debito">Débito</option>
                <option value="credito">Crédito</option>
                <option value="vr">VR</option>
            </select>
        </div>

        <div class="form-group">
            <label for="endereco">Endereço:</label>
            <textarea id="endereco" rows="2" style="width: 100%" required></textarea>
        </div>

        <div class="form-group">
            <label for="valor">Valor Total:</label>
            <input type="text" id="valor" required>
        </div>

        <button type="button" onclick="imprimirPedido()">Imprimir Pedido</button>
    </form>

    <script>
        let numeroPedidoAtual = 0;

        window.onload = function() {
            // Recupera o último número de pedido ou inicia do 1
            numeroPedidoAtual = parseInt(localStorage.getItem('ultimoNumeroPedido') || '0');
            atualizarNumeroPedido();

            // Máscara para telefone
            var telefoneInput = document.getElementById('telefone');
            VMasker(telefoneInput).maskPattern('(99) 99999-9999');

            // Máscara para valor em reais
            var valorInput = document.getElementById('valor');
            VMasker(valorInput).maskMoney({
                precision: 2,
                separator: ',',
                delimiter: '.',
                unit: 'R$ '
            });
        }

        function atualizarNumeroPedido() {
            numeroPedidoAtual++;
            localStorage.setItem('ultimoNumeroPedido', numeroPedidoAtual.toString());
            document.getElementById('numeroPedido').textContent = `Pedido Nº ${numeroPedidoAtual}`;
        }

        function formatarDataHora() {
            const agora = new Date();
            return agora.toLocaleString('pt-BR');
        }

        function imprimirPedido() {
            // Coleta os dados do formulário
            const nome = document.getElementById('nome').value;
            const telefone = document.getElementById('telefone').value;
            const produtos = document.getElementById('produtos').value;
            const observacoes = document.getElementById('observacoes').value;
            const pagamento = document.getElementById('pagamento').value;
            const endereco = document.getElementById('endereco').value;
            const valor = document.getElementById('valor').value;
            const dataHora = formatarDataHora();

            // Formata o texto para impressão
            const textoImpressao = 
                "PEDIDO\n" +
                "=================\n" +
                `Nº ${numeroPedidoAtual}\n` +
                `Data/Hora: ${dataHora}\n` +
                `Cliente: ${nome}\n` +
                `Telefone: ${telefone}\n` +
                `\nProdutos:\n${produtos}\n` +
                (observacoes ? `\nObservações:\n${observacoes}\n` : '') +
                `\nForma de Pagamento: ${pagamento}\n` +
                `Endereço: ${endereco}\n` +
                `Valor Total: ${valor}\n` +
                "=================\n\n";

            try {
                // Cria um link com o protocolo rawbt
                var link = document.createElement('a');
                link.href = 'rawbt://print?text=' + encodeURIComponent(textoImpressao);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                // Limpa todos os campos
                document.getElementById('nome').value = '';
                document.getElementById('telefone').value = '';
                document.getElementById('produtos').value = '';
                document.getElementById('observacoes').value = '';
                document.getElementById('pagamento').value = '';
                document.getElementById('endereco').value = '';
                document.getElementById('valor').value = '';

                // Atualiza o número do próximo pedido
                atualizarNumeroPedido();

                // Foca no primeiro campo para novo pedido
                document.getElementById('nome').focus();
            } catch (error) {
                alert('Erro ao imprimir. Por favor, verifique se a impressora está conectada.');
                console.error(error);
            }
        }
    </script>
</body>
</html>
