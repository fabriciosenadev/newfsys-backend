const moment = require('moment');

exports.checkDate = async (request, response, next) => {

    const { fromDate, toDate } = request.body;
    
    const FromDate = moment(fromDate, 'YYYY-MM-DD', true).isValid();
    const ToDate = moment(toDate, 'YYYY-MM-DD', true).isValid();

    if (!FromDate || !ToDate) {
        return response.status(422).json({ 
            msg: "some date is invalid please verify and try again",
            datesValidation: { FromDate, ToDate }
        });
    }

    const diff = moment(fromDate).isAfter(toDate);

    if(diff)
    {
        return response.status(422).json({ error: "date from cannot be greater than date to" });
    }

    next();
};