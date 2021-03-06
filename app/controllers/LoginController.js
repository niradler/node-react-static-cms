

  module.exports = function (sequelize) {
    var jwt = require('jsonwebtoken');
    const User = require("../models/User.js")(sequelize);
    const env = require('dotenv').config();
    return {
        login: (req, res) => {
          if(!(req.body.email && req.body.password)){
            res.status(401).json({err:"missing fields!"});
        }
            User.findAll({
              where: {
                  email: req.body.email
              }
            }).then(user => {
              if (user && user.length) {
            
                  if(user[0].dataValues.password === req.body.password) {
                      // from now on we'll identify the user by the id and the id is the only personalized value that goes into our token
                      var payload = {id: user[0].dataValues.id};
                      var token = jwt.sign(payload, env.parsed.APP_KEY);
                      return res.json({message: "ok", token: token});
                    } else {
                      return res.status(401).json({message:"passwords did not match"});
                    }
                } else {
                  return res.status(401).json({message:"no such user found"});
                }
              console.log(user);
            })
          },
        register: (req, res) => {
            if(!(req.body.email && req.body.password&& req.body.name)){
              return  res.status(401).json({err:"missing fields!"});
            }
           //force: true will drop the table if it already exists
          // User.sync({force: false}).then(() => {
            // Table created
            return User.create({
              name: req.body.name,
              password: req.body.password,
              email:req.body.email,
            }).then((u)=>{
                console.log('reg',u)
                return res.json({message: "registration complete!"});
            }).catch((e)=>{
              return res.status(401).json({message:"registration failed!"});
            });
          // });
          
          
          }
    };
};