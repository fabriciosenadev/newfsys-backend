const connection = require('../database/connection');

module.exports = {
    async store (request, response) 
    {
        const body = request.body;
        response.json(body);
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