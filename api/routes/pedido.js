const express = require('express');
const router = express.Router();
const C = require('../controllers/pedidoController');

// Renderiza página HTML com TODOS os pedidos
router.get('/', C.listarPedidosPagina);

// JSON puro com TODOS os pedidos
router.get('/listar', C.listarPedidos);

// Buscar um pedido pelo ID
router.get('/:id', C.obterPedidoPorId);

// Criar novo pedido
router.post('/criar', C.criarPedido);

module.exports = router;
