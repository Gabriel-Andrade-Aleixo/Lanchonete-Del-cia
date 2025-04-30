const fs = require('fs');
const path = require('path');

const caminhoCardapio = path.join(__dirname, '../data/cardapio.json');
const caminhoPedidos = path.join(__dirname, '../data/pedidoData.json');

function lerPedidos() {
    try {
        if (!fs.existsSync(caminhoPedidos)) return [];
        const dados = fs.readFileSync(caminhoPedidos, 'utf8');
        return JSON.parse(dados);
    } catch (err) {
        console.error('Erro ao ler pedidos:', err);
        return [];
    }
}

function salvarPedidos(pedidos) {
    try {
        fs.writeFileSync(caminhoPedidos, JSON.stringify(pedidos, null, 2), 'utf8');
    } catch (err) {
        console.error('Erro ao salvar pedidos:', err);
    }
}

function atualizarStatus(id, novoStatus) {
    const pedidos = lerPedidos();
    const idx = pedidos.findIndex(p => p.id === Number(id));
    if (idx === -1) return false;
    pedidos[idx].status = novoStatus;
    salvarPedidos(pedidos);
    return true;
}

function lerCardapio() {
    try {
        const raw = fs.readFileSync(caminhoCardapio, 'utf8');
        const json = JSON.parse(raw);
        return json.produtos.map(p => ({
            id: p.id,
            nome: p.nome,
            descricao: p.descricao,
            preco: p.preco
        }));
    } catch {
        return [];
    }
}

module.exports = {
    lerPedidos,
    salvarPedidos,
    atualizarStatus,
    lerCardapio
};
