const { check, oneOf, validationResult } = require('express-validator');

exports.validateStore = async (request, response, next) => {
    // const { category } = request.body;

    await check('category')
        .exists()
        .withMessage('categoria é obrigatória')
        .isLength({ min: 4 })
        .withMessage('nome muito curto')
        .run(request);
    
    await check('applicable')
        .exists()
        .withMessage('aplicavel é obrigatório')
        .run(request);

    const result = validationResult(request);
    if (!result.isEmpty()) {
        return response.status(422).json({ data: result.array() });
    }
    next();
}