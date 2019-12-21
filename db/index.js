//Connect pool to the sgt_m4_final database

const mysql = require('mysql2');
const config = require('../config/db.json');

const pool = mysql.createPool(config);

const db = pool.promise();

//exports the connection pool to be used in other files
module.exports = db;



