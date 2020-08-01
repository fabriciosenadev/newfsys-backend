const moment = require('moment');
const { check, oneOf, validationResult } = require('express-validator');

exports.validateStore = async (request, response, next) => {
    const { date, id_pay_method } = request.body;
    const isDate = moment(date, 'YYYY-MM-DD', true).isValid();

    if(!isDate)
    {
        return response.status(422).json({ msg: "Data é obrigatória, por favor verifique se está preenchido" });
    }

    await check('value')
        .exists()
        .withMessage('Valor é obrigatório')
        .isFloat({ gt: 0.0 })
        .withMessage('Valor não é válido')
        .run(request);

    await check('id_category')
        .exists()
        .withMessage("Categoria é obrigatória")
        .isInt({ gt: 0})
        .withMessage('Categoria não é válida')
        .run(request);

    if(id_pay_method !== undefined)
    {
        await check('id_pay_method')
            .isInt({ gt: 0})
            .withMessage('Metodo de pagamento não é valido')
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
        return response.status(422).json({ msg: "Data é obrigatória" });
    }

    await check('value')
        .exists()
        .withMessage('Valor é obrigatório')
        .isFloat()
        .withMessage('Valor não é válido');

    await check('idCategory')
        .exists()
        .withMessage("Categoria é obrigatória")
        .isInt()
        .withMessage('Categoria não é válida');

    if(idPayMethod)
    {
        await check('idPayMethod')
            .isInt()
            .withMessage('Metodo de pagamento não é valido');
    }

    const result = validationResult(request);
    if (!result.isEmpty()) {
        return response.status(422).json({ data: result.array() });
    }

    next();
};