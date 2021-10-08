const express = require('express');
const path = require('path');
const NodeCouchDb = require('node-couchdb');
const nano = require('nano')('http://localhost:5984');


const couch = new NodeCouchDb({
    auth: {
        user:'emily',
        password:'emily12345'
    }
});

const todolist = nano.db.use('todolist');


const dbName = 'todolist';
const viewUrl = '/_design/all_tasks/_view/all';

couch.listDatabases().then(function(dbs){
   console.log(dbs);
});
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use("/static", express.static("public"));
app.use(express.urlencoded({extended: true})); 
app.use(express.json());

app.get('/', function(req, res){
   couch.get(dbName, viewUrl).then(
        function(data, headers, status){
           console.log(data.data.rows);
            res.render('index',{
                tasks:data.data.rows
            });

        },
        function(err){
            res.send(err);
        }

    );

   });

   

 app.post('/',(req, res) => {
    console.log(req.body);
    const content = req.body.content;
    
    couch.uniqid().then(function(ids){
        const id = ids[0];

   
         couch.insert('todolist', {
            _id: id,
            task: content,
            complete: false
        }).then(
            function(data, headers, status){
             res.redirect('/');
            },
            function(err){
                res.send(err);
            }
        ) 
    })

}); 

app.post('/delete/:id', function(req, res){
     const id = req.params.id;
     const rev = req.body.rev;

     couch.del('todolist', id, rev).then(
         function(data, headers, status){
             res.redirect('/');

     },
     function(err){
         res.send(err);
     }
     )
});

app.post('/update/:id', function(req, res){
    const id = req.params.id;
    const rev = req.body.rev;
    const task = req.body.task;
    const complete2 = "true";

    couch.update('todolist', {
        _id: id,
        _rev: rev,
        task: task,
        complete: "true"
    }).then(
        function(data, headers, status){
         res.redirect('/');
        },
        function(err){
            res.send(err);
        }
    ) 

   
});

app.listen(3000, function (){
    console.log('Server Started on Port 3000');
}
);

