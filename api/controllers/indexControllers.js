module.exports = {
    getIndex
    // indexNotFound
};

function getIndex (req, res) {
    res.render('base', {
        title: 'Restaurante Delícia',
        body: 'pages/index' 
    });
}


// function indexNotFound(req, res) {
//     res.status(404).json({ error: "Route not found" });
// };
