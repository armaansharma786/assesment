

const express        = require('express');
const router         = express.Router();

const validator      = require('./validator/studentValidator');
const controller     = require('./controller/studentController');

router.post('/addRecord',      validator.addRecord,     controller.addRecord);
router.put('/deleteRecord',    validator.deleteRecord,  controller.deleteRecord);
router.get('/getRecords',      validator.getRecords,    controller.getRecords);
router.put('/updateRecords',   validator.updateRecords, controller.updateRecords);

module.exports = router;