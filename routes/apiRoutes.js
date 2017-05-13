var keys = require('../keys');
var Twitter = require('twitter');
var unirest = require("unirest");
var express = require('express');
var router = express.Router();
var client = new Twitter({
	consumer_key: keys.consumer_key,
	consumer_secret: keys.consumer_secret,
	access_token_key: keys.access_token,
	access_token_secret: keys.access_secret
});
function tweetsData(company,cb){
		var stream =  client.stream('statuses/filter', {track: company});
		var arr = [];
		stream.on('data', function(event) {
			arr.push(event.text);
			if(arr.length === 2){
				console.log("this is tweets: ",arr);
				cb(arr);
			}
		});
	}
	function awsApi(cb,company){
		var apiResults = []
			tweetsData(company,function(data){
				for(var i = 0 ; i <= data.length; i++){
					unirest.post("https://twinword-sentiment-analysis.p.mashape.com/analyze/")
					.header("X-Mashape-Key", "BOEwktCNBDmshSUeLunnuyGLz48wp1yHuyljsnNDWN4oLTDPPG")
					.header("Content-Type", "application/x-www-form-urlencoded")
					.header("Accept", "application/json")
					.send("text="+data[i])
					.end(function (result) {
					  apiResults.push(result.body);

					});
				}
				console.log(apiResults)
				cb(apiResults)
			});
	}
module.exports = {
	route: function(app){
		app.post("/api/create_stock",function(req,res){
			awsApi(function(data){
				console.log(data);
				res.json({company: req.body.company,sentiment:data});
			},req.body.company)
		})
	}


}
