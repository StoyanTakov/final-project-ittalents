var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var VideoSchema = new Schema({
    url: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    publisher: {
        type: String,
        required: true,
        unique: true
    },
    publishInfo: {
        time: {
            type: String,
            required: true
        },
        categories:{
            type: String,
            required: true
        },
        tags:{
            type: String,
            required: true,
        },
        description:{
            type: String,
            required: true
        },
        views:{
            type: String,
            required: true
        },
        likes:{
            type: String,
            required: true
        },
        dislikes:{
            type: String,
            required: true
        },

    },
    comments:{
        type: String,
        required: true
    }
});

W
module.exports = mongoose.model("Video", VideoSchema);