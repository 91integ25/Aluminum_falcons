const nodemailer =  require('nodemailer');
const xoauth2 = require('xoauth2');

var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		xoauth2: xoauth2.createXOAuth2Generator({
			user: 'robz.ms.qcf@gmail.com',
			clientId: '714740077954-a0he0j6amaciht9r3ksotp1t60g24cgi.apps.googleusercontent.com',
			clientSecret: 'HUDP1Oh_-hm_QLWo9OeEBFEQ',
			refreshToken: '1/UkQU226UisXLbhmB_L1B38bRxljMftgFhkx-dIfUEgI'
		})
	}


})

var mailOptions = {
	from: 'robz.ms.qcf@gmail.com',
	to: '91integ25@gmail.com',
	subject: 'Nodemailer Test',
	text: 'This should do the trick'
}

transporter.sendMail(mailOptions, function(err, res) {
	if(err){
		console.log(err);
	} else {
		console.log('Email Sent');
	}
})