

const dbHandler             = require('../../../database/mysql');

exports.insertSubject       = insertSubject;
exports.getSubject          = getSubject;
exports.updateSubject       = updateSubject;


function getSubject(opts){
    return new Promise((resolve, reject)=>{
     let values = [];   
     let sql = `SELECT * FROM tb_subjects WHERE 1`;

     if(opts.hasOwnProperty('is_deleted')){
        sql += ` AND is_deleted = 0`
     }
     if(opts.subject_id){
        sql += ' AND id = ?';
        values.push(opts.subject_id);
     }
    dbHandler.executeMysqlQuery(sql, values).then((result) => {
       return resolve(result);
     }, (error) => {
       return reject(error);
     });
  })
}

function insertSubject(opts){
    return new Promise((resolve, reject)=> {
      let sql = `INSERT INTO tb_subjects(name, subject_code) VALUES (?, ?)`;

      let values = [opts.name, opts.subject_code];  

      dbHandler.executeMysqlQuery(sql, values).then((result) => {
         return resolve(result);
       }, (error) => {
         return reject(error);
       });
    })
}

function updateSubject(opts){
   return new Promise((resolve, reject)=> {
    let  updateObj = {};
    
    opts.hasOwnProperty('is_deleted')    ?  updateObj.is_deleted    = opts.is_deleted   : 0;
    opts.hasOwnProperty('name')          ?  updateObj.name          = opts.name         : 0;
    opts.hasOwnProperty('subject_code')  ?  updateObj.subject_code  = opts.subject_code : 0;

    let sql = 'UPDATE tb_subjects SET ? WHERE id = ?';

    dbHandler.executeMysqlQuery(sql, [updateObj, opts.subject_id]).then((result) => {
      return resolve(result);
    }, (error) => {
      return reject(error);
    });
  })   
}