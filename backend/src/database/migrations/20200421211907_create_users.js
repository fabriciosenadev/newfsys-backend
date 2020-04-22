
exports.up = function(knex) {
  return knex.schema.createTable('users', function (table) {
    // ID  
    table.increments();
    // user fields
    table.string('full_name').notNullable();
    table.string('email').notNullable();
    table.string('password').notNullable();
    // date fields
    table.timestamps();
    table.timestamp('deleted_at');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('users');
};
