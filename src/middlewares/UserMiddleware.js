// const express = require('express');
const { check, oneOf, body, validationResult } = require('express-validator');
const connection = require('../database/connection');

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
          return response.status(507).json({ error: "E-mail já está em uso" });
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
    }
};