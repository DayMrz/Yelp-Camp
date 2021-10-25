const User = require('../models/user');

module.exports.renderFormUser = (req, res) => {
    res.render('users/register');
}