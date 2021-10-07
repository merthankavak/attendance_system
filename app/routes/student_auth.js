const express = require('express');
const {
    check
} = require('express-validator');

const StudentAuth = require('../controller/login/student_auth_controller');
const validate = require('../middlewares/validate');

const router = express.Router();

router.post('/register', [
    check('email').isEmail().withMessage('Enter a valid email adress'),
    check('password').not().isEmpty().isLength({
        min: 6
    }).withMessage('Must be at least 6 chars long')
], validate, StudentAuth.register);

router.post('/login', [
    check('email').isEmail().withMessage('Enter a valid email adress'),
    check('password').not().isEmpty().isLength({
        min: 6
    }).withMessage('Must be at least 6 chars long')
], validate, StudentAuth.login);

router.get('verify/student/:token', StudentAuth.verify);

module.exports = router;