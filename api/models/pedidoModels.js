const fs = require('fs');
const path = require('path');

// Se este arquivo está em /models, então suba UMA pasta e entre em api/data
const pedidosPath = path.join(__dirname, '../data/pedidoData.json');
console.log('Lendo JSON de pedidos em:', pedidosPath);

function lerPedidosDoArquivo() {
    if (!fs.existsSync(pedidosPath)) {
        fs.writeFileSync(pedidosPath, '[]');
    }
    const data = fs.readFileSync(pedidosPath, 'utf8');
    return JSON.parse(data);
}

function salvarPedidosNoArquivo(pedidos) {
    fs.writeFileSync(pedidosPath, JSON.stringify(pedidos, null, 2));
}

function criarPedido(pedidoData) {
    const pedidos = lerPedidosDoArquivo();
    const novoPedido = {
        id: pedidos.length > 0 ? pedidos[pedidos.length - 1].id + 1 : 1,
        data: new Date().toISOString(),
        ...pedidoData
    };
    pedidos.push(novoPedido);
    salvarPedidosNoArquivo(pedidos);
    return novoPedido;
}

function listarPedidos() {
    return lerPedidosDoArquivo();
}

function buscarPedidoPorId(id) {
    const pedidos = lerPedidosDoArquivo();
    return pedidos.find(p => p.id === id);
}

module.exports = {
    criarPedido,
    listarPedidos,
    buscarPedidoPorId
};
