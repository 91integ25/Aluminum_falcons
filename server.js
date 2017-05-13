var express = require('express');
var app = express();
var methodOverride = require('method-override');
var bodyParser = require('body-parser');
var PORT = process.env.PORT || 8080;
var db = require("./models");
var exphbs = require("express-handlebars");
var apiRoutes = require("./routes/apiRoutes");
var routes = require("./routes/htmlRoutes");



app.use(express.static(process.cwd() + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.text());
app.use(methodOverride("_method"));

app.engine("handlebars",exphbs({defaultLayout:"main"}));
app.set("view engine","handlebars");
apiRoutes.route(app);
app.use("/",routes)
//apiCall.analyze;
apiRoutes.route(app);
db.sequelize.sync({force:true}).then(function(){
	app.listen(PORT,function(){
		console.log("listening on PORT: " + PORT)
	});
});



