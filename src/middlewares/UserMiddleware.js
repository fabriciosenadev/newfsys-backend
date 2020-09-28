// const express = require('express');
const { check, oneOf, body, validationResult } = require('express-validator');
const connection = require('../database/connection');
const jwt = require('jsonwebtoken');

// obtain data from .env file
require('dotenv-safe').config({
    allowEmptyValues: true,
    path: '.env'
});

module.exports = {
    async validateToStore (request, response, next)
    {
        // validate if data was sent is real true
        await check('full_name')
                .exists()
                .withMessage('Nome completo é obrigatório')
                .isLength({ min: 10 })
                .withMessage('Nome muito curto, por favor informe nome completo')
                .run(request);
        
        await check('email')
                .exists()
                .withMessage('E-mail é obrigatório')
                .isEmail()
                .withMessage('E-mail não é válido')
                .run(request);

        await check(['password','verifyPass'])
                .exists()
                .withMessage('Senha é obrigatório')
                .isLength({ min: 8 })
                .withMessage('Senha deve ter pelo meno 8 caracteres')
                .run(request);

        await body('verifyPass').custom((value, { req }) => {
                if (value !== req.body.password) {
                  throw new Error('Confirmação de senha é diferente da senha');
                }           
                // Indicates the success of this synchronous custom validator
                return true;
              }).run(request);
      
        const result = validationResult(request);
        if (!result.isEmpty()) {
          return response.status(422).json({ data: result.array() });
        }
      
        // validate if email exists
        const { email } = request.body;
        const dataExisting = await connection('fsys_users')
                .where({ email })
                .select('id');

        if(dataExisting.length > 0)
        {
          return response.status(507).json({ 
            data: [
              {msg: "E-mail já está em uso"} 
            ]
          });
        }      

        // user can be created now!
        next();
    },

    async validateForgot (request, response, next)
    {
        await check('email')
                .exists()
                .withMessage('E-mail é obrigatório')
                .isEmail()
                .withMessage('E-mail não é válido')
                .run(request);
        
        const result = validationResult(request);
        
        if (!result.isEmpty()) {
          return response.status(422).json({ data: result.array() });
        }      
        // user can be created now!
        next();  
    },

    async validateReset (request, response, next)
    {
        await check(['password','verifyPass'])
                .exists()
                .withMessage('Senha é obrigatório')
                .isLength({ min: 8 })
                .withMessage('Senha deve ter pelo meno 8 caracteres')
                .run(request);

        await body('verifyPass').custom((value, { req }) => {
                if (value !== req.body.password) {
                  throw new Error('Confirmação de senha é diferente da senha');
                }           
                // Indicates the success of this synchronous custom validator
                return true;
              }).run(request);
      
        const result = validationResult(request);
        if (!result.isEmpty()) {
          return response.status(422).json({ data: result.array() });
        } 
        
        next(); 
    },

    validateToken(request, response, next) {
      try {
          let isEnableReset = false;
          const { reset_token } = request.headers;
          
          if(!reset_token)
          {
              return response.status(401).json({ 
                  isEnableReset, 
                  error: "No token provided"
              });
          }
          jwt.verify(reset_token, process.env.USER_SECRET, function(error, decoded){
              if(error) {
                return response.status(507)
                  .json({ 
                    isEnableReset, 
                    error ,
                    msg: "Tempo de espera excedido, tente novamente"
                  });
              }
                             
              request.body.userId = decoded.id;
              
              next();
          });
      } catch (error) {
          console.log(error);
          return response.status(500).json(error);
      }
    }
};