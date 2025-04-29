const pedidoModel = require('../models/pedidoModels');

exports.listarPedidos = (req, res) => {
    try {
        const pedidos = pedidoModel.listarPedidos();
        res.json(pedidos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.listarPedidosPagina = (req, res) => {
    try {
        const pedidos = pedidoModel.listarPedidos();
        // res.json('pages/pedido', { pedidos });
        res.json(pedidos);
    } catch (err) {
        res.status(500).send('Erro ao carregar pedidos.');
    }
};

exports.obterPedidoPorId = (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const pedido = pedidoModel.buscarPedidoPorId(id);
        if (!pedido) return res.status(404).json({ error: 'Pedido não encontrado' });
        res.json(pedido);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.criarPedido = (req, res) => {
    try {
        const { cliente, itens } = req.body;
        if (!cliente || !Array.isArray(itens) || itens.length === 0) {
            return res.status(400).json({ error: "Dados do pedido inválidos." });
        }
        // supondo que você calcule total em outro lugar…
        const novo = pedidoModel.criarPedido({ cliente, itens, total: 0 });
        res.status(201).json(novo);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

