const express = require('express');
const mongoose = require('mongoose');

const teacherPassport = require('passport');
const studentPassport = require('passport');
const path = require('path');
const app = express();
const multer = require('multer');
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => cb(null, new Date().toISOString() + '-' + file.originalname)

});
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 14
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb('Only jpeg/jpg or png files!', false);
        }
    }
});
require('dotenv').config();


app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
upload.single('image')
app.use(express.static('public'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGOURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const connection = mongoose.connection;
connection.once('open', () => console.log('MongoDB Success -- Database Connection Successfully Done!'));
connection.on('error', (err) => {
    console.log('MongoDB Error -- Connection Error: ' + err);
    process.exit();
});

app.use(studentPassport.initialize());
app.use(teacherPassport.initialize());
require("./middlewares/jwt/student_jwt")(studentPassport);
require("./middlewares/jwt/teacher_jwt")(teacherPassport);
require('./routes/index_route')(app);

app.listen(process.env.PORT, () => console.log('Server is running on ' + process.env.PORT));