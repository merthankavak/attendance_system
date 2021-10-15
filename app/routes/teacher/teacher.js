const express = require('express');
const {
    check
} = require('express-validator');


const Teacher = require('../../controller/login/teacher/teacher_controller');
const Course = require('../../controller/course/teacher/teacher_course_controller');
const router = express.Router();


//POST UPDATE PASSWORD
router.post('/changepassword/:id', [
    check('password').not().isEmpty().isLength({
        min: 6
    }).withMessage('Must be at least 6 chars long'),
    check('confirmPassword', 'Passwords do not match').custom((value, {
        req
    }) => (value === req.body.password)),
], Teacher.changePassword);

//SHOW COURSE
router.get('/course/:id', Course.show);

//ADD COURSE
router.post('/course/addcourse', Course.addCourse);

//DELETE COURSE
router.delete('/course/deletecourse/:id', Course.deleteCourse);


module.exports = router;