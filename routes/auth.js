const router = require("express").Router();
const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { registerValidation, loginValidation } = require('../validation');
const express = require('express')
const urlencodedParser = express.urlencoded({extended: false});

router.post('/register', urlencodedParser, async (req, res) => {

    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const nameExist = await User.findOne({name: req.body.name})
    if (nameExist) return res.status(400).send('name already exists')

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    var avatar = 'https://eu.ui-avatars.com/api/?name=' + req.body.name;
    const user = new User({
        name: req.body.name,
        password: hashPassword,
        avatar: avatar
    });
    try
    {
        const savedUser = await user.save();
        const token = jwt.sign({ _id: user._id }, (process.env.TOKEN_SECRET).toString('base64'));
        res.cookie('tokenKey', token);
        res.redirect('/api/posts');
    }
    catch(err)
    {
        res.status(400).send(err);
    }
});

router.post('/login', urlencodedParser, async (req, res) => {
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findOne({ name: req.body.name })
    if (!user) return  res.status(400).send('name');

    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).send('pass');

    const token = jwt.sign({ _id: user._id }, (process.env.TOKEN_SECRET).toString('base64'));
    res.cookie('tokenKey', token);
    res.redirect('/api/posts');

});

module.exports = router;


