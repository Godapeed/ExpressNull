const express = require("express");
var indexRouter = require('./routes/index');

const app = express();

app.use('/', indexRouter);

app.listen(3000);
//curl
//-g

//midle waier