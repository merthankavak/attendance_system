const mongoose = require('mongoose');

const teacherTokenSchema = new mongoose.Schema({
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Teacher'
    },
    token: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
        expires: 43200
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('TeacherTokens', teacherTokenSchema);