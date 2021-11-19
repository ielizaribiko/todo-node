var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var tasks = [
    {title: 'Limpiar el coche'},
    {title: 'Hacer la compra'},
    {title: 'Empezar la dieta'}
  ]
  res.render('index', { title: 'TO-DO App', nombre: 'Tony', tasks: tasks});
});

module.exports = router;
