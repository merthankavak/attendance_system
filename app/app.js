const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const path = require('path');

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
app.listen(port, () => console.log('Server is running on https://localhost:' + port + '/'));