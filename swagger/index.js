const swaggerJSDoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Мой API',
      version: '1.0.0',
      description: 'Описание моего API',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development сервер',
      },
    ],
  },
  apis: ["routes/*.js"], // Путь к файлам с описанием маршрутов API
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
//console.log(swaggerSpec)

module.exports = swaggerSpec;