const router = require("express").Router();
const express = require("express")
const verify = require('../verifyToken');
const multer = require('multer');
const MAX_SIZE = process.env.MAX_SIZE || 1024 * 1024 * 10;
const urlencodedParser = express.urlencoded({extended: false});
const path = require('path')
const fs = require('fs')
const Post = require('../model/Post');
const User = require('../model/User');
const jwt_decode = require('jwt-decode');


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


router.post("/", verify, urlencodedParser, upload.single("dd"), async (req, res) => {
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

        const post = new Post({
            description: req.body.post,
            authorid: decoded._id,
            name: nick,
            avatar: avatar,
            date: fff,
        });
        const savedPost = await post.save();
        res.redirect('/api/posts');
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

            const post = new Post({
                description: req.body.post,
                authorid: decoded._id,
                name: nick,
                avatar: avatar,
                date: fff,
                attach: mongoPath
            });
            const savedPost = await post.save();
            res.redirect('/api/posts');

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
