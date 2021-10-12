const Teacher = require('../model/teacher/teacher_model');

exports.changePassword = async (req, res) => {
    try {
        const id = req.params.id;
        const pass = req.body.password;
        const teacher = await Teacher.findById(id);

        if (teacher.comparePassword(pass)) {
            return res.status(401).json({
                message: 'Your password is the same as your previous password'
            });
        }
        teacher.password = pass;
        // Save the updated teacher object
        await student.save();

        return res.status(200).json({
            message: 'Password has been updated'
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
};