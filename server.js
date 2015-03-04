var express = require("express");
mustacheExpress = require('mustache-express');
var exec = require("child_process").exec;
var fs = require("fs");
var sqlite3 = require("sqlite3").verbose();
var file = "templog.db";

var config = JSON.parse(fs.readFileSync("config.json"));
var deviceId = config.deviceId;
var port = config.port;

console.log("Starting");

var app = express();
app.engine('html', mustacheExpress()); 
app.use(app.router);
app.use(express.static(__dirname + "/public"));
app.set("view engine", "html");
app.set("views", __dirname + "/views");

app.get("/", function (request, response) {
    getTemperature(function (temp) {
        response.render("index", {
            temperature: temp
        });
    });
});

app.get("/temperature", function (request, response) {
    getTemperature(function (temp) {
        response.send(temp.toString());
    });
});

app.get("/history", function (request, response) {    
    ensureDbExists(file);
    
    var db = new sqlite3.Database(file);

    var interval = request.param('timeinterval');
    if (interval == undefined){
        interval="24";
    }
    var data="";
    db.all("SELECT * FROM temps WHERE timestamp>datetime('now','-"+interval+" hours')", function(err, rows) {        
        rows.forEach(function(row) {
            data=data+"['"+row.timestamp+"',"+row.temp+"],";        
        });        
        response.render("history", {
            data: data,
            interval: interval 
        });
    });    
    db.close();    
});

app.get("/measure", function (request, response) {
    ensureDbExists(file);    

    getTemperature(function (temp) {
        var db = new sqlite3.Database(file);

        db.serialize(function() {
            db.run("INSERT INTO temps values(datetime('now'), ("+temp+"))");      
        });

        db.close();

        response.send("ok: "+temp.toString());
    });
});

function ensureDbExists(file){
    var exists = fs.existsSync(file);
    if (exists) return;

    console.log("Creating DB file.");
    fs.openSync(file, "w");
    
    var db = new sqlite3.Database(file);

    db.serialize(function() {
        db.run("CREATE TABLE temps (timestamp DATETIME, temp NUMERIC)");      
    });

    db.close();
}


function getTemperature(callback) {
    var child = exec("cat /sys/bus/w1/devices/" + deviceId + "/w1_slave", function (error, stdout, stderr) {
        var tempData = stdout.toString().split('\n')[1];
        var temp = parseInt(tempData.split("=")[1]) / 1000;
        callback(temp);
    });
}

app.listen(port);
