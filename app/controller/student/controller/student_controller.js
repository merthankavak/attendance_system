const Student = require('../model/student_model');
const fs = require('fs-extra');

// @route POST api/student/changepassword/:id
// @desc Student Change Password
exports.changePassword = async (req, res) => {
    try {
        const id = req.params.id;
        const password = req.body.password;
        const student = await Student.findById(id);

        if (student.comparePassword(password)) {
            return res.status(401).json({
                message: 'Your password is the same as your previous password'
            });
        }

        student.password = password;
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

// @route POST api/student/uploadimage/:id
// @desc Student Upload Image
exports.uploadImage = async function (req, res) {
    try {
        const id = req.params.id;
        var image = req.file;
        const student = await Student.findById(id);

        if (!student) return res.status(401).json({
            message: 'Student does not exist'
        });

        if (!image) return res.status(401).json({
            message: 'You must upload at least one image'
        });

        const studentNewImage = Buffer(fs.readFileSync(image.path).toString('base64'), 'base64');
        const studentNewFileType = image.mimetype;

        student.studentImage.imageByte = studentNewImage;
        student.studentImage.fileType = studentNewFileType;

        await student.save();

        res.status(200).json({
            message: 'Image successfully uploaded'
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};