const express = require('express');
const router = express.Router();
const C = require('../controllers/pedidoController');

router.get('/', C.exibirPaginaPedidos);
router.post('/criar', C.criarPedido);
router.get('/ver', C.listarPedidos);

// nova rota para atualizar status via AJAX
router.post('/atualizar-status/:pedidoId', C.mudarStatus);

module.exports = router;
