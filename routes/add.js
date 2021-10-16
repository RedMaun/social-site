const router = require("express").Router();
const User = require('../model/User');
const Post = require('../model/Post');
const verify = require('../verifyToken');
const express = require("express")
const urlencodedParser = express.urlencoded({extended: false});
const jwt_decode = require('jwt-decode');
const multer = require('multer');
const MAX_SIZE = process.env.MAX_SIZE || 1024 * 1024 * 10;
const path = require('path');
const fs = require('fs');

const handleError = async (err, res) => {
    res
    .status(500)
    .contentType("text/plain")
    .end("Oops! Something went wrong!");
};

const upload = multer({
    dest: "../temp",
    limits: {fileSize: MAX_SIZE}
});


router.post('/', verify, urlencodedParser, upload.single("dd"), async (req, res) => {
    if (!req.file && req.body.post)
    {
        const token = req.header('Cookie').substring(9);
        const decoded = jwt_decode(token);
        const us = await User.findOne({ _id: decoded._id });
        const nick = us.name;
        const avatar = us.avatar;
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0');
        var yyyy = today.getFullYear();
        var time = new Date().toLocaleTimeString('ru-RU', { hour12: false, 
            hour: "numeric", 
            minute: "numeric"});
        var fff = time + ' ' + String(dd + '.' + mm + '.' + yyyy);

        const comment = new Object({
            description: req.body.post,
            name: nick,
            avatar: avatar,
            date: fff,
        });
        var newvalue = { $push: {comments: comment} };
        await Post.updateOne({ _id: req.body.idd }, newvalue)
        res.redirect('back')
    }
    else if (req.file)
    {
        const tempPath = req.file.path;
        const targetPath = path.join(__dirname, "../uploads/" + req.file.path.substring(8) + ".png");
        const mongoPath = '/api/image/' + req.file.path.substring(8) + ".png"
        if (path.extname(req.file.originalname).toLowerCase() === ".png" || path.extname(req.file.originalname).toLowerCase() === ".jpg") {
        fs.rename(tempPath, targetPath, async (err) => {
            if (err) return handleError(err, res);

            const token = req.header('Cookie').substring(9);
            const decoded = jwt_decode(token);
            const us = await User.findOne({ _id: decoded._id });
            const nick = us.name;
            const avatar = us.avatar;
            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0');
            var yyyy = today.getFullYear();
            var time = new Date().toLocaleTimeString('ru-RU', { hour12: false, 
                hour: "numeric", 
                minute: "numeric"});
            var fff = time + ' ' + String(dd + '.' + mm + '.' + yyyy);

            const comment = new Object({
                description: req.body.post,
                name: nick,
                avatar: avatar,
                date: fff,
                attach: mongoPath
            });
            var newvalue = { $push: {comments: comment} };
            await Post.updateOne({ _id: req.body.idd }, newvalue)
            res.redirect('back')

        });
        } else {
        fs.unlink(tempPath, err => {
            if (err) return handleError(err, res);

            res
            .status(403)
            .contentType("text/plain")
            .end("Only .png or .jpg files are allowed!");
        });
        }
    }
    else
    {
        res.redirect('/api/posts');
    }
  }
);

module.exports = router;
