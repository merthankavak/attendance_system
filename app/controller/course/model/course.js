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
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Teacher'
    },
    courseName: {
        type: String,
        required: true
    },
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

    }],

}, {
    collection: 'courses'
});

CourseSchema.methods.generateRandomCourseCode = function () {
    this.courseCode = generateCourseCode();
};


module.exports = mongoose.model('Course', CourseSchema);