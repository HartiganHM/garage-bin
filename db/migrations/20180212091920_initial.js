exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('garage_items', function(table) {
      table.increments('id').primary();
      table.string('name');
      table.string('reason');
      table.string('cleanliness');
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([knex.schema.dropTable('garage_items')]);
};
