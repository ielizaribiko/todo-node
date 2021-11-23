var express = require('express');
var router = express.Router();
var LowdbDatabase = require('../services/database');
var db = new LowdbDatabase();

/* GET home page. */
router.get('/', function(req, res, next) {  
  var tasks = db.getTasksBy();
  res.render('index', { tasks: tasks});
});

router.get('/task/:id?',function(req,res,next){
    var task = {};
    if(req.params.id){      
      var result = db.getTasksBy({id: req.params.id});
      if(result.length){
        task = result[0];
      }
    }
    res.render('task-detail-view',task);
});

router.post('/task',function(req,res,next){
  try{
      db.saveTask(req.body);
      res.render('task-detail-view',{message: {type: 'success', value: 'The task has been saved successfully.'}})
  }catch(e){
    res.render('task-detail-view',{message: {type: 'error', value: 'Error: '+e.message}})
  }  
});

router.post('/task/:id/delete',function(req,res,next){
  try{
    if(req.params.id){ 
      if(db.deleteTask(req.params.id)){
        res.redirect('/')
      }else{
        console.log('The task to delete was not found.'+req.params.id);
        //res.render('task-detail-view',{message: {type: 'error', value: 'The task to delete was not found.'}})
      }    
    }else{
      console.log('A task id is required.');
      //res.redirect('/task/:id',{message: {type: 'error', value: 'A task id is required.'}})
      
    }
  }catch(e){
    console.log(e);
    throw(e);
  }
  
});

module.exports = router;
