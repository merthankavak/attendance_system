const StudentAuthRoute = require('./auth/student_auth_route');
const TeacherAuthRoute = require('./auth/teacher_auth_route');
const StudentRoute = require('./student/student_route');
const TeacherRoute = require('./teacher/teacher_route');

const StudentAuth = require('../middlewares/auth/student_auth');
const TeacherAuth = require('../middlewares/auth/teacher_auth');

module.exports = app => {
    app.use('/api/auth/student', StudentAuthRoute);
    app.use('/api/student', StudentAuth, StudentRoute);
    app.use('/api/auth/teacher', TeacherAuthRoute);
    app.use('/api/teacher', TeacherAuth, TeacherRoute);
}