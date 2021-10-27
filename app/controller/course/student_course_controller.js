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

        const attendanceArray = course.attendance;
        const studentAlreadyIn = await course.students.find((s) => s.id === id);

        for (let i = 0; i < attendanceArray.length; i++) {
            var studentInAttendanceArray = await attendanceArray[i].students.find((student) => student.id === id);
        }

        if (studentAlreadyIn || studentInAttendanceArray) {
            return res.status(401).json({
                message: 'You have already enrolled this course'
            });
        }

        await course.students.push(student);

        for (let i = 0; i < attendanceArray.length; i++) {
            attendanceArray[i].students.push(student);
        }

        await course.save();

        res.status(200).json({
            course: course,
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
        const student = await course.students.find((s) => s.id == id);

        await student.remove();

        const attendanceArray = course.attendance;

        for (let i = 0; i < attendanceArray.length; i++) {
            var studentInAttendanceArray = await attendanceArray[i].students.find((student) => student.id == id);
            await studentInAttendanceArray.remove();
        }

        await course.save();

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
// @desc Show one course 
// @access Public
exports.showOneCourse = async function (req, res) {
    try {
        const id = req.params.id;
        const course = await Course.findById(id);

        if (!course) return res.status(401).json({
            message: 'Course does not exist'
        });

        res.status(200).json({
            teacher: course.teacher.teacherName,
            courseShortName: course.courseShortName,
            courseName: course.courseName,
            courseCode: course.courseCode,
            students: course.students
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
};

// @route GET api/student/course/list/:id
// @desc Show course list
// @access Public
exports.showCourseList = async function (req, res) {
    try {
        const studentId = req.params.id;
        let courseList = await Course.find({
            ' students._id': studentId
        }).exec();

        if (!courseList) return res.status(401).json({
            message: 'Course list does not exist'
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