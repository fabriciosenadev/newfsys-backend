const connection = require('../database/connection');

module.exports = {
    async store (request, response) 
    {
        try
        {
            const { full_name, email, password } = request.body;
                        
            await connection('fsys_users').insert({
                full_name,
                email,
                password,
                created_at: new Date().toISOString()
            });
            
            return response.json({ success:"data was saved with successfully" });
        }
        catch (error)
        {
            return response.json({ error });
        }
    },

    async login (request, response)
    {
        const body = request.body;
        response.json(body);
    },
    async forgot (request, response)
    {
        const body = request.body;
        response.json(body);
    },
    async resetPassword (request, response)
    {
        const body = request.body;
        response.json(body);
    },
};