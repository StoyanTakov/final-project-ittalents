var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var VideoSchema = new Schema({
    url: {
        type: String,
        required: true,
        unique: false
    },
    name: {
        type: String,
        unique: false
    },
    publisher: {
        type: String,
        unique: false
    },
    // publishInfo: {
    //     time: {
    //         type: String,
    //         required: true
    //     },
    //     categories:{
    //         type: String,
    //         required: true
    //     },
    //     tags:{
    //         type: String,
    //         required: true,
    //     },
    //     description:{
    //         type: String,
    //         required: true
    //     },
    //     views:{
    //         type: String,
    //     },
    //     likes:{
    //         type: String,
    //     },
    //     dislikes:{
    //         type: String,
    //     },

    // },
    // comments:{
    //     type: String,
    // }
});

module.exports = mongoose.model("Video", VideoSchema);