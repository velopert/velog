require('dotenv').config();
const db = require('database/db').default;
const sync = require('database/sync').default;


const migrate = async () => {
  await db.authenticate();
  sync();
};

migrate();
