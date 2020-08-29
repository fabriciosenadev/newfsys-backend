const connection = require('../database/connection');

module.exports = {
    async categories(request, response) {
        try {
            const { userId } = request.body;
            const { applicable } = request.query;

            const data = await connection('fsys_categories AS c')
                .select('c.id', 'c.category', 'c.applicable')
                .innerJoin('fsys_category_users AS cu', 'c.id', 'cu.id_category')
                .where('cu.id_user', '=', userId)
                .andWhere((builder) => {
                    if (applicable === 'in' || applicable === 'out') {
                        builder.andWhere('c.applicable', applicable)
                    }
                })
                .whereNull('cu.deleted_at');

            return response.status(200).json({ data });

        } catch (error) {
            return response.status(500).json({ error });
        }
    },
    async userInfo(request, response) {
        try {
            const { userId } = request.body;

            const data = await connection('fsys_users')
                .select('full_name').where('id', '=', userId).first();

            return response.status(200).json({ data });
        } catch (error) {
            return response.status(500).json({ error });
        }
    },
    async payMethods(request, response) {
        try {
            const { userId } = request.body;

            const data = await connection('fsys_pay_methods')
                .select('id', 'pay_method');

            return response.status(200).json({ data });
        } catch (error) {
            return response.status(500).json({ error });
        }
    },

    async getMonth(request, response) {
        try {
            const { userId } = request.body;            
            const { year, month } = request.query;

            let lastDay = '30';
            // janeiro, março, maio, julho, agosto, outubro, dezembro
            switch(month)
            {
                case '01':
                case '03':
                case '05':
                case '07':
                case '08':
                case '10':
                case '12':
                    lastDay = '31';
                    break;
                case '02':
                    lastDay = '28';
                    break;
            }

            let fromDate = `${year}-${month}-01`;
            let toDate = `${year}-${month}-${lastDay}`;               
            
            const received = await connection('fsys_historics AS h')
                .select('h.value')
                .sum('h.value as value')
                .join('fsys_categories AS c','h.id_category','c.id')
                .where('h.created_by', userId)
                .andWhere('c.applicable','in')
                .andWhere('h.status', 'received')
                .andWhereBetween('date',[fromDate, toDate])
                .whereNull('h.deleted_at');
                
            const paid = await connection('fsys_historics AS h')
                .select('h.value')
                .sum('h.value as value')
                .join('fsys_categories AS c','h.id_category','c.id')
                .where('h.created_by', userId)
                .andWhere('c.applicable','out')
                .andWhere('h.status', 'paid')
                .andWhereBetween('date',[fromDate, toDate])
                .whereNull('h.deleted_at');

            return response.status(200).json({ received, paid });
        } catch (error) {
            return response.status(500).json({ error });
        }
    },

    async pieChart (request, response) {

        try {
            const { userId } = request.body;
            const { year, month } = request.query;

            let lastDay = '30';
            // janeiro, março, maio, julho, agosto, outubro, dezembro
            switch(month)
            {
                case '01':
                case '03':
                case '05':
                case '07':
                case '08':
                case '10':
                case '12':
                    lastDay = '31';
                    break;
                case '02':
                    lastDay = '28';
                    break;
            }

            let fromDate = `${year}-${month}-01`;
            let toDate = `${year}-${month}-${lastDay}`;

            const categoriesInData = await connection('fsys_category_users AS cu')
                .select('c.id', 'c.category')
                .innerJoin('fsys_categories AS c', 'cu.id_category', 'c.id')
                .where('cu.id_user', userId)
                .andWhere('c.applicable','in');

            const categoriesOutData = await connection('fsys_category_users AS cu')
                .select('c.id', 'c.category')
                .innerJoin('fsys_categories AS c', 'cu.id_category', 'c.id')
                .where('cu.id_user', userId)
                .andWhere('c.applicable','out');
            
            let idsIn = categoriesInData.map(categoryData => categoryData.id);
            let idsOut = categoriesOutData.map(categoryData => categoryData.id);

            const historicsInData = await connection('fsys_historics AS h')
                .select('h.*','c.category')
                .sum('h.value AS value')
                .join('fsys_categories AS c','h.id_category', 'c.id')
                .whereIn('h.id_category', idsIn)
                .andWhere({
                    'h.status': 'received',
                    'h.created_by': userId
                })
                .andWhereBetween('h.date',[fromDate, toDate])
                .groupBy('c.category');

            const historicsOutData = await connection('fsys_historics AS h')
                .select('h.*','c.category')
                .sum('h.value AS value')
                .join('fsys_categories AS c','h.id_category', 'c.id')
                .whereIn('h.id_category', idsOut)
                .andWhere({
                    'h.status': 'paid',
                    'h.created_by': userId
                })
                .andWhereBetween('h.date',[fromDate, toDate])
                .groupBy('c.category');

            let categoriesIn = historicsInData.map(historicData => historicData.category);
            let valuesIn = historicsInData.map(historicData => historicData.value);
            let categoriesOut = historicsOutData.map(historicData => historicData.category);
            let valuesOut = historicsOutData.map((historicData) => historicData.value);

            return response.status(200).json({ 
                categoriesIn,
                valuesIn,
                categoriesOut,
                valuesOut,
            });

        } catch (error) {
            return response.status(500).json({ error });
        }

    }
};