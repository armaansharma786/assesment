

const dbHandler                        = require('../../../database/mysql');


exports.getStudentData                 = getStudentData;
exports.insertStudentData              = insertStudentData;
exports.updateStudentRecord            = updateStudentRecord;
exports.updateStudentSubjectMapping    = updateStudentSubjectMapping;
exports.insertStudentSubjectMapping    = insertStudentSubjectMapping;
exports.getStudentsSubjectsMapping     = getStudentsSubjectsMapping;

function getStudentData(opts){
    return new Promise((resolve, reject)=>{
     let values = [];   
     let sql = `SELECT * FROM tb_students WHERE 1`;

     if(opts.hasOwnProperty('is_deleted')){
        sql += ` AND is_deleted = 0`
     }
     if(opts.contact_number){
         sql += ` AND contact_number = ?`;
         values.push(opts.contact_number);
     }
     if(opts.student_id){
        sql += ' AND id = ?';
        values.push(opts.student_id);
     }
     if(opts.email && opts.contact_number){
        sql += ` AND (contact_number = ? OR email = ?)`;
        values.push(opts.contact_number, opts.email);
     }
    dbHandler.executeMysqlQuery(sql, values).then((result) => {
        return resolve(result);
       }, (error) => {
        return reject(error);
      });
  })
}

function insertStudentData(opts){
    return new Promise((resolve, reject)=> {
      let sql = `INSERT INTO tb_students(first_name, last_name, email, class, dob, contact_number) 
                 VALUES (?, ?, ?, ?, ?, ?)`;

      let values = [opts.first_name, opts.last_name, opts.email, opts.student_class, opts.dob, opts.contact_number];  

      dbHandler.executeMysqlQuery(sql, values).then((result) => {
        return resolve(result);
       }, (error) => {
        return reject(error);
       });
    })
}

function insertStudentSubjectMapping(opts){
    return new Promise((resolve, reject)=> {
      let subjects = opts.subjects;
      let values   = [];

      let placeHolders = new Array(subjects.length).fill("(?,?)").join(', ');
       for (let i = 0; i < subjects.length; i++) {
          values = values.concat([opts.student_id, subjects[i]]);
       }
       let sql = `INSERT INTO tb_students_subjects_mapping(student_id, subject_id) VALUES ${placeHolders} ON DUPLICATE KEY UPDATE is_deleted = 0`;

       dbHandler.executeMysqlQuery(sql, values).then((result) => {
       return resolve(result);
      }, (error) => {
       return reject(error);
      });
    })
}


function updateStudentRecord(opts){
   return new Promise((resolve, reject)=> {
    let updateObj = {};
    opts.hasOwnProperty('is_deleted')     ?  updateObj.is_deleted     = opts.is_deleted     : 0;
    opts.hasOwnProperty('first_name')     ?  updateObj.first_name     = opts.first_name     : 0;
    opts.hasOwnProperty('last_name')      ?  updateObj.last_name      = opts.last_name      : 0;
    opts.hasOwnProperty('contact_number') ?  updateObj.contact_number = opts.contact_number : 0;
    opts.hasOwnProperty('class')          ?  updateObj.class          = opts.class          : 0;
    opts.hasOwnProperty('dob')            ?  updateObj.dob            = opts.dob            : 0;
   

    let sql = 'UPDATE tb_students SET ? WHERE id = ?';

    dbHandler.executeMysqlQuery(sql, [updateObj, opts.student_id]).then((result) => {
        return resolve(result);
       }, (error) => {
        return reject(error);
       });
    })   
}

function updateStudentSubjectMapping(opts){
    return new Promise((resolve, reject)=> {
      let updateObj = {};
      opts.hasOwnProperty('is_deleted') ?  updateObj.is_deleted = opts.is_deleted : 0;
  
      let sql = 'UPDATE tb_students_subjects_mapping SET ? WHERE student_id = ?';
      let values = [updateObj, opts.student_id];
      
      if(opts.subject_ids){
        sql += ` AND subject_id IN (?)`;
        values.push(opts.subject_ids);
      }
      dbHandler.executeMysqlQuery(sql, values).then((result) => {
          return resolve(result);
        }, (error) => {
          return reject(error);
        });
    })   
}

function getStudentsSubjectsMapping(opts){
    return new Promise((resolve, reject)=> {
       let sql = `SELECT ts.id AS subject_id, ts.name, ts.subject_code, tssm.student_id FROM tb_students_subjects_mapping tssm INNER JOIN tb_subjects ts ON tssm.subject_id = ts.id WHERE 1`;
       let values = [];
       
       if(opts.students_ids){
          sql += ` AND tssm.student_id IN (?)`;
          values.push(opts.students_ids);
       }
       if(opts.hasOwnProperty('is_deleted')){
          sql += ` AND tssm.is_deleted = ?`;
          values.push(opts.is_deleted);
       }
       sql += ` AND ts.is_deleted = 0`
       dbHandler.executeMysqlQuery(sql, values).then((result) => {
         return resolve(result);
       }, (error) => {
         return reject(error);
       });
    })
}