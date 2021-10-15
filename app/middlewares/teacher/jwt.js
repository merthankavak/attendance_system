const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;

const TeacherModel = require('../../controller/login/model/teacher/teacher_model');

const {
    jwtSecret,
} = require('../../util/data');

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: jwtSecret
};

module.exports = passport => {
    passport.use(
        new JwtStrategy('teacher', opts, (jwt_payload, done) => {
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