const express = require('express');
const mongoose = require('mongoose');

const teacherPassport = require('passport');
const studentPassport = require('passport');
const path = require('path');
const app = express();
var cors = require('cors');
require('dotenv').config();

app.use(cors({
    credentials: true,
    exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar'],

}));
app.options('*', cors());
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

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