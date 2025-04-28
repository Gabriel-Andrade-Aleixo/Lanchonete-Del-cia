const mongoose = require('mongoose');

const ItemCardapioSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: [true, 'O nome do item é obrigatório'],
        trim: true
    },
    descricao: {
        type: String,
        trim: true
    },
    preco: {
        type: Number,
        required: [true, 'O preço é obrigatório'],
        min: [0, 'O preço não pode ser negativo']
    },
    categoria: {
        type: String,
        required: [true, 'A categoria é obrigatória'],
        enum: {
            values: ['hamburguer', 'bebida', 'sobremesa', 'acompanhamento'],
            message: 'Categoria inválida'
        }
    },
    imagem: {
        type: String,
        default: '/static/images/food-placeholder.jpg'
    },
    ingredientes: [String],
    tempoPreparo: {
        type: Number,
        min: [0, 'O tempo de preparo não pode ser negativo']
    },
    disponivel: {
        type: Boolean,
        default: true
    },
    destaque: {
        type: Boolean,
        default: false
    },
    informacoesNutricionais: {
        calorias: Number,
        carboidratos: Number,
        proteinas: Number,
        gorduras: Number
    },
    codigoOpenFoodFacts: String
}, { timestamps: true });

const CardapioSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: [true, 'O nome do cardápio é obrigatório'],
        unique: true,
        trim: true
    },
    descricao: String,
    itens: [ItemCardapioSchema],
    ativo: {
        type: Boolean,
        default: true
    },
    dataValidade: Date
}, { timestamps: true });

// Índices para melhorar performance de buscas
CardapioSchema.index({ nome: 'text', descricao: 'text' });
CardapioSchema.index({ categoria: 1 });

// Middleware para validação
CardapioSchema.pre('save', function(next) {
    if (this.dataValidade && this.dataValidade < new Date()) {
        this.ativo = false;
    }
    next();
});

// Método estático para buscar cardápios ativos
CardapioSchema.statics.buscarAtivos = function() {
    return this.find({ ativo: true });
};

// Método de instância para adicionar item
CardapioSchema.methods.adicionarItem = function(item) {
    this.itens.push(item);
    return this.save();
};

const Cardapio = mongoose.model('Cardapio', CardapioSchema);

module.exports = Cardapio;

const fs = require('fs');
const path = require('path');

const cardapioPath = path.join(__dirname, '..', 'cardapio.json');

function obterCardapio() {
    if (fs.existsSync(cardapioPath)) {
        const dados = fs.readFileSync(cardapioPath);
        return JSON.parse(dados).produtos;
    }
    return [];
}

module.exports = { obterCardapio };