const Student = require('../model/student_model');
const fs = require('fs-extra');
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});


const config = new AWS.Config({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,

});

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
        const newName = req.body.fullName;
        var image = req.file;

        const student = await Student.findById(id).exec();

        if (!student) res.status(401).json({
            message: 'Student does not exist'
        });

        if (!image) {
            // Name only
            if (newName == student.fullName) res.status(401).json({
                message: 'Same as previous name!'
            });

            student.fullName = newName;

            await student.save();

            res.status(200).json({
                message: 'Name successfully updated'
            });

        } else {
            //Image only
            if (!newName) {
                const imageData = await s3.getObject({
                    Bucket: "attendancesystembucket",
                    Key: req.file.originalname,
                }).promise();

                await fs.writeFile('./uploads/' + imageData.originalname, imageData.Body);

                const imageRead = await fs.readFileSync('./uploads/' + imageData.originalname);
                var imageByte = Buffer.from(imageRead.toString('base64'), 'base64');

                const studentNewFileType = image.mimetype;
                student.studentImage.imageByte = imageByte;
                student.studentImage.fileType = studentNewFileType;
                student.imageUrl = imageData.location;

                await student.save();

                res.status(200).json({
                    message: 'Image successfully updated'
                });

            } else {
                if (newName === student.fullName) {
                    const imageData = await s3.getObject({
                        Bucket: "attendancesystembucket",
                        Key: req.file.originalname,
                    }).promise();

                    await fs.writeFile('./uploads/' + imageData.originalname, imageData.Body);

                    const imageRead = await fs.readFileSync('./uploads/' + imageData.originalname);
                    var imageByte = Buffer.from(imageRead.toString('base64'), 'base64');

                    const studentNewFileType = image.mimetype;
                    student.studentImage.imageByte = imageByte;
                    student.studentImage.fileType = studentNewFileType;
                    student.imageUrl = imageData.location;

                    await student.save();

                    res.status(200).json({
                        message: 'Image successfully updated'
                    });

                } else {
                    //Image and name
                    student.fullName = newName;
                    const imageData = await s3.getObject({
                        Bucket: "attendancesystembucket",
                        Key: req.file.originalname,
                    }).promise();

                    await fs.writeFile('./uploads/' + imageData.originalname, imageData.Body);

                    const imageRead = await fs.readFileSync('./uploads/' + imageData.originalname);
                    var imageByte = Buffer.from(imageRead.toString('base64'), 'base64');

                    const studentNewFileType = image.mimetype;
                    student.studentImage.imageByte = imageByte;
                    student.studentImage.fileType = studentNewFileType;
                    student.imageUrl = imageData.location;

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