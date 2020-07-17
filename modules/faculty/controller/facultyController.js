
const _                   = require('underscore');

const response            = require('../../../properties/response');
const facultyService      = require('../service/facultyService');

exports.addRecord         = addRecord;
exports.deleteRecord      = deleteRecord;
exports.getRecords        = getRecords;
exports.updateRecords     = updateRecords;

async function addRecord(req, res){
    try{
      let first_name     = req.body.first_name;
      let last_name      = req.body.last_name || null;
      let dob            = req.body.dob;
      let contact_number = req.body.contact_number;
      let email          = req.body.email;
      let subjects       = req.body.subjects || [];
      let checkFacultyExist = await facultyService.getFacultyData({email, contact_number, is_deleted: 0});
      if(!_.isEmpty(checkFacultyExist)){
        if(checkFacultyExist[0].email == email){
          throw('Faculty Already Exist with given email');
        }
        throw('Faculty Already Exist with given contact number');
      }
      let insertFacultyData = await facultyService.insertFacultyData({first_name, last_name, dob, contact_number, email});
      if(subjects.length){
        await facultyService.insertFacultySubjectMapping({faculty_id: insertFacultyData.insertId, subjects});
      }
      return response.actionCompleteResponse(res,{faculty_id: insertFacultyData.insertId});
    }catch(error){
      return response.sendError(res, error.toString()); 
    }
}

async function deleteRecord(req, res){
    try{
      let faculty_id        = req.body.faculty_id; 
      let checkFacultyExist = await facultyService.getFacultyData({faculty_id});
      if(_.isEmpty(checkFacultyExist)){
        throw("Invalid Faculty Data");
      }
      if(!_.isEmpty(checkFacultyExist) && checkFacultyExist[0].is_deleted){
        throw('Faculty with given data is already deleted');
      }
      let compositeQuery = Promise.all([
        facultyService.updateFacultyRecord({is_deleted: 1, faculty_id}),
        facultyService.updateFacultySubjectMapping({is_deleted: 1, faculty_id})
      ]);
      let result = await compositeQuery;
      return response.actionCompleteResponse(res);
      }catch(error){
        return response.sendError(res, error.toString()); 
      }
}

async function getRecords(req, res){
    try{
      let faculty_id = req.query.faculty_id || null;
      let facultyDetails = await facultyService.getFacultyData({faculty_id, is_deleted: 0});

      let faculty_ids = facultyDetails.map(x => x["id"]);
      if(_.isEmpty(faculty_ids)){
        return response.actionCompleteResponse(res);
      }
      let getSubjectMapping = await facultyService.getFacultySubjectsMapping({faculty_ids: faculty_ids, is_deleted: 0});
      let facultySubjectMap = {}; 
      for(let i = 0; i < getSubjectMapping.length; i++){
        if(!facultySubjectMap[getSubjectMapping[i].faculty_id]){
          facultySubjectMap[getSubjectMapping[i].faculty_id] = [getSubjectMapping[i]];
        }else{
          facultySubjectMap[getSubjectMapping[i].faculty_id].push(getSubjectMapping[i]);
        }
      }
      for(let i = 0; i < facultyDetails.length; i++){
        if(facultySubjectMap[facultyDetails[i].id]){
          facultyDetails[i].subjects = facultySubjectMap[facultyDetails[i].id];
        }else{
          facultyDetails[i].subjects = [];
        }
      }
      return response.actionCompleteResponse(res, facultyDetails);
    }catch(error){
        return response.sendError(res, error.toString()); 
    }
}



async function updateRecords(req, res){
    try{
      let faculty_id        = req.body.faculty_id;
      let contact_number    = req.body.contact_number;
      let subject_to_remove = req.body.subject_to_remove || [];
      let subject_to_add    = req.body.subject_to_add || [];

      let checkFacultyExist = await facultyService.getFacultyData({faculty_id, is_deleted: 0});
      if(_.isEmpty(checkFacultyExist)){
        throw("Invalid Faculty Id");
      }
      if(contact_number && checkFacultyExist[0].contact_number == contact_number){
        throw("Number Already Exist");
      }
      await facultyService.updateFacultyRecord(req.body);  
      if(!_.isEmpty(subject_to_remove)){
        await facultyService.updateFacultySubjectMapping({is_deleted: 1, faculty_id, subject_ids: subject_to_remove});
      }
      if(!_.isEmpty(subject_to_add)){
        await facultyService.insertFacultySubjectMapping({faculty_id, subjects: subject_to_add});
      }
      return response.actionCompleteResponse(res); 
    }catch(error){
      return response.sendError(res, error.toString()); 
    }
}