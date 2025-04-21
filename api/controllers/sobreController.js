const sobreModel = require('../models/sobreModel');

exports.getSobre = (req, res) => {
    const info = sobreModel.getInfo();
    res.render('sobre', { info });
};
