const express = require('express');
const {
    check
} = require('express-validator');

const StudentAuth = require('../../controller/student/controller/student_auth_controller');
const StudentPassword = require('../../controller/student/controller/student_password_controller');
const validate = require('../../middlewares/validate');
const router = express.Router();

//Student Register
router.post('/register', [
    check('email').isEmail().withMessage('Enter a valid email adress'),
    check('password').not().isEmpty().withMessage('Password can not be empty')
], validate, StudentAuth.register);

//Student Login
router.post('/login', [
    check('email').isEmail().withMessage('Enter a valid email adress'),
    check('password').not().isEmpty().withMessage('Password can not be empty')
], validate, StudentAuth.login);

//Student Email Verification
router.get('/verify/student/:token', StudentAuth.verify);

//Student Email Verification Resend
router.post('/resend', StudentAuth.resendToken);

//Student Password Recover
router.post('/recover', [
    check('email').isEmail().withMessage('Enter a valid email address'),
], validate, StudentPassword.recover);

//Student Password Reset
router.post('/reset', validate, StudentPassword.reset);

//Student Password Reset Otp Code
router.post('/reset/:otpCode', [
    check('password').not().isEmpty().withMessage('Password can not be empty'),
    check('confirmPassword', 'Passwords do not match').custom((value, {
        req
    }) => (value === req.body.password)),
], validate, StudentPassword.resetPassword);

module.exports = router;