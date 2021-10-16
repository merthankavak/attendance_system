const mongoose = require('mongoose');
const {
    generateCourseCode
} = require('../../../util/app_helper');

const CourseSchema = mongoose.Schema({
    courseCode: {
        type: String,
        required: true,
        unique: true
    },
    courseShortName: {
        type: String,
        required: true
    },
    courseName: {
        type: String,
        required: true
    },
    teacher: [{
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student'
        },
        teacherName: {
            type: String,
            ref: 'Teacher'
        },
        email: {
            type: String,
            ref: 'Teacher'
        },
    }],
    students: [{
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student'
        },
        stdId: {
            type: String,
            ref: 'Student'
        },
        studentName: {
            type: String,
            ref: 'Student'
        },
        email: {
            type: String,
            ref: 'Student'
        },
    }],
    attendance: [{
        date: {
            type: String
        },
        courseTime: [{
            time: {
                type: String
            },
            students: [{
                stdId: {
                    type: String,
                    ref: 'Student'
                },
                studentName: {
                    type: String,
                    ref: 'Student'
                },
                attendanceStatus: {
                    type: Boolean,
                }
            }]
        }]
    }],
}, {
    collection: 'courses'
});

CourseSchema.methods.generateRandomCourseCode = function () {
    this.courseCode = generateCourseCode();
};

CourseSchema.methods.checkStudentAlreadyIn = function (id) {
    this.students.includes(id);
};


module.exports = mongoose.model('Course', CourseSchema);