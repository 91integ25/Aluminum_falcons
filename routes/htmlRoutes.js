var express = require('express');
var router = express.Router();


router.get("/",function(req,res){
	res.render("homepage");
});

router.get("/website", function(req,res){
	res.render("homepage", {
		loggedIn: true
	});
});


module.exports = router;