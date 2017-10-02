/*
------------------------------------------------------
*/
// file: index.js
const env = require('dotenv').config();
const _ = require("lodash");
const express = require("express");
const bodyParser = require("body-parser");
const jwt = require('jsonwebtoken');

const passport = require("passport");
const passportJWT = require("passport-jwt");

const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

const Sequelize = require('sequelize');
var app = express();
let sequelize = new Sequelize('nodecms', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
  //   define: {
  //     timestamps: false
  // },
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


var jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken(); 
jwtOptions.secretOrKey = env.parsed.APP_KEY;

var strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
  console.log('payload received', jwt_payload);
  console.log('mid',jwt_payload.id);
  User.findById(jwt_payload.id).then(user => {
    if (user) {
        next(null, user);
      } else {
        next(null, false);
      }
    console.log('user => ',user);
  })
  console.log('------------------------------------');

});

passport.use(strategy);


app.use(passport.initialize());

// parse application/x-www-form-urlencoded
// for easier testing with Postman or plain HTML forms
app.use(bodyParser.urlencoded({
  extended: true
}));

// parse application/json
app.use(bodyParser.json())

app.get("/", function(req, res) {
 return res.json({message: "Express is up!"}); 
});

app.post("/login", AuthController.login);
app.post("/register", AuthController.register);

app.get("/secret", passport.authenticate('jwt', { session: false }), function(req, res){
  return res.json({message: "Success! You can not see this without a token"});
});


app.listen(3000, function() {
  console.log("Express running port 3000!");
});