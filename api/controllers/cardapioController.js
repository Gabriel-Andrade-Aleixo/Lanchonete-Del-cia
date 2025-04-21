const Cardapio = require('../models/cardapioModels');
const mongoose = require('mongoose');
const { validationResult } = require('express-validator');
const axios = require('axios');

module.exports = {
    criarCardapio,
    listarCardapios,
    obterCardapioPorId,
    atualizarCardapio,
    deletarCardapio,
    listarCardapiosJSON,
    buscarItensDestaque,
    buscarPorCategoria,
    buscarProdutos,
    getOpenFoodFactsCategory,
    extrairInformacoesNutricionais,
    gerarPrecoAleatorio,
    determinarCategoria
};

// Função para criar um novo cardápio
async function criarCardapio(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const novoCardapio = new Cardapio(req.body);
        await novoCardapio.save();
        
        res.status(201).json({
            success: true,
            data: novoCardapio
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro ao criar cardápio',
            error: error.message
        });
    }
}

// Função para listar todos os cardápios (com paginação)
async function listarCardapios(req, res) {
    try {
        // Buscar produtos da API Open Food Facts
        const response = await axios.get(
            'https://world.openfoodfacts.org/cgi/search.pl', {
                params: {
                    search_terms: 'hamburger', // Termo de busca padrão
                    page_size: 24,            // Quantidade de produtos
                    json: 1                   // Formato de resposta
                }
            });
        
        // Processar os produtos
        const produtos = response.data.products.map(produto => ({
            nome: produto.product_name || 'Produto sem nome',
            descricao: produto.generic_name || 'Descrição não disponível',
            imagem: produto.image_url || '/static/images/food-placeholder.jpg',
            preco: gerarPrecoAleatorio(), // API não fornece preço, geramos um
            categoria: determinarCategoria(produto.categories_tags),
            informacoesNutricionais: extrairInformacoesNutricionais(produto.nutriments),
            ingredientes: produto.ingredients_text || 'Ingredientes não disponíveis'
        }));

        res.render('pages/cardapio', {
            title: 'Cardápio - Restaurante Delícia',
            produtos, // Agora passamos 'produtos' em vez de 'cardapios'
            searchTerm: 'hamburger' // Termo de busca atual
        });

    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        res.status(500).render('pages/error', {
            title: 'Erro',
            error: 'Não foi possível carregar o cardápio',
            produtos: [] // Garante que produtos será definido
        });
    }
}

async function buscarProdutos(req, res) {
    try {
        const searchTerm = req.query.q || 'hamburger';
        const categoria = req.query.categoria || '';
        
        // Parâmetros para a API Open Food Facts
        const params = {
            search_terms: searchTerm,
            page_size: 24,
            json: 1
        };
        
        // Adicionar filtro por categoria se especificado
        if (categoria) {
            params.tag_0 = getOpenFoodFactsCategory(categoria);
        }
        
        const response = await axios.get(
            'https://world.openfoodfacts.org/cgi/search.pl', { params });
        
        // Processar os produtos (igual na listarCardapios)
        const produtos = response.data.products.map(produto => ({
            nome: produto.product_name || 'Produto sem nome',
            descricao: produto.generic_name || 'Descrição não disponível',
            imagem: produto.image_url || '/static/images/food-placeholder.jpg',
            preco: gerarPrecoAleatorio(),
            categoria: determinarCategoria(produto.categories_tags),
            informacoesNutricionais: extrairInformacoesNutricionais(produto.nutriments),
            ingredientes: produto.ingredients_text || 'Ingredientes não disponíveis'
        }));
        
        res.render('pages/cardapio', {
            title: `Cardápio - ${searchTerm}`,
            produtos,
            searchTerm,
            categoria
        });
        
    } catch (error) {
        console.error('Erro na busca:', error);
        res.status(500).render('pages/error', {
            title: 'Erro',
            error: 'Não foi possível realizar a busca',
            produtos: []
        });
    }
}

