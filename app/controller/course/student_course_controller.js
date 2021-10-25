const Course = require('./model/course_model');
const Student = require('../student/model/student_model');

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
            message: 'Course does not exist'
        });

        const studentAlreadyIn = await course.students.find((s) => s.id === id);

        if (studentAlreadyIn) {
            return res.status(401).json({
                message: 'You have already enrolled this course'
            });
        }

        const attendanceArray = course.attendance;
        await course.students.push(student);

        for (let i = 0; i < attendanceArray.length; i++) {
            attendanceArray[i].students.push(student);
        }

        await course.save();

        res.status(200).json({
            message: 'Successfully joined the course'
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
};

// @route DELETE api/student/course/leave/:id
// @desc Leave course
// @access Public
exports.leaveCourse = async function (req, res) {
    try {
        const id = req.params.id;
        const courseId = req.body.courseId;

        const course = await Course.findById(courseId);
        await course.students.pull({
            '_id': id
        });

        res.status(200).json({
            message: 'Successfully leaved'
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// @route GET api/student/course/:id
// @desc Return course 
// @access Public
exports.show = async function (req, res) {
    try {
        const studentId = req.params.id;
        const courseList = await Course.find({
            $match: {
                '_id': {
                    '$in': [studentId]
                }
            }
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