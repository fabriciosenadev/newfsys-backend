
exports.up = function(knex) {
  return knex.schema.createTable('fsys_categories', function (table) {
    table.increments();
    table.string('category').notNullable();
    table.enum('applicable',['in','out']).notNullable();
    table.enum('is_custom',['no','yes']).notNullable();
    table.timestamps();
    table.timestamp('deleted_at');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('fsys_categories');
};