function getOpenFoodFactsCategory(categoria) {
    const mapping = {
        'hamburguer': 'en:hamburgers',
        'bebida': 'en:beverages',
        'sobremesa': 'en:desserts',
        'acompanhamento': 'en:snacks'
    };
    return mapping[categoria] || '';
}

function extrairInformacoesNutricionais(nutriments) {
    if (!nutriments) return null;
    
    return {
        calorias: nutriments.energy_kcal_100g || 'N/A',
        carboidratos: nutriments.carbohydrates_100g || 'N/A',
        proteinas: nutriments.proteins_100g || 'N/A',
        gorduras: nutriments.fat_100g || 'N/A',
        sodio: nutriments.sodium_100g || 'N/A'
    };
}

function gerarPrecoAleatorio() {
    return (Math.random() * 30 + 5).toFixed(2); // Entre R$ 5 e R$ 35
}


function determinarCategoria(categories_tags) {
    if (!categories_tags) return 'outros';
    
    if (categories_tags.includes('en:hamburgers')) return 'hamburguer';
    if (categories_tags.includes('en:desserts')) return 'sobremesa';
    if (categories_tags.includes('en:beverages')) return 'bebida';
    if (categories_tags.includes('en:snacks')) return 'acompanhamento';
    
    return 'outros';
}

// Função para obter um cardápio específico pelo ID
async function obterCardapioPorId(req, res) {
    try {
        const cardapio = await Cardapio.findById(req.params.id);
        
        if (!cardapio) {
            return res.status(404).json({
                success: false,
                message: 'Cardápio não encontrado'
            });
        }

        res.status(200).json({
            success: true,
            data: cardapio
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro ao buscar cardápio',
            error: error.message
        });
    }
}

// Função para atualizar um cardápio pelo ID
async function atualizarCardapio(req, res) {
    try {
        const cardapio = await Cardapio.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!cardapio) {
            return res.status(404).json({
                success: false,
                message: 'Cardápio não encontrado'
            });
        }

        res.status(200).json({
            success: true,
            data: cardapio
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro ao atualizar cardápio',
            error: error.message
        });
    }
}

// Função para deletar um cardápio pelo ID (soft delete)
async function deletarCardapio(req, res) {
    try {
        const cardapio = await Cardapio.findByIdAndUpdate(
            req.params.id,
            { ativo: false },
            { new: true }
        );

        if (!cardapio) {
            return res.status(404).json({
                success: false,
                message: 'Cardápio não encontrado'
            });
        }

        res.status(200).json({
            success: true,
            data: cardapio
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro ao remover cardápio',
            error: error.message
        });
    }
}

// Função para API JSON
async function listarCardapiosJSON(req, res) {
    try {
        const cardapios = await Cardapio.find({ ativo: true })
            .select('nome itens.nome itens.preco itens.descricao itens.categoria')
            .lean();

        res.json({
            success: true,
            count: cardapios.length,
            data: cardapios
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro ao buscar cardápios',
            error: error.message
        });
    }
}

// Função para buscar itens em destaque
async function buscarItensDestaque(req, res) {
    try {
        const cardapios = await Cardapio.aggregate([
            { $match: { ativo: true } },
            { $unwind: '$itens' },
            { $match: { 'itens.destaque': true } },
            { $project: { 
                'item': '$itens',
                'cardapio': '$nome'
            }},
            { $limit: 8 }
        ]);

        res.json({
            success: true,
            data: cardapios
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro ao buscar itens em destaque',
            error: error.message
        });
    }
}

// Função para buscar por categoria
async function buscarPorCategoria(req, res) {
    try {
        const categoria = req.params.categoria;
        const cardapios = await Cardapio.aggregate([
            { $match: { ativo: true } },
            { $unwind: '$itens' },
            { $match: { 'itens.categoria': categoria } },
            { $project: { 
                'item': '$itens',
                'cardapio': '$nome'
            }}
        ]);

        res.json({
            success: true,
            data: cardapios
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro ao buscar por categoria',
            error: error.message
        });
    }
}