const lowdb = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
var _ = require('lodash');
var fs = require('fs');

class LowdbDatabase {
    constructor(){
        if (!fs.existsSync('db')){
            fs.mkdirSync('db');
        }
        const adapter = new FileSync('db/db.json');
        this.db = lowdb(adapter);
        const defaultData = {
            tasks : [
                {id: '1', title: 'Limpiar el coche', description: 'Limpiarlo por dentro y también por fuera. Ordenar el maletero.',created: '2021-10-25T15:35:58.000Z', limitDate: '2021-10-30T15:35:58.000Z'},
                {id: '2', title: 'Hacer la compra', description: 'Leche, huevos, pan de molde, manzanas.',created: '2021-11-03T11:59:58.000Z', limitDate: '2021-12-30T15:35:58.000Z'},
                {id: '3', title: 'Arrelgar el enchufe', description: 'Cambiar el enchufe al lado de la puerta del salón.', created: '2021-11-19T00:01:00.000Z', limitDate: '2021-11-30T15:35:58.000Z'}
              ]
        };
        this.db.defaults(defaultData).write();
    }

    generateId(table){
        var lastTask = _.head(_.orderBy(table,'id','desc'));
        return lastTask.id ? (parseInt(lastTask.id)+1).toString() : 1;
    }
    getTasksBy(filters = {}){        
        return  _.chain(this.db.get('tasks').value())
            .filter(filters)
            //.filter({id:1})
            .value();
    }

    saveTask(task){
        if(!(task.id && parseInt(task.id)>0)){
            task.id = this.generateId(this.db.get('tasks').value());
            this.db.get('tasks').push(task).write();
        }else{
            this.db.get('tasks').find({id:task.id}).assign(task).write();
        }
        
        return task.id;
    }

    deleteTask(taskid){
        var task = this.db.get('tasks').find({id: taskid}).value();
        if(task){
            this.db.get('tasks').remove({id: task.id}).write();
            return true;
        }else{
            return false;
        }
    }
}

module.exports = LowdbDatabase;