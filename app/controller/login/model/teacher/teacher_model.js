const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const TeacherToken = require('./teacher_token_model');

const TeacherSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: 'Your email is required',
        trim: true
    },
    password: {
        type: String,
        required: 'Your password is required',
        max: 50
    },
    teacherName: {
        type: String,
        required: true
    },
    teacherImage: {
        type: Buffer,
        required: false
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    resetPasswordOTP: {
        type: String,
        required: false
    },
    resetPasswordExpires: {
        type: Date,
        required: false
    }
}, {
    timestamps: true
});

TeacherSchema.pre('save', function (next) {
    const teacher = this;
    if (!teacher.isModified('password')) return next();
    bcrypt.genSalt(10, function (err, salt) {
        if (err) return next(err);
        bcrypt.hash(teacher.password, salt, function (err, hash) {
            if (err) return next(err);
            teacher.password = hash;
            next();
        });
    })
});

TeacherSchema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

TeacherSchema.methods.generateVerificationToken = function () {
    let payload = {
        teacherId: this._id,
        token: crypto.randomBytes(20).toString('hex')
    };
    return new TeacherToken(payload);
};

TeacherSchema.methods.generatePasswordReset = function () {
    this.resetPasswordOTP = generateOTP(6);
    this.resetPasswordExpires = Date.now() + 300000; //expires in an hour
};

TeacherSchema.methods.generateJWT = function () {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 60);
    let payload = {
        id: this._id,
        email: this.email
    };
    return jwt.sign(payload, process.env.JWT, {
        expiresIn: parseInt(expirationDate.getTime() / 1000, 10)
    });
};


module.exports = mongoose.model('Teacher', TeacherSchema);