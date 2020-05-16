const connection = require('../database/connection');

module.exports = {

    /**
     * function to register new users
     * @param { full_name: string } request.body 
     * @param { email: string } request.body 
     * @param { password: string } request.body 
     * @param {*} response.json
     */
    async register (request, response) 
    {
        try
        {
            const { full_name, email, password } = request.body;
                        
            await connection('fsys_users')
                .insert({
                    full_name,
                    email,
                    password,
                    created_at: new Date().toISOString()
                });
            
            return response.status(200).json({ success:"data was saved with successfully" });
        }
        catch (error)
        {
            return response.status(500).json(error);
        }
    },

    /**
     * function to reset password: verifying email - part 1
     * @param { email: string } request.body
     * @param {*} response.json
     */
    async forgot (request, response)
    {
        try
        {
            const { email } = request.body;
            
            const userId = await connection('fsys_users')
                .where({ email }).select('id');
            
            // verifica se o usuário foi encontrado
            if (userId.length < 1) 
                // 507 to insuficient storage
                return response.status(507).json({ 
                    error: "user was not match" 
                });
            
            return response.status(200).json(userId);
        }
        catch (error)
        {
            return response.status(500).json(error);
        }
    },

    /**
     * function to reset password: reseting password - part 2
     * @param { id: int } request 
     * @param { password: string } request 
     * @param {*} response 
     */
    async resetPassword (request, response)
    {
        try
        {
            const { id, password } = request.body;
            await connection('fsys_users')
            .where({ id })
            .update({ 
                password,
                updated_at: new Date().toISOString()
            })
            
            return response.status(200).json({ success:"data was saved with successfully" });
        }
        catch (error)
        {
            return response.status(500).json(error);
        }
    },

    /**
     * function to bring user's informations
     * @param { id: int } request 
     * @param {*} response.json
     */
    async info (request, response)
    {
        try
        {
            const { id } = request.body;
            const info = await connection('fsys_users')
            .where({ id }).select('*');
            
            return response.status(200).json(info);
        }
        catch (error)
        {
            return response.status(500).json(error);
        }
    },
};