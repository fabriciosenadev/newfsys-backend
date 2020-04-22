
exports.up = function(knex) {
  return knex.schema.createTable('pay_methods', function (table) {
    table.increments();
    table.string('pay_method');
    table.enum('applicable', ['wallet','account','credit']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('pay_methods');
};
