const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;

const StudentModel = require('../controller/login/model/student/student_model');
const TeacherModel = require('../controller/login/model/teacher/teacher_model');

const {
    jwtSecret,
} = require('../util/data');

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: jwtSecret
};

module.exports = passport => {
    passport.use(
        new JwtStrategy(opts, (jwt_payload, done) => {
            StudentModel.findById(jwt_payload.id)
                .then(student => {
                    if (student) return done(null, student);
                    return done(null, false);
                })
                .catch(err => {
                    return done(err, false, {
                        message: 'Server Error'
                    });
                });
            TeacherModel.findById(jwt_payload.id)
                .then(teacher => {
                    if (teacher) return done(null, teacher);
                    return done(null, false);
                })
                .catch(err => {
                    return done(err, false, {
                        message: 'Server Error'
                    });
                });
        })
    );
};