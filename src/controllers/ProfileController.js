const connection = require('../database/connection');

module.exports = {
    async index(request, response) {
        try {
            const { userId } = request.body;

            const launching = await connection('fsys_historics AS h')
                .select('h.id', 'h.date', 'h.description', 'h.value', 'c.category', 'pm.pay_method')
                .join('fsys_categories AS c', 'h.id_category', 'c.id')
                .leftJoin('fsys_pay_method_historics AS pmh', 'h.id', 'pmh.id_historic')
                .leftJoin('fsys_pay_methods AS pm', 'pmh.id_pay_method', 'pm.id')
                .where('h.created_by', '=', userId)
                .orderBy('h.date', 'desc')
                .whereNull('h.deleted_at');

            return response.status(200).json({ launching });
        }
        catch (error) {
            return response.status(500).json(error);
        }
    },

    async showByDate(request, response) {
        try {
            const { userId } = request.body;
            const {
                fromDate,
                toDate,
                applicable,
                idCategory,
                idPayMethod
            } = request.query;

            let hasPayMethod = (applicable === 'out' || applicable === 'inout' || applicable === '');
            const data = await connection('fsys_historics AS h')
                // .select('h.id','h.date','h.description','h.value', 'c.category', 'c.applicable','pm.pay_method')
                .select('h.id', 'h.date', 'h.value', 'c.applicable')
                .join('fsys_categories AS c', 'h.id_category', 'c.id')
                .leftJoin('fsys_pay_method_historics AS pmh', 'h.id', 'pmh.id_historic')
                .leftJoin('fsys_pay_methods AS pm', 'pmh.id_pay_method', 'pm.id')
                .where('h.created_by', userId)
                .andWhereBetween('h.date', [fromDate, toDate])
                .andWhere(builder => {
                    if (applicable === 'in' || applicable === 'out') {
                        builder.andWhere('c.applicable', applicable)
                    }
                })
                .andWhere(builder => {
                    if (idCategory > 0) {
                        builder.andWhere('c.id', idCategory)
                    }
                })
                .andWhere(builder => {
                    if (hasPayMethod && idPayMethod > 0) { 
                        builder.andWhere('pm.id', idPayMethod)
                    }
                })
                .orderBy('h.date', 'desc')
                .whereNull('h.deleted_at');


            return response.status(200).json({ data, fromDate, toDate })
        }
        catch (error) {
            return response.status(500).json({ error });
        }
    },
};
