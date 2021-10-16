const fs = require('fs');
const router = require("express").Router();
const verify = require('../verifyToken');

router.get('/:id', verify, (req, res) => {
    id = req.params.id;
    fs.readFile('./uploads/' + id, function(err, data) {
        if (err) throw err;
        if (id.includes('.svg'))
        {
          res.writeHead(200, {'Content-Type': 'image/svg+xml '});
          res.end(data); 
        }
        else
        {
          res.writeHead(200, {'Content-Type': 'image/png'});
          res.end(data); 
        }
  });
});

module.exports = router;
