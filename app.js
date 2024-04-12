const express = require("express");
const settings = require("./settings");
var indexRouter = require('./routes/index');

const app = express();

app.use('/', indexRouter);

app.listen(settings.port);
//curl
//-g

//midle waier