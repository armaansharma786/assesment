
const Joi                = require('joi');

exports.validateFields   = validateFields;

function validateFields(res, schema, body, next){
    Joi.validate(body, schema, function (err, value) { 
        if (err) 
         {               
           return res.status(400).send({
            message: 'Insufficient information was supplied. Please check and try again.',
            status: 400,
            data: err.details[0].message.replace(/["]/ig, ''),
            });
         }           
          next();//call next middleware in Api
    }); 
}

  