const connection = require('../database/connection');

module.exports = {
    async index (request, response) 
    {
        try
        {
            const { userId } = request.body;

            const launching = await connection('fsys_historics')
                                        .where('created_by', userId)
                                        .orderBy('date', 'asc')
                                        .select('*')

            return response.json({ launching });
        }
        catch (error)
        {
            return response.json(error);
        }
    },
};
