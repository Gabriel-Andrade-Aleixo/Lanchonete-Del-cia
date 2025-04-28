const pedidoModel = require('../models/pedidoModel');
const cardapioModel = require('../models/cardapioModel');

function criarPedido(req, res) {
    const novoPedido = req.body;
    pedidoModel.salvarPedido(novoPedido);
    res.redirect('/');
}

function listarPedidos(req, res) {
    const pedidos = pedidoModel.obterPedidos();
    res.json(pedidos);
}

function listarCardapio(req, res) {
    const cardapio = cardapioModel.obterCardapio();
    res.json(cardapio);
}

module.exports = { criarPedido, listarPedidos, listarCardapio };
