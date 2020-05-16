
exports.up = function(knex) {
  return knex.schema.createTable('fsys_pay_method_historics', function (table) {
      table.increments();
      
      table.integer('id_pay_method').notNullable();
      table.integer('id_historic').notNullable();
      
      table.integer('created_by').notNullable();
      table.timestamps();
      table.timestamp('deleted_at');

      table.foreign('created_by').references('fsys_users.id');
      table.foreign('id_historic').references('fsys_historics.id');
      table.foreign('id_pay_method').references('fsys_pay_methods.id');
  });
};

exports.down = function(knex) {
    return knex.schema.dropTable('fsys_pay_method_historics');
};
