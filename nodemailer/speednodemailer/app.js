var http = require('htpp');
var express = require('express');
var nodemailer = require('nodemailer');

var body-parser = require('body-parser');
var app = express();
var port Number(process.env.PORT || 5000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended.true
}));

// Front Page

app.get('/', function(req, res){
	res.sendfile('index.html');
	console.log('NodeMailer reading console log...' + req.url);
});

// sending mail function
app.post('/send', function(req, res) {
	if(req.body.mail == "" || req.body.subject == "") {
		res.send("Error: Email & Sunject should not be blank");
		return false;	
	}
})

		//Sending Emails with SMTP, configuration using  SMTP settings
		var smtpTransport = nodemailer.createTransport("SMTP", {
			host: "smtp.gmail.com", //hostname
			secureConnection: true, //use SSL
			port: 465, //port for secure SMTP
				auth: {
					user: 'robz.ms.qcf@gmail.com',
					pass: 'Tar191fad377$'
				}
		});

		var mailOptons = {
			from: "Node Emailer - <robz.ms.qcf@gmail.com>", //sender address
			to: req.body.email, //receivers list
			subject: req.body.subject + " -", //subject line
			html: "<b>" +req.body.description+"<b>" //html body of the index.html file
		}
		smtpTransport.sendMail(mailOptions, function(error, response) {
			if(error) {
				res.send("Email could not be sent to error" + error);
			} else {
				res.send("Email was sent!");
			}
		});

		var server = http. createServer(app).listen(port, function() {
			console.log("Server running on " + port);

		});
	 