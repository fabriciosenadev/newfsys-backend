const express = require('express');
// const util = require('util');
// const { validator } = require('express-validator');
const { check, oneOf, validationResult } = require('express-validator');

module.exports = {
    async register (request, response, next)
    {
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

        await check('password')
                .exists()
                .withMessage('password is required')
                .isLength({ min: 8 })
                .withMessage('min length is 10 characters')
                .run(request);
      
        const result = validationResult(request);
        if (!result.isEmpty()) {
          return response.status(422).json({ errors: result.array() });
        }
      
        // user can be created now!
        next();
    }
};