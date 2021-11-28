const express = require('express');
const {
    check
} = require('express-validator');

const Teacher = require('../../controller/teacher/controller/teacher_controller');
const Course = require('../../controller/course/teacher_course_controller');
const router = express.Router();
const multer = require('multer');

const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => cb(null, new Date().toISOString() + '-' + file.originalname)
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 14
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg')
            cb(null, true);
        else
            cb('Only jpeg/jpg or png files!', false);
    }
});

//Teacher Change Password
router.post('/changepassword/:id', [
    check('password').not().isEmpty().withMessage('Password can not be empty'),
    check('confirmPassword', 'Passwords do not match').custom((value, {
        req
    }) => (value === req.body.password)),
], Teacher.changePassword);

//Teacher Update
router.post('/update/:id', Teacher.update);

//Teacher Show One Course
router.get('/course/:id', Course.showOneCourse);

//Teacher Show Course List
router.get('/course/list/:id', Course.showCourseList);

//Teacher Add New Course
router.post('/course/addcourse', Course.addCourse);

//Teacher Delete Course
router.delete('/course/deletecourse/:id', Course.deleteCourse);

//Teacher Add Course Schedule
router.post('/course/addschedule/:id', Course.addCourseSchedule);

//Teacher Check Course Attendance
router.post('/course/takeattendance/:id/:date', Course.takeAttendance);

//Teacher Manage Course Attendance
router.post('/course/manageattendance/:id/:date', Course.manageAttendance);

//Teacher Course Update
router.post('/course/update/:id', Course.update);

module.exports = router;