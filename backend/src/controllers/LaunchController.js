const connection = require('../database/connection');

module.exports = {
    async index (request, response) 
    {
        const userId = request.headers.authorization;
        const launching = '';

        response.send('launching is working');
    }
};
