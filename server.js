// var express = require('express');
// var app = express();
// var methodOverride = require('method-override');
// var bodyParser = require('body-parser');
// var PORT = process.env.PORT || 8080;
// var exphbs = require("express-handlebars");



// app.use(express.static(process.cwd() + "/public"));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended:true}));
// app.use(bodyParser.text());
// app.use(methodOverride("_method"));

// app.engine("handlebars",exphbs({defaultLayout:"main"}));
// app.set("view engine","handlebars");




// app.listen(PORT,function(){
// 	console.log("listening on PORT: " + PORT)
// });
// var sentiment = require("sentiment");
// var CONSUMER_KEY = "KNRgIo5LpfIoK77bsy9VDORZr";
// var CONSUMER_SECRET = "mCu6uQUcpGgBi6Tnvq6nQ1uBZLZRxa3Jj662LjgVjlSvlNWiq1";
// var ACCESS_TOKEN = "788852777195671552-A4WTbe4Qr9KWI8DyrpqBl1XcGpdVXpJ";
// var ACCESS_SECRET = "nkiMAXR8od4OJioobmRz2PI19qaatxKhfRHR40LFBPjG2";
// var Twitter = require('twitter');
 
// var client = new Twitter({
//     consumer_key: CONSUMER_KEY,
// 	consumer_secret:CONSUMER_SECRET,
// 	access_token_key: ACCESS_TOKEN,
// 	access_token_secret: ACCESS_SECRET
// });
 
// var stream = client.stream('statuses/filter', {track: 'london'});
// stream.on('data', function(event) {
// var counter = 1;
// 		var result = sentiment(event.text);
// 	if(counter === 15){
// 		return counter;
// 	}else if(result){
// 		counter++

// 		console.log("result is: " + result.score,event && event.text);
		
// 		console.log(counter)
// 	}

// });
 
// stream.on('error', function(error) {
//   throw error;
// });
 //http://fierce-plateau-88476.herokuapp.com/api/friends
//  var request = require('request');
// request('http://fierce-plateau-88476.herokuapp.com/api/friends', function (error, response, body) {
//     if (!error && response.statusCode == 200) {
//         console.log(body) // Print the google web page.
//      }
// })
// //request.post('http://fierce-plateau-88476.herokuapp.com/api/friends', {form:{name:"Dave",photo:"Image of dave",choice:[2,4,5,5,3,4,1,1,1,2]}});
// var rp = require("request-promise")
// var options = {
//     method: 'POST',
//     uri: 'http://fierce-plateau-88476.herokuapp.com/api/friends',
//     body: {
//         some:{form:{name:"my new post",photo:"Image of dave",choice:[2,4,5,5,3,4,1,1,1,2]}}
//     },
//     json: true // Automatically stringifies the body to JSON 
// };
 
// rp(options)
//     .then(function (parsedBody) {
//         // POST succeeded... 
//         request('http://fierce-plateau-88476.herokuapp.com/api/friends', function (error, response, body) {
//     if (!error && response.statusCode == 200) {
//         console.log(body) // Print the google web page.
//      }
// })
//         console.log(parsedBody);
//     })
//     .catch(function (err) {
//         // POST failed... 
//     });
