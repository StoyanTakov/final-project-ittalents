var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('../models/user');
var session = require('express-session');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var jwt = require('jsonwebtoken');
var secret = 'harambe'
module.exports = function (app, passport) {

    app.use(passport.initialize());
    app.use(passport.session());
    app.use(session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: true,
        cookie: {
            secure: false
        }
    }))

    passport.serializeUser(function (user, done) {
        token = jwt.sign({
            username: user.username,
            email: user.email
        }, secret, {
            expiresIn: '24h'
        });
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    passport.use(new FacebookStrategy({
            clientID: '126994844648564',
            clientSecret: '61bf97c0f7be9902321ead93f85d2719',
            callbackURL: "http://localhost:8080/auth/facebook/callback",
            profileFields: ['id', 'displayName', 'photos', 'email']
        },
        function (accessToken, refreshToken, profile, done) {
            User.findOne({
                email: profile._json.email
            }).select('username password email').exec(function (err, user) {
                if (err) {
                    done(err);
                }
                if (user && user !== null) { //Checks for a user with a valid email
                    done(null, user);
                } else {
                    done(err);
                }
            })
        }
    ));
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            failureRedirect: '/facebookerror/'
        }),
        function (req, res) {
            res.redirect('/facebook/' + token);
        });
    app.get('/auth/facebook',
        passport.authenticate('facebook', {
            scope: 'email'
        })
    );

    passport.use(new GoogleStrategy({
            clientID: '232676333238-js0ng9336vfa72tn6uu259g8h1987q3p.apps.googleusercontent.com',
            clientSecret: 'RiuzRNPgjbnPgJyCqwUUWi2G',
            callbackURL: "http://localhost:8080/auth/google/callback"
        },
        function (accessToken, refreshToken, profile, done) {
            User.findOne({
                email: profile.emails[0].value
            }).select('username password email').exec(function (err, user) {
                if (err) {
                    done(err);
                }
                if (user && user != null) {
                    done(null, user)
                } else {
                    done(err);
                }
            })
        }
    ));
    //Google 
    app.get('/auth/google',
    passport.authenticate('google', {
        scope: ['https://www.googleapis.com/auth/plus.login', 'profile', 'email']
    }));

    app.get('/auth/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/googleerror'
    }),
    function (req, res) {
        res.redirect('/google/' + token);
    });

    return passport;
}