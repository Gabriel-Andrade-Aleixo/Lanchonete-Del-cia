const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');

router.post('/', pedidoController.criarPedido);
router.get('/', pedidoController.listarPedidos);
router.get('/:id', pedidoController.obterPedido);
router.get('/visualizar', pedidoController.listarPedidosPagina);

module.exports = router;