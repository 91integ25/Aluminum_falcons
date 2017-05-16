'use strict';
const nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'robz.ms.qcf@gmail.com',
        pass: 'yourpass'
    }
});

// setup email data with unicode symbols
let mailOptions = {
    from: '"Robzter Foo 👻" <robz.ms.qcf@gmail.com>', // sender address
    to: '91integ25@gmail.com, robz.ms.qcf@gmail.com', // list of receivers
    subject: 'Hello ✔', // Subject line
    text: 'Please confirm you got this shit ?', // plain text body
    html: '<b>Hello world ?</b>' // html body
};

// send mail with defined transport object
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
});