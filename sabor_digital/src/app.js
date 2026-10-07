const express = require('express');
const cors = require('cors');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');

const app = express();
const routes = require('./routes');

// Middlewares globais
app.use(cors()); // Habilita o CORS para permitir requisições do frontend
app.use(express.json());

// Servir arquivos estáticos (como as imagens de uploads)
app.use('/public', express.static(path.join(__dirname, '..', 'public')));

// Registro de todas as rotas da API centralizadas
app.use('/', routes);

// Documentação da API com Swagger
const swaggerFile = path.join(__dirname, 'swagger_output.json');
if (fs.existsSync(swaggerFile)) {
    const swaggerData = require('./swagger_output.json');
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerData));
}

module.exports = app;