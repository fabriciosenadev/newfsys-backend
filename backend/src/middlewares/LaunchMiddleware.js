const moment = require('moment');
const { check, oneOf, validationResult } = require('express-validator');

exports.validateStore = async (request, response, next) => {
    const { date, idPayMethod } = request.body;

    const isDate = moment(date, 'YYYY-MM-DD', true).isValid();

    if(!isDate)
    {
        return response.status(422).json({ error: "date is required, please verify if it's correctly" });
    }

    await check('value')
        .exists()
        .withMessage('value is required')
        .isFloat()
        .withMessage('value is not valid');

    await check('idCategory')
        .exists()
        .withMessage("category id is required")
        .isInt()
        .withMessage('category id is not valid');

    if(idPayMethod)
    {
        await check('idPayMethod')
            .isInt()
            .withMessage('pay method id is not valid');
    }

    const result = validationResult(request);
    if (!result.isEmpty()) {
        return response.status(422).json({ errors: result.array() });
    }

    next();
};