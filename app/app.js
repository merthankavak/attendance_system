const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const path = require('path');
require('dotenv').config();
const data = require('./util/data');

const {
    mongoURI,
    port
} = data;

const app = express();

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(cors());
app.use(express.json());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


mongoose.Promise = global.Promise;
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const connection = mongoose.connection;
connection.once('open', () => console.log('MongoDB Success -- Database Connection Successfully Done!'));
connection.on('error', (err) => {
    console.log('MongoDB Error -- Connection Error: ' + err);
    process.exit();
});

app.use(passport.initialize());
require("./middlewares/student/jwt")(passport);
require("./middlewares/teacher/jwt")(passport);
require('./routes/index')(app);


app.listen(port, () => console.log('Server is running on https://localhost:' + port + '/'));