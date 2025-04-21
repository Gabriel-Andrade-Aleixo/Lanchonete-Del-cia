const express = require('express');
const router = express.Router();
const cardapioController = require('../controllers/cardapioController');
const { check } = require('express-validator');

// Validações
const validarCardapio = [
    check('nome')
        .not().isEmpty().withMessage('O nome é obrigatório')
        .trim()
        .escape(),
    check('descricao')
        .optional()
        .trim()
        .escape(),
    check('itens.*.nome')
        .not().isEmpty().withMessage('O nome do item é obrigatório')
        .trim()
        .escape(),
    check('itens.*.preco')
        .isFloat({ min: 0 }).withMessage('O preço deve ser um número positivo')
];

// Rotas
router.get('/', cardapioController.listarCardapios);
router.get('/json', cardapioController.listarCardapiosJSON);
router.get('/destaque', cardapioController.buscarItensDestaque);
router.get('/categoria/:categoria', cardapioController.buscarPorCategoria);
router.get('/:id', cardapioController.obterCardapioPorId);

// Rotas protegidas (com autenticação)
router.post('/', validarCardapio, cardapioController.criarCardapio);
router.put('/:id', validarCardapio, cardapioController.atualizarCardapio);
router.delete('/:id', cardapioController.deletarCardapio);

// Rota de busca
router.get('/buscar', cardapioController.buscarProdutos);

module.exports = router;