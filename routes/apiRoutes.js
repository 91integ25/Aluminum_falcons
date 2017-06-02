var keys = require("../keys");
var Twitter = require("twitter");
var unirest = require("unirest");
var express = require("express");
var db = require("../models");
var bcrypt = require("bcrypt");
var salt = "$2a$10$.zvkhL71NZo804bNdFdBae";
var jwt = require("jsonwebtoken");
var stream;

var sentiment = require("sentiment");

var client = new Twitter({
    consumer_key: keys.consumer_key,
    consumer_secret: keys.consumer_secret,
    access_token_key: keys.access_token,
    access_token_secret: keys.access_secret
});

var tweetCount = 0;
var tweetTotalSentiment = 0;
var monitoringCompany;

function resetMonitoring() {
	if (stream) {
		var tempStream = stream;
	    stream = null;  // signal to event handlers to ignore end/destroy
		tempStream.destroy();

	}
  monitoringCompany = "";

}

function beginMonitoring(company) {
    // cleanup if we're re-setting the monitoring
    if (monitoringCompany) {
        resetMonitoring();
    }
    monitoringCompany = company.toUpperCase();
    console.log(company);
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
                            //console.log("tweetCount: ", tweetCount);
                            //console.log("tweetTotalSentiment: ",tweetTotalSentiment);

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


function sentimentGauge() {
    var avg = tweetTotalSentiment / tweetCount;
    if (avg > 0.5) { // happy
        return "Excited, with an avg score of: " + avg;
    }
    if (avg < -0.5) { // angry
        return "Angry, with an avg score of: " + avg;
    }
    // neutral
    return "Neutral, with an avg score of: " + avg;
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
                	var status = {
                		status:"You have completed sign up log in to continue"
                	}
                    res.status(200).render("homepage",status);
                })
                .catch(function(err) {
                    res.status(500).send(err);
                })
            });

		});
       	//app.get("/user/logout", function(req, res, next) {
		//   req.session.destroy();
		//   res.redirect("/user");
		// });
		app.get("/sentiment/:stock",function(req,res){
      db.Stock.findAll({
        where:{UserId:req.body.UserId},
        include:[db.User]
      }).then(function(dbStock){

        res.render("sentiment",{
              stock: dbStock,
              company: req.params.stock,
              tweetCount: tweetCount,
              sentimentGauge: sentimentGauge(),
              user:dbStock[0],
              username: req.body.username,
              loggedIn: true
            });
            // console.log(user);
      })
        // var monitoringResponse = "<HEAD>" +
        // "<META http-equiv=\"refresh\" content=\"5; URL=http://" +
        // req.headers.host + "/sentiment" +
        // "/\">\n" +
        // "<title>New Twitter Sentiment Analysis</title>\n" +
        // "</HEAD>\n" +
        // "<BODY>\n" +
        // "<P>\n" +
        // "Please allow for sentiment to be gathered. The Twittersphere is feeling<br>\n" +
        // " " + sentimentGauge() + "<br>\n" +
        // "about " + monitoringCompany + ".<br><br>" + "For an accurate depiction of sentiment, please wait for a larger sample size of tweets.<br>" +
        // "Analyzed " + tweetCount + " tweets...<br>" +
        // "</P>\n" +
        // // "<A href=\"/reset\">Monitor another phrase</A>\n" +
        // "<form action=\"/reset\" method=\"post\">" +
        // "<input type=\"hidden\" name=\"UserId\" value=\"{{this.User.id}}\">" +
        // "<button type=\"submit\">Return</button>" + "</form>" +
        // "</BODY>";
        // res.send(monitoringResponse);

	  	});

    app.get('/get_stock/:stock', function (req, res) {
      beginMonitoring(req.params.stock);
      res.redirect("/sentiment/"+req.params.stock);

    });

  //   app.post('/reset', function (req, res) {
  //   resetMonitoring();
  //     console.log(req.body.UserId);
  //     console.log(db.User);
  //   db.Stock.findAll({
  //     where:{UserId:req.body.UserId},
  //     include:[db.User]
  //   }).then(function(dbStock){
  //     res.render("homepage",{
  //
  //           stock: dbStock,
  //           user:dbStock[0].User,
  //           username: req.body.username,
  //           loggedIn: true
  //         });
  //   });
  // });

  		app.post("/api/create_stock",function(req,res){
  			//console.log("this is Create: ",req.body)
      		db.Stock.create(req.body).then(function(result){
		  		db.Stock.findAll({
		  			where:{UserId:req.body.UserId},
		  			include:[db.User]
		  		}).then(function(dbStock){
		  			res.render("homepage",{
		              stock: dbStock,
		              user:dbStock[0].User,
		              username: req.body.username,
		              loggedIn: true
		            });

		  		})

      	});
  		});
      app.delete("/api/delete_stock/:id",function(req,res){
                db.Stock.destroy({
                        where:{
                        id:req.params.id
                    }}).then(function(user){
                          db.Stock.findAll({
                            where:{UserId:req.body.UserId},
                            include:[db.User]
                          }).then(function(dbStock){
                          if(!dbStock[0]){
                            res.render("homepage",{
                                user:user[0],
                                loggedIn:true
                            });
                            }else{
                                res.render("homepage",{
                                stock: dbStock,
                                user:dbStock[0].User,
                                username: req.body.username,
                                loggedIn: true
                              });
                            }
                            });

                })
          });

        app.post("/user/signin", function(req, res) {
                    console.log(req.body.username);
                    db.User.findAll({
                        where:{
                        username:req.body.username
                    }}).then(function(user){

                        db.Stock.findAll({
                              where:{UserId:user[0].id},
                              include:[db.User]
                          }).then(function(dbStock){

                              console.log(user)
                              if(!dbStock[0]){
                                  res.render("homepage",{
                                      user:user[0],
                                      loggedIn:true
                                  })
                              }else{
                                  if(!dbStock[0].User){
                                    res.status(400).render("homepage",{
                                        'status': 'Invalid username or password'
                                    })
                                }else{
                                    bcrypt.compare(req.body.password, dbStock[0].User.password, function(err, valid) {
                                        if (err || !valid) {
                                            res.status(400).render("homepage",{
                                                'status': 'Invalid username or password'
                                            })
                                        }else{
                                            var userToken = jwt.sign({
                                            //expires in one hour
                                            exp: Math.floor(Date.now() / 1000) + (60 * 60),
                                                                  data: user.id
                                            }, 'randomsecretforsigningjwt');
                                            console.log(dbStock[0].User);

                                            res.render("homepage",{
                                              stock: dbStock,
                                              user:dbStock[0].User,
                                              loggedIn: true,
                                              userToken:userToken
				                    });
	                            }

	                        });
	                }   }
            	});
      		});
		});
	}
}
