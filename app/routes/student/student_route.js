const express = require('express');
const {
    check
} = require('express-validator');

const Course = require('../../controller/course/student_course_controller');
const Student = require('../../controller/student/controller/student_controller');
const router = express.Router();

const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});


const upload = multer({
    storage: multerS3({
        acl: "public-read",
        s3,
        bucket: "attendancesystembucket",
        Body: function (req, file, cb) {
            cb(null, file.buffer)
        },
        metadata: function (req, file, cb) {
            cb(null, {
                fieldName: file.fieldname
            });
        },
        key: function (req, file, cb) {
            console.log(file)
            cb(null, new Date().toISOString() + '-' + file.originalname)
        }

    }),

    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb('Only jpeg/jpg or png files!', false);
        }
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
router.post('/update/:id', upload.single("image"), Student.update);

//Student Show One Course
router.get('/course/:id', Course.showOneCourse);

//Student Show Course List
router.get('/course/list/:id', Course.showCourseList);

//Student Join Course
router.post('/course/joincourse', Course.joinCourse);

//Student Leave Course
router.delete('/course/leave/:id', Course.leaveCourse);

module.exports = router;