const connection = require('../database/connection');

module.exports = {
    async store (request, response) 
    {
        try
        {
            const { date, description, value, idCategory, userId, idPayMethod } = request.body;
            
            const idHistoric = await connection('fsys_historics')
                                    .insert({
                                        date,
                                        description,
                                        value,
                                        id_category: idCategory,
                                        created_by: userId,
                                        created_at: new Date().toISOString()
                                    });

            if(!idHistoric)
            {
                return response.status(507).json({ 
                    error: "An error ocurred when we tried to save data"
                });
            }

            if(idPayMethod)
            {
                await connection('fsys_pay_method_historics')
                    .insert({
                        id_pay_method: idPayMethod,
                        id_historic: idHistoric[0],
                        created_by: userId,
                        created_at: new Date().toISOString()                        
                    });
            }
            
            return response.status(200).json({ success:"data was saved with successfully" });
            
        }
        catch (error) 
        {
            return response.status(500).json({ error });
        }
    },
};
