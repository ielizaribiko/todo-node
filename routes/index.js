var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'TODO App - Node Express Dust Mongo', nombre: 'Tony'});
});

module.exports = router;
