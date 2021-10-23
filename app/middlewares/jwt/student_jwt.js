const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;

const StudentModel = require('../../controller/student/model/student_model');

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT
};

module.exports = passport => {
    passport.use('student',
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
        })
    );
};