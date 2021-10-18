const Student = require('../model/student/student_model');

const fs = require('fs-extra');
const multer = require('multer');

exports.changePassword = async (req, res) => {
    try {
        const id = req.params.id;
        const pass = req.body.password;
        const student = await Student.findById(id);

        if (student.comparePassword(pass)) {
            return res.status(401).json({
                message: 'Your password is the same as your previous password'
            });
        }
        student.password = pass;
        // Save the updated student object
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

// @route POST api/student/{id}/uploadimage
// @desc Update student details
// @access Public
exports.uploadImage = async function (req, res) {
    try {
        const id = req.params.id;
        var files = [].concat(req.files);
        const student = await Student.findOne({
            _id: id
        });

        if (!student) return res.status(401).json({
            message: 'Student does not exist.'
        });
        if (files.length < 3) return res.status(401).json({
            message: 'You must upload at least 3 image'
        });

        let studentImages = [];
        for (let i = 0; i < files.length; i++) {
            studentImages[i] = {};
            const newImage = Buffer(fs.readFileSync(files[i].path).toString('base64'), 'base64');
            const newMimetype = files[i].mimetype;
            studentImages[i].mimetype = newMimetype;
            studentImages[i].imageByte = newImage;
        }
        student.image = studentImages;
        await student.save();
        res.status(200).json({
            message: 'Student image successfully uploaded'
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};