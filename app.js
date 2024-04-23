const express = require("express");
const settings = require("./models/settings.js");
var indexRouter = require('./routes/index');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger/index.js');
const cookieParser = require('cookie-parser');

const app = express();
app.use(cookieParser());

app.use(express.json())
app.use('/', indexRouter);

//Вывод всех отсортированных куки
app.get('/cookies', (req, res) => {
    const cookies = Object.entries(req.cookies)
        .sort((a, b) => {
            return parseInt(b[1]) - parseInt(a[1]);
        });
    res.send(cookies);
});
//переход к документации на основе swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));

app.listen(settings.port);