
const _                  = require('underscore');

const response           = require('../../../properties/response');
const subjectService     = require('../service/subjectService');


exports.addSubject       = addSubject;
exports.deleteSubject    = deleteSubject;
exports.getSubject       = getSubjects;
exports.updateSubject    = updateSubject;


async function addSubject(req, res){
    try{
      let name         = req.body.name;
      let subject_code = req.body.subject_code;

      let insertSubject = await subjectService.insertSubject({name, subject_code});
      return response.actionCompleteResponse(res,{subject_id: insertSubject.insertId});
    }catch(error){
      return response.sendError(res, error.toString()); 
    }
}

async function deleteSubject(req, res){
    try{
      let subject_id        = req.body.subject_id; 
      let checkSubjectExist = await subjectService.getSubject({subject_id});
      if(_.isEmpty(checkSubjectExist)){
        throw("Invalid Subject Data");
      }
      if(!_.isEmpty(checkSubjectExist) && checkSubjectExist[0].is_deleted){
        throw('Subject with given data has already deleted');
      }
      await subjectService.updateSubject({is_deleted: 1, subject_id});
      return response.actionCompleteResponse(res);
    }catch(error){
      return response.sendError(res, error); 
    }
}

async function getSubjects(req, res){
    try{
      let subject_id = req.query.subject_id || null;
      
      let subjectDetails = await subjectService.getSubject({subject_id, is_deleted: 0});
      return response.actionCompleteResponse(res, subjectDetails);
    }catch(error){
      return response.sendError(res, error.toString()); 
    }
}

async function updateSubject(req, res){
    try{
      let subject_id = req.body.subject_id; 
      let checkSubjectExist = await subjectService.getSubject({subject_id, is_deleted: 0});
      if(_.isEmpty(checkSubjectExist)){
        throw("Invalid Subject Id");
      }  
      await subjectService.updateSubject(req.body);
      return response.actionCompleteResponse(res); 
    }catch(error){
      return response.sendError(res, error.toString()); 
    }
}