const router = require("express").Router();
const Post = require('../model/Post');
const User = require('../model/User');
const verify = require('../verifyToken');
const express = require("express")
const urlencodedParser = express.urlencoded({extended: false});
const jwt_decode = require('jwt-decode');

router.get('/:id', verify, urlencodedParser, async (req, res) => {
    const token = req.header('Cookie').substring(9);
    var decoded = jwt_decode(token);
    const user = await User.findOne({ _id: decoded._id })
    const post = await Post.findOne({ _id: req.params.id }).lean();
    res.render('comment', {comments: post.comments, _id: post._id, avatar: post.avatar, name: post.name, date: post.date, description: post.description, attach: post.attach, likesAmount: post.likesAmount, comments: post.comments, nick: user.name})
});

module.exports = router;
