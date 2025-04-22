module.exports = {
    getSobre
}

function getSobre (req, res) {
    const info = sobreModels.getInfo();
    res.render('sobre', { info });  
};
