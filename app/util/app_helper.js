const Datauri = require('datauri');
const Path = require('path');
const SendgridMail = require('@sendgrid/mail');

SendgridMail.setApiKey(process.env.SENDGRID_API_KEY);

function sendMail(mailOptions) {
    return new Promise((resolve, reject) => {
        SendgridMail.send(mailOptions, (error, result) => {
            if (error) return reject(error);
            return resolve(result);
        });
    });
}

module.exports = {
    sendEmail
}