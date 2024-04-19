const express = require("express");
const settings = require("./settings");
var indexRouter = require('./routes/index');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger/index.js');

const app = express();

app.use(express.json())
app.use('/', indexRouter);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));

app.listen(settings.port);
//curl
//-g

//midle waier