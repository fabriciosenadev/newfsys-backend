// const express = require('express');
const { check, oneOf, body, validationResult } = require('express-validator');
const connection = require('../database/connection');

module.exports = {
    async validateToStore (request, response, next)
    {
        // validate if data was sent is real true
        await check('full_name')
                .exists()
                .withMessage('full_name is required')
                .isLength({ min: 10 })
                .withMessage('min length is 10 characters')
                .run(request);
        
        await check('email')
                .exists()
                .withMessage('email is required')
                .isEmail()
                .withMessage('email is not valid')
                .run(request);

        await check(['password','verifyPass'])
                .exists()
                .withMessage('password is required')
                .isLength({ min: 8 })
                .withMessage('min length is 8 characters')
                .run(request);

        await body('verifyPass').custom((value, { req }) => {
                if (value !== req.body.password) {
                  throw new Error('Password confirmation does not match password');
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
          return response.status(507).json({ error: "email was used already" });
        }      

        // user can be created now!
        next();
    }
};