const express = require('express');

const UserController = require('./controllers/UserController');
const LaunchController = require('../src/controllers/LaunchController');
const ProfileController = require('../src/controllers/ProfileController');

const routes = express.Router();

// Rota teste
routes.get('/api', (request, response) => {
    response.send('API is working');
});

// Rotas do usuário
routes.post('/user/register', UserController.register);

// controle de senha
routes.post('/user/forgot', UserController.forgot);
routes.put('/user/reset_password', UserController.resetPassword);

routes.post('/user/info/', UserController.info);

routes.post('/user/login', UserController.login);

// Rotas de fluxo
routes.get('/launching', ProfileController.index);

// Rotas de fluxo de entrada
routes.post('/launch/in', (request, response) => {
    response.send('API is working');
});
routes.get('/launch/in/:id', (request, response) => {
    response.send('API is working');
});
routes.put('/launch/in/:id', (request, response) => {
    response.send('API is working');
});
routes.delete('/launch/in/:id', (request, response) => {
    response.send('API is working');
});

// Rotas de fluxo de saída
routes.post('/launch/out', (request, response) => {
    response.send('API is working');
});
routes.get('/launch/out/:id', (request, response) => {
    response.send('API is working');
});
routes.put('/launch/out/:id', (request, response) => {
    response.send('API is working');
});
routes.delete('/launch/out/:id', (request, response) => {
    response.send('API is working');
});


module.exports = routes;