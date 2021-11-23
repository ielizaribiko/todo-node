var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var tmpl = require('../public/javascripts/compiled/templates.js')(dust);
  tmpl({title: 'TO-DO App', nombre: 'Tony'}, function(err, out) {
    res.send(out);
  });
  //res.render('index', { title: 'TO-DO App', nombre: 'Tony'});
});

module.exports = router;
