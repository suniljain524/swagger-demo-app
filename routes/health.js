'use strict';

let router = require('express').Router();

// let router = express.Router();

router.get('/', function(req, res) {
  return res.json({
    timestamp: new Date(),
    status: 'OK'
  });
});

module.exports = router;
