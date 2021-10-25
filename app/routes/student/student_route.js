const express = require('express');
const {
    check
} = require('express-validator');

const Course = require('../../controller/course/student_course_controller');
const Student = require('../../controller/student/controller/student_controller');
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

//Student Update Password
router.post('/changepassword/:id', [
    check('password').not().isEmpty().withMessage('Password can not be empty'),
    check('confirmPassword', 'Passwords do not match').custom((value, {
        req
    }) => (value === req.body.password)),
], Student.changePassword);

//Student Update
router.post('/update/:id', upload.single('image'), Student.update);

//Student Get Course
router.get('/course/:id', Course.show);

//Student Join Course
router.post('/course/joincourse', Course.joinCourse);

//Student Leave Course
router.delete('/course/leave/:id', Course.leaveCourse);

module.exports = router;