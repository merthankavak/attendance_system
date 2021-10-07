const Student = require('./model/student_model');

exports.register = async (req, res) => {
    try {
        const {
            studentMail
        } = req.body;

        // Check the student account does already exist
        const student = await Student.findOne({
            studentMail
        });

        if (student) return res.status(401).json({
            message: 'The email adress you have entered is already associated with another student account'
        });

        // If does not exit create the new student

        const newStudent = new Student({
            ...req.body,
            role: 'basic',
        });

        const student_ = await newStudent.save();

    } catch (error) {

    }
}


