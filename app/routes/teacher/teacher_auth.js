const express = require('express');
const {
    check
} = require('express-validator');

const TeacherAuth = require('../../controller/login/teacher/teacher_auth_controller');
const TeacherPassword = require('../../controller/login/teacher/teacher_password_controller');
const validate = require('../../middlewares/validate');
const router = express.Router();

//Teacher Email
router.post('/register', [
    check('email').isEmail().withMessage('Enter a valid email adress'),
    check('password').not().isEmpty().isLength({
        min: 6
    }).withMessage('Must be at least 6 chars long')
], validate, TeacherAuth.register);

//Teacher Login
router.post('/login', [
    check('email').isEmail().withMessage('Enter a valid email adress'),
    check('password').not().isEmpty().isLength({
        min: 6
    }).withMessage('Must be at least 6 chars long')
], validate, TeacherAuth.login);

//Teacher Email Verification
router.get('/verify/:token', TeacherAuth.verify);
router.post('/resend', TeacherAuth.resendToken);

//Teacher Password RESET
router.post('/recover', [
    check('email').isEmail().withMessage('Enter a valid email address'),
], validate, TeacherPassword.recover);

router.post('/reset', validate, TeacherPassword.reset);

router.post('/reset/:otpCode', [
    check('password').not().isEmpty().isLength({
        min: 6
    }).withMessage('Must be at least 6 chars long'),
    check('confirmPassword', 'Passwords do not match').custom((value, {
        req
    }) => (value === req.body.password)),
], validate, TeacherPassword.resetPassword);

module.exports = router;