const express = require("express");
const settings = require("./settings");
var indexRouter = require('./routes/index');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger/swagger_output.json');

const app = express();

app.use(express.json())
app.use('/', indexRouter);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(settings.port);
//curl
//-g

//midle waier