const {Pool} = require('pg');

const connection = new Pool({
  host: 'localhost',
  user: 'postgres',
  password: '#Chad6682',
  database: 'employee_info_db',
  port: 5432
});

module.exports = connection;
