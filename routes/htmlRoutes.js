var express = require('express');
var router = express.Router();
var user = {
	user_name:"Jesus Carrillo",
	company:"macys",
	sentiment:0.8888
}

router.get("/",function(req,res){
	res.render("index",user);
})

module.exports = router;