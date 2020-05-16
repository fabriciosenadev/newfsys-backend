const connection = require('../database/connection');
const jwt = require('jsonwebtoken');
require('dotenv-safe').config({
    allowEmptyValues: true,
    path: '../.env'
});

module.exports = {

    /**
     * function to create session
     * @param { email: string } request.body
     * @param { password: string } request.body
     * @param { auth, token || error } response.json
     */
    async create (request, response)
    {
        try
        {
            const { email, password } = request.body;
            
            let auth = false;
            const userData = await connection('fsys_users')
                .where({
                    email,
                    password
                })
                .select('id')
                // .first();

            // verifica se o usuário foi encontrado
            if  (userData.length < 1)
            {
                // 507 to insuficient storage
                return response.status(507).json({ 
                    auth, 
                    error: "user or password was not match"
                });
            } 

            auth = true;
            const { id } = userData;
            const token = jwt.sign({ id }, process.env.SECRET, {
                expiresIn: 600 // expires in 10 min
            })
            
            return response.status(200).json({ auth, token });
        }
        catch (error)
        {
            return response.status(500).json(error);
        }
    },

    /**
     * function to deatroy session
     * @param {*} request 
     * @param {*} response 
     */
    async destroy (request, response)
    {
        try
        {
            let auth = false;
            const token = false;
            return response.status(200).json({auth, token});
        }
        catch (error)
        {
            return response.status(500).json(error);
        }
    }
}