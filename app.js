const express = require('express');
const path = require('path');
const nano = require('nano')('http://emily:emily12345@localhost:5984');


const todolist = nano.db.use('todolist');
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use("/static", express.static("public"));
app.use(express.urlencoded({extended: true})); 
app.use(express.json());



    const getCompleteTasks = async () => {
        try {
          const completeTasks = await todolist.view(
            "complete_tasks",
            "all"
          );
          const productType = completeTasks.rows[0].value;
          return productType;
        } catch (err) {
          console.log(err);
        }
      };   



app.get("/", async function (req, res) {
    try {
      const body = await todolist.view("all_tasks", "all");
      const complete = await getCompleteTasks();
      const tasks = body.rows;
      res.render("index", { tasks, complete });
    } catch (err) {
      console.log(err);
    }
  });

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
