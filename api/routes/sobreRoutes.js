const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('sobre', {
        info: {
            titulo: 'Sobre Nós',
            subtitulo: 'Conheça o Restaurante Delícia',
            descricao: 'Somos apaixonados por oferecer os melhores lanches da cidade, com ingredientes frescos e muito sabor!'
        }
    });
});

module.exports = router;
