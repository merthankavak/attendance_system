const Course = require('../model/course');
const Student = require('../../login/model/student/student_model');

// @route GET api/student/course/{id}
// @desc Returns a course list
// @access Public
exports.show = async function (req, res) {
    try {
        const studentId = req.params.id;

        const courseList = await Course.find({
            'students._id': studentId
        });

        if (!courseList) return res.status(401).json({
            message: 'Course does not exist.'
        });

        res.status(200).json({
            courseList
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
};

// @route POST api/student/course/joincourse
// @desc Join course with courseCode
// @access Public
exports.joinCourse = async (req, res) => {
    try {
        const courseCode = req.body.courseCode;
        const id = req.body.studentId;
        const student = await Student.findById(id);
        const course = await Course.findOne({
            'courseCode': courseCode
        });
        if (!course) return res.status(401).json({
            message: 'Course code does not exist.'
        });
        await course.students.push(student);
        await course.save();

        res.status(200).json({
            message: 'Successfully joined'
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
};