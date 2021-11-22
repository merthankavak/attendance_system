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
    teacher: {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Teacher'
        },
        fullName: {
            type: String,
            ref: 'Teacher'
        },
        email: {
            type: String,
            ref: 'Teacher'
        },
    },
    students: [{
        stdId: {
            type: String,
            ref: 'Student'
        },
        email: {
            type: String,
            ref: 'Student'
        },
        fullName: {
            type: String,
            ref: 'Student'
        },
        studentImage: {
            imageByte: {
                type: Buffer,
                ref: 'Student'
            },
            fileType: {
                type: String,
                ref: 'Student'
            },
        },

    }],
    attendance: [{
        date: {
            type: String,
            default: '0'
        },
        time: {
            type: String,
            default: '0'
        },
        students: [{
            stdId: {
                type: String,
                ref: 'Student'
            },
            email: {
                type: String,
                ref: 'Student'
            },
            fullName: {
                type: String,
                ref: 'Student'
            },
            attendanceStatus: {
                type: Boolean,
                default: false
            },
        }],
    }],
}, {
    timestamps: true,
    versionKey: false
});

CourseSchema.methods.generateRandomCourseCode = function () {
    this.courseCode = generateCourseCode();
};

module.exports = mongoose.model('Course', CourseSchema);