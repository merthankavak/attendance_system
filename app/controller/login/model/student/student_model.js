const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const StudentToken = require('./student_token_model');

const {
    generateOTP
} = require('../../../../util/app_helper');

const StudentSchema = new mongoose.Schema({
    stdId: {
        type: String,
        unique: true,
        required: 'Your student id is required',
    },
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
    studentName: {
        type: String,
        required: true
    },

    image: [{
        type: Buffer
    }],
    supervisorName: {
        type: String,
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

StudentSchema.pre('save', function (next) {
    const student = this;
    if (!student.isModified('password')) return next();
    bcrypt.genSalt(10, function (err, salt) {
        if (err) return next(err);
        bcrypt.hash(student.password, salt, function (err, hash) {
            if (err) return next(err);
            student.password = hash;
            next();
        });
    });
});

StudentSchema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

StudentSchema.methods.generateVerificationToken = function () {
    let payload = {
        studentId: this._id,
        token: crypto.randomBytes(20).toString('hex')
    };
    return new StudentToken(payload);
};

StudentSchema.methods.generatePasswordReset = function () {
    this.resetPasswordOTP = generateOTP(6);
    this.resetPasswordExpires = Date.now() + 300000; //expires in an hour
};

StudentSchema.methods.generateJWT = function () {
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


module.exports = mongoose.model('Student', StudentSchema);