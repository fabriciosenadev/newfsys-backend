const connection = require('../database/connection');

module.exports = {
    async index (request, response) 
    {
        const userId = request.headers.authorization;
        const launching = await connection('fsys_historics')
        .where('created_by', userId)
        .select('*');

        return response.json(launching);
    },
};
