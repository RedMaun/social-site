const router = require("express").Router();
const verify = require('../verifyToken');
const User = require('../model/User');
const Post = require('../model/Post');
const jwt_decode = require('jwt-decode');

router.get('/:id', verify, async (req, res) => {
    const user = await User.findOne({ name: req.params.id });
    const token = req.header('Cookie').substring(9);
    const decoded = jwt_decode(token);
    var posts = await Post.find({ name: req.params.id }).lean();
    posts = posts.reverse();
    if (user._id == decoded._id)
    {
        res.render('profile', {dd: user.name, ava: user.avatar, color: user.color, desc: user.desc, posts: posts, nick: user.name})
    }
    else
    {
        var n = await User.findOne({ _id: decoded._id});
        res.render('unprofile', {ava: user.avatar, dd: n.name, color: user.color, desc: user.desc, posts: posts, nick: user.name})
    }
});

module.exports = router;
