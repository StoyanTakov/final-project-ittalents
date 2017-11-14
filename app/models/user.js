var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
var titlize = require('mongoose-title-case');
var validate = require('mongoose-validator');

//Validating fields:
var nameValidator = [
    validate({
        validator: 'matches',
        arguments: /^(([a-zA-Z]{3,20})+[ ]+([a-zA-Z]{3,20})+)+$/,
        message: 'Name must be at least 3 characters, max 30, no special characters or numbers, must have space in between name.'
    }),
    validate({
        validator: 'isLength',
        arguments: [3,25],
        message: 'Name should be between {ARGS[0]} and {ARGS[1]} characters.'
    })
];
var emailValidator = [
    validate({
        validator: 'isEmail',
        message: 'Is not a valid e-mail.'
    }),
    validate({
        validator: 'isLength',
        arguments: [3,25],
        message: 'Email should be between {ARGS[0]} and {ARGS[1]} characters.'
    })
];

var usernameValidator = [
    validate({
        validator: 'isLength',
        arguments: [3,25],
        message: 'Username should be between {ARGS[0]} and {ARGS[1]} characters.'
    }),
    validate({
        validator: 'isAlphanumeric',
        message: 'Username must contain letters and numbers only.'
    })
];

var passwordValidator = [
    validate({
        validator: 'matches',
        arguments: /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/,
        message: 'Password needs to have at least one lowercase, one uppercase, one number, one special character, and must be between 8 and 35 characters long.'
    }),
    validate({
        validator: 'isLength',
        arguments: [3,35],
        message: 'Email should be between {ARGS[0]} and {ARGS[1]} characters.'
    })
];
var UserSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        validate: nameValidator
    },
    username: {
        type: String,
        lowercase: true,
        required: true,
        unique: true,
        validate: usernameValidator
    },
    password: {
        type: String,
        required: true,
        validate: passwordValidator
    },
    email: {
        type: String,
        lowercase: true,
        required: true,
        unique: true,
        validate: emailValidator
    },
    likedVideos: {
        type: Array
    },
    dislikedVideos: {
        type: Array
    },
    subscribes: {
        type: Array
    }
})

UserSchema.pre('save', function (next) {
    var user = this;
    bcrypt.hash(user.password, null, null, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
    });
});
UserSchema.plugin(titlize, {
    paths: ['name'], // Array of paths 
});
UserSchema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password)
};

module.exports = mongoose.model("User", UserSchema);