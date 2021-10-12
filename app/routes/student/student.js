const express = require('express');
const {
    check
} = require('express-validator');


const Student = require('../../controller/login/student/student_controller');

const router = express.Router();


//POST UPDATE PASS
router.post('/changepassword/:id', [
    check('password').not().isEmpty().isLength({
        min: 6
    }).withMessage('Must be at least 6 chars long'),
    check('confirmPassword', 'Passwords do not match').custom((value, {
        req
    }) => (value === req.body.password)),
], Student.changePassword);

module.exports = router;