const StudentAuth = require('./student_auth');

module.exports = app => {
    app.use('/api/auth/student/', StudentAuth);
}