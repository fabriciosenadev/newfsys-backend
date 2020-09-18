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
            switch (month) {
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
                .join('fsys_categories AS c', 'h.id_category', 'c.id')
                .where('h.created_by', userId)
                .andWhere('c.applicable', 'in')
                .andWhere('h.status', 'received')
                .andWhereBetween('date', [fromDate, toDate])
                .whereNull('h.deleted_at');

            const paid = await connection('fsys_historics AS h')
                .select('h.value')
                .sum('h.value as value')
                .join('fsys_categories AS c', 'h.id_category', 'c.id')
                .where('h.created_by', userId)
                .andWhere('c.applicable', 'out')
                .andWhere('h.status', 'paid')
                .andWhereBetween('date', [fromDate, toDate])
                .whereNull('h.deleted_at');

            return response.status(200).json({ received, paid });
        } catch (error) {
            return response.status(500).json({ error });
        }
    },

    async pieChart(request, response) {
        try {
            const { userId } = request.body;
            const { year, month } = request.query;

            let lastDay = '30';
            // janeiro, março, maio, julho, agosto, outubro, dezembro
            switch (month) {
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
                .andWhere('c.applicable', 'in');

            const categoriesOutData = await connection('fsys_category_users AS cu')
                .select('c.id', 'c.category')
                .innerJoin('fsys_categories AS c', 'cu.id_category', 'c.id')
                .where('cu.id_user', userId)
                .andWhere('c.applicable', 'out');

            let idsIn = categoriesInData.map(categoryData => categoryData.id);
            let idsOut = categoriesOutData.map(categoryData => categoryData.id);

            const historicsInData = await connection('fsys_historics AS h')
                .select('h.*', 'c.category')
                .sum('h.value AS value')
                .join('fsys_categories AS c', 'h.id_category', 'c.id')
                .whereIn('h.id_category', idsIn)
                .andWhere({
                    'h.status': 'received',
                    'h.created_by': userId
                })
                .andWhereBetween('h.date', [fromDate, toDate])
                .groupBy('c.category');

            const historicsOutData = await connection('fsys_historics AS h')
                .select('h.*', 'c.category')
                .sum('h.value AS value')
                .join('fsys_categories AS c', 'h.id_category', 'c.id')
                .whereIn('h.id_category', idsOut)
                .andWhere({
                    'h.status': 'paid',
                    'h.created_by': userId
                })
                .andWhereBetween('h.date', [fromDate, toDate])
                .groupBy('c.category');

            const payMethodsData = await connection('fsys_historics AS h')
                .select('h.*','pm.pay_method')
                .sum('h.value AS value')
                .innerJoin('fsys_pay_method_historics AS pmh', 'h.id', 'pmh.id_historic')
                .join('fsys_pay_methods AS pm', 'pmh.id_pay_method', 'pm.id')
                .whereIn('h.id_category', idsOut)
                .andWhere({
                    'h.status': 'paid',
                    'h.created_by': userId
                })
                .andWhereBetween('h.date', [fromDate, toDate])
                .groupBy('pm.pay_method');

            let categoriesIn = historicsInData.map(historicData => historicData.category);
            let valuesIn = historicsInData.map(historicData => historicData.value);
            let categoriesOut = historicsOutData.map(historicData => historicData.category);
            let valuesOut = historicsOutData.map((historicData) => historicData.value);
            let payMethods = payMethodsData.map(payMethodData => payMethodData.pay_method);
            let totalsByPayMethod = payMethodsData.map(payMethodData => payMethodData.value);

            return response.status(200).json({
                categoriesIn,
                valuesIn,
                categoriesOut,
                valuesOut,
                payMethods,
                totalsByPayMethod,
            });

        } catch (error) {
            return response.status(500).json({ error });
        }
    },

    async getDetailsByCategory(request, response) {
        try {
            console.log('cheguei aqui');
            const { userId } = request.body;
            const { year, month } = request.query;

            let lastDay = '30';
            // janeiro, março, maio, julho, agosto, outubro, dezembro
            switch (month) {
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
                .andWhere('c.applicable', 'in');

            const categoriesOutData = await connection('fsys_category_users AS cu')
                .select('c.id', 'c.category')
                .innerJoin('fsys_categories AS c', 'cu.id_category', 'c.id')
                .where('cu.id_user', userId)
                .andWhere('c.applicable', 'out');

            let idsIn = categoriesInData.map(categoryData => categoryData.id);
            let idsOut = categoriesOutData.map(categoryData => categoryData.id);

            const historicsInNonPendingData = await connection('fsys_historics AS h')
                .select('h.id', 'h.date', 'c.category', 'h.value', 'h.status')
                .join('fsys_categories AS c', 'h.id_category', 'c.id')
                .whereIn('h.id_category', idsIn)
                .andWhere({
                    'h.status': 'received',
                    'h.created_by': userId
                })
                .andWhereBetween('h.date', [fromDate, toDate])
                .orderBy([
                    { column: 'c.applicable' },
                    { column: 'c.id' },
                    { column: 'h.status' },
                    { column: 'h.date', order: 'desc' }
                ]);

            const historicsOutNonPendingData = await connection('fsys_historics AS h')
                .select('h.id', 'h.date', 'c.category', 'h.value', 'h.status')
                .join('fsys_categories AS c', 'h.id_category', 'c.id')
                .whereIn('h.id_category', idsOut)
                .andWhere({
                    'h.status': 'paid',
                    'h.created_by': userId,
                })
                .andWhereBetween('h.date', [fromDate, toDate])
                .orderBy([
                    { column: 'c.applicable' },
                    { column: 'c.id' },
                    { column: 'h.status' },
                    { column: 'h.date', order: 'desc' }
                ]);

            const historicsInPendingData = await connection('fsys_historics AS h')
                .select('h.id', 'h.date', 'c.category', 'h.value', 'h.status')
                .join('fsys_categories AS c', 'h.id_category', 'c.id')
                .whereIn('h.id_category', idsIn)
                .andWhere({
                    'h.status': 'pending',
                    'h.created_by': userId,
                    'c.applicable': 'in',
                })
                .andWhereBetween('h.date', [fromDate, toDate])
                .orderBy([
                    { column: 'c.applicable' },
                    { column: 'c.id' },
                    { column: 'h.status' },
                    { column: 'h.date', order: 'desc' }
                ]);
            const historicsOutPendingData = await connection('fsys_historics AS h')
                .select('h.id', 'h.date', 'c.category', 'h.value', 'h.status')
                .join('fsys_categories AS c', 'h.id_category', 'c.id')
                .whereIn('h.id_category', idsOut)
                .andWhere({
                    'h.status': 'pending',
                    'h.created_by': userId,
                    'c.applicable': 'out',
                })
                .andWhereBetween('h.date', [fromDate, toDate])
                .orderBy([
                    { column: 'c.applicable' },
                    { column: 'c.id' },
                    { column: 'h.status' },
                    { column: 'h.date', order: 'desc' }
                ]);

            response.status(200).json({
                historicsInNonPendingData,
                historicsOutNonPendingData,
                historicsInPendingData,
                historicsOutPendingData
            });

        } catch (error) {
            return response.status(500).json({ error });
        }
    },

    async getLaunchToUpdate(request, response) {
        try {
            const { id } = request.params;
            const { userId } = request.body;


            const data = await connection('fsys_historics AS h')
                .select(
                    'h.id',
                    'h.id_category',
                    'h.date',
                    'h.description',
                    'h.value',
                    'h.status',
                    'c.applicable',
                    'pm.pay_method',
                    'pmh.id_pay_method'
                )
                .join('fsys_categories AS c', 'h.id_category', 'c.id')
                .leftJoin('fsys_pay_method_historics AS pmh', 'h.id', 'pmh.id_historic')
                .leftJoin('fsys_pay_methods AS pm', 'pmh.id_pay_method', 'pm.id')
                .where({
                    'h.id': id,
                    'h.created_by': userId
                })
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

            return response.status(200).json({ data, schedulingData:schedulingData });

        } catch (error) {
            return response.status(500).json({ error });
        }
    }
};