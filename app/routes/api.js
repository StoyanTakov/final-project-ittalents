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
        user.dislikedVideos = [];
        user.likedVideos = [];
        user.subscribes = [];
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
            req.errorMsg = {
                success: false,
                message: "No token provided."
            }
            next();
            // res.json({
            //     success: false,
            //     message: "No token provided."
            // })
        }
    })

    router.post('/me', function (req, res) {
        if (req.decoded) {
            res.send(req.decoded);
        } else {
            res.send(req.errorMsg);
        }

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
            // console.log(err)
            // console.log(req.body);
            if (err) {
                res.json({
                    error_code: 1,
                    err_desc: err
                });
                return;
            }

            // Setting values for the video
            var vid = new Video();
            vid.name = req.file.filename;
            vid.title = req.body.title;
            vid.publisher = req.decoded.email;
            vid.publishInfo.tags = req.body.tags;
            vid.publishInfo.categories = req.body.categories;
            vid.publishInfo.views = 0;
            vid.publishInfo.likes = 0;
            vid.publishInfo.dislikes = 0;
            vid.publishInfo.description = req.body.description;

            vid.save(function (err) {
                if (err) {
                    res.json({
                        success: false,
                        message: err
                    })
                } else {
                    res.json({
                        error_code: 0,
                        err_desc: null
                    });
                }

            })
        })
    });

    // Getting all videos in the data
    router.get('/allVideos', function (req, res) {
        Video.find({}).exec(function (err, videos) {
            if (videos !== null) {
                res.send(videos);
            } else {
                res.json({
                    success: false
                });
            }
        })
    })
    //API for getting a specific video
    router.get('/video/:name', function (req, res) {
        Video.findOne({
            name: req.params.name
        }).exec(function (err, videos) {
            if (videos !== null) {
                res.send(videos);
            }
        })
    })
    //     //API for searching videos
    //     router.get('/searchVideos/:title', function (req, res) {
    //         Video.find({
    //             title: {
    //                 $regex: /req.params.title/i
    //             }
    //         }).exec(function (err, videos) {
    //             console.log(videos)
    //             if (videos !== null) {
    //                 res.send(videos);
    //             }
    //         })
    //     })
    // })
    // Getting the uploaded videos by the logged in user
    router.get('/ownVideos', function (req, res) {
        if (req.decoded) {
            Video.find({
                publisher: req.decoded.email
            }).exec(function (err, videos) {
                if (videos !== null) {
                    // console.log(videos)
                    res.send(videos);
                } else {
                    res.json({
                        success: false
                    });
                }

            })
        } else {
            res.json({
                success: false,
                message: 'Not logged in with a valid token!'
            })
        }

    })

    // API for the video details
    // For liking videos
    router.get('/likes/:id', function (req, res) {
        if (req.decoded) {
            var user = {};
            var video = {};
            var likesAndDislikes = {};
            User.findOne({
                email: req.decoded.email
            }).exec(function (err, foundUser) {
                if (err) {
                    console.log(err);
                } else {
                    user = foundUser;
                    Video.findOne({
                        _id: req.params.id
                    }).exec(function (err, foundVideo) {
                        if (err) {
                            console.log(err);
                        } else {
                            video = foundVideo;
                            if (user.email == video.publisher) {
                                res.json({
                                    success: false,
                                    message: "You cannot like your own videos."
                                })
                            } else {
                                //If the video is already liked
                                if (user.likedVideos.indexOf(video._id) !== -1) {
                                    video.publishInfo.likes--;
                                    var videoIndex = user.likedVideos.indexOf(video._id);
                                    user.likedVideos.splice(videoIndex, 1);
                                    User.update({_id: user._id},user,function (err,raw) {
                                        if (err) {
                                            console.log(err);
                                        }
                                    })
                                    video.save(function (err) {
                                        if (err) {
                                            console.log(err)
                                        }
                                        likesAndDislikes = {likes: video.publishInfo.likes, dislikes: video.publishInfo.dislikes}
                                        res.json({
                                            success: true,
                                            message: 'Removed like',
                                            likesAndDislikes
                                        });
                                    })
                                } else {
                                    // If the video is already disliked
                                    if (user.dislikedVideos.indexOf(video._id) !== -1) {
                                        video.publishInfo.likes++;
                                        video.publishInfo.dislikes--;
                                        var videoIndex = user.dislikedVideos.indexOf(video._id);
                                        user.dislikedVideos.splice(videoIndex, 1);
                                        user.likedVideos.push(video._id);
                                        User.update({_id: user._id},user,function (err,raw) {
                                            if (err) {
                                                console.log(err);
                                            }
                                        })
                                        video.save(function (err) {
                                            if (err) {
                                                console.log(err)
                                            }
                                            likesAndDislikes = {likes: video.publishInfo.likes, dislikes: video.publishInfo.dislikes};
                                            res.json({
                                                success: true,
                                                message: 'Liked',
                                                likesAndDislikes
                                            });
                                        })
                                    } else {
                                        // If the video isn't liked or disliked
                                        video.publishInfo.likes++;
                                        user.likedVideos.push(video._id);
                                        User.update({_id: user._id},user,function (err,raw) {
                                            if (err) {
                                                console.log(err);
                                            }
                                        })
                                        video.save(function (err) {
                                            if (err) {
                                                console.log(err)
                                            }
                                            likesAndDislikes = {likes: video.publishInfo.likes, dislikes: video.publishInfo.dislikes};
                                            res.json({
                                                success: true,
                                                message: 'Liked',
                                                likesAndDislikes
                                            });
                                        })
                                    }
                                }
                            }
                        }

                    })
                }
            })
        } else {
            res.json({
                success: false,
                message: 'Login to like the video!'
            });
        }
    })
    // For disliking videos
    router.get('/dislikes/:id', function (req, res) {
        if (req.decoded) {
            var user = {};
            var video = {};
            var  likesAndDislikes = {};
            User.findOne({
                email: req.decoded.email
            }).exec(function (err, foundUser) {
                if (err) {
                    console.log(err);
                } else {
                    user = foundUser;
                    Video.findOne({
                        _id: req.params.id
                    }).exec(function (err, foundVideo) {
                        if (err) {
                            console.log(err);
                        } else {
                            video = foundVideo;
                            if (user.email == video.publisher) {
                                res.json({
                                    success: false,
                                    message: "You cannot like your own videos."
                                })
                            } else {
                                //If the video is already disliked
                                if (user.dislikedVideos.indexOf(video._id) !== -1) {
                                    video.publishInfo.dislikes--;
                                    var videoIndex = user.dislikedVideos.indexOf(video._id);
                                    user.dislikedVideos.splice(videoIndex, 1);
                                    User.update({_id: user._id},user,function (err,raw) {
                                        if (err) {
                                            console.log(err);
                                        }
                                    })
                                    video.save(function (err) {
                                        if (err) {
                                            console.log(err)
                                        }
                                        likesAndDislikes = {likes: video.publishInfo.likes, dislikes: video.publishInfo.dislikes};
                                        res.json({
                                            success: true,
                                            message: 'Removed dislike',
                                            likesAndDislikes
                                        });
                                    })
                                } else {
                                    // If the video is already liked
                                    if (user.likedVideos.indexOf(video._id) !== -1) {
                                        video.publishInfo.likes--;
                                        video.publishInfo.dislikes++;
                                        var videoIndex = user.likedVideos.indexOf(video._id);
                                        user.likedVideos.splice(videoIndex, 1);
                                        user.dislikedVideos.push(video._id);
                                        User.update({_id: user._id},user,function (err,raw) {
                                            if (err) {
                                                console.log(err);
                                            }
                                        })
                                        video.save(function (err) {
                                            if (err) {
                                                console.log(err)
                                            }
                                            likesAndDislikes = {likes: video.publishInfo.likes, dislikes: video.publishInfo.dislikes};
                                            res.json({
                                                success: true,
                                                message: 'Disliked',
                                                likesAndDislikes
                                            });
                                        })
                                    } else {
                                        // If the video isn't liked or disliked
                                        video.publishInfo.dislikes++;
                                        user.dislikedVideos.push(video._id);
                                        User.update({_id: user._id},user,function (err,raw) {
                                            if (err) {
                                                console.log(err);
                                            }
                                        })
                                        video.save(function (err) {
                                            if (err) {
                                                console.log(err)
                                            }
                                            likesAndDislikes = {likes: video.publishInfo.likes, dislikes: video.publishInfo.dislikes};
                                            res.json({
                                                success: true,
                                                message: 'Disliked',
                                                likesAndDislikes
                                            });
                                        })
                                    }
                                }
                            }
                        }

                    })
                }
            })
        } else {
            res.json({
                success: false,
                message: 'Login to dislike the video!'
            });
        }
    })
    // For the views
    router.get('/views/:id',function (req,res){
        var video = {};
        Video.findOne({_id: req.params.id}).exec(function(err,foundVideo){
            if (err) {
                console.log(err);
            }else{
                video = foundVideo;
                video.publishInfo.views++;
                if (req.decoded) {
                    var user = {};
                    User.findOne({email: req.decoded.email}).exec(function(err,foundUser){
                        if (err) {
                            console.log(err);
                        }else{
                            user = foundUser;
                            if (user.history.length==0 || user.history.indexOf(video._id)!==user.history.length-1) {
                                user.history.push(video._id);
                                User.update({_id:user._id},user,function(err,raw){
                                    if (err) {
                                        console.log(err);
                                    }
                                })
                            }
                        }
                    })
                }
                video.save(function(err){
                    if (err) {
                        console.log(err)
                    }else{
                        res.json({success: true, message:'Video viewed',views: video.publishInfo.views})
                    }
                })
            }
        })
    })
    return router;
}