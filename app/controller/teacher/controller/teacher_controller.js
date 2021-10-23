const Teacher = require('../model/teacher_model');

// @route POST api/teacher/changepassword/:id
// @desc Teacher Change Password
exports.changePassword = async (req, res) => {
    try {
        const id = req.params.id;
        const password = req.body.password;
        const teacher = await Teacher.findById(id);

        if (teacher.comparePassword(password)) {
            return res.status(401).json({
                message: 'Your password is the same as your previous password'
            });
        }

        teacher.password = password;
        await teacher.save();

        return res.status(200).json({
            message: 'Password has been updated'
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
};