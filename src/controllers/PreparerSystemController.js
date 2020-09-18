const { json } = require('express');
const { join } = require('../database/connection');
const connection = require('../database/connection');
const { search } = require('../routes');

exports.checkScheduling = async (request, response) => {
    try {
        const { userId } = request.body;

        let today = new Date();
        let year = today.getFullYear();
        let currentMonth = today.getMonth() + 1;
        let month;
        if (currentMonth == 1)
            month = '12';
        else {
            if (currentMonth < 10)
                month = '0' + (currentMonth - 1);
            else
                month = currentMonth - 1;
        }

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
                // verifica se o ano atual é bisexto
                if ((year % 4 == 0) && ((year % 100 != 0) || (year % 400 == 0)))
                    lastDay = '29';
                else
                    lastDay = '28';

                break;
        }

        let fromDate = `${year}-${month}-01`;
        let toDate = `${year}-${month}-${lastDay}`;

        const hasScheduling = await connection('fsys_scheduled_historics as sh')
            .count('sh.id as quantity')
            .join('fsys_historics as h', 'sh.id_historic', 'h.id')
            .where({
                'sh.next_month': 'scheduled',
                'sh.created_by': userId,
                'sh.deleted_at': null
            })
            .andWhereBetween('h.date', [fromDate, toDate])
            .first();

        return response.status(200).json({ hasScheduling });

    } catch (error) {
        return response.status(500).json({ error });
    }
}

exports.createLaunchingScheduled = async (request, response) => {
    try {
        const { userId } = request.body;

        let today = new Date();
        let year = today.getFullYear();
        let currentMonth = today.getMonth() + 1;
        let month;
        if (currentMonth == 1)
            month = '12';
        else {
            if (currentMonth < 10)
                month = '0' + (currentMonth - 1);
            else
                month = currentMonth - 1;
        }

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
                // verifica se o ano atual é bisexto
                if ((year % 4 == 0) && ((year % 100 != 0) || (year % 400 == 0)))
                    lastDay = '29';
                else
                    lastDay = '28';

                break;
        }

        let fromDate = `${year}-${month}-01`;
        let toDate = `${year}-${month}-${lastDay}`;

        const scheduledData = await connection('fsys_scheduled_historics as sh')
            .select('sh.id as idScheduled', 'sh.id_historic as idHistoric')
            .join('fsys_historics as h', 'sh.id_historic', 'h.id')
            .where({
                'sh.next_month': 'scheduled',
                'sh.created_by': userId,
                'sh.deleted_at': null
            })
            .andWhereBetween('h.date', [fromDate, toDate]);

        if (scheduledData.length > 0) {

            let idsHistoric = scheduledData.map(scheduleRet => scheduleRet.idHistoric);

            const launchData = await connection('fsys_historics as h')
                .select(
                    'h.date',
                    'h.id_category',
                    'h.description',
                    'h.value',
                    'h.status',
                    'pmh.id_pay_method'
                )
                .leftJoin(
                    'fsys_pay_method_historics AS pmh',
                    'h.id',
                    'pmh.id_historic'
                )
                .whereIn('h.id', idsHistoric)
                .andWhere('h.created_by', userId);

            for (let i = 0; i < launchData.length; i++) {
                const {
                    date,
                    id_category,
                    description,
                    value,
                    id_pay_method
                } = launchData[i];

                let arrDate = date.split('-');

                if (arrDate[1] == '12')
                    arrDate[1] = '01';
                else {
                    let calcDate = parseInt(arrDate[1]);
                    ++calcDate;
                    if (calcDate < 10)
                        arrDate[1] = '0' + calcDate.toString();
                    else
                        arrDate[1] = calcDate.toString();
                }

                const scheduledDate = arrDate.join('-');

                const idHistoric = await connection('fsys_historics')
                    .insert({
                        date: scheduledDate,
                        description,
                        value,
                        id_category,
                        created_by: userId,
                        created_at: new Date().toISOString(),
                        status: 'pending'
                    });

                await connection('fsys_scheduled_historics')
                    .insert({
                        id_historic: idHistoric[0],
                        next_month: 'scheduled',
                        created_by: userId,
                        created_at: new Date().toISOString()
                    });

                if (id_pay_method) {
                    await connection('fsys_pay_method_historics')
                        .insert({
                            id_pay_method,
                            id_historic: idHistoric[0],
                            created_by: userId,
                            created_at: new Date().toISOString()
                        });
                }
            }

            let idsScheduled = scheduledData.map(scheduleRet => scheduleRet.idScheduled);

            await connection('fsys_scheduled_historics')
                .update('next_month', 'launched')
                .whereIn('id', idsScheduled);

        }

        return response.status(200).json({ month });

    } catch (error) {
        return response.status(500).json({ error });
    }
}