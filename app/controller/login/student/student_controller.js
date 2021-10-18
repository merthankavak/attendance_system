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

    

        const student = await Student.findOne({
            _id: id
        });

        if (!student) return res.status(401).json({
            message: 'Student does not exist.'
        });

        const studentImageArray = student.image;

        for (let i = 0; i < req.file.length; i++) {
            const newImage = Buffer(fs.readFileSync(req.file.path).toString('base64'), 'base64');
            const newMimetype = req.file.mimetype;
            studentImageArray[i].mimetype = newMimetype;
            studentImageArray[i].imageByte = newImage;
        }
        await student.save();
        res.status(200).json({
            message: 'Student image successfully added'
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};