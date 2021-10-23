const express = require('express');
const {
    check
} = require('express-validator');

const TeacherAuth = require('../../controller/teacher/controller/teacher_auth_controller');
const TeacherPassword = require('../../controller/teacher/controller/teacher_password_controller');
const validate = require('../../middlewares/validate');
const router = express.Router();

//Teacher Register
router.post('/register', [
    check('email').isEmail().withMessage('Enter a valid email adress'),
    check('password').not().isEmpty().withMessage('Password can not be empty')
], validate, TeacherAuth.register);

//Teacher Login
router.post('/login', [
    check('email').isEmail().withMessage('Enter a valid email adress'),
    check('password').not().isEmpty().withMessage('Password can not be empty')
], validate, TeacherAuth.login);

//Teacher Email Verification
router.get('/verify/teacher/:token', TeacherAuth.verify);

//Teacher Email Verification Resend
router.post('/resend', TeacherAuth.resendToken);

//Teacher Password Recover
router.post('/recover', [
    check('email').isEmail().withMessage('Enter a valid email address'),
], validate, TeacherPassword.recover);

//Teacher Password Reset
router.post('/reset', validate, TeacherPassword.reset);

//Teacher Password Reset Otp Code
router.post('/reset/:otpCode', [
    check('password').not().isEmpty().withMessage('Password can not be empty'),
    check('confirmPassword', 'Passwords do not match').custom((value, {
        req
    }) => (value === req.body.password)),
], validate, TeacherPassword.resetPassword);

module.exports = router;