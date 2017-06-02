var express = require('express');
var router = express.Router();


router.get("/",function(req,res){
	res.render("homepage");
});

router.get("/senti",function(req,res){
	res.render("sentiment");
});

module.exports = router;
