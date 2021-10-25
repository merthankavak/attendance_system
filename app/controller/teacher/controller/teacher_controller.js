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

// @route POST api/teacher/update/:id
// @desc Teacher Update
exports.update = async function (req, res) {
    try {
        const id = req.params.id;
        const newName = req.body.teacherName;

        const teacher = await Teacher.findById(id);

        if (!teacher) return res.status(401).json({
            message: 'Teacher does not exist'
        });

        if (newName == teacher.teacherName) return res.status(401).json({
            message: 'Same as previous name!'
        });

        teacher.teacherName = newName;

        await teacher.save();

        res.status(200).json({
            message: 'Name successfully updated'
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};