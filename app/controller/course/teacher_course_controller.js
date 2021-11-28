const Course = require('./model/course_model');
const Student = require('../student/model/student_model');
const Teacher = require('../teacher/model/teacher_model');

const moment = require('moment');
const fs = require('fs-extra');

const AWS = require('aws-sdk');
const config = new AWS.Config({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});
const rekognition = new AWS.Rekognition();

// @route POST api/teacher/course/addcourse
// @desc Add new course
// @access Public
exports.addCourse = async (req, res) => {
    try {
        const id = req.body.teacherId;
        const teacher = await Teacher.findById(id);
        const newCourse = new Course({
            ...req.body,
        });

        await newCourse.generateRandomCourseCode();
        const course_ = await newCourse.save();
        course_.teacher = teacher;

        await course_.save();

        res.status(200).json({
            message: 'Course successfully created'
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
};

// @route DELETE api/teacher/course/deletecourse/:id
// @desc Delete course
// @access Public
exports.deleteCourse = async function (req, res) {
    try {
        const id = req.params.id;
        await Course.findByIdAndDelete(id);

        res.status(200).json({
            message: 'Course has been deleted'
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// @route POST api/teacher/course/addschedule/:id
// @desc Add course schedule
// @access Public
exports.addCourseSchedule = async (req, res) => {
    try {
        const id = req.params.id;
        let courseStartDate = req.body.courseStartDate; //20.10.2021
        let courseEndDate = req.body.courseEndDate; //20.10.2021
        let courseTime = req.body.courseTime; //09:00-12:00
        const currentCourse = await Course.findById(id);

        if (!currentCourse) res.status(401).json({
            message: 'Course does not exist'
        });

        let courseScheduleArray = [];
        let timeArray = [];
        let dateArray = [];

        let startDate = moment(courseStartDate, 'DD-MM-YYYY');
        let endDate = moment(courseEndDate, 'DD-MM-YYYY');

        while (startDate <= endDate) {
            dateArray.push(moment(startDate).format('DD-MM-YYYY'));
            timeArray.push(courseTime);
            startDate = moment(startDate).add(7, 'days');
        }

        for (let i = 0; i < dateArray.length; i++) {
            courseScheduleArray[i] = {};
            courseScheduleArray[i].date = dateArray[i];
            courseScheduleArray[i].time = timeArray[i];
        }

        currentCourse.attendance = courseScheduleArray;
        await currentCourse.save();

        res.status(200).json({
            message: 'Course schedule successfully added'
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
};
// @route GET api/teacher/course/:id
// @desc Get one course
// @access Public
exports.showOneCourse = async function (req, res) {
    try {
        const id = req.params.id;
        const course = await Course.findById(id);

        if (!course) return res.status(401).json({
            message: 'Course does not exist'
        });

        res.status(200).json({
            course
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
};

// @route GET api/teacher/course/list/:id
// @desc Get course list
// @access Public
exports.showCourseList = async function (req, res) {
    try {
        const teacherId = req.params.id;
        let courseList = await Course.find({
            "teacher._id": teacherId
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

// @route POST api/teacher/course/takeattendance/:id/:date
// @desc Check course attendance
// @access Public
exports.takeAttendance = async (req, res) => {
    try {
        const id = req.params.id;
        const date = req.params.date;
        const image = req.body.image;
        const currentCourse = await Course.findById(id);

        if (!currentCourse) res.status(401).json({
            message: 'Course does not exist'
        });



        if (!image) return res.status(401).json({
            message: 'You must upload at least one image'
        });

        var imageByte = image;

        let currentAttendance = await currentCourse.attendance.find((attendance) => attendance.date == date);

        if (!currentAttendance) res.status(401).json({
            message: 'No attendance record available by this date'
        });


        let studentsArray = currentAttendance.students;
        let participateStudent = 0;

        for (let i = 0; i < studentsArray.length; i++) {
            var studentId = studentsArray[i].id;
            var student = await Student.findById(studentId);
            var studentImageByte = student.studentImage.imageByte;
            var faceData = await rekognition.compareFaces({
                SimilarityThreshold: 70,
                TargetImage: {
                    Bytes: imageByte
                },
                SourceImage: {
                    Bytes: studentImageByte
                }
            }).promise();

            if (faceData.FaceMatches.length > 0) {
                studentsArray[i].attendanceStatus = true;
                participateStudent++;
            }
            await currentCourse.save();
        }

        res.status(200).json({
            totalStudent: studentsArray.length.toString(),
            participateStudent: participateStudent.toString(),
            absentStudent: (studentsArray.length - participateStudent).toString(),
            studentsArray: studentsArray,
            message: 'Attendance for the course was successfully taken'
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
};

// @route POST api/teacher/course/manageattendance/:id/:date
// @desc Update course attendance
// @access Public
exports.manageAttendance = async (req, res) => {
    try {
        const id = req.params.id;
        const date = req.params.date;
        let statusArray = req.body.statusArray;

        const currentCourse = await Course.findById(id);

        if (!currentCourse) res.status(401).json({
            message: 'Course does not exist'
        });

        let currentAttendance = await currentCourse.attendance.find((attendance) => attendance.date == date);

        if (!currentAttendance) res.status(401).json({
            message: 'No attendance record available by this date'
        });

        let studentsArray = currentAttendance.students;
        let participateStudent = 0;

        for (let i = 0; i < studentsArray.length; i++) {
            if (statusArray[i] == "true") {
                studentsArray[i].attendanceStatus = true;
                participateStudent++;
            } else {
                studentsArray[i].attendanceStatus = false;
            }
            await currentCourse.save();
        }

        res.status(200).json({
            totalStudent: studentsArray.length,
            participateStudent: participateStudent,
            absentStudent: studentsArray.length - participateStudent,
            studentsArray,
            message: 'Attendance for the course was successfully updated'
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
};

// @route POST api/teacher/course/update/:id
// @desc Course Update
exports.update = async function (req, res) {
    try {
        const id = req.params.id;
        const newCourseName = req.body.courseName;
        const newCourseShortName = req.body.courseShortName;

        const course = await Course.findById(id);

        if (!course) return res.status(401).json({
            message: 'Course does not exist'
        });

        if (!newCourseShortName) {
            //Course Name
            if (newCourseName == course.courseName) return res.status(401).json({
                message: 'Same as previous course name!'
            });

            course.courseName = courseName;

            await course.save();

            res.status(200).json({
                message: 'Course name successfully updated'
            });

        } else {
            //Course Short Name
            if (!newCourseName) {
                if (newCourseShortName == course.courseShortName) return res.status(401).json({
                    message: 'Same as previous course short name!'
                });

                course.courseShortName = newCourseShortName;
                await course.save();

                res.status(200).json({
                    message: 'Course short name successfully updated'
                });

            } else {
                if (newCourseName === course.courseName) {
                    course.courseShortName = newCourseShortName;
                    await course.save();
                    res.status(200).json({
                        message: 'Course short name successfully updated'
                    });

                } else {
                    //Course Name and Short Name
                    course.courseName = newCourseName;
                    course.courseShortName = newCourseShortName;
                    await course.save();

                    res.status(200).json({
                        message: 'Course information successfully updated'
                    });
                }
            }
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};