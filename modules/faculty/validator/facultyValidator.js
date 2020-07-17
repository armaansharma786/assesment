
const Joi                 = require('joi');
const validator           = require('../../../validator');

exports.addRecord         = addRecord;
exports.deleteRecord      = deleteRecord;
exports.getRecords        = getRecords;
exports.updateRecords     = updateRecords;

function addRecord(req, res, next){
    const schema = Joi.object().keys({
      first_name    : Joi.string().required(),
      last_name     : Joi.string().optional(),
      dob           : Joi.string().required(),
      email         : Joi.string().email().required(),
      contact_number: Joi.string().optional().min(9).max(10),
      subjects      : Joi.array().optional()
    });
    validator.validateFields(res, schema, req.body, next);
};

function deleteRecord(req, res, next){
  const schema = Joi.object().keys({
    faculty_id: Joi.number().required()
  });
  validator.validateFields(res, schema, req.body, next);
}

function getRecords(req, res, next){
  const schema = Joi.object().keys({
    faculty_id: Joi.number().optional()
  });
  validator.validateFields(res, schema, req.query, next);
}

function updateRecords(req, res, next){
  const schema = Joi.object().keys({
    faculty_id       : Joi.number().required(),
    first_name       : Joi.string().optional(),
    last_name        : Joi.string().optional(),
    contact_number   : Joi.string().optional(),
    dob              : Joi.string().optional(),
    subject_to_remove: Joi.array().optional(),
    subject_to_add   : Joi.array().optional()
  }).or('first_name','last_name', 'contact_number', 'dob', 'subject_to_remove', 'subject_to_add');
  validator.validateFields(res, schema, req.body, next);
}