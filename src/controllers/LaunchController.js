const connection = require('../database/connection');

module.exports = {
    async store (request, response) 
    {
        try
        {
            const { date, description, value, id_category, userId, id_pay_method } = request.body;
            
            const idHistoric = await connection('fsys_historics')
                                    .insert({
                                        date,
                                        description,
                                        value,
                                        id_category,
                                        created_by: userId,
                                        created_at: new Date().toISOString()
                                    });

            if(id_pay_method)
            {
                await connection('fsys_pay_method_historics')
                    .insert({
                        id_pay_method,
                        id_historic: idHistoric[0],
                        created_by: userId,
                        created_at: new Date().toISOString()                        
                    });
            }
            
            return response.status(200).json({ success:"Dados salvos com sucesso" });
            
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

            const data = await connection('fsys_historics AS h')
                                .select('h.id','h.date','h.description'
                                    ,'h.value', 'c.category','pm.pay_method'
                                    ,'c.applicable', 'h.status'
                                )
                                .join('fsys_categories AS c','h.id_category','c.id')
                                .leftJoin('fsys_pay_method_historics AS pmh', 'h.id', 'pmh.id_historic')
                                .leftJoin('fsys_pay_methods AS pm', 'pmh.id_pay_method', 'pm.id')
                                .where('h.id',id)
                                .andWhere( 'h.created_by', userId)
                                .whereNull('h.deleted_at')
                                .first();

            return response.status(200).json({ data });
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

            return response.status(200).json({ success: "Dados salvos com sucesso" });
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

            return response.status(200).json({ success: "Dados removidos com sucesso" });
        }
        catch (error)
        {
            return response.status(500).json({ error });
        }
    },

    async updateStatus(request, response) {        
        try {
            const { id } = request.params;
            const { status, userId } = request.body;

            await connection('fsys_historics')
                .where({
                    id, 
                    created_by: userId
                })
                .update({
                    status,
                    updated_at: new Date().toISOString()
                });

                return response.status(200).json({ success: "Dados atualizados com sucesso" });
            
        } catch (error) {
            return response.status(500).json({ error });
        }
    }
};
