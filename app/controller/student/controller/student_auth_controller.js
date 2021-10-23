const Student = require('../model/student_model');
const StudentToken = require('../../student/model/student_token_model');

const {
    sendEmail
} = require('../../../util/app_helper');

// @route POST api/auth/student/register
// @desc Student Register
exports.register = async (req, res) => {
    try {
        const {
            email
        } = req.body;

        const student = await Student.findOne({
            email
        });

        if (student) return res.status(401).json({
            message: 'The email adress you have entered is already associated with another account'
        });

        const newStudent = new Student({
            ...req.body,
            role: "basic",
        });

        const student_ = await newStudent.save();
        await sendVerificationEmail(student_, req, res);

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
};

// @route POST api/auth/student/login
// @desc Student Login
exports.login = async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body;

        const student = await Student.findOne({
            email
        });

        if (!student) return res.status(401).json({
            message: 'The email adress ' + email + ' is not associated with any account.'
        });

        if (!student.comparePassword(password)) {
            return res.status(401).json({
                message: 'Current password does not match'
            });
        }

        if (!student.isVerified) return res.status(401).json({
            type: 'not-verified',
            message: 'Your account has not been verified'
        });

        res.status(200).json({
            token: student.generateJWT(),
            student: student
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// @route GET api/auth/student/verify/student/:token
// @desc Verify token
exports.verify = async (req, res) => {
    if (!req.params.token) return res.status(400).json({
        message: "We were unable to find this student for this token"
    });

    try {
        const token = await StudentToken.findOne({
            token: req.params.token
        });

        if (!token) return res.status(400).json({
            message: 'We were unable to find a valid token. Your token my have expired'
        });

        const student = await Student.findById(token.studentId);

        if (!student) return res.status(400).json({
            message: 'We were unable to find a student'
        });

        student.isVerified = true;
        await student.save();

        if (student.isVerified) return res.status(200).render('verify', {
            message: 'Student successfully verified!'
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
};

// @route POST api/auth/student/resend
// @desc Resend Verification Token
exports.resendToken = async (req, res) => {
    try {
        const {
            email
        } = req.body;

        const student = await Student.findOne({
            email
        });

        if (!student) return res.status(401).json({
            message: 'The email adress ' + req.body.email + ' is not associated with any account'
        });

        if (student.isVerified) return res.status(400).json({
            message: 'This account has already been verified. Please log in'
        });

        await sendVerificationEmail(student, req, res);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

async function sendVerificationEmail(student, req, res) {
    try {
        const studentToken = student.generateVerificationToken();
        await studentToken.save();

        let to = student.email;
        let from = process.env.FROM_EMAIL;
        let replyTo = process.env.FROM_EMAIL;
        let support = process.env.FROM_EMAIL;
        let fullName = student.studentName;

        await sendEmail({
            to,
            from,
            replyTo,
            templateId: process.env.VERIFY_EMAIL_TEMPLATEID,
            dynamicTemplateData: {
                subject: "Account Verification",
                fullname: fullName,
                verifyUrl: "https://" + req.headers.host + "/api/auth/student/verify/student/" + studentToken.token,
                contactUrl: "mailto:" + support,
            },
        });

        res.status(200).json({
            message: 'A verification email has been sent to ' + student.email + '. If you dont receive email, please check your spam or bulk mail folder just in case.'
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}