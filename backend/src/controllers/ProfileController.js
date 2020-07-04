const connection = require('../database/connection');

module.exports = {
    async index (request, response) 
    {
        try
        {
            const { userId } = request.body;

            const launching = await connection('fsys_historics AS h')
                                .select('h.id','h.date','h.description','h.value', 'c.category','pm.pay_method')
                                .join('fsys_categories AS c','h.id_category','c.id')
                                .leftJoin('fsys_pay_method_historics AS pmh', 'h.id', 'pmh.id_historic')
                                .leftJoin('fsys_pay_methods AS pm', 'pmh.id_pay_method', 'pm.id')
                                .where('h.created_by', '=', userId)
                                .orderBy('h.date', 'desc')
                                .whereNull('h.deleted_at');

            return response.status(200).json({ launching });
        }
        catch (error)
        {
            return response.status(500).json(error);
        }
    },

    async showByDate (request, response)
    {
        try
        {   
            const { fromDate , toDate, userId } = request.body;
            const data = await connection('fsys_historics AS h')
                            .select('h.id','h.date','h.description','h.value', 'c.category', 'c.applicable','pm.pay_method')
                            .join('fsys_categories AS c','h.id_category','c.id')
                            .leftJoin('fsys_pay_method_historics AS pmh', 'h.id', 'pmh.id_historic')
                            .leftJoin('fsys_pay_methods AS pm', 'pmh.id_pay_method', 'pm.id')
                            .where('h.created_by', userId)
                            .andWhereBetween('h.date', [fromDate, toDate])
                            .orderBy('h.date', 'desc')
                            .whereNull('h.deleted_at');
            return response.status(200).json({ data, fromDate, toDate })
        }
        catch (error)
        {
            return response.status(500).json({ erro });
        }
    },
};
