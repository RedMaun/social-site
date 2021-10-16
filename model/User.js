const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:
    {
        type: String,
        required: true,
        min: 2,
        max: 255
    },
    password:
    {
        type: String,
        required: true,
        min: 6,
        max: 1024
    },
    date:
    {
        type: Date,
        default: Date.now
    },
    avatar:
    {
        type: String,
        required: true
    },
    color:
    {
        type: String,
        default: '#'+Math.floor(Math.random()*16777215).toString(16)
    },
    desc:
    {
        type: String,
        default: ''
    }
});


module.exports = mongoose.model('User', userSchema);