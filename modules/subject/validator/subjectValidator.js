
const Joi                = require('joi');
const validator          = require('../../../validator');


exports.addSubject       = addSubject;
exports.deleteSubject    = deleteSubject;
exports.getSubject       = getSubject;
exports.updateSubject    = updateSubject;


function addSubject(req, res, next){
    const schema = Joi.object().keys({
      name        : Joi.string().required(),
      subject_code: Joi.string().required(),
    });

    validator.validateFields(res, schema, req.body, next);
};


function deleteSubject(req, res, next){
  const schema = Joi.object().keys({
    subject_id: Joi.number().required()
  });

  validator.validateFields(res, schema, req.body, next);
}


function getSubject(req, res, next){
  const schema = Joi.object().keys({
    subject_id: Joi.number().optional()
  });

  validator.validateFields(res, schema, req.query, next);
}


function updateSubject(req, res, next){
  const schema = Joi.object().keys({
    subject_id    : Joi.number().required(),
    name          : Joi.string().optional(),
    subject_code  : Joi.string().optional()
  }).or('name',   'subject_code');
  validator.validateFields(res, schema, req.body, next);
}