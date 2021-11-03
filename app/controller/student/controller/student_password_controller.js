const Student = require('../model/student_model');
const {
    sendEmail
} = require('../../../util/app_helper');

// @route POST api/auth/student/recover
// @desc Recover Password
// @access Public
exports.recover = async (req, res) => {
    try {
        const {
            email
        } = req.body;

        const student = await Student.findOne({
            email
        });

        if (!student) return res.status(401).json({
            message: 'The email address ' + req.body.email + ' is not associated with any account. Double-check your email address and try again.'
        });

        await student.generatePasswordReset();
        await student.save();

        let fullName = student.fullName;
        let to = student.email;
        let from = process.env.FROM_EMAIL;
        let support = process.env.SUPPORT_EMAIL;

        await sendEmail({
            to,
            from,
            templateId: process.env.RESET_PASSWORD_TEMPLATEID,
            dynamicTemplateData: {
                fullname: fullName,
                subject: "Password Change Request",
                contact_url: "mailto:" + support,
                otpCode: student.resetPasswordOTP
            }
        });

        res.status(200).json({
            message: 'A reset email has been sent to ' + student.email + '.'
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
};

// @route POST api/auth/student/reset
// @desc Reset Password 
// @access Public
exports.reset = async (req, res) => {
    try {
        const {
            otpCode
        } = req.body;

        const student = await Student.findOne({
            resetPasswordOTP: otpCode,
            resetPasswordExpires: {
                $gt: Date.now()
            }
        });

        if (!student) return res.status(401).json({
            message: 'Password reset token is invalid or has expired.'
        });

        res.status(200).json({
            message: 'You are successfully redirected to the password change screen',
            otpCode: student.otpCode
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
};

// @route POST api/auth/student/reset/:otpCode
// @desc Reset Password Otp Code
// @access Public
exports.resetPassword = async (req, res) => {
    try {
        let otpCode = req.params.otpCode;
        const student = await Student.findOne({
            resetPasswordOTP: otpCode,
            resetPasswordExpires: {
                $gt: Date.now()
            }
        });

        if (!student) return res.status(401).json({
            message: 'Password reset otp is invalid or has expired'
        });

        student.password = req.body.password;
        student.resetPasswordExpires = undefined;
        student.resetPasswordOTP = undefined;

        await student.save();

        res.status(200).json({
            message: 'Your password has been updated'
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
};