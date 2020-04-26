
exports.up = function(knex) {
    return knex.schema.createTable('fsys_historics',  function (table) {
        table.increments();
    
        table.date('date').notNullable();
        table.string('description').notNullable();
        table.decimal('value').notNullable();

        table.integer('id_category').notNullable();
        table.integer('id_pay_method').notNullable();        
        
        table.integer('created_by').notNullable();
        table.timestamps();
        table.timestamp('deleted_at');
        
        table.foreign('created_by').references('fsys_users.id');
        table.foreign('id_category').references('fsys_categories.id');
        table.foreign('id_pay_method').references('fsys_pay_methods.id');
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('fsys_historics');
};
