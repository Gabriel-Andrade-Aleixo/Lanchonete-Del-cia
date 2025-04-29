const pedidoModel = require('../models/pedidoModels');

// Dados mockados do cardápio
const cardapio = {
    1: { nome: "Batata Frita Média", descricao: "Porção média de batata frita crocante", preco: 8.00 },
    2: { nome: "Refrigerante Lata", descricao: "Coca-Cola, Guaraná ou Fanta (350ml)", preco: 5.00 },
    3: { nome: "X-Burguer", descricao: "Hambúrguer simples com queijo e maionese", preco: 12.50 },
    4: { nome: "X-Salada", descricao: "Hambúrguer com alface, tomate e maionese", preco: 14.00 }
};

exports.criarPedido = (req, res) => {
    try {
        const { cliente, itens } = req.body;
        
        // Calcula o total baseado no cardápio
        const total = itens.reduce((sum, item) => {
            return sum + (cardapio[item.produtoId].preco * item.quantidade);
        }, 0);

        const pedidoData = {
            cliente,
            itens: itens.map(item => ({
                produtoId: item.produtoId,
                quantidade: item.quantidade,
                precoUnitario: cardapio[item.produtoId].preco
            })),
            total
        };

        const novoPedido = pedidoModel.criarPedido(pedidoData);
        res.status(201).json(novoPedido);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.listarPedidos = (req, res) => {
    try {
        const pedidos = pedidoModel.listarPedidos();
        res.json(pedidos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.listarPedidosPagina = (req, res) => {
  try {
      const pedidos = pedidoModel.listarPedidos();
      
      console.log("AAAAAAAAAA");
  } catch (error) {
      res.send(
          'Erro ao carregar pedidos'
      );
  }
};