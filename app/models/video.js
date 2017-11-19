var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var VideoSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: false
    },
    title: {
        type: String,
        unique: false
    },
    publisher: {
        type: String,
        unique: false
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
            type: Number,
        },
        likes:{
            type: Number,
        },
        dislikes:{
            type: Number,
        },

    },
    comments:{
        type: Array,
    }
});

module.exports = mongoose.model("Video", VideoSchema);