//  creates the connection between your Node.js backend and PostgreSQL.
const { Pool } = require("pg");
const env = require("../config/env");

const pool = new Pool({
  connectionString: env.databaseUrl,
});

module.exports = pool;