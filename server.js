var express = require("express");
var mustacheExpress = require('mustache-express');
var exec = require("child_process").exec;
var fs = require("fs");
var Synergykit = require("synergykit");

var config = JSON.parse(fs.readFileSync("config.json"));
var deviceId = config.deviceId;
var port = config.port;

Synergykit.Init(config.synergyKitAppUrl, config.synergyKitKey, {
    debug: true // You should set it to false in production
});

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
    
});

app.get("/measure", function (request, response) {

    getTemperature(function (temp) {
        var record = Synergykit.Data("Temperature");
	record.set("Timestamp", new Date().getTime());
	record.set("Value", temp);

	record.save({
    success: function(spaceShip, statusCode) {
        // Your implementation after the space ship is saved
      	response.send("ok: "+temp.toString());
    },
    error: function(error, statusCode) {
        response.send("fail");
    }
});

       
    });
});

function getTemperature(callback) {
    var child = exec("cat /sys/bus/w1/devices/" + deviceId + "/w1_slave", function (error, stdout, stderr) {
        var tempData = stdout.toString().split('\n')[1];
        var temp = parseInt(tempData.split("=")[1]) / 1000;
        callback(temp);
    });
}

app.listen(port);
