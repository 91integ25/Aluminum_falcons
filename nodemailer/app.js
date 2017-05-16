const nodemailer =  require('nodemailer');
const xoauth2 = require('xoauth2');

var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		xoauth2: xoauth2.createXOAuth2Generator({
			user: 'robz.ms.qcf@gmail.com',
			clientId: '714740077954-j1l45571phu2f5f933a64l7j4gd3vj6m.apps.googleusercontent.com',
			clientSecret: 'TjnDZJgF-2af7t1w60uUBQYO',
			refreshToken: '',
		})
	}
})

var mailOptions = {
	from: 'robz.ms.qcf@gmail.com',
	to: '91integ25@gmail.com, robz.ms.qcf@gmail.com',
	subject: 'Nodemailer Test',
	text: 'This should do the trick'
}

transporter.sendMail(mailOptions, function(err, res) {
	if(err){
		console.log('Error');
	} else {
		console.log('Email Sent');
	}
})