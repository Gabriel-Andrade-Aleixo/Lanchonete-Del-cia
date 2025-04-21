const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController.js');


// Rota para criar um novo Pedidos
router.post('/', pedidoController.criarPedidos);

// Rota para listar todos os Pedidoss
router.get('/', pedidoController.listarPedidoss);

// Rota para obter um Pedidos específico pelo ID
router.get('/:id', pedidoController.obterPedidosPorId);

// Rota para atualizar um Pedidos pelo ID
router.put('/:id', pedidoController.atualizarPedidos);

// Rota para deletar um Pedidos pelo ID
router.delete('/:id', pedidoController.deletarPedidos);

module.exports = router;