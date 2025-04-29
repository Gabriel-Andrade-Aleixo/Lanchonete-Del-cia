const fs = require('fs');
const path = require('path');

// Caminho para o arquivo JSON
const dataPath = path.join(__dirname, '../data/cardapio.json');

// Funções auxiliares
const readData = () => JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const saveData = (data) => fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

module.exports = {
    listarCardapios,
    buscarProdutos,
    obterItemPorId,
    criarItem,
    atualizarItem,
    deletarItem
};

// Listar todos os itens com filtros
async function listarCardapios(req, res) {
    try {
        const { categoria, destaque } = req.query;
        let { produtos } = readData();

        produtos = produtos.filter(item => {
            const matchesCategory = !categoria || item.categoria === categoria;
            const matchesDestaque = !destaque || item.destaque === (destaque === 'true');
            return matchesCategory && matchesDestaque;
        });

        res.render('base', {
            body: 'pages/cardapio',
            title: 'Cardápio Completo',
            produtos,
            searchTerm: '',
            categoria: categoria || ''
        });

    } catch (error) {
        console.error('Erro ao carregar cardápio:', error);
        res.status(500).send('Erro ao carregar o cardápio');
    }
}


// Busca de produtos
async function buscarProdutos(req, res) {
    try {
        const { q: searchTerm, categoria } = req.query;
        let { produtos } = readData();

        const termo = (searchTerm || '').toLowerCase();

        const resultados = produtos.filter(item => {
            const nome = item.nome?.toLowerCase() || '';
            const descricao = item.descricao?.toLowerCase() || '';
            const matchesSearch = nome.includes(termo) || descricao.includes(termo);
            const matchesCategory = !categoria || item.categoria === categoria;
            return matchesSearch && matchesCategory;
        });

        res.render('base', {
            body: 'pages/cardapio',
            title: termo ? `Resultados para: ${searchTerm}` : 'Todos os Produtos',
            produtos: resultados,
            searchTerm: searchTerm || '',
            categoria: categoria || ''
        });

    } catch (error) {
        console.error('Erro na busca:', error);
        res.status(500).send('Erro na busca de produtos');
    }
}



// Obter item por ID
async function obterItemPorId(req, res) {
    try {
        const { produtos } = readData();
        const item = produtos.find(p => p.id === parseInt(req.params.id));

        if (!item) return res.status(404).json({ error: 'Item não encontrado' });
        res.json(item);

    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar item' });
    }
}

// Criar novo item
async function criarItem(req, res) {
    try {
        const data = readData();
        const novoItem = {
            id: Date.now(),
            ...req.body,
            dataCriacao: new Date().toISOString()
        };

        data.produtos.push(novoItem);
        saveData(data);
        res.status(201).json(novoItem);

    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar item' });
    }
}

// Atualizar item existente
async function atualizarItem(req, res) {
    try {
        const data = readData();
        const index = data.produtos.findIndex(p => p.id === parseInt(req.params.id));

        if (index === -1) return res.status(404).json({ error: 'Item não encontrado' });

        const updatedItem = { ...data.produtos[index], ...req.body };
        data.produtos[index] = updatedItem;
        saveData(data);
        res.json(updatedItem);

    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar item' });
    }
}

// Deletar item
async function deletarItem(req, res) {
    try {
        const data = readData();
        const newProducts = data.produtos.filter(p => p.id !== parseInt(req.params.id));

        if (newProducts.length === data.produtos.length) {
            return res.status(404).json({ error: 'Item não encontrado' });
        }

        data.produtos = newProducts;
        saveData(data);
        res.json({ success: true });

    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar item' });
    }
}