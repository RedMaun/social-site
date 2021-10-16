const router = require("express").Router();

router.get('/', (req, res) => {
    res.clearCookie("tokenKey");
    res.redirect('/api/posts')
});

module.exports = router;
