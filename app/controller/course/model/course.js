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
    teacher: {
        type: String,
        required: true
    },
    courseName: {
        type: String,
        required: true
    },
    students: {
        type: [String],
    }
}, {
    collection: 'courses'
});

CourseSchema.methods.generateRandomCourseCode = function () {
    this.courseCode = generateCourseCode();
};


module.exports = mongoose.model('Course', CourseSchema);