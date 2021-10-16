const router = require("express").Router();
const User = require('../model/User');
const verify = require('../verifyToken');
const express = require("express")
const urlencodedParser = express.urlencoded({extended: false});

router.post('/', verify, urlencodedParser, async (req, res) => {
    var newvalue = { $set: { color: req.body.color } };
    await User.updateOne({ name: req.body.name }, newvalue);
});

module.exports = router;
