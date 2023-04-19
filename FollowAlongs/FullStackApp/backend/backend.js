var express = require("express");
var app = express();
var cors = require("cors");

app.use(cors());

let data=[];

const logger = require("morgan");
app.use(logger('dev')); //information serverside when requests come in

const fs = require("fs");
const serverSideStorage = "../data/db.json";


fs.readFile(serverSideStorage, function(err, buf){
    if(err){
        console.log("error: ",err);
    }
    else{
        data = JSON.parse(buf.toString());
    }
    console.log("data read from file.");
});

function saveToServer(data){
    fs.writeFile(serverSideStorage, JSON.stringify(data), function(err,buf){
        if(err){
            console.log("error: ",err);
        }
        else{
            console.log("data saved successfully!");
        }
    })
}


//middleware
var bodyParser = require("body-parser");
app.use('/api/', bodyParser.urlencoded({extended: true}));
app.use('/api/', bodyParser.json());

//read all
app.get("/api/", function(req, res) {
    res.send(data);
    res.end();
})

//create
app.post("/api/", function(req, res) {
    let name = req.body.name;
    let counter = req.body.count;
    data.push({"name": name, "count": counter});
    saveToServer(data);
    res.send("post success");
    res.end();
})

//read one
app.get("/api/id/:id", function(req, res) {
    let id = parseInt(req.params.id);
    let result = data[id];
    res.send(result);
    res.end();
}).put("/api/id/:id", function(req, res) {
    let id = parseInt(req.params.id);
    let name = req.body.name;
    let counter = req.body.count;
    data[id] = {"name": name, "count": counter};
    saveToServer(data);
    res.send("put success");
    res.end();
}).delete("/api/id/:id", function(req, res) {
    let id = parseInt(req.params.id);
    data.splice(id, 1);
    saveToServer(data);
    res.send("delete successful");
    res.end();
})

app.listen(3000);