const router = require("express").Router();
const verify = require('../verifyToken');
const jwt_decode = require('jwt-decode');
const Post = require('../model/Post');
const User = require('../model/User');


router.get('/', verify, async (req, res) => {
    const token = req.header('Cookie').substring(9);
    var decoded = jwt_decode(token);
    const nick = await User.findOne({ _id: decoded._id });
    var posts = await Post.find({}).lean();
    posts = posts.reverse();
    res.render('posts', {nick: nick.name, posts: posts});
});

module.exports = router;
