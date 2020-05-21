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

    async show (request, response) 
    {
        try
        {

            const { id } = request.params;
            const { userId } = request.body;

            const launchData = await connection('fsys_historics AS h')
                                .select('h.id','h.date','h.description','h.value', 'c.category','pm.pay_method')
                                .join('fsys_categories AS c','h.id_category','c.id')
                                .leftJoin('fsys_pay_method_historics AS pmh', 'h.id', 'pmh.id_historic')
                                .leftJoin('fsys_pay_methods AS pm', 'pmh.id_pay_method', 'pm.id')
                                .where('h.id','=',id, 'and', 'h.created_by', '=', userId)
                                .whereNull('h.deleted_at')
                                .first();
            
            console.log(launchData);
            return response.status(200).json({ launchData });
        }
        catch(error)
        {
            return response.status(500).json({ error });
        }
    },

    async update(request, response)
    {
        try
        {
            const { id } = request.params;
            const { date, description, value, idCategory, userId, idPayMethod } = request.body;

            await connection('fsys_historics')
                .where({ id })
                .update({ 
                    date,
                    description,
                    value,
                    id_category: idCategory,
                    updated_at: new Date().toISOString()
                });

            if (idPayMethod)
            {
                await connection('fsys_pay_method_historics')
                .where({ id_historic: id })
                .update({
                    id_pay_method: idPayMethod,
                    updated_at: new Date().toISOString()                     
                });
            }

            return response.status(200).json({ success: "data was updated with successfully" });
        }
        catch (error)
        {
            return response.status(500).json({ error });
        }
    },

    async destroy (request, response)
    {
        try
        {
            const { id } = request.params;

            const payMethodHistorics = await connection('fsys_pay_method_historics')
                .select('*').where({ id_historic: id }).first();
            
            await connection('fsys_historics')
                .where({ id })
                .update({
                    deleted_at: new Date().toISOString()
                });            

            if(payMethodHistorics)
            {
                await connection('fsys_pay_method_historics')
                    .where({ id_historic: id })
                    .update({
                        deleted_at: new Date().toISOString()
                    });  
            }

            return response.status(200).json({ success: "data was removed with successfully" });
        }
        catch (error)
        {
            return response.status(500).json({ error });
        }
    }
};
