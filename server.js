var express = require("express");
var mustacheExpress = require('mustache-express');
var rpiTemp = require('rpi-temp-module');
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
    rpiTemp.getTemperature(deviceId, function (temp) {
        response.render("index", {
            temperature: temp
        });
    });
});

app.get("/temperature", function (request, response) {
    rpiTemp.getTemperature(deviceId, function (temp) {
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
    db.all("SELECT * FROM temps WHERE timestamp>datetime('now','-"+interval+" hours')", function(err, rows) {         response.render("history", {
            data: rows,
            is24: interval == "24",
	    is6:  interval == "6",
            is12: interval == "12",
            is168: interval == "168",
            is720: interval == "720"
        });
    });    
    db.close();    
});

app.get("/measure", function (request, response) {
    ensureDbExists(file);    

    rpiTemp.getTemperature(deviceId, function (temp) {
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

app.listen(port);
