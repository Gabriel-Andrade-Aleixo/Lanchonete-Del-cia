const pedidoModel = require('../models/pedidoModels');
const { lerCardapio } = require('../models/pedidoModels'); // se ainda usar cardápio no form

// exibe página de realizar pedido (não muda)
function exibirPaginaPedidos(req, res) {
    const produtos = lerCardapio();
    res.render('base', {
        body: 'pages/pedido',
        title: 'Faça seu Pedido',
        produtos
    });
}

// cria novo pedido (não muda)
function criarPedido(req, res) {
    const { cliente, produtos, quantidades } = req.body;
    if (!cliente || !produtos || !quantidades) {
        return res.status(400).send('Dados incompletos para o pedido.');
    }
    const pedidos = pedidoModel.lerPedidos();
    const novoPedido = {
        id: Date.now(),
        cliente,
        itens: produtos.map((produtoId, i) => ({
            produtoId: Number(produtoId),
            quantidade: Number(quantidades[i])
        })),
        data: new Date().toISOString(),
        status: 'PENDENTE'
    };
    pedidos.push(novoPedido);
    pedidoModel.salvarPedidos(pedidos);
    res.redirect('/pedido/ver');
}

// lista pedidos
function listarPedidos(req, res) {
    const pedidos = pedidoModel.lerPedidos();
    const produtos = pedidoModel.lerCardapio();

    const pedidosComDetalhes = pedidos.map(pedido => {
        const itensComDetalhes = pedido.itens.map(item => {
            const produto = produtos.find(p => p.id === item.produtoId);
            return {
                produtoId: item.produtoId,
                quantidade: item.quantidade,
                nome: produto ? produto.nome : 'Produto não encontrado',
                descricao: produto ? produto.descricao : 'Descrição não disponível',
                preco: produto ? produto.preco : 0
            };
        });
        const valorTotal = itensComDetalhes
            .reduce((sum, i) => sum + i.preco * i.quantidade, 0);
        return { ...pedido, itens: itensComDetalhes, valorTotal };
    });

    res.render('base', {
        body: 'pages/pedidosListar',
        title: 'Pedidos Realizados',
        pedidos: pedidosComDetalhes
    });
}
// nova action: altera status
function mudarStatus(req, res) {
    const { status } = req.body;
    const { pedidoId } = req.params;
    const ok = pedidoModel.atualizarStatus(pedidoId, status);
    if (ok) {
        return res.json({ success: true });
    } else {
        return res.status(404).json({ error: 'Pedido não encontrado' });
    }
}

module.exports = {
    exibirPaginaPedidos,
    criarPedido,
    listarPedidos,
    mudarStatus,
};
