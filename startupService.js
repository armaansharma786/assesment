
const db      = require('./database/mysql');

exports.initialize = initialize;

connection      = undefined;


async function initialize() {
    connection =  await db.initialize();
}