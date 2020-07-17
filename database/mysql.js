

const mysql     = require('mysql');


function initialize() {
  let numConnectionsInPool = 0;
  let conn = mysql.createPool({
    connectionLimit : 150,
    host            : 'localhost',
    user            : 'root',
    password        : '123',
    database        : 'assesment',
    port            : 3307,
    charset         : "utf8mb4"
  });
  conn.on('connection', function (connection) {
    numConnectionsInPool++;
    console.log('CONNECTION IN POOL : ', numConnectionsInPool);
  });
  conn.on('error', function (error) {
    return initialize();
  });
  return conn;
}

exports.executeMysqlQuery = function(query, values){
    return new Promise((resolve, reject) => {
      const start = new Date();
      console.log(query, values);
      connection.query(query, values, (err, result) => {

        console.log(err, result);
        if(err && (err.code === 'ER_LOCK_DEADLOCK' || err.code === 'ER_QUERY_INTERRUPTED')) {
          setTimeout(() => {
            module.exports.executeQuery(query, values)
              .then(result => resolve(result), (error, result) => reject(error, result));
          }, 50);
        } else if(err){
          return reject(err, result);
        } else {
          return resolve(result);
        }
      });
    });
  }

module.exports.initialize = initialize;

