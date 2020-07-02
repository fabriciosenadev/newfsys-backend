const connection = require('../database/connection');

module.exports = {
    async categories(request, response) {
        try {
            const { userId } = request.body;
            const { applicable } = request.params;
            
            const categories = await connection('fsys_categories AS c')
                .select('c.id', 'c.category')
                .innerJoin('fsys_category_users AS cu', 'c.id', 'cu.id_category')
                .where('cu.id_user', '=', userId)
                .andWhere('c.applicable', '=', applicable)
                .whereNull('cu.deleted_at');

            return response.status(200).json({ categories });

        } catch (error) {
            return response.status(500).json({ error });
        }
    },
    async userInfo(request, response) {
        try {
            const { userId } = request.body;
                        
            const data = await connection('fsys_users')
                .select('full_name').where('id','=', userId).first();
            
            return response.status(200).json({ data });
        } catch (error) {
            return response.status(500).json({ error });
        }
    }
};