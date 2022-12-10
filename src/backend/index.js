//=======[ Settings, Imports & Data ]==========================================

var PORT    = 3000;

var express = require('express');
var app     = express();
var utils   = require('./mysql-connector');
var devices = require('./datos.json')

// to parse application/json
app.use(express.json()); 
// to serve static files
app.use(express.static('/home/node/app/static/'));

//=======[ Main module code ]==================================================

app.get('/devices/', function(req, res, next) {

    setTimeout(()=>{
        res.send(JSON.stringify(devices)).status(200);
    },500);
});

app.post('/deviceChange', function(req, res, next) {
    let dev = req.body;

    if (dev["action"] === "delete" && dev["id"] > 0)  {
        
        var index = devices.findIndex(devices => devices.id == dev["id"]);
        console.log("Index " + index);
        devices.splice(index, 1);
        console.log("Eliminado dispositivo " + dev["id"]);
        res.send('{"status": "OK"}').status(200);
    }
    else {
        res.send('{"status": "Error"}').status(501);
    }
    //res.end();
    
   
});

app.post('/deviceAdd', function(req, res, next) {
    let newDev = req.body;

    //get last id
    newDev["id"] = devices[devices.length-1].id;
    console.log("Device" + newDev["id"]);

    //check if it is valid, from the frontEnd this value is zero
    if (newDev["id"] > 0)  {
        newDev["id"] += 1;
        console.log("nuevo dispositivo" + JSON.stringify(newDev));
        devices.push(newDev);
        res.send('{"status": "OK"}').status(200);
    }
    else {
        console.log("Error getting the last object of database");
        res.send('{"status": "Error"}').status(501);
    }

    res.end();
   
});

app.listen(PORT, function(req, res) {
    console.log("NodeJS API running correctly");
});

//=======[ End of file ]=======================================================
