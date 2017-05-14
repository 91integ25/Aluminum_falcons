var keys = require('../keys');
var Twitter = require('twitter');
var unirest = require("unirest");
var express = require('express');
var db = require("../models");
var bcrypt = require('bcrypt');
var router = express.Router();
var db = require("../models");
var client = new Twitter({
	consumer_key: keys.consumer_key,
	consumer_secret: keys.consumer_secret,
	access_token_key: keys.access_token,
	access_token_secret: keys.access_secret
});
function tweetsData(company,cb){
	console.log(company)
		var stream =  client.stream('statuses/filter', {track: company});
		var arr = [];
		stream.on('data', function(event) {
			arr.push(event.text);
			if(arr.length === 20){
				cb(arr);
			}
		});
	}
	function awsApi(cb,company){
		var apiResults = []
			tweetsData(company,function(tweetArr){
				
				for(var i = 0 ; i < tweetArr.length; i++){
					unirest.post("https://twinword-sentiment-analysis.p.mashape.com/analyze/")
					.header("X-Mashape-Key", "BOEwktCNBDmshSUeLunnuyGLz48wp1yHuyljsnNDWN4oLTDPPG")
					.header("Content-Type", "application/x-www-form-urlencoded")
					.header("Accept", "application/json")
					.send("text="+tweetArr[i])
					.end(function (result) {
						apiResults.push(result.body);
						
						if(apiResults.length === i){
							cb(apiResults);
						}

					});
					
				}
			});
	}

module.exports = {
	route: function(app){
		app.post("/api/create_stock",function(req,res){
			awsApi(function(data){
				console.log("data arr: ",data);
				//console.log("this worked",data);
				var dataNum = data.map(function(e){
					return Number(e.score);
				})
				var dataReduced = dataNum.reduce(function(a,b){
					return a + b;
				})
				console.log(dataReduced/data.length);
				
				//console.log(req.body)
				//res.json({company: req.body.company,sentiment:data});
			},req.body.company)
		});
		app.post("/sign-up",function(req,res){
			console.log(req.body)
			db.User.create(req.body).then(function(){
				res.json(req.body);
			});
		});
		app.get("/log-in",function(req,res){
			db.User.findOne({where:{
				userName:req.body.userName
			}}).then(function(result){
				res.render("website",result);
			})
		});
	}


}
var salt = '$2a$10$.zvkhL71NZo804bNdFdBae';

router.get("/test", function(req, res) {
  res.status(200).json({ 'message': 'Success'})
});



// POST route for creating a new user
router.post("/user", function(req, res) {
  bcrypt.hash(req.body.password, salt, function(err, hash) {
    // Store hash in your password DB.
    // TODO: update schema to enforce unique usernames
    db.User.create({
      username: req.body.username,
      password: hash
    })
      .then(function(dbPost) {
        res.status(200).json({'status': 'success'});
      });
  });

});