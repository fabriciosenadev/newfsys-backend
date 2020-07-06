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
const ProfileMiddleware = require('./middlewares/ProfileMiddleware');
const LaunchMiddleware = require('./middlewares/LaunchMiddleware');
const SystemController = require('./controllers/SystemController');

const routes = express.Router();

// Rota teste
routes.get('/api', (request, response) => {
    response.send('API is working');
});

//#region user's routes

// Rotas do usuário
routes.post(
    '/user/register',
    UserMiddleware.validateToStore,
    UserController.store,
);

// controle de senha
routes.post(
    '/user/forgot',
    UserMiddleware.validateForgot,
    UserController.forgot
);

routes.post(
    '/user/reset_password',
    UserMiddleware.validateReset,
    UserController.resetPassword
);

routes.get(
    '/user/info',
    SessionMiddleware.byPass,
    UserController.info
);

routes.post(
    '/user/login',
    SessionMiddleware.verifyCreate,
    SessionController.create
);

// Rotas de fluxo
// routes.get(
//     '/profile',
//     SessionMiddleware.byPass,
//     ProfileController.index
// );

routes.post(
    '/launch/filter',
    SessionMiddleware.byPass,
    ProfileMiddleware.checkDate,
    ProfileController.showByDate
);

// Rotas de lançamentos de entrada e saída
routes.post(
    '/launch',
    SessionMiddleware.byPass,
    LaunchMiddleware.validateStore,
    LaunchController.store
);

routes.get(
    '/launch/:id',
    SessionMiddleware.byPass,
    LaunchController.show
);
routes.put(
    '/launch/:id',
    SessionMiddleware.byPass,
    LaunchMiddleware.validateUpdate,
    LaunchController.update
);
routes.delete(
    '/launch/:id',
    SessionMiddleware.byPass,
    LaunchController.destroy
);
//#endregion

//#region System's routes

// dados do usuário
routes.get(
    '/system/user/info',
    SessionMiddleware.byPass,
    SystemController.userInfo
);

// categories
routes.get(
    '/system/categories/:applicable',
    SessionMiddleware.byPass,
    SystemController.categories
);
routes.get(
    '/system/pay_methods',
    SessionMiddleware.byPass,
    SystemController.payMethods
);

routes.get(
    '/system/:month/:year',
    SessionMiddleware.byPass,
    SystemController.getMonth
);
//#endregion
module.exports = routes;