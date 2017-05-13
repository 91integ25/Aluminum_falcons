var apiRoutes = require("../routes/apiRoutes");
var should = require("chai").should();

describe("apiRoutes",function(){
	it("should throw error if no tweets",function(){
		apiRoutes.tweetsData(function(data){
			data[0].should.be.a("string");
		})
	});
	it("should throw error if no response",function(){
		apiRoutes.awsApi(function(data){
			data[0].should.be.an("object")
		})
	})
})