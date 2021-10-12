const studentAuth = require('./student/student_auth');
const student = require('./student/student');
const teacherAuth = require('./student/student_auth');
const teacher = require('./student/student');
const authenticate = require('../middlewares/authenticate');

module.exports = app => {
    app.use('/api/auth/student', studentAuth);
    app.use('/api/student', authenticate, student);
    app.use('/api/auth/teacher', teacherAuth);
    app.use('/api/teacher', authenticate, teacher);


}