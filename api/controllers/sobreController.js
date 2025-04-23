module.exports = {
    listarSobre
}
function listarSobre (req, res) {
    console.log('Listando cardápios...');
    res.render('base', {
        title: 'Restaurante Delícia',
        body: 'pages/sobre' 
    });    
};
