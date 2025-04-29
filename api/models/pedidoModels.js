const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../../data/pedidos.json');

function salvarPedidos(pedidos) {
    fs.writeFileSync(dataPath, JSON.stringify(pedidos, null, 2), 'utf8');
}

function gerarNovoId(pedidos) {
    return pedidos.length > 0 ? Math.max(...pedidos.map(p => p.id)) + 1 : 1;
}

module.exports = {
    criarPedido: (pedidoData) => {
        const pedidos = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        const novoPedido = {
            id: gerarNovoId(pedidos),
            ...pedidoData,
            status: 'pendente',
            data: new Date().toISOString()
        };
        pedidos.push(novoPedido);
        salvarPedidos(pedidos);
        return novoPedido;
    },

    listarPedidos: () => {
        return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    },

    obterPedidoPorId: (id) => {
        const pedidos = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        return pedidos.find(p => p.id === id);
    }
};