var apiRoutes = require("../routes/apiRoutes");
var should = require("chai").should();

describe("apiRoutes tweetsData",function(){
	it("should make a call to twitter and get tweets",function(){
		apiRoutes.tweetsData(function(data){
			data[0].should.be.a("string");
		})
	})
})