const jwt = require('jsonwebtoken');
require('dotenv-safe').config({
    allowEmptyValues: true,
    path: '../.env'
});

module.exports = {
    /**
     * function to verify token and allown use the system
     * @param { auth_pass } request.headers
     * @param { auth_pass } request.
     * @param { auth, error } response 
     * @param { request } next 
     */
    async byPass (request, response, next)
    {
        try
        {
            let auth = false;
            const { auth_pass } = request.headers;
            
            if(!auth_pass)
            {
                return response.status(401).json({ 
                    auth, 
                    error: "No token provided"
                });
            }
            jwt.verify(auth_pass, process.env.SECRET, function(error, decoded){
                if(error) return response.status(500).json({ auth, error });
                               
                request.body.userId = decoded.id;
                
                next();
            });
        }
        catch (error)
        {
            return response.status(500).json(error);
        }
    },
};
