var keys = require("../keys");
var Twitter = require("twitter");
var unirest = require("unirest");
var express = require("express");
var db = require("../models");
var bcrypt = require("bcrypt");
var salt = "$2a$10$.zvkhL71NZo804bNdFdBae";
var jwt = require("jsonwebtoken");
var stream;
var tweetCount;
var monitoringCompany;
var tweetTotalSentiment;
var sentiment = require("sentiment");

var client = new Twitter({
    consumer_key: keys.consumer_key,
    consumer_secret: keys.consumer_secret,
    access_token_key: keys.access_token,
    access_token_secret: keys.access_secret
});

function tweetsData(company, cb) {
    console.log(company);
  		client.stream("statuses/filter", { track: company },function(inStream){
    	stream = inStream;
    });
    var arr = [];
    stream.on("data", function(event) {
        arr.push(event.text);      
          if (arr.length === 20){
            cb(arr);
        }
    });
};

function awsApi(cb, company) {
    var apiResults = [];
    tweetsData(company, function(tweetArr) {
//JSLINT says unexpected for and unexpected var
        for (var i = 0; i < tweetArr.length; i++) {
            unirest.post("https://twinword-sentiment-analysis.p.mashape.com/analyze/")
                .header("X-Mashape-Key", "BOEwktCNBDmshSUeLunnuyGLz48wp1yHuyljsnNDWN4oLTDPPG")
                .header("Content-Type", "application/x-www-form-urlencoded")
                .header("Accept", "application/json")
                .send("text=" + tweetArr[i])
                .end(function(result) {
                    apiResults.push(result.body);

                    if (apiResults.length === i) {
                        cb(apiResults);
                    }
                });
        }
    });
}

function beginMonitoring(cb,company) {
    // cleanup if we're re-setting the monitoring
    if (monitoringCompany) {
        resetMonitoring();
    }
    monitoringCompany = company;
    tweetCount = 0;
    tweetTotalSentiment = 0;
            client.stream("statuses/filter", {
                "track": monitoringCompany
            }, function (inStream) {
            	// remember the stream so we can destroy it when we create a new one.
            	// if we leak streams, we end up hitting the Twitter API limit.
            	stream = inStream;
                console.log("Monitoring Twitter for " + monitoringCompany);
                stream.on("data", function (data) {
                    // only evaluate the sentiment of English-language tweets
                    if (data.lang === "en") {
                        sentiment(data.text, function (err, result){
                            tweetCount++;
                            tweetTotalSentiment += result.score;
                            var tweetAvg = tweetTotalSentiment/tweetCount;
                            console.log("result.score", result.score)
                            console.log("tweetAvg:", tweetAvg)
                            cb(tweetTotalSentiment);
                        });
                    }
                });
                stream.on("error", function (error, code) {
	                console.error("Error received from tweet stream: " + error);
		            if (code === 420)  {
	    		        console.error("API limit hit, are you using your own keys?");
            		}
	                resetMonitoring();
                });
				stream.on("end", function (response) {
					if (stream) { // if we're not in the middle of a reset already
					    // Handle a disconnection
		                console.error("Stream ended unexpectedly, resetting monitoring.");
		                resetMonitoring();
	                }
				});
				stream.on("destroy", function (response) {
				    // Handle a 'silent' disconnection from Twitter, no end/error event fired
	                console.error("Stream destroyed unexpectedly, resetting monitoring.");
	                resetMonitoring();
				});
        });
            return stream;
};

function sentitwit(cb, company) {
beginMonitoring(function(score){
	cb(score);
},company)
};

function resetMonitoring() {
	if (stream) {
		var tempStream = stream;
	    stream = null;  // signal to event handlers to ignore end/destroy
		tempStream.destroy();
	};
}
// POST route for creating a new user changed apiRouter to app
        //TODO will app work without a var app
