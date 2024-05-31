const express = require("express");
const settings = require("./models/fs/settings.js");
var indexRouter = require('./routes/index');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger/index.js');
const cookieParser = require('cookie-parser');

const passport = require('passport');
const LocalStrategy = require('passport-local');
const {main, verifyCallback} = require('./createTableUsers.js');
const session = require('express-session');
const flash = require('connect-flash');

const app = express();

app.use(session({
    secret: '1324',
    resave: false,
    saveUninitialized: false
}));
app.use(flash());

app.use(cookieParser());

passport.use(new LocalStrategy(verifyCallback));

app.use(passport.initialize());
app.use(passport.session());

app.post('/login', passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
}));

app.get('/profile', (req, res) => {
    res.send('Добро пожаловать, ' + req.user.login + '!');
});

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