const jwt = require('jsonwebtoken');

module.exports = function(req, res, next){
    var token = req.header('Cookie');
    if (!token) return res.render('un', {err: 'Авторизируйтесь чтобы посмотреть посты'});
    token = token.substring(9);
    try
    {
        const verified = jwt.verify(token, (process.env.TOKEN_SECRET).toString('base64'));
        req.user = verified;
        next();
    }
    catch(err)
    {
        res.render('un', {err: 'error'});
    }
}
