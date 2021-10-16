const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');
const loginRoute = require('./routes/login');
const regRoute = require('./routes/register');
const exitRoute = require('./routes/exit');
const uploadRoute = require('./routes/upload');
const imageRoute = require('./routes/image');
const likeRoute = require('./routes/like');
const colorRoute = require('./routes/color');
const descRoute = require('./routes/desc');
const avaRoute = require('./routes/ava');
const addRoute = require('./routes/add');
const profileRoute = require('./routes/profile');
const commentRoute = require('./routes/comment');
const exphbs  = require('express-handlebars');
const helpers = require('handlebars-helpers')();
const https = require('https');
const fs = require('fs');

app.use('/public', express.static('public'));

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

dotenv.config();

mongoose.connect(
    process.env.DB_CONNECT,
    { useNewUrlParser: true },
    () => console.log('connected to db')
);

app.use(express.json());

const options = {
    key: fs.readFileSync('ssl/key.pem'),
    cert: fs.readFileSync('ssl/cert.pem')
};

app.use('/api/user', authRoute);
app.use('/api/posts', postRoute);
app.use('/', postRoute);
app.use('/api/login', loginRoute);
app.use('/api/reg', regRoute);
app.use('/api/user/exit', exitRoute);
app.use('/api/like', likeRoute);
app.use('/api/upload', uploadRoute);
app.use('/api/image', imageRoute);
app.use('/api/profile', profileRoute);
app.use('/api/color', colorRoute);
app.use('/api/desc', descRoute);
app.use('/api/ava', avaRoute);
app.use('/api/comment', commentRoute);
app.use('/api/add', addRoute);
app.use(function(req, res) {
    res.status(404);
    res.send('404')
})
https.createServer(options, app).listen(2096);
