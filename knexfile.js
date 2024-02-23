// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
// knexfile.js
require("dotenv").config();

module.exports = {
  development: {
    client: "mssql",
    connection: {
      server: process.env.DEV_SERVER,
      user: process.env.DEV_DB_USER,
      password: process.env.DEV_DB_PASSWORD,
      database: process.env.DEV_DB_NAME,
    },
    migrations: {
      tableName: "knex_migrations",
      directory: "./migrations",
    },
  },

  staging: {
    client: "mssql",
    connection: {
      server: process.env.STAGING_SERVER,
      user: process.env.STAGING_DB_USER,
      password: process.env.STAGING_DB_PASSWORD,
      database: process.env.STAGING_DB_NAME,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
      directory: "./migrations",
    },
  },

  production: {
    client: "mssql",
    connection: {
      server: process.env.PRODUCTION_SERVER,
      user: process.env.PRODUCTION_DB_USER,
      password: process.env.PRODUCTION_DB_PASSWORD,
      database: process.env.PRODUCTION_DB_NAME,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
      directory: "./migrations",
    },
  },
};
