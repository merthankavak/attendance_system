const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const StudentToken = require('./student_token_model');

const StudentSchema = new mongoose.Schema({
    studentId: {
        type: String,
        required: true,
        unique: true
    },
    email: {
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
};

StudentSchema.method.generateJWT = function () {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 60);
    let payload = {
        id: this._id,
        studentEmail: this.studentEmail
    };
    return jwt.sign(payload, process.env.JWT, {
        expiresIn: parseInt(expiratiolnDate.getTime() / 1000,
            10)
    })
};

StudentSchema.method.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('Student', StudentSchema);