const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'API Documentation',
        description: 'This is a sample API documentation.',
    },
    host: 'localhost:3000', // автонастройка порт
    schemes: ['http'],
};

const outputFile = './swagger_output.json';
const endpointsFiles = ['./routes/index.js']; // Путь к файлу с вашими роутами

swaggerAutogen(outputFile, endpointsFiles, doc);