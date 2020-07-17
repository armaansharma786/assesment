
const _                  = require('underscore');

const response           = require('../../../properties/response');
const studentService     = require('../service/studentService');

exports.addRecord        = addRecord;
exports.deleteRecord     = deleteRecord;
exports.getRecords       = getRecords;
exports.updateRecords    = updateRecords;

async function addRecord(req, res){
    try{
      let first_name     = req.body.first_name;
      let last_name      = req.body.last_name || null;
      let dob            = req.body.dob;
      let contact_number = req.body.contact_number;
      let email          = req.body.email;
      let student_class  = req.body.class;
      let subjects       = req.body.subjects || [];
      let checkStudentExist = await studentService.getStudentData({email, contact_number, is_deleted: 0});
      if(!_.isEmpty(checkStudentExist)){
          if(checkStudentExist[0].email == email){
            throw('Student Already Exist with given email');
          }
        throw('Student Already Exist with given contact number');
      }
      let insertStudentData = await studentService.insertStudentData({first_name, last_name, dob, contact_number, email, student_class});
      if(subjects.length){
        await studentService.insertStudentSubjectMapping({student_id: insertStudentData.insertId, subjects});
      }
      return response.actionCompleteResponse(res,{student_id: insertStudentData.insertId});
    }catch(error){
      return response.sendError(res, error); 
    }
}

async function deleteRecord(req, res){
    try{
      let student_id        = req.body.student_id; 
      let checkStudentExist = await studentService.getStudentData({student_id});
      if(_.isEmpty(checkStudentExist)){
        throw("Invalid Student Data");
      }
      if(!_.isEmpty(checkStudentExist) && checkStudentExist[0].is_deleted){
        throw('Student with given data is already deleted');
      }  
      let compositeQuery = Promise.all([
        studentService.updateStudentRecord({is_deleted: 1, student_id}),
        studentService.updateStudentSubjectMapping({is_deleted: 1, student_id})
       ]);
      
       let result  = await compositeQuery;
      
        return response.actionCompleteResponse(res);
      }catch(error){
         return response.sendError(res, error); 
      }
}

async function getRecords(req, res){
    try{
      let student_id = req.query.student_id || null; 
      let studentDetails = await studentService.getStudentData({student_id, is_deleted: 0});
      let student_ids = studentDetails.map(x => x["id"]);
      if(_.isEmpty(student_ids)){
        return response.actionCompleteResponse(res);
      }
      let getSubjectMapping = await studentService.getStudentsSubjectsMapping({student_ids: student_ids, is_deleted: 0});
      let studentSubjectMap = {}; 
      for(let i = 0; i < getSubjectMapping.length; i++){
        if(!studentSubjectMap[getSubjectMapping[i].student_id]){
          studentSubjectMap[getSubjectMapping[i].student_id] = [getSubjectMapping[i]];
        }else{
          studentSubjectMap[getSubjectMapping[i].student_id].push(getSubjectMapping[i]);
        }
      }
      for(let i = 0; i < studentDetails.length; i++){
        if(studentSubjectMap[studentDetails[i].id]){
          studentDetails[i].subjects = studentSubjectMap[studentDetails[i].id];
        }else{
          studentDetails[i].subjects = [];
        }
      }
      return response.actionCompleteResponse(res, studentDetails);
    }catch(error){
      return response.sendError(res, error); 
    }
}



async function updateRecords(req, res){
    try{
      let student_id        = req.body.student_id;
      let contact_number    = req.body.contact_number;
      let subject_to_remove = req.body.subject_to_remove || [];
      let subject_to_add    = req.body.subject_to_add || [];
      if(contact_number){
        let checkNumberExist = await studentService.getStudentData({contact_number, is_deleted: 0});
        if(!_.isEmpty(checkNumberExist)){
          throw("contact number already exist");
        }
      }   
      await studentService.updateStudentRecord(req.body);
      if(!_.isEmpty(subject_to_remove)){
        await studentService.updateStudentSubjectMapping({is_deleted: 1, student_id, subject_ids: subject_to_remove});
      }
      if(!_.isEmpty(subject_to_add)){
        await studentService.insertStudentSubjectMapping({student_id, subjects: subject_to_add});
      }
      return response.actionCompleteResponse(res); 
    }catch(error){
      return response.sendError(res, error.toString()); 
    }
}