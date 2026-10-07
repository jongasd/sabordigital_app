const express = require('express');
const router = express.Router();

const produtoRoutes = require('./produtoRoutes');
const cardapioRoutes = require('./cardapioRoutes');
const pedidoRoutes = require('./pedidoRoutes');
const authRoutes = require('./authRoutes');

// Rota base
router.get('/', (req, res) => {
    res.json({
        mensagem: "API SaborDigital funcionando 🚀",
        versao: "1.0.0",
        arquitetura: "MVC + SOLID"
    });
});

// Registrar domínios de rotas
router.use('/produtos', produtoRoutes);
router.use('/cardapios', cardapioRoutes);
router.use('/pedidos', pedidoRoutes);
router.use('/auth', authRoutes);

module.exports = router;
