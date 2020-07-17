const express = require('express');

const student                  = require('./modules/student/index');
const faculty                  = require('./modules/faculty/index');
const subject                  = require('./modules/subject/index');

const startupService = require('./startupService');

const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); 
app.use('/student', student);
app.use('/faculty', faculty);
app.use('/subject', subject);

startupService.initialize();
const port = 3219;

app.listen(port,()=>console.log(`listening on port ${port}...`));