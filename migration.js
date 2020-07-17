
var mysql     = require('mysql');
var migration = require('mysql-migrations');

var connection = mysql.createPool({
  host     : 'localhost',
  user     : 'root',
  password : '123',
  database : 'assesment',
  port : 3307
});

migration.init(connection, __dirname + '/migrations');