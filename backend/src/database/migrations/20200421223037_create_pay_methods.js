
exports.up = function(knex) {
  return knex.schema.createTable('pay_methods', function (table) {
    table.increments();
    table.string('pay_method').notNullable();
    table.enum('applicable', ['wallet','account','credit']).notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('pay_methods');
};
