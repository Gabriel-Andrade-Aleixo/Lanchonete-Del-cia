const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');

// Rota principal que renderiza a página HTML
router.get('/', pedidoController.listarPedidosPagina);

// API REST (opcional)
router.post('/criar/pedidos', pedidoController.criarPedido);
router.get('/listar/pedidos', pedidoController.listarPedidos);

module.exports = router;