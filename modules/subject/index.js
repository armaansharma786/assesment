
const express        = require('express');
const router         = express.Router();

const validator      = require('./validator/subjectValidator');
const controller     = require('./controller/subjectController');

router.post('/addSubject',        validator.addSubject,      controller.addSubject);
router.put('/deleteSubject',      validator.deleteSubject,   controller.deleteSubject);
router.put('/updateSubject',      validator.updateSubject,   controller.updateSubject);
router.get('/getSubjects',        validator.getSubject,      controller.getSubject);

module.exports = router;