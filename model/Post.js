const mongoose = require('mongoose');
const Comment = require("./Comment");

const postSchema = new mongoose.Schema({
    authorid:
    {
        type: String,
        required: true
    },
    name:
    {
        type: String,
        required: true
    },
    avatar:
    {
        type: String,
        required: true
    },
    date:
    {
        type: String,
        required: true
    },
    description:
    {
        type: String,
        default: ''
    },
    attach:
    {
        type: String,
        default: ''
    },
    comments: [ Comment.schema ],
    likesAmount: [],
    commentsAmount:
    {
        type: Number,
        default: 0
    }

});


module.exports = mongoose.model('Post', postSchema);