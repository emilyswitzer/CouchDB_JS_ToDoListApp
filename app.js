const express = require('express');
const path = require('path');
const nano = require('nano')('http://emily:emily12345@localhost:5984');

// const couch = new NodeCouchDb({
//     auth: {
//         user:'emily',
//         password:'emily12345'
//     }
// });

const todolist = nano.db.use('todolist');




// const dbName = 'todolist';
const viewUrl = '/_design/all_tasks/_view/all';

// couch.listDatabases().then(function(dbs){
//    console.log(dbs);
// });
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use("/static", express.static("public"));
app.use(express.urlencoded({extended: true})); 
app.use(express.json());

let total=0;
const completeTasks = 
    todolist.view("complete_tasks", "all",
    function(err, data){
        if(!err){
            console.log(data);
            total = data.rows[0].value;
            console.log(total);
        }else{
           // res.render(err);
        }

    });


app.get('/', function(req, res){
    todolist.view("all_tasks", "all",
    function(err, data){
        if(!err){
            const complete = completeTasks;
            const tasks=data.rows;
            res.render('index', {
                tasks,
                complete,
                total
            });
        }else{
            res.render(err);
        }

    });
});





// app.get('/', function(req, res){
//    couch.get(dbName, viewUrl).then(
//         function(data, headers, status){
//            console.log(data.data.rows);
//             res.render('index',{
//                 tasks:data.data.rows
//             });

//         },
//         function(err){
//             res.send(err);
//         }

//     );

//    });

   

//  app.post('/',(req, res) => {
//     console.log(req.body);
//     const content = req.body.content;
    
//     couch.uniqid().then(function(ids){
//         const id = ids[0];

   
//          couch.insert('todolist', {
//             _id: id,
//             task: content,
//             complete: false
//         }).then(
//             function(data, headers, status){
//              res.redirect('/');
//             },
//             function(err){
//                 res.send(err);
//             }
//         ) 
//     })

// }); 

app.post('/',(req, res) => {
    console.log(req.body);
    const content = req.body.content;
    
    nano.uuids().then(function(ids){
        const id = ids[0];
   
         todolist.insert({
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

// app.post('/delete/:id', function(req, res){
//      const id = req.params.id;
//      const rev = req.body.rev;

//      couch.del('todolist', id, rev).then(
//          function(data, headers, status){
//              res.redirect('/');

//      },
//      function(err){
//          res.send(err);
//      }
//      )
// });

app.post('/delete/:id', function(req, res){
    const id = req.params.id;
    const rev = req.body.rev;

    todolist.destroy(id, rev).then(
        function(data, headers, status){
            res.redirect('/');

    },
    function(err){
        res.send(err);
    }
    )
});

app.post('/results', function(req, res){

   if (req.body.celcius) {
        console.log("true");
 } else {
        console.log("false");
 }
});

app.post('/update/:id', function(req, res){
    const id = req.params.id;
    const rev = req.body.rev;
    const task = req.body.task;

    todolist.insert({
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
app.get("/", (req, res) => {
    res.render("index", {
      x: click
    });
  });

app.listen(3000, function (){
    console.log('Server Started on Port 3000');
}
);
