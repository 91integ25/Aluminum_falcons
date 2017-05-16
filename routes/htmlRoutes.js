var express = require('express');
var router = express.Router();


router.get("/",function(req,res){
	res.render("homepage");
});
router.get("/logged-in",function(req,res){
	res.render("website");
})


module.exports = router;