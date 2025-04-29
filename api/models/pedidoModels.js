const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../../data/pedidos.json');

// Cria o arquivo se não existir
if (!fs.existsSync(dataPath)) {
    fs.mkdirSync(path.dirname(dataPath), { recursive: true }); // Cria a pasta se não existir
    fs.writeFileSync(dataPath, '[]'); // Cria o arquivo com array vazio
}

// Restante do código permanece igual...

function obterPedidos() {
  const data = fs.readFileSync(dataPath);
  return JSON.parse(data);
}

module.exports = {
  criarPedido: (novoPedido) => {
    const pedidos = obterPedidos();
    novoPedido.id = pedidos.length > 0 ? Math.max(...pedidos.map(p => p.id)) + 1 : 1;
    novoPedido.data = new Date().toISOString();
    novoPedido.status = 'pendente';
    pedidos.push(novoPedido);
    salvarPedidos(pedidos);
    return novoPedido;
  },

  listarPedidos: () => {
    return obterPedidos();
  },

  obterPedidoPorId: (id) => {
    const pedidos = obterPedidos();
    return pedidos.find(p => p.id === id);
  }
};