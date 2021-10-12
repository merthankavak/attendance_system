const Teacher = require('../model/teacher_model');
const {
    sendEmail
} = require('../../../util/app_helper');

// @route POST api/auth/teacher/recover
// @desc Recover Password - Generates token and Sends password reset email
// @access Public
exports.recover = async (req, res) => {
    try {
        const {
            email
        } = req.body;
        const teacher = await Teacher.findOne({
            email
        });
        if (!teacher) return res.status(401).json({
            message: 'The email address ' + req.body.email + ' is not associated with any account. Double-check your email address and try again.'
        });
        //Generate and set" password reset token
        await teacher.generatePasswordReset();
        // Save the updated teacher object
        await teacher.save();
        // send email
        let fullName = teacher.teacherName;
        let to = teacher.email;
        let from = process.env.FROM_EMAIL;
        let support = process.env.SUPPORT_EMAIL;
        await sendEmail({
            to,
            from,
            templateId: 'd-e76c2a240f324b2397b8beb3e9b2b0e9',
            dynamicTemplateData: {
                fullname: fullName,
                subject: "Password Change Request",
                contact_url: "mailto:" + support,
                otpCode: teacher.resetPasswordOTP
            }
        });
        res.status(200).json({
            message: 'A reset email has been sent to ' + teacher.email + '.'
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
};

// @route POST api/auth/teacher/reset
// @desc Reset Password - Validate password reset token and shows the password reset view
// @access Public
exports.reset = async (req, res) => {
    try {
        const {
            otpCode
        } = req.body;

        const teacher = await Teacher.findOne({
            resetPasswordOTP: otpCode,
            resetPasswordExpires: {
                $gt: Date.now()
            }
        });
        if (!teacher) return res.status(401).json({
            message: 'Password reset token is invalid or has expired.'
        });
        res.status(200).json({
            message: 'You are successfully redirected to the password change screen',
            otpCode: teacher.otpCode
        });
        //Redirect teacher to form with the email address
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
};

// @route POST api/auth/teacher/reset
// @desc Reset Password
// @access Public
exports.resetPassword = async (req, res) => {
    try {
        let otpCode = req.params.otpCode;
        const teacher = await Teacher.findOne({
            resetPasswordOTP: otpCode,
            resetPasswordExpires: {
                $gt: Date.now()
            }
        });
        if (!teacher) return res.status(401).json({
            message: 'Password reset otp is invalid or has expired.'
        });
        //Set the new password
        teacher.password = req.body.password;
        teacher.resetPasswordExpires = undefined;
        teacher.resetPasswordOTP = undefined;

        // Save the updated teacher object
        await teacher.save();

        res.status(200).json({
            message: 'Your password has been updated.'
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
};