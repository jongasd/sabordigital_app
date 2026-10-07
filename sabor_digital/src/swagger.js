const swaggerAutogen = require('swagger-autogen')();
const path = require('path');

const doc = {
    info: {
        title: 'Sabor Digital API',
        description: 'Documentação automática da API Sabor Digital utilizando Swagger Autogen',
        version: '1.0.0'
    },
    host: 'localhost:3000',
    schemes: ['http'],
    securityDefinitions: {
        bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT'
        }
    }
};

const outputFile = path.join(__dirname, 'swagger_output.json');
const endpointsFiles = [path.join(__dirname, 'routes', 'index.js')]; 

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    console.log("Documentação do Swagger gerada com sucesso!");
});
