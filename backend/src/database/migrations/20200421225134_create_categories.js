
exports.up = function(knex) {
  return knex.schema.createTable('categories', function (table) {
    table.increments();
    table.string('category').notNullable();
    table.string('applicable').notNullable();

    table.timestamps();
    table.timestamp('deleted_at');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('categories');
};