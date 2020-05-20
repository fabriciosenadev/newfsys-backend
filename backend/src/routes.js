const express = require('express');

const jwt = require('jsonwebtoken');
const _ = require('dotenv-safe').config({
    allowEmptyValues: true
});

// Controlers
const SessionController = require('./controllers/SessionController');
const UserController = require('./controllers/UserController');
const LaunchController = require('./controllers/LaunchController');
const ProfileController = require('./controllers/ProfileController');

// Middlewares
const SessionMiddleware = require('./middlewares/SessionMiddleware');
const UserMiddleware = require('./middlewares/UserMiddleware');

const routes = express.Router();

// Rota teste
routes.get('/api', (request, response) => {
    response.send('API is working');
});

//#region user's routes

// Rotas do usuário
routes
    .post(
        '/user/register', 
        UserMiddleware.validateToStore,
        UserController.store,
    );

// controle de senha
routes.post('/user/forgot', UserController.forgot);
routes.put('/user/reset_password', UserController.resetPassword);

routes.post('/user/info/', UserController.info);

routes.post(
    '/user/login', 
    // TODO: Adicionar validador de de dados enviados
    SessionController.create
    );

//#endregion

// Rotas de fluxo
routes.get(
        '/launching', 
        SessionMiddleware.byPass,
        ProfileController.index
    );

// Rotas de fluxo de entrada
routes.post(
    '/launch', 
    SessionMiddleware.byPass, 
    // TODO: Adicionar validação dos campos a serem salvos
    LaunchController.store
    );
routes.get(
    '/launch/:id', 
    SessionMiddleware.byPass,
    // TODO: Adicionar validação dos campos a serem salvos
    LaunchController.show
    );
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