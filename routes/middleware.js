var cookieParser = require('cookie-parser');
var gtGroupSecret = process.env.GT_GROUP_SECRET || 'ImTooLazyToWriteMyOwnSecretEnvValue';
var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var routes = require("./htmlRoutes");

module.exports = {
  use: function(app) {
    app.use(cookieParser(gtGroupSecret));
    app.use(express.static(process.cwd() + "/public"));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended:true}));
    app.use(bodyParser.text());
    app.use(bodyParser.json({ type: "application/vnd.api+json" }));
    app.use(methodOverride("_method"));
    app.use("/",routes);
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
    
  }
}