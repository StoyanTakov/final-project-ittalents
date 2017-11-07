var User = require("../models/user"); //Adding user model
var Video = require("../models/video"); //Adding video model
var jwt = require('jsonwebtoken'); //Adding token 
var secret = 'harambe'; //Secret word for the token
var multer = require('multer');
var fs = require('fs');
const path = require('path');
module.exports = function (router) {

    // http://localhost:8080/api/users
    // User registration route
    router.post('/users', function (req, res) {
        var user = new User();
        user.name = req.body.name;
        user.username = req.body.username;
        user.password = req.body.password;
        user.email = req.body.email;
        if (req.body.username == null || req.body.username == '' || req.body.email == null ||
            req.body.password == null || req.body.password == '' || req.body.email == '' ||
            req.body.name == null || req.body.name == '') {
            res.json({
                success: false,
                message: "Ensure username, email and password were provided."
            })
        } else {
            user.save(function (err) {
                // Configuring errors for each field in the register form
                if (err) {
                    //Validating the errors in the validation form
                    if (err.errors) {
                        console.log(err)
                        if (err.errors.name) {
                            res.json({
                                success: false,
                                message: err.errors.name.message
                            });
                        } else {
                            if (err.errors.email) {
                                res.json({
                                    success: false,
                                    message: err.errors.email.message
                                });
                            } else {
                                if (err.errors.username) {
                                    res.json({
                                        success: false,
                                        message: err.errors.username.message
                                    });
                                } else {
                                    if (err.errors.password) {
                                        res.json({
                                            success: false,
                                            message: err.errors.password.message
                                        });
                                    }
                                }
                            }
                        }
                    } else {
                        if (err) {
                            // Configuring error for duplicates
                            if (err.code == 11000) {
                                // Specifying what is duplicated from the err
                                if (err.errmsg.indexOf('username') !== -1) {
                                    res.json({
                                        success: false,
                                        message: 'That username is already taken'
                                    })
                                } else {
                                    if (err.errmsg.indexOf('email') !== -1) {
                                        res.json({
                                            success: false,
                                            message: 'That email is already taken'
                                        })
                                    }
                                }
                            } else {
                                res.json({
                                    success: false,
                                    message: err
                                });
                            }
                        }
                    }
                } else {
                    res.json({
                        success: true,
                        message: "User created."
                    });
                }
            });
        }
    })

    // User login route

    // http://localhost:8080/api/authenticate
    router.post('/authenticate', function (req, res) {
        User.findOne({
            username: req.body.username
        }).select('email username password').exec(function (err, user) {
            if (err) throw err;

            if (!user) {
                res.json({
                    success: false,
                    message: "Could not authenticate user"
                })
            } else {
                if (user) {
                    if (req.body.password) {
                        var validPassword = user.comparePassword(req.body.password);
                    } else {
                        res.json({
                            success: false,
                            message: "No password provided."
                        });
                    }

                    if (!validPassword) {
                        res.json({
                            success: false,
                            message: "Could not authenticate password."
                        });
                    } else {
                        // Setting token
                        var token = jwt.sign({
                            username: user.username,
                            email: user.email
                        }, secret, {
                            expiresIn: '24h'
                        });
                        res.json({
                            success: true,
                            message: "User authenticated!",
                            token: token
                        });
                    }
                }
            }
        })
    });
    // Using middleware to check for a token
    router.use(function (req, res, next) {
        var token = req.body.token || req.body.query || req.headers['x-access-token'];
        if (token) {
            //verify token
            jwt.verify(token, secret, function (err, decoded) {
                if (err) {
                    res.json({
                        success: false,
                        message: 'Token invalid'
                    });
                } else {
                    req.decoded = decoded; // Making the the decoded token accessible in the next post
                    next();
                }
            })
        } else {
            res.json({
                success: false,
                message: "No token provided."
            })
        }
    })

    router.post('/me', function (req, res) {
        res.send(req.decoded)
    })


    // Creating function with multer for the uploading API
    var storage = multer.diskStorage({ //multers disk storage settings
        destination: function (req, file, cb) {
            cb(null, './uploads/')
        },
        filename: function (req, file, cb) {
            var datetimestamp = Date.now();
            cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1])
        }
    });
    var upload = multer({ //multer settings
        storage: storage
    }).single('file');

    /** API path that will upload the files */
    router.post('/uploads', function (req, res) {
        upload(req, res, function (err) {
            if (err) {
                res.json({
                    error_code: 1,
                    err_desc: err
                });
                return;
            }
            res.json({
                error_code: 0,
                err_desc: null
            });
            var vid = new Video();
            vid.url = './uploads/' + req.file.filename;
            vid.name = req.file.originalname;
            vid.publisher = req.decoded.email;
            vid.save(function (err) {

            })
        })
    });
    // Getting all videos in the data
    router.get('/allVideos', function (req, res) {
        Video.findOne({ publisher: req.decoded.email }).exec(function (err, videos) {
            // console.log(req.decoded)
            // console.log(video)
            if (videos!==null) {
                res.send(videos);
            }

        })
    })
    return router;
}