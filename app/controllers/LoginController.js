

  module.exports = function (sequelize) {
    var jwt = require('jsonwebtoken');
    const User = require("../models/User.js")(sequelize);
  
    return {
        login: (req, res) => {
            if(req.body.name && req.body.password){
              var name = req.body.name;
              var password = req.body.password;
            }
            User.findAll({
              where: {
                  name: name
              }
            }).then(user => {
              if (user) {
                  if(user[0].dataValues.password === req.body.password) {
                      // from now on we'll identify the user by the id and the id is the only personalized value that goes into our token
                      var payload = {id: user.id};
                      var token = jwt.sign(payload, process.env.APP_KEY);
                      res.json({message: "ok", token: token});
                    } else {
                      res.status(401).json({message:"passwords did not match"});
                    }
                } else {
                  res.status(401).json({message:"no such user found"});
                }
              console.log(user);
            })
          },
        register: (req, res) => {
            if(!(req.body.email && req.body.password&& req.body.name)){
                res.status(401).json({err:"missing fields!"});
            }
           //force: true will drop the table if it already exists
          User.sync({force: false}).then(() => {
            // Table created
            return User.create({
              name: req.body.name,
              password: req.body.password,
              email:req.body.email
            }).then((u)=>{
                console.log('reg',u)
                res.json({message: "ok"});
            });
          });
          
          
          }
    };
};