var express = require('express');
var app = express();
var methodOverride = require('method-override');
var bodyParser = require('body-parser');
var PORT = process.env.PORT || 8080;
var db = require("./models");
var exphbs = require("express-handlebars");
var apiRoutes = require("./routes/apiRoutes");
var routes = require("./routes/htmlRoutes");
var jwt = require('jsonwebtoken');


app.use(express.static(process.cwd() + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));
app.use(methodOverride("_method"));

app.engine("handlebars",exphbs({defaultLayout:"main"}));
app.set("view engine","handlebars");
apiRoutes.route(app);
//app.use(app.router); no longer needed
//routes.initialize(app);
app.use("/",routes);

//app.use('/api', apiRoutes);
app.use('/api/secure', function (req, res, next) {
  // check authorization
  // if authorized next()
  if (!req.header('Authorization')) {
    res.status(401).json({ 'status': 'Not Authorized'});
  } else {
    jwt.verify(req.header('Authorization'), 'randomsecretforsigningjwt', function(err, decoded) {
      if (err) {
        console.log('err', err)
        res.status(401).json({ 'status': 'Not Authorized'});
      } else {
        console.log(decoded.data) // bar
        // query db for privileges for user
        // add to req.privs
        next();
      }
    });
  }
  // else res.status(401).json({})
});
//app.use('/api/secure', apiRoutes);

//Syncing our sequelize models and then starting our express app

db.sequelize.sync({}).then(function(){
	app.listen(PORT,function(){
		console.log("listening on PORT: " + PORT)
	});
});



