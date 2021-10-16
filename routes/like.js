const router = require("express").Router();
const express = require("express")
const verify = require('../verifyToken');
const Post = require('../model/Post');
const urlencodedParser = express.urlencoded({extended: false});

router.post('/', verify, urlencodedParser, async (req, res) => {
    const like = req.body.like
    const name = like.substring(24)
    const postId = like.slice(0, -(like.length - 24));
    
    const post = await Post.findOne({_id: postId});
    const likeList = post.likesAmount;
    var newvalue = { $push: {likesAmount: name} };
    for (var i = 0; i < likeList.length; i++)
    {
        if ( name == likeList[i])
        {
            var newvalue = { $pull: {likesAmount: name} };
            break;
        }
    }
    await Post.updateOne({_id: postId}, newvalue);
});

module.exports = router;
