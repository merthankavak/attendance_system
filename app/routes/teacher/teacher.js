const express = require('express');
const {
    check
} = require('express-validator');
const multer = require('multer');

const Teacher = require('../../controller/login/teacher/teacher_controller');
const Course = require('../../controller/course/teacher/teacher_course_controller');
const router = express.Router();

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

//CHECK ATTENDANCE 
router.post('/course/:id/checkattendance', upload.single('picture'), Course.checkAttendance);

//EDIT COURSE SCHEDULE
router.post('/course/:id/editschedule', Course.editCourseSchedule);

//DELETE COURSE
router.delete('/course/deletecourse/:id', Course.deleteCourse);


module.exports = router;