const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');

// Conexão com o MongoDB (substitua pela sua URL)
mongoose.connect('mongodb://localhost:27017/lanchonete', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Conectado ao MongoDB'))
.catch(err => console.error('Erro na conexão com MongoDB:', err));

const indexRoutes = require('./api/routes/index');
const cardapioRoutes = require('./api/routes/cardapio');
const pedidoRoutes = require('./api/routes/pedido');

const port = 3000;

app.use(express.json())
app.use(express.urlencoded({extended: true}))

// no seu app.js
app.set('views', path.join(__dirname, 'api', 'views'));
app.set('view engine', 'ejs');  


// app.use('/static', express.static(__dirname + '/public'));

// app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('styles'));
app.use(express.static('js'));
app.use(express.static('scripts'));

app.use("/cardapio", cardapioRoutes);
app.use("/pedido", pedidoRoutes);
app.use("/", indexRoutes);

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});