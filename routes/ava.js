const router = require("express").Router();
const User = require('../model/User');
const Post = require('../model/Post');
const verify = require('../verifyToken');
const express = require("express")
const urlencodedParser = express.urlencoded({extended: false});
const multer = require('multer');
const MAX_SIZE = process.env.MAX_SIZE || 1024 * 1024 * 10;
const path = require('path')
const fs = require('fs')
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
  

router.post('/', verify, urlencodedParser, upload.single("dd"), async (req, res) => {
    const tempPath = req.file.path;
    const targetPath = path.join(__dirname, "../uploads/" + req.file.path.substring(8) + ".png");
    const mongoPath = '/api/image/' + req.file.path.substring(8) + ".png"
    if (path.extname(req.file.originalname).toLowerCase() === ".png" || path.extname(req.file.originalname).toLowerCase() === ".jpg") {
    fs.rename(tempPath, targetPath, async (err) => {
        if (err) return handleError(err, res);
        const token = req.header('Cookie').substring(9);
        const decoded = jwt_decode(token);
        var newvalue = { $set: { avatar: mongoPath } };
        await User.updateOne({ _id: decoded._id }, newvalue);
        const us = await User.findOne({ _id: decoded._id });
        await Post.updateMany({ name: us.name }, newvalue);
        res.redirect('back');
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
);

module.exports = router;
