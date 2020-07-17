

const dbHandler                     = require('../../../database/mysql');


exports.getFacultyData                = getFacultyData;
exports.insertFacultyData             = insertFacultyData;
exports.updateFacultyRecord           = updateFacultyRecord;
exports.updateFacultySubjectMapping   = updateFacultySubjectMapping;
exports.getFacultySubjectsMapping     = getFacultySubjectsMapping;
exports.insertFacultySubjectMapping   = insertFacultySubjectMapping;


function getFacultyData(opts){
    return new Promise((resolve, reject)=>{
     let values = [];   
     let sql = `SELECT * FROM tb_faculty WHERE 1`;

     if(opts.hasOwnProperty('is_deleted')){
       sql += ` AND is_deleted = 0`
     }
     if(opts.contact_number){
       sql += ` AND contact_number = ?`;
       values.push(opts.contact_number);
     }
     if(opts.faculty_id){
       sql += ' AND id = ?';
       values.push(opts.faculty_id);
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

function insertFacultyData(opts){
    return new Promise((resolve, reject)=> {
      let sql = `INSERT INTO tb_faculty(first_name, last_name, email, dob, contact_number) 
                 VALUES (?, ?, ?, ?, ?)`;

      let values = [opts.first_name, opts.last_name, opts.email, opts.dob, opts.contact_number];  

      dbHandler.executeMysqlQuery(sql, values).then((result) => {
        return resolve(result);
       }, (error) => {
        return reject(error);
       });
    })
}

function insertFacultySubjectMapping(opts){
    return new Promise((resolve, reject)=> {
      let subjects = opts.subjects;
      let values   = [];

      let placeHolders = new Array(subjects.length).fill("(?,?)").join(', ');
       for (let i = 0; i < subjects.length; i++) {
        values = values.concat([opts.faculty_id, subjects[i]]);
       }
       let sql = `INSERT INTO tb_faculty_subjects_mapping(faculty_id, subject_id) VALUES ${placeHolders} ON DUPLICATE KEY UPDATE is_deleted = 0`;

       dbHandler.executeMysqlQuery(sql, values).then((result) => {
       return resolve(result);
      }, (error) => {
       return reject(error);
      });
    })
}


function updateFacultyRecord(opts){
   return new Promise((resolve, reject)=> {
    let updateObj = {};
    opts.hasOwnProperty('is_deleted')     ?  updateObj.is_deleted     = opts.is_deleted     : 0;
    opts.hasOwnProperty('first_name')     ?  updateObj.first_name     = opts.first_name     : 0;
    opts.hasOwnProperty('last_name')      ?  updateObj.last_name      = opts.last_name      : 0;
    opts.hasOwnProperty('contact_number') ?  updateObj.contact_number = opts.contact_number : 0;
    opts.hasOwnProperty('dob')            ?  updateObj.dob            = opts.dob            : 0;
   

    let sql = 'UPDATE tb_faculty SET ? WHERE id = ?';

    dbHandler.executeMysqlQuery(sql, [updateObj, opts.faculty_id]).then((result) => {
        return resolve(result);
       }, (error) => {
        return reject(error);
       });
    })   
}

function updateFacultySubjectMapping(opts){
    return new Promise((resolve, reject)=> {
      let updateObj = {};
      opts.hasOwnProperty('is_deleted') ?  updateObj.is_deleted = opts.is_deleted : 0;
  
      let sql = 'UPDATE tb_faculty_subjects_mapping SET ? WHERE faculty_id = ?';
      let values = [updateObj, opts.faculty_id];
      
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


function getFacultySubjectsMapping(opts){
    return new Promise((resolve, reject)=> {
      let values = [];  
      let sql = `SELECT 
                  ts.id AS subject_id,
                  ts.name,
                  ts.subject_code,
                  tfsm.faculty_id
                FROM
                  tb_faculty_subjects_mapping tfsm 
                INNER JOIN 
                  tb_subjects ts 
                ON 
                  tfsm.subject_id = ts.id 
                WHERE 1`;

      if(opts.faculty_ids){
        sql += ` AND tfsm.faculty_id IN (?)`;
        values.push(opts.faculty_ids);
      }
      if(opts.hasOwnProperty('is_deleted')){
        sql += ` AND tfsm.is_deleted = ?`;
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