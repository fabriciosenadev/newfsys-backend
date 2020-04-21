const express = require('express');

const UserController = require('./controllers/UserController');

const routes = express.Router();

// Rota teste
routes.get('/api', (request, response) => {
    response.send('API is working');
});

// Rotas do usuário
routes.post('/users/register', UserController.store);
routes.post('/users/login', UserController.login);
routes.post('/users/forgot', UserController.forgot);
routes.get('/users/reset_password', UserController.resetPassword);


module.exports = routes;