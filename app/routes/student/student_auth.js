const express = require('express');
const {
    check
} = require('express-validator');

const StudentAuth = require('../../controller/login/student/student_auth_controller');
const StudentPassword = require('../../controller/login/student/student_password_controller');
const validate = require('../../middlewares/validate');
const router = express.Router();

//Student Email
router.post('/register', [
    check('email').isEmail().withMessage('Enter a valid email adress'),
    check('password').not().isEmpty().isLength({
        min: 6
    }).withMessage('Must be at least 6 chars long')
], validate, StudentAuth.register);

//Student Login
router.post('/login', [
    check('email').isEmail().withMessage('Enter a valid email adress'),
    check('password').not().isEmpty().isLength({
        min: 6
    }).withMessage('Must be at least 6 chars long')
], validate, StudentAuth.login);

//Student Email Verification
router.get('/verify/:token', StudentAuth.verify);
router.post('/resend', StudentAuth.resendToken);

//Student Password RESET
router.post('/recover', [
    check('email').isEmail().withMessage('Enter a valid email address'),
], validate, StudentPassword.recover);

router.post('/reset', validate, StudentPassword.reset);

router.post('/reset/:otpCode', [
    check('password').not().isEmpty().isLength({
        min: 6
    }).withMessage('Must be at least 6 chars long'),
    check('confirmPassword', 'Passwords do not match').custom((value, {
        req
    }) => (value === req.body.password)),
], validate, StudentPassword.resetPassword);

module.exports = router;