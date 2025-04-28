const fs = require('fs');
const path = require('path');

const pedidosPath = path.join(__dirname, '..', 'pedidos.json');

function salvarPedido(pedido) {
    let pedidos = [];

    if (fs.existsSync(pedidosPath)) {
        const dados = fs.readFileSync(pedidosPath);
        pedidos = JSON.parse(dados);
    }

    pedidos.push(pedido);

    fs.writeFileSync(pedidosPath, JSON.stringify(pedidos, null, 2));
}

function obterPedidos() {
    if (fs.existsSync(pedidosPath)) {
        const dados = fs.readFileSync(pedidosPath);
        return JSON.parse(dados);
    }
    return [];
}

module.exports = { salvarPedido, obterPedidos };
