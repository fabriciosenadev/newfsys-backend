const moment = require('moment');

exports.checkDate = async (request, response, next) => {

    const { fromDate, toDate } = request.query;
    
    const FromDate = moment(fromDate, 'YYYY-MM-DD', true).isValid();
    const ToDate = moment(toDate, 'YYYY-MM-DD', true).isValid();

    if (!FromDate || !ToDate) {
        return response.status(422).json({ 
            msg: "Alguma data é inválida, por favor verifique e tente novamente"
        });
    }

    const diff = moment(fromDate).isAfter(toDate);

    if(diff)
    {
        return response.status(422).json({ msg: "Data 'De' não pode ser maior que data 'Para'" });
    }

    next();
};