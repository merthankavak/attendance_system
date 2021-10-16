const Student = require('../model/student/student_model');

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

// @route PUT api/student/{id}
// @desc Update student details
// @access Public
exports.update = async function (req, res) {
    try {
        const newMimetype = req.file.mimetype;
        const id = req.params.id;

        const newImage = Buffer(fs.readFileSync(req.file.path).toString('base64'), 'base64');
        fs.remove(req.file.path, (err) => {
            if (err)
                console.log(err);
        });


        // update picture only
        Student.findByIdAndUpdate(
            id, {
                mimetype: newMimetype,
                image: newImage
            }, (err, student) => {
                if (err) {
                    res.status(500).json({
                        message: err.message
                    });
                } else {
                    const getImage = (image, mimetype) => {
                        return image ? `data:${mimetype};base64,${Buffer(image).toString('base64')}` : '';
                    }
                    res.status(200).json({
                        image: getImage(newImage, newMimetype),
                        message: 'Student information updated successfully!'
                    });

                }

            });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};