const connection = require('../database/connection');

module.exports = {
    async store (request, response) 
    {
        try
        {
            const { 
                date, 
                description, 
                value, 
                id_category, 
                userId, id_pay_method,
                status,
                next_month
            } = request.body;
            
            const idHistoric = await connection('fsys_historics')
                                    .insert({
                                        date,
                                        description,
                                        value,
                                        id_category,
                                        created_by: userId,
                                        created_at: new Date().toISOString(),
                                        status
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

            if(next_month) {
                await connection('fsys_scheduled_historics')
                    .insert({
                        id_historic: idHistoric[0],
                        next_month,
                        created_by: userId,
                        created_at: new Date().toISOString()
                    });
            }

            let { amount_available } = await connection('fsys_user_amounts')
                .select('amount_available')
                .where({
                    id_user: userId
                }).first();

            if(id_pay_method)
                amount_available = amount_available - value;
            else
                amount_available = amount_available + value;

            await connection('fsys_user_amounts')
                .update({
                    amount_available
                })
                .where({
                    id_user: userId
                });
            
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

            let schedulingData = await connection('fsys_scheduled_historics')
                .select('next_month')
                .where({
                    id_historic: id,
                    created_by: userId,
                    deleted_at: null
                }).first();
            if(schedulingData === undefined) schedulingData = { next_month:'' };

            return response.status(200).json({ data, schedulingData: schedulingData });
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
            const { 
                date, 
                description, 
                value,
                oldValue, 
                id_category, 
                userId, 
                id_pay_method,
                status,
                next_month
            } = request.body;

            await connection('fsys_historics')
                .update({ 
                    date,
                    description,
                    value,
                    id_category,
                    updated_at: new Date().toISOString(),
                    status
                })
                .where({ 
                    id,
                    created_by: userId
                 });

            if (id_pay_method)
            {
                await connection('fsys_pay_method_historics')
                .where({ id_historic: id })
                .update({
                    id_pay_method,
                    updated_at: new Date().toISOString()                     
                });
            }

            if(next_month) {
                // verify if exists scheduling
                const idScheduled = await await connection('fsys_scheduled_historics')
                    .select('id')
                    .where({
                      id_historic: id,
                      created_by: userId  
                    }).first();

                if(!idScheduled) {
                    await connection('fsys_scheduled_historics')
                    .insert({
                        id_historic: id,
                        next_month,
                        created_by: userId,
                        created_at: new Date().toISOString()
                    });
                }
                else {
                    await connection('fsys_scheduled_historics')
                    .where({
                        id_historic: id,
                        created_by: userId
                    })
                    .update({
                        updated_at: new Date().toISOString(),
                        deleted_at: null
                    }); 
                }
            } 
            else {
                await connection('fsys_scheduled_historics')
                .where({
                    id_historic: id,
                    created_by: userId
                })
                .update({
                    updated_at: new Date().toISOString(),
                    deleted_at: new Date().toISOString()
                });
            }

            let { amount_available } = await connection('fsys_user_amounts')
            .select('amount_available')
            .where({
                id_user: userId
            }).first();
            
            if(id_pay_method){
                amount_available = amount_available + oldValue;
                amount_available = amount_available - value;
            }
            else {
                amount_available = amount_available - oldValue;
                amount_available = amount_available + value;
            }

            await connection('fsys_user_amounts')
                .update({
                    amount_available
                })
                .where({
                    id_user: userId
                });

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
