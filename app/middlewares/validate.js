const {
    validationResult
} = require('express-validator');

module.exports = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty) {
        let error = {};
        errors.array().map((err) => error[err.param] = err.message);
        return res.status(422).json({
            error
        });
    }
    next();
}