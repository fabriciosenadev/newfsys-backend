
exports.up = function (knex) {
    return knex.schema.createTable('fsys_user_amounts', function (table) {
        table.increments();

        table.integer('id_user').notNullable();
        table.decimal('amount_available').notNullable();
        
        table.timestamps();

        table.foreign('id_user').references('fsys_users.id');
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('fsys_user_amounts');
};
