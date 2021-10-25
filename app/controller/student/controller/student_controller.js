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

// @route POST api/student/update/:id
// @desc Student Update
exports.update = async function (req, res) {
    try {
        const id = req.params.id;
        const newName = req.body.studentName;
        var image = req.file;

        const student = await Student.findById(id);

        if (!student) return res.status(401).json({
            message: 'Student does not exist'
        });

        if (!image) {
            // Name only
            if (newName == student.studentName) return res.status(401).json({
                message: 'Same as previous name!'
            });

            student.studentName = newName;

            await student.save();

            res.status(200).json({
                message: 'Name successfully updated'
            });

        } else {
            //Image only
            if (!newName) {
                const studentNewImage = Buffer(fs.readFileSync(image.path).toString('base64'), 'base64');
                const studentNewFileType = image.mimetype;

                student.studentImage.imageByte = studentNewImage;
                student.studentImage.fileType = studentNewFileType;

                await student.save();

                res.status(200).json({
                    message: 'Image successfully updated'
                });

            } else {
                if (newName === student.studentName) {
                    const studentNewImage = Buffer(fs.readFileSync(image.path).toString('base64'), 'base64');
                    const studentNewFileType = image.mimetype;

                    student.studentImage.imageByte = studentNewImage;
                    student.studentImage.fileType = studentNewFileType;

                    await student.save();

                    res.status(200).json({
                        message: 'Image successfully updated'
                    });

                } else {
                    //Image and name
                    student.studentName = newName;
                    const studentNewImage = Buffer(fs.readFileSync(image.path).toString('base64'), 'base64');
                    const studentNewFileType = image.mimetype;

                    student.studentImage.imageByte = studentNewImage;
                    student.studentImage.fileType = studentNewFileType;

                    await student.save();

                    res.status(200).json({
                        message: 'Student information successfully updated'
                    });
                }
            }
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};