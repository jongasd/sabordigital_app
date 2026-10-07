const auth = require('./auth');
const autorizar = require('./autorizar');

module.exports = {
    verificarToken: auth,
    verificarAdmin: autorizar('admin'),
    auth,
    autorizar
};