module.exports = {
    route: function(app) {        
        app.post("/user", function(req, res) {
            bcrypt.hash(req.body.password, salt, function(err, hash) {
                // Store hash in your password DB.
                // TODO: update schema to enforce unique usernames
                db.User.create({
                        username: req.body.username,
                        email: req.body.email,
                        password: hash
                    })
                    .then(function(dbPost) {
                        res.status(200).json({ "status": "success" });
                    })
                    .catch(function(err) {
                        res.status(500).send(err);
                    })
            });
  });	
		app.post("/api/create_stock",function(req,res){
		sentitwit(function(score){
						var stock = {
				company:req.body.company,
				sentiment:score
			}	
				res.render("website",stock)
				},req.body.company);
		});
		// 		app.post("/sign-up",function(req,res){
		// 			console.log(req.body)
		// 			db.User.create(req.body).then(function(){
		// 				res.json(req.body);
		// 			});
		// 		});
		// 		app.get("/log-in",function(req,res){
		// 			db.User.findOne({
		// 				userName:req.body.userName
		// 			}).then(function(result){
		// 				res.render("website",result);
		// 			})
		// 		});
		// app.get("/test", function(req, res) {
		//   res.status(200).json({ 'message': 'Success'})
		// });	
	}
	  monitoringCompany = "";
}
module.exports = {

        route: function(app) {

                    // POST route for creating a new user changed apiRouter to app
                    //TODO will app work without a var app
                app.post("/user", function(req, res) {
                    bcrypt.hash(req.body.password, salt, function(err, hash) {
                        // Store hash in your password DB.
                        // TODO: update schema to enforce unique usernames
                        db.User.create({
                                username: req.body.username,
                                email: req.body.email,
                                password: hash
                            })
                            .then(function(dbPost) {
                                res.status(200).json({ 'status': 'success' });
                            })
                            .catch(function(err) {
                                res.status(500).send(err);
                            })
                    });

     			      });


      		app.post("/api/create_stock",function(req,res){
      		sentitwit(function(score){
      						var stock = {
      				company:req.body.company,
      				sentiment:score
      			}
      				res.render("website",stock)
      				},req.body.company);
      		});


// 		app.post("/sign-up",function(req,res){
// 			console.log(req.body)
// 			db.User.create(req.body).then(function(){
// 				res.json(req.body);
// 			});
// 		});

// 		app.get("/log-in",function(req,res){
// 			db.User.findOne({
// 				userName:req.body.userName
// 			}).then(function(result){
// 				res.render("website",result);
// 			})
// 		});

		// app.get("/test", function(req, res) {
		//   res.status(200).json({ 'message': 'Success'})
		// });
		// // POST route for creating a new user
		// app.post("/user", function(req, res) {
		//   bcrypt.hash(req.body.password, salt, function(err, hash) {
		//     // Store hash in your password DB.
		//     // TODO: update schema to enforce unique usernames
		//     db.User.create({
		//       username: req.body.username,
		//       password: hash
		//     })
		//       .then(function(dbPost) {
		//         res.status(200).json({'status': 'success'});
		//       });
		//   });
		// });
		
			app.post("/user/signin", function(req, res) {
                    db.User.findOne({
                            username: req.body.username
                        })
                        .then(function(user) {
                            if (!user) {
                                console.log('no user found')
                                res.status(400).json({
                                    'status': 'Invalid username or password'
                                })
                            } else {
                                bcrypt.compare(req.body.password, user.password, function(err, valid) {
                                    if (err || !valid) {
                                        res.status(400).json({
                                            'status': 'Invalid username or password'
                                        })
                                    } else {
                                        var userToken = jwt.sign({
                                            //expires in one hour
                                            exp: Math.floor(Date.now() / 1000) + (60 * 60),
                                            data: user.id,
                                        }, "randomsecretforsigningjwt");
                                        res.status(200).json({
                                            id: user.id,
                                            username: user.username,
                                            token: userToken
                                        });
                                    }
                                });
                            }

                        });
                });


}

}
