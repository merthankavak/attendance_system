const Teacher = require('../model/teacher/teacher_model');
const TeacherToken = require('../model/teacher/teacher_token_model');

const {
    sendEmail
} = require('../../../util/app_helper');


// @route POST api/auth/teacher/register
// @desc Teacher Register
exports.register = async (req, res) => {
    try {
        const {
            email
        } = req.body;

        // Check the teacher account does already exist
        const teacher = await Teacher.findOne({
            email
        });

        if (teacher) return res.status(401).json({
            message: 'The email adress you have entered is already associated with another account'
        });

        // If does not exit create the new teacher

        const newTeacher = new Teacher({
            ...req.body,
            role: 'basic',
        });

        const teacher_ = await newTeacher.save();
        await sendVerificationEmail(teacher_, req, res);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
};

// @route POST api/auth/teacher/login
// @desc Teacher Login
exports.login = async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body;

        const teacher = await Teacher.findOne({
            email
        });

        if (!teacher) return res.status(401).json({
            message: 'The email adress ' + email + ' is not associated with any account.'
        });

        if (!teacher.comparePassword(password)) {
            return res.status(401).json({
                message: 'Current password does not match'
            });
        }

        if (!teacher.isVerified) return res.status(401).json({
            type: 'not-verified',
            message: 'Your account has not been verified'
        });

        res.status(200).json({
            token: teacher.generateJWT(),
            teacher: teacher
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// @route GET api/auth/teacher/verify/teacher/:token
// @desc Verify token
exports.verify = async (req, res) => {
    if (!req.params.token) return res.status(400).json({
        message: "We were unable to find this teacher for this token"
    });
    try {
        const token = await TeacherToken.findOne({
            token: req.params.token
        });
        if (!token) return res.status(400).json({
            message: 'We were unable to find a valid token. Your token my have expired'
        });

        Teacher.findOne({
            _id: token.teacherId
        }, (err, teacher) => {
            if (!teacher) return res.status(400).json({
                message: 'We were unable to find a teacher'
            });

            teacher.isVerified = true;
            teacher.save();
            if (teacher.isVerified) return res.status(200).render('verify', {
                message: 'Teacher successfully verified!'
            });
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
};

// @route POST api/auth/teacher/resend
// @desc Resend Verification Token
exports.resendToken = async (req, res) => {
    try {
        const {
            email
        } = req.body;

        const teacher = await Teacher.findOne({
            email
        });
        if (!teacher) return res.status(401).json({
            message: 'The email adress ' + req.body.email + ' is not associated with any account.'
        });

        if (teacher.isVerified) return res.status(400).json({
            message: 'This account has already been verified. Please log in'
        });

        await sendVerificationEmail(teacher, req, res);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

async function sendVerificationEmail(teacher, req, res) {
    try {
        const teacherToken = teacher.generateVerificationToken();
        await teacherToken.save();

        let to = teacher.email;
        let from = process.env.FROM_EMAİL;
        let replyTo = process.env.FROM_EMAİL;
        let support = process.env.FROM_EMAİL;
        let fullName = teacher.teacherName;
        await sendEmail({
            to,
            from,
            replyTo,
            templateId: 'd-0eaea82743e644e58b12bdb99444b00e',
            dynamicTemplateData: {
                subject: "Account Verification",
                fullname: fullName,
                verifyUrl: "https://" + req.headers.host + "/api/auth/teacher/verify/teacher/" + teacherToken.token,
                contactUrl: "mailto:" + support,
            },
        });
        res.status(200).json({
            message: 'A verification email has been sent to ' + teacher.email + '. If you dont receive email, please check your spam or bulk mail folder just in case.'
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}