
exports.up = function(knex) {
  return knex.schema.createTable('fsys_category_users', function (table) {
    table.increments();

    table.integer('id_user').notNullable();
    table.integer('id_category').notNullable();
    table.integer('created_by').notNullable();
    
    table.timestamps();
    table.timestamp('deleted_at');
    
    table.foreign('created_by').references('fsys_users.id');
    table.foreign('id_category').references('fsys_categories.id');
    table.foreign('id_category').references('fsys_categories.id');
  });
};

exports.down = function(knex) {
    return knex.schema.dropTable('fsys_category_users');
};
