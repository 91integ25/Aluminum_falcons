var express = require('express');
var app = express();
var PORT = process.env.PORT || 8080;
var db = require("./models");
var exphbs = require("express-handlebars");
var apiRoutes = require("./routes/apiRoutes");
var routes = require("./routes/htmlRoutes");
var jwt = require('jsonwebtoken');
var middleware = require('./routes/middleware')
//new code 
middleware.use(app);
app.engine("handlebars",exphbs({defaultLayout:"main"}));
app.set("view engine","handlebars");
apiRoutes.route(app);

//Syncing our sequelize models and then starting our express app

db.sequelize.sync({}).then(function(){
	app.listen(PORT,function(){
		console.log("listening on PORT: " + PORT)
	});
});



