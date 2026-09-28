// centralizing .env
require("dotenv").config();

const env = {
  port: process.env.PORT || 5050,
  databaseUrl: process.env.DATABASE_URL,
};

if (!env.databaseUrl) {
  throw new Error("DATABASE_URL is not defined");
}

module.exports = env;