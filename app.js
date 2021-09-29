const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const routeUsers = require('./routes/usuarios');
const routeMemories = require('./routes/memories');
const login = require('./routes/login');


app.use(bodyParser.urlencoded({ extended: false })); 
app.use(bodyParser.json());

app.use('/usuarios', routeUsers);
app.use('/memories', routeMemories);
app.use('/login', login);


//Tramento de erros
app.use((req, res, next) => {
    const failed = new Error('Not found');
    failed.status - 404;
    next(failed);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    return res.send({
        erro: {
            mensagem: error.message
        }
    });
});

module.exports = app;