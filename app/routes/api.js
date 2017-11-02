var User = require("../models/user");    //Adding user model
var jwt = require('jsonwebtoken');       //Adding token 
var secret = 'harambe';                  //Secret word for the token

module.exports = function (router) {

    // http://localhost:8080/api/users
    // User registration route
    router.post('/users', function (req, res) {
        var user = new User();
        user.username = req.body.username;
        user.password = req.body.password;
        user.email = req.body.email;
        if (req.body.username == null || req.body.username == '' || req.body.email == null ||
            req.body.password == null || req.body.password == '' || req.body.email == '') {
            res.json({success: false, message: "Ensure username, email and password were provided."})
        } else {
            user.save(function (err) {
                if (err) {
                    res.json({success: false, message: "Username or email already exists."});
                } else {
                    res.json({success: true, message: 'User created'})
                }
            });
        }
    })

    // User login route
    // http://localhost:8080/api/authenticate
    router.post('/authenticate',function(req,res){
        User.findOne({ username: req.body.username}).select('email username password').exec(function(err,user){
            if(err) throw err;

            if (!user) {
                res.json({success: false, message: "Could not authenticate user"})
            }else{
                if (user) {
                    if (req.body.password) {
                        var validPassword = user.comparePassword(req.body.password);
                    }else{
                        res.json({success: false, message: "No password provided."});
                    }
                    
                    if (!validPassword) {
                        res.json({success: false, message: "Could not authenticate password."});
                    }else{
                        // Setting token
                        var token = jwt.sign({ username: user.username, email: user.email }, secret ,{ expiresIn: '24h'});
                        res.json({success: true, message: "User authenticated!",token: token});
                    }
                }
            }
        })
    });

    return router;
}
