/*
------------------------------------------------------
*/
// file: index.js

var _ = require("lodash");
var express = require("express");
var bodyParser = require("body-parser");
var jwt = require('jsonwebtoken');

var passport = require("passport");
var passportJWT = require("passport-jwt");

var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;

const Sequelize = require('sequelize');

const sequelize = new Sequelize('nodecms', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
  
    pool: {
      max: 5,
      min: 0,
      idle: 10000
    },
  
  });
  
  sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });


//controllers
const AuthController = require("./app/controllers/LoginController.js")(sequelize);
console.log('key',process.env)

var jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken(); 
jwtOptions.secretOrKey = process.env.APP_KEY;

var strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
  console.log('payload received', jwt_payload);
  User.findById(jwt_payload.id).then(user => {
    if (user) {
        next(null, user);
      } else {
        next(null, false);
      }
    console.log(user)
  })


});

passport.use(strategy);

var app = express();
app.use(passport.initialize());

// parse application/x-www-form-urlencoded
// for easier testing with Postman or plain HTML forms
app.use(bodyParser.urlencoded({
  extended: true
}));

// parse application/json
app.use(bodyParser.json())

app.get("/", function(req, res) {
  User.findAll().then(users => {
    res.json({message: "Express is up!",users});
  })
  
});

app.post("/login", AuthController.login);
app.post("/register", AuthController.register);

app.get("/secret", passport.authenticate('jwt', { session: false }), function(req, res){
  res.json({message: "Success! You can not see this without a token"});
});


app.listen(3000, function() {
  console.log("Express running port 3000!");
});