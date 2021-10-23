const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;

const TeacherModel = require('../../controller/teacher/model/teacher_model');

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT
};

module.exports = passport => {
    passport.use('teacher',
        new JwtStrategy(opts, (jwt_payload, done) => {
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