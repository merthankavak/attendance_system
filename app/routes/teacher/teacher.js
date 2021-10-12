const express = require('express');
const {
    check
} = require('express-validator');


const Teacher = require('../../controller/login/teacher/teacher_controller');

const router = express.Router();


//POST UPDATE PASS
router.post('/changepassword/:id', [
    check('password').not().isEmpty().isLength({
        min: 6
    }).withMessage('Must be at least 6 chars long'),
    check('confirmPassword', 'Passwords do not match').custom((value, {
        req
    }) => (value === req.body.password)),
], Teacher.changePassword);

module.exports = router;