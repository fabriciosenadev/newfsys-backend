
exports.up = function (knex) {
    return knex.schema.hasColumn('fsys_historics', 'status')
        .then((exists) => {
            if (!exists) {
                return knex.schema.alterTable('fsys_historics', function (table) {
                    table.enum('status', ['paid', 'received', 'pending'])
                        .notNullable().defaultTo('pending');
                });
            }
        });

};

exports.down = function (knex) {
    return knex.schema.hasColumn('fsys_historics', 'status')
        .then((exists) => {
            if (exists) {
                return knex.schema.alterTable('fsys_historics', table => {
                    table.dropColumn('status');
                });
            }
        });
};
