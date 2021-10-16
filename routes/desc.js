const router = require("express").Router();
const User = require('../model/User');
const verify = require('../verifyToken');
const express = require("express")
const urlencodedParser = express.urlencoded({extended: false});

router.post('/', verify, urlencodedParser, async (req, res) => {
    var newvalue = { $set: { desc: req.body.desc } };
    await User.updateOne({ name: req.body.name }, newvalue);
});

module.exports = router;
