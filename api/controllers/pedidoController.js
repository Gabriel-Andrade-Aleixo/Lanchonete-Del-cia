const pedidoModel = require('../models/pedidoModels');

exports.criarPedido = (req, res) => {
  try {
    const pedido = pedidoModel.criarPedido(req.body);
    res.status(201).json(pedido);
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

exports.obterPedido = (req, res) => {
  try {
    const pedido = pedidoModel.obterPedidoPorId(Number(req.params.id));
    if (!pedido) return res.status(404).json({ error: 'Pedido não encontrado' });
    res.json(pedido);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.listarPedidosPagina = async (req, res) => {
  try {
      const pedidos = pedidoModel.listarPedidos();
      
      // Função auxiliar para mapear IDs para nomes (substitua com seus produtos reais)
      const produtos = {
          1: { nome: "Batata Frita Média", preco: 8.00 },
          2: { nome: "Refrigerante Lata", preco: 5.00 },
          3: { nome: "X-Burguer", preco: 12.50 },
          4: { nome: "X-Salada", preco: 14.00 }
      };
      
      res.render('pedidos', { 
          pedidos,
          obterNomeProduto: (id) => produtos[id]?.nome || `Produto #${id}` 
      });
  } catch (error) {
      res.status(500).send('Erro ao carregar pedidos');
  }
};