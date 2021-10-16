const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
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
    date:
    {
        type: String,
        required: true
    },
    avatar:
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
    likes: []
});


module.exports = mongoose.model('Comment', commentSchema);