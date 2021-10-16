const express = require('express');
const {
    check
} = require('express-validator');

const Course = require('../../controller/course/student/student_course_controller');
const Student = require('../../controller/login/student/student_controller');
const multer = require('multer');
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
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png')
            cb(null, true);
        else
            cb('Only jpeg/jpg or png files!', false);
    }
});


//POST UPDATE PASS
router.post('/changepassword/:id', [
    check('password').not().isEmpty().isLength({
        min: 6
    }).withMessage('Must be at least 6 chars long'),
    check('confirmPassword', 'Passwords do not match').custom((value, {
        req
    }) => (value === req.body.password)),
], Student.changePassword);

//UPDATE
router.put('/:id', upload, Student.update);

//SHOW COURSE
router.get('/course/:id', Course.show);

//JOIN COURSE
router.post('/course/joincourse', Course.joinCourse);

module.exports = router;