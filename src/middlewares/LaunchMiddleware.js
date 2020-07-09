const moment = require('moment');
const { check, oneOf, validationResult } = require('express-validator');

exports.validateStore = async (request, response, next) => {
    const { date, id_pay_method } = request.body;
    const isDate = moment(date, 'YYYY-MM-DD', true).isValid();

    if(!isDate)
    {
        return response.status(422).json({ msg: "date is required, please verify if it's correctly" });
    }

    await check('value')
        .exists()
        .withMessage('value is required')
        .isFloat({ gt: 0.0 })
        .withMessage('value is not valid')
        .run(request);

    await check('id_category')
        .exists()
        .withMessage("category id is required")
        .isInt({ gt: 0})
        .withMessage('category id is not valid')
        .run(request);

    if(id_pay_method !== undefined)
    {
        await check('id_pay_method')
            .isInt({ gt: 0})
            .withMessage('pay method id is not valid')
            .run(request);
    }

    const result = validationResult(request);
    if (!result.isEmpty()) {
        return response.status(422).json({ data: result.array() });
    }
    next();
};

exports.validateUpdate = async (request, response, next) => {
    const { date, idPayMethod } = request.body;

    const isDate = moment(date, 'YYYY-MM-DD', true).isValid();

    if(!isDate)
    {
        return response.status(422).json({ msg: "date is required, please verify if it's correctly" });
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
        return response.status(422).json({ data: result.array() });
    }

    next();
};