const express = require('express');
const router = express.Router();
const cardapioController = require('../controllers/cardapioController');

router.get('/', cardapioController.listarCardapios);
router.get('/buscar', cardapioController.buscarProdutos);
router.get('/:id', cardapioController.obterItemPorId);
router.post('/', cardapioController.criarItem);
router.put('/:id', cardapioController.atualizarItem);
router.delete('/:id', cardapioController.deletarItem);

module.exports = router;