/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("users", function (table) {
    table.increments("id").primary();
    table.string("name");
    table.string("username");
    table.string("email");
    table.string("street");
    table.string("suite");
    table.string("city");
    table.string("zipcode");
    table.string("lat");
    table.string("lng");
    table.string("phone");
    table.string("website");
    table.string("company_name");
    table.string("catchPhrase");
    table.string("bs");
    table.json("posts").defaultTo("[]");
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("users");
};
