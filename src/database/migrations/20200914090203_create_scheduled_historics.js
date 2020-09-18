
exports.up = function (knex) {
    return knex.schema.createTable('fsys_scheduled_historics', function (table) {
        table.increments();

        table.integer('id_historic').notNullable();
        table.enum('next_month', ['scheduled', 'launched']).notNullable();

        table.integer('created_by').notNullable();
        table.timestamps();
        table.timestamp('deleted_at');

        table.foreign('created_by').references('fsys_users.id');
        table.foreign('id_historic').references('fsys_historics.id');
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('fsys_users');
};
