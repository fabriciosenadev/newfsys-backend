const connection = require('../database/connection');
const cryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');

// obtain data from .env file
require('dotenv-safe').config({
    allowEmptyValues: true,
    path: '.env'
});

module.exports = {

    /**
     * function to register new users
     * @param { full_name: string } request.body 
     * @param { email: string } request.body 
     * @param { password: string } request.body 
     * @param {*} response.json
     */
    async store (request, response) 
    {
        try
        {
            const { full_name, email, password } = request.body;

            const passEcrypted = cryptoJS.AES.encrypt(
                password.trim(), 
                process.env.USER_SECRET
                ).toString();

            const idUser = await connection('fsys_users')
                .insert({
                    full_name,
                    email,
                    password: passEcrypted,
                    created_at: new Date().toISOString()
                });
            
            const defaultCategories = await connection('fsys_categories')
                .select('id').where('is_custom','no');

            for(i = 0; i < defaultCategories.length; i++)
            {
                let id_category = defaultCategories[i];
                
                await connection('fsys_category_users')
                    .insert({
                        id_user: idUser[0],
                        id_category: defaultCategories[i].id,
                        created_by: idUser[0],
                        created_at: new Date().toISOString()
                    });
            }

            await connection('fsys_user_amounts')
                .insert({
                    id_user: idUser[0],
                    amount_available: 0,
                    created_at: new Date().toISOString()
                });
            
            return response.status(200).json({ success:"Dados salvos com sucesso" });
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
            let isEnableReset = false;
            
            const userData = await connection('fsys_users')
                .where({ email }).select('id').first();
            
            // verifica se o usuário foi encontrado
            if (userData === undefined) {
                // 507 to insuficient storage
                return response.status(507).json({
                    isEnableReset,
                    msg: "E-mail não encontrado" 
                });
            } 

            isEnableReset = true;
            const id = userData.id;
            const token = jwt.sign({ id }, process.env.SECRET, {
                expiresIn: 10 // expires in 10 seconds
            });
            
            return response.status(200).json({ 
                token, 
                isEnableReset,
                success:"Dados corretos, por favor altere a senha" 
            });
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
            const { userId, password } = request.body;

            const passEcrypted = cryptoJS.AES.encrypt(
                password.trim(), 
                process.env.USER_SECRET
                ).toString();

            await connection('fsys_users')
            .where({ id: userId })
            .update({ 
                password: passEcrypted,
                updated_at: new Date().toISOString()
            })
            
            return response.status(200).json({ success:"Dados salvos com sucesso" });
        }
        catch (error)
        {
            console.log(error);
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
            const { userId } = request.body;
            const info = await connection('fsys_users')
                .select('full_name', 'email')
                .where({ id:userId })
                .first();
            
            return response.status(200).json(info);
        }
        catch (error)
        {
            return response.status(500).json(error);
        }
    },
};