const passport = require('passport');

module.exports = (req, res, next) => {
    passport.authenticate('teacher', function (err, teacher, info) {
        if (err) return next(err);
        if (!teacher) return res.status(401).json({
            message: "Unauthorized Access - No Token Provided!"
        });
        req.teacher = teacher;
        next();
    })(req, res, next);

}