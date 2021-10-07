const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const StudentToken = require('./student_token_model');

const StudentSchema = mongoose.Schema({
    studentId: {
        type: String,
        required: true,
        unique: true
    },
    studentMail: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        max: 50
    },
    studentName: {
        type: String,
        required: true
    },
    studentImage: {
        type: Buffer,
        required: false
    },
    supervisorName: {
        type: String,
        required: false
    },
    isVerified: {
        type: Boolean,
        required: false
    }
}, {
    timestamps: true
});

StudentSchema.pre('save', function (next) {
    const student = this;
    if (!student.isModified('password')) return next();
    bcrypt.genSalt(10, function (err, salt) {
        if (err) return next(err);
        bcrypt.hash(student.password, salt, function (err, hash) {
            if (err) return next(err);
            student.password = hash;
            next();
        })
    })
});

StudentSchema.method.generateVerificationToken = function () {
    let payload = {
        studentId: this._id,
        token: crypto.randomBytes(20).toString('hex')
    };
    return new StudentToken(payload);
}


module.exports = mongoose.model('Student', StudentSchema);