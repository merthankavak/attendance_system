const express = require('express');
const {
    check
} = require('express-validator');
const path = require('path');
const Teacher = require('../../controller/teacher/controller/teacher_controller');
const Course = require('../../controller/course/teacher_course_controller');
const router = express.Router();
const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');
const s3 = new AWS.S3();
/*
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __dirname);
    },
    filename: (req, file, cb) => cb(null, file.originalname)

});*/
const upload = multer({
    storage: multerS3({
        acl: "public-read",
        s3,
        bucket: "attendancesystembucket",
        key: function (req, file, cb) {
            cb(null, file.originalname);
        },
       
    }),

    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb('Only jpeg/jpg or png files!', false);
        }
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
router.post('/course/takeattendance/:id/:date', upload.single("image"), Course.takeAttendance);

//Teacher Manage Course Attendance
router.post('/course/manageattendance/:id/:date', Course.manageAttendance);

//Teacher Course Update
router.post('/course/update/:id', Course.update);

module.exports = router;