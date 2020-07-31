const connection = require('../database/connection');

module.exports = {
    async store(request, response) {
        try {
            const { userId, category, applicable } = request.body;
            let categoryId;
            
            const existsCategory = await connection('fsys_categories')
                .select('id')
                .where({
                    category: category,
                    applicable: applicable
                })
                .first();

            if (existsCategory === undefined) {
                // insert new category
                categoryId = await connection('fsys_categories')
                    .insert({
                        category,
                        applicable,
                        is_custom: 'yes',
                        created_at: new Date().toISOString()
                    });
            }
            else categoryId = existsCategory.id;

            const existsRelation = await connection('fsys_category_users')
                .select('id')
                .where({
                    id_category: categoryId,
                    id_user: userId
                })
                .first();

            if (existsRelation !== undefined) {
                return response.status(422).json({ msg: "Esta categoria já existe!" })
            }

            //insert relation
            const isSaved = await connection('fsys_category_users')
                .insert({
                    id_user: userId,
                    id_category: categoryId[0] ? categoryId[0]: categoryId,
                    created_by: userId,
                    created_at: new Date().toISOString()
                });

            return response.status(200).json({ success: "Dados salvos com sucesso", categoryId });

        } catch (error) {
            return response.status(500).json({ error });
        }
    },

    async destroy(request, response) {

        try {
            const { id } = request.params;

            const { userId } = request.body;

            const isDeleted = await connection('fsys_category_users')
                .update({
                    deleted_at: new Date().toISOString(),
                })
                .where({
                    id_category: id,
                    id_user: userId
                })
            
            return response.status(200).json({ success: "Dados removidos com sucesso" });

        }
        catch (error) {
            return response.status(500).json({ error });
        }
    }
}